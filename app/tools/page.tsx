'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Gift, Heart, ArrowDown, Music } from 'lucide-react';
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
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <div ref={ref} className={`w-full flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
}

// 輔助小圖示元件
function ArrowUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
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
      <nav className="p-4 md:p-6 lg:px-12 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-10 sticky top-0">
        <Link href="/christianity" className="text-slate-500 hover:text-slate-800 font-medium transition-all bg-white/70 backdrop-blur-xl px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-sm text-sm border border-slate-200/60 flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">返回認識基督信仰</span><span className="sm:hidden">返回</span>
        </Link>
      </nav>

      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#94a3b8" /> {/* slate-400 */}
          </marker>
        </defs>
      </svg>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center pt-10 pb-20 px-5 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl w-full">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
              <Gift className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-8 tracking-tighter leading-tight">
              救恩的禮物
            </h1>
            
            {/* 🌟 恢復的詩歌與金句區塊 */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 md:p-8 rounded-[2rem] text-left mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-rose-500 mb-3 uppercase"><Music className="w-4 h-4"/> 首先，分享一首好聽的詩歌</p>
                <p className="font-bold text-slate-800 mb-2">《感謝你全能十架》</p>
                <div className="text-sm md:text-base leading-loose font-medium text-slate-500">
                  主，我感謝你，全能十架，<br/>你親自為我們，捨命十架，<br/>在每一天你更新我們，能夠更像你，<br/>靠主十架，我們生命被改變，何等奇妙恩，<br/>我們讚美你，你救贖我們不惜代價，何等奇妙恩，<br/>我們讚美你，因為十架的大能，因為十架的大能。
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold tracking-widest text-orange-500 mb-3 uppercase">生命的選擇</p>
                <p className="text-lg md:text-xl font-bold leading-relaxed mb-3 text-slate-800">
                  「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」
                </p>
                <p className="text-sm text-slate-400 font-mono italic">— 約翰福音 3:16</p>
              </div>
            </div>
            
            <p className="text-base md:text-lg text-slate-500 font-medium">很久… 很久以前…<br/>起初… 神創造天地</p>
          </div>
          
          <div className="w-full h-[150px] mt-8 flex justify-center items-center relative mx-auto overflow-visible">
            {/* 神與生命線 (清晰版) */}
            <svg viewBox="0 0 600 150" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="100" y1="75" x2="500" y2="75" stroke="#f97316" strokeWidth="8" strokeLinecap="round" /> {/* orange-500 */}
              <circle cx="300" cy="75" r="10" fill="#f97316" />
            </svg>
          </div>
        </FadeSection>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 flex flex-col items-center">
          <span className="text-xs tracking-widest mb-1 font-bold uppercase">向下滾動</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* 1. 起初創造 (神/生命線) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-5 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[150px] flex justify-center items-center relative mx-auto overflow-visible mb-8">
            <svg viewBox="0 0 600 150" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="75" x2="550" y2="75" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
              <text x="30" y="82" textAnchor="end" className="text-xl font-extrabold fill-orange-500">神</text>
              <text x="570" y="82" textAnchor="start" className="text-xl font-extrabold fill-orange-500">生命</text>
              <circle cx="300" cy="75" r="14" fill="#ffffff" stroke="#f97316" strokeWidth="5" />
              <text x="300" y="45" textAnchor="middle" className="text-sm font-bold fill-slate-700">人</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 tracking-tight">起初的創造與關係</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">神創造人，要他們永遠與祂相交、來往。神本要我們與祂建立關係，祂將祂的靈吹入我們的<span className="text-orange-500 font-bold">生命</span>。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 罪的隔絕 (死亡線) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-5 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-8">
            {/* 🌟 強化視覺的罪與死亡線 */}
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="8" strokeLinecap="round" opacity="0.25" />
              <text x="30" y="88" textAnchor="end" className="text-xl font-extrabold fill-orange-500" opacity="0.3">神</text>
              
              {/* 罪的轉彎路徑 (加粗、加深深灰色) */}
              <path d="M 50 80 L 150 80 C 250 80, 250 200, 350 200 L 550 200" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" /> {/* slate-600 */}
              <text x="250" y="145" textAnchor="middle" className="text-xl font-extrabold fill-slate-500">罪</text>
              <circle cx="450" cy="200" r="14" fill="#ffffff" stroke="#475569" strokeWidth="5" />
              <text x="450" y="235" textAnchor="middle" className="text-sm font-bold fill-slate-700">人</text>
              <text x="570" y="208" textAnchor="start" className="text-xl font-extrabold fill-slate-700">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 tracking-tight">伊甸園的選擇與隔絕</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">第一對人類選擇了不信任神，這個選擇使人與神隔絕了！因為<span className="text-slate-500 font-bold">罪</span>，人與神的道斷開了連結。罪的結局就是走向另一端——<span className="text-slate-700 font-bold">死亡</span>！</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 人的徒勞 (向上虛線) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-5 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-8">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="8" strokeLinecap="round" opacity="0.25" />
              <text x="30" y="88" textAnchor="end" className="text-xl font-extrabold fill-orange-500" opacity="0.3">神</text>
              <line x1="50" y1="200" x2="550" y2="200" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              <text x="570" y="208" textAnchor="start" className="text-xl font-extrabold fill-slate-700">死亡</text>
              
              {/* 向上虛線圖 */}
              <line x1="120" y1="200" x2="120" y2="120" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="120" y="100" textAnchor="middle" className="text-sm font-bold fill-slate-500">行善</text>
              <line x1="210" y1="200" x2="210" y2="130" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="210" y="110" textAnchor="middle" className="text-sm font-bold fill-slate-500">功德</text>
              <line x1="300" y1="200" x2="300" y2="115" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="300" y="95" textAnchor="middle" className="text-sm font-bold fill-slate-500">宗教</text>
              <line x1="390" y1="200" x2="390" y2="125" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="390" y="105" textAnchor="middle" className="text-sm font-bold fill-slate-500">醫療</text>
              <line x1="480" y1="200" x2="480" y2="135" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
              <text x="480" y="115" textAnchor="middle" className="text-sm font-bold fill-slate-500">養生</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 tracking-tight">渴望回到神那裡</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">不論我們如何努力向上攀爬（行善、宗教、積功德，甚至是醫療養生），都無法跨越罪的巨大鴻溝，無法靠自己回到神那裡！</p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 神的方法 (降世橋樑線) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-5 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-8">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
              <line x1="50" y1="200" x2="550" y2="200" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              
              {/* 十字架橋樑 */}
              <line x1="300" y1="80" x2="300" y2="200" stroke="#e11d48" strokeWidth="14" strokeLinecap="round" /> {/* rose-600 */}
              <line x1="240" y1="120" x2="360" y2="120" stroke="#e11d48" strokeWidth="14" strokeLinecap="round" />
              
              <text x="300" y="60" textAnchor="middle" className="text-base fill-rose-600 font-extrabold">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 tracking-tight">神預備的方法</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">神因為愛我們的緣故，把祂獨生的愛子<span className="text-rose-600 font-bold">耶穌</span>賜給我們，成為我們生命當中最美好的禮物！主耶穌降世，是為了世人，也是為我，也是為你。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 轉回與選擇 (轉回路徑) */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center py-20 px-5 relative overflow-hidden">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto overflow-visible mb-8">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
              <line x1="50" y1="200" x2="300" y2="200" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              <line x1="300" y1="80" x2="300" y2="200" stroke="#e11d48" strokeWidth="14" strokeLinecap="round" opacity="0.15"/> 

              {/* 轉回路徑 - 橘色明顯虛線 */}
              <path d="M 200 200 L 250 200 C 280 200, 300 180, 300 140 C 300 100, 320 80, 350 80 L 400 80" fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 8" />
              <polygon points="400,80 390,75 390,85" fill="#f97316" />
              
              <circle cx="200" cy="200" r="14" fill="#ffffff" stroke="#475569" strokeWidth="5" />
            </svg>
          </div>
          <div className="text-center max-w-xl mx-auto z-10 px-6 py-10 md:p-12 relative bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgb(0,0,0,0.06)]">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-800 tracking-tight">我們的選擇</h2>
            <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed font-medium">耶穌為你我的罪而死，三天後復活。其實我們有個選擇… 有一條道路可以回到神那裡！離開死亡之路！耶穌的死與復活，與你如何發生關係？你可以把心聲告訴祂。</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white rounded-full text-base md:text-lg font-bold transition-all shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_25px_rgba(244,63,94,0.4)] hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /> 我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* Modal 視窗 (Light Theme) */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-white/90' : 'bg-slate-900/40 backdrop-blur-sm'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-white w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgb(0,0,0,0.1)] border border-slate-100 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button onClick={closeModal} className="absolute top-5 right-5 text-3xl text-slate-400 hover:text-slate-700 transition-colors">&times;</button>
            
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-bold mb-2 text-slate-800 tracking-tight">告訴天父你的決定...</h3>
                <p className="text-slate-500 mb-6 text-sm md:text-base font-medium leading-relaxed">請寫下你目前的困難，或是願意接受這份禮物的心聲。這份祈禱只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父，我願意..." className="w-full h-[150px] p-4 border border-slate-200 focus:border-rose-400 rounded-xl resize-none text-slate-700 bg-slate-50 focus:bg-white transition-colors mb-6 outline-none font-medium"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-full text-lg font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(244,63,94,0.2)]">
                  送出我的心聲
                </button>
              </div>
            )}

            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-500">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[180px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-100" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight flex items-center gap-2">
                   <Link href="/letters" className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">💌 來自天父的信</Link>
                </h3>
                <div className="text-base md:text-lg mb-8 leading-loose whitespace-pre-wrap text-slate-700 font-medium">{letterData.text}</div>
                <div className="bg-rose-50 p-5 border-l-4 border-rose-400 rounded-r-xl">
                  <p className="font-bold mb-2 text-slate-800">{letterData.verse}</p>
                  <p className="text-sm text-slate-500 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Loading Spinner */}
        {modalState === 'loading' && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full mx-auto mb-5 animate-spin"></div>
            <p className="text-slate-800 text-lg font-bold tracking-widest">正在為你尋找天父的回信...</p>
          </div>
        )}
      </div>
    </main>
  );
}