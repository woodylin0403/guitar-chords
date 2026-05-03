'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ref, 
  onValue, 
  runTransaction, 
  onDisconnect, 
  push, 
  set, 
  serverTimestamp, 
  remove 
} from 'firebase/database';
// 🌟 引入你的 Firebase
import { rtdb as db } from '../../../../lib/firebase'; 

// ==========================================
// 1. 型別定義與常數資料
// ==========================================
interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
}

const PREVIEWS = [
  {
    id: '1',
    title: '《劃破夜空的雞啼》',
    shortName: '雞啼',
    desc: '感人短劇描繪彼得軟弱。因恐懼三次認主，雞鳴崩潰痛哭。復活耶穌柔聲挽回，完全洗淨背叛並再次呼召牧養羊群。',
    image: '/images/play1.jpg',
  },
  {
    id: '2',
    title: '《沉入深淵的斧頭》',
    shortName: '斧頭',
    desc: '詼諧短劇改編聖經。門徒借鐵斧掉河。試探者以金銀斧誘惑，遭正直拒絕。以利沙顯神蹟，鐵斧浮起。',
    image: '/images/play2.jpg',
  },
  {
    id: '3',
    title: '《皮不敏計畫》',
    shortName: '皮不敏',
    desc: '極具創意！主角碰聖經就過敏。讀經友發現缺聖經精華。耐心引導誦讀克服，不再打噴嚏，鼓勵主動靈修。',
    image: '/images/play3.jpg',
  }
];

// 無限循環用的擴展陣列
const EXTENDED_PREVIEWS = [
  PREVIEWS[PREVIEWS.length - 1],
  ...PREVIEWS,
  PREVIEWS[0]
];

