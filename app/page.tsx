'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PortalHome() {
  const [siteViews, setSiteViews] = useState(0);

  useEffect(() => {
    const fetchAndTrackSiteViews = async () => {
      const statsRef = doc(db, 'stats', 'global');
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
          await setDoc(statsRef, { views: increment(1) }, { merge: true });
          sessionStorage.setItem('hasVisited', 'true');
        }
        const snap = await getDoc(statsRef);
        if (snap.exists()) {
          setSiteViews(snap.data().views || 0);
        }
      } catch (error) {
        console.error("無法讀取網站瀏覽量", error);
      }
    };
    fetchAndTrackSiteViews();
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] font-sans selection:bg-[#D97757] selection:text-white pb-20">
      
      {/* 導覽列 */}
      <nav className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-[#E0E0E0]">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-[#3A4A5A]">
            烏鴉的嗎哪 <span className="font-light text-[#8E867A] text-sm ml-1 hidden sm:inline">| 青年信仰裝備站</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full shadow-sm">
            👁️ 總瀏覽：{siteViews}
          </div>
          <a href="mailto:coolcrow0403@gmail.com" className="text-sm font-medium text-[#8E867A] hover:text-[#D97757] transition-colors">聯絡站長</a>
        </div>
      </nav>

      {/* 歡迎區塊 */}
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-12 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-medium text-[#3A4A5A] mb-4 tracking-wide leading-tight">
          裝備自己，<br className="md:hidden" /><span className="text-[#D97757]">飛耀</span>信仰的旅程。
        </h2>
        <p className="text-lg text-[#8E867A] max-w-2xl mx-auto md:mx-0">
          從認識真理到聚會帶領，這裡為你準備了全方位的屬靈資源。
        </p>
      </section>

      {/* 4 大分類卡片區塊 */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. 認識基督教 */}
        <Link href="/christianity" className="group rounded-3xl bg-[#D97757] p-8 transition-transform hover:-translate-y-1 hover:shadow-xl shadow-sm text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-4xl mb-4">✝️</div>
            <h3 className="text-2xl font-bold mb-2">認識基督教</h3>
            <p className="text-white/80 text-base leading-relaxed">救恩的禮物、禱告的大能、神是你的牧者。探索信仰的核心基礎。</p>
          </div>
          <div className="mt-6 font-medium bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors text-sm">進入探索 →</div>
        </Link>

        {/* 2. 慕道裝備三本書 */}
        <Link href="/seekers-books" className="group rounded-3xl bg-[#5C8CA6] p-8 transition-transform hover:-translate-y-1 hover:shadow-xl shadow-sm text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">慕道裝備三本書</h3>
            <p className="text-white/80 text-base leading-relaxed">到底有沒有神？聖經是神默示的嗎？耶穌是神的兒子嗎？</p>
          </div>
          <div className="mt-6 font-medium bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors text-sm">進入探索 →</div>
        </Link>

        {/* 3. 認識耶穌基督：神蹟奇事 */}
        <Link href="/miracles" className="group rounded-3xl bg-[#8E9AAF] p-8 transition-transform hover:-translate-y-1 hover:shadow-xl shadow-sm text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-2">認識耶穌基督</h3>
            <p className="text-white/80 text-base leading-relaxed">走進福音書，看見耶穌大能的作為、憐憫與神蹟奇事。</p>
          </div>
          <div className="mt-6 font-medium bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors text-sm">進入探索 →</div>
        </Link>

        {/* 4. 聚會 & 佈道小工具 */}
        <Link href="/tools-hub" className="group rounded-3xl bg-[#3A4A5A] p-8 transition-transform hover:-translate-y-1 hover:shadow-xl shadow-sm text-white flex flex-col justify-between min-h-[220px] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold mb-2">聚會 & 佈道小工具</h3>
            <p className="text-white/70 text-base leading-relaxed">短詩歌智能吉他譜、天父的信。專為小組聚會與破冰打造的實用工具庫。</p>
          </div>
          <div className="relative z-10 mt-6 font-medium bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors text-sm">開啟工具箱 →</div>
        </Link>

      </section>
      
      <footer className="max-w-5xl mx-auto px-6 mt-20 text-center text-[#8E867A] text-sm">
        <p>© {new Date().getFullYear()} 烏鴉的嗎哪. All rights reserved.</p>
      </footer>
    </main>
  );
}