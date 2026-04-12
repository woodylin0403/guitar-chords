'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Download, CheckCircle2, Copy, ImageIcon, Clock, Layout } from 'lucide-react';
import html2canvas from 'html2canvas';

// 支援的格式列表
const FORMATS = [
  { id: 'IG_POST', name: 'IG 貼文 (1:1)', ratio: 'aspect-square', desc: '適合一般社群貼文' },
  { id: 'IG_STORY', name: 'IG 限動 (9:16)', ratio: 'aspect-[9/16]', desc: '直式滿版視覺' },
  { id: 'A4', name: 'A4 海報列印', ratio: 'aspect-[1/1.414]', desc: '適合實體張貼' },
  { id: 'SLIDE', name: '投影片 (16:9)', ratio: 'aspect-[16/9]', desc: '橫式大螢幕投影' }
];

// 🌟 進化版海報排版組件
const FinalPosterCard = ({ topic, timeLoc, details, imageUrl, formatInfo }: any) => {
  return (
    <div id="poster-canvas" className={`w-full relative overflow-hidden shadow-2xl group bg-black mx-auto border-4 border-slate-900 ${formatInfo.ratio}`}>
      {/* 🌟 拔除 crossOrigin="anonymous"，解決 Base64 下載失敗問題 */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800"><ImageIcon className="w-12 h-12 text-slate-600" /></div>
      )}

      {/* 專業雜誌風的文字疊加設計：上下黑色漸層，讓文字絕對清晰 */}
      <div className="absolute inset-0 flex flex-col justify-between z-10 p-8 md:p-10">
        {/* 上方裝飾 */}
        <div className="w-full flex justify-between items-start">
          <div className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-[1000] tracking-widest uppercase shadow-lg">
            Special Event
          </div>
        </div>

        {/* 下方資訊區塊 (使用更有設計感的排版) */}
        <div className="space-y-6 w-full max-w-lg mt-auto">
          {/* 大標題加上強烈文字陰影 */}
          <h2 className="text-4xl md:text-5xl font-[1000] text-white leading-[1.1] tracking-tighter" 
              style={{ textShadow: '0px 4px 20px rgba(0,0,0,0.8), 0px 1px 3px rgba(0,0,0,0.8)' }}>
            {topic}
          </h2>
          
          <div className="bg-black/60 backdrop-blur-md border-l-4 border-fuchsia-500 p-5 rounded-r-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-fuchsia-400" />
              <p className="text-sm md:text-base font-bold text-white tracking-wide">{timeLoc || '尚未設定時間地點'}</p>
            </div>
            {details && (
              <p className="text-xs md:text-sm font-medium text-slate-200 leading-relaxed opacity-90">
                {details}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* 底部全域漸層保護 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default function WizardDMGenerator() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [description, setDescription] = useState("");
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
  
  const [selectedTopic, setSelectedTopic] = useState("");
  const [timeLoc, setTimeLoc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0].id); // 新增格式選擇
  const [selectedStyle, setSelectedStyle] = useState("");

  const [finalImage, setFinalImage] = useState("");
  const [finalCopy, setFinalCopy] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const generateFinalPoster = async () => {
    if (!selectedStyle) return alert("請選擇一種風格！");
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate_final', 
          topic: selectedTopic, 
          timeLoc, 
          details, 
          style: selectedStyle,
          format: selectedFormat // 傳送格式給後端
        })
      });
      const data = await res.json();
      if (data.success) {
        setFinalImage(data.imageUrl);
        setFinalCopy(data.socialCopy);
        setStep(4);
      } else throw new Error(data.error);
    } catch (e: any) { alert("發生錯誤：" + e.message); }
    setIsLoading(false);
  };

  const downloadImage = async () => {
    const element = document.getElementById('poster-canvas');
    if (!element) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#000000' 
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.download = `${selectedTopic}-海報.jpg`;
      link.click();
    } catch (e) { alert("下載失敗，請檢查瀏覽器權限"); }
    setIsDownloading(false);
  };

  const currentFormatInfo = FORMATS.find(f => f.id === selectedFormat);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <nav className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/tools-hub" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-fuchsia-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100 min-h-[500px]">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold text-slate-800">1. 這是一個什麼樣的活動？</h2>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-6 rounded-2xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none h-32 text-lg" placeholder="例如：這週五晚上小組聚會，要吃披薩..." />
              <button onClick={fetchSuggestions} disabled={isLoading || !description} className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "下一步"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-3xl font-bold text-slate-800">2. 選擇標題與填寫資訊</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {suggestedTitles.map((title, i) => (
                  <button key={i} onClick={() => setSelectedTopic(title)} className={`p-4 rounded-xl border-2 text-left transition-all ${selectedTopic === title ? 'border-fuchsia-600 bg-fuchsia-50' : 'border-slate-100 hover:border-slate-300'}`}>
                    <span className="font-bold text-slate-800">{title}</span>
                  </button>
                ))}
              </div>
              <input type="text" value={timeLoc} onChange={(e) => setTimeLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none" placeholder="時間與地點 (例如：12/25 19:30 @S307)" />
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none h-24" placeholder="特色細節 (例如：限量50份雞排！)" />
              <button onClick={() => { if(selectedTopic && timeLoc) setStep(3); else alert("請選擇標題並填寫時間！"); }} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">下一步</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-3xl font-bold text-slate-800">3. 決定尺寸與風格</h2>
              
              <h3 className="text-sm font-bold text-slate-500 uppercase">版面格式</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => setSelectedFormat(f.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${selectedFormat === f.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white'}`}>
                    <div className="font-bold text-sm mb-1">{f.name}</div>
                    <div className={`text-[10px] ${selectedFormat === f.id ? 'text-slate-300' : 'text-slate-400'}`}>{f.desc}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold text-slate-500 uppercase pt-4">視覺風格</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedStyles.map((style, i) => (
                  <button key={i} onClick={() => setSelectedStyle(style)} className={`p-4 rounded-xl border-2 text-left transition-all ${selectedStyle === style ? 'border-fuchsia-600 bg-fuchsia-50 font-bold text-fuchsia-800' : 'border-slate-100 font-bold text-slate-700 hover:border-slate-300'}`}>
                    {style}
                  </button>
                ))}
              </div>

              <button onClick={generateFinalPoster} disabled={isLoading || !selectedStyle} className="w-full py-5 mt-6 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center">
                {isLoading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> 啟動 HD 畫質運算中 (約需 15-20 秒)...</span> : "✨ 產生專業海報"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col lg:flex-row gap-8 animate-in zoom-in-95">
              <div className="flex-1 flex flex-col items-center space-y-6 w-full">
                <div className="w-full max-w-md mx-auto">
                  <FinalPosterCard topic={selectedTopic} timeLoc={timeLoc} details={details} imageUrl={finalImage} formatInfo={currentFormatInfo} />
                </div>
                <button onClick={downloadImage} disabled={isDownloading} className="w-full max-w-md py-4 bg-slate-900 text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 下載此海報
                </button>
              </div>

              <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200 relative lg:max-w-sm h-fit">
                <button onClick={() => { navigator.clipboard.writeText(finalCopy); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm">
                  {isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
                </button>
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-fuchsia-500" /> 社群邀請文案</h3>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-sm">
                  {finalCopy}
                </div>
                <button onClick={() => { setStep(1); setDescription(""); setFinalImage(""); setSelectedStyle(""); }} className="mt-8 text-sm font-bold text-fuchsia-600 hover:underline w-full text-center">
                  重新製作一份
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}