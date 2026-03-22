'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { getMatchedLetter } from '@/data/letters';

export default function HeavenlyLetters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);
  const [letterImage, setLetterImage] = useState('');

  // 處理隨機抽取
  const handleRandomDraw = () => {
    setModalState('loading');
    setIsModalOpen(true);
    setTimeout(() => {
      const result = getMatchedLetter();
      setLetterData(result.letter);
      setLetterImage(result.image);
      setModalState('letter');
    }, 1500);
  };

  // 處理寫下心聲
  const handleSubmit = () => {
    if (prayerText.trim() === '') return;
    setModalState('loading');
    setTimeout(() => {
      const result = getMatchedLetter(prayerText);
      setLetterData(result.letter);
      setLetterImage(result.image);
      setModalState('letter');
    }, 1500);
  };

  const openInputModal = () => {
    setModalState('input');
    setPrayerText('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#FFF6E9] text-[#5C5446] font-sans selection:bg-[#D97757] selection:text-white">
      <Head>
        <title>天父的信 | 烏鴉的嗎哪</title>
      </Head>

      <nav className="p-6 md:px-12 md:py-8 max-w-6xl mx-auto flex justify-start relative z-10">
        <Link href="/tools-hub" className="text-[#8E867A] hover:text-[#D97757] font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-[#F0E6D2]">
          ← 返回工具箱
        </Link>
      </nav>

      <section className="flex flex-col items-center justify-center pt-10 pb-20 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="text-6xl mb-6 animate-bounce">💌</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#D97757] mb-6 tracking-wide">天父的信</h1>
        <p className="text-lg md:text-xl text-[#8E867A] mb-12 max-w-lg leading-relaxed">
          每一天，天父都有話想對你說。<br/>你可以隨機抽取今日的鼓勵，或是把心裡的重擔告訴祂。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button onClick={handleRandomDraw} className="group p-8 bg-white border border-[#F0E6D2] rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="text-xl font-bold text-[#5C5446] mb-2">隨機抽取一張</h3>
            <p className="text-[#8E867A] text-sm">領受天父為你預備的今日驚喜</p>
          </button>

          <button onClick={openInputModal} className="group p-8 bg-[#D97757] border border-[#D97757] rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center text-white">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
            <h3 className="text-xl font-bold mb-2">向天父訴說</h3>
            <p className="text-white/80 text-sm">寫下你的需要，獲得專屬的回應</p>
          </button>
        </div>
      </section>

      {/* Modal 視窗 */}
      <div className={`fixed inset-0 w-full h-full bg-[#5C5446]/60 backdrop-blur-sm flex justify-center items-center z-[1000] transition-opacity duration-400 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className={`bg-white w-[90%] max-w-[500px] rounded-2xl p-8 md:p-10 shadow-2xl relative transition-transform duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0' : 'translate-y-5'}`}>
          <button onClick={closeModal} className="absolute top-5 right-5 text-2xl text-[#8E867A] hover:text-[#5C5446] transition-colors">&times;</button>

          {modalState === 'input' && (
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#D97757]">親愛的天父...</h3>
              <p className="text-[#8E867A] mb-6 text-sm">寫下你目前的困難、期待或感恩，這份心聲只有你跟天父知道。</p>
              <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我想對祢說..." className="w-full h-[150px] p-4 border border-[#E0E0E0] focus:border-[#D97757] rounded-xl resize-none text-[#5C5446] bg-[#F9F9F9] focus:bg-white transition-colors mb-6 outline-none"/>
              <button onClick={handleSubmit} disabled={!prayerText.trim()} className="w-full py-3 bg-[#D97757] hover:bg-[#C66242] disabled:bg-[#E0E0E0] text-white rounded-full text-lg tracking-wider transition-all">
                送出心聲
              </button>
            </div>
          )}

          {modalState === 'loading' && (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-[#D97757]/30 border-t-[#D97757] rounded-full mx-auto mb-5 animate-spin"></div>
              <p className="text-[#5C5446] text-lg">正在為你尋找天父的回信...</p>
            </div>
          )}

          {modalState === 'letter' && letterData && (
            <div className="text-left">
              <img src={letterImage} alt="溫暖插畫" className="w-full h-[180px] object-cover rounded-xl mb-6 shadow-sm" style={{ filter: 'contrast(0.85) saturate(1.2)' }} />
              <h3 className="text-2xl font-bold text-[#D97757] mb-4">💌 來自天父的信</h3>
              <div className="text-lg mb-6 leading-loose whitespace-pre-wrap text-[#5C5446]">{letterData.text}</div>
              <div className="bg-[#FFF6E9] p-4 border-l-4 border-[#D97757] rounded-r-md">
                <p className="font-medium mb-2 text-[#5C5446]">{letterData.verse}</p>
                <p className="text-sm text-[#8E867A] text-right italic m-0">{letterData.ref}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}