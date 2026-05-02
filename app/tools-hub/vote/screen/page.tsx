'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb as db } from '../../../../lib/firebase'; 
import confetti from 'canvas-confetti';

interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  text: string;
}

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
  
  const [revealStep, setRevealStep] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const cheerAudioRef = useRef<HTMLAudioElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
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
        if (audioRef.current && isAudioEnabled && !userMuted) {
          audioRef.current.src = musicTracks[data as keyof typeof musicTracks];
          audioRef.current.play().catch(e => console.log("等待點擊解鎖音效", e));
        }
      }
    });

    const revealStepRef = ref(db, 'voteState/revealStep');
    const unsubRevealStep = onValue(revealStepRef, (snapshot) => {
      const step = snapshot.val() || 0;
      if (step > revealStep && step > 0 && step <= 3 && cheerAudioRef.current && !userMuted) {
        cheerAudioRef.current.currentTime = 0;
        cheerAudioRef.current.play().catch(e => console.log("音效播放失敗", e));
      }
      setRevealStep(step);
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
      unsubStage(); unsubRevealStep(); unsubTotal(); unsubTeamsList(); unsubTeamsVote();
    };
  }, [isAudioEnabled, userMuted, revealStep]);

  useEffect(() => {
    if (revealStep === 3 && stage === 'reveal') {
      fireConfetti();
    }
  }, [revealStep, stage]);

  const fireConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b', '#ffffff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b', '#ffffff'] });
    }, 250);
  };

  const toggleAudio = () => {
    if (userMuted) {
      setUserMuted(false);
      if (audioRef.current) audioRef.current.play();
    } else {
      setUserMuted(true);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current && isAudioEnabled && !userMuted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [isAudioEnabled, userMuted]);

  const sortedTeams = [...teams].sort((a, b) => (teamVotes[b.id] || 0) - (teamVotes[a.id] || 0));
  const topThree = sortedTeams.slice(0, 3).map((team, index) => {
    const preview = 
      PREVIEWS.find(p => team.name.includes(p.title.replace('《', '').replace('》', ''))) || 
      PREVIEWS.find(p => p.id === team.id) ||
      PREVIEWS[0];
    return { ...team, votes: teamVotes[team.id] || 0, preview };
  });

  const renderPoster = (rank: number, title: string, medal: string, index: number, isVisible: boolean) => {
    if (!isVisible || !topThree[index]) return null;
    const team = topThree[index];
    const isChampion = rank === 1;

    return (
      <div className={`flex flex-col items-center animate-slide-up-fade ${isChampion ? 'order-2 z-50' : rank === 2 ? 'order-1 z-10' : 'order-3 z-10'}`}>
        <div className={`
          relative overflow-hidden rounded-xl border-2 transition-all duration-1000
          ${isChampion 
            ? 'w-[340px] h-[480px] lg:w-[380px] lg:h-[550px] 2xl:w-[450px] 2xl:h-[650px] border-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.6)] scale-100' 
            : 'w-[240px] h-[340px] lg:w-[260px] lg:h-[380px] 2xl:w-[300px] 2xl:h-[450px] border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] opacity-90 scale-95 mt-12 lg:mt-16 2xl:mt-20'
          }
        `}>
          <img src={team.preview.image} alt={team.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className={`absolute inset-0 bg-gradient-to-t ${isChampion ? 'from-black via-black/60 to-transparent' : 'from-black via-black/80 to-transparent'} `}></div>
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 flex flex-col items-center text-center">
            <span className={`text-5xl lg:text-6xl drop-shadow-lg mb-3 lg:mb-4 ${isChampion ? 'animate-bounce' : ''}`}>{medal}</span>
            <h4 className={`font-mono tracking-[0.3em] mb-1 lg:mb-2 ${isChampion ? 'text-amber-400 text-lg lg:text-xl' : 'text-slate-400 text-xs lg:text-sm'}`}>{title}</h4>
            <h2 className={`font-bold text-white mb-3 lg:mb-4 font-serif tracking-widest ${isChampion ? 'text-2xl lg:text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-lg lg:text-2xl'}`}>{team.name}</h2>
            <div className={`px-5 py-1.5 lg:px-6 lg:py-2 rounded-full backdrop-blur-md border ${isChampion ? 'bg-amber-500/20 border-amber-400/50' : 'bg-slate-800/60 border-slate-600'}`}>
               <span className={`font-black font-mono tracking-widest ${isChampion ? 'text-amber-400 text-2xl lg:text-3xl' : 'text-slate-200 text-lg lg:text-xl'}`}>
                 {team.votes} 票
               </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🌟 將架構從 absolute 疊加，改為 flex-col 安全堆疊
  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex flex-col relative overflow-hidden font-sans selection:bg-amber-500/30">
      
      <audio ref={audioRef} loop />
      <audio ref={cheerAudioRef} src="/music/cheer.mp3" /> 

      {/* 音控面板 */}
      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 flex items-center gap-4">
        <button onClick={toggleAudio} className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${!userMuted ? 'bg-slate-900/40 border-slate-600/50 text-slate-300 hover:bg-slate-800/60 opacity-60 hover:opacity-100' : 'bg-red-900/30 border-red-500/30 text-red-400 opacity-80 hover:opacity-100'}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40"><span className="text-lg">{(!userMuted) ? '🔊' : '🔇'}</span></div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Audio System</span>
            <span className="text-xs font-bold tracking-widest">{!userMuted ? 'PLAYING' : 'MUTED'}</span>
          </div>
        </button>
      </div>

      {/* 背景視覺 (保持 absolute 鋪滿全螢幕) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/stage-bg.jpg" 
          alt="Stage Background"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10] via-transparent to-[#0a0c10] opacity-90"></div>
        <div className={`absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[1200px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${stage === 'reveal' ? 'bg-amber-600/20' : 'bg-blue-900/20'}`}></div>
      </div>

      {/* 🌟 1. 頂部主標題與裝飾線 (改為 relative，排在最上方) */}
      <div className="relative z-20 flex flex-col items-center w-full pt-10 pb-4 shrink-0">
        <h1 className={`text-5xl lg:text-6xl font-black text-transparent bg-clip-text font-serif tracking-[0.2em] transition-all duration-1000 mb-1 ${stage === 'reveal' ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-110' : 'bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'}`}>
          數位聖殿
        </h1>
        {/* 縮小了 divider 的高度，讓比例更精緻 */}
        <img 
          src="/images/divider.png" 
          alt="Classical Divider" 
          className="h-8 lg:h-12 object-contain mt-3 mb-2 opacity-90 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mix-blend-screen"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <p className="text-amber-500/60 tracking-[0.6em] lg:tracking-[0.8em] text-sm lg:text-lg uppercase font-bold">
          神學學院戲劇決選
        </p>
      </div>

      {/* 🌟 2. 主要內容區塊 (使用 flex-1 填滿剩餘高度，內容自動在安全區內置中) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 pb-16 lg:pb-20">
        
        {/* 階段一：等待中 */}
        {stage === 'waiting' && (
          <div className="flex flex-col items-center animate-fade-in relative w-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative p-[3px] bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-sm mb-10 shadow-[0_0_40px_rgba(251,191,36,0.3)] z-10">
              <div className="bg-[#12151c] p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500/50"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500/50"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-500/50"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-500/50"></div>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://guitarchordforworship.web.app/tools-hub/vote/mobile&color=0f172a&bgcolor=fef3c7" 
                  alt="QR Code" 
                  className="w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] relative z-10 shadow-inner mix-blend-screen"
                  style={{ filter: 'contrast(1.2) brightness(0.9)' }}
                />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl text-amber-50 font-serif font-medium mb-4 tracking-[0.2em] lg:tracking-[0.3em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex items-center gap-4 lg:gap-6">
              <span className="w-12 lg:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-500/80"></span>
              請掃描印記以進入聖殿
              <span className="w-12 lg:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-500/80"></span>
            </h2>
            <p className="text-amber-500/80 tracking-[0.4em] text-lg lg:text-xl animate-[pulse_4s_ease-in-out_infinite] font-light mt-2">
              等待儀式啟動...
            </p>
          </div>
        )}

        {/* 階段二：投票中 */}
        {stage === 'voting' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-48 h-48 lg:w-64 lg:h-64 mb-12 lg:mb-16 relative flex items-center justify-center">
              <div className="absolute inset-0 border-[4px] border-t-amber-400 border-r-amber-700 border-b-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
              <div className="absolute inset-6 border-[2px] border-t-transparent border-r-transparent border-b-amber-300 border-l-amber-600 rounded-full animate-[spin_3s_linear_reverse]"></div>
              <div className="absolute inset-12 bg-amber-900/30 rounded-full blur-md animate-pulse"></div>
              <span className="text-6xl lg:text-7xl text-amber-400 animate-pulse relative z-10 drop-shadow-[0_0_20px_#fbbf24] font-serif">⌛</span>
            </div>
            <h2 className="text-4xl lg:text-5xl text-white font-serif mb-6 lg:mb-8 tracking-[0.3em] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              神聖通道已開啟
            </h2>
            <div className="flex items-center justify-center bg-[#12151c]/80 backdrop-blur-md border border-amber-900/50 px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-2xl">
              <p className="text-xl lg:text-2xl text-amber-100/80 tracking-[0.2em] font-serif">
                已接收 <span className="text-5xl lg:text-6xl text-amber-400 font-bold mx-4 lg:mx-6 drop-shadow-[0_0_25px_#fbbf24] font-sans">{totalVotes}</span> 份啟示
              </p>
            </div>
          </div>
        )}

        {/* 階段三：開票揭曉 */}
        {stage === 'reveal' && (
          <div className="w-full max-w-[1600px] flex flex-col items-center px-6 lg:px-10">
            {revealStep === 0 && (
              <div className="flex flex-col items-center justify-center h-[40vh] animate-pulse">
                <div className="w-24 h-24 lg:w-32 lg:h-32 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(251,191,36,0.2)]"></div>
                <h2 className="text-3xl lg:text-5xl font-serif text-amber-400 tracking-[0.3em] lg:tracking-[0.4em] drop-shadow-[0_0_15px_#fbbf24]">正在彙整神聖印記...</h2>
              </div>
            )}
            <div className="flex justify-center items-end gap-6 lg:gap-16 w-full">
              {renderPoster(3, "THIRD PLACE", "🥉", 2, revealStep >= 1)}
              {renderPoster(1, "CHAMPION", "🏆", 0, revealStep >= 3)}
              {renderPoster(2, "SECOND PLACE", "🥈", 1, revealStep >= 2)}
            </div>
          </div>
        )}
        
      </div>

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