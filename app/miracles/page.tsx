import Link from 'next/link';

export default function MiraclesHub() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] p-6 md:p-12">
      <nav className="max-w-4xl mx-auto mb-10">
        <Link href="/" className="text-[#8E867A] hover:text-[#8E9AAF] font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]">← 返回烏鴉的嗎哪首頁</Link>
      </nav>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3A4A5A] mb-8">✨ 認識耶穌基督：神蹟奇事</h1>
        <div className="p-8 rounded-3xl bg-[#F4F7F9] border border-[#D1D9E0] opacity-70 cursor-not-allowed relative max-w-md">
          <span className="absolute top-4 right-4 text-xs font-bold text-[#8E867A] bg-white px-2 py-1 rounded-md">建置中</span>
          <div className="text-3xl mb-3">🌊</div>
          <h3 className="text-xl font-bold mb-2">福音書中的神蹟</h3><p className="text-[#8E867A] text-sm">即將上線，敬請期待。</p>
        </div>
      </div>
    </main>
  );
}