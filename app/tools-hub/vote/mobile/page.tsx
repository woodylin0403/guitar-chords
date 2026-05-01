'use client';
import React, { useState, useEffect, useRef } from 'react';
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

// 🌟 劇本預覽資料 (對應你的三張圖片與簡介)
const PREVIEWS = [
  {
    id: '1',
    title: '《劃破夜空的雞啼》',
    desc: '感人短劇描繪彼得軟弱。因恐懼三次認主，雞鳴崩潰痛哭。復活耶穌柔聲挽回，完全洗淨背叛並再次呼召牧養羊群。',
    image: '/images/play1.jpg',
  },
  {
    id: '2',
    title: '《沉入深淵的斧頭》',
    desc: '詼諧短劇改編聖經。門徒借鐵斧掉河。試探者以金銀斧誘惑，遭正直拒絕。以利沙顯神蹟，鐵斧浮起。',
    image: '/images/play2.jpg',
  },
  {
    id: '3',
    title: '《皮不敏計畫》',
    desc: '極具創意！主角碰聖經就過敏。讀經友發現缺聖經精華。耐心引導誦讀克服，不再打噴嚏，鼓勵主動靈修。',
    image: '/images/play3.jpg',
  }
];

export default function MobileVote() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  
  // 🌟 用於追蹤輪播到哪一頁的狀態
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!db) return;
    
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

  // 🌟 監聽輪播圖滑動以更新小圓點
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(index);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-start p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 背景特效 */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 標題區 */}
      <div className="text-center my-6 z-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] tracking-widest">
          數位聖殿
        </h1>
        <p className="text-indigo-200 text-[10px] tracking-[0.3em] uppercase opacity-80 font-bold">
          神學學院戲劇決選
        </p>
      </div>

      {/* 🌟 階段一：等待中 (橫式全螢幕輪播) */}
      {currentStage === 'waiting' && !hasVoted && (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto z-10 pb-10">
          
          <div className="text-center mb-4">
             <span className="text-sm font-bold text-amber-400 tracking-widest animate-pulse border border-amber-400/30 bg-amber-400/10 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.2)]">
               等待投票開始
             </span>
          </div>

          {/* 輪播容器 */}
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full flex-1 min-h-[450px]"
            onScroll={handleScroll}
          >
            {PREVIEWS.map((preview) => (
              <div key={preview.id} className="w-full h-full flex-shrink-0 snap-center px-2 py-1 flex flex-col">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-slate-900/80 flex flex-col transform transition-transform duration-500">
                  
                  {/* 上半部：圖片與暗角漸層 */}
                  <div className="relative h-3/5 w-full bg-slate-800">
                    <img 
                      src={preview.image} 
                      alt={preview.title} 
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/1e293b/fbbf24?text=IMAGE+LOADING' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  </div>

                  {/* 下半部：文字介紹 (玻璃擬態) */}
                  <div className="relative h-2/5 p-5 flex flex-col justify-start backdrop-blur-xl bg-slate-900/60 border-t border-slate-700/50">
                    <h3 className="text-xl font-bold text-amber-300 mb-2 drop-shadow-md">
                      {preview.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed tracking-wide text-justify opacity-90">
                      {preview.desc}
                    </p>
                    
                    {/* 裝飾線條 */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 輪播進度點點 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {PREVIEWS.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-2 bg-slate-700'}`} 
              />
            ))}
          </div>
          <p className="text-center text-slate-500 text-xs mt-4 animate-bounce">
            ← 左右滑動預覽劇本 →
          </p>
        </div>
      )}

      {/* 階段二：揭曉結果 */}
      {currentStage === 'reveal' && (
        <div className="z-10 text-center bg-slate-900/60 p-8 rounded-3xl border border-red-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-fade-in mt-20">
           <span className="text-5xl mb-4 block animate-bounce">👑</span>
           <h2 className="text-2xl font-bold text-red-400 mb-2 tracking-widest">投票已截止</h2>
           <p className="text-slate-300">請看大螢幕，正在進行揭曉儀式！</p>
        </div>
      )}

      {/* 階段三：投票進行中 */}
      {currentStage === 'voting' && !hasVoted && (
        <div className="w-full max-w-sm flex flex-col gap-4 z-10 animate-fade-in mt-10">
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

      {/* 投票完成狀態 */}
      {hasVoted && currentStage !== 'reveal' && (
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center bg-slate-900/60 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-md z-10 animate-fade-in shadow-2xl shadow-indigo-500/10 mt-20">
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

      <div className="absolute bottom-2 text-[10px] text-slate-600 font-mono tracking-widest z-0">
        SYSTEM: CYBER_ARK_V1.1
      </div>

      {/* 隱藏原生滾動條的 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}