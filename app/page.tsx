'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { importSongs } from '@/data/importSongs';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const MAJOR_KEYS = [
  { note: 'C', color: 'bg-sky-400 text-gray-950' },
  { note: 'D', color: 'bg-green-400 text-gray-950' },
  { note: 'E', color: 'bg-yellow-400 text-gray-950' },
  { note: 'F', color: 'bg-orange-400 text-white' },
  { note: 'G', color: 'bg-rose-400 text-white' },
  { note: 'A', color: 'bg-purple-400 text-white' },
  { note: 'B', color: 'bg-pink-400 text-white' },
];

const MINOR_KEYS = [
  { note: 'Cm', color: 'bg-sky-100 text-sky-900' },
  { note: 'Dm', color: 'bg-green-100 text-green-900' },
  { note: 'Em', color: 'bg-yellow-100 text-yellow-900' },
  { note: 'Fm', color: 'bg-orange-100 text-orange-900' },
  { note: 'Gm', color: 'bg-rose-100 text-rose-900' },
  { note: 'Am', color: 'bg-purple-100 text-purple-900' },
  { note: 'Bm', color: 'bg-pink-100 text-pink-900' },
];

function getUploadDate(id: string) {
  const parts = id.split('-');
  if (parts.length >= 2) {
    const timestamp = parseInt(parts[1]);
    if (!isNaN(timestamp) && timestamp > 1600000000000) {
      const d = new Date(timestamp);
      return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    }
  }
  return '早期建檔';
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const router = useRouter();

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

  const handleCreateNewSong = async () => {
    if (!user) { alert("請先登入才能新增詩歌喔！"); return; }
    const newId = `song-${Date.now()}`; 
    const newSong: Song = {
      id: newId, 
      title: "新詩歌 (請點擊進入編輯)", 
      originalKey: "C",
      timeSignature: "4/4",
      editor: user.displayName || "烏鴉Lin", 
      content: "[C]請在此輸入歌詞與和弦...",
      ownerId: user.uid, 
      ownerEmail: user.email || ""
    };
    await setDoc(doc(db, "songs", newId), newSong);
    router.push(`/song/${newId}`);
  };

  const handleBatchImport = async () => {
    if (!user) { alert("請先登入才能匯入喔！"); return; }
    
    // 🌟 在按下按鈕後的確認視窗，再次提醒即將匯入的內容
    const firstSongTitle = importSongs.length > 0 ? importSongs[0].title : "未知歌曲";
    if (!confirm(`準備好施展魔法了嗎？\n\n系統偵測到準備匯入：\n「${firstSongTitle}」... 等共 ${importSongs.length} 首歌。\n\n確定要寫入雲端嗎？`)) return;
    
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
      alert(`🎉 太神啦！成功匯入了 ${count} 首詩歌！`);
      await fetchSongs(); 
    } catch (error) {
      console.error(error);
      alert("匯入失敗，請看終端機錯誤訊息！");
    } finally {
      setIsImporting(false);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKey = selectedKey ? song.originalKey === selectedKey : true;
    return matchSearch && matchKey;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-2xl md:text-3xl font-black text-gray-500 bg-[#FFDE69]">雲端載入中...</div>;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      <div className="bg-gradient-to-br from-cyan-400 via-sky-300 to-white pt-8 pb-10 md:pt-10 md:pb-12 px-4 md:px-8 border-b-4 border-gray-950 shadow-[0_4px_0_rgba(0,0,0,1)] md:shadow-[0_8px_0_rgba(0,0,0,1)]">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 max-w-7xl mx-auto gap-5 md:gap-0">
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center md:text-left">
            <div className="w-20 h-20 md:w-16 md:h-16 rounded-3xl flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,1)] overflow-hidden bg-white border-4 border-gray-950 shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 mt-1 md:mt-0">
                <span className="text-gray-950">老詩歌</span><span className="text-orange-600">吉他譜</span>
              </h1>
              <p className="text-gray-700 text-sm md:text-lg font-medium mt-1">✨ 為青年復興而生的數位樂譜</p>
            </div>
          </div>
          
          <div className="mt-2 md:mt-0 w-full md:w-auto flex justify-center">
            {user ? (
              <div className="flex items-center gap-3 md:gap-4 p-2 bg-white rounded-full border-2 border-gray-950 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <span className="text-gray-950 font-bold px-3 text-sm md:text-base">🤘 {user.displayName}</span>
                <button onClick={handleLogout} className="text-xs font-black text-gray-500 hover:text-red-500 transition-colors bg-gray-100 p-2 rounded-full">登出</button>
              </div>
            ) : (
               <button onClick={handleLogin} className="w-full md:w-auto justify-center bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-6 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-gray-950 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#FFFFFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FFFFFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#FFFFFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google 登入
              </button>
            )}
          </div>
        </header>

        <div className="max-w-3xl mx-auto relative z-10 w-full">
          <input 
            type="text" 
            placeholder="🔍 輸入歌名找譜！" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full px-5 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl border-4 border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_rgba(0,0,0,1)] text-base md:text-xl font-bold focus:outline-none focus:ring-4 focus:ring-sky-400 placeholder:text-gray-400 placeholder:font-medium transition-all" 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16 bg-gray-50">
        
        <div className="mb-10 md:mb-14 p-5 md:p-8 bg-white rounded-3xl border-4 border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)] md:shadow-[6px_6px_0_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <h2 className="text-lg md:text-xl font-black text-gray-950 tracking-wide flex items-center gap-2">
              <span className="text-2xl md:text-3xl">🎯</span> 依據原調分類
            </h2>
            <button 
              onClick={() => setSelectedKey(null)} 
              className={`px-6 py-2 rounded-2xl font-black text-base transition-all border-2 border-gray-950 self-start md:self-auto ${selectedKey === null ? 'bg-gray-950 text-white shadow-none' : 'bg-white text-gray-600 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5'}`}
            >
              All 全部顯示
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">大調 Major</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {MAJOR_KEYS.map(key => (
                  <button 
                    key={key.note} 
                    onClick={() => setSelectedKey(key.note)} 
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 border-2 border-gray-950 ${selectedKey === key.note ? key.color + ' shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'bg-white text-gray-700 shadow-[2px_2px_0_rgba(0,0,0,1)]'}`}
                  >
                    {key.note}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">小調 Minor</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {MINOR_KEYS.map(key => (
                  <button 
                    key={key.note} 
                    onClick={() => setSelectedKey(key.note)} 
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0 border-2 border-gray-950 ${selectedKey === key.note ? key.color + ' shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'bg-white text-gray-600 shadow-[2px_2px_0_rgba(0,0,0,1)]'}`}
                  >
                    {key.note}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <span className="text-sky-500">
              {selectedKey ? `${selectedKey} 調` : 'All'}
            </span>
            <span>詩歌</span>
            <span className="text-xs md:text-sm font-medium text-gray-400 bg-gray-100 p-1.5 md:p-2 rounded-full border border-gray-200">共 {filteredSongs.length} 首</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-start sm:items-center">
            
            {/* 🌟 匯入預覽雷達區塊 */}
            {user && importSongs && importSongs.length > 0 && (
              <div className="hidden lg:flex items-center text-sm font-bold text-gray-600 bg-white px-4 py-2.5 rounded-2xl border-2 border-dashed border-gray-300 shadow-[2px_2px_0_rgba(0,0,0,0.05)]">
                📌 暫存區：{importSongs[0].title} ...等 {importSongs.length} 首
              </div>
            )}

            {user && (
              <button 
                onClick={handleBatchImport} 
                disabled={isImporting}
                className="w-full sm:w-auto justify-center bg-purple-500 hover:bg-purple-600 text-white font-black py-3 px-4 md:px-6 rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-gray-950 transition-all flex items-center gap-2 text-base md:text-xl shrink-0"
              >
                {isImporting ? "⌛ 匯入中..." : "🚀 批次匯入"}
              </button>
            )}

            {user && (
              <button 
                onClick={handleCreateNewSong} 
                className="w-full sm:w-auto justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black py-3 px-6 md:px-8 rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-gray-950 transition-all flex items-center gap-2 text-lg md:text-xl shrink-0"
              >
                ＋ 我要寫新歌
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-h-[300px]">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <li key={song.id} className="list-none">
                <Link href={`/song/${song.id}`} className="group block h-full">
                  <div className="bg-white p-5 md:p-6 h-full rounded-2xl md:rounded-3xl border-2 border-gray-100 shadow-[2px_2px_15px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:border-gray-950 group-hover:shadow-[4px_4px_0_#FFDE69] relative overflow-hidden flex flex-col">
                    
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 group-hover:text-gray-950 tracking-tight leading-tight flex-1 pr-2">
                        {song.title}
                      </h3>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-white group-hover:text-gray-950 bg-gray-950 group-hover:bg-[#FFDE69] text-xs md:text-sm px-2 py-1 md:px-3 rounded-full font-black border-2 border-gray-950 transition-all">
                          Key: {song.originalKey}
                        </span>
                        {song.timeSignature && (
                          <span className="text-gray-950 bg-gray-100 group-hover:bg-white text-xs px-2 py-1 rounded-lg font-bold border-2 border-gray-950 transition-all flex items-center gap-1 shadow-[1px_1px_0_rgba(0,0,0,1)]">
                            ⏱ {song.timeSignature}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-2">
                      <div className="flex flex-wrap items-center gap-2 z-10">
                        {song.editor && (
                          <span className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-green-50 text-green-800 text-[10px] md:text-xs font-bold rounded-lg border border-green-100">
                            ✏️ {song.editor}
                          </span>
                        )}
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-wide">
                          📅 {getUploadDate(song.id)}
                        </span>
                      </div>
                      <span className="text-sky-500 group-hover:text-gray-950 text-3xl md:text-4xl font-black transition-transform ml-auto z-10">→</span>
                    </div>
                    
                    <div className="absolute top-[-20px] right-[-20px] text-[100px] md:text-[150px] font-black text-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity select-none pointer-events-none">🎸</div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <div className="col-span-full p-10 md:p-20 text-center bg-white rounded-3xl border-4 border-gray-950 border-dashed shadow-[4px_4px_0_rgba(0,0,0,1)]">
              <p className="text-5xl md:text-7xl mb-4 md:mb-6">🏜️</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 mb-2">這裡目前一片荒蕪...</p>
              <p className="text-sm md:text-base text-gray-500 font-medium">趕快搜尋別的調，或是登入來建立新詩歌吧！</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}