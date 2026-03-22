import Link from 'next/link';

export default function SeekersBooksHub() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#5C5446] p-6 md:p-12">
      <nav className="max-w-4xl mx-auto mb-10">
        <Link href="/" className="text-[#8E867A] hover:text-[#5C8CA6] font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]">← 返回烏鴉的嗎哪首頁</Link>
      </nav>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#3A4A5A] mb-8">📚 慕道裝備三本書</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['到底有沒有神？', '聖經是神默示的嗎？', '耶穌是神的兒子嗎？'].map(title => (
            <div key={title} className="p-8 rounded-3xl bg-[#F4F7F9] border border-[#D1D9E0] opacity-70 cursor-not-allowed relative">
              <span className="absolute top-4 right-4 text-xs font-bold text-[#8E867A] bg-white px-2 py-1 rounded-md">建置中</span>
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}