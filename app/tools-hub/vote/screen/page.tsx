'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
// 🌟 引入你的 Firebase
import { rtdb as db } from '../../../../lib/firebase'; 
import confetti from 'canvas-confetti';

interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  text: string;
}

// 🌟 對應手機端的劇本圖片與簡介
const PREVIEWS = [
  { id: '1', title: '《劃破夜空的雞啼》', image: '/images/play1.jpg' },
  { id: '2', title: '《沉入深淵的斧頭》', image: '/images/play2.jpg' },
  { id: '3', title: '《皮不敏計畫》', image: '/images/play3.jpg' }
];

export default function ScreenVote() {
  const [stage, setStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [teamVotes, setTeamVotes] = useState<Record<string, number>>({});
  
  // 🌟 揭曉階段控制 (0: 準備, 1: 季軍, 2: 亞軍, 3: 冠軍)
  const [revealStep, setRevealStep] = useState(0);

  // 🌟 音樂控制
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [userMuted, setUserMuted] = useState(false);

  const musicTracks = {
    waiting: '/music/waiting.mp3',
    voting: '/music/voting.mp3',
    reveal: '/music/reveal.mp3'
  };

  useEffect(() => {
    if (!db) return;

    const stageRef = ref(db, 'voteState/stage');
    const unsubStage = onValue(stageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStage(data);
        
        // 音樂自動切換
        if (audioRef.current && isAudioEnabled && !userMuted) {
          audioRef.current.src = musicTracks[data as keyof typeof musicTracks];
          audioRef.current.play().catch(e => console.log("音樂播放被阻擋:", e));
        }

        // 階段重置
        if (data === 'waiting' || data === 'voting') {
          setRevealStep(0);
        }
      }
    });

    const totalRef = ref(db, 'voteState/totalVotes');
    const unsubTotal = onValue(totalRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setTotalVotes(data);
    });

    const teamsListRef = ref(db, 'teamsList');
    const unsubTeamsList = onValue(teamsListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
    });

    const teamsVoteRef = ref(db, 'teamVotes');
    const unsubTeamsVote = onValue(teamsVoteRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTeamVotes(data);
    });

    return () => {
      unsubStage(); unsubTotal(); unsubTeamsList(); unsubTeamsVote();
    };
  }, [isAudioEnabled, userMuted]);

  // 🌟 影展級別的揭曉排程
  useEffect(() => {
    if (stage === 'reveal' && revealStep === 0 && teams.length > 0) {
      // 等待 3 秒後揭曉季軍
      const t1 = setTimeout(() => setRevealStep(1), 3000);
      // 再等 4 秒後揭曉亞軍 (總計 7 秒)
      const t2 = setTimeout(() => setRevealStep(2), 7000);
      // 再等 5 秒後揭曉冠軍，並噴發彩帶 (總計 12 秒)
      const t3 = setTimeout(() => {
        setRevealStep(3);
        fireConfetti();
      }, 12000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [stage, revealStep, teams]);

  // 🌟 灑花特效 (加強版：金色與彩帶交錯)
  const fireConfetti = () => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      // 兩側發射
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b', '#ffffff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b', '#ffffff'] });
    }, 250);
  };

  // 🌟 音樂開關功能
  const toggleAudio = () => {
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      setUserMuted(false);
      if (audioRef.current) {
        audioRef.current.src = musicTracks[stage];
        audioRef.current.play();
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

  // 計算並排序前三名
  const sortedTeams = [...teams].sort((a, b) => (teamVotes[b.id] || 0) - (teamVotes[a.id] || 0));
  const topThree = sortedTeams.slice(0, 3).map((team, index) => {
    const preview = PREVIEWS.find(p => p.id === team.id) || PREVIEWS[index % PREVIEWS.length];
    return { ...team, votes: teamVotes[team.id] || 0, preview };
  });

  // 渲染獨立海報的函式
  const renderPoster = (rank: number, title: string, medal: string, index: number, isVisible: boolean) => {
    if (!isVisible || !topThree[index]) return null;
    const team = topThree[index];
    const isChampion = rank === 1;

    return (
      <div className={`flex flex-col items-center animate-slide-up-fade ${isChampion ? 'order-2 z-50' : rank === 2 ? 'order-1 z-10' : 'order-3 z-10'}`}>
        {/* 海報外框 */}
        <div className={`
          relative overflow-hidden rounded-xl border-2 transition-all duration-1000
          ${isChampion 
            ? 'w-[450px] h-[650px] border-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.6)] scale-100' 
            : 'w-[300px] h-[450px] border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] opacity-90 scale-95 mt-20'
          }
        `}>
          <img 
            src={team.preview.image} 
            alt={team.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* 下方漸層遮罩以突顯文字 */}
          <div className={`absolute inset-0 bg-gradient-to-t ${isChampion ? 'from-black via-black/60 to-transparent' : 'from-black via-black/80 to-transparent'} `}></div>
          
          <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
            <span className={`text-6xl drop-shadow-lg mb-4 ${isChampion ? 'animate-bounce' : ''}`}>{medal}</span>
            <h4 className={`font-mono tracking-[0.3em] mb-2 ${isChampion ? 'text-amber-400 text-xl' : 'text-slate-400 text-sm'}`}>{title}</h4>
            <h2 className={`font-bold text-white mb-4 ${isChampion ? 'text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-2xl'}`}>{team.name}</h2>
            <div className={`px-6 py-2 rounded-full backdrop-blur-md border ${isChampion ? 'bg-amber-500/20 border-amber-400/50' : 'bg-slate-800/60 border-slate-600'}`}>
               <span className={`font-black font-mono tracking-widest ${isChampion ? 'text-amber-400 text-3xl' : 'text-slate-200 text-xl'}`}>
                 {team.votes} 票
               </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 隱藏的音樂播放器 */}
      <audio ref={audioRef} loop />

      {/* 🌟 右下角：低調專業的音樂控制面板 */}
      <button 
        onClick={toggleAudio}
        className={`absolute bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300
          ${isAudioEnabled && !userMuted 
            ? 'bg-slate-900/40 border-slate-600/50 text-slate-300 hover:bg-slate-800/60 opacity-60 hover:opacity-100' 
            : 'bg-red-900/30 border-red-500/30 text-red-400 opacity-80 hover:opacity-100'
          }
        `}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40">
          <span className="text-lg">{(!isAudioEnabled || userMuted) ? '🔇' : '🔊'}</span>
        </div>
        <div className="flex flex-col items-start pr-2">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Audio System</span>
          <span className="text-xs font-bold tracking-widest">
            {!isAudioEnabled ? 'CLICK TO START' : (userMuted ? 'MUTED' : 'PLAYING')}
          </span>
        </div>
      </button>

      {/* 🌟 背景視覺：建議你可以加上 /images/stage-bg.jpg */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/stage-bg.jpg" 
          alt="Stage Background"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} // 如果沒這張圖就隱藏
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-80"></div>
        {/* 動態金色光暈 */}
        <div className={`absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[1000px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${stage === 'reveal' ? 'bg-amber-600/20' : 'bg-indigo-900/20'}`}></div>
      </div>

      <div className="absolute top-12 text-center z-20">
        <h1 className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r tracking-[0.2em] transition-all duration-1000 mb-2 ${stage === 'reveal' ? 'from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] scale-110' : 'from-amber-200 to-yellow-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]'}`}>
          數位聖殿
        </h1>
        <p className="text-indigo-300 tracking-[0.6em] text-xl uppercase font-bold opacity-80">
          神學學院戲劇決選
        </p>
      </div>

      {/* 階段一：等待中 */}
      {stage === 'waiting' && (
        <div className="z-10 flex flex-col items-center animate-fade-in mt-24">
          <div className="relative p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-10 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://guitarchordforworship.web.app/tools-hub/vote/mobile" 
                alt="QR Code" 
                className="w-80 h-80"
              />
            </div>
          </div>
          <h2 className="text-5xl text-white font-bold mb-4 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            請掃描 QR Code 進入投票所
          </h2>
          <p className="text-amber-400/80 tracking-widest text-2xl mt-4 animate-pulse">請等待主持人指示後開始投票...</p>
        </div>
      )}

      {/* 階段二：投票中 (科技感神聖通道) */}
      {stage === 'voting' && (
        <div className="z-10 flex flex-col items-center animate-fade-in mt-10">
          <div className="w-64 h-64 mb-16 relative flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-t-amber-400 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-[6px] border-t-transparent border-r-transparent border-b-amber-300 border-l-indigo-400 rounded-full animate-[spin_3s_linear_reverse]"></div>
            <div className="absolute inset-12 bg-indigo-900/50 rounded-full blur-md animate-pulse"></div>
            <span className="text-7xl text-amber-400 animate-pulse relative z-10 drop-shadow-[0_0_20px_#fbbf24]">⏳</span>
          </div>
          <h2 className="text-6xl text-white font-black mb-8 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            神聖通道已開啟
          </h2>
          <div className="flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50 px-12 py-6 rounded-full shadow-2xl">
            <p className="text-3xl text-indigo-200 tracking-widest font-mono">
              即時接收 <span className="text-7xl text-amber-400 font-bold mx-6 drop-shadow-[0_0_25px_#fbbf24]">{totalVotes}</span> 份啟示
            </p>
          </div>
        </div>
      )}

      {/* 🌟 階段三：開票揭曉 (奧斯卡影展級) */}
      {stage === 'reveal' && (
        <div className="z-10 w-full max-w-[1600px] flex flex-col items-center mt-32 px-10">
          
          {/* 懸念準備階段 */}
          {revealStep === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] animate-pulse">
              <div className="w-32 h-32 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-10 shadow-[0_0_30px_rgba(251,191,36,0.2)]"></div>
              <h2 className="text-5xl font-black text-amber-400 tracking-[0.3em] drop-shadow-[0_0_15px_#fbbf24]">正在彙整神聖印記...</h2>
            </div>
          )}

          {/* 排行榜海報展示區 (使用 Flex Order 排版，讓 1st 永遠在中間) */}
          <div className="flex justify-center items-end gap-16 w-full mt-10">
            {/* 季軍 (Index 2 in topThree) */}
            {renderPoster(3, "THIRD PLACE", "🥉", 2, revealStep >= 1)}
            
            {/* 冠軍 (Index 0 in topThree) */}
            {renderPoster(1, "CHAMPION", "🏆", 0, revealStep >= 3)}
            
            {/* 亞軍 (Index 1 in topThree) */}
            {renderPoster(2, "SECOND PLACE", "🥈", 1, revealStep >= 2)}
          </div>
          
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; filter: blur(10px); transform: scale(0.95); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up-fade { animation: slide-up-fade 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}