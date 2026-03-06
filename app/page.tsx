'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // 引入剛剛寫好的雲端連線

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 新增載入狀態
  const router = useRouter();

  // 網頁載入時，從 Firebase 雲端讀取資料
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        
        if (querySnapshot.empty) {
          // 如果雲端完全沒資料，就把預設的兩首歌自動上傳上去！
          for (const song of initialSongList) {
            await setDoc(doc(db, "songs", song.id), song);
          }
          setSongs(initialSongList);
        } else {
          // 如果雲端有資料，就把它們抓下來顯示
          const songsData: Song[] = [];
          querySnapshot.forEach((doc) => {
            songsData.push(doc.data() as Song);
          });
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

  // 新增空白歌曲到雲端
  const handleCreateNewSong = async () => {
    const newId = `song-${Date.now()}`; 
    const newSong: Song = {
      id: newId,
      title: "新詩歌 (請點擊進入編輯)",
      originalKey: "C",
      editor: "",
      content: "C\n請在此輸入歌詞與和弦..."
    };
    
    // 把新歌寫入 Firebase
    await setDoc(doc(db, "songs", newId), newSong);
    
    // 建立後直接跳轉到該歌曲的頁面
    router.push(`/song/${newId}`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-500">雲端歌單載入中...</div>;
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto bg-gray-50 text-gray-800">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">老詩歌吉他譜</h1>
        <p className="text-lg text-gray-600 mb-8">數位化、可轉調、完美對齊的手機友善樂譜</p>
        <button 
          onClick={handleCreateNewSong}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          ＋ 新增空白曲目
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {songs.map((song, index) => (
            <li key={song.id}>
              <Link href={`/song/${song.id}`} className="flex items-center justify-between p-6 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-300 w-8 text-right">{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 mb-1">{song.title}</h2>
                    <div className="flex gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">原調：{song.originalKey}</span>
                      {song.editor && (
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100">編輯：{song.editor}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-500 text-2xl">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}