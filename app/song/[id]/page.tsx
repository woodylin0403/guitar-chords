'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Song } from '@/data/songs';
// 🌟 新增了處理留言需要的 Firestore 工具：collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
const ALL_KEYS = [...MAJOR_KEYS, ...MINOR_KEYS];
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']; 
const TIME_SIGNATURES = ['4/4', '3/4', '2/4', '6/8', '9/8', '12/8', '2/2', '6/4'];

const CHORD_FINGERINGS: Record<string, (number | 'x')[]> = {
  'C': ['x', 3, 2, 0, 1, 0], 'C7': ['x', 3, 2, 3, 1, 0], 'Cm': ['x', 3, 5, 5, 4, 3],
  'D': ['x', 'x', 0, 2, 3, 2], 'D7': ['x', 'x', 0, 2, 1, 2], 'Dm': ['x', 'x', 0, 2, 3, 1], 'Dm7': ['x', 'x', 0, 2, 1, 1],
  'E': [0, 2, 2, 1, 0, 0], 'E7': [0, 2, 0, 1, 0, 0], 'Em': [0, 2, 2, 0, 0, 0], 'Em7': [0, 2, 0, 0, 0, 0],
  'F': [1, 3, 3, 2, 1, 1], 'Fm': [1, 3, 3, 1, 1, 1], 'F#m': [2, 4, 4, 2, 2, 2],
  'G': [3, 2, 0, 0, 0, 3], 'G7': [3, 2, 0, 0, 0, 1], 'Gm': [3, 5, 5, 3, 3, 3],
  'A': ['x', 0, 2, 2, 2, 0], 'A7': ['x', 0, 2, 0, 2, 0], 'Am': ['x', 0, 2, 2, 1, 0], 'Am7': ['x', 0, 2, 0, 1, 0],
  'B': ['x', 2, 4, 4, 4, 2], 'B7': ['x', 2, 1, 2, 0, 2], 'Bm': ['x', 2, 4, 4, 3, 2],
  'Bb': ['x', 1, 3, 3, 3, 1], 'Bbm': ['x', 1, 3, 3, 2, 1]
};

function ChordDiagram({ chordName }: { chordName: string }) {
  const baseChordName = chordName.split('/')[0].replace('Major', '').replace('major', '').replace('Minor', 'm').replace('minor', 'm');
  const frets = CHORD_FINGERINGS[baseChordName];
  if (!frets) return null;
  const maxFret = Math.max(...frets.filter(f => typeof f === 'number') as number[]);
  const startFret = maxFret > 4 ? maxFret - 2 : 1;
  return (
    <div className="flex flex-col items-center mr-4 mb-4">
      <span className="font-bold text-stone-700 mb-1">{chordName}</span>
      <svg width="60" height="70" viewBox="0 0 60 70" className="text-stone-400">
        {startFret > 1 && <text x="-5" y="15" fontSize="10" fill="currentColor">{startFret}fr</text>}
        {[0, 10, 20, 30, 40, 50].map(x => ( <line key={`s${x}`} x1={x+5} y1="10" x2={x+5} y2="60" stroke="currentColor" strokeWidth="1" /> ))}
        {[10, 22.5, 35, 47.5, 60].map((y, i) => ( <line key={`f${y}`} x1="5" y1={y} x2="55" y2={y} stroke="currentColor" strokeWidth={i === 0 && startFret === 1 ? "3" : "1"} /> ))}
        {frets.map((fret, stringIdx) => {
          const x = stringIdx * 10 + 5;
          if (fret === 'x') return <text key={`m${stringIdx}`} x={x-3} y="8" fontSize="10" fill="currentColor">x</text>;
          if (fret === 0) return <circle key={`o${stringIdx}`} cx={x} cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1" />;
          const relativeFret = (fret as number) - startFret + 1;
          const y = 10 + (relativeFret - 1) * 12.5 + 6.25;
          return <circle key={`d${stringIdx}`} cx={x} cy={y} r="4" fill="#57534e" />;
        })}
      </svg>
    </div>
  );
}

