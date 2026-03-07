'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const MAJOR_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  const router = useRouter();

  // 1. 監聽登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. 只抓取歌單 (絕對不會去抓舊的 Logo)
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

  // 3. 登入與登出
  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { alert("登入失敗，請重試！"); }
  };
  const handleLogout = async () => { await signOut(auth); };

  // 4. 新增歌曲
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-500">雲端歌單載入中...</div>;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 text-gray-800">
      
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          
          {/* 🌟 你的專屬烏鴉 Logo 圖片 */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md overflow-hidden bg-blue-50 border-2 border-white">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">老詩歌吉他譜</h1>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-gray-600 font-medium">嗨，{user.displayName}</span>
              <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">登出</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2">
              Google 登入
            </button>
          )}
        </div>
      </header>

      {/* 搜尋與 7 大調分類 */}
      <div className="mb-8">
        <input type="text" placeholder="🔍 搜尋詩歌名稱..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-400 mb-3 tracking-widest uppercase">以原調分類</h2>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          <button onClick={() => setSelectedKey(null)} className={`py-3 rounded-xl font-bold text-lg transition-all ${selectedKey === null ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}>All</button>
          {MAJOR_KEYS.map(key => (
            <button key={key} onClick={() => setSelectedKey(key)} className={`py-3 rounded-xl font-bold text-lg transition-all ${selectedKey === key ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>{key}</button>
          ))}
        </div>
      </div>

      {/* 歌曲清單 */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-gray-800">{selectedKey ? `${selectedKey} 調詩歌` : '全部詩歌'} ({filteredSongs.length})</h2>
        {user && <button onClick={handleCreateNewSong} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow">＋ 新增</button>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {filteredSongs.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredSongs.map((song) => (
              <li key={song.id}>
                <Link href={`/song/${song.id}`} className="flex items-center justify-between p-5 hover:bg-blue-50 transition-colors group cursor-pointer block">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 mb-1">{song.title}</h3>
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">Key: {song.originalKey}</span>
                        {song.editor && <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-100">{song.editor}</span>}
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-500 text-2xl font-light">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-gray-500 font-medium">找不到符合條件的詩歌 😢</div>
        )}
      </div>
    </main>
  );
}