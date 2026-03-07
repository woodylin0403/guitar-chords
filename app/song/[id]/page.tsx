'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Song } from '@/data/songs';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function isChord(str: string) {
  if (!str || str.trim() === '') return false;
  const regex = /^[CDEFGAB][#b]?(m|min|maj|M|dim|aug|sus|add|#|b|\d)*(?:\/[CDEFGAB][#b]?)?$/;
  return regex.test(str);
}

function transposeChord(chord: string, steps: number) {
  if (!chord) return chord;
  const parts = chord.split('/');
  const transposeNote = (note: string) => {
    const match = note.match(/^([CDEFGAB][#b]?)(.*)$/);
    if (!match) return note; 
    const baseNote = match[1];
    const modifier = match[2];
    const currentIndex = NOTES.indexOf(baseNote);
    if (currentIndex === -1) return note;
    let newIndex = (currentIndex + steps) % 12;
    if (newIndex < 0) newIndex += 12;
    return NOTES[newIndex] + modifier;
  };
  return parts.map(transposeNote).join('/');
}

export default function SongPage() {
  const params = useParams();
  const router = useRouter();
  const songId = params.id as string;
  
  const [song, setSong] = useState<Song | null>(null);
  const [targetKey, setTargetKey] = useState("C");
  const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState(22);
  const [isLoading, setIsLoading] = useState(true);

  // 權限與會員狀態
  const [user, setUser] = useState<User | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editKey, setEditKey] = useState("C");
  const [editEditor, setEditEditor] = useState("");
  const [editContent, setEditContent] = useState("");

  // 監聽登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const docRef = doc(db, "songs", songId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const foundSong = docSnap.data() as Song;
          setSong(foundSong);
          setTargetKey(foundSong.originalKey);
          setEditTitle(foundSong.title);
          setEditKey(foundSong.originalKey);
          setEditEditor(foundSong.editor || "");
          setEditContent(foundSong.content);
        } else {
          alert("找不到這首詩歌！");
          router.push('/');
        }
      } catch (error) {
        console.error("讀取失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSong();
  }, [songId, router]);

  const handleSave = async () => {
    if (!song) return;
    const updatedSong = { ...song, title: editTitle, originalKey: editKey, editor: editEditor, content: editContent };
    try {
      await setDoc(doc(db, "songs", song.id), updatedSong);
      setSong(updatedSong);
      setTargetKey(editKey);
      setIsEditing(false);
      alert("儲存成功！");
    } catch (error) {
      console.error("儲存失敗:", error);
      alert("儲存失敗，請重試！");
    }
  };

  const handleDelete = async () => {
    if (confirm("確定要刪除這首歌嗎？刪除後全世界都看不到囉！")) {
      try {
        await deleteDoc(doc(db, "songs", songId));
        router.push('/');
      } catch (error) {
        console.error("刪除失敗:", error);
        alert("刪除失敗，請重試！");
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center text-xl font-bold text-gray-500">雲端讀譜中...</div>;
  if (!song) return null;

  const originalIndex = NOTES.indexOf(song.originalKey);
  const targetIndex = NOTES.indexOf(targetKey);
  const steps = targetIndex - originalIndex;

  const renderPreview = (text: string) => {
    const tokens = text.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～]+)/);
    return (
      <div className="overflow-x-auto pb-6">
        <div className="w-max min-w-full font-mono leading-relaxed text-gray-800 whitespace-pre tracking-wide transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
          {tokens.filter(Boolean).map((token, i) => {
            if (isChord(token)) {
              const newChord = transposeChord(token, steps);
              return (
                <span key={i} className="relative inline-block">
                  <span className="opacity-0 select-none">{newChord}</span>
                  <span className="absolute left-0 text-blue-600 font-bold tracking-normal" style={{ fontSize: '0.75em', bottom: '0.1em' }}>
                    {newChord}
                  </span>
                </span>
              );
            }
            return <span key={i}>{token}</span>;
          })}
        </div>
      </div>
    );
  };

  // 🔐 權限判斷：如果這首歌沒有主人(系統預設曲)，或者主人就是現在登入的人，才可以編輯
  const canEdit = !song.ownerId || (user && user.uid === song.ownerId);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto bg-white text-gray-800">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2">← 回到歌單目錄</Link>
        {isEditing && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-bold text-sm">🗑️ 刪除此歌曲</button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{song.title}</h1>
          {song.editor && <p className="text-gray-500 font-medium">編輯者：{song.editor}</p>}
        </div>
        
        {/* 🔐 這裡套用權限鎖，有權限才顯示按鈕，沒權限顯示鎖頭 */}
        {canEdit ? (
          isEditing ? (
            <button onClick={handleSave} className="px-6 py-3 rounded-lg font-bold text-white transition-colors shadow-md w-full md:w-auto bg-green-500 hover:bg-green-600">
              💾 儲存並上傳雲端
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-lg font-bold text-white transition-colors shadow-md w-full md:w-auto bg-blue-500 hover:bg-blue-600">
              ✏️ 編輯歌曲資訊與樂譜
            </button>
          )
        ) : (
          <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium border border-gray-200">
            🔒 僅建立者可編輯
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="mb-8 flex flex-wrap items-center justify-start gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 text-lg">調性：</label>
            <select value={targetKey} onChange={(e) => setTargetKey(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 text-xl font-bold bg-white">
              {NOTES.map((note) => <option key={note} value={note}>{note} 調</option>)}
            </select>
          </div>
          <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 text-lg">字體：</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 font-bold text-xl text-gray-700 transition-colors">－</button>
              <span className="px-4 py-2 border-l border-r border-gray-300 font-mono text-lg min-w-[3rem] text-center text-gray-600">{fontSize}</span>
              <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 font-bold text-xl text-gray-700 transition-colors">＋</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#fdfbf7] p-4 md:p-8 rounded-xl border border-amber-100 shadow-inner min-h-[600px] overflow-hidden">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded border border-gray-300 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">歌名：</label>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">原調：</label>
                <select value={editKey} onChange={e => setEditKey(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">編輯者：</label>
                <input type="text" value={editEditor} onChange={e => setEditEditor(e.target.value)} placeholder="例如: 小明" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-[500px] p-4 bg-gray-900 text-gray-100 font-mono leading-relaxed rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre overflow-x-auto"
              placeholder="請直接打字，用空白鍵將和弦對齊在歌詞上方..."
              spellCheck="false"
            />
          </div>
        ) : (
          renderPreview(song.content)
        )}
      </div>
    </main>
  );
}