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

          {/* 🌟 關鍵修改：這裡的 href 從 /tools 改成 /tools-hub 了！ */}
          <Link href="/tools-hub/dm-generator" className="p-8 rounded-3xl bg-[#F5F3FF] border border-[#E0D7FF] hover:shadow-md transition-shadow group block md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="text-3xl group-hover:scale-110 transition-transform origin-left w-fit">🪄</div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-[#6D28D9]">小組 DM 產生器</h3>
                <p className="text-[#8E867A] text-sm">告別文案難產！自訂風格與活動，讓 AI 幫你生出有溫度的邀請文。</p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}