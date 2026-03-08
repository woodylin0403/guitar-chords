'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Song } from '@/data/songs';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// 🌟 樂理大腦升級：加入所有小調
const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
const ALL_KEYS = [...MAJOR_KEYS, ...MINOR_KEYS];

const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
// 🌟 這些大調與小調，優先使用降記號
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']; 

// 常用拍號選單
const TIME_SIGNATURES = ['4/4', '3/4', '2/4', '6/8', '9/8', '12/8', '2/2', '6/4'];

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getNoteIndex(note: string) {
  const idx = SHARP_NOTES.indexOf(note);
  return idx !== -1 ? idx : FLAT_NOTES.indexOf(note);
}

function isChord(str: string) {
  if (!str || str.trim() === '') return false;
  const regex = /^[CDEFGAB][#b]?(m|min|maj|M|dim|aug|sus|add|#|b|\d)*(?:\/[CDEFGAB][#b]?)?$/;
  return regex.test(str);
}

// 取得調性的「根音」(把後面的 m 拿掉，例如 Am -> A)
function getRootNote(key: string) {
  return key.replace('m', '');
}

function transposeChord(chord: string, steps: number, targetKey: string) {
  if (!chord) return chord;
  const useFlats = FLAT_KEYS.includes(targetKey);
  const outputScale = useFlats ? FLAT_NOTES : SHARP_NOTES;

  const parts = chord.split('/');
  const transposeNote = (note: string) => {
    const match = note.match(/^([CDEFGAB][#b]?)(.*)$/);
    if (!match) return note; 
    const baseNote = match[1];
    const modifier = match[2];

    const currentIndex = getNoteIndex(baseNote);
    if (currentIndex === -1) return note;
    
    let newIndex = (currentIndex + steps) % 12;
    if (newIndex < 0) newIndex += 12;

    if (getRootNote(targetKey) === 'C' && newIndex === 10) return 'Bb' + modifier;

    return outputScale[newIndex] + modifier;
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

  const [user, setUser] = useState<User | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editKey, setEditKey] = useState("C");
  const [editTimeSignature, setEditTimeSignature] = useState("4/4"); // 🌟 拍號狀態
  const [editEditor, setEditEditor] = useState("烏鴉Lin"); // 🌟 預設編輯者
  const [editContent, setEditContent] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");

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
          setEditTimeSignature(foundSong.timeSignature || "4/4");
          // 🌟 如果資料庫本來就有編輯者，就用原來的；否則預設烏鴉Lin
          setEditEditor(foundSong.editor || "烏鴉Lin"); 
          setEditContent(foundSong.content);
          setEditYoutubeUrl(foundSong.youtubeUrl || "");
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
    const updatedSong = { 
      ...song, 
      title: editTitle, 
      originalKey: editKey, 
      timeSignature: editTimeSignature, // 🌟 存檔時加入拍號
      editor: editEditor, 
      content: editContent,
      youtubeUrl: editYoutubeUrl 
    };
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

  // 🌟 小調轉調核心邏輯：只拿根音來算級距
  const originalIndex = getNoteIndex(getRootNote(song.originalKey));
  const targetIndex = getNoteIndex(getRootNote(targetKey));
  const steps = targetIndex - originalIndex;

  const renderPreview = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="overflow-x-auto pb-6">
        <div className="w-max min-w-full font-mono leading-relaxed text-gray-800 tracking-wide transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
          {lines.map((line, lineIndex) => {
            const hasBrackets = /\[.*?\]/.test(line);

            if (hasBrackets) {
              const parts = line.split(/\[(.*?)\]/);
              return (
                <div key={lineIndex} className="whitespace-pre-wrap mt-5 mb-1 min-h-[1.5em]">
                  {parts.map((part, i) => {
                    if (i % 2 === 0) {
                      return <span key={i}>{part}</span>;
                    } else {
                      const newChord = transposeChord(part, steps, targetKey);
                      return (
                        <span key={i} className="relative inline-block">
                          <span className="absolute left-0 text-sky-500 font-bold tracking-normal" style={{ fontSize: '0.75em', bottom: '85%' }}>
                            {newChord}
                          </span>
                        </span>
                      );
                    }
                  })}
                </div>
              );
            } else {
              const tokens = line.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～]+)/);
              return (
                <div key={lineIndex} className="whitespace-pre min-h-[1.5em]">
                  {tokens.filter(Boolean).map((token, i) => {
                    if (isChord(token)) {
                      const newChord = transposeChord(token, steps, targetKey);
                      return (
                        <span key={i} className="relative inline-block">
                          <span className="opacity-0 select-none">{newChord}</span>
                          <span className="absolute left-0 text-sky-500 font-bold tracking-normal" style={{ fontSize: '0.75em', bottom: '0.1em' }}>
                            {newChord}
                          </span>
                        </span>
                      );
                    }
                    return <span key={i}>{token}</span>;
                  })}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const canEdit = !song.ownerId || (user && user.uid === song.ownerId);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 text-gray-800 font-sans">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-gray-950">
        <Link href="/" className="text-gray-950 hover:text-sky-500 font-black flex items-center gap-2 transition-colors">← 回到歌單目錄</Link>
        {isEditing && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-full border border-red-200">🗑️ 刪除此歌曲</button>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-[6px_6px_0_rgba(0,0,0,1)] border-4 border-gray-950">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 mb-3 tracking-tight">{song.title}</h1>
          <div className="flex items-center gap-3">
            {song.editor && <span className="inline-block px-3 py-1 bg-gray-950 text-white rounded-lg text-sm font-bold">編輯者：{song.editor}</span>}
            
            {/* 🌟 閱讀模式：顯示拍號 */}
            {!isEditing && song.timeSignature && (
              <span className="inline-block px-3 py-1 bg-white text-gray-950 border-2 border-gray-950 rounded-lg text-sm font-black shadow-[2px_2px_0_rgba(0,0,0,1)]">
                拍號：{song.timeSignature}
              </span>
            )}
          </div>
        </div>
        
        {canEdit ? (
          isEditing ? (
            <button onClick={handleSave} className="w-full md:w-auto px-6 py-4 rounded-2xl font-black text-gray-950 bg-green-400 hover:bg-green-500 border-2 border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)] transform hover:-translate-y-1 active:translate-y-0 transition-all text-lg flex items-center justify-center gap-2">
              💾 儲存並上傳雲端
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-full md:w-auto px-6 py-4 rounded-2xl font-black text-gray-950 bg-yellow-400 hover:bg-yellow-500 border-2 border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)] transform hover:-translate-y-1 active:translate-y-0 transition-all text-lg flex items-center justify-center gap-2">
              ✏️ 編輯樂譜
            </button>
          )
        ) : (
          <div className="px-5 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold border-2 border-gray-300">
            🔒 僅建立者可編輯
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="mb-8 flex flex-wrap items-center justify-start gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-3xl border-4 border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="font-black text-gray-950 text-lg">選擇調性：</label>
            <select value={targetKey} onChange={(e) => setTargetKey(e.target.value)} className="flex-1 md:flex-none border-2 border-gray-950 rounded-xl px-4 py-2 text-xl font-bold bg-gray-50 focus:ring-4 focus:ring-sky-400 focus:outline-none transition-all cursor-pointer">
              {ALL_KEYS.map((note) => <option key={note} value={note}>{note} 調</option>)}
            </select>
          </div>
          <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="font-black text-gray-950 text-lg">字體大小：</label>
            <div className="flex-1 md:flex-none flex items-center bg-gray-50 border-2 border-gray-950 rounded-xl overflow-hidden">
              <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="px-5 py-2 hover:bg-gray-200 active:bg-gray-300 font-black text-xl text-gray-950 transition-colors border-r-2 border-gray-950">－</button>
              <span className="px-5 py-2 font-black text-lg min-w-[3.5rem] text-center text-gray-950">{fontSize}</span>
              <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="px-5 py-2 hover:bg-gray-200 active:bg-gray-300 font-black text-xl text-gray-950 transition-colors border-l-2 border-gray-950">＋</button>
            </div>
          </div>
        </div>
      )}

      {!isEditing && song.youtubeUrl && getYouTubeId(song.youtubeUrl) && (
        <div className="mb-8 aspect-video w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,1)] border-4 border-gray-950 bg-gray-950">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${getYouTubeId(song.youtubeUrl)}`}
            title="YouTube Reference"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="bg-[#fdfbf7] p-4 md:p-8 rounded-3xl border-4 border-gray-950 shadow-[6px_6px_0_rgba(0,0,0,1)] min-h-[600px] overflow-hidden relative">
        <div className="absolute top-4 right-4 text-4xl opacity-20 pointer-events-none select-none">🎸</div>
        
        {isEditing ? (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-gray-950 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-black text-gray-950 mb-2">🎵 歌名：</label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border-2 border-gray-950 rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-gray-950 mb-2">🎯 原調：</label>
                  <select value={editKey} onChange={e => setEditKey(e.target.value)} className="w-full border-2 border-gray-950 rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none bg-white">
                    {ALL_KEYS.map(note => <option key={note} value={note}>{note}</option>)}
                  </select>
                </div>

                {/* 🌟 編輯模式：新增拍號下拉選單 */}
                <div>
                  <label className="block text-sm font-black text-gray-950 mb-2">⏱️ 拍號：</label>
                  <select value={editTimeSignature} onChange={e => setEditTimeSignature(e.target.value)} className="w-full border-2 border-gray-950 rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none bg-white">
                    {TIME_SIGNATURES.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>

              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-950 mb-2">👤 編輯者：</label>
                  <input type="text" value={editEditor} onChange={e => setEditEditor(e.target.value)} className="w-full border-2 border-gray-950 rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-gray-950 mb-2">📺 YouTube 參考影片網址 (選填)：</label>
                  <input 
                    type="text" 
                    value={editYoutubeUrl} 
                    onChange={e => setEditYoutubeUrl(e.target.value)} 
                    placeholder="例如: https://www.youtube.com/watch?v=..." 
                    className="w-full border-2 border-gray-950 rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-sky-400 focus:outline-none" 
                  />
                </div>
              </div>
            </div>
            
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-[500px] p-6 bg-gray-950 text-sky-300 font-mono leading-relaxed rounded-2xl border-4 border-gray-950 focus:outline-none focus:ring-4 focus:ring-yellow-400 whitespace-pre overflow-x-auto selection:bg-sky-900 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]"
              placeholder="支援兩種寫法：&#10;1. 傳統對齊：用空白鍵將和弦對齊在歌詞上方&#10;2. 標籤寫法：在歌詞中插入 [和弦]，例如: 今[C]十架山上[G]羔羊"
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