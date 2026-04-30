'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
// 🌟 引入你的 Firebase
import { rtdb as db } from '../../../../lib/firebase'; 

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
  
  // 🌟 動態隊伍資料
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [teamVotes, setTeamVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!db) return;

    const stageRef = ref(db, 'voteState/stage');
    const unsubStage = onValue(stageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setStage(data);
    });

    const totalRef = ref(db, 'voteState/totalVotes');
    const unsubTotal = onValue(totalRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setTotalVotes(data);
    });

    // 🌟 監聽隊伍清單
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

    // 監聽各隊票數
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
  }, []);

  // 找出最高票
  const maxVotes = Math.max(...Object.values(teamVotes), 1);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[150px] pointer-events-none"></div>

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
              {/* ⚠️ 請把這個網址換成你未來實際上線的網址！ */}
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
            const isWinner = voteCount === maxVotes && voteCount > 0;

            return (
              <div key={team.id} className="relative flex flex-col items-center justify-end h-full flex-1 min-w-[150px] max-w-[250px]">
                
                <div className={`mb-6 text-center transition-all duration-1000 delay-1000 ${voteCount > 0 ? 'opacity-100' : 'opacity-0'} ${isWinner ? 'scale-125 -translate-y-4' : ''}`}>
                  {isWinner && <div className="text-amber-400 text-3xl mb-1 animate-bounce">👑</div>}
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

                <div className="w-full h-20 mt-2 bg-slate-900 border-t-4 border-slate-700 rounded-lg flex flex-col items-center justify-center relative z-20 shadow-2xl px-2">
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