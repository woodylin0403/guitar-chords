'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Gift, Heart, ArrowDown } from 'lucide-react';
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

// 輔助小圖示元件 (修正漏掉的部分)
function ArrowUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  );
}

export default function SalvationTool() {
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
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>救恩的禮物 | 烏鴉的嗎哪</title>
      </Head>

      {/* 背景深邃光暈 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 現代化毛玻璃導覽列 */}
      <nav className="p-6 md:px-12 md:py-8 max-w-6xl mx-auto flex justify-start relative z-10 sticky top-0">
        <Link href="/christianity" className="text-slate-400 hover:text-white font-medium transition-all bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm text-sm border border-white/10 flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回認識基督信仰
        </Link>
      </nav>

      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#64748b" /> {/* Slate 500 */}
          </marker>
        </defs>
      </svg>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/20">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 mb-6 tracking-tighter leading-[1.1]">
              救恩的禮物
            </h1>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] text-left mb-10 shadow-xl">
              <p className="text-sm font-bold tracking-widest text-rose-400 mb-3 uppercase">金句與詩歌</p>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-4 text-slate-100">
                「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」
              </p>
              <p className="text-sm text-slate-400 font-mono italic">— 約翰福音 3:16</p>
            </div>
            
            <p className="text-lg md:text-xl text-slate-400 font-medium">很久… 很久以前…<br/>起初… 神創造天地</p>
          </div>
          
          <div className="w-full h-[150px] md:h-[200px] mt-10 flex justify-center items-center relative mx-auto overflow-visible">
            {/* 🌟 復原：起初最重要的一條核心線 - 光軌化 */}
            <svg viewBox="0 0 600 200" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="100" y1="100" x2="500" y2="100" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" /> {/* Orange 400 */}
              <circle cx="300" cy="100" r="10" fill="white" className="drop-shadow-[0_0_10px_white]" />
            </svg>
          </div>
        </FadeSection>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600 flex flex-col items-center">
          <span className="text-xs tracking-widest mb-2 font-bold uppercase">向下滾動</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* 1. 起初創造 (神/生命線) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[150px] md:h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：神與生命線結構 */}
            <svg viewBox="0 0 600 200" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="100" x2="550" y2="100" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
              <text x="30" y="108" textAnchor="end" className="text-xl font-extrabold fill-orange-300 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">神</text>
              <text x="570" y="108" textAnchor="start" className="text-xl font-extrabold fill-orange-300 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">生命</text>
              <circle cx="300" cy="100" r="14" fill="#0f172a" stroke="#fb923c" strokeWidth="4" /> {/* Slate 900 */}
              <text x="300" y="65" textAnchor="middle" className="text-sm font-medium fill-white">人</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-5 text-white tracking-tight">起初的創造與關係</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">神創造人，要他們永遠與祂相交、來往。神本要我們與祂建立關係，祂將祂的靈吹入我們的<span className="text-orange-300 font-bold">生命</span>。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 罪的隔絕 (死亡線) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] md:h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：罪與死亡線結構 */}
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
              <text x="30" y="88" textAnchor="end" className="text-xl font-extrabold fill-orange-300" opacity="0.1">神</text>
              
              {/* 復原轉彎路徑 */}
              <path d="M 50 80 L 150 80 C 250 80, 250 200, 350 200 L 550 200" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(100,116,139,0.3)]" /> {/* Slate 500 */}
              <text x="250" y="145" textAnchor="middle" className="text-xl font-extrabold fill-slate-400 drop-shadow-[0_0_5px_rgba(100,116,139,0.5)]">罪</text>
              <circle cx="450" cy="200" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="4" />
              <text x="450" y="240" textAnchor="middle" className="text-sm font-medium fill-white">人</text>
              <text x="570" y="208" textAnchor="start" className="text-xl font-extrabold fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-5 text-white tracking-tight">伊甸園的選擇與隔絕</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">在起初的伊甸園裡，神給了人自由。然而，第一對人類選擇了不信任神，違背了祂的教導。這個選擇使人與神隔絕了！因為<span className="text-slate-400 font-bold">罪</span>，人與神的道斷開了連結。罪的結局就是走向另一端——<span className="text-red-400 font-bold">死亡</span>！</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 人的徒勞 (向上虛線) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] md:h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：徒勞向上結構 */}
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
              <text x="30" y="88" textAnchor="end" className="text-xl font-extrabold fill-orange-300" opacity="0.1">神</text>
              <line x1="50" y1="200" x2="550" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <text x="570" y="208" textAnchor="start" className="text-xl font-extrabold fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">死亡</text>
              
              {/* 向上虛線圖 */}
              <line x1="120" y1="200" x2="120" y2="120" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="120" y="100" textAnchor="middle" className="text-xs font-medium fill-slate-400">行善</text>
              <line x1="210" y1="200" x2="210" y2="130" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="210" y="110" textAnchor="middle" className="text-xs font-medium fill-slate-400">功德</text>
              <line x1="300" y1="200" x2="300" y2="115" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="300" y="95" textAnchor="middle" className="text-xs font-medium fill-slate-400">宗教</text>
              <line x1="390" y1="200" x2="390" y2="125" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="390" y="105" textAnchor="middle" className="text-xs font-medium fill-slate-400">醫療</text>
              <line x1="480" y1="200" x2="480" y2="135" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="480" y="115" textAnchor="middle" className="text-xs font-medium fill-slate-400">養生</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-5 text-white tracking-tight">渴望回到神那裡</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">人渴望回到神那裡，也極力想要跨越死亡的終局！然而，不論我們如何努力向上攀爬（行善、積功德、宗教，或者是依賴醫療與養生試圖延長生命），都無法跨越罪的鴻溝，無法使我們回到神那裡！</p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 神的方法 (降世橋樑線) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] md:h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：耶穌十字架橋樑結構 */}
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
              <line x1="50" y1="200" x2="550" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
              
              {/* 十字架橋樑 */}
              <line x1="300" y1="80" x2="300" y2="200" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" className="drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]" /> {/* Rose 500 */}
              <line x1="240" y1="120" x2="360" y2="120" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" className="drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
              
              <text x="300" y="60" textAnchor="middle" className="text-sm fill-rose-300 font-extrabold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-4">
            <h2 className="text-3xl font-bold mb-5 text-white tracking-tight">神預備的方法</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">神為絕望的我們，預備了一個方法！神因為愛我們的緣故，把祂獨生的愛子<span className="text-rose-400 font-bold">耶穌</span>賜給我們，成為我們生命當中最美好的禮物！主耶穌降世，是為了世人！也是為我，也是為你。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 轉回與選擇 (轉回路徑) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] md:h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            {/* 🌟 復原：轉回路徑結構 */}
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
              <line x1="50" y1="200" x2="300" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
              <line x1="300" y1="80" x2="300" y2="200" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" opacity="0.2"/> {/* Rose 500 faded */}

              {/* 轉回路徑 - 光軌化 */}
              <path d="M 200 200 L 250 200 C 280 200, 300 180, 300 140 C 300 100, 320 80, 350 80 L 400 80" fill="none" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
              <polygon points="400,80 390,75 390,85" fill="#fb923c" className="drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
              
              <circle cx="200" cy="200" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="4" opacity="0.5"/>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-4 relative bg-slate-900/50 p-10 md:p-14 rounded-[3rem] border border-slate-800 backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">我們的選擇</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">耶穌為你我的罪而死，三天後復活、升天。其實我們有個選擇… 有一條道路可以回到神那裡！！！離開死亡之路！！！如果我們願意及時轉回！！！然而耶穌的死與復活，與你如何發生關係？你可以把你的心聲告訴祂。</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /> 我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* 🌟 修復處：加上修正後的 bg-slate-950/80 backdrop-blur-xl (修正了之前少空白的錯誤) */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-black' : 'bg-slate-950/80 backdrop-blur-xl'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-slate-900 w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.3)] border border-slate-800 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button onClick={closeModal} className="absolute top-5 right-5 text-2xl text-slate-500 hover:text-white transition-colors">&times;</button>
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">告訴天父你的決定...</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">請寫下你目前的困難，或是願意接受這份禮物的心聲。這份祈禱只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父，我願意..." className="w-full h-[150px] p-4 border border-slate-700 focus:border-rose-500 rounded-xl resize-none text-white bg-slate-800/60 focus:bg-slate-800 transition-colors mb-6 outline-none font-medium"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-full text-lg font-bold tracking-wider transition-all shadow-lg shadow-rose-500/20">
                  送出我的心聲
                </button>
              </div>
            )}
            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-500">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[200px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-700" style={{ filter: 'contrast(0.9) saturate(1.2) brightness(0.9)' }} />
                <h3 className="text-2xl font-bold text-rose-400 mb-5 tracking-tight flex items-center gap-3">
                   <Link href="/letters" className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-orange-200">💌 來自天父的信</Link>
                </h3>
                <div className="text-lg mb-8 leading-loose whitespace-pre-wrap text-slate-100 font-medium">{letterData.text}</div>
                <div className="bg-slate-800/80 p-5 border-l-4 border-rose-500 rounded-r-xl shadow-inner">
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
            <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full mx-auto mb-6 animate-spin shadow-[0_0_30px_rgba(244,63,94,0.5)]"></div>
            <p className="text-white text-lg font-bold tracking-widest">正在為你尋找天父的回信...</p>
          </div>
        )}
      </div>
    </main>
  );
}