'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Music, HeartHandshake, BookOpenText, Sparkles, Wrench, Mail, Activity } from 'lucide-react';

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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-500 selection:text-white pb-20 relative overflow-hidden">
      
      {/* 背景裝飾光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 現代化毛玻璃導覽列 */}
      <nav className="max-w-6xl mx-auto px-6 py-6 sticky top-0 z-50">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 p-[2px] shadow-sm">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full border-2 border-slate-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              烏鴉的嗎哪 <span className="font-medium text-slate-400 text-sm ml-1 hidden sm:inline">| 信仰裝備站</span>
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full">
              <Activity className="w-4 h-4 text-violet-500" />
              <span>{siteViews} Views</span>
            </div>
            <a href="mailto:coolcrow0403@gmail.com" className="text-slate-400 hover:text-violet-600 transition-colors p-2 rounded-full hover:bg-violet-50">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* 科技感 Hero 區塊 */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200/60 shadow-sm mb-6 text-sm font-medium text-violet-600 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" /> 探索全新的聚會體驗
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-[1.1]">
          裝備自己，<br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">
            飛耀信仰的旅程。
          </span>
        </h2>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          為這世代打造的數位屬靈資源庫。從認識真理到小組帶領，這裡為你準備了最現代、最高效的裝備工具。
        </p>
      </section>

      {/* Modern Bento Box 卡片區塊 */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* 1. 認識基督教 (紫紅漸層) */}
        <Link href="/christianity" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col justify-between min-h-[260px]">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-500">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">認識基督教</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">救恩的禮物、禱告的大能、神是你的牧者。從這裡開始探索信仰的核心基礎。</p>
          </div>
          <div className="relative z-10 mt-8 text-violet-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            進入探索 <span>→</span>
          </div>
        </Link>

        {/* 2. 慕道裝備三本書 (青綠漸層) */}
        <Link href="/seekers-books" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col justify-between min-h-[260px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-500">
              <BookOpenText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">慕道裝備三本書</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">到底有沒有神？聖經是神默示的嗎？耶穌是神的兒子嗎？最完整的真理解答。</p>
          </div>
          <div className="relative z-10 mt-8 text-teal-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            進入探索 <span>→</span>
          </div>
        </Link>

        {/* 3. 認識耶穌基督 (湛藍漸層) */}
        <Link href="/miracles" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col justify-between min-h-[260px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">認識耶穌基督</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">走進福音書，看見耶穌大能的作為、無盡的憐憫與震撼人心的神蹟奇事。</p>
          </div>
          <div className="relative z-10 mt-8 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            進入探索 <span>→</span>
          </div>
        </Link>

        {/* 4. 聚會 & 佈道小工具 (深邃闇黑漸層 - 特別凸顯) */}
        <Link href="/tools-hub" className="group relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-10 border border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] flex flex-col justify-between min-h-[260px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">聚會 & 佈道小工具</h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">短詩歌智能吉他譜、天父的信。專為破冰與敬拜打造的超級數位兵器庫。</p>
          </div>
          <div className="relative z-10 mt-8 text-white font-semibold text-sm flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            開啟工具箱 <span>→</span>
          </div>
        </Link>

      </section>
      
      <footer className="max-w-5xl mx-auto px-6 mt-24 text-center text-slate-400 text-sm font-medium">
        <p>© {new Date().getFullYear()} 烏鴉的嗎哪. Crafted with modern tech.</p>
      </footer>
    </main>
  );
}