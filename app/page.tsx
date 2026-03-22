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

      {/* 4 大分類卡片區塊 — bento：多層陰影 + 流暢懸浮 */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
        
        <Link href="/christianity" className="group bento-card bento-card--coral">
          <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl transition-all duration-700 ease-out group-hover:bg-white/22 group-hover:scale-110 motion-reduce:transition-none" aria-hidden />
          <span className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-black/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80 motion-reduce:transition-none" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-[0_2px_8px_rgb(0_0_0_/0.08),inset_0_1px_0_rgb(255_255_255_/0.35)] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0" aria-hidden>✝️</div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 drop-shadow-sm">認識基督教</h3>
            <p className="text-[0.95rem] leading-relaxed text-white/85 max-w-[28ch]">救恩的禮物、禱告的大能、神是你的牧者。探索信仰的核心基礎。</p>
          </div>
          <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-4 py-2 text-sm font-medium backdrop-blur-md shadow-[0_2px_12px_rgb(0_0_0_/0.1),inset_0_1px_0_rgb(255_255_255_/0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white/28 group-hover:pl-5 group-hover:shadow-[0_6px_20px_rgb(0_0_0_/0.12)] motion-reduce:transition-none">
            進入探索
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden>→</span>
          </div>
        </Link>

        <Link href="/seekers-books" className="group bento-card bento-card--ocean">
          <span className="pointer-events-none absolute -right-12 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-200/25 blur-3xl transition-all duration-700 ease-out group-hover:scale-125 group-hover:bg-sky-100/30 motion-reduce:transition-none" aria-hidden />
          <span className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-[0_2px_8px_rgb(0_0_0_/0.08),inset_0_1px_0_rgb(255_255_255_/0.35)] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0" aria-hidden>📚</div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 drop-shadow-sm">慕道裝備三本書</h3>
            <p className="text-[0.95rem] leading-relaxed text-white/85 max-w-[28ch]">到底有沒有神？聖經是神默示的嗎？耶穌是神的兒子嗎？</p>
          </div>
          <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-4 py-2 text-sm font-medium backdrop-blur-md shadow-[0_2px_12px_rgb(0_0_0_/0.1),inset_0_1px_0_rgb(255_255_255_/0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white/28 group-hover:pl-5 group-hover:shadow-[0_6px_20px_rgb(0_0_0_/0.12)] motion-reduce:transition-none">
            進入探索
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden>→</span>
          </div>
        </Link>

        <Link href="/miracles" className="group bento-card bento-card--lilac">
          <span className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl transition-all duration-700 ease-out group-hover:scale-110 group-hover:bg-violet-100/35 motion-reduce:transition-none" aria-hidden />
          <span className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-200/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-[0_2px_8px_rgb(0_0_0_/0.08),inset_0_1px_0_rgb(255_255_255_/0.35)] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0" aria-hidden>✨</div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 drop-shadow-sm">認識耶穌基督</h3>
            <p className="text-[0.95rem] leading-relaxed text-white/85 max-w-[28ch]">走進福音書，看見耶穌大能的作為、憐憫與神蹟奇事。</p>
          </div>
          <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-4 py-2 text-sm font-medium backdrop-blur-md shadow-[0_2px_12px_rgb(0_0_0_/0.1),inset_0_1px_0_rgb(255_255_255_/0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white/28 group-hover:pl-5 group-hover:shadow-[0_6px_20px_rgb(0_0_0_/0.12)] motion-reduce:transition-none">
            進入探索
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden>→</span>
          </div>
        </Link>

        <Link href="/tools-hub" className="group bento-card bento-card--slate">
          <span className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full bg-cyan-300/15 blur-3xl transition-all duration-700 ease-out group-hover:scale-125 motion-reduce:transition-none" aria-hidden />
          <span className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 translate-y-1/3 rounded-[100%] bg-white/5 blur-3xl" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-3xl shadow-[0_2px_10px_rgb(0_0_0_/0.2),inset_0_1px_0_rgb(255_255_255_/0.2)] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0" aria-hidden>🛠️</div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 drop-shadow-sm">聚會 & 佈道小工具</h3>
            <p className="text-[0.95rem] leading-relaxed text-white/75 max-w-[30ch]">短詩歌智能吉他譜、天父的信。專為小組聚會與破冰打造的實用工具庫。</p>
          </div>
          <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md shadow-[0_2px_12px_rgb(0_0_0_/0.15),inset_0_1px_0_rgb(255_255_255_/0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white/25 group-hover:pl-5 group-hover:shadow-[0_6px_24px_rgb(0_0_0_/0.2)] motion-reduce:transition-none">
            開啟工具箱
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden>→</span>
          </div>
        </Link>

      </section>
      
      <footer className="max-w-5xl mx-auto px-6 mt-20 text-center text-[#8E867A] text-sm">
        <p>© {new Date().getFullYear()} 烏鴉的嗎哪. All rights reserved.</p>
      </footer>
    </main>
  );
}