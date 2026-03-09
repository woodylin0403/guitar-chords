'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { importSongs } from '@/data/importSongs';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
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
  const [showMode, setShowMode] = useState<'instructions' | 'list'>('instructions');
  
  // ✅ 新增：用來儲存被選取的歌曲 ID 列表
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const router = useRouter();

  const adminEmail = "coolcrow0403@gmail.com"; 
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

  useEffect(() => { fetchSongs(); }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { alert("登入失敗！"); }
  };
  const handleLogout = async () => { await signOut(auth); };

  const handleCreateNewSong = () => {
    if (!user) { alert("請先登入！"); return; }
    router.push(`/song/new`);
  };

  const handleBatchImport = async () => {
    if (!isAdmin) return;
    const firstSongTitle = importSongs.length > 0 ? importSongs[0].title : "未知";
    if (!confirm(`準備匯入「${firstSongTitle}」等共 ${importSongs.length} 首歌？`)) return;
    setIsImporting(true);
    try {
      let count = 0;
      for (const song of importSongs) {
        const newId = `imported-${Date.now()}-${count}`;
        const newSong: Song = { 
          id: newId, 
          title: song.title, 
          originalKey: song.originalKey, 
          timeSignature: song.timeSignature || "4/4", 
          editor: song.editor, 
          content: song.content, 
          ownerId: user.uid, 
          ownerEmail: user.email || "" 
        };
        await setDoc(doc(db, "songs", newId), newSong);
        count++;
      }
      alert(`🎉 成功匯入了 ${count} 首！`);
      await fetchSongs(); 
    } catch (error) {
      alert("匯入失敗！");
    } finally {
      setIsImporting(false);
    }
  };

  // ✅ 單一刪除功能
  const handleDeleteSong = async (songId: string, songEditor: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (songEditor !== "烏鴉Lin" && !isAdmin) {
      alert("您只能刪除自己上傳的樂譜喔！");
      return;
    }

    if (window.confirm("確定要刪除這首樂譜嗎？此動作無法復原。")) {
      try {
        await deleteDoc(doc(db, "songs", songId));
        setSelectedSongs(prev => prev.filter(id => id !== songId)); // 從選取清單移除
        await fetchSongs(); 
      } catch (error) {
        console.error("刪除失敗: ", error);
        alert("刪除時發生錯誤");
      }
    }
  };

  // ✅ 批次刪除功能
  const handleBatchDelete = async () => {
    if (selectedSongs.length === 0) return;
    if (!window.confirm(`確定要一口氣刪除選取的 ${selectedSongs.length} 首樂譜嗎？此動作無法復原。`)) return;

    try {
      // 迴圈執行刪除
      for (const id of selectedSongs) {
        await deleteDoc(doc(db, "songs", id));
      }
      alert(`成功刪除 ${selectedSongs.length} 首樂譜！`);
      setSelectedSongs([]); // 清空打勾狀態
      await fetchSongs();   // 重新抓取資料
    } catch (error) {
      console.error("批次刪除失敗: ", error);
      alert("批次刪除時發生錯誤");
    }
  };

  // ✅ 處理打勾/取消打勾
  const toggleSelection = (e: React.MouseEvent, songId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) // 如果已經有，就移除
        : [...prev, songId]                // 如果沒有，就加入
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== "") setShowMode('list');
  };

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
          <a href="mailto:coolcrow0403@gmail.com?subject=老詩歌吉他譜-回饋" className="text-sm font-medium text-stone-400 hover:text-stone-800 transition-colors">✉️ 聯絡站長</a>
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

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setShowMode('instructions')} 
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${showMode === 'instructions' ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'}`}
          >
            📖 首頁 / 編輯教學
          </button>
          
          {user && (
            <button onClick={handleCreateNewSong} className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm font-medium transition-all">
              ＋ 新增詩歌
            </button>
          )}

          {isAdmin && importSongs.length > 0 && (
            <button onClick={handleBatchImport} disabled={isImporting} className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-full text-sm font-medium transition-all shadow-md">
              {isImporting ? "⏳ 匯入中..." : `🚀 批次匯入 (${importSongs.length})`}
            </button>
          )}

          {/* ✅ 批次刪除按鈕 (有選取歌曲時才會出現) */}
          {selectedSongs.length > 0 && (
            <button 
              onClick={handleBatchDelete} 
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-all shadow-md"
            >
              🗑️ 刪除已選 ({selectedSongs.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-white p-2 rounded-3xl border border-stone-100 shadow-sm inline-flex mx-auto">
          <button onClick={() => handleKeySelect(null)} className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === null ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-50'}`}>全部詩歌</button>
          <div className="w-px h-6 bg-stone-200 mx-1"></div>
          {MAJOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === key ? 'bg-stone-600 text-white' : 'text-stone-600 hover:bg-stone-50'}`}>{key}</button>
          ))}
          <div className="w-px h-6 bg-stone-200 mx-1"></div>
          {MINOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${showMode === 'list' && selectedKey === key ? 'bg-stone-500 text-white' : 'text-stone-500 hover:bg-stone-50'}`}>{key}</button>
          ))}
        </div>
      </section>

      {showMode === 'list' ? (
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="mb-6 flex justify-between items-end border-b border-stone-200 pb-2">
            <span className="text-stone-500 text-sm tracking-widest">{selectedKey ? `調性：${selectedKey}` : '所有詩歌'} · 共 {filteredSongs.length} 首</span>
            
            {/* 快速全選按鈕 (選用功能，可以方便一鍵清空當前篩選的項目) */}
            {filteredSongs.length > 0 && (user?.displayName === "烏鴉Lin" || isAdmin) && (
              <button 
                onClick={() => {
                  const allVisibleIds = filteredSongs.filter(s => s.editor === "烏鴉Lin" || isAdmin).map(s => s.id);
                  if (selectedSongs.length === allVisibleIds.length) {
                    setSelectedSongs([]); // 取消全選
                  } else {
                    setSelectedSongs(allVisibleIds); // 全選
                  }
                }}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                {selectedSongs.length === filteredSongs.length && filteredSongs.length > 0 ? "取消全選" : "全選本頁"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => {
                const canEdit = user?.displayName === "烏鴉Lin" || isAdmin || song.editor === "烏鴉Lin";
                const isSelected = selectedSongs.includes(song.id);

                return (
                  <Link href={`/song/${song.id}`} key={song.id} className="group block">
                    <div className={`bg-white p-6 rounded-2xl border ${isSelected ? 'border-red-400 shadow-md ring-1 ring-red-400' : 'border-stone-100 shadow-sm hover:shadow-md'} transition-all h-full flex flex-col relative`}>
                      
                      {/* ✅ 獨立的核取方塊區塊 */}
                      {canEdit && (
                        <div 
                          onClick={(e) => toggleSelection(e, song.id)}
                          className="absolute top-4 right-4 z-10 bg-white/80 p-1.5 rounded-md cursor-pointer hover:bg-stone-100 transition-colors"
                          title="選取以批次刪除"
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            className="w-5 h-5 cursor-pointer accent-red-500"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4 pr-10">
                        <h3 className="text-xl font-medium text-stone-800 group-hover:text-stone-600 transition-colors leading-tight">{song.title}</h3>
                        <span className="text-stone-400 text-xs font-mono border border-stone-200 px-2 py-1 rounded-md shrink-0 ml-2">{song.originalKey}</span>
                      </div>
                      
                      <div className="mt-auto pt-6 flex justify-between items-center text-xs text-stone-400 pr-10">
                        <span className="bg-stone-50 px-2 py-1 rounded">編：{song.editor}</span>
                        <span className="font-mono">{getUploadDate(song.id)}</span>
                      </div>

                      {/* ✅ 單一刪除按鈕 (保留供習慣單筆刪除的操作) */}
                      {canEdit && (
                        <button 
                          onClick={(e) => handleDeleteSong(song.id, song.editor, e)}
                          className="absolute bottom-6 right-4 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="單獨刪除此樂譜"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center text-stone-400">找不到符合條件的詩歌</div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-100 shadow-sm text-stone-600 leading-relaxed relative overflow-hidden">
            <h3 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-3 relative z-10">
              <span className="text-3xl">📝</span> 樂譜排版秘笈
            </h3>
            <p className="mb-8 text-stone-500 relative z-10">系統支援兩種編譜方式，你可以自由選擇最習慣的方法：</p>
            
            <div className="space-y-8 text-sm md:text-base relative z-10">
              
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <strong className="block text-lg text-stone-800 mb-2">方式一：傳統文件排版 (純文字對齊)</strong>
                <p className="mb-4">就像在 Word 或記事本裡打字一樣，把和弦打在第一行，歌詞打在第二行。系統會完美保留你按的所有「空白鍵」，不用擔心跑版！</p>
                <div className="bg-white border border-stone-200 p-4 rounded-xl font-mono text-stone-700 overflow-x-auto shadow-sm">
                  <p>| &nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bm &nbsp;&nbsp;&nbsp;&nbsp;|</p>
                  <p>&nbsp;&nbsp;舉目仰望 仰望耶穌</p>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                <strong className="block text-lg text-stone-800 mb-2">方式二：智能標籤排版 (✨ 推薦使用)</strong>
                <p className="mb-4">將和弦用中括號 <code className="bg-white px-1.5 py-0.5 rounded text-stone-700">[ ]</code> 包起來，緊貼在歌詞前方。系統會自動把和弦浮在歌詞上方，這樣在使用「一鍵轉調」功能時最精準好看！</p>
                <div className="bg-white border border-stone-200 p-4 rounded-xl font-mono text-stone-700 overflow-x-auto shadow-sm">
                  <p>[D]舉目仰望 [A7]仰望耶[Bm]穌</p>
                </div>
              </div>

              <hr className="border-stone-100" />
              
              <div>
                <strong className="block text-stone-800 mb-2">3. 如何標示「小節線」？</strong>
                <p className="mb-4">音樂中的小節線通常只會出現在和弦那一行。你只需要把直線用中括號包起來 <code className="bg-stone-50 border border-stone-200 px-2 py-1 rounded text-stone-700">[|]</code> 即可！</p>
                <div className="bg-white border border-stone-200 p-4 rounded-xl font-mono text-stone-700 overflow-x-auto shadow-sm">
                  <p className="text-stone-400 mb-1">輸入範例：</p>
                  <p>[|] [D]舉目仰望 [A7]仰望耶[Bm]穌 [|]</p>
                </div>
              </div>

            </div>
            
            <div className="absolute -bottom-10 -right-10 text-[180px] opacity-[0.03] select-none pointer-events-none">🎸</div>
          </div>
        </div>
      )}
    </main>
  );
}