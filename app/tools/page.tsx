'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Gift, Heart, ArrowDown, Music } from 'lucide-react';
import { getMatchedLetter } from '@/data/letters';

// 平滑出現的動畫 Hook
function useOnScreen(options: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);

  return [ref, isVisible] as const;
}

// 質感淡入區塊元件
function FadeSection({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
  return (
    <div ref={ref} className={`w-full flex flex-col items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
      {children}
    </div>
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

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden pb-32">
      <Head>
        <title>救恩的禮物 | 烏鴉的嗎哪</title>
      </Head>

      {/* 環境氛圍光暈 (Ambient Lights) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-orange-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 水晶質感導覽列 */}
      <nav className="p-4 md:p-6 lg:px-8 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-50 sticky top-0">
        <Link href="/christianity" className="group inline-flex items-center gap-2 px-5 py-3 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full text-stone-500 hover:text-stone-900 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-semibold text-sm tracking-wide">返回認識基督教</span>
        </Link>
      </nav>

      {/* 供箭頭使用的 SVG 定義 */}
      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#a8a29e" />
          </marker>
        </defs>
      </svg>

      {/* === 0. 首頁封面區 === */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl w-full">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/20 transform hover:scale-105 transition-transform duration-500">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-12 tracking-tighter leading-tight">
              救恩的禮物
            </h1>
            
            {/* 詩歌與金句質感卡片 */}
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgb(0,0,0,0.03)] p-8 md:p-12 rounded-[2.5rem] text-left mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10"></div>
              
              <div className="mb-10 pb-10 border-b border-stone-100">
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-rose-500 mb-4 uppercase">
                  <Music className="w-4 h-4"/> 分享一首感動的詩歌
                </p>
                <p className="text-2xl font-bold text-stone-900 mb-5 tracking-tight">《感謝你全能十架》</p>
                <div className="text-lg md:text-xl leading-[1.8] font-medium text-stone-500">
                  主，我感謝你，全能十架，<br/>你親自為我們，捨命十架，<br/>在每一天你更新我們，能夠更像你...
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-orange-500 mb-4 uppercase">生命的承諾</p>
                <p className="text-2xl md:text-3xl font-bold leading-snug mb-5 text-stone-800 tracking-tight">
                  「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」
                </p>
                <p className="text-base text-stone-400 font-mono italic">— 約翰福音 3:16</p>
              </div>
            </div>
          </div>
        </FadeSection>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 flex flex-col items-center opacity-70">
          <span className="text-[10px] tracking-[0.2em] mb-2 font-bold uppercase">向下滑動</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* === 1. 起初創造 === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[180px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 600 150" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              {/* 神的線 */}
              <line x1="80" y1="75" x2="520" y2="75" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
              <text x="50" y="83" textAnchor="end" className="text-2xl font-bold fill-orange-500">神</text>
              <text x="550" y="83" textAnchor="start" className="text-2xl font-bold fill-orange-500">生命</text>
              
              {/* 人的節點 */}
              <circle cx="300" cy="75" r="18" fill="white" stroke="#f97316" strokeWidth="6" />
              <text x="300" y="40" textAnchor="middle" className="text-base font-bold fill-stone-600 tracking-widest">人</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-stone-900 tracking-tight">起初的創造與關係</h2>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-medium">
              神創造人，要他們永遠與祂相交。神本要我們與祂建立關係，祂將祂的靈吹入我們的<span className="text-orange-500 font-bold px-1">生命</span>。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 2. 罪的隔絕 (立體徽章版) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[280px] flex justify-center items-center relative mx-auto mb-12">
            <svg viewBox="0 0 600 280" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="12" strokeLinecap="round" opacity="0.15" />
              <text x="50" y="88" textAnchor="end" className="text-2xl font-bold fill-orange-500" opacity="0.3">神</text>
              
              {/* 墮落的曲線 */}
              <path d="M 80 80 L 150 80 C 250 80, 250 220, 350 220 L 520 220" fill="none" stroke="#292524" strokeWidth="12" strokeLinecap="round" />
              
              {/* 🌟 完美的「罪」字 UI 徽章 */}
              <g transform="translate(250, 150)">
                <circle r="32" fill="white" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.12))" />
                <circle r="32" fill="none" stroke="#e7e5e4" strokeWidth="2" />
                <text textAnchor="middle" y="8" className="text-3xl font-black fill-stone-800">罪</text>
              </g>

              {/* 人的節點 */}
              <circle cx="450" cy="220" r="18" fill="white" stroke="#292524" strokeWidth="6" />
              <text x="450" y="265" textAnchor="middle" className="text-base font-bold fill-stone-600 tracking-widest">人</text>
              <text x="550" y="228" textAnchor="start" className="text-2xl font-bold fill-stone-900">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-stone-900 tracking-tight">伊甸園的選擇與隔絕</h2>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-medium">
              第一對人類選擇了不信任神，使人與神隔絕！因為<span className="font-bold text-stone-900 px-1">罪</span>，我們斷開了連結。罪的結局就是走向另一端——<span className="font-bold text-stone-900">死亡</span>。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 3. 人的徒勞 (高級毛玻璃迷霧層) === */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[320px] flex justify-center items-center relative mx-auto mb-12">
            
            {/* SVG 繪製基本線條與文字 */}
            <svg viewBox="0 0 600 320" className="w-full h-full max-w-[650px] overflow-visible mx-auto absolute inset-0 z-0">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="12" strokeLinecap="round" opacity="0.15" />
              <text x="50" y="88" textAnchor="end" className="text-2xl font-bold fill-orange-500" opacity="0.3">神</text>
              
              <line x1="80" y1="260" x2="520" y2="260" stroke="#292524" strokeWidth="12" strokeLinecap="round" />
              <text x="550" y="268" textAnchor="start" className="text-2xl font-bold fill-stone-900">死亡</text>
              
              {/* 徒勞的努力 (虛線) */}
              <g opacity="0.6">
                <line x1="140" y1="260" x2="140" y2="150" stroke="#a8a29e" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="140" y="130" textAnchor="middle" className="text-lg font-bold fill-stone-500">行善</text>
                
                <line x1="220" y1="260" x2="220" y2="170" stroke="#a8a29e" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="220" y="150" textAnchor="middle" className="text-lg font-bold fill-stone-500">功德</text>
                
                <line x1="300" y1="260" x2="300" y2="140" stroke="#a8a29e" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="300" y="120" textAnchor="middle" className="text-lg font-bold fill-stone-500">宗教</text>
                
                <line x1="380" y1="260" x2="380" y2="160" stroke="#a8a29e" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="380" y="140" textAnchor="middle" className="text-lg font-bold fill-stone-500">醫療</text>
                
                <line x1="460" y1="260" x2="460" y2="180" stroke="#a8a29e" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="460" y="160" textAnchor="middle" className="text-lg font-bold fill-stone-500">養生</text>
              </g>
            </svg>

            {/* 🌟 完美的迷霧屏障 (HTML/CSS Glassmorphism Overlay) */}
            <div className="absolute top-[35%] left-0 w-full h-[35%] z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[90%] md:w-[70%] h-full bg-stone-200/40 backdrop-blur-[6px] rounded-[3rem] shadow-[0_0_40px_rgba(231,229,228,0.8)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>
            </div>

          </div>
          <div className="text-center max-w-2xl mx-auto z-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-stone-900 tracking-tight">渴望回到神那裡</h2>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-medium">
              不論我們如何努力向上攀爬（行善、宗教、醫療養生），都無法跨越那道罪的巨大屏障，<span className="font-bold text-stone-900">無法靠自己回到神那裡。</span>
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 4. 神的方法 (十字架橋樑) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[280px] flex justify-center items-center relative mx-auto mb-12">
            <svg viewBox="0 0 600 280" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
              <line x1="80" y1="240" x2="520" y2="240" stroke="#292524" strokeWidth="12" strokeLinecap="round" />
              
              {/* 十字架 */}
              <line x1="300" y1="80" x2="300" y2="240" stroke="#e11d48" strokeWidth="20" strokeLinecap="round" />
              <line x1="220" y1="130" x2="380" y2="130" stroke="#e11d48" strokeWidth="20" strokeLinecap="round" />
              
              <text x="300" y="55" textAnchor="middle" className="text-xl font-black fill-rose-600 tracking-wider">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-stone-900 tracking-tight">神預備的方法</h2>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-medium">
              神因為愛我們的緣故，把祂獨生的愛子<span className="text-rose-600 font-bold px-1">耶穌</span>賜給我們，成為生命當中最美好的禮物！主耶穌降世，為我們造了一座橋。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 5. 我們的選擇 === */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="text-center max-w-2xl mx-auto z-10 p-10 md:p-16 relative bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
             <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full mb-8 shadow-inner border border-rose-100">
               <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
             </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 tracking-tight">我們的選擇</h2>
            <p className="text-lg md:text-xl text-stone-500 mb-12 leading-relaxed font-medium">
              耶穌為你我的罪而死，三天後復活。其實我們有個選擇… 有一條道路可以回到神那裡！離開死亡之路！<br /><br />
              <span className="text-stone-800 font-bold">你可以把心聲告訴祂。</span>
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group w-full py-5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg md:text-xl font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)]"
            >
              我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* === Modal 彈出視窗 === */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-white/90' : 'bg-stone-900/30 backdrop-blur-md'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className={`bg-white w-[92%] max-w-[550px] rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_80px_rgb(0,0,0,0.1)] border border-white relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
            <button onClick={closeModal} className="absolute top-6 right-8 text-3xl text-stone-300 hover:text-stone-600 transition-colors">&times;</button>
            
            {modalState === 'input' && (
              <div>
                <h3 className="text-3xl font-extrabold mb-4 text-stone-900 tracking-tight">告訴天父你的決定...</h3>
                <p className="text-lg text-stone-500 mb-8 font-medium leading-relaxed">請寫下你目前的困難，或是願意接受這份禮物的心聲。這份祈禱只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父，我願意..." className="w-full h-[180px] p-6 border-2 border-stone-100 focus:border-rose-400 rounded-2xl resize-none text-xl text-stone-700 bg-stone-50 focus:bg-white transition-colors mb-8 outline-none font-medium"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-stone-200 disabled:to-stone-200 text-white rounded-full text-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  送出我的心聲
                </button>
              </div>
            )}

            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-700">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[240px] object-cover rounded-[2rem] mb-8 shadow-sm" />
                <h3 className="text-2xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">💌 來自天父的信</h3>
                <div className="text-lg md:text-xl mb-10 leading-loose whitespace-pre-wrap text-stone-700 font-medium">{letterData.text}</div>
                <div className="bg-stone-50 p-6 border-l-4 border-stone-300 rounded-r-2xl">
                  <p className="text-lg font-bold mb-3 text-stone-800">{letterData.verse}</p>
                  <p className="text-sm text-stone-400 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
          
          {modalState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50">
              <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full mb-6 animate-spin"></div>
              <p className="text-stone-800 text-lg font-bold tracking-widest animate-pulse">正在為你尋找天父的回信...</p>
            </div>
          )}
      </div>
    </main>
  );
}