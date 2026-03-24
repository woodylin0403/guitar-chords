'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // 🌟 加入 useRouter 用於頁面跳轉
import { ArrowLeft, Gift, Heart, ArrowDown, Music } from 'lucide-react';

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
  const router = useRouter(); // 🌟 初始化 router
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false); // 🌟 新增：處理轉址時的狀態

  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    
    // 🌟 不再處理本地資料，而是進入轉址狀態，直接帶著參數跳轉去 /letters
    setIsRedirecting(true);
    const encodedPrayer = encodeURIComponent(prayerText);
    
    // 給一點視覺緩衝時間再跳轉
    setTimeout(() => {
      router.push(`/letters?prayer=${encodedPrayer}`);
    }, 500); 
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden pb-32">
      <Head>
        <title>救恩的禮物 | 烏鴉的嗎哪</title>
      </Head>

      {/* 環境氛圍光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-orange-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 導覽列 */}
      <nav className="p-4 md:p-6 lg:px-8 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-50 sticky top-0">
        <Link href="/christianity" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full text-stone-500 hover:text-stone-900 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-semibold text-sm tracking-wide">返回認識基督教</span>
        </Link>
      </nav>

      {/* SVG 箭頭定義 */}
      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#a8a29e" />
          </marker>
          <marker id="arrow-up-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#e11d48" />
          </marker>
        </defs>
      </svg>

      {/* === 0. 首頁封面區 === */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 relative text-center">
        <FadeSection>
          <div className="z-10 max-w-2xl w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20 transform hover:scale-105 transition-transform duration-500">
              <Gift className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-10 tracking-tighter leading-tight">
              救恩的禮物
            </h1>
            
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgb(0,0,0,0.03)] p-8 md:p-10 rounded-[2rem] text-left mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10"></div>
              
              <div className="mb-8 pb-8 border-b border-stone-100">
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-rose-500 mb-3 uppercase">
                  <Music className="w-4 h-4"/> 分享一首感動的詩歌
                </p>
                <p className="text-xl font-bold text-stone-900 mb-4 tracking-tight">《感謝你全能十架》</p>
                <div className="text-base md:text-lg leading-[1.8] font-medium text-stone-500">
                  主，我感謝你，全能十架，<br/>
                  你親自為我們，捨命十架，<br/>
                  在每一天你更新我們，能夠更像你，<br/>
                  靠主十架，我們生命被改變，何等奇妙恩，<br/>
                  我們讚美你，你救贖我們不惜代價，何等奇妙恩，<br/>
                  我們讚美你，因為十架的大能，因為十架的大能。
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-orange-500 mb-3 uppercase">生命的承諾</p>
                <p className="text-lg md:text-xl font-bold leading-snug mb-3 text-stone-800 tracking-tight">
                  「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」
                </p>
                <p className="text-sm text-stone-400 font-mono italic">— 約翰福音 3:16</p>
              </div>
            </div>
          </div>
        </FadeSection>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 flex flex-col items-center opacity-70">
          <span className="text-[10px] tracking-[0.2em] mb-1 font-bold uppercase">向下滑動</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      {/* === 1. 起初創造 === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="w-full h-[150px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 600 150" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="75" x2="520" y2="75" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
              <text x="50" y="81" textAnchor="end" className="text-xl font-bold fill-orange-500">神</text>
              <text x="550" y="81" textAnchor="start" className="text-xl font-bold fill-orange-500">生命</text>
              
              <circle cx="300" cy="75" r="14" fill="white" stroke="#f97316" strokeWidth="5" />
              <text x="300" y="45" textAnchor="middle" className="text-sm font-bold fill-stone-600 tracking-widest">人</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto z-10 px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-stone-900 tracking-tight">起初的創造與關係</h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed font-medium">
              神創造人，要他們永遠與祂相交。神本要我們與祂建立關係，祂將祂的靈吹入我們的<span className="text-orange-500 font-bold px-1">生命</span>。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 2. 罪的隔絕 (加入亞當夏娃的故事) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" opacity="0.15" />
              <text x="50" y="86" textAnchor="end" className="text-xl font-bold fill-orange-500" opacity="0.3">神</text>
              
              <path d="M 80 80 L 150 80 C 250 80, 250 200, 350 200 L 520 200" fill="none" stroke="#292524" strokeWidth="10" strokeLinecap="round" />
              
              <g transform="translate(250, 140)">
                <circle r="26" fill="white" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.1))" />
                <circle r="26" fill="none" stroke="#e7e5e4" strokeWidth="2" />
                <text textAnchor="middle" y="6" className="text-2xl font-black fill-stone-800">罪</text>
              </g>

              <circle cx="450" cy="200" r="14" fill="white" stroke="#292524" strokeWidth="5" />
              <text x="450" y="235" textAnchor="middle" className="text-sm font-bold fill-stone-600 tracking-widest">人</text>
              <text x="550" y="206" textAnchor="start" className="text-xl font-bold fill-stone-900">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-stone-900 tracking-tight">伊甸園的選擇與隔絕</h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed font-medium">
              在起初的伊甸園裡，神給了人自由。然而，第一對人類（亞當與夏娃）被蛇誘惑，吃下了分別善惡樹的果子，選擇了不信任神。<br /><br />
              這個選擇使人與神隔絕了！因為<span className="font-bold text-stone-900 px-1">罪</span>，我們斷開了與神連結的道路。罪的結局就是偏離生命，走向另一端——<span className="font-bold text-stone-900">死亡</span>。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 3. 人的徒勞 (攔阻的牆) === */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="w-full h-[300px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" opacity="0.15" />
              <text x="50" y="86" textAnchor="end" className="text-xl font-bold fill-orange-500" opacity="0.3">神</text>
              
              <line x1="80" y1="240" x2="520" y2="240" stroke="#292524" strokeWidth="10" strokeLinecap="round" />
              <text x="550" y="246" textAnchor="start" className="text-xl font-bold fill-stone-900">死亡</text>
              
              {/* 🌟 罪的高牆 */}
              <rect x="120" y="120" width="360" height="30" fill="#9ca3af" rx="4" opacity="0.9" />
              <rect x="120" y="120" width="360" height="30" fill="none" stroke="#6b7280" strokeWidth="2" rx="4" />
              <text x="300" y="141" textAnchor="middle" className="text-sm font-bold fill-white tracking-widest">罪 的 鴻 溝 與 攔 阻</text>
              
              {/* 被牆擋住的徒勞努力 */}
              <g opacity="0.7">
                <line x1="160" y1="240" x2="160" y2="165" stroke="#a8a29e" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
                <text x="160" y="152" textAnchor="middle" className="text-sm font-bold fill-stone-500">行善</text>
                
                <line x1="220" y1="240" x2="220" y2="165" stroke="#a8a29e" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
                <text x="220" y="152" textAnchor="middle" className="text-sm font-bold fill-stone-500">功德</text>
                
                <line x1="300" y1="240" x2="300" y2="165" stroke="#a8a29e" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
                <text x="300" y="152" textAnchor="middle" className="text-sm font-bold fill-stone-500">宗教</text>
                
                <line x1="380" y1="240" x2="380" y2="165" stroke="#a8a29e" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
                <text x="380" y="152" textAnchor="middle" className="text-sm font-bold fill-stone-500">醫療</text>
                
                <line x1="440" y1="240" x2="440" y2="165" stroke="#a8a29e" strokeWidth="3" strokeDasharray="6 6" markerEnd="url(#arrow-up)" />
                <text x="440" y="152" textAnchor="middle" className="text-sm font-bold fill-stone-500">養生</text>
              </g>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-stone-900 tracking-tight">渴望回到神那裡</h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed font-medium">
              人渴望回到神那裡，但不管我們如何努力向上攀爬（如行善、宗教、積功德，甚至是依賴醫療與養生試圖延長生命），都像是撞上一道無法逾越的高牆，無法跨越罪的鴻溝，<span className="font-bold text-stone-900">無法靠自己回到神那裡。</span>
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 4. 神的方法 (十字架橋樑) === */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
              <line x1="80" y1="220" x2="520" y2="220" stroke="#292524" strokeWidth="10" strokeLinecap="round" />
              
              {/* 十字架 */}
              <line x1="300" y1="80" x2="300" y2="220" stroke="#e11d48" strokeWidth="16" strokeLinecap="round" />
              <line x1="240" y1="120" x2="360" y2="120" stroke="#e11d48" strokeWidth="16" strokeLinecap="round" />
              
              <text x="300" y="60" textAnchor="middle" className="text-base font-bold fill-rose-600 tracking-wider">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-stone-900 tracking-tight">神預備的方法</h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed font-medium">
              在我們完全絕望、無法自救的時候，<span className="font-bold text-rose-600">神出於祂無條件的愛</span>，為我們預備了一個方法。<br /><br />
              祂將祂獨生的愛子耶穌賜給我們，成為生命當中最美好的禮物。耶穌降世為人，在十字架上為我們的罪付上了代價，成為了那座連結死亡與生命的橋樑。
            </p>
          </div>
        </FadeSection>
      </section>

      {/* === 5. 我們的選擇 (回到生命線) === */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 600 250" className="w-full h-full max-w-[650px] overflow-visible mx-auto">
              {/* 生命線與死亡線 */}
              <line x1="80" y1="80" x2="520" y2="80" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
              <line x1="80" y1="220" x2="300" y2="220" stroke="#292524" strokeWidth="10" strokeLinecap="round" />
              
              {/* 變淡的十字架 */}
              <line x1="300" y1="80" x2="300" y2="220" stroke="#e11d48" strokeWidth="16" strokeLinecap="round" opacity="0.15" />
              
              {/* 🌟 透過耶穌回到永生的路線 */}
              <path d="M 220 220 L 260 220 C 280 220, 300 200, 300 160 C 300 120, 320 80, 350 80 L 420 80" fill="none" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" markerEnd="url(#arrow-up-red)" />
              
              <circle cx="220" cy="220" r="14" fill="white" stroke="#292524" strokeWidth="5" />
            </svg>
          </div>

          <div className="text-center max-w-2xl mx-auto z-10 p-8 md:p-12 relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-6 shadow-inner border border-rose-100">
               <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
             </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-stone-900 tracking-tight">我們的選擇</h2>
            <p className="text-base md:text-lg text-stone-500 mb-10 leading-relaxed font-medium">
              耶穌為你我的罪而死，三天後復活。其實我們有個選擇… <br />
              透過相信耶穌，我們就能離開死亡之路，順著這條恩典的道路，<span className="font-bold text-orange-500">重新回到神的面前，得著永生！</span><br /><br />
              <span className="text-stone-800 font-bold">你可以把心聲告訴祂。</span>
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)]"
            >
              我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* === Modal 彈出視窗 === */}
      <div className={`fixed inset-0 w-full h-full ${isRedirecting ? 'bg-white/90' : 'bg-stone-900/40 backdrop-blur-md'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget && !isRedirecting) closeModal(); }}>
          
          {/* 🌟 只有在尚未跳轉時才顯示輸入框 */}
          {!isRedirecting && (
            <div className={`bg-white w-[92%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_40px_80px_rgb(0,0,0,0.1)] border border-white relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
              <button onClick={closeModal} className="absolute top-5 right-6 text-2xl text-stone-300 hover:text-stone-600 transition-colors">&times;</button>
              
              <div>
                <h3 className="text-2xl font-extrabold mb-3 text-stone-900 tracking-tight">告訴天父你的決定...</h3>
                <p className="text-base text-stone-500 mb-6 font-medium leading-relaxed">請寫下你目前的困難，或是願意接受這份禮物的心聲。這份祈禱只有你跟天父知道。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父，我願意..." className="w-full h-[150px] p-5 border-2 border-stone-100 focus:border-rose-400 rounded-xl resize-none text-base text-stone-700 bg-stone-50 focus:bg-white transition-colors mb-6 outline-none font-medium"/>
                
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-stone-200 disabled:to-stone-200 text-white rounded-full text-lg font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  送出我的心聲
                </button>
              </div>
            </div>
          )}
          
          {/* 🌟 轉址 (跳轉至天父的信) 的 Loading 狀態 */}
          {isRedirecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50">
              <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full mb-5 animate-spin"></div>
              <p className="text-stone-800 text-base font-bold tracking-widest animate-pulse">正在為你準備天父的回信...</p>
            </div>
          )}
      </div>
    </main>
  );
}