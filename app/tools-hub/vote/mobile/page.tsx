'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, runTransaction } from 'firebase/database';
// 🌟 引入你的 Firebase
import { rtdb as db } from '../../../../lib/firebase'; 

interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
}

export default function MobileVote() {
  // 🌟 動態隊伍資料
  const [teams, setTeams] = useState<Team[]>([]);
  
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');

  useEffect(() => {
    if (!db) return;
    
    // 監聽狀態
    const stageRef = ref(db, 'voteState/stage');
    const unsubscribeStage = onValue(stageRef, (snapshot) => {
      const stage = snapshot.val();
      if (stage) setCurrentStage(stage);
      if (stage === 'waiting') {
        setHasVoted(false);
        setSelectedTeam(null);
        localStorage.removeItem('hasVoted_cyberark');
      }
    });

    // 🌟 監聽隊伍清單
    const teamsListRef = ref(db, 'teamsList');
    const unsubscribeTeams = onValue(teamsListRef, (snapshot) => {
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

    if (localStorage.getItem('hasVoted_cyberark')) {
      setHasVoted(true);
    }

    return () => {
      unsubscribeStage();
      unsubscribeTeams();
    };
  }, []);

  const handleSelect = (id: string) => {
    if (hasVoted || currentStage !== 'voting') return;
    setSelectedTeam(id);
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
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

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] tracking-widest">
          數位聖殿
        </h1>
        <p className="text-indigo-200 text-xs tracking-[0.3em] uppercase opacity-80 font-bold">
          神學學院戲劇決選
        </p>
      </div>

      {currentStage === 'waiting' && !hasVoted && (
        <div className="z-10 text-center bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md">
           <span className="text-5xl mb-4 block animate-pulse">⏳</span>
           <h2 className="text-2xl font-bold text-amber-400 mb-2">等待指示</h2>
           <p className="text-slate-300">請等待主持人宣佈「開放投票」</p>
        </div>
      )}

      {currentStage === 'reveal' && (
        <div className="z-10 text-center bg-slate-900/60 p-8 rounded-3xl border border-red-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-fade-in">
           <span className="text-5xl mb-4 block animate-bounce">👑</span>
           <h2 className="text-2xl font-bold text-red-400 mb-2 tracking-widest">投票已截止</h2>
           <p className="text-slate-300">請看大螢幕，正在進行揭曉儀式！</p>
        </div>
      )}

      {currentStage === 'voting' && !hasVoted && (
        <div className="w-full max-w-sm flex flex-col gap-4 z-10 animate-fade-in">
          <p className="text-center text-slate-300 mb-2 font-medium tracking-wide">請選擇您心中的最佳戲劇</p>
          
          {teams.length === 0 && <p className="text-center text-slate-500">載入參賽隊伍中...</p>}
          
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team.id)}
              disabled={isSubmitting}
              className={`
                relative overflow-hidden w-full p-4 rounded-2xl border transition-all duration-300 text-left
                ${selectedTeam === team.id 
                  ? 'bg-slate-800/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)] scale-[1.02]' 
                  : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                }
                backdrop-blur-md group
              `}
            >
              {selectedTeam === team.id && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-400 shadow-[0_0_15px_#fbbf24]"></div>
              )}
              
              <div className="flex items-center gap-5 relative z-10 pl-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${team.color} ${team.glow} shadow-lg transition-transform duration-300 ${selectedTeam === team.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {team.icon}
                </div>
                <h3 className={`text-xl font-bold transition-colors duration-300 ${selectedTeam === team.id ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-slate-200'}`}>
                  {team.name}
                </h3>
              </div>
            </button>
          ))}

          <button
            onClick={handleVote}
            disabled={!selectedTeam || isSubmitting || teams.length === 0}
            className={`
              mt-8 w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all duration-300 relative overflow-hidden
              ${(!selectedTeam || teams.length === 0)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : isSubmitting
                  ? 'bg-amber-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:-translate-y-1'
              }
            `}
          >
            {isSubmitting ? '傳送中...' : '送出神聖一票'}
          </button>
        </div>
      )}

      {hasVoted && currentStage !== 'reveal' && (
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center bg-slate-900/60 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-md z-10 animate-fade-in shadow-2xl shadow-indigo-500/10">
          <div className="relative w-24 h-24 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              <span className="text-4xl text-slate-900 drop-shadow-md">✓</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-amber-400 mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            投票已送出
          </h2>
          <p className="text-indigo-200 leading-relaxed font-medium">
            感謝您的神聖一票！<br />
            請等待主持人進行開票
          </p>
        </div>
      )}

      <div className="absolute bottom-4 text-[10px] text-slate-600 font-mono tracking-widest">
        SYSTEM: CYBER_ARK_V1.0
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
}