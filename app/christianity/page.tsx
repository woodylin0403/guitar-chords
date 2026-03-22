import Link from 'next/link';

export default function ChristianityHub() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] p-6 md:p-12">
      <nav className="max-w-4xl mx-auto mb-10">
        <Link href="/" className="text-[#8E867A] hover:text-[#D97757] font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]">← 返回烏鴉的嗎哪首頁</Link>
      </nav>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3A4A5A] mb-8">✝️ 認識基督教</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/tools" className="p-8 rounded-3xl bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="text-xl font-bold mb-2">救恩的禮物</h3><p className="text-[#8E867A] text-sm">了解生命的選擇與天父的回信</p>
          </Link>
          <Link href="/prayer" className="p-8 rounded-3xl bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🕊️</div>
            <h3 className="text-xl font-bold mb-2">禱告的大能</h3><p className="text-[#8E867A] text-sm">祈求、尋找、叩門的真義</p>
          </Link>
          <div className="p-8 rounded-3xl bg-[#F4F7F9] border border-[#D1D9E0] opacity-70 cursor-not-allowed relative">
            <span className="absolute top-4 right-4 text-xs font-bold text-[#8E867A] bg-white px-2 py-1 rounded-md">建置中</span>
            <div className="text-3xl mb-3">🐑</div>
            <h3 className="text-xl font-bold mb-2">神是你的牧者</h3><p className="text-[#8E867A] text-sm">詩篇23篇的生命體會</p>
          </div>
        </div>
      </div>
    </main>
  );
}