// ==========================================
// 2. 主元件 MobileVote
// ==========================================
export default function MobileVote() {
  // --- 狀態管理 ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  
  // --- 輪播狀態 ---
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --- 音效管理 ---
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [userMuted, setUserMuted] = useState(false);

  const musicTracks = {
    waiting: '/music/waiting.mp3',
    voting: '/music/voting.mp3',
    reveal: '/music/reveal.mp3'
  };

  // ==========================================
  // 3. Effects (生命週期與資料監聽)
  // ==========================================

  // Effect A: 註冊即時在線人數 (大螢幕計數用)
  useEffect(() => {
    if (!db) return;
    
    // 建立一個專屬的在線節點
    const myPresenceRef = push(ref(db, 'activeUsers'));
    
    // 當使用者斷線或關閉網頁時，Firebase 自動刪除此節點
    onDisconnect(myPresenceRef).remove();
    
    // 寫入上線時間戳記
    set(myPresenceRef, { joinedAt: serverTimestamp() });

    // 正常離開網頁時手動清除
    return () => {
      remove(myPresenceRef).catch(console.error);
    };
  }, []); // 空陣列代表只在進入網頁時執行一次

  // Effect B: 監聽 Firebase 投票階段與隊伍資料
  useEffect(() => {
    if (!db) return;
    
    // 1. 監聽階段
    const stageRef = ref(db, 'voteState/stage');
    const unsubscribeStage = onValue(stageRef, (snapshot) => {
      const stage = snapshot.val();
      if (stage) {
        setCurrentStage(stage);
        
        // 階段改變時自動換音樂
        if (audioRef.current && isAudioEnabled && !userMuted) {
          audioRef.current.src = musicTracks[stage as keyof typeof musicTracks];
          audioRef.current.play().catch(e => console.log("播放失敗", e));
        }

        // 如果回到 waiting，重置投票狀態
        if (stage === 'waiting') {
          setHasVoted(false);
          setSelectedTeam(null);
          localStorage.removeItem('hasVoted_cyberark');
        }
      }
    });

    // 2. 監聽隊伍資料
    const teamsListRef = ref(db, 'teamsList');
    const unsubscribeTeams = onValue(teamsListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
    });

    // 3. 檢查本地投票紀錄
    if (localStorage.getItem('hasVoted_cyberark')) {
      setHasVoted(true);
    }

    return () => {
      unsubscribeStage();
      unsubscribeTeams();
    };
  }, [isAudioEnabled, userMuted]);

  // Effect C: 自動輪播計時器
  useEffect(() => {
    if (currentStage !== 'waiting' || hasVoted) return;
    const timer = setTimeout(() => {
      nextSlide();
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex, currentStage, hasVoted]);

  // ==========================================
  // 4. 互動邏輯 (Handlers)
  // ==========================================

  // --- 輪播控制 ---
  const nextSlide = () => {
    if (currentIndex >= EXTENDED_PREVIEWS.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === EXTENDED_PREVIEWS.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(EXTENDED_PREVIEWS.length - 2);
    }
  };

  const handleDragStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging || !startX) return;
    const distance = startX - clientX;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    setIsDragging(false);
    setStartX(0);
  };

  let realIndex = currentIndex - 1;
  if (currentIndex === 0) realIndex = PREVIEWS.length - 1;
  if (currentIndex === EXTENDED_PREVIEWS.length - 1) realIndex = 0;

  // --- 音樂與投票控制 ---
  const toggleAudio = () => {
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      setUserMuted(false);
      if (audioRef.current) {
        audioRef.current.src = musicTracks[currentStage as keyof typeof musicTracks];
        audioRef.current.play().catch(e => console.log("播放失敗", e));
      }
    } else {
      if (audioRef.current) {
        if (userMuted) {
          audioRef.current.play();
          setUserMuted(false);
        } else {
          audioRef.current.pause();
          setUserMuted(true);
        }
      }
    }
  };

  const handleVote = async () => {
    if (!selectedTeam || currentStage !== 'voting') return;
    setIsSubmitting(true);

    try {
      const teamRef = ref(db, `teamVotes/${selectedTeam}`);
      await runTransaction(teamRef, (currentVotes) => (currentVotes || 0) + 1);
      const totalRef = ref(db, 'voteState/totalVotes');
      await runTransaction(totalRef, (currentTotal) => (currentTotal || 0) + 1);

      setIsSubmitting(false);
      setHasVoted(true);
      localStorage.setItem('hasVoted_cyberark', 'true');
    } catch (error) {
      console.error("投票失敗:", error);
      setIsSubmitting(false);
      alert("連線不穩定，請再試一次！");
    }
  };

  // ==========================================
  // 5. 畫面渲染 (Render)
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-start p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <audio ref={audioRef} loop />

      {/* 音控按鈕 */}
      <button 
        onClick={toggleAudio}
        className={`absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full backdrop-blur-md transition-all border shadow-lg flex items-center gap-2
          ${isAudioEnabled && !userMuted 
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30' 
            : 'bg-indigo-600/50 border-indigo-400 text-white hover:bg-indigo-500'
          }
        `}
      >
        <span className="text-base">{(!isAudioEnabled || userMuted) ? '🔇' : '🔊'}</span>
        <span className="text-xs font-bold tracking-wider">
          {!isAudioEnabled ? '點擊開啟音效' : (userMuted ? '音樂已暫停' : '音樂播放中')}
        </span>
      </button>

      {/* 背景特效 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0 transition-colors duration-1000" style={{ backgroundColor: currentStage === 'reveal' ? 'rgba(251, 191, 36, 0.1)' : '' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 標題區 */}
      <div className="text-center my-6 z-10 mt-14 transition-all duration-700">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] tracking-widest">
          數位聖殿
        </h1>
        <p className="text-indigo-200 text-[10px] tracking-[0.3em] uppercase opacity-80 font-bold">
          神學學院戲劇決選
        </p>
      </div>

      {/* 🌟 階段一：等待中 (無限輪播) */}
      {currentStage === 'waiting' && !hasVoted && (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto z-10 pb-10 select-none">
          <div className="text-center mb-4">
             <span className="text-sm font-bold text-amber-400 tracking-widest animate-pulse border border-amber-400/30 bg-amber-400/10 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.2)]">
               等待投票開始
             </span>
          </div>

          <div 
            className="relative w-full overflow-hidden flex-1 rounded-2xl cursor-grab active:cursor-grabbing"
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseUp={(e) => handleDragEnd(e.clientX)}
            onMouseLeave={(e) => isDragging && handleDragEnd(e.clientX)}
          >
            <div 
              className={`flex w-full h-full ${isTransitioning ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {EXTENDED_PREVIEWS.map((preview, idx) => (
                <div key={`preview-${idx}`} className="w-full h-full flex-shrink-0 px-2 py-2 flex flex-col justify-center pointer-events-none">
                  <div className="relative w-full h-[60vh] min-h-[420px] max-h-[550px] rounded-2xl overflow-hidden border border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-slate-900/80 flex flex-col">
                    <div className="relative flex-1 w-full bg-slate-800 min-h-[200px]">
                      <img 
                        src={preview.image} 
                        alt={preview.title} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/1e293b/fbbf24?text=IMAGE+LOADING' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    </div>
                    <div className="relative shrink-0 p-5 flex flex-col justify-start backdrop-blur-xl bg-slate-900/60 border-t border-slate-700/50">
                      <h3 className="text-xl font-bold text-amber-300 mb-2 drop-shadow-md">{preview.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed tracking-wide text-justify opacity-90">{preview.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-6">
            {PREVIEWS.map((_, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(i + 1);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${i === realIndex ? 'w-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-2 bg-slate-700'}`} 
              />
            ))}
          </div>
          <p className="text-center text-slate-500 text-xs mt-4 animate-bounce">
            ← 左右滑動預覽劇本 →
          </p>
        </div>
      )}

      {/* 🌟 階段二：揭曉結果 (專注大螢幕模式) */}
      {currentStage === 'reveal' && (
        <div className="z-10 text-center bg-slate-900/60 p-10 rounded-3xl border border-amber-500/50 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.2)] animate-fade-in mt-20 w-full max-w-sm relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent animate-pulse"></div>
           <span className="text-6xl mb-6 block animate-bounce drop-shadow-lg">✨</span>
           <h2 className="text-3xl font-black text-amber-400 mb-3 tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
             請看大螢幕
           </h2>
           <p className="text-indigo-200 text-lg font-medium tracking-wide">
             榮耀時刻，正在揭曉！
           </p>
        </div>
      )}

      {/* 🌟 階段三：投票進行中 */}
      {currentStage === 'voting' && !hasVoted && (
        <div className="w-full max-w-sm flex flex-col gap-4 z-10 animate-fade-in mt-6">
          <div className="text-center mb-4">
            <span className="text-amber-500 text-xs font-black tracking-[0.3em] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              STAGE 02
            </span>
            <h2 className="text-2xl text-white font-bold mt-3 tracking-widest drop-shadow-md">
              請選擇您的最佳啟示
            </h2>
            <p className="text-indigo-300/60 text-xs mt-1 flex justify-center items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              全場通道已開啟，即時接收中...
            </p>
          </div>
          
          {teams.length === 0 && <p className="text-center text-slate-500 my-10 animate-pulse">神聖印記載入中...</p>}
          
          <div className="flex flex-col gap-3">
            {teams.map((team, index) => {
              const previewData = 
                PREVIEWS.find(p => team.name.includes(p.shortName)) || 
                PREVIEWS.find(p => p.id === team.id) || 
                PREVIEWS[0];

              const isSelected = selectedTeam === team.id;
              const isOtherSelected = selectedTeam !== null && !isSelected;

              return (
                <button
                  key={team.id}
                  onClick={() => {
                    if (hasVoted || currentStage !== 'voting') return;
                    setSelectedTeam(team.id);
                    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
                  }}
                  disabled={isSubmitting}
                  className={`
                    relative overflow-hidden w-full rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] text-left group border
                    ${isSelected 
                      ? 'h-[240px] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50 scale-[1.02] z-20' 
                      : 'h-[100px] border-slate-700/50 hover:border-slate-500 z-10'
                    }
                    ${isOtherSelected ? 'opacity-40 grayscale-[70%] h-[70px]' : 'opacity-100'}
                  `}
                >
                  <div className={`absolute inset-0 transition-transform duration-1000 ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                    <img 
                      src={previewData.image} 
                      alt={team.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x200/1e293b/fbbf24?text=IMAGE+LOADING' }}
                    />
                  </div>
                  <div className={`absolute inset-0 transition-colors duration-700 ${isSelected ? 'bg-gradient-to-t from-slate-950 via-slate-900/60 to-amber-900/20' : 'bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60'}`}></div>

                  <div className={`absolute inset-0 p-4 flex flex-col transition-all duration-700 ${isSelected ? 'justify-end' : 'justify-center'}`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col gap-1">
                        <p className={`font-mono tracking-[0.2em] transition-all duration-500 ${isSelected ? 'text-amber-400 text-[10px]' : 'text-slate-400 text-[9px]'}`}>
                          CANDIDATE // 0{index + 1}
                        </p>
                        <h3 className={`font-bold transition-all duration-500 ${isSelected ? 'text-2xl text-white drop-shadow-lg' : 'text-lg text-slate-200'}`}>
                          {team.name}
                        </h3>
                      </div>

                      <div className={`w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center bg-slate-900/80 shadow-[0_0_15px_rgba(251,191,36,0.5)] backdrop-blur-md transition-all duration-500 transform origin-center ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90 absolute right-4'}`}>
                        <span className="text-amber-400 font-black text-xl">✓</span>
                      </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-700 ease-out ${isSelected ? 'max-h-[60px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                       <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">{previewData.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleVote}
            disabled={!selectedTeam || isSubmitting || teams.length === 0}
            className={`
              mt-6 w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all duration-500 relative overflow-hidden group
              ${(!selectedTeam || teams.length === 0)
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50 backdrop-blur-sm' 
                : isSubmitting
                  ? 'bg-amber-700 text-white cursor-wait scale-95'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] hover:-translate-y-1 active:scale-95'
              }
            `}
          >
            {selectedTeam && !isSubmitting && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
            <span className="relative z-10">
              {isSubmitting ? '正在銘刻您的選擇...' : '送出神聖一票'}
            </span>
          </button>
        </div>
      )}

      {/* 投票完成狀態 */}
      {hasVoted && currentStage !== 'reveal' && (
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center bg-slate-900/60 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-md z-10 animate-fade-in shadow-2xl shadow-indigo-500/10 mt-20">
          <div className="relative w-24 h-24 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]"><span className="text-4xl text-slate-900 drop-shadow-md">✓</span></div>
          </div>
          <h2 className="text-2xl font-black text-amber-400 mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">投票已送出</h2>
          <p className="text-indigo-200 leading-relaxed font-medium">感謝您的神聖一票！<br />請等待主持人進行開票</p>
        </div>
      )}

      <div className="absolute bottom-2 text-[10px] text-slate-600 font-mono tracking-widest z-0">
        SYSTEM: CYBER_ARK_V1.6_MOBILE_FINAL
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
}