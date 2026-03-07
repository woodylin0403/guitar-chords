'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
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

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
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
          setSongs(songsData);
        }
      } catch (error) {
        console.error("讀取資料失敗：", error);
      } finally {
        setIsLoading(false);
      }
    };
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
      id: newId, title: "新詩歌 (請點擊進入編輯)", originalKey: "C",
      editor: user.displayName || "匿名", content: "C\n請在此輸入歌詞與和弦...",
      ownerId: user.uid, ownerEmail: user.email || ""
    };
    await setDoc(doc(db, "songs", newId), newSong);
    router.push(`/song/${newId}`);
  };

  const filteredSongs = songs.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKey = selectedKey ? song.originalKey.startsWith(selectedKey) : true;
    return matchSearch && matchKey;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-3xl font-black text-gray-500 bg-[#FFDE69]">雲端載入中...</div>;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* 🌟 頂部超大漸層 Hero 區塊：把 padding bottom 縮小，讓搜尋列完美包在裡面 */}
      <div className="bg-gradient-to-br from-cyan-400 via-sky-300 to-white pt-10 pb-12 px-4 md:px-8 border-b-4 border-gray-950 shadow-[0_8px_0_rgba(0,0,0,1)]">
        
        <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,1)] overflow-hidden bg-white border-4 border-gray-950 transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all cursor-pointer">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950">
                <span className="text-gray-950">老詩歌</span><span className="text-orange-600">吉他譜</span>
              </h1>
              <p className="text-gray-700 text-lg font-medium">✨ 為青年復興而生的數位樂譜</p>
            </div>
          </div>
          
          <div>
            {user ? (
              <div className="flex items-center gap-4 p-2 bg-white rounded-full border-2 border-gray-950 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <span className="text-gray-950 font-bold px-2">🤘 {user.displayName}</span>
                <button onClick={handleLogout} className="text-xs font-black text-gray-500 hover:text-red-500 transition-colors bg-gray-100 p-2 rounded-full">登出</button>
              </div>
            ) : (
               <button onClick={handleLogin} className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-6 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transform hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 border-2 border-gray-950">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#FFFFFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FFFFFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#FFFFFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google 登入
              </button>
            )}
          </div>
        </header>

        {/* 🌟 拿掉負數的 margin-bottom，讓它穩穩待在藍色區塊裡 */}
        <div className="max-w-3xl mx-auto relative z-10">
          <input 
            type="text" 
            placeholder="🔍 輸入歌名關鍵字... 馬上找譜！" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full px-8 py-5 rounded-3xl border-4 border-gray-950 shadow-[8px_8px_0_rgba(0,0,0,1)] text-xl font-bold focus:outline-none focus:ring-4 focus:ring-sky-400 placeholder:text-gray-400 placeholder:font-medium transition-all" 
          />
        </div>
      </div>

      {/* 🌟 調整下方的 padding-top，讓內容接續得更自然 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-16 bg-gray-50">
        
        <div className="mb-14 p-6 bg-white rounded-3xl border-4 border-gray-950 shadow-[6px_6px_0_rgba(0,0,0,1)]">
          <h2 className="text-lg font-black text-gray-950 mb-5 tracking-wide flex items-center gap-2">
            <span className="text-3xl">🎯</span> 依據原調分類
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            <button 
              onClick={() => setSelectedKey(null)} 
              className={`px-4 py-3 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-1 active:translate-y-0.5 border-2 border-gray-950 ${selectedKey === null ? 'bg-gray-950 text-white shadow-[0px_0px_0_rgba(0,0,0,1)]' : 'bg-white text-gray-600 shadow-[2px_2px_0_rgba(0,0,0,1)] active:shadow-[1px_1px_0_rgba(0,0,0,1)]'}`}
            >
              All 全部
            </button>
            {MAJOR_KEYS.map(key => (
              <button 
                key={key.note} 
                onClick={() => setSelectedKey(key.note)} 
                className={`px-4 py-3 rounded-2xl font-black text-xl transition-all transform hover:-translate-y-1 active:translate-y-0.5 border-2 border-gray-950 shadow-[2px_2px_0_rgba(0,0,0,1)] active:shadow-[1px_1px_0_rgba(0,0,0,1)] ${selectedKey === key.note ? key.color : 'bg-white text-gray-700'}`}
              >
                {key.note}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <span className="text-sky-500">
              {selectedKey ? `${selectedKey} 調` : 'All'}
            </span>
            <span>詩歌</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 p-2 rounded-full border border-gray-200">共 {filteredSongs.length} 首</span>
          </h2>
          {user && (
            <button 
              onClick={handleCreateNewSong} 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black py-3 px-8 rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transform hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 border-2 border-gray-950 text-xl"
            >
              ＋ 我要寫新歌
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <li key={song.id} className="list-none">
                <Link href={`/song/${song.id}`} className="group block h-full">
                  <div className="bg-white p-6 h-full rounded-3xl border-2 border-gray-100 shadow-[2px_2px_15px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:border-gray-950 group-hover:shadow-[6px_6px_0_#FFDE69] group-hover:-translate-y-1 relative overflow-hidden flex flex-col">
                    
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-gray-950 tracking-tight leading-tight flex-1">
                        {song.title}
                      </h3>
                      <span className="text-white group-hover:text-gray-950 bg-gray-950 group-hover:bg-[#FFDE69] text-sm px-3 py-1 rounded-full font-black border-2 border-gray-950 active:scale-105 transition-all ml-4 shrink-0">
                        Key: {song.originalKey}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4">
                      {song.editor && (
                        <span className="inline-block px-3 py-1.5 bg-green-50 text-green-800 text-xs font-bold rounded-lg border border-green-100 z-10">
                          ✏️ {song.editor}
                        </span>
                      )}
                      <span className="text-sky-500 group-hover:text-gray-950 text-4xl font-black group-hover:translate-x-1 transition-transform ml-auto z-10">→</span>
                    </div>
                    
                    <div className="absolute top-[-20px] right-[-20px] text-[150px] font-black text-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity select-none pointer-events-none">🎸</div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <div className="col-span-full p-20 text-center bg-white rounded-3xl border-4 border-gray-950 border-dashed shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <p className="text-7xl mb-6">🏜️</p>
              <p className="text-2xl font-black text-gray-900 mb-2">這裡目前一片荒蕪...</p>
              <p className="text-gray-500 font-medium">趕快搜尋別的調，或是登入來建立你的第一首詩歌吧！</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}