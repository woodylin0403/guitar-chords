'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircleHeart, Sparkles, ArrowDown, Lightbulb } from 'lucide-react'; // 🌟 新增 Lightbulb 圖示

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

export default function PrayerTool() {
  const router = useRouter(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false); 

  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    
    setIsRedirecting(true);
    const encodedPrayer = encodeURIComponent(prayerText);
    
    setTimeout(() => {
      router.push(`/letters?prayer=${encodedPrayer}`);
    }, 500); 
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden pb-32">
      <Head>
        <title>禱告的大能 | 烏鴉的嗎哪</title>
      </Head>

      {/* 明亮、清爽的背景光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 水晶質感導覽列 */}
      <nav className="p-4 md:p-6 lg:px-8 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-50 sticky top-0">
        <Link href="/christianity" className="group inline-flex items-center gap-2 px-5 py-3 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full text-stone-500 hover:text-stone-900 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-semibold text-sm tracking-wide">返回認識基督教</span>
        </Link>
      </nav>

      {/* === 0. 首頁封面區 === */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl w-full">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-cyan-500/20 transform hover:scale-105 transition-transform duration-500">
              <MessageCircleHeart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-12 tracking-tighter leading-tight">
              禱告的大能
            </h1>
            
            {/* 詩歌與金句質感卡片 */}
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgb(0,0,0,0.03)] p-8 md:p-12 rounded-[2.5rem] text-left mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -z-10"></div>
              
              <div className="mb-10 pb-10 border-b border-stone-100">
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-cyan-500 mb-4 uppercase">
                  安靜心，讓我們用這首詩歌來到祂面前
                </p>
                <p className="text-2xl font-bold text-stone-900 mb-5 tracking-tight">《我以禱告來到你面前》</p>
                <div className="text-lg md:text-xl leading-[1.8] font-medium text-stone-500">
                  我以禱告來到你面前，我要尋求你，<br/>
                  我要站在破口之中，在那裡我尋求你。<br/>
                  每一次我禱告，我搖動你的手，<br/>
                  禱告做的事，我的手不能做。<br/>
                  每一次我禱告，大山被挪移，<br/>
                  道路被鋪平，使列國歸向你。
                </div>
              </div>
              
              <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border-l-4 border-cyan-400 text-left">
                 {/* 🌟 1. 修改為完整的馬太福音經文 */}
                 <p className="text-lg md:text-xl font-bold leading-relaxed mb-4 text-stone-800 tracking-tight">
                   「你們祈求，就給你們；尋找，就尋見；叩門，就給你們開門。因為凡祈求的，就得著；尋找的，就尋見；叩門的，就給他開門。<br/><br/>
                   你們中間誰有兒子求餅，反給他石頭呢？求魚，反給他蛇呢？你們雖然不好，尚且知道拿好東西給兒女，何況你們在天上的父，豈不更把好東西給求他的人嗎？」
                 </p>
                 <p className="text-base text-stone-400 font-mono italic">— 馬太福音 7:7-11</p>
              </div>
            </div>
          </div>
        </FadeSection>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 flex flex-col items-center opacity-70">
          <span className="text-[10px] tracking-[0.2em] mb-2 font-bold uppercase">探索禱告的旅程</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </section>

      {/* === 1. 祈求 (Ask) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <path d="M120 180 C 150 200, 250 200, 280 180" fill="none" stroke="#d6d3d1" strokeWidth="8" strokeLinecap="round"/> 
              <path d="M150 185 C 170 195, 230 195, 250 185" fill="none" stroke="#e7e5e4" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="200" cy="140" r="16" fill="white" stroke="#22d3ee" strokeWidth="6" className="drop-shadow-md" /> 
              <path d="M190 110 Q 200 90, 210 110" fill="none" stroke="#22d3ee" strokeWidth="4" opacity="0.6"/>
              <path d="M180 80 Q 200 50, 220 80" fill="none" stroke="#22d3ee" strokeWidth="4" opacity="0.3"/>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-stone-900 tracking-tight">第一步：建立信心的根基 <span className="text-cyan-500 px-1">(祈求)</span></h2>
            <ul className="space-y-5 text-lg md:text-xl text-stone-600 font-medium mb-8 text-left max-w-xl mx-auto">
              <li className="flex gap-4 items-start"><span className="text-cyan-400 font-black mt-1">•</span> <span><strong className="text-stone-900">信心的約：</strong>神透過應許，將祂自己與我們緊緊綁在一起。</span></li>
              <li className="flex gap-4 items-start"><span className="text-cyan-400 font-black mt-1">•</span> <span><strong className="text-stone-900">信心的對象：</strong>禱告不是對空氣說話，而是向那位與我們立約的神呼求。</span></li>
              <li className="flex gap-4 items-start"><span className="text-cyan-400 font-black mt-1">•</span> <span><strong className="text-stone-900">回轉向神：</strong>當遇到難處，我們的第一步就是求告祂。</span></li>
            </ul>
            <p className="text-xl text-cyan-600 font-bold">祂承諾給予，因為祂是守約施慈愛的天父。</p>
          </div>
        </FadeSection>
      </section>

      {/* === 2. 尋找 (Seek) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <circle cx="200" cy="120" r="50" fill="none" stroke="#60a5fa" strokeWidth="6" opacity="0.2"/> 
              <circle cx="200" cy="120" r="20" fill="white" stroke="#60a5fa" strokeWidth="6" className="drop-shadow-md"/>
              <line x1="200" y1="20" x2="200" y2="60" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
              <line x1="200" y1="180" x2="200" y2="220" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
              <line x1="100" y1="120" x2="140" y2="120" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
              <line x1="260" y1="120" x2="300" y2="120" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-stone-900 tracking-tight">第二步：經歷信心的過程 <span className="text-blue-500 px-1">(尋找)</span></h2>
            <ul className="space-y-5 text-lg md:text-xl text-stone-600 font-medium mb-8 text-left max-w-xl mx-auto">
              <li className="flex gap-4 items-start"><span className="text-blue-400 font-black mt-1">•</span> <span><strong className="text-stone-900">不只是求：</strong>不再只停留在求好處，而是主動尋求認識神、親近神。</span></li>
              <li className="flex gap-4 items-start"><span className="text-blue-400 font-black mt-1">•</span> <span><strong className="text-stone-900">信心操練：</strong>在禱告中操練信心，也在信心裡尋求神的心意。</span></li>
              <li className="flex gap-4 items-start"><span className="text-blue-400 font-black mt-1">•</span> <span><strong className="text-stone-900">目光轉向：</strong>將眼光從「律法中的祝福」，轉向「賜恩典的主」。</span></li>
            </ul>
            <p className="text-xl text-blue-600 font-bold">尋找的過程，就是我們與天父關係更深的時刻。</p>
          </div>
        </FadeSection>
      </section>

      {/* === 3. 叩門 (Knock) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <rect x="140" y="50" width="120" height="160" fill="none" stroke="#d6d3d1" strokeWidth="6" rx="4" />
              <polygon points="140,50 220,30 220,190 140,210" fill="#a855f7" opacity="0.1" /> 
              <polygon points="140,50 220,30 220,190 140,210" fill="none" stroke="#a855f7" strokeWidth="4" />
              
              <path d="M 220 30 L 320 10 L 320 230 L 220 190 Z" fill="url(#light-gradient)" opacity="0.3"/>
              <defs>
                  <linearGradient id="light-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
              </defs>
              <circle cx="205" cy="130" r="6" fill="#a855f7" />
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-stone-900 tracking-tight">第三步：渴慕天父的同在 <span className="text-violet-500 px-1">(叩門)</span></h2>
            <ul className="space-y-5 text-lg md:text-xl text-stone-600 font-medium mb-8 text-left max-w-xl mx-auto">
              <li className="flex gap-4 items-start"><span className="text-violet-400 font-black mt-1">•</span> <span><strong className="text-stone-900">遇見神：</strong>不單單滿足於問題被解決，更是渴望遇見神自己。</span></li>
              <li className="flex gap-4 items-start"><span className="text-violet-400 font-black mt-1">•</span> <span><strong className="text-stone-900">沒有條件：</strong>「因為凡...」代表沒有其他門檻，有求必有回應。</span></li>
              <li className="flex gap-4 items-start"><span className="text-violet-400 font-black mt-1">•</span> <span><strong className="text-stone-900">進入同在：</strong>叩門，是為了要真真實實地進入天父的同在裡。</span></li>
            </ul>
            <p className="text-xl text-violet-600 font-bold">叩開的不是一扇門，而是進入天父永恆的擁抱。</p>
          </div>
        </FadeSection>
      </section>

      {/* === 4. 明白天父的好東西 === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <FadeSection>
          <div className="w-full h-[200px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible mx-auto">
              <path d="M 200 180 C 200 180, 120 120, 120 80 C 120 40, 180 30, 200 70 C 220 30, 280 40, 280 80 C 280 120, 200 180, 200 180 Z" fill="none" stroke="#14b8a6" strokeWidth="8" strokeLinejoin="round" />
              <circle cx="200" cy="95" r="30" fill="#14b8a6" opacity="0.1" />
              <line x1="200" y1="60" x2="200" y2="130" stroke="#14b8a6" strokeWidth="6" strokeLinecap="round"/>
              <line x1="180" y1="95" x2="220" y2="95" stroke="#14b8a6" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-stone-900 tracking-tight">關鍵：明白天父的 <span className="text-teal-500 px-1">好東西</span></h2>
            <ul className="space-y-5 text-lg md:text-xl text-stone-600 font-medium mb-8 text-left max-w-xl mx-auto">
              <li className="flex gap-4 items-start"><span className="text-teal-400 font-black mt-1">•</span> <span><strong className="text-stone-900">相同的 DNA：</strong>禱告不是法律規定，而是出自生命與愛的連結，我們是祂的兒女。</span></li>
              <li className="flex gap-4 items-start"><span className="text-teal-400 font-bold mt-1">•</span> <span><strong className="text-stone-900">看似堅硬的恩典：</strong>神給的看似辛苦（如耶穌的十字架），其實是生命最需要的養分。</span></li>
              <li className="flex gap-4 items-start"><span className="text-teal-400 font-bold mt-1">•</span> <span><strong className="text-stone-900">永恆的預備：</strong>地上的父親為今生打算，但天父為我們預備的是永生與得勝。</span></li>
            </ul>
            <p className="text-xl text-teal-600 font-bold">祂給的不只是短暫的滿足，而是永恆最美好的禮物。</p>
          </div>
        </FadeSection>
      </section>

      {/* 🌟 2. 新增：靜心思考區塊 (給慕道友的回應與反思) */}
      <section className="py-24 px-6 relative mt-10">
        <div className="absolute inset-0 bg-stone-100/50 skew-y-3 -z-10"></div>
        <FadeSection>
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center justify-center mb-12 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">靜心思考</h2>
              <p className="text-stone-500 mt-4 text-lg">在真正開口禱告之前，不妨先問問自己這三個問題</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300">
                <span className="text-4xl font-black text-cyan-100 mb-4 block">01</span>
                <p className="text-xl font-bold text-stone-800 mb-4 tracking-tight">你覺得「禱告」是什麼？</p>
                <p className="text-stone-600 leading-relaxed font-medium">是像對著購物清單許願、向機器人下指令，還是與一位深愛你的天父進行真實的對話？</p>
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <span className="text-4xl font-black text-blue-100 mb-4 block">02</span>
                <p className="text-xl font-bold text-stone-800 mb-4 tracking-tight">目前的缺口在哪裡？</p>
                <p className="text-stone-600 leading-relaxed font-medium">現在的你，最需要向天父「祈求」、「尋找」或「叩門」的事情是什麼？是平安、方向，還是力量？</p>
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                <span className="text-4xl font-black text-teal-100 mb-4 block">03</span>
                <p className="text-xl font-bold text-stone-800 mb-4 tracking-tight">關於「好東西」</p>
                <p className="text-stone-600 leading-relaxed font-medium">如果你確信天父真的會把「最好的安排」給你（即使當下看不懂），這會如何改變你面對眼前困難的態度？</p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* === 5. 決志行動呼籲 === */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-400/10 rounded-full blur-[200px] pointer-events-none"></div>
        <FadeSection>
          <div className="text-center max-w-2xl relative z-10 bg-white/60 p-10 md:p-16 rounded-[3rem] border border-white backdrop-blur-xl shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 tracking-tight">現在，換你來敲門了</h2>
            <p className="text-lg md:text-xl text-stone-500 mb-12 leading-relaxed font-medium">
              天父正在等候聽你的聲音。<br/>不論是你自己正面臨的挑戰、需要做的決定，或是你心裡掛念的家人、朋友... <br/><br/>
              <span className="text-stone-800 font-bold text-xl block">大膽地寫下你最真實的需要，<br/>為那個人祈求祝福吧！</span>
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group w-full py-5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg md:text-xl font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)] flex justify-center items-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform" /> 我要寫下我的禱告
            </button>
          </div>
        </FadeSection>
      </section>

      {/* === Modal 彈出視窗 === */}
      <div className={`fixed inset-0 w-full h-full ${isRedirecting ? 'bg-white/90' : 'bg-stone-900/40 backdrop-blur-md'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget && !isRedirecting) closeModal(); }}>
          
          {!isRedirecting && (
            <div className={`bg-white w-[92%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_40px_80px_rgb(0,0,0,0.1)] border border-white relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
              <button onClick={closeModal} className="absolute top-5 right-6 text-2xl text-stone-300 hover:text-stone-600 transition-colors">&times;</button>
              
              <div>
                <h3 className="text-2xl font-extrabold mb-3 text-stone-900 tracking-tight">親愛的天父...</h3>
                <p className="text-base text-stone-500 mb-6 font-medium leading-relaxed">請寫下你目前最真實的需要、你想突破的困境，或是你想為誰（家人/朋友）祈求祝福？這份禱告卡只有你和天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我想祈求..." className="w-full h-[150px] p-5 border-2 border-stone-100 focus:border-cyan-400 rounded-xl resize-none text-base text-stone-700 bg-stone-50 focus:bg-white transition-colors mb-6 outline-none font-medium"/>
                
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:from-stone-200 disabled:to-stone-200 text-white rounded-full text-lg font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  送出我的禱告
                </button>
              </div>
            </div>
          )}
          
          {isRedirecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50">
              <div className="w-10 h-10 border-4 border-cyan-100 border-t-cyan-500 rounded-full mb-5 animate-spin"></div>
              <p className="text-stone-800 text-base font-bold tracking-widest animate-pulse">正在將你的禱告帶到天父面前...</p>
            </div>
          )}
      </div>
    </main>
  );
}