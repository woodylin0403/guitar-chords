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
          <Link href="/chords" className="p-8 rounded-3xl bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎸</div>
            <h3 className="text-xl font-bold mb-2">短詩歌吉他譜</h3><p className="text-[#8E867A] text-sm">一鍵轉調、沉浸式樂譜工具</p>
          </Link>
          <div className="p-8 rounded-3xl bg-[#FFF6E9] border border-[#F0E6D2] opacity-80 cursor-not-allowed relative">
            <span className="absolute top-4 right-4 text-xs font-bold text-[#D97757] bg-white px-2 py-1 rounded-md">Coming Soon</span>
            <div className="text-3xl mb-3">💌</div>
            <h3 className="text-xl font-bold mb-2">天父的信</h3><p className="text-[#8E867A] text-sm">適合聚會破冰抽卡使用</p>
          </div>
        </div>
      </div>
    </main>
  );
}