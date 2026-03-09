'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { importSongs } from '@/data/importSongs';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const MAJOR_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const MINOR_KEYS = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'];

function getUploadDate(id: string) {
  const parts = id.split('-');
  if (parts.length >= 2) {
    const timestamp = parseInt(parts[1]);
    if (!isNaN(timestamp) && timestamp > 1600000000000) {
      const d = new Date(timestamp);
      return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    }
  }
  return '近期建檔';
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // 🌟 新增：獨立控制「要看說明」還是「要看列表」的開關
  const [showMode, setShowMode] = useState<'instructions' | 'list'>('instructions');

  const router = useRouter();

  // 👇 👇 👇 👇 👇 👇 👇 👇 👇 👇 👇
  // 🚨 站長專屬解鎖：請把下面引號裡的字，換成你登入用的真實 Google 信箱！
  const adminEmail = "coolcrow0403@gmail.com"; 
  // 👆 👆 👆 👆 👆 👆 👆 👆 👆 👆 👆
  
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "songs"));
      if (querySnapshot.empty) {
        for (const song of initialSongList) {
          await setDoc(doc(db, "songs", song.id), song);
        }
        setSongs(initialSongList);
      } else {
        const songsData: Song[] = [];
        querySnapshot.forEach((doc) => songsData.push(doc.data() as Song));
        songsData.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant', { numeric: true }));
        setSongs(songsData);
      }
    } catch (error) {
      console.error("讀取資料失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { alert("登入失敗，請重試！"); }
  };
  const handleLogout = async () => { await signOut(auth); };

  const handleCreateNewSong = () => {
    if (!user) { alert("請先登入才能新增詩歌喔！"); return; }
    router.push(`/song/new`);
  };

  const handleBatchImport = async () => {
    if (!isAdmin) { alert("⛔ 權限不足！只有站長可以執行批次匯入喔！\n請確認你已在程式碼填入正確信箱。"); return; }
    const firstSongTitle = importSongs.length > 0 ? importSongs[0].title : "未知歌曲";
    if (!confirm(`準備好施展魔法了嗎？\n\n系統偵測到準備匯入：\n「${firstSongTitle}」... 等共 ${importSongs.length} 首歌。\n\n確定要寫入雲端嗎？`)) return;
    setIsImporting(true);
    try {
      let count = 0;
      for (const song of importSongs) {
        const newId = `imported-${Date.now()}-${count}`;
        const newSong: Song = { id: newId, title: song.title, originalKey: song.originalKey, timeSignature: song.timeSignature || "4/4", editor: song.editor, content: song.content, ownerId: user.uid, ownerEmail: user.email || "" };
        await setDoc(doc(db, "songs", newId), newSong);
        count++;
      }
      alert(`🎉 成功匯入了 ${count} 首詩歌！`);
      await fetchSongs(); 
    } catch (error) {
      console.error(error);
      alert("匯入失敗，請看終端機錯誤訊息！");
    } finally {
      setIsImporting(false);
    }
  };

  // 搜尋邏輯：只要打字，就自動切換到列表模式
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== "") setShowMode('list');
  };

  // 點擊調性邏輯：只要點了任何按鈕（包含全部），就切換到列表模式
  const handleKeySelect = (key: string | null) => {
    setSelectedKey(key);
    setShowMode('list');
  };

  const filteredSongs = songs.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKey = selectedKey ? song.originalKey === selectedKey : true;
    return matchSearch && matchKey;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-stone-400 bg-[#FDFBF7] tracking-widest">載入中...</div>;

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-stone-200">
      
      {/* 頂部導覽 */}
      {/* 頂部導覽 */}
      <nav className="flex justify-between items-center max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-stone-800">
            老詩歌<span className="text-stone-400 font-light">吉他譜</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* 🌟 新增的聯絡站長按鈕 */}
          <a 
            href="mailto:你的信箱@gmail.com?subject=老詩歌吉他譜-問題與回饋" 
            className="text-sm font-medium text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-1"
          >
            ✉️ 聯絡站長
          </a>

          <div className="w-px h-4 bg-stone-300"></div>

          {user ? (
            <div className="flex items-center gap-4 text-sm font-medium text-stone-600">
              <span>{user.displayName}</span>
              <button onClick={handleLogout} className="hover:text-stone-900 transition-colors">登出</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">登入編輯</button>
          )}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-6 pb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-stone-700 mb-8 tracking-wide">尋找那一首感動你的旋律</h2>
        
        <div className="relative mb-8 max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="輸入歌名找譜..." 
            value={searchQuery} 
            onChange={handleSearch} 
            className="w-full px-8 py-4 rounded-full bg-white border border-stone-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all placeholder:text-stone-300" 
          />
        </div>

        {/* 🌟 頂部操作按鈕區 (排版說明、寫新歌、匯入) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setShowMode('instructions')} 
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${showMode === 'instructions' ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'}`}
          >
            📖 首頁 / 排版說明
          </button>
          
          {user && (
            <button onClick={handleCreateNewSong} className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm font-medium transition-all flex items-center gap-2">
              ＋ 寫新歌
            </button>
          )}

          {isAdmin && importSongs.length > 0 && (
            <button onClick={handleBatchImport} disabled={isImporting} className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2">
              {isImporting ? "⏳ 匯入中..." : `🚀 批次匯入 (${importSongs.length})`}
            </button>
          )}
        </div>

        {/* 🌟 獨立的調性篩選區 (全部、C、D...) */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-white p-2 rounded-3xl border border-stone-100 shadow-sm inline-flex mx-auto">
          <button 
            onClick={() => handleKeySelect(null)} 
            className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === null ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            全部詩歌
          </button>
          
          <div className="w-px h-6 bg-stone-200 mx-1"></div>
          
          {MAJOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === key ? 'bg-stone-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50'}`}>
              {key}
            </button>
          ))}
          
          <div className="w-px h-6 bg-stone-200 mx-1"></div>
          
          {MINOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === key ? 'bg-stone-500 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-50'}`}>
              {key}
            </button>
          ))}
        </div>
      </section>

      {/* 條件渲染區：依照 showMode 決定要秀什麼 */}
      {showMode === 'list' ? (
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="mb-6 flex justify-between items-end border-b border-stone-200 pb-2">
            <span className="text-stone-500 text-sm tracking-widest">
              {selectedKey ? `調性：${selectedKey}` : '所有詩歌'} · 共 {filteredSongs.length} 首
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <Link href={`/song/${song.id}`} key={song.id} className="group block">
                  <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-medium text-stone-800 group-hover:text-stone-600 transition-colors pr-4 leading-tight">{song.title}</h3>
                      <span className="text-stone-400 text-xs font-mono border border-stone-200 px-2 py-1 rounded-md shrink-0">{song.originalKey}</span>
                    </div>
                    <div className="mt-auto pt-6 flex justify-between items-center text-xs text-stone-400">
                      <span className="bg-stone-50 px-2 py-1 rounded">編：{song.editor}</span>
                      <span className="font-mono">{getUploadDate(song.id)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-stone-400">
                <p className="text-4xl mb-4">🍃</p>
                <p>找不到符合條件的詩歌</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-6 pb-20">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-100 shadow-sm text-stone-600 leading-relaxed relative overflow-hidden">
            <h3 className="text-xl font-medium text-stone-800 mb-6 flex items-center gap-3">
              <span className="text-2xl">📝</span> 站長私房排版秘笈
            </h3>
            <div className="space-y-6 text-sm md:text-base relative z-10">
              <div>
                <strong className="block text-stone-800 mb-1">1. 和弦怎麼標？</strong>
                <p>將和弦用中括號包起來，緊貼在歌詞前方。例如：<code className="bg-stone-50 border border-stone-200 px-2 py-1 rounded mx-1 text-stone-700">[C]舉目仰望 [G]仰望耶穌</code></p>
              </div>
              <hr className="border-stone-100" />
              <div>
                <strong className="block text-stone-800 mb-1">2. 想讓歌詞退後、留白對齊？</strong>
                <p>直接在歌詞裡按「空白鍵」！系統會完美保留所有的空白距離。例如：<br/><code className="bg-stone-50 border border-stone-200 px-2 py-1 rounded mt-2 inline-block text-stone-700">&nbsp;&nbsp;&nbsp;&nbsp;[C]這是一句退後的歌詞</code></p>
              </div>
              <hr className="border-stone-100" />
              <div>
                <strong className="block text-stone-800 mb-1">3. 如何加上「小節線」？</strong>
                <p className="mb-2">👉 如果想放在<strong className="mx-1">和弦那一行</strong>，請將直線包起來：<code className="bg-stone-50 border border-stone-200 px-2 py-1 rounded mx-1 text-stone-700">[|] [C]舉目 [G]仰望 [|]</code></p>
                <p>👉 如果想放在<strong className="mx-1">歌詞那一行</strong>，直接打直線即可：<code className="bg-stone-50 border border-stone-200 px-2 py-1 rounded mx-1 text-stone-700">｜ [C]舉目 [G]仰望 ｜</code></p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-[150px] opacity-5 select-none pointer-events-none">🎸</div>
          </div>
        </div>
      )}
    </main>
  );
}