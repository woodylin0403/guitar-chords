'use client';
import React, { useState, useEffect } from 'react';

// 戲劇隊伍資料 (必須跟手機端一致)
const TEAMS = [
  { id: 'team1', name: '摩西過紅海', icon: '🌊', color: 'from-blue-500 to-cyan-300', shadow: 'shadow-blue-500', text: 'text-cyan-400' },
  { id: 'team2', name: '大衛擊敗歌利亞', icon: '🗡️', color: 'from-red-500 to-orange-300', shadow: 'shadow-orange-500', text: 'text-orange-400' },
  { id: 'team3', name: '五餅二魚', icon: '🥖', color: 'from-green-500 to-emerald-300', shadow: 'shadow-emerald-500', text: 'text-emerald-400' },
];

export default function ScreenVote() {
  // 階段控制：'waiting' (等待掃碼) -> 'voting' (盲投中) -> 'reveal' (開票)
  const [stage, setStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  
  // 模擬數據狀態
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [teamVotes, setTeamVotes] = useState({ team1: 0, team2: 0, team3: 0 });

  // 模擬：等待畫面時，人數不斷增加
  useEffect(() => {
    if (stage === 'waiting') {
      const interval = setInterval(() => {
        setConnectedUsers(prev => (prev < 284 ? prev + Math.floor(Math.random() * 3) + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // 模擬：投票進行中時，總票數不斷增加
  useEffect(() => {
    if (stage === 'voting') {
      const interval = setInterval(() => {
        setTotalVotes(prev => (prev < 256 ? prev + Math.floor(Math.random() * 5) + 1 : prev));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // 進入開票階段時，設定模擬的最終票數來觸發動畫
  const handleReveal = () => {
    setStage('reveal');
    // 延遲一點點讓畫面切換後再長出光柱
    setTimeout(() => {
      setTeamVotes({
        team1: 112, // 冠軍
        team2: 68,
        team3: 85,
      });
    }, 500);
  };

  // 找出最高票
  const maxVotes = Math.max(teamVotes.team1, teamVotes.team2, teamVotes.team3, 1); // 避免除以零

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 科技聖殿背景網格與光暈 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[150px] pointer-events-none"></div>

      {/* 頂部標題 */}
      <div className="absolute top-10 text-center z-20">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-2">
          數位聖殿
        </h1>
        <p className="text-indigo-300 tracking-[0.5em] text-lg uppercase font-bold opacity-80">
          神學學院戲劇決選
        </p>
      </div>

      {/* ================= 階段 1：等待掃碼 (Waiting) ================= */}
      {stage === 'waiting' && (
        <div className="z-10 flex flex-col items-center animate-fade-in mt-20">
          <div className="relative p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-8 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center">
              {/* 這裡先用線上 API 產生一個假的 QR Code，之後你可以換成真實網址 */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://your-domain.com/tools-hub/vote/mobile" 
                alt="QR Code" 
                className="w-64 h-64"
              />
            </div>
          </div>
          <h2 className="text-3xl text-white font-bold mb-4 tracking-widest drop-shadow-md">
            請掃描 QR Code 進入投票所
          </h2>
          <div className="flex items-center gap-4 px-8 py-3 bg-indigo-900/50 border border-indigo-500/50 rounded-full backdrop-blur-md">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
            <span className="text-xl text-indigo-100 font-mono tracking-widest">目前已連線：<span className="text-amber-400 font-bold text-2xl">{connectedUsers}</span> 人</span>
          </div>
          
          {/* 隱藏式控制按鈕 (正式上線會拆到 admin 頁面，這裡放著方便你測試) */}
          <button onClick={() => setStage('voting')} className="absolute bottom-10 px-6 py-2 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 opacity-50 hover:opacity-100 transition-all text-sm">
            [控制] 開始投票
          </button>
        </div>
      )}

      {/* ================= 階段 2：盲投進行中 (Voting) ================= */}
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
            已收集 <span className="text-5xl text-amber-400 font-bold mx-2">{totalVotes}</span> 份啟示...
          </p>

          {/* 隱藏式控制按鈕 */}
          <button onClick={handleReveal} className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:scale-105 transition-transform tracking-widest text-xl">
            關閉通道 ． 即時開票
          </button>
        </div>
      )}

      {/* ================= 階段 3：光柱開票 (Reveal) ================= */}
      {stage === 'reveal' && (
        <div className="z-10 w-full max-w-6xl flex justify-center items-end h-[60vh] mt-32 px-10 gap-8 md:gap-20 animate-fade-in">
          {TEAMS.map((team, index) => {
            // 計算光柱高度百分比 (最低給 10% 避免看不到)
            const voteCount = teamVotes[team.id as keyof typeof teamVotes];
            const heightPercent = maxVotes > 0 ? Math.max((voteCount / 200) * 100, 10) : 0; 
            const isWinner = voteCount === maxVotes && voteCount > 0;

            return (
              <div key={team.id} className="relative flex flex-col items-center justify-end h-full w-full flex-1">
                
                {/* 票數數字 (浮動在光柱上方) */}
                <div className={`mb-6 text-center transition-all duration-1000 delay-1000 ${voteCount > 0 ? 'opacity-100' : 'opacity-0'} ${isWinner ? 'scale-125 -translate-y-4' : ''}`}>
                  {isWinner && <div className="text-amber-400 text-2xl mb-1 animate-bounce">👑</div>}
                  <span className={`text-6xl font-black ${team.text} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}>
                    {voteCount}
                  </span>
                </div>

                {/* 發光柱體 */}
                <div className="relative w-full max-w-[120px] flex justify-center">
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all ease-out bg-gradient-to-t ${team.color} opacity-80 backdrop-blur-md`}
                    style={{ 
                      height: `${heightPercent}%`,
                      transitionDuration: '2.5s', // 長達 2.5 秒的戲劇性生長
                      boxShadow: `0 0 50px var(--tw-shadow-color)`,
                    }}
                  >
                    {/* 光柱內部的核心亮線 */}
                    <div className="absolute inset-x-1/4 top-0 bottom-0 bg-white/30 blur-sm rounded-t-lg"></div>
                  </div>
                </div>

                {/* 底部台座 */}
                <div className="w-full max-w-[160px] h-20 mt-2 bg-slate-900 border-t-4 border-slate-700 rounded-lg flex flex-col items-center justify-center relative z-20 shadow-2xl">
                  {/* 底座發光邊緣 */}
                  <div className={`absolute top-[-4px] left-0 w-full h-1 bg-gradient-to-r ${team.color} blur-[2px]`}></div>
                  <span className="text-3xl mb-1">{team.icon}</span>
                  <span className="text-slate-300 text-sm font-bold text-center px-2 truncate w-full">{team.name}</span>
                </div>
              </div>
            );
          })}
          
          <button onClick={() => {setStage('waiting'); setTeamVotes({team1:0, team2:0, team3:0}); setTotalVotes(0); setConnectedUsers(0);}} className="absolute bottom-4 right-4 px-4 py-2 bg-slate-800 text-slate-500 rounded hover:bg-slate-700 text-xs">
            [控制] 重新設定
          </button>
        </div>
      )}

      {/* 簡單的淡入動畫 CSS */}
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