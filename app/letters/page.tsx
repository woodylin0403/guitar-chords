'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMatchedLetter } from '@/data/letters';
import { Sparkles, Wand2, X } from 'lucide-react';

export default function HeavenlyLetters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);
  const [letterImage, setLetterImage] = useState('');
  
  // 控制抽卡動畫階段的狀態
  const [drawStage, setDrawStage] = useState<'orb' | 'spinning' | 'reveal'>('orb');

  // 🌟 偵測是否從其他頁面（救恩/禱告）帶了祈禱文過來
  useEffect(() => {
    const externalPrayer = searchParams.get('prayer');
    if (externalPrayer) {
      setPrayerText(externalPrayer);
      // 直接進入準備抽卡的「光點階段」
      setDrawStage('orb');
      setModalState('loading');
      setIsModalOpen(true);
      
      // 清除 URL 參數，避免重新整理時重複觸發
      router.replace('/letters', { scroll: false });
    }
  }, [searchParams, router]);

  // 處理隨機抽取 (直接進入光點)
  const handleRandomDraw = () => {
    setPrayerText(''); // 清空文字確保是隨機
    setDrawStage('orb');
    setModalState('loading');
    setIsModalOpen(true);
  };
  
  // 處理手動寫心聲送出 (進入光點)
  const handleSubmitInput = () => {
    if (prayerText.trim() === '') return;
    setDrawStage('orb');
    setModalState('loading');
  };

  // 🌟 統一的點擊光點動畫序列 (無論隨機還是有文字，都走這裡)
  const startDrawingRitual = () => {
    if (drawStage !== 'orb') return;
    
    // 1. 開始旋轉
    setDrawStage('spinning');
    
    // 2. 獲取信件資料 (根據 prayerText 判斷是隨機還是匹配)
    const result = getMatchedLetter(prayerText);
    setLetterData(result.letter);
    setLetterImage(result.image);
    
    // 3. 2.2 秒後翻卡揭曉 (對應 spinning 動畫時間)
    setTimeout(() => {
      setDrawStage('reveal');
      setTimeout(() => {
        setModalState('letter');
      }, 300); // 縮放過渡
    }, 2200); 
  };

  const openInputModal = () => {
    setModalState('input');
    setPrayerText('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>天父的信 | 烏鴉的嗎哪</title>
      </Head>

      {/* 背景深邃光暈 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 導覽列 */}
      <nav className="p-6 md:px-12 md:py-8 max-w-6xl mx-auto flex justify-start relative z-10 sticky top-0">
        <Link href="/tools-hub" className="text-slate-400 hover:text-white font-medium transition-all bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm text-sm border border-white/10 flex items-center gap-2 group">
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 結束並返回工具箱
        </Link>
      </nav>

      <section className="flex flex-col items-center justify-center pt-10 pb-20 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm mb-6 text-sm font-medium text-violet-400 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" /> 領受今日的嗎哪
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-400 mb-6 tracking-tighter leading-[1.1]">
          天父的信
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-lg leading-relaxed font-medium">
          每一天，天父都有話想對你說。<br/>你可以隨機抽取今日的鼓勵，或是把心裡的重擔告訴祂。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <button onClick={handleRandomDraw} className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(139,92,246,0.15)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500 mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">隨機抽取一張信件</h3>
              <p className="text-slate-400 text-sm font-medium">領受天父為你預備的今日驚喜</p>
            </div>
          </button>

          <button onClick={openInputModal} className="group p-8 bg-slate-800/50 border border-slate-700 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <Wand2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">向天父訴說心聲</h3>
              <p className="text-slate-400 text-sm font-medium">寫下你的需要，獲得專屬的回應</p>
             </div>
          </button>
        </div>
      </section>

      {/* 🌟 Modal 視窗 (包含抽卡與內容顯示) */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-black' : 'bg-slate-950/80 backdrop-blur-xl'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        
        {/* 動畫 Keyframes */}
        <style>{`
          @keyframes orb-float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-10px) scale(1.05); opacity: 1; }
          }
          @keyframes orb-spinning {
            0% { transform: rotate(0deg) scale(1); filter: blur(0px); }
            50% { transform: rotate(720deg) scale(1.5); filter: blur(2px); }
            100% { transform: rotate(1440deg) scale(0); filter: blur(10px); }
          }
          @keyframes card-reveal {
            0% { transform: scale(0) rotateY(90deg); opacity: 0; filter: blur(10px); }
            100% { transform: scale(1) rotateY(0deg); opacity: 1; filter: blur(0px); }
          }
          .animate-orb-float { animation: orb-float 3s ease-in-out infinite; }
          .animate-orb-spinning { animation: orb-spinning 2.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
          .animate-card-reveal { animation: card-reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        `}</style>

        {/* Loading / 抽卡動畫階段 */}
        {modalState === 'loading' && (
          <div className="flex flex-col items-center justify-center relative w-full h-full text-center">
            
            {/* 1. 光點階段 (Orb) */}
            {drawStage === 'orb' && (
              <div onClick={startDrawingRitual} className="cursor-pointer relative flex flex-col items-center group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-300 to-blue-400 blur-md shadow-[0_0_80px_rgb(139,92,246,0.6)] animate-orb-float"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-violet-400/50 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-1000"></div>
                <p className="mt-12 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-200 tracking-wider">點擊光點 · 開啟嗎哪</p>
                <p className="mt-2 text-slate-500 text-sm">請保持一顆安靜期待的心</p>
              </div>
            )}
            
            {/* 2. 旋轉與擴張階段 (Spinning) */}
            {drawStage === 'spinning' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white blur-xl shadow-[0_0_120px_white] animate-orb-spinning"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute w-40 h-60 bg-white/5 border border-white/20 rounded-xl" style={{ animation: `orb-spinning 2.2s cubic-bezier(0.23, 1, 0.32, 1) forwards`, animationDelay: `${i*0.1}s`, transformOrigin: 'center center' }}></div>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 實際內容 Modal (手動輸入 / 信件展示) */}
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-slate-900 w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.3)] border border-slate-800 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} ${drawStage === 'reveal' ? 'animate-card-reveal' : ''}`}>
            
            <button onClick={closeModal} className="absolute top-5 right-5 text-2xl text-slate-500 hover:text-white transition-colors">&times;</button>
            
            {/* 手動輸入畫面 */}
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">親愛的天父...</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">寫下你目前的困難、期待或感恩，這份心聲只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我想對祢說..." className="w-full h-[150px] p-4 border border-slate-700 focus:border-violet-500 rounded-xl resize-none text-white bg-slate-800/60 focus:bg-slate-800 transition-colors mb-6 outline-none font-medium"/>
                <button onClick={handleSubmitInput} disabled={!prayerText.trim()} className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-full text-lg tracking-wider transition-all shadow-lg shadow-violet-600/20">
                  送出我的心聲
                </button>
              </div>
            )}

            {/* 信件展示畫面 */}
            {modalState === 'letter' && letterData && (
              <div className="text-left">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[200px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-700" style={{ filter: 'contrast(0.9) saturate(1.2) brightness(0.9)' }} />
                <h3 className="text-2xl font-bold text-violet-400 mb-5 tracking-tight flex items-center gap-3">
                   <Link href="/letters" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-200">💌 來自天父的信</Link>
                </h3>
                <div className="text-lg mb-8 leading-loose whitespace-pre-wrap text-slate-100 font-medium">{letterData.text}</div>
                <div className="bg-slate-800/80 p-5 border-l-4 border-violet-500 rounded-r-xl shadow-inner">
                  <p className="font-semibold mb-2 text-slate-50">{letterData.verse}</p>
                  <p className="text-sm text-slate-400 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}