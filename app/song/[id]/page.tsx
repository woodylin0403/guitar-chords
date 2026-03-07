'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// 簡化後的 7 大調
const MAJOR_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 新增狀態：登入的使用者、搜尋字串、選擇的調性
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  const router = useRouter();

  // 監聽使用者登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 從 Firebase 讀取歌單
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
        console.error("讀取資料庫失敗：", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // 登入與登出功能
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("登入失敗", error);
      alert("登入失敗，請重試！");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 新增空白歌曲 (現在會綁定建立者的 ID 囉！)
  const handleCreateNewSong = async () => {
    if (!user) {
      alert("請先登入才能新增詩歌喔！");
      return;
    }

    const newId = `song-${Date.now()}`; 
    const newSong: Song = {
      id: newId,
      title: "新詩歌 (請點擊進入編輯)",
      originalKey: "C",
      editor: user.displayName || "匿名", // 自動帶入 Google 名字
      content: "C\n請在此輸入歌詞與和弦...",
      ownerId: user.uid, // 綁定這首歌的主人
      ownerEmail: user.email || ""
    };
    
    await setDoc(doc(db, "songs", newId), newSong);
    router.push(`/song/${newId}`);
  };

  // 搜尋與調性過濾邏輯
  const filteredSongs = songs.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    // 如果有選調性，就只顯示符合該調性（或該調性的升降記號，例如選 C 也顯示 C#）的歌
    const matchKey = selectedKey ? song.originalKey.startsWith(selectedKey) : true;
    return matchSearch && matchKey;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-500">雲端歌單載入中...</div>;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 text-gray-800">
      
      {/* 頂部導覽列：Logo 與 登入按鈕 */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          {/* 你可以在這裡把 🎸 換成你的專屬 Logo 圖片 `<img src="..." />` */}
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
            🎸
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
            <button onClick={handleLogin} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google 登入
            </button>
          )}
        </div>
      </header>

      {/* 搜尋列 */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="🔍 搜尋詩歌名稱..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 7 大調分類方塊 */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-400 mb-3 tracking-widest uppercase">以原調分類</h2>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          <button 
            onClick={() => setSelectedKey(null)}
            className={`py-3 rounded-xl font-bold text-lg transition-all ${selectedKey === null ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
          >
            All
          </button>
          {MAJOR_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`py-3 rounded-xl font-bold text-lg transition-all ${selectedKey === key ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* 歌曲清單與新增按鈕 */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedKey ? `${selectedKey} 調詩歌` : '全部詩歌'} ({filteredSongs.length})
        </h2>
        {user && (
          <button onClick={handleCreateNewSong} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors">
            ＋ 新增
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {filteredSongs.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredSongs.map((song) => (
              <li key={song.id}>
                <Link href={`/song/${song.id}`} className="flex items-center justify-between p-5 hover:bg-blue-50 transition-colors group">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 mb-1">{song.title}</h3>
                    <div className="flex gap-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">Key: {song.originalKey}</span>
                      {song.editor && <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-100">{song.editor}</span>}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-500 text-2xl font-light">→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-gray-500 font-medium">
            找不到符合條件的詩歌 😢
          </div>
        )}
      </div>
    </main>
  );
}