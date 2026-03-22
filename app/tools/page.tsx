'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Gift, Heart, ArrowDown, Music, Cloud } from 'lucide-react';
import { getMatchedLetter } from '@/data/letters';

// 為了讓滾動動畫生效的自訂 Hook
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

// 提取區塊元件來處理各自的 fade-up
function FadeSection({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div ref={ref} className={`w-full flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
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
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>救恩的禮物 | 烏鴉的嗎哪</title>
      </Head>

      {/* 明亮溫暖的背景光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 現代化毛玻璃導覽列 */}
      <nav className="p-4 md:p-6 lg:px-12 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-50 sticky top-0">
        <Link href="/christianity" className="text-slate-500 hover:text-slate-800 font-bold transition-all bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-md text-sm border border-white flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span className="tracking-tight">返回認識基督信仰</span>
        </Link>
      </nav>

      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center pt-10 pb-20 px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl w-full">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/20">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-10 tracking-tighter leading-tight">
              救恩的禮物
            </h1>
            
            <div className="bg-white/90 backdrop-blur-2xl border border-white shadow-xl p-8 md:p-12 rounded-[3rem] text-left mb-12 transform hover:scale-[1.01] transition-transform">
              <div className="mb-8 pb-8 border-b border-slate-100">
                <p className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-rose-500 mb-4 uppercase"><Music className="w-5 h-5"/> 分享一首感動的詩歌</p>
                <p className="text-2xl font-black text-slate-900 mb-4 tracking-tight">《感謝你全能十架》</p>
                <div className="text-xl md:text-2xl leading-[1.8] font-semibold text-slate-500">
                  主，我感謝你，全能十架，<br/>你親自為我們，捨命十架，<br/>在每一天你更新我們，能夠更像你，<br/>靠主十架，我們生命被改變，何等奇妙恩，<br/>我們讚美你，你救贖我們不惜代價，何等奇妙恩，<br/>我們讚美你，因為十架的大能，因為十架的大能。
                </div>
              </div>
              
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-orange-500 mb-4 uppercase">生命的選擇</p>
                <p className="text-2xl md:text-3xl font-black leading-tight mb-4 text-slate-900 tracking-tight">
                  「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」
                </p>
                <p className="text-base text-slate-400 font-mono italic">— 約翰福音 3:16</p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* 1. 起初創造 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[180px] flex justify-center items-center relative mx-auto overflow-visible mb-10">
            <svg viewBox="0 0 600 150" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="75" x2="550" y2="75" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
              <text x="30" y="85" textAnchor="end" className="text-2xl font-black fill-orange-500">神</text>
              <text x="570" y="85" textAnchor="start" className="text-2xl font-black fill-orange-500">生命</text>
              <circle cx="300" cy="75" r="18" fill="#ffffff" stroke="#f97316" strokeWidth="6" />
              <text x="300" y="40" textAnchor="middle" className="text-sm font-black fill-slate-700 uppercase tracking-widest">人</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tighter">起初的創造與關係</h2>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-bold">神創造人，要他們永遠與祂相交。神本要我們與祂建立關係，祂將祂的靈吹入我們的<span className="text-orange-500 underline decoration-orange-200 underline-offset-8">生命</span>。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 罪的隔絕 (優化罪字) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" opacity="0.2" />
              <text x="30" y="88" textAnchor="end" className="text-2xl font-black fill-orange-500" opacity="0.3">神</text>
              
              <path d="M 50 80 L 150 80 C 250 80, 250 200, 350 200 L 550 200" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              
              {/* 🌟 修正後的「罪」字：加上白色圓形背景確保不被擋住 */}
              <g transform="translate(250, 140)">
                <circle r="26" fill="white" className="shadow-sm" />
                <text textAnchor="middle" y="8" className="text-2xl font-black fill-slate-800">罪</text>
              </g>

              <circle cx="450" cy="200" r="16" fill="#ffffff" stroke="#334155" strokeWidth="6" />
              <text x="450" y="245" textAnchor="middle" className="text-sm font-black fill-slate-700 uppercase tracking-widest">人</text>
              <text x="570" y="208" textAnchor="start" className="text-2xl font-black fill-slate-800 tracking-tight">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tighter">伊甸園的選擇與隔絕</h2>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-bold">第一對人類選擇了不信任神，使人與神隔絕！因為<span className="text-slate-800 font-black">罪</span>，我們斷開了連結。罪的結局就是走向另一端——<span className="text-slate-800 underline decoration-slate-300 underline-offset-8">死亡</span>。</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 人的徒勞 (加入迷霧區) */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[280px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            <svg viewBox="0 0 600 280" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              {/* 🌟 迷霧區 SVG 實現 */}
              <defs>
                <filter id="fogEffect">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                </filter>
                <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              {/* 迷霧層放在線條中間 */}
              <rect x="50" y="100" width="500" height="80" fill="url(#fogGrad)" filter="url(#fogEffect)" />

              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" opacity="0.2" />
              <text x="30" y="88" textAnchor="end" className="text-2xl font-black fill-orange-500" opacity="0.3">神</text>
              
              <line x1="50" y1="200" x2="550" y2="200" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              <text x="570" y="208" textAnchor="start" className="text-2xl font-black fill-slate-800 tracking-tight">死亡</text>
              
              {/* 徒勞的努力 */}
              <g opacity="0.8">
                <line x1="120" y1="200" x2="120" y2="130" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="120" y="110" textAnchor="middle" className="text-base font-black fill-slate-500">行善</text>
                
                <line x1="210" y1="200" x2="210" y2="140" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="210" y="120" textAnchor="middle" className="text-base font-black fill-slate-500">功德</text>
                
                <line x1="300" y1="200" x2="300" y2="125" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="300" y="105" textAnchor="middle" className="text-base font-black fill-slate-500">宗教</text>
                
                <line x1="390" y1="200" x2="390" y2="135" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="390" y="115" textAnchor="middle" className="text-base font-black fill-slate-500">醫療</text>
                
                <line x1="480" y1="200" x2="480" y2="145" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrow-up)" />
                <text x="480" y="125" textAnchor="middle" className="text-base font-black fill-slate-500">養生</text>
              </g>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tighter">渴望回到神那裡</h2>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-bold">不論我們如何努力向上攀爬（行善、宗教、醫療養生），都無法跨越罪的巨大鴻溝，<span className="text-slate-900 underline decoration-slate-300 underline-offset-8">無法靠自己回到神那裡！</span></p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 神的方法 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto overflow-visible mb-12">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
              <line x1="50" y1="200" x2="550" y2="200" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              
              <line x1="300" y1="80" x2="300" y2="200" stroke="#e11d48" strokeWidth="16" strokeLinecap="round" />
              <line x1="230" y1="120" x2="370" y2="120" stroke="#e11d48" strokeWidth="16" strokeLinecap="round" />
              
              <text x="300" y="55" textAnchor="middle" className="text-xl fill-rose-600 font-black tracking-tight">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 tracking-tighter">神預備的方法</h2>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-bold">神因為愛我們的緣故，把祂獨生的愛子<span className="text-rose-600 font-black underline decoration-rose-200 underline-offset-8">耶穌</span>賜給我們，成為生命當中最美好的禮物！主耶穌降世，是為了世人，也是為你。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 我們的選擇 */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
        <FadeSection>
          <div className="text-center max-w-2xl mx-auto z-10 p-10 md:p-14 relative bg-white rounded-[3rem] border border-white shadow-2xl">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-8">
               <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
             </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tighter">我們的選擇</h2>
            <p className="text-xl md:text-2xl text-slate-500 mb-10 leading-relaxed font-bold">耶穌為你我的罪而死，三天後復活。其實我們有個選擇… 有一條道路可以回到神那裡！<br /><br /><span className="text-slate-900">你可以把心聲告訴祂。</span></p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white rounded-full text-xl font-black transition-all shadow-xl hover:-translate-y-1"
            >
              我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* Modal 部分保持原本邏輯，但調大字體 */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-white/90' : 'bg-slate-900/40 backdrop-blur-sm'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className={`bg-white w-[92%] max-w-[550px] rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-100 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button onClick={closeModal} className="absolute top-6 right-8 text-4xl text-slate-300 hover:text-slate-700 transition-colors">&times;</button>
            
            {modalState === 'input' && (
              <div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tighter">告訴天父你的決定...</h3>
                <p className="text-xl text-slate-500 mb-8 font-bold leading-relaxed">請寫下你目前的困難，或是願意接受這份禮物的心聲。這份祈禱只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父，我願意..." className="w-full h-[180px] p-6 border-2 border-slate-100 focus:border-rose-400 rounded-2xl resize-none text-xl text-slate-700 bg-slate-50 focus:bg-white transition-colors mb-8 outline-none font-bold"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-5 bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-full text-xl font-black tracking-wide transition-all shadow-lg">
                  送出我的心聲
                </button>
              </div>
            )}

            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-500">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[220px] object-cover rounded-3xl mb-8 shadow-sm border border-slate-50" />
                <h3 className="text-3xl font-black mb-6 tracking-tighter">💌 來自天父的信</h3>
                <div className="text-xl md:text-2xl mb-10 leading-loose whitespace-pre-wrap text-slate-700 font-bold">{letterData.text}</div>
                <div className="bg-rose-50 p-6 border-l-8 border-rose-400 rounded-r-2xl shadow-sm">
                  <p className="text-xl font-black mb-3 text-slate-900">{letterData.verse}</p>
                  <p className="text-base text-slate-500 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
      </div>
    </main>
  );
}