'use client';
import Link from 'next/link';

export default function PortalHome() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] font-sans selection:bg-[#D97757] selection:text-white pb-20">
      
      {/* 導覽列 */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* 🌟 換回你原本的 Logo 圖片 */}
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-[#E0E0E0]">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-[#3A4A5A]">
            烏鴉的嗎哪 <span className="font-light text-[#8E867A] text-sm ml-1 hidden sm:inline">| 青年信仰裝備站</span>
          </h1>
        </div>
        <div className="flex gap-4 text-sm font-medium text-[#8E867A]">
          <a href="mailto:coolcrow0403@gmail.com" className="hover:text-[#D97757] transition-colors">聯絡站長</a>
        </div>
      </nav>

      {/* Hero 歡迎區塊 */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-12">
        <h2 className="text-4xl md:text-5xl font-medium text-[#3A4A5A] mb-4 tracking-wide leading-tight">
          裝備自己，<br className="md:hidden" /><span className="text-[#D97757]">飛耀</span>信仰的旅程。
        </h2>
        <p className="text-lg text-[#8E867A] max-w-2xl">
          這裡有為你準備的聚會工具、探索真理的解答，以及來自天父的溫暖對話。挑選你今天需要的養分吧！
        </p>
      </section>

      {/* 🍱 Bento Box 便當盒佈局區塊 */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,_auto)]">

        {/* 1. 聚會法寶：吉他譜 (佔據較大版面) */}
        <Link href="/chords" className="md:col-span-2 lg:col-span-2 row-span-2 group block relative overflow-hidden rounded-3xl bg-[#3A4A5A] p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">🎸</div>
              <h3 className="text-3xl font-bold text-white mb-2 tracking-wide">短詩歌吉他譜</h3>
              <p className="text-[#A8B1B8] text-lg leading-relaxed max-w-sm">專為小組聚會打造的智能樂譜。支援一鍵轉調、沉浸式演奏模式與無廣告純淨體驗。</p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-white font-medium bg-white/20 w-fit px-5 py-2.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              前往找譜 <span className="text-xl">→</span>
            </div>
          </div>
        </Link>

        {/* 2. 認識基督教：救恩的禮物 */}
        <Link href="/tools" className="md:col-span-1 lg:col-span-1 row-span-1 group block rounded-3xl bg-[#D97757] p-8 transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm text-white">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="text-xl font-bold mb-2">救恩的禮物</h3>
          <p className="text-white/80 text-sm">從創造到救贖，明白生命中最美好的選擇與天父的回信。</p>
        </Link>

        {/* 3. 認識基督教：禱告的大能 */}
        <Link href="/prayer" className="md:col-span-1 lg:col-span-1 row-span-1 group block rounded-3xl bg-[#5C8CA6] p-8 transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm text-white">
          <div className="text-3xl mb-3">🕊️</div>
          <h3 className="text-xl font-bold mb-2">禱告的大能</h3>
          <p className="text-white/80 text-sm">祈求、尋找、叩門，寫下你最真實的需要帶到天父面前。</p>
        </Link>

        {/* 4. 慕道裝備三本書 (預留清單卡片) */}
        <div className="md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl bg-white border border-[#E0E0E0] p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-4 right-6 text-xs font-bold text-[#8E867A] bg-[#F4F7F9] px-3 py-1 rounded-full tracking-widest">建置中</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📚</span>
            <h3 className="text-xl font-bold text-[#3A4A5A]">慕道裝備三本書</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm px-4 py-2 bg-[#FDFBF7] border border-[#E0E0E0] rounded-full text-[#8E867A] cursor-not-allowed">到底有沒有神？</span>
            <span className="text-sm px-4 py-2 bg-[#FDFBF7] border border-[#E0E0E0] rounded-full text-[#8E867A] cursor-not-allowed">聖經是神默示的嗎？</span>
            <span className="text-sm px-4 py-2 bg-[#FDFBF7] border border-[#E0E0E0] rounded-full text-[#8E867A] cursor-not-allowed">耶穌是神的兒子嗎？</span>
          </div>
        </div>

        {/* 5. 聚會小工具：天父的信 (獨立拉出來的預留卡片) */}
        <div className="md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl bg-[#FFF6E9] p-8 border border-[#F0E6D2] shadow-sm flex flex-col justify-between relative opacity-80 cursor-not-allowed">
          <div className="absolute top-4 right-4 text-xs font-bold text-[#D97757] bg-white px-2 py-1 rounded-md">Coming Soon</div>
          <div>
            <div className="text-3xl mb-3">💌</div>
            <h3 className="text-xl font-bold text-[#5C5446] mb-2">天父的信</h3>
            <p className="text-[#8E867A] text-sm">單純抽取天父的鼓勵卡片，適合聚會破冰使用。</p>
          </div>
        </div>

        {/* 6. 認識耶穌神蹟 (預留卡片) */}
        <div className="md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl bg-white border border-[#E0E0E0] p-8 shadow-sm flex flex-col justify-between relative opacity-80 cursor-not-allowed">
          <div className="absolute top-4 right-4 text-xs font-bold text-[#5C8CA6] bg-[#F4F7F9] px-2 py-1 rounded-md">Coming Soon</div>
          <div>
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-xl font-bold text-[#3A4A5A] mb-2">耶穌的神蹟奇事</h3>
            <p className="text-[#8E867A] text-sm">走進福音書，看見耶穌大能的作為與憐憫。</p>
          </div>
        </div>

        {/* 7. 認識基督教：神是你的牧者 (預留卡片) */}
        <div className="md:col-span-1 lg:col-span-2 row-span-1 rounded-3xl bg-[#F4F7F9] border border-[#D1D9E0] p-8 shadow-sm flex items-center gap-6 relative opacity-80 cursor-not-allowed">
           <div className="absolute top-4 right-4 text-xs font-bold text-[#8E867A] bg-white px-2 py-1 rounded-md">Coming Soon</div>
           <div className="text-4xl">🐑</div>
           <div>
             <h3 className="text-xl font-bold text-[#3A4A5A] mb-1">神是你的牧者</h3>
             <p className="text-[#8E867A] text-sm">詩篇 23 篇的生命體會，尋找靈魂的青草地。</p>
           </div>
        </div>

      </section>

      {/* 頁尾 */}
      <footer className="max-w-6xl mx-auto px-6 mt-20 text-center text-[#8E867A] text-sm">
        <p>© {new Date().getFullYear()} 烏鴉的嗎哪. All rights reserved.</p>
      </footer>
    </main>
  );
}