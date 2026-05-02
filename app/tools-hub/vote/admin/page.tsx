'use client';
import React, { useState, useEffect } from 'react';
import { ref, update, onValue, set } from 'firebase/database';
// 🌟 引入你的 Firebase
import { rtdb as db } from '../../../../lib/firebase'; 

export default function HostDashboard() {
  const [stage, setStage] = useState<'waiting' | 'voting' | 'reveal'>('waiting');
  const [revealStep, setRevealStep] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (!db) return;
    
    // 監聽目前狀態
    const stateRef = ref(db, 'voteState');
    const unsubState = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.stage) setStage(data.stage);
        if (data.revealStep !== undefined) setRevealStep(data.revealStep);
        if (data.totalVotes !== undefined) setTotalVotes(data.totalVotes);
      }
    });

    return () => { unsubState(); };
  }, []);

  // 🌟 切換主要階段 (切換時會自動把 revealStep 歸零)
  const changeStage = async (newStage: 'waiting' | 'voting' | 'reveal') => {
    if (!confirm(`確定要將會場切換至「${newStage}」階段嗎？`)) return;
    try {
      await update(ref(db, 'voteState'), { 
        stage: newStage,
        revealStep: 0 // 重置揭曉進度
      });
    } catch (error) {
      alert('狀態更新失敗！');
    }
  };

  // 🌟 逐步揭曉得獎者
  const handleRevealStep = async (step: number) => {
    try {
      await update(ref(db, 'voteState'), { revealStep: step });
    } catch (error) {
      alert('揭曉指令發送失敗！');
    }
  };

  // 🌟 危險操作：清空票數
  const handleResetVotes = async () => {
    const pwd = prompt("請輸入重置密碼 (輸入: RESET) 以清空所有票數：");
    if (pwd === "RESET") {
      try {
        await set(ref(db, 'teamVotes'), {});
        await update(ref(db, 'voteState'), { totalVotes: 0 });
        alert("票數已成功歸零！");
      } catch (error) {
        alert("歸零失敗，請檢查連線。");
      }
    } else {
      alert("密碼錯誤，取消操作。");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-slate-300 p-8 font-sans">
      
      {/* 標題與裝飾 */}
      <div className="max-w-4xl mx-auto mb-10 text-center relative border-b border-amber-900/50 pb-6">
        <h1 className="text-4xl font-serif font-black text-amber-500 tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
          聖殿指揮中心
        </h1>
        <p className="text-slate-500 font-mono text-sm tracking-[0.4em] mt-2">HOST CONTROL PANEL</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 左側：主要儀式控制 */}
        <div className="bg-[#12151c] border border-amber-900/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-serif text-amber-400 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            全場儀式控制
          </h2>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => changeStage('waiting')}
              className={`p-4 rounded-xl border text-left transition-all ${stage === 'waiting' ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-slate-900/50 border-slate-700/50 hover:border-amber-600/50'}`}
            >
              <div className="font-bold text-lg text-slate-200">1. 等待階段 (Waiting)</div>
              <div className="text-sm text-slate-500 mt-1">顯示 QR Code 與典禮背景，供觀眾掃描入場。</div>
            </button>

            <button 
              onClick={() => changeStage('voting')}
              className={`p-4 rounded-xl border text-left transition-all ${stage === 'voting' ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-slate-900/50 border-slate-700/50 hover:border-amber-600/50'}`}
            >
              <div className="font-bold text-lg text-slate-200">2. 開放投票 (Voting)</div>
              <div className="text-sm text-slate-500 mt-1">開啟神聖通道，觀眾手機將可開始進行戲劇選擇。</div>
            </button>

            <button 
              onClick={() => changeStage('reveal')}
              className={`p-4 rounded-xl border text-left transition-all ${stage === 'reveal' ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-slate-900/50 border-slate-700/50 hover:border-amber-600/50'}`}
            >
              <div className="font-bold text-lg text-slate-200">3. 準備揭曉 (Reveal)</div>
              <div className="text-sm text-slate-500 mt-1">關閉投票通道。大螢幕進入開票準備畫面。</div>
            </button>
          </div>
        </div>

        {/* 右側：狀態監控與進階控制 */}
        <div className="flex flex-col gap-8">
          
          {/* 即時戰況 */}
          <div className="bg-[#12151c] border border-amber-900/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-serif text-slate-500 mb-2 tracking-[0.2em]">即時接收票數</h2>
            <div className="text-6xl font-sans font-black text-amber-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              {totalVotes}
            </div>
            {stage === 'voting' && <span className="mt-4 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 animate-pulse">● 投票通道運行中</span>}
          </div>

          {/* 🌟 揭曉控制面板 (只有在 reveal 階段才啟用) */}
          <div className={`bg-[#12151c] border rounded-2xl p-6 shadow-2xl transition-all ${stage === 'reveal' ? 'border-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'border-slate-800 opacity-50 pointer-events-none'}`}>
            <h2 className="text-xl font-serif text-amber-400 mb-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              名次揭曉控制台
            </h2>
            <p className="text-xs text-slate-500 mb-4">請配合現場氣氛，依序點擊下方按鈕以控制大螢幕畫面。</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleRevealStep(0)} className={`py-2 rounded-lg border font-bold text-sm ${revealStep === 0 ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>0. 懸念準備</button>
              <button onClick={() => handleRevealStep(1)} className={`py-2 rounded-lg border font-bold text-sm ${revealStep === 1 ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>1. 顯示季軍 🥉</button>
              <button onClick={() => handleRevealStep(2)} className={`py-2 rounded-lg border font-bold text-sm ${revealStep === 2 ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>2. 顯示亞軍 🥈</button>
              <button onClick={() => handleRevealStep(3)} className={`py-2 rounded-lg border font-bold text-sm ${revealStep === 3 ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>3. 揭曉冠軍 🏆</button>
            </div>
          </div>

          {/* 危險操作區 */}
          <div className="flex justify-end mt-auto">
            <button 
              onClick={handleResetVotes}
              className="text-xs text-red-500/60 hover:text-red-400 border border-red-900/30 hover:border-red-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              ⚠ 清空所有票數資料
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}