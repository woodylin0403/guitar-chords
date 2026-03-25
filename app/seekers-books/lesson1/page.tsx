'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, BookOpen, HelpCircle, Compass, HeartHandshake, PenTool, Sparkles, CheckCircle2, ArrowDown, ShieldCheck, Star } from 'lucide-react';

// 滾動漸顯動畫 Hook
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
  const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
  return (
    <div ref={ref} className={`w-full flex flex-col transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`}>
      {children}
    </div>
  );
}

export default function DoesGodExistLesson() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  // 隨機情境圖庫
  const illustrationImages = [
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=600&q=80", // 星空
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", // 晨曦群山
    "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=600&q=80", // 宇宙星雲
    "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80", // 黑暗中的光
    "https://images.unsplash.com/photo-1505506874110-6a7a48e50cb5?auto=format&fit=crop&w=600&q=80"  // 靜謐森林曙光
  ];

  // 簡易配對邏輯
  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    setModalState('loading');
    
    setTimeout(() => {
      // 簡單的 Fallback 回信
      const fallbackLetter = {
        text: "親愛的小孩，很高興你能藉著這堂課來到我面前，向我敞開心房。\n\n無論你今天心得寫了什麼、心裡正在經歷什麼挑戰，請記住，我是一位『I AM』的真神。我聽見了你的呼求。這張名為恩典的空白支票已經為你簽好，帶著盼望去經歷我吧！我的供應、醫治、平安與得勝，必會一生一世隨著你。",
        verse: "「你們尋求我，若專心尋求我，就必尋見。」",
        ref: "— 耶利米書 29:13",
        image: illustrationImages[Math.floor(Math.random() * illustrationImages.length)]
      };
      
      setLetterData(fallbackLetter);
      setModalState('letter');
    }, 1800);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden pb-32">
      <Head>
        <title>到底有沒有神？ | 慕道裝備</title>
      </Head>

      {/* 探索真理的翡翠與青色光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 導覽列 */}
      <nav className="p-4 md:p-6 lg:px-8 lg:py-8 max-w-6xl mx-auto flex justify-start relative z-50 sticky top-0">
        <Link href="/seekers-books" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full text-stone-500 hover:text-stone-900 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-semibold text-sm tracking-wide">返回慕道裝備</span>
        </Link>
      </nav>

      {/* 0. Hero 封面區 */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center px-6 relative text-center pt-10">
        <FadeSection>
          <div className="z-10 max-w-3xl w-full mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-sm tracking-wider mb-6 border border-emerald-100 shadow-sm">
              <BookOpen className="w-4 h-4" /> 慕道裝備三本書・第一課
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-stone-900 mb-8 tracking-tighter leading-tight">
              到底有沒有<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">神？</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-500 font-medium mb-12">
              對應進度：118Q&A — Q1-7, 9-15, 79-101
            </p>

            {/* 前置作業卡片 */}
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgb(0,0,0,0.03)] p-6 md:p-8 rounded-[2rem] text-left max-w-2xl mx-auto flex items-start gap-5">
               <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-stone-800 mb-2">📌 教師前置作業</h3>
                 <p className="text-stone-600 font-medium leading-relaxed">
                   1. 送書給學員<br/>
                   2. 鼓勵讀完（並劃下印象深刻處）<br/>
                   3. 提醒學員帶護照（筆記本）來
                 </p>
               </div>
            </div>
          </div>
        </FadeSection>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 flex flex-col items-center opacity-70">
          <span className="text-[10px] tracking-[0.2em] mb-1 font-bold uppercase">往下開始課程</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* 一、神存在嗎？ */}
        <FadeSection>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">一、神存在嗎？ <span className="text-xl text-stone-400 font-medium ml-2">(15 min. 討論進行)</span></h2>
            </div>

            {/* 問題卡片 */}
            <div className="bg-stone-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl mb-8">
                <span className="font-bold text-emerald-600 text-lg mb-2 block">Q1. 思考一下：</span>
                <span className="text-lg text-stone-800 font-bold">你相信有神嗎？覺得是一神還是多神呢？</span>
            </div>

            {/* 🌟 調整順序：先講一神/多神，再講信念的重要性 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              
              {/* 一神 or 多神 */}
              <div className="bg-stone-50 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-teal-600 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> 真神 (一神) vs. 假神 (多神)</h3>
                <p className="text-stone-700 font-bold mb-3">若有神，真神的卓越性條件：</p>
                <ul className="space-y-3 text-stone-600 font-medium">
                  <li>• <strong>超自然且無限的：</strong>神不能有多位，否則必有侷限。<span className="text-stone-400 text-sm">(反例：分工的神明)</span></li>
                  <li>• <strong>完美的良善與良知：</strong>絕對的聖潔。<span className="text-stone-400 text-sm">(反例：希臘眾神有私慾)</span></li>
                  <li>• <strong>全知全能：</strong>沒有領域範圍限制。<span className="text-stone-400 text-sm">(反例：埃及眾神)</span></li>
                  <li>• <strong>造物主：</strong>神能夠創造，而人是受造者。<span className="text-stone-400 text-sm">(反例：被神格化的人)</span></li>
                </ul>
              </div>

              {/* 有神 or 無神 (信念的重要性) */}
              <div className="bg-stone-50 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2"><Star className="w-5 h-5"/> 為什麼選擇相信真神如此重要？</h3>
                <p className="text-stone-700 font-bold mb-3">信念決定人生的軌跡：</p>
                <ul className="space-y-3 text-stone-600 font-medium">
                  <li>• 探討神是否存在，其實是在探討我們生命的根基。掌控人生關鍵的不是基因，而是我們的<strong>「信念」</strong>。</li>
                  <li>• 循環：<span className="text-emerald-600 font-black bg-emerald-100 px-2 py-0.5 rounded">信念 → 思想 → 行為 → 人生</span></li>
                  <li className="text-sm text-stone-400 mt-2">💡 討論舉例：有正確信仰與沒有信仰的人，面對困境有何不同？</li>
                </ul>
              </div>

            </div>

            {/* 短講與證明 */}
            <div className="border-t border-stone-100 pt-10">
               <div className="bg-emerald-600 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-10">
                 <div className="absolute -right-10 -top-10 text-emerald-500 opacity-20"><Sparkles className="w-40 h-40"/></div>
                 <h3 className="text-2xl font-bold mb-4 relative z-10">🎤 教師短講：神的主權與啟示</h3>
                 <p className="text-emerald-50 font-medium leading-relaxed relative z-10 text-lg">
                   <strong>神的不可定義性：</strong>人的有限無法完全測度神的主權 → 所以我們需要「天啟」。<br/>
                   <strong>神的必須定義性：</strong>人才能認識神，怎麼認識？ → 答案就在「聖經」。
                 </p>
               </div>

               {/* 問題卡片 */}
               <div className="bg-stone-50 border-l-4 border-teal-500 p-6 rounded-r-2xl mb-8">
                   <span className="font-bold text-teal-600 text-lg mb-2 block">Q2. 思考一下：</span>
                   <span className="text-lg text-stone-800 font-bold">你覺得是「人找神」比較容易，還是「神找人」比較容易？</span>
               </div>

               <h3 className="text-2xl font-bold text-stone-800 mb-4">如何證明神存在？</h3>
               <p className="text-stone-500 font-medium mb-6">嚴格來說，要求人類去證明神存在是個「非法的問題」，因為位階低的不能決定位階高的 (就像生活在二度空間無法完全認識三度空間)。這也是為什麼「神找人」(主動啟示) 遠比「人找神」容易。<br/><br/>但即或如此，以下四點皆已證明有神：</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-5 border border-stone-200 rounded-xl bg-white flex gap-4">
                   <div className="text-2xl font-black text-stone-200">1</div>
                   <div><strong className="text-stone-800 block">宇宙萬有</strong><span className="text-stone-500 text-sm">萬物有序、人體構造、生命的創造、進化論的推翻。</span></div>
                 </div>
                 <div className="p-5 border border-stone-200 rounded-xl bg-white flex gap-4">
                   <div className="text-2xl font-black text-stone-200">2</div>
                   <div><strong className="text-stone-800 block">人的宗教性</strong><span className="text-stone-500 text-sm">道德良心、求神的天性、報應觀念、渴求平安感。</span></div>
                 </div>
                 <div className="p-5 border border-stone-200 rounded-xl bg-white flex gap-4">
                   <div className="text-2xl font-black text-stone-200">3</div>
                   <div><strong className="text-stone-800 block">個人經驗</strong><span className="text-stone-500 text-sm">生活體驗、有鬼證明有神、神蹟奇事。</span></div>
                 </div>
                 <div className="p-5 border border-emerald-200 rounded-xl bg-emerald-50 flex gap-4 ring-1 ring-emerald-500/20">
                   <div className="text-2xl font-black text-emerald-200">4</div>
                   <div><strong className="text-emerald-700 block">更何況，神主動顯現！</strong><span className="text-emerald-600/80 text-sm font-bold">聖經的啟示，神親自向人說話。</span></div>
                 </div>
               </div>
            </div>
          </div>
        </FadeSection>

        {/* 二、祂是誰？ 祂作了什麼？ */}
        <FadeSection delay="delay-100">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">二、祂是誰？ 祂作了什麼？ <span className="text-xl text-stone-400 font-medium ml-2">(20 min.)</span></h2>
            </div>

            {/* 問題卡片 */}
            <div className="bg-stone-50 border-l-4 border-cyan-500 p-6 rounded-r-2xl mb-8">
                <span className="font-bold text-cyan-600 text-lg mb-2 block">Q3. 思考一下：</span>
                <span className="text-lg text-stone-800 font-bold mb-2 block">人要如何能夠認識神呢？</span>
                <span className="text-sm text-stone-500">Hint: 如果你要認識一個歷史人物或新朋友，你會怎麼做？</span>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold text-stone-800 mb-3">📖 為什麼要由聖經來看？</h3>
              <p className="text-stone-600 font-medium bg-stone-50 p-5 rounded-2xl border border-stone-100">
                <strong>比喻：</strong>要認識國父，就要由他的著作（三民主義）、言談、見證人（歷史課本）來認識。<br/>
                同樣的，聖經是神親自的啟示（提後三：16）。
              </p>
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-6">由神的名字認識祂 <span className="text-lg text-stone-400 font-medium">(出埃及記 3:13-15)</span></h3>
            <p className="text-stone-500 font-medium mb-8">神的名字證明祂的存在，也帶出祂的性情與作為。</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
               <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
                 <h4 className="text-lg font-bold text-teal-700 mb-2">我是 (I am)</h4>
                 <p className="text-teal-600/80 font-medium">一「位」的意思是祂有情感、意志、理性、行動，代表著真實的存在。</p>
               </div>
               <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100 relative overflow-hidden">
                 <h4 className="text-lg font-bold text-cyan-700 mb-2">我是，即我是 (I am who I am)</h4>
                 <p className="text-cyan-600/80 font-medium">這就像一張<strong className="bg-cyan-200 px-1 rounded text-cyan-800">簽好名的空白支票</strong> (a Signed check)，等著我們用「信心」去兌現！</p>
               </div>
            </div>

            {/* 兌現支票：四個名字 */}
            <h4 className="font-bold text-stone-700 mb-4 text-center">這張支票可以兌現出什麼？</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-5 border border-stone-200 rounded-2xl bg-white hover:border-teal-400 transition-colors shadow-sm">
                <span className="block text-3xl mb-3">🥖</span>
                <strong className="text-stone-800 block mb-1">耶和華以勒</strong>
                <span className="text-stone-500 text-sm font-medium">神是供應者</span>
              </div>
              <div className="text-center p-5 border border-stone-200 rounded-2xl bg-white hover:border-teal-400 transition-colors shadow-sm">
                <span className="block text-3xl mb-3">❤️‍🩹</span>
                <strong className="text-stone-800 block mb-1">耶和華拉法</strong>
                <span className="text-stone-500 text-sm font-medium">神是醫治者</span>
              </div>
              <div className="text-center p-5 border border-stone-200 rounded-2xl bg-white hover:border-teal-400 transition-colors shadow-sm">
                <span className="block text-3xl mb-3">🕊️</span>
                <strong className="text-stone-800 block mb-1">耶和華沙龍</strong>
                <span className="text-stone-500 text-sm font-medium">神賜平安</span>
              </div>
              <div className="text-center p-5 border border-stone-200 rounded-2xl bg-white hover:border-teal-400 transition-colors shadow-sm">
                <span className="block text-3xl mb-3">🚩</span>
                <strong className="text-stone-800 block mb-1">耶和華尼西</strong>
                <span className="text-stone-500 text-sm font-medium">神是得勝者</span>
              </div>
            </div>

            <div className="bg-stone-900 text-white rounded-2xl p-6 text-center font-bold text-lg shadow-lg flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400"/>
              神如此好（權能、愛），你渴慕或需要經驗神哪一部份呢？
            </div>
          </div>
        </FadeSection>

        {/* 三、如何認識祂？ */}
        <FadeSection delay="delay-200">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <HeartHandshake className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">三、如何認識祂？ <span className="text-xl text-stone-400 font-medium ml-2">(15 min.)</span></h2>
            </div>
            
            <p className="text-xl font-extrabold text-violet-600 mb-8 bg-violet-50 inline-block px-4 py-2 rounded-lg">👉 要有關係！勿用錯器官！</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="border-l-4 border-violet-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-stone-800 mb-4">1. 透過耶穌</h3>
                <ul className="space-y-3 text-stone-600 font-medium">
                  <li><strong className="text-violet-600">救恩：</strong>神愛世人，賜下獨生子 <span className="text-stone-400 text-sm">(約 3:16)</span></li>
                  <li><strong className="text-violet-600">中保：</strong>解決罪的問題，恢復神人關係 <span className="text-stone-400 text-sm">(約壹 2:1-3)</span></li>
                </ul>
              </div>
              <div className="border-l-4 border-fuchsia-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-stone-800 mb-4">2. 透過信心</h3>
                <ul className="space-y-3 text-stone-600 font-medium">
                  <li><strong className="text-fuchsia-600">接待：</strong>打開心門接待祂成為生命的主 <span className="text-stone-400 text-sm">(約 1:12)</span></li>
                  <li><strong className="text-fuchsia-600">禱告：</strong>向父求，就必得著 <span className="text-stone-400 text-sm">(約 16:24)</span></li>
                </ul>
              </div>
            </div>

            {/* 行動呼籲 */}
            <div className="bg-violet-50 rounded-3xl p-8 border border-violet-100 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-violet-800 font-bold text-lg">
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5"/> 安排得救見證</div>
              <div className="hidden sm:block text-violet-300">|</div>
              <div className="flex items-center gap-2"><HeartHandshake className="w-5 h-5"/> 帶領決志</div>
              <div className="hidden sm:block text-violet-300">|</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> 權能服事</div>
            </div>
          </div>
        </FadeSection>

        {/* 四、作業 (結合 Modal) */}
        <FadeSection delay="delay-300">
          <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <PenTool className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">四、你的回應與作業 <span className="text-lg text-stone-400 font-medium ml-2">(下週帶來)</span></h2>
            </div>

            <div className="relative z-10 space-y-6 mb-10">
               <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white font-medium text-lg flex items-start gap-4">
                 <span className="bg-emerald-500 text-stone-900 w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">1</span>
                 <p>請完成讀後心得：<br/><span className="text-stone-300 text-base mt-1 block">「你覺得有神嗎？為什麼？」(200字內)</span></p>
               </div>
               <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white font-medium text-lg flex items-start gap-4">
                 <span className="bg-emerald-500 text-stone-900 w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">2</span>
                 <p>你最渴慕經歷神哪一個名字？<br/><span className="text-stone-300 text-base mt-1 block">請每天為此禱告 3 分鐘，並記下感覺。</span></p>
               </div>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="relative z-10 w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full text-lg font-bold transition-all shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1">
              寫下我的作業與禱告
            </button>
          </div>
        </FadeSection>

      </div>

      {/* === Modal 彈出視窗 === */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-white/90' : 'bg-stone-900/40 backdrop-blur-md'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          
          <div className={`bg-white w-[92%] max-w-[550px] rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgb(0,0,0,0.1)] border border-white relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
            <button onClick={closeModal} className="absolute top-5 right-6 text-2xl text-stone-300 hover:text-stone-600 transition-colors">&times;</button>
            
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-extrabold mb-3 text-stone-900 tracking-tight">裝備課回應卡</h3>
                <p className="text-base text-stone-500 mb-6 font-medium leading-relaxed">1. 讀後心得：你覺得有神嗎？為什麼？<br/>2. 你最渴慕經歷神的哪一個名字？請為此寫下一段禱告。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我覺得有神，因為...&#10;天父，我現在最需要經歷祢是『耶和華...』" className="w-full h-[180px] p-5 border-2 border-stone-100 focus:border-emerald-400 rounded-xl resize-none text-base text-stone-700 bg-stone-50 focus:bg-white transition-colors mb-6 outline-none font-medium leading-relaxed"/>
                
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-stone-200 disabled:to-stone-200 text-white rounded-full text-lg font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  送出作業與禱告
                </button>
              </div>
            )}

            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-700">
                <img src={letterData.image} alt="溫暖插畫" className="w-full h-[200px] object-cover rounded-2xl mb-6 shadow-sm" />
                <h3 className="text-xl font-extrabold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">💌 來自天父的回應</h3>
                <div className="text-base md:text-lg mb-8 leading-loose whitespace-pre-wrap text-stone-700 font-medium">{letterData.text}</div>
                <div className="bg-stone-50 p-5 border-l-4 border-emerald-400 rounded-r-xl">
                  <p className="text-base font-bold mb-2 text-stone-800">{letterData.verse}</p>
                  <p className="text-sm text-stone-400 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
          
          {modalState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50 rounded-[2.5rem]">
              <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full mb-5 animate-spin"></div>
              <p className="text-stone-800 text-base font-bold tracking-widest animate-pulse">正在接收你的回應...</p>
            </div>
          )}
      </div>

    </main>
  );
}