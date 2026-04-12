'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Download, CheckCircle2, Copy, ChevronRight, Image as ImageIcon, MapPin, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';

// 🌟 全新的單一圖像海報組件 (圖文完美融合)
const FinalPosterCard = ({ topic, timeLoc, details, imageUrl }: any) => {
  return (
    <div id="poster-canvas" className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl group bg-slate-900 mx-auto max-w-sm border-4 border-slate-900">
      {/* AI 生成的純淨底圖 */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500"><ImageIcon className="w-12 h-12 opacity-50" /></div>
      )}

      {/* 為了確保文字清晰，加上一層由下往上的深色漸層 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>

      {/* 融合在圖片上的排版文字 */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
        <h2 className="text-4xl font-[1000] leading-tight mb-4 tracking-tighter drop-shadow-lg" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>
          {topic}
        </h2>
        
        {/* 玻璃透視風資訊卡片 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl space-y-3 shadow-xl">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-slate-100">{timeLoc || '尚未設定時間地點'}</p>
          </div>
          {details && (
            <div className="pt-3 border-t border-white/20">
              <p className="text-xs font-medium text-amber-300 leading-relaxed drop-shadow-md">{details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function WizardDMGenerator() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // 狀態收集區
  const [description, setDescription] = useState("");
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
  
  const [selectedTopic, setSelectedTopic] = useState("");
  const [timeLoc, setTimeLoc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  const [finalImage, setFinalImage] = useState("");
  const [finalCopy, setFinalCopy] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- API 呼叫函式 ---

  // 步驟一：取得標題與風格建議
  const fetchSuggestions = async () => {
    if (!description) return alert("請先描述一下活動！");
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_suggestions', description })
      });
      const data = await res.json();
      if (data.success) {
        setSuggestedTitles(data.data.titles);
        setSuggestedStyles(data.data.styles);
        setStep(2);
      } else throw new Error(data.error);
    } catch (e: any) { alert("發生錯誤：" + e.message); }
    setIsLoading(false);
  };

  // 步驟四：生成最終海報
  const generateFinalPoster = async () => {
    if (!selectedStyle) return alert("請選擇一種風格！");
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_final', topic: selectedTopic, timeLoc, details, style: selectedStyle })
      });
      const data = await res.json();
      if (data.success) {
        setFinalImage(data.imageUrl);
        setFinalCopy(data.socialCopy);
        setStep(5);
      } else throw new Error(data.error);
    } catch (e: any) { alert("發生錯誤：" + e.message); }
    setIsLoading(false);
  };

  // --- 下載海報 ---
  const downloadImage = async () => {
    const element = document.getElementById('poster-canvas');
    if (!element) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.download = `${selectedTopic}-海報.jpg`;
      link.click();
    } catch (e) { alert("下載失敗"); }
    setIsDownloading(false);
  };

  // --- 介面渲染 ---
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <nav className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/tools-hub" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-fuchsia-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6">
        {/* 進度條 */}
        <div className="flex items-center justify-between mb-10 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-slate-200 before:-z-10">
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= num ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200' : 'bg-slate-100 text-slate-400 border-2 border-white'}`}>
              {num}
            </div>
          ))}
        </div>

        {/* 內容區塊 */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col">
          
          {/* Step 1: 活動描述 */}
          {step === 1 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">第一步：這是一個什麼樣的活動？</h2>
              <p className="text-slate-500">請用口語的方式告訴我，我們將用 AI 為你量身打造主題。</p>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-6 rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none h-40 text-lg resize-none" placeholder="例如：這週五晚上小組聚會，我們要吃披薩、玩桌遊，順便幫壽星慶生..." />
              <button onClick={fetchSuggestions} disabled={isLoading || !description} className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "下一步：讓 AI 想標題"}
              </button>
            </div>
          )}

          {/* Step 2: 選擇標題 */}
          {step === 2 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">第二步：選擇一個最棒的標題</h2>
              <p className="text-slate-500">我們為你發想了三個主題，請點擊你最喜歡的一個：</p>
              <div className="grid gap-4">
                {suggestedTitles.map((title, i) => (
                  <button key={i} onClick={() => { setSelectedTopic(title); setStep(3); }} className="text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all group">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-fuchsia-700">{title}</h3>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="text-slate-400 text-sm font-medium hover:text-slate-600">返回修改描述</button>
            </div>
          )}

          {/* Step 3: 詳細資訊 */}
          {step === 3 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">第三步：重要資訊與特色</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">時間與地點</label>
                  <input type="text" value={timeLoc} onChange={(e) => setTimeLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl outline-none font-medium" placeholder="例如：12/25 (五) 19:30 @S307副堂" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">必備特色 (限量、條件、亮點)</label>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl outline-none font-medium h-24" placeholder="例如：前 50 名報名送現炸大雞排！記得帶交換禮物。" />
                </div>
              </div>
              <button onClick={() => { if(timeLoc) setStep(4); else alert("請填寫時間地點！"); }} className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center">
                下一步：選擇視覺風格
              </button>
            </div>
          )}

          {/* Step 4: 選擇風格 */}
          {step === 4 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">第四步：定調海報視覺風格</h2>
              <p className="text-slate-500">AI 根據你的活動，推薦了以下三種最適合的設計風格：</p>
              <div className="grid gap-4">
                {suggestedStyles.map((style, i) => (
                  <button key={i} onClick={() => setSelectedStyle(style)} className={`text-left p-6 rounded-2xl border-2 transition-all ${selectedStyle === style ? 'border-fuchsia-600 bg-fuchsia-50' : 'border-slate-100 hover:border-fuchsia-300'}`}>
                    <h3 className="text-lg font-bold text-slate-800">{style}</h3>
                  </button>
                ))}
              </div>
              <button onClick={generateFinalPoster} disabled={isLoading || !selectedStyle} className="w-full py-5 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-fuchsia-500/30 hover:-translate-y-1 transition-all flex justify-center items-center">
                {isLoading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> AI 畫師與文案處理中 (約 15 秒)...</span> : "✨ 產生最終圖文合一海報"}
              </button>
            </div>
          )}

          {/* Step 5: 最終成果 */}
          {step === 5 && (
            <div className="flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in-95">
              
              {/* 左側：合成好的單一圖檔 */}
              <div className="flex-1 flex flex-col items-center space-y-6">
                <FinalPosterCard topic={selectedTopic} timeLoc={timeLoc} details={details} imageUrl={finalImage} />
                <button onClick={downloadImage} disabled={isDownloading} className="w-full max-w-sm py-4 bg-slate-900 text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 下載這張圖文合一海報
                </button>
              </div>

              {/* 右側：社群文案 */}
              <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200 relative">
                <button onClick={() => { navigator.clipboard.writeText(finalCopy); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:text-fuchsia-600 transition-colors">
                  {isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
                </button>
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-fuchsia-500" /> 專屬社群邀請文案</h3>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                  {finalCopy}
                </div>
                <button onClick={() => { setStep(1); setDescription(""); setFinalImage(""); }} className="mt-8 text-sm font-bold text-fuchsia-600 hover:underline">
                  重新製作另一份 DM
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}