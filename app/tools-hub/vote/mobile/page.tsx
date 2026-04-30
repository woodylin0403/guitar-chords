'use client';
import React, { useState } from 'react';

// 戲劇隊伍資料 (可以根據實際情況修改名稱)
const TEAMS = [
  { id: 'team1', name: '摩西過紅海', icon: '🌊', color: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/50' },
  { id: 'team2', name: '大衛擊敗歌利亞', icon: '🗡️', color: 'from-red-500 to-orange-400', glow: 'shadow-orange-500/50' },
  { id: 'team3', name: '五餅二魚', icon: '🥖', color: 'from-green-500 to-emerald-400', glow: 'shadow-emerald-500/50' },
];

export default function MobileVote() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 處理點擊卡片
  const handleSelect = (id: string) => {
    if (hasVoted) return;
    setSelectedTeam(id);
    // 觸發手機震動 (如果裝置支援)
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  // 送出投票
  const handleVote = () => {
    if (!selectedTeam) return;
    setIsSubmitting(true);

    // 模擬送出到資料庫的延遲 (未來會換成真實 API)
    setTimeout(() => {
      setIsSubmitting(false);
      setHasVoted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 科技感背景光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 標題區 */}
      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] tracking-widest">
          數位聖殿
        </h1>
        <p className="text-indigo-200 text-xs tracking-[0.3em] uppercase opacity-80 font-bold">
          神學學院戲劇決選
        </p>
      </div>

      {/* 投票卡片區或完成畫面 */}
      {!hasVoted ? (
        <div className="w-full max-w-sm flex flex-col gap-4 z-10 animate-fade-in">
          <p className="text-center text-slate-300 mb-2 font-medium tracking-wide">請選擇您心中的最佳戲劇</p>
          
          {TEAMS.map((team) => (
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
              {/* 選中時的左側發光條 */}
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

          {/* 送出按鈕 */}
          <button
            onClick={handleVote}
            disabled={!selectedTeam || isSubmitting}
            className={`
              mt-8 w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all duration-300 relative overflow-hidden
              ${!selectedTeam 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : isSubmitting
                  ? 'bg-amber-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:-translate-y-1'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                傳送中...
              </span>
            ) : '送出神聖一票'}
          </button>
        </div>
      ) : (
        /* 完成投票畫面 (Wait Screen) */
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
            請將目光移至前方大螢幕<br />
            準備觀看最終結果啟示
          </p>
          <div className="mt-8 px-6 py-2 bg-indigo-900/50 rounded-full border border-indigo-500/30">
            <span className="text-xs text-indigo-300 tracking-widest">請保持手機畫面開啟</span>
          </div>
        </div>
      )}

      {/* 底部裝飾 */}
      <div className="absolute bottom-4 text-[10px] text-slate-600 font-mono tracking-widest">
        SYSTEM: CYBER_ARK_V1.0
      </div>

      {/* 簡單的淡入動畫 CSS */}
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