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
  shadow: string;
  text: string;
}

export default function ScreenVote() {
  const [stage, setStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [teamVotes, setTeamVotes] = useState<Record<string, number>>({});
  
  // 音樂播放器 Ref
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // 🌟 音樂清單 (請將這三個 mp3 檔案放在 public/music 資料夾下)
  const musicTracks = {
    waiting: '/music/waiting.mp3', // 輕鬆放鬆的音樂
    voting: '/music/voting.mp3',   // 緊張倒數的音樂
    reveal: '/music/reveal.mp3'    // 歡慶勝利的音樂
  };

  useEffect(() => {
    if (!db) return;

    const stageRef = ref(db, 'voteState/stage');
    const unsubStage = onValue(stageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStage(data);
        // 切換音樂
        if (audioRef.current && isAudioEnabled) {
          audioRef.current.src = musicTracks[data as keyof typeof musicTracks];
          audioRef.current.play().catch(e => console.log("音樂播放被瀏覽器阻擋:", e));
        }

        // 🌟 觸發灑花特效
        if (data === 'reveal') {
          fireConfetti();
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
        const teamsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
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
      unsubStage();
      unsubTotal();
      unsubTeamsList();
      unsubTeamsVote();
    };
  }, [isAudioEnabled]);

  // 🌟 灑花特效函數
  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // 🌟 啟動音效按鈕處理
  const enableAudio = () => {
    setIsAudioEnabled(true);
    if (audioRef.current) {
      audioRef.current.src = musicTracks[stage];
      audioRef.current.play();
    }
  };

  // 計算並排序前三名
  const sortedTeams = [...teams].sort((a, b) => (teamVotes[b.id] || 0) - (teamVotes[a.id] || 0));
  const topThree = sortedTeams.slice(0, 3);
  const maxVotes = Math.max(...Object.values(teamVotes), 1);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[150px] pointer-events-none"></div>

      {/* 音樂播放器元件 (隱藏) */}
      <audio ref={audioRef} loop />

      {/* 啟動音效按鈕 (放在左上角) */}
      {!isAudioEnabled && (
        <button 
          onClick={enableAudio}
          className="absolute top-6 left-6 z-50 bg-indigo-600/50 hover:bg-indigo-500 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all border border-indigo-400"
        >
          🔊 點擊開啟背景音樂
        </button>
      )}

      <div className="absolute top-10 text-center z-20">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-2">
          數位聖殿
        </h1>
        <p className="text-indigo-300 tracking-[0.5em] text-lg uppercase font-bold opacity-80">
          神學學院戲劇決選
        </p>
      </div>

      {stage === 'waiting' && (
        <div className="z-10 flex flex-col items-center animate-fade-in mt-20">
          <div className="relative p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-8 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center">
              {/* ⚠️ 確認網址是你真正的投票頁面！ */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://guitarchordforworship.web.app/tools-hub/vote/mobile" 
                alt="QR Code" 
                className="w-64 h-64"
              />
            </div>
          </div>
          <h2 className="text-4xl text-white font-bold mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            請掃描 QR Code 進入投票所
          </h2>
          <p className="text-slate-400 tracking-widest text-xl mt-4 animate-pulse">請等待主持人指示後開始投票...</p>
        </div>
      )}

      {stage === 'voting' && (
        <div className="z-10 flex flex-col items-center animate-fade-in">
          <div className="w-48 h-48 mb-10 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-t-amber-400 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-t-transparent border-r-transparent border-b-amber-300 border-l-indigo-400 rounded-full animate-[spin_2s_linear_reverse]"></div>
            <span className="text-6xl text-amber-400 animate-pulse">⏳</span>
          </div>
          <h2 className="text-5xl text-white font-black mb-6 tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            神聖通道已開啟
          </h2>
          <p className="text-2xl text-indigo-200 tracking-widest mb-10 font-mono">
            已收集 <span className="text-6xl text-amber-400 font-bold mx-4 drop-shadow-[0_0_15px_#fbbf24]">{totalVotes}</span> 份啟示...
          </p>
        </div>
      )}

      {stage === 'reveal' && (
        <div className="z-10 w-full max-w-[1200px] flex justify-center items-end h-[60vh] mt-32 px-10 gap-8 animate-fade-in flex-wrap">
          {teams.map((team) => {
            const voteCount = teamVotes[team.id] || 0;
            const heightPercent = maxVotes > 0 ? Math.max((voteCount / maxVotes) * 100, 10) : 0; 
            
            // 判斷是否為前三名
            const rankIndex = topThree.findIndex(t => t.id === team.id);
            const isWinner = rankIndex !== -1 && voteCount > 0;
            
            // 給予不同名次對應的獎牌
            const medals = ['🥇', '🥈', '🥉'];
            const medal = isWinner ? medals[rankIndex] : null;

            return (
              <div key={team.id} className={`relative flex flex-col items-center justify-end h-full flex-1 min-w-[150px] max-w-[250px] transition-all duration-700 ${isWinner && rankIndex === 0 ? 'z-30' : 'z-10'}`}>
                
                <div className={`mb-6 text-center transition-all duration-1000 delay-1000 ${voteCount > 0 ? 'opacity-100' : 'opacity-0'} ${isWinner ? 'scale-110 -translate-y-2' : ''}`}>
                  {medal && <div className={`text-4xl mb-2 ${rankIndex === 0 ? 'animate-bounce' : ''}`}>{medal}</div>}
                  <span className={`text-6xl font-black ${team.text} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}>
                    {voteCount}
                  </span>
                </div>

                <div className="relative w-full max-w-[100px] flex justify-center">
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all ease-out bg-gradient-to-t ${team.color} opacity-80 backdrop-blur-md`}
                    style={{ 
                      height: `${heightPercent}%`,
                      transitionDuration: '2.5s', 
                      boxShadow: `0 0 50px var(--tw-shadow-color)`,
                    }}
                  >
                    <div className="absolute inset-x-1/4 top-0 bottom-0 bg-white/30 blur-sm rounded-t-lg"></div>
                  </div>
                </div>

                <div className={`w-full h-20 mt-2 bg-slate-900 border-t-4 ${isWinner && rankIndex === 0 ? 'border-amber-400 scale-105' : 'border-slate-700'} rounded-lg flex flex-col items-center justify-center relative shadow-2xl px-2 transition-transform duration-500`}>
                  <div className={`absolute top-[-4px] left-0 w-full h-1 bg-gradient-to-r ${team.color} blur-[2px]`}></div>
                  <span className="text-3xl mb-1">{team.icon}</span>
                  <span className="text-slate-300 text-sm font-bold text-center w-full truncate">{team.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; filter: blur(10px); transform: scale(0.95); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}