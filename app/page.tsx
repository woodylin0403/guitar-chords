'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const router = useRouter();

  // 網頁載入時，從 LocalStorage 讀取資料
  useEffect(() => {
    const saved = localStorage.getItem('guitar_songs');
    if (saved) {
      setSongs(JSON.parse(saved));
    } else {
      // 如果是第一次打開，載入預設歌曲並存起來
      setSongs(initialSongList);
      localStorage.setItem('guitar_songs', JSON.stringify(initialSongList));
    }
  }, []);

  // 新增空白歌曲的函數
  const handleCreateNewSong = () => {
    const newId = `song-${Date.now()}`; // 用時間戳記產生獨一無二的網址 ID
    const newSong: Song = {
      id: newId,
      title: "新詩歌 (請點擊進入編輯)",
      originalKey: "C",
      editor: "",
      content: "C\n請在此輸入歌詞與和弦..."
    };
    
    const updatedSongs = [...songs, newSong];
    setSongs(updatedSongs);
    localStorage.setItem('guitar_songs', JSON.stringify(updatedSongs));
    
    // 建立後直接跳轉到該歌曲的頁面
    router.push(`/song/${newId}`);
  };

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto bg-gray-50 text-gray-800">
      
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          老詩歌吉他譜
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          數位化、可轉調、完美對齊的手機友善樂譜
        </p>
        
        {/* 新增歌曲大按鈕 */}
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
                  <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-300 w-8 text-right">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 mb-1">
                      {song.title}
                    </h2>
                    <div className="flex gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
                        原調：{song.originalKey}
                      </span>
                      {song.editor && (
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100">
                          編輯：{song.editor}
                        </span>
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