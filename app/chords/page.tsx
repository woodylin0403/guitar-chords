'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialSongList, Song } from '@/data/songs';
import { importSongs } from '@/data/importSongs';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Search, Plus, Download, Trash2, BookOpen, Music, Smartphone, Printer, Youtube, ArrowLeft, Activity, Mail, LogOut, LogIn, Eye } from 'lucide-react';

const MAJOR_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const MINOR_KEYS = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'];

function getUploadDate(id: string) {
  const parts = id.split('-');
  if (parts.length >= 2) {
    const timestamp = parseInt(parts[1]);
    if (!isNaN(timestamp) && timestamp > 1600000000000) {
      const d = new Date(timestamp);
      return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    }
  }
  return '近期建檔';
}

export default function ChordsHome() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showMode, setShowMode] = useState<'instructions' | 'list'>('list');
  const [siteViews, setSiteViews] = useState(0); 
  
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const router = useRouter();

  const adminEmail = "coolcrow0403@gmail.com"; 
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setSelectedSongs([]); 
    });
    return () => unsubscribe();
  }, []);

  const fetchSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "songs"));
      if (querySnapshot.empty) {
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

  useEffect(() => { fetchSongs(); }, []);

  useEffect(() => {
    const fetchAndTrackSiteViews = async () => {
      const statsRef = doc(db, 'stats', 'global');
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
          await setDoc(statsRef, { views: increment(1) }, { merge: true });
          sessionStorage.setItem('hasVisited', 'true');
        }
        const snap = await getDoc(statsRef);
        if (snap.exists()) {
          setSiteViews(snap.data().views || 0);
        }
      } catch (error) {
        console.error("無法讀取網站瀏覽量", error);
      }
    };
    fetchAndTrackSiteViews();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { alert("登入失敗！"); }
  };
  const handleLogout = async () => { await signOut(auth); };

  const handleCreateNewSong = () => {
    if (!user) { alert("請先登入！"); return; }
    router.push(`/song/new`);
  };

  const handleBatchImport = async () => {
    if (!isAdmin) return;
    const firstSongTitle = importSongs.length > 0 ? importSongs[0].title : "未知";
    if (!confirm(`準備匯入「${firstSongTitle}」等共 ${importSongs.length} 首歌？`)) return;
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
      alert(`🎉 成功匯入了 ${count} 首！`);
      await fetchSongs(); 
    } catch (error) {
      alert("匯入失敗！");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteSong = async (songId: string, songOwnerId: string | undefined, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!user) {
      alert("請先登入才能執行此動作！");
      return;
    }
    const hasPermission = isAdmin || user.displayName === "烏鴉Lin" || songOwnerId === user.uid;
    if (!hasPermission) {
      alert("您沒有權限刪除這首樂譜喔！");
      return;
    }

    if (window.confirm("確定要刪除這首樂譜嗎？此動作無法復原。")) {
      try {
        await deleteDoc(doc(db, "songs", songId));
        setSelectedSongs(prev => prev.filter(id => id !== songId)); 
        await fetchSongs(); 
      } catch (error) {
        console.error("刪除失敗: ", error);
        alert("刪除時發生錯誤");
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedSongs.length === 0) return;
    if (!window.confirm(`確定要一口氣刪除選取的 ${selectedSongs.length} 首樂譜嗎？此動作無法復原。`)) return;

    try {
      for (const id of selectedSongs) {
        await deleteDoc(doc(db, "songs", id));
      }
      alert(`成功刪除 ${selectedSongs.length} 首樂譜！`);
      setSelectedSongs([]); 
      await fetchSongs();   
    } catch (error) {
      console.error("批次刪除失敗: ", error);
      alert("批次刪除時發生錯誤");
    }
  };

  const toggleSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]                
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== "") setShowMode('list');
  };

  const handleKeySelect = (key: string | null) => {
    setSelectedKey(key);
    setShowMode('list');
  };

  const filteredSongs = songs.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKey = selectedKey ? song.originalKey === selectedKey : true;
    return matchSearch && matchKey;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-slate-400 bg-slate-50 tracking-widest">載入中...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-500 selection:text-white pb-20 relative overflow-hidden">
      
      {/* 現代感背景光暈 */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 導覽列：毛玻璃浮動效果 */}
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-6 sticky top-0 z-50">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-4 md:px-6 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* 返回按鈕 */}
            <Link href="/tools-hub" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-violet-600 hover:bg-violet-50 px-3 py-1.5 rounded-full transition-colors">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:block">工具箱</span>
            </Link>
            
            <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

            {/* 回到大首頁的 Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full border-2 border-slate-900" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
                老詩歌 <span className="font-medium text-slate-400 text-sm ml-0.5">吉他譜</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full">
              <Activity className="w-4 h-4 text-violet-500" />
              <span>{siteViews} Views</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-100/50 pl-3 pr-1 py-1 rounded-full border border-slate-200/50">
                <span className="hidden sm:block">{user.displayName}</span>
                <button onClick={handleLogout} className="p-1.5 bg-white rounded-full hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm" title="登出">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-full shadow-sm transition-colors">
                <LogIn className="w-4 h-4" /> 登入編輯
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-10 pb-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-tight">
          尋找專屬你的 <br className="sm:hidden"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">敬拜旋律</span>
        </h2>
        
        <div className="relative mb-8 max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="輸入歌名找譜..." 
            value={searchQuery} 
            onChange={handleSearch} 
            className="w-full pl-12 pr-6 py-4 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setShowMode(showMode === 'instructions' ? 'list' : 'instructions')} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${showMode === 'instructions' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'}`}
          >
            <BookOpen className="w-4 h-4" /> 編輯教學
          </button>
          
          {user && (
            <button onClick={handleCreateNewSong} className="flex items-center gap-2 px-5 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-100 rounded-full text-sm font-medium transition-all shadow-sm">
              <Plus className="w-4 h-4" /> 新增詩歌
            </button>
          )}

          {isAdmin && importSongs.length > 0 && (
            <button onClick={handleBatchImport} disabled={isImporting} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-full text-sm font-medium transition-all shadow-sm">
              <Download className="w-4 h-4" /> {isImporting ? "匯入中..." : `匯入 (${importSongs.length})`}
            </button>
          )}

          {selectedSongs.length > 0 && user && (isAdmin || user.displayName === "烏鴉Lin") && (
            <button 
              onClick={handleBatchDelete} 
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-sm font-medium transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> 刪除已選 ({selectedSongs.length})
            </button>
          )}
        </div>

        {/* 音調選擇器 */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 bg-white/60 backdrop-blur-md p-2 rounded-3xl border border-slate-200/60 shadow-sm inline-flex mx-auto">
          <button onClick={() => handleKeySelect(null)} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${showMode === 'list' && selectedKey === null ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100/80'}`}>全部</button>
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          {MAJOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-3 md:px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${showMode === 'list' && selectedKey === key ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' : 'text-slate-600 hover:bg-slate-100/80'}`}>{key}</button>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          {MINOR_KEYS.map(key => (
            <button key={key} onClick={() => handleKeySelect(key)} className={`px-3 md:px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${showMode === 'list' && selectedKey === key ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100/80'}`}>{key}</button>
          ))}
        </div>
      </section>

      {/* 亮點功能卡片 */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-3 text-violet-600"><Music className="w-5 h-5" /></div>
            <h3 className="text-slate-800 font-bold mb-1 text-sm md:text-base">智能轉調</h3>
            <p className="text-slate-500 text-xs font-medium">完美配合個人音域</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600"><Smartphone className="w-5 h-5" /></div>
            <h3 className="text-slate-800 font-bold mb-1 text-sm md:text-base">沉浸演奏</h3>
            <p className="text-slate-500 text-xs font-medium">隱藏干擾專注彈唱</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600"><Printer className="w-5 h-5" /></div>
            <h3 className="text-slate-800 font-bold mb-1 text-sm md:text-base">純淨列印</h3>
            <p className="text-slate-500 text-xs font-medium">一鍵匯出白底黑字</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3 text-rose-600"><Youtube className="w-5 h-5" /></div>
            <h3 className="text-slate-800 font-bold mb-1 text-sm md:text-base">影音整合</h3>
            <p className="text-slate-500 text-xs font-medium">隨時聆聽原曲示範</p>
          </div>
        </div>
      </section>

      {showMode === 'list' ? (
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-3 px-2">
            <span className="text-slate-500 text-sm font-medium tracking-wide">
              {selectedKey ? `調性：${selectedKey}` : '所有詩歌'} · 共 <span className="text-slate-800 font-bold">{filteredSongs.length}</span> 首
            </span>
            
            {filteredSongs.length > 0 && user && (user.displayName === "烏鴉Lin" || isAdmin) && (
              <button 
                onClick={() => {
                  const allVisibleIds = filteredSongs
                    .filter(s => isAdmin || user.displayName === "烏鴉Lin" || s.ownerId === user.uid)
                    .map(s => s.id);
                  if (selectedSongs.length === allVisibleIds.length) {
                    setSelectedSongs([]); 
                  } else {
                    setSelectedSongs(allVisibleIds); 
                  }
                }}
                className="text-xs font-medium text-slate-400 hover:text-violet-600 transition-colors"
              >
                {selectedSongs.length === filteredSongs.length && filteredSongs.length > 0 ? "取消全選" : "全選本頁"}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => {
                const canEdit = !!user && (isAdmin || user.displayName === "烏鴉Lin" || song.ownerId === user.uid);
                const isSelected = selectedSongs.includes(song.id);

                return (
                  <Link href={`/song/${song.id}`} key={song.id} className="group block outline-none">
                    <div className={`relative overflow-hidden bg-white/90 backdrop-blur-xl p-6 rounded-[1.5rem] border ${isSelected ? 'border-violet-500 shadow-md ring-2 ring-violet-500/20' : 'border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1'} transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-full flex flex-col`}>
                      
                      {/* Hover 光暈效果 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {canEdit && (
                        <div 
                          onClick={(e) => {
                            e.preventDefault();  
                            e.stopPropagation(); 
                            toggleSelection(song.id);
                          }}
                          className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-xl cursor-pointer hover:bg-violet-50 transition-colors border border-slate-100 shadow-sm"
                          title="選取以批次刪除"
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 cursor-pointer accent-violet-600 pointer-events-none rounded"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4 pr-10 relative z-10">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-violet-600 transition-colors tracking-tight leading-tight">{song.title}</h3>
                        <span className="text-violet-600 text-xs font-bold bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg shrink-0 ml-3">{song.originalKey}</span>
                      </div>
                      
                      <div className="mt-auto pt-6 flex justify-between items-center text-xs text-slate-400 pr-10 relative z-10">
                        <div className="flex gap-2">
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-md font-medium text-slate-600">編：{song.editor}</span>
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-md font-medium text-slate-600 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {(song as any).views || 0}
                          </span>
                        </div>
                        <span className="font-medium text-slate-400">{getUploadDate(song.id)}</span>
                      </div>

                      {canEdit && (
                        <button 
                          onClick={(e) => handleDeleteSong(song.id, song.ownerId, e)}
                          className="absolute bottom-5 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors z-20"
                          title="單獨刪除此樂譜"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center">
                <Music className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium text-lg">找不到符合條件的詩歌</p>
                <p className="text-slate-400 text-sm mt-1">試著更換關鍵字或調性過濾器</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-600 leading-relaxed relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3 relative z-10 tracking-tight">
              <BookOpen className="w-6 h-6 text-violet-500" /> 樂譜排版秘笈
            </h3>
            <p className="mb-10 text-slate-500 font-medium relative z-10">系統支援兩種編譜方式，你可以自由選擇最習慣的方法：</p>
            
            <div className="space-y-8 text-sm md:text-base relative z-10">
              
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                <strong className="block text-lg text-slate-800 mb-3">方式一：傳統文件排版 (純文字對齊)</strong>
                <p className="mb-5 text-slate-500">就像在 Word 或記事本裡打字一樣，把和弦打在第一行，歌詞打在第二行。系統會完美保留你按的所有「空白鍵」，不用擔心跑版！</p>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl font-mono text-slate-700 overflow-x-auto shadow-sm">
                  <p>| &nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bm &nbsp;&nbsp;&nbsp;&nbsp;|</p>
                  <p>&nbsp;&nbsp;舉目仰望 仰望耶穌</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-blue-50 p-6 md:p-8 rounded-3xl border border-violet-100 shadow-sm">
                <strong className="flex items-center gap-2 text-lg text-violet-900 mb-3">
                  方式二：智能標籤排版 <span className="bg-violet-600 text-white text-xs px-2 py-1 rounded-md">✨ 推薦</span>
                </strong>
                <p className="mb-5 text-violet-700/80">將和弦用中括號 <code className="bg-white/60 px-1.5 py-0.5 rounded border border-violet-200 text-violet-800 font-bold">[ ]</code> 包起來，緊貼在歌詞前方。系統會自動把和弦浮在歌詞上方，這樣在使用「一鍵轉調」功能時最精準好看！</p>
                <div className="bg-white/80 border border-violet-200 p-5 rounded-2xl font-mono text-violet-900 overflow-x-auto shadow-sm backdrop-blur-sm">
                  <p>[D]舉目仰望 [A7]仰望耶[Bm]穌</p>
                </div>
              </div>

              <hr className="border-slate-200/60" />
              
              <div>
                <strong className="block text-slate-800 mb-3">3. 如何標示「小節線」？</strong>
                <p className="mb-5 text-slate-500">音樂中的小節線通常只會出現在和弦那一行。你只需要把直線用中括號包起來 <code className="bg-slate-100 border border-slate-200 px-2 py-1 rounded font-bold">[|]</code> 即可！</p>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl font-mono text-slate-700 overflow-x-auto shadow-sm">
                  <p className="text-slate-400 mb-2 text-sm font-sans">輸入範例：</p>
                  <p>[|] [D]舉目仰望 [A7]仰望耶[Bm]穌 [|]</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}