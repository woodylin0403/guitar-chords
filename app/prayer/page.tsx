'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, MessageCircleHeart, Sparkles, ArrowDown } from 'lucide-react';
import { getMatchedLetter } from '@/data/letters';

// 為了讓滾動動畫生效的自訂 Hook
function useOnScreen(options: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
}

// 提取區塊元件來處理各自的 fade-up
function FadeSection({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <div ref={ref} className={`w-full flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
}

export default function PrayerTool() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);
  const [letterImage, setLetterImage] = useState('');

  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    setModalState('loading');
    setTimeout(() => {
      const result = getMatchedLetter(prayerText);
      setLetterData(result.letter);
      setLetterImage(result.image);
      setModalState('letter');
    }, 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>禱告的大能 | 烏鴉的嗎哪</title>
      </Head>

      {/* 寧靜深邃光暈 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 現代化毛玻璃導覽列 */}
      <nav className="p-6 md:px-12 md:py-8 max-w-6xl mx-auto flex justify-start relative z-10 sticky top-0">
        <Link href="/christianity" className="text-slate-400 hover:text-white font-medium transition-all bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm text-sm border border-white/10 flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回認識基督信仰
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-500/20">
              <MessageCircleHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-10 tracking-tighter leading-[1.1]">
              禱告的大能
            </h1>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] text-left mb-10 shadow-xl">
              <p className="text-sm font-bold tracking-widest text-cyan-400 mb-3 uppercase">安靜心，讓我們用這首詩歌來到祂面前</p>
              <div className="text-lg leading-loose font-medium text-slate-300 mb-4">
                <span className="font-bold text-cyan-300 mb-2 block">《我以禱告來到你面前》</span>
                我以禱告來到你面前，我要尋求你，<br/>
                我要站在破口之中，在那裡我尋求你。<br/>
                每一次我禱告，我搖動你的手，<br/>
                禱告做的事，我的手不能做。<br/>
                每一次我禱告，大山被挪移，<br/>
                道路被鋪平，使列國歸向你。
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border-l-4 border-cyan-500 text-left">
               <p className="text-lg font-medium leading-relaxed mb-3 text-slate-200">「你們祈求，就給你們；尋找，就尋見；叩門，就給你們開門。因為凡祈求的，就得著；尋找的，就尋見；叩門的，就給他開門... 何況你們在天上的父，豈不更把好東西給求他的人嗎？」</p>
               <p className="text-sm text-slate-400 font-mono italic">— 馬太福音 7:7-11</p>
            </div>
          </div>
          
          <div className="w-full h-[150px] mt-10 flex justify-center items-center relative mx-auto overflow-visible">
            {/* 🌟 復原：封面 SVG 裝飾 */}
            <svg viewBox="0 0 400 150" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <circle cx="200" cy="75" r="4" fill="#22d3ee" className="drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" /> {/* cyan-400 */}
              <circle cx="200" cy="75" r="30" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
              <circle cx="200" cy="75" r="60" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" /> {/* blue-400 */}
            </svg>
          </div>
        </FadeSection>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600 flex flex-col items-center">
          <span className="text-xs tracking-widest mb-2 font-bold uppercase">探索禱告的旅程</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* 1. 祈求 (Ask) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：祈求 SVG 結構 */}
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <path d="M120 180 C 150 200, 250 200, 280 180" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round"/> {/* slate-600 */}
              <path d="M150 185 C 170 195, 230 195, 250 185" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="200" cy="140" r="12" fill="#22d3ee" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
              <path d="M190 110 Q 200 90, 210 110" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.5"/>
              <path d="M180 80 Q 200 50, 220 80" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.3"/>
              <text x="200" y="240" textAnchor="middle" className="text-lg font-bold fill-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">1. 祈求 (Ask)</text>
            </svg>
          </div>
          <div className="max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight text-center">第一步：建立信心的根基 <span className="text-cyan-400">(祈求)</span></h2>
            <ul className="space-y-4 text-slate-300 font-medium mb-6">
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <span><strong className="text-white">信心的約：</strong>神透過應許，將祂自己與我們緊緊綁在一起。</span></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <span><strong className="text-white">信心的對象：</strong>禱告不是對空氣說話，而是向那位與我們立約的神呼求。</span></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <span><strong className="text-white">回轉向神：</strong>當遇到難處，我們的第一步就是求告祂。</span></li>
            </ul>
            <p className="text-lg text-cyan-300 font-bold text-center">祂承諾給予，因為祂是守約施慈愛的天父。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 尋找 (Seek) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：尋找 SVG 結構 */}
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <circle cx="200" cy="120" r="40" fill="none" stroke="#60a5fa" strokeWidth="4" className="drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]"/> {/* blue-400 */}
              <circle cx="200" cy="120" r="15" fill="#60a5fa" opacity="0.8" className="drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]"/>
              <line x1="200" y1="30" x2="200" y2="70" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="200" y1="170" x2="200" y2="210" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="110" y1="120" x2="150" y2="120" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="250" y1="120" x2="290" y2="120" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <text x="200" y="240" textAnchor="middle" className="text-lg font-bold fill-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">2. 尋找 (Seek)</text>
            </svg>
          </div>
          <div className="max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight text-center">第二步：經歷信心的過程 <span className="text-blue-400">(尋找)</span></h2>
            <ul className="space-y-4 text-slate-300 font-medium mb-6">
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <span><strong className="text-white">不只是求：</strong>不再只停留在求好處，而是主動尋求認識神、親近神。</span></li>
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <span><strong className="text-white">信心操練：</strong>在禱告中操練信心，也在信心裡尋求神的心意。</span></li>
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <span><strong className="text-white">目光轉向：</strong>將眼光從「律法中的祝福」，轉向「賜恩典的主」。</span></li>
            </ul>
            <p className="text-lg text-blue-300 font-bold text-center">尋找的過程，就是我們與天父關係更深的時刻。</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 叩門 (Knock) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：叩門 SVG 結構 */}
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <rect x="140" y="50" width="120" height="160" fill="none" stroke="#475569" strokeWidth="3" />
              <polygon points="140,50 220,30 220,190 140,210" fill="#a78bfa" opacity="0.2" stroke="#a78bfa" strokeWidth="2"/> {/* violet-400 */}
              <path d="M 220 30 L 300 10 L 300 230 L 220 190 Z" fill="url(#light-gradient)" opacity="0.5"/>
              <defs>
                  <linearGradient id="light-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                  </linearGradient>
              </defs>
              <circle cx="205" cy="130" r="4" fill="#a78bfa" className="drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]"/>
              <text x="200" y="240" textAnchor="middle" className="text-lg font-bold fill-violet-400 drop-shadow-[0_0_5px_rgba(167,139,250,0.5)]">3. 叩門 (Knock)</text>
            </svg>
          </div>
          <div className="max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight text-center">第三步：渴慕天父的同在 <span className="text-violet-400">(叩門)</span></h2>
            <ul className="space-y-4 text-slate-300 font-medium mb-6">
              <li className="flex gap-3"><span className="text-violet-400 font-bold">•</span> <span><strong className="text-white">遇見神：</strong>不單單滿足於問題被解決，更是渴望遇見神自己。</span></li>
              <li className="flex gap-3"><span className="text-violet-400 font-bold">•</span> <span><strong className="text-white">沒有條件：</strong>「因為凡...」代表沒有其他門檻，有求必有回應。</span></li>
              <li className="flex gap-3"><span className="text-violet-400 font-bold">•</span> <span><strong className="text-white">進入同在：</strong>叩門，是為了要真真實實地進入天父的同在裡。</span></li>
            </ul>
            <p className="text-lg text-violet-300 font-bold text-center">叩開的不是一扇門，而是進入天父永恆的擁抱。</p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 明白天父的好東西 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：好東西 SVG 結構 */}
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <path d="M 200 180 C 200 180, 140 120, 140 85 C 140 50, 190 40, 200 75 C 210 40, 260 50, 260 85 C 260 120, 200 180, 200 180 Z" fill="none" stroke="#2dd4bf" strokeWidth="4" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]"/> {/* teal-400 */}
              <circle cx="200" cy="100" r="25" fill="#2dd4bf" opacity="0.1" />
              <line x1="200" y1="75" x2="200" y2="125" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round"/>
              <line x1="185" y1="95" x2="215" y2="95" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round"/>
              <text x="200" y="240" textAnchor="middle" className="text-lg font-bold fill-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]">4. 明白天父的好東西</text>
            </svg>
          </div>
          <div className="max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight text-center">關鍵：明白天父的 <span className="text-teal-400">「好東西」</span></h2>
            <ul className="space-y-4 text-slate-300 font-medium mb-6">
              <li className="flex gap-3"><span className="text-teal-400 font-bold">•</span> <span><strong className="text-white">相同的 DNA：</strong>禱告不是法律規定，而是出自生命與愛的連結，我們是祂的兒女。</span></li>
              <li className="flex gap-3"><span className="text-teal-400 font-bold">•</span> <span><strong className="text-white">看似堅硬的恩典：</strong>神給的看似辛苦（如耶穌的十字架），其實是生命最需要的養分。</span></li>
              <li className="flex gap-3"><span className="text-teal-400 font-bold">•</span> <span><strong className="text-white">永恆的預備：</strong>地上的父親為今生打算，但天父為我們預備的是永生與得勝。</span></li>
            </ul>
            <p className="text-lg text-teal-300 font-bold text-center">祂給的不只是短暫的滿足，而是永恆最美好的禮物。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 決志行動呼籲 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[200px] pointer-events-none"></div>
        <FadeSection>
          <div className="text-center max-w-2xl relative z-10 bg-slate-900/50 p-10 md:p-14 rounded-[3rem] border border-slate-800 backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">現在，換你來敲門了</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">天父正在等候聽你的聲音。<br/>不論是你自己正面臨的挑戰、需要做的決定，或是你心裡掛念的家人、朋友... <br/><strong className="text-slate-200 block mt-4">大膽地寫下你最真實的需要，為那個人祈求祝福吧！</strong></p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" /> 我要寫下我的禱告
            </button>
          </div>
        </FadeSection>
      </section>

      {/* 🌟 復原原本連到天父的信的Modal邏輯，並完全保留原本內容 */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-black' : 'bg-slate-950/80 backdrop-blur-xl'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-slate-900 w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.3)] border border-slate-800 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button onClick={closeModal} className="absolute top-5 right-5 text-2xl text-slate-500 hover:text-white transition-colors">&times;</button>
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">親愛的天父...</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">請寫下你目前最真實的需要、你想突破的困境，或是你想為誰（家人/朋友）祈求祝福？這份禱告卡只有你和天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我想祈求..." className="w-full h-[150px] p-4 border border-slate-700 focus:border-cyan-500 rounded-xl resize-none text-white bg-slate-800/60 focus:bg-slate-800 transition-colors mb-6 outline-none font-medium"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-full text-lg font-bold tracking-wider transition-all shadow-lg shadow-cyan-500/20">
                  送出我的禱告
                </button>
              </div>
            )}
            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-500">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[200px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-700" style={{ filter: 'contrast(0.9) saturate(1.2) brightness(0.9)' }} />
                <h3 className="text-2xl font-bold text-cyan-400 mb-5 tracking-tight flex items-center gap-3">
                   <Link href="/letters" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">💌 來自天父的回應</Link>
                </h3>
                <div className="text-lg mb-8 leading-loose whitespace-pre-wrap text-slate-100 font-medium">{letterData.text}</div>
                <div className="bg-slate-800/80 p-5 border-l-4 border-cyan-500 rounded-r-xl shadow-inner">
                  <p className="font-semibold mb-2 text-slate-50">{letterData.verse}</p>
                  <p className="text-sm text-slate-400 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Loading Spinner */}
        {modalState === 'loading' && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-6 animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
            <p className="text-white text-lg font-bold tracking-widest">正在將你的禱告帶到天父面前...</p>
          </div>
        )}
      </div>
    </main>
  );
}