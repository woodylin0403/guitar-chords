'use client';
import Link from 'next/link';
import { ArrowLeft, BookOpenText, Sparkles, ShieldCheck, HelpCircle, BookMarked } from 'lucide-react';

export default function SeekersBooksHub() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white pb-20 relative overflow-hidden">
      {/* 現代感背景光暈 - 慕道裝備專屬翡翠/青綠色調 */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 導覽列 */}
      <nav className="max-w-4xl mx-auto px-6 py-8 sticky top-0 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 hover:bg-white px-4 py-2 rounded-full transition-all bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> 返回主首頁
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/60 shadow-sm mb-6 text-sm font-medium text-emerald-600 backdrop-blur-sm">
          <BookOpenText className="w-4 h-4" /> 信仰根基建造
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tighter">
          慕道裝備<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">三本書</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium mb-12 max-w-xl leading-relaxed">
          針對尋道者最常問的三大核心問題，提供充滿邏輯、真理與生命見證的完整解答，帶領你一步步走向神。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🌟 已經完成的 第一課：到底有沒有神 */}
          <Link href="/seekers-books/lesson1" className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)] flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-20 h-20 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full tracking-wider">第一課</span>
                 <span className="text-slate-400 text-sm font-medium">118 Q&A</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">到底有沒有神？</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium max-w-2xl">
                這是一場關於真理、邏輯與關係的探索之旅。從「信念」的重要性開始，了解真神的卓越性，並透過天父的名字，親自兌現生命的空白支票。
              </p>
            </div>
            
            <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-slate-50 border border-slate-100 items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors z-10">
               <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 rotate-180 transition-colors" />
            </div>
          </Link>

          {/* 第二課：聖經是神默示的嗎 (未開放) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-100/60 p-8 md:p-10 border border-slate-200/50 flex flex-col justify-between min-h-[250px] opacity-80">
            <span className="absolute top-6 right-6 text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">建置中</span>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mb-6">
                <BookMarked className="w-7 h-7 text-slate-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-xs font-bold rounded-md">第二課</span>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-600">聖經是神默示的嗎？</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                歷史、科學與預言的精準印證。這本書為何能歷經千年，依然成為改變無數生命的真理指南？
              </p>
            </div>
          </div>

          {/* 第三課：耶穌是神的兒子嗎 (未開放) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-100/60 p-8 md:p-10 border border-slate-200/50 flex flex-col justify-between min-h-[250px] opacity-80">
            <span className="absolute top-6 right-6 text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">建置中</span>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-slate-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-xs font-bold rounded-md">第三課</span>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-600">耶穌是神的兒子嗎？</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                四大鐵證與空墳墓的奧秘。如果耶穌只是個好人，為何祂敢自稱為神？十字架與復活的真實意義。
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}