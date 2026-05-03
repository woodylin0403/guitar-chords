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
  
  // 🌟 新增：即時在線人數狀態
  const [onlineCount, setOnlineCount] = useState(0);

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
    onValue(stageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStage(data);
        if (audioRef.current && isAudioEnabled && !userMuted) {
          audioRef.current.src = musicTracks[data as keyof typeof musicTracks];
          audioRef.current.play().catch(() => {});
        }
      }
    });

    const revealStepRef = ref(db, 'voteState/revealStep');
    onValue(revealStepRef, (snapshot) => {
      const step = snapshot.val() || 0;
      if (step > revealStep && step > 0 && step <= 3 && cheerAudioRef.current && !userMuted) {
        cheerAudioRef.current.currentTime = 0;
        cheerAudioRef.current.play().catch(() => {});
      }
      setRevealStep(step);
    });

    // 🌟 監聽即時在線人數
    const activeUsersRef = ref(db, 'activeUsers');
    onValue(activeUsersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOnlineCount(Object.keys(data).length);
      } else {
        setOnlineCount(0);
      }
    });

    // 其他監聽 (票數、隊伍等) 保持不變...
    onValue(ref(db, 'voteState/totalVotes'), (snapshot) => setTotalVotes(snapshot.val() || 0));
    onValue(ref(db, 'teamsList'), (snapshot) => {
      const data = snapshot.val();
      if (data) setTeams(Object.keys(data).map(key => ({ id: key, ...data[key] })));
    });
    onValue(ref(db, 'teamVotes'), (snapshot) => setTeamVotes(snapshot.val() || {}));

  }, [isAudioEnabled, userMuted, revealStep]);

  useEffect(() => {
    if (revealStep === 3 && stage === 'reveal') fireConfetti();
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
    setUserMuted(!userMuted);
    if (audioRef.current) {
      if (!userMuted) audioRef.current.pause();
      else audioRef.current.play();
    }
  };

  // 解鎖音效
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
    const preview = PREVIEWS.find(p => team.name.includes(p.title.replace('《', '').replace('》', ''))) || PREVIEWS[0];
    return { ...team, votes: teamVotes[team.id] || 0, preview };
  });

  const renderPoster = (rank: number, title: string, medal: string, index: number, isVisible: boolean) => {
    if (!isVisible || !topThree[index]) return null;
    const team = topThree[index];
    const isChampion = rank === 1;
    return (
      <div className={`flex flex-col items-center animate-slide-up-fade ${isChampion ? 'order-2 z-50' : rank === 2 ? 'order-1 z-10' : 'order-3 z-10'}`}>
        <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-1000 ${isChampion ? 'w-[340px] h-[480px] lg:w-[380px] lg:h-[550px] 2xl:w-[450px] 2xl:h-[650px] border-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.6)]' : 'w-[240px] h-[340px] lg:w-[260px] lg:h-[380px] 2xl:w-[300px] 2xl:h-[450px] border-slate-600/50 opacity-90 mt-12 lg:mt-20'}`}>
          <img src={team.preview.image} alt={team.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 flex flex-col items-center text-center">
            <span className={`text-5xl lg:text-6xl mb-4 ${isChampion ? 'animate-bounce' : ''}`}>{medal}</span>
            <h4 className={`font-mono tracking-[0.3em] mb-2 ${isChampion ? 'text-amber-400 text-lg lg:text-xl' : 'text-slate-400 text-sm'}`}>{title}</h4>
            <h2 className={`font-bold text-white mb-4 font-serif tracking-widest ${isChampion ? 'text-2xl lg:text-4xl' : 'text-lg lg:text-2xl'}`}>{team.name}</h2>
            <div className={`px-5 py-1.5 lg:px-6 lg:py-2 rounded-full bg-slate-900/80 border ${isChampion ? 'border-amber-400' : 'border-slate-600'}`}>
               <span className="font-black font-mono text-amber-400 text-2xl lg:text-3xl">{team.votes} 票</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex flex-col relative overflow-hidden font-sans">
      <audio ref={audioRef} loop />
      <audio ref={cheerAudioRef} src="/music/cheer.mp3" /> 

      {/* 音控 */}
      <div className="absolute bottom-8 right-8 z-50">
        <button onClick={toggleAudio} className="p-4 rounded-full bg-slate-900/40 border border-slate-600/50 text-slate-300">
          {!userMuted ? '🔊' : '🔇'}
        </button>
      </div>

      {/* 背景 */}
      <div className="absolute inset-0 z-0">
        <img src="/images/stage-bg.jpg" alt="bg" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10] via-transparent to-[#0a0c10] opacity-90"></div>
      </div>

      {/* 標題區 */}
      <div className="relative z-20 flex flex-col items-center w-full pt-10 pb-4 shrink-0">
        <h1 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text font-serif tracking-[0.2em] bg-gradient-to-b from-amber-200 to-amber-600">數位聖殿</h1>
        <img src="/images/divider.png" alt="divider" className="h-8 lg:h-12 object-contain mt-3 mb-2 opacity-90 mix-blend-screen" />
        <p className="text-amber-500/60 tracking-[0.8em] text-sm lg:text-lg uppercase font-bold">神學學院戲劇決選</p>
      </div>

      {/* 內容區 */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 pb-20">
        {stage === 'waiting' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative p-[3px] bg-gradient-to-b from-amber-300 to-amber-900 rounded-sm mb-6 shadow-2xl">
              <div className="bg-[#12151c] p-6 lg:p-8 relative">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://guitarchordforworship.web.app/tools-hub/vote/mobile&color=0f172a&bgcolor=fef3c7" alt="QR" className="w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] mix-blend-screen" />
              </div>
            </div>
            
            {/* 🌟 這裡新增：即時見證者計數器 */}
            <div className="mb-8 flex flex-col items-center gap-2">
               <div className="px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                 <p className="text-amber-400 font-serif tracking-[0.2em] text-lg lg:text-2xl">
                   已有 <span className="font-sans font-black text-3xl lg:text-4xl mx-2 animate-pulse">{onlineCount}</span> 位見證者進入聖殿
                 </p>
               </div>
               <p className="text-amber-500/40 text-xs tracking-widest uppercase">Real-time Presence System</p>
            </div>

            <h2 className="text-3xl lg:text-4xl text-amber-50 font-serif tracking-[0.2em] flex items-center gap-6">
              <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-500/80"></span>
              請掃描印記以進入聖殿
              <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-500/80"></span>
            </h2>
          </div>
        )}

        {/* 投票中、揭曉中區塊 (代碼與之前一致) ... */}
        {stage === 'voting' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-48 h-48 lg:w-64 lg:h-64 mb-16 relative flex items-center justify-center">
              <div className="absolute inset-0 border-[4px] border-t-amber-400 border-r-amber-700 rounded-full animate-spin"></div>
              <span className="text-6xl lg:text-7xl text-amber-400 animate-pulse font-serif">⌛</span>
            </div>
            <h2 className="text-4xl lg:text-5xl text-white font-serif mb-8 tracking-[0.3em]">神聖通道已開啟</h2>
            <div className="bg-[#12151c]/80 border border-amber-900/50 px-12 py-6 rounded-full">
              <p className="text-xl lg:text-2xl text-amber-100/80 tracking-[0.2em] font-serif">
                已接收 <span className="text-5xl lg:text-6xl text-amber-400 font-bold mx-6 font-sans">{totalVotes}</span> 份啟示
              </p>
            </div>
          </div>
        )}

        {stage === 'reveal' && (
          <div className="w-full max-w-[1600px] flex flex-col items-center px-10">
            {revealStep === 0 && <h2 className="text-3xl lg:text-5xl font-serif text-amber-400 tracking-[0.4em] animate-pulse">正在彙整神聖印記...</h2>}
            <div className="flex justify-center items-end gap-6 lg:gap-16 w-full">
              {renderPoster(3, "THIRD PLACE", "🥉", 2, revealStep >= 1)}
              {renderPoster(1, "CHAMPION", "🏆", 0, revealStep >= 3)}
              {renderPoster(2, "SECOND PLACE", "🥈", 1, revealStep >= 2)}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        @keyframes slide-up-fade { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up-fade { animation: slide-up-fade 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}