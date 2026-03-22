'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircleHeart, Sparkles } from 'lucide-react';
import { getMatchedLetter } from '@/data/letters';

export default function PrayerTool() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);
  const [letterImage, setLetterImage] = useState('');

  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    setModalState('loading');
    setTimeout(() => {
      const result = getMatchedLetter(prayerText);
      setLetterData(result.letter);
      setLetterImage(result.image);
      setModalState('letter');
    }, 2000);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      {/* 導覽列 */}
      <nav className="fixed top-0 w-full p-6 z-50 flex justify-start">
        <Link href="/christianity" className="text-slate-400 hover:text-white font-medium transition-all bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm text-sm border border-white/10 flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回認識基督信仰
        </Link>
      </nav>

      {/* 寧靜背景光暈 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none"></div>

      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-500/30">
              <MessageCircleHeart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-6 tracking-tighter">禱告的大能</h1>
            <p className="text-xl text-slate-400 font-medium">禱告，就是跟創造宇宙的天父說話。<br className="hidden sm:block"/>沒有任何限制，只要帶著真實的你來到祂面前。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">🙏</div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">祈求就給你們</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">坦然無懼地將你的需要告訴天父，祂樂意賜福給你。</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">尋找就尋見</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">在迷茫中尋求祂的指引，祂必為你照亮前方的道路。</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">叩門就開門</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">即使面對緊閉的門，持續的禱告能打開天上豐富的窗戶。</p>
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => setIsModalOpen(true)} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" /> 開始向天父禱告
            </button>
          </div>
        </div>
      </section>

      {/* Modal 視窗 */}
      <div className={`fixed inset-0 w-full h-full ${modalState === 'loading' ? 'bg-black' : 'bg-slate-950/80 backdrop-blur-xl'} flex justify-center items-center z-[1000] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {(modalState === 'input' || modalState === 'letter') && (
          <div className={`bg-slate-900 w-[90%] max-w-[500px] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.5)] border border-slate-800 relative transition-all duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button onClick={closeModal} className="absolute top-5 right-5 text-2xl text-slate-500 hover:text-white transition-colors">&times;</button>
            {modalState === 'input' && (
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">安靜你的心...</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">請將你心裡的話、重擔或是感恩，化作文字寫下來。天父正在聆聽。</p>
                <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="親愛的天父..." className="w-full h-[150px] p-4 border border-slate-700 focus:border-cyan-500 rounded-xl resize-none text-white bg-slate-800/60 focus:bg-slate-800 transition-colors mb-6 outline-none font-medium"/>
                <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-full text-lg font-bold tracking-wider transition-all shadow-lg shadow-cyan-500/20">
                  送出禱告
                </button>
              </div>
            )}
            {modalState === 'letter' && letterData && (
              <div className="text-left animate-in fade-in zoom-in duration-500">
                <img src={letterImage} alt="溫暖插畫" className="w-full h-[200px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-700" style={{ filter: 'contrast(0.9) saturate(1.2) brightness(0.9)' }} />
                <h3 className="text-2xl font-bold text-cyan-400 mb-5 tracking-tight flex items-center gap-3">
                   <Link href="/letters" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">💌 來自天父的信</Link>
                </h3>
                <div className="text-lg mb-8 leading-loose whitespace-pre-wrap text-slate-100 font-medium">{letterData.text}</div>
                <div className="bg-slate-800/80 p-5 border-l-4 border-cyan-500 rounded-r-xl shadow-inner">
                  <p className="font-semibold mb-2 text-slate-50">{letterData.verse}</p>
                  <p className="text-sm text-slate-400 text-right italic m-0">{letterData.ref}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Loading Spinner */}
        {modalState === 'loading' && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-6 animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
            <p className="text-white text-lg font-bold tracking-widest">天父正在傾聽...</p>
          </div>
        )}
      </div>
    </main>
  );
}