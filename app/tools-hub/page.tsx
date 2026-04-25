'use client';
import Link from 'next/link';

export default function ToolsHub() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] p-6 md:p-12">
      <nav className="max-w-4xl mx-auto mb-10">
        <Link href="/" className="text-[#8E867A] hover:text-[#3A4A5A] font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]">← 返回烏鴉的嗎哪首頁</Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3A4A5A] mb-8">🛠️ 聚會 & 佈道小工具</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🎸 短詩歌吉他譜 */}
          <Link href="/chords" className="p-8 rounded-3xl bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow group block">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left w-fit">🎸</div>
            <h3 className="text-xl font-bold mb-2">短詩歌吉他譜</h3>
            <p className="text-[#8E867A] text-sm">一鍵轉調、沉浸式樂譜工具</p>
          </Link>
          
          {/* 💌 天父的信 */}
          <Link href="/letters" className="p-8 rounded-3xl bg-[#FFF6E9] border border-[#F0E6D2] hover:shadow-md transition-shadow group block">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left w-fit">💌</div>
            <h3 className="text-xl font-bold mb-2 text-[#D97757]">天父的信</h3>
            <p className="text-[#8E867A] text-sm">破冰抽卡、寫下心聲求問天父</p>
          </Link>

          {/* 🪄 小組 DM 產生器 (修改為佔一格寬度) */}
          <Link href="/tools-hub/dm-generator" className="p-8 rounded-3xl bg-[#F5F3FF] border border-[#E0D7FF] hover:shadow-md transition-shadow group block">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left w-fit">🪄</div>
            <h3 className="text-xl font-bold mb-2 text-[#6D28D9]">小組 DM 產生器</h3>
            <p className="text-[#8E867A] text-sm">告別文案難產！自訂風格與活動，讓 AI 幫你生出有溫度的邀請文。</p>
          </Link>

          {/* 🕹️ 聖經大會考 (新增的小遊戲區塊) */}
          <Link href="/tools-hub/bible-quiz" className="p-8 rounded-3xl bg-[#1E293B] border border-[#0F172A] hover:shadow-xl hover:-translate-y-1 transition-all group block relative overflow-hidden">
            {/* 裝飾用的發光效果 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10">
              <div className="text-3xl mb-3 group-hover:scale-110 group-hover:-rotate-12 transition-transform origin-left w-fit drop-shadow-md">🕹️</div>
              <h3 className="text-xl font-black mb-2 text-[#FBBF24] tracking-wide">聖經大會考 BATTLE</h3>
              <p className="text-slate-300 text-sm leading-relaxed">KOF 街機格鬥風！分組對抗、專屬角色技能，50 題聖經知識熱血挑戰。</p>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}