// 🌟 新增：將純文字中的網址轉換成可點擊的連結
function LinkifyText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">{part}</a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// 🌟 新增：時間格式化工具
function formatCommentTime(timestamp: any) {
  if (!timestamp) return '剛剛';
  const d = timestamp.toDate();
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function getNoteIndex(note: string) { return SHARP_NOTES.indexOf(note) !== -1 ? SHARP_NOTES.indexOf(note) : FLAT_NOTES.indexOf(note); }

function isChord(str: string) { 
  if (!str || str.trim() === '') return false;
  const regex = /^[CDEFGAB][#b]?(m|min|minor|Minor|maj|major|Major|M|dim|aug|sus|add|#|b|\d)*(?:\/[CDEFGAB][#b]?)?$/;
  return regex.test(str) && str !== '|'; 
}

function getRootNote(key: string) { return key.replace('m', ''); }

function transposeChord(chord: string, steps: number, targetKey: string) {
  if (!chord || chord === '|') return chord;
  const useFlats = FLAT_KEYS.includes(targetKey);
  const outputScale = useFlats ? FLAT_NOTES : SHARP_NOTES;
  return chord.split('/').map(note => {
    const match = note.match(/^([CDEFGAB][#b]?)(.*)$/);
    if (!match) return note; 
    const currentIndex = getNoteIndex(match[1]);
    if (currentIndex === -1) return note;
    let newIndex = (currentIndex + steps) % 12;
    if (newIndex < 0) newIndex += 12;
    if (getRootNote(targetKey) === 'C' && newIndex === 10) return 'Bb' + match[2];
    return outputScale[newIndex] + match[2];
  }).join('/');
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
  const [editTimeSignature, setEditTimeSignature] = useState("4/4");
  const [editEditor, setEditEditor] = useState("烏鴉Lin"); 
  const [editContent, setEditContent] = useState("");

  // 🌟 新增：留言板相關 State
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (songId === 'new') {
      setSong({ id: 'new', title: "", originalKey: "C", timeSignature: "4/4", editor: user?.displayName || "烏鴉Lin", content: "" });
      setEditKey("C"); setEditTimeSignature("4/4"); setEditEditor(user?.displayName || "烏鴉Lin"); setIsEditing(true); setIsLoading(false);
      return;
    }
    const fetchSong = async () => {
      try {
        const docSnap = await getDoc(doc(db, "songs", songId));
        if (docSnap.exists()) {
          const foundSong = docSnap.data() as Song;
          setSong(foundSong); setTargetKey(foundSong.originalKey); setEditTitle(foundSong.title); setEditKey(foundSong.originalKey); setEditTimeSignature(foundSong.timeSignature || "4/4"); setEditEditor(foundSong.editor || "烏鴉Lin"); setEditContent(foundSong.content);
        } else { alert("找不到這首詩歌！"); router.push('/'); }
      } catch (error) { console.error("讀取失敗:", error); } finally { setIsLoading(false); }
    };
    fetchSong();
  }, [songId, router, user]);

  // 🌟 新增：即時監聽這首歌的留言
  useEffect(() => {
    if (!songId || songId === 'new') return;
    
    // 設定查詢條件：抓取這首歌底下的 comments 子集合，並依時間排序 (由舊到新)
    const q = query(collection(db, `songs/${songId}/comments`), orderBy('createdAt', 'asc'));
    
    // onSnapshot 會即時監聽，只要有人留言，畫面就會自動更新，不用重新整理！
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [songId]);

  const handleSave = async () => {
    if (!song) return;
    const finalId = songId === 'new' ? `song-${Date.now()}` : song.id;
    const updatedSong: Song = { ...song, id: finalId, title: editTitle.trim() === "" ? "未命名新歌" : editTitle, originalKey: editKey, timeSignature: editTimeSignature, editor: editEditor, content: editContent, ownerId: song.ownerId || user?.uid, ownerEmail: song.ownerEmail || user?.email || "" };
    try {
      await setDoc(doc(db, "songs", finalId), updatedSong);
      if (songId === 'new') router.replace(`/song/${finalId}`);
      else { setSong(updatedSong); setTargetKey(editKey); setIsEditing(false); }
    } catch (error) { alert("儲存失敗，請重試！"); }
  };

  const handleDelete = async () => {
    if (songId === 'new') return router.push('/');
    if (confirm("確定要刪除這首歌嗎？")) { await deleteDoc(doc(db, "songs", songId)); router.push('/'); }
  };

  // 🌟 新增：送出留言的功能
  const handleAddComment = async () => {
    if (!user) { alert("請先登入才能留言喔！"); return; }
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, `songs/${songId}/comments`), {
        text: newCommentText.trim(),
        authorName: user.displayName || "匿名使用者",
        authorId: user.uid,
        createdAt: serverTimestamp() // 使用 Firebase 伺服器時間
      });
      setNewCommentText(""); // 清空輸入框
    } catch (error) {
      console.error("留言失敗:", error);
      alert("留言失敗，請重試！");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const uniqueChords = useMemo(() => {
    if (!song || isEditing) return [];
    const steps = getNoteIndex(getRootNote(targetKey)) - getNoteIndex(getRootNote(song.originalKey));
    const chords = new Set<string>();
    
    const matches = song.content.match(/\[(.*?)\]/g);
    if (matches) {
      matches.forEach(m => {
        const chord = m.slice(1, -1);
        if (isChord(chord)) chords.add(transposeChord(chord, steps, targetKey));
      });
    }
    song.content.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～]+)/).forEach(token => {
      if (isChord(token)) chords.add(transposeChord(token, steps, targetKey));
    });
    
    return Array.from(chords).sort();
  }, [song, targetKey, isEditing]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-stone-400 bg-[#FDFBF7] tracking-widest">載入中...</div>;
  if (!song) return null;

  const steps = getNoteIndex(getRootNote(targetKey)) - getNoteIndex(getRootNote(song.originalKey));

  const renderPreview = (text: string) => {
    return (
      <div className="overflow-x-auto pb-6">
        <div className="w-max min-w-full font-mono leading-relaxed text-stone-800 tracking-wide transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
          {text.split('\n').map((line, lineIndex) => {
            if (/\[.*?\]/.test(line)) {
              const parts = line.split(/\[(.*?)\]/);
              const elements = [];
              for (let i = 0; i < parts.length; i += 2) {
                const lyric = parts[i];
                const chord = i > 0 ? parts[i - 1] : null;
                if (!chord && !lyric) continue;
                const isLyricEmpty = lyric === '';
                elements.push(
                  <div key={i} className={`flex flex-col justify-end ${isLyricEmpty ? 'mr-3' : ''}`}>
                    <span className={`font-bold pr-1 ${chord === '|' ? 'text-stone-300' : 'text-stone-600'}`} style={{ fontSize: '0.85em', minHeight: '1.25em' }}>
                      {chord ? transposeChord(chord, steps, targetKey) : ''}
                    </span>
                    <span className="whitespace-pre" style={{ minHeight: '1.25em' }}>{isLyricEmpty ? ' ' : lyric}</span>
                  </div>
                );
              }
              return <div key={lineIndex} className="flex items-end mb-2">{elements}</div>;
            } else {
              const tokens = line.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～]+)/);
              return (
                <div key={lineIndex} className="whitespace-pre mb-1" style={{ minHeight: '1.5em' }}>
                  {tokens.filter(Boolean).map((token, i) => (
                    <span key={i} className={isChord(token) ? "text-stone-600 font-bold" : (token==='|'||token==='｜' ? "text-stone-300" : "")}>
                      {isChord(token) ? transposeChord(token, steps, targetKey) : token}
                    </span>
                  ))}
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
    <main className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-stone-200 pb-20">
      <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-stone-200 mb-8">
        <Link href="/" className="text-stone-500 hover:text-stone-800 text-sm font-medium tracking-widest transition-colors">← 返回目錄</Link>
        {isEditing && <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">{songId === 'new' ? '放棄編輯' : '刪除樂譜'}</button>}
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-stone-800 mb-4 tracking-wide">{songId === 'new' ? '新增詩歌' : song.title}</h1>
            <div className="flex items-center gap-3 text-sm text-stone-500">
              {song.editor && <span className="border border-stone-200 px-3 py-1 rounded-full bg-white shadow-sm">編譜：{song.editor}</span>}
              {!isEditing && song.timeSignature && <span className="border border-stone-200 px-3 py-1 rounded-full bg-white shadow-sm">拍號：{song.timeSignature}</span>}
            </div>
          </div>
          
          {canEdit ? (
            isEditing ? (
              <button onClick={handleSave} className="px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-sm font-medium transition-all shadow-md">儲存樂譜</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-full text-sm font-medium transition-all shadow-sm">編輯樂譜</button>
            )
          ) : (
            <span className="text-stone-400 text-sm">僅建立者可編輯</span>
          )}
        </div>

        {!isEditing && (
          <div className="bg-white border border-stone-100 shadow-sm rounded-2xl p-4 md:p-6 mb-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-500">調性</span>
              <select value={targetKey} onChange={(e) => setTargetKey(e.target.value)} className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-lg font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 cursor-pointer">
                {ALL_KEYS.map((note) => <option key={note} value={note}>{note}</option>)}
              </select>
            </div>
            <div className="w-px h-6 bg-stone-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-500">字體</span>
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                <button onClick={() => setFontSize(p => Math.max(12, p - 2))} className="px-3 py-1 hover:bg-stone-200 text-stone-600 transition-colors border-r border-stone-200">－</button>
                <span className="px-3 py-1 font-medium text-sm text-stone-700 min-w-[2.5rem] text-center">{fontSize}</span>
                <button onClick={() => setFontSize(p => Math.min(48, p + 2))} className="px-3 py-1 hover:bg-stone-200 text-stone-600 transition-colors border-l border-stone-200">＋</button>
              </div>
            </div>
          </div>
        )}

        {!isEditing && uniqueChords.length > 0 && (
          <div className="mb-10 p-6 bg-white border border-stone-100 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-stone-400 mb-4 tracking-widest uppercase">本曲使用和弦</h3>
            <div className="flex flex-wrap">
              {uniqueChords.map(chord => (
                <ChordDiagram key={chord} chordName={chord} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-stone-100 shadow-sm rounded-3xl p-6 md:p-10 min-h-[500px]">
          {isEditing ? (
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-stone-100">
                 <div className="col-span-1 md:col-span-2">
                   <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest">歌名</label>
                   <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest">原調</label>
                   <select value={editKey} onChange={e => setEditKey(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all">
                     {ALL_KEYS.map(note => <option key={note} value={note}>{note}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest">拍號</label>
                   <select value={editTimeSignature} onChange={e => setEditTimeSignature(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all">
                     {TIME_SIGNATURES.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                   </select>
                 </div>
               </div>
               
               <textarea
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 style={{ fontSize: `${fontSize}px` }}
                 className="w-full h-[500px] p-6 bg-[#2d2a26] text-stone-200 font-mono leading-relaxed rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 whitespace-pre overflow-x-auto shadow-inner"
                 placeholder="[C]舉目仰望 [G]仰望耶穌..."
                 spellCheck="false"
               />
             </div>
          ) : (
            renderPreview(song.content)
          )}
        </div>

        {/* 🌟 終極新增：留言與討論區塊 */}
        {!isEditing && songId !== 'new' && (
          <div className="mt-12 bg-white border border-stone-100 shadow-sm rounded-3xl p-6 md:p-10">
            <h3 className="text-xl font-medium text-stone-800 mb-8 flex items-center gap-3">
              <span className="text-2xl">💬</span> 詩歌討論與分享
            </h3>

            {/* 留言列表 */}
            <div className="space-y-6 mb-8">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-stone-700">{comment.authorName}</span>
                      <span className="text-xs text-stone-400 font-mono">{formatCommentTime(comment.createdAt)}</span>
                    </div>
                    {/* 使用 LinkifyText 來渲染留言，讓網址變成超連結 */}
                    <div className="text-stone-600 text-sm md:text-base leading-relaxed">
                      <LinkifyText text={comment.text} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-stone-400 text-sm">
                  目前還沒有留言，來當第一個分享的人吧！
                </div>
              )}
            </div>

            {/* 留言輸入框 */}
            <div className="border-t border-stone-100 pt-8 mt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="分享你的感動、彈奏問題，或是貼上 YouTube 示範連結..."
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all resize-none h-28"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim() || isSubmittingComment}
                    className="self-end px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-sm font-medium transition-all disabled:bg-stone-300 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmittingComment ? '送出中...' : '送出留言'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-stone-500 mb-3">登入後即可參與討論與分享連結</p>
                  {/* 使用 Link 回首頁登入，或者也可以在這裡接 handleLogin */}
                  <span className="text-sm font-medium text-stone-400">請回首頁點擊右上角登入</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}