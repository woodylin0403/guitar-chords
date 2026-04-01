'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Song } from '@/data/songs';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
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

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

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
  const [isPlayingMode, setIsPlayingMode] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editKey, setEditKey] = useState("C");
  const [editTimeSignature, setEditTimeSignature] = useState("4/4");
  const [editEditor, setEditEditor] = useState("烏鴉Lin"); 
  const [editContent, setEditContent] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState(""); 

  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (songId === 'new') {
      setSong({ id: 'new', title: "", originalKey: "C", timeSignature: "4/4", editor: user?.displayName || "烏鴉Lin", content: "", youtubeUrl: "" });
      setEditKey("C"); 
      setEditTimeSignature("4/4"); 
      setEditEditor(user?.displayName || "烏鴉Lin"); 
      setEditYoutubeUrl("");
      setIsEditing(true); 
      setIsLoading(false);
      return;
    }
    const fetchSong = async () => {
      try {
        const docSnap = await getDoc(doc(db, "songs", songId));
        if (docSnap.exists()) {
          const foundSong = docSnap.data() as Song;
          
          try {
            const viewKey = `viewed_${songId}`;
            if (!sessionStorage.getItem(viewKey)) {
              await updateDoc(doc(db, "songs", songId), { views: increment(1) });
              sessionStorage.setItem(viewKey, 'true');
              (foundSong as any).views = ((foundSong as any).views || 0) + 1; 
            }
          } catch (e) {
            console.error("更新觀看次數失敗", e);
          }

          setSong(foundSong); 
          setTargetKey(foundSong.originalKey); 
          setEditTitle(foundSong.title); 
          setEditKey(foundSong.originalKey); 
          setEditTimeSignature(foundSong.timeSignature || "4/4"); 
          setEditEditor(foundSong.editor || "烏鴉Lin"); 
          setEditContent(foundSong.content);
          setEditYoutubeUrl(foundSong.youtubeUrl || ""); 
        } else { alert("找不到這首詩歌！"); router.push('/'); }
      } catch (error) { console.error("讀取失敗:", error); } finally { setIsLoading(false); }
    };
    fetchSong();
  }, [songId, router, user]);

  useEffect(() => {
    if (song && song.title) {
      document.title = `${song.title} 吉他譜 - 老詩歌吉他譜`;
    } else {
      document.title = "老詩歌吉他譜";
    }
  }, [song]);

  useEffect(() => {
    if (!songId || songId === 'new') return;
    const q = query(collection(db, `songs/${songId}/comments`), orderBy('createdAt', 'asc'));
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
    const updatedSong: Song = { 
      ...song, id: finalId, 
      title: editTitle.trim() === "" ? "未命名新歌" : editTitle, 
      originalKey: editKey, timeSignature: editTimeSignature, 
      editor: editEditor, content: editContent, youtubeUrl: editYoutubeUrl.trim(),
      ownerId: song.ownerId || user?.uid, ownerEmail: song.ownerEmail || user?.email || "" 
    };
    
    try {
      await setDoc(doc(db, "songs", finalId), updatedSong);
      if (songId === 'new') router.replace(`/song/${finalId}`);
      else { setSong(updatedSong); setTargetKey(editKey); setIsEditing(false); }
    } catch (error) { alert("儲存失敗，請重試！"); }
  };

  const handleDelete = async () => {
    if (songId === 'new') return router.push('/chords');
    if (confirm("確定要刪除這首歌嗎？")) { await deleteDoc(doc(db, "songs", songId)); router.push('/chords'); }
  };

  const handleAddComment = async () => {
    if (!user) { alert("請先登入才能留言喔！"); return; }
    if (!newCommentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, `songs/${songId}/comments`), {
        text: newCommentText.trim(), authorName: user.displayName || "匿名使用者", authorId: user.uid, createdAt: serverTimestamp() 
      });
      fetch("https://formsubmit.co/ajax/coolcrow0403@gmail.com", {
        method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            _subject: `老詩歌吉他譜 🎸 有新留言囉！`, "🎵 歌曲名稱": song?.title || "未知歌曲", "👤 留言者": user.displayName || "匿名使用者", "💬 留言內容": newCommentText.trim(), "🔗 前往樂譜": window.location.href
        })
      }).catch(err => console.error(err));
      setNewCommentText(""); 
    } catch (error) { alert("留言失敗，請重試！"); } finally { setIsSubmittingComment(false); }
  };

  const uniqueChords = useMemo(() => {
    if (!song || isEditing) return [];
    const steps = getNoteIndex(getRootNote(targetKey)) - getNoteIndex(getRootNote(song.originalKey));
    const chords = new Set<string>();
    
    const matches = song.content.match(/\[(.*?)\]/g);
    if (matches) { matches.forEach(m => { const chord = m.slice(1, -1); if (isChord(chord)) chords.add(transposeChord(chord, steps, targetKey)); }); }
    song.content.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～]+)/).forEach(token => { if (isChord(token)) chords.add(transposeChord(token, steps, targetKey)); });
    
    return Array.from(chords).sort();
  }, [song, targetKey, isEditing]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-stone-400 bg-[#FDFBF7] tracking-widest">載入中...</div>;
  if (!song) return null;

  const steps = getNoteIndex(getRootNote(targetKey)) - getNoteIndex(getRootNote(song.originalKey));

  // 🌟 最終精準對齊渲染邏輯：完全尊重底線 _
  const renderPreview = (text: string) => {
    return (
      <div className="overflow-x-auto pb-6">
        <div className="w-max min-w-full font-mono leading-relaxed text-stone-800 tracking-wide transition-all duration-200" style={{ fontSize: `${fontSize}px` }}>
          {text.split('\n').map((line, lineIndex) => {
            if (/\[.*?\]/.test(line)) {
              const parts = line.split(/\[(.*?)\]/);
              const elements = [];

              if (parts[0]) {
                elements.push(
                  <span key={`text-init`} className="whitespace-pre text-stone-800">
                    {parts[0]}
                  </span>
                );
              }

              for (let i = 1; i < parts.length; i += 2) {
                const chord = parts[i];
                const lyricSegment = parts[i + 1] || '';
                const isBarline = chord === '|' || chord === '｜';
                const chordDisplay = transposeChord(chord, steps, targetKey);

                if (lyricSegment.length > 0) {
                  const firstChar = lyricSegment.charAt(0);
                  const restText = lyricSegment.substring(1);
                  // 檢查第一個字是否為底線 (半形或全形)
                  const isUnderscore = firstChar === '_' || firstChar === '＿';

                  elements.push(
                    <div key={`chord-${i}`} className="inline-flex items-end">
                      <div className="flex flex-col items-center">
                        <span className={`font-bold ${isBarline ? 'text-stone-300' : 'text-stone-600'}`} style={{ fontSize: '0.85em', marginBottom: '0.1em' }}>
                          {chordDisplay}
                        </span>
                        <span className={`whitespace-pre ${!isBarline && firstChar.trim() !== '' && !isUnderscore ? 'underline decoration-stone-400 decoration-[2.5px] underline-offset-[5px]' : ''} ${isUnderscore ? 'text-stone-400' : 'text-stone-800'}`}>
                          {firstChar}
                        </span>
                      </div>
                      {restText && (
                        <span className="whitespace-pre text-stone-800">
                          {restText}
                        </span>
                      )}
                    </div>
                  );
                } else {
                  elements.push(
                    <div key={`chord-${i}`} className="inline-flex flex-col items-center mr-2">
                      <span className={`font-bold ${isBarline ? 'text-stone-300' : 'text-stone-600'}`} style={{ fontSize: '0.85em', marginBottom: '0.1em' }}>
                        {chordDisplay}
                      </span>
                      <span className="whitespace-pre"> </span>
                    </div>
                  );
                }
              }
              return <div key={lineIndex} className="flex items-end mb-3 min-h-[2.5em]">{elements}</div>;
            } else {
              const tokens = line.split(/(\s+|[|()[\]{}<>,.:;~\-｜（）【】《》，。：；～_＿]+)/);
              return (
                <div key={lineIndex} className="whitespace-pre mb-1" style={{ minHeight: '1.5em' }}>
                  {tokens.filter(Boolean).map((token, i) => {
                    const displayToken = isChord(token) ? transposeChord(token, steps, targetKey) : token;
                    const isUnderscoreToken = /^[_＿]+$/.test(token);
                    return (
                      <span key={i} className={isChord(token) ? "text-stone-600 font-bold" : (token==='|'||token==='｜' ? "text-stone-300" : (isUnderscoreToken ? "text-stone-400" : "text-stone-800"))}>
                        {displayToken}
                      </span>
                    )
                  })}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const canEdit = !song.ownerId || (user && user.uid === song.ownerId) || (user && user.displayName === "烏鴉Lin");

  return (
    <main className={`min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-stone-200 pb-20 ${isPlayingMode ? 'fixed inset-0 z-50 overflow-y-auto !pb-0' : ''}`}>
      
      {isPlayingMode && (
        <div className="fixed top-6 right-6 z-[60] flex items-center bg-stone-800/90 text-white rounded-full shadow-lg backdrop-blur-md print:hidden overflow-hidden border border-stone-700/50">
          <div className="flex items-center px-2 py-1">
            <button onClick={() => setFontSize(p => Math.max(12, p - 2))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-700 rounded-full transition-colors text-stone-300 hover:text-white" title="縮小字體">－</button>
            <span className="w-8 text-center text-sm font-medium font-mono text-stone-200">{fontSize}</span>
            <button onClick={() => setFontSize(p => Math.min(60, p + 2))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-700 rounded-full transition-colors text-stone-300 hover:text-white" title="放大字體">＋</button>
          </div>
          <div className="w-px h-6 bg-stone-600 mx-1"></div>
          <button onClick={() => setIsPlayingMode(false)} className="px-5 py-2.5 hover:bg-stone-700 text-stone-200 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"><span>✕</span> 結束</button>
        </div>
      )}

      {!isPlayingMode && (
        <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-stone-200 mb-8 print:hidden">
          <Link href="/chords" className="text-stone-500 hover:text-stone-800 text-sm font-medium tracking-widest transition-colors">← 返回吉他譜目錄</Link>
          {isEditing && <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">{songId === 'new' ? '放棄編輯' : '刪除樂譜'}</button>}
        </nav>
      )}

      <div className={`mx-auto px-6 ${isPlayingMode ? 'max-w-6xl pt-12' : 'max-w-4xl'}`}>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="flex-1 w-full md:w-auto">
            <h1 className="text-3xl md:text-5xl font-light text-stone-800 mb-4 tracking-wide break-words">{songId === 'new' ? '新增詩歌' : song.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
              {song.editor && <span className="border border-stone-200 px-3 py-1 rounded-full bg-white shadow-sm">編譜：{song.editor}</span>}
              {!isEditing && song.timeSignature && <span className="border border-stone-200 px-3 py-1 rounded-full bg-white shadow-sm">拍號：{song.timeSignature}</span>}
              {!isEditing && <span className="border border-stone-200 px-3 py-1 rounded-full bg-white shadow-sm flex items-center gap-1">👁️ {(song as any).views || 1} 次觀看</span>}
              {!isEditing && targetKey !== song.originalKey && <span className="border border-red-200 text-red-600 px-3 py-1 rounded-full bg-red-50 shadow-sm font-medium">彈奏調性：{targetKey}</span>}
            </div>
          </div>
          
          {!isPlayingMode && (
            <div className="shrink-0 print:hidden">
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
          )}
        </div>

        {!isEditing && !isPlayingMode && (
          <div className="bg-white border border-stone-100 shadow-sm rounded-2xl p-4 md:p-6 mb-8 flex flex-wrap items-center justify-between gap-6 print:hidden">
            <div className="flex flex-wrap items-center gap-6">
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
                  <button onClick={() => setFontSize(p => Math.min(60, p + 2))} className="px-3 py-1 hover:bg-stone-200 text-stone-600 transition-colors border-l border-stone-200">＋</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsPlayingMode(true)} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2">🎸 演奏模式</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2">🖨️ 列印樂譜</button>
            </div>
          </div>
        )}

        {!isEditing && !isPlayingMode && song.youtubeUrl && getYouTubeId(song.youtubeUrl) && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-stone-100 bg-white p-2 print:hidden">
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(song.youtubeUrl)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        )}

        {!isEditing && uniqueChords.length > 0 && (
          <div className={`mb-8 p-6 bg-white border border-stone-100 rounded-2xl shadow-sm ${isPlayingMode ? 'hidden' : ''} print:border-none print:shadow-none print:p-0 print:mb-4`}>
            <h3 className="text-sm font-bold text-stone-400 mb-4 tracking-widest uppercase">本曲使用和弦</h3>
            <div className="flex flex-wrap">
              {uniqueChords.map(chord => (
                <ChordDiagram key={chord} chordName={chord} />
              ))}
            </div>
          </div>
        )}

        <div className={`bg-white border shadow-sm rounded-3xl p-6 md:p-10 min-h-[500px] ${isPlayingMode ? 'border-none shadow-none !bg-transparent !p-0' : 'border-stone-100'} print:border-none print:shadow-none print:p-0`}>
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
                 <div className="col-span-1 md:col-span-4 mt-2">
                   <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest">YouTube 示範影片網址 (選填)</label>
                   <input type="text" value={editYoutubeUrl} onChange={e => setEditYoutubeUrl(e.target.value)} placeholder="例如：https://www.youtube.com/watch?v=..." className="w-full border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all" />
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

        {!isEditing && !isPlayingMode && songId !== 'new' && (
          <div className="mt-12 bg-white border border-stone-100 shadow-sm rounded-3xl p-6 md:p-10 print:hidden">
            <h3 className="text-xl font-medium text-stone-800 mb-8 flex items-center gap-3">
              <span className="text-2xl">💬</span> 詩歌討論與分享
            </h3>
            <div className="space-y-6 mb-8">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-stone-700">{comment.authorName}</span>
                      <span className="text-xs text-stone-400 font-mono">{formatCommentTime(comment.createdAt)}</span>
                    </div>
                    <div className="text-stone-600 text-sm md:text-base leading-relaxed">
                      <LinkifyText text={comment.text} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-stone-400 text-sm">目前還沒有留言，來當第一個分享的人吧！</div>
              )}
            </div>

            <div className="border-t border-stone-100 pt-8 mt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <textarea value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="分享你的感動、彈奏問題，或是貼上 YouTube 示範連結..." className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all resize-none h-28" />
                  <button onClick={handleAddComment} disabled={!newCommentText.trim() || isSubmittingComment} className="self-end px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-sm font-medium transition-all disabled:bg-stone-300 disabled:cursor-not-allowed shadow-sm">
                    {isSubmittingComment ? '送出中...' : '送出留言'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-stone-500 mb-3">登入後即可參與討論與分享連結</p>
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