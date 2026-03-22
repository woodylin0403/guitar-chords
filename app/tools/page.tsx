'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift, Heart, ArrowDown, Cross, Wand2 } from 'lucide-react';
import { getMatchedLetter } from '@/data/letters';

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

function FadeSection({ children, delay = '' }: { children: React.ReactNode, delay?: string }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} w-full flex justify-center`}>
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
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      
      {/* 導覽列 */}
      <nav className="fixed top-0 w-full p-6 z-50 flex justify-start">
        <Link href="/christianity" className="text-slate-400 hover:text-white font-medium transition-all bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm text-sm border border-white/10 flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回認識基督信仰
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative">
        <div className="absolute top-1/4 w-[60%] h-[60%] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none"></div>
        <FadeSection>
          <div className="text-center z-10 max-w-2xl">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/30">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 mb-8 tracking-tighter">救恩的禮物</h1>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] text-left mb-10 shadow-2xl">
              <p className="text-rose-400 font-bold mb-4 tracking-widest text-sm">VERSE OF THE DAY</p>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4 text-slate-200">「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」</p>
              <p className="text-slate-500 font-mono">— 約翰福音 3:16</p>
            </div>
            <p className="text-xl text-slate-400 font-medium">起初... 神創造天地</p>
          </div>
        </FadeSection>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 flex flex-col items-center">
          <span className="text-xs tracking-widest mb-2 font-bold uppercase">向下滾動</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* 1. 起初創造 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6">
        <FadeSection>
          <div className="text-center max-w-2xl">
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)] flex items-center justify-center font-bold text-yellow-900">神</div>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full"></div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-400 shadow-[0_0_50px_rgba(96,165,250,0.6)] flex items-center justify-center font-bold text-blue-950">人</div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">起初的創造與關係</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">神本要我們與祂建立美好的關係。祂將祂的靈吹入我們的生命，要我們永遠與祂相交。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 罪的隔絕 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="text-center max-w-2xl">
            <div className="flex items-center justify-center gap-4 mb-12 relative">
              <div className="w-16 h-16 rounded-full bg-yellow-400/30 flex items-center justify-center font-bold text-yellow-900/50">神</div>
              <div className="w-24 h-1 bg-slate-800 rounded-full"></div>
              {/* 深淵/罪 */}
              <div className="w-32 h-32 rounded-full border border-red-500/30 flex flex-col items-center justify-center text-red-500 font-bold tracking-widest shadow-[inset_0_0_50px_rgba(239,68,68,0.2)]">
                <span className="text-2xl mb-1">罪</span>
                <span className="text-xs text-red-500/60">隔絕</span>
              </div>
              <div className="w-24 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-16 h-16 rounded-full bg-blue-400/30 flex items-center justify-center font-bold text-blue-950/50">人</div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">伊甸園的選擇與隔絕</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">人類選擇了偏離神的教導。<span className="text-red-400">罪</span>使人與神斷開了連結，偏離了生命軌道，走向了另一端——死亡。</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 人的徒勞 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6">
        <FadeSection>
          <div className="text-center max-w-2xl">
             <div className="flex gap-4 justify-center mb-10 text-slate-500 font-medium text-sm">
                <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0s'}}><ArrowUp />行善</div>
                <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0.2s'}}><ArrowUp />宗教</div>
                <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0.4s'}}><ArrowUp />功德</div>
                <div className="flex flex-col items-center gap-2 animate-bounce" style={{animationDelay: '0.6s'}}><ArrowUp />養生</div>
             </div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">我們渴望回到神那裡</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">不論我們如何努力向上攀爬（行善、宗教、積功德），都無法跨越罪的巨大鴻溝，無法靠自己回到神那裡。</p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 耶穌降世 */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6">
        <FadeSection>
          <div className="text-center max-w-2xl">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(244,63,94,0.4)] rotate-45">
               <div className="-rotate-45 font-extrabold text-2xl text-white">耶穌</div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">神預備的唯一橋樑</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">神因為愛我們的緣故，把祂獨生的愛子賜給我們，成為我們生命當中最美好的禮物。祂成為了那座跨越死亡的橋樑。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 選擇與決志 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/10 rounded-full blur-[200px] pointer-events-none"></div>
        <FadeSection>
          <div className="text-center max-w-2xl relative z-10 bg-slate-900/50 p-10 md:p-14 rounded-[3rem] border border-slate-800 backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">現在，是你的選擇</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">耶穌的死與復活，與你如何發生關係？<br/>有一條道路可以回到神那裡，如果你願意敞開心門。</p>
            
            <button onClick={() => setIsModalOpen(true)} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] hover:-translate-y-1">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /> 我也想要這份禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* Modal 視窗 (與天父的信共用相同邏輯) */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-black' : 'bg-slate-950/80 backdrop-blur-xl'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-slate-900 w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.5)] border border-slate-800 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
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

// 輔助小圖示元件
function ArrowUp() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="m18 15-6-6-6 6"/></svg>
}