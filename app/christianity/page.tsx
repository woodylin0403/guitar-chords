'use client';
import Link from 'next/link';
import { ArrowLeft, Gift, Heart, Map } from 'lucide-react';

export default function ChristianityHub() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-500 selection:text-white pb-20 relative overflow-hidden">
      {/* 現代感背景光暈 */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-fuchsia-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-violet-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="max-w-4xl mx-auto px-6 py-8 sticky top-0 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 hover:bg-white px-4 py-2 rounded-full transition-all bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> 返回主首頁
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter">
          認識<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-violet-500">基督信仰</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium mb-10 max-w-xl leading-relaxed">
          探索信仰的核心基礎。從創造到救贖，明白生命中最美好的選擇與天父的回信。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 救恩的禮物 */}
          <Link href="/tools" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">救恩的禮物</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">從創造到救贖的完整故事，了解耶穌為你預備的生命大禮。</p>
            </div>
          </Link>

          {/* 禱告的大能 */}
          <Link href="/prayer" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">禱告的大能</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">祈求、尋找、叩門。學習如何寫下真實的需要，並帶到天父面前。</p>
            </div>
          </Link>

          {/* 🌟 神是我們的牧者 (已打通連結) */}
          <Link href="/christianity/shepherd" className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(5,150,105,0.12)] flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Map className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">神是我們的牧者</h3>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-2xl">
                  詩篇 23 篇的生命體會，一場真實的信仰天路歷程。尋找靈魂的青草地，與牧者一起走過高山低谷。
                </p>
              </div>

              {/* 箭頭指示器 (在桌面版顯示) */}
              <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-slate-50 border border-slate-100 items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 rotate-180 transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}