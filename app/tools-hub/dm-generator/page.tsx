'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, MessageCircle, Instagram, FileText, CheckCircle2, Lightbulb, Download, Monitor, Layout, Loader2, CalendarDays, MapPin, Ticket, Flame, Package, Pencil, BookOpen, Brain, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';

const STYLES = [
  "☕ 溫馨走心", "🌿 療癒舒壓", "🫂 溫柔陪伴", "📖 故事感", "❤️ 內在醫治",
  "🔥 熱情活潑", "🏕️ 冒險熱血", "⚡ 活力全開", "🎵 節奏感強", 
  "😂 幽默搞笑", "🤡 迷因梗王", "🥳 派對咖", "✨ 潮流 Y2K",
  "✍️ 文青詩意", "☁️ 極簡留白", "🤔 哲學思辨", "📻 復古懷舊",
  "🕊️ 聖經真理", "🎓 質感講座", "🏛️ 嚴肅莊重"
];

const FORMATS = [
  { id: 'LINE', name: 'LINE 純文字', icon: <MessageCircle className="w-4 h-4" />, ratio: 'auto', desc: '純文字排版' },
  { id: 'IG_STORY', name: 'IG 限動 9:16', icon: <Instagram className="w-4 h-4" />, ratio: 'aspect-[9/16]', desc: '直式全螢幕' },
  { id: 'IG_POST', name: 'IG 貼文 4:5', icon: <Instagram className="w-4 h-4" />, ratio: 'aspect-[4/5]', desc: '人像比例貼文' },
  { id: 'SLIDE', name: '投影片 16:9', icon: <Monitor className="w-4 h-4" />, ratio: 'aspect-[16/9]', desc: '橫向簡報比例' },
  { id: 'POSTER', name: '漫畫海報 A4', icon: <FileText className="w-4 h-4" />, ratio: 'aspect-[1/1.414]', desc: '普普漫畫風模板' }
];

// 🌟 接收 imageUrl，並顯示在畫面上
const PopArtDMTemplate: React.FC<{ topic: string, timeLoc: string, details: string, currentFormat: any, imageUrl: string }> = ({ topic, timeLoc, details, currentFormat, imageUrl }) => {
  return (
    <div 
      id="preview-canvas"
      className={`bg-white w-full rounded-2xl p-6 relative overflow-hidden border-8 border-slate-900 ${currentFormat?.ratio} max-w-sm flex flex-col`}
      style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
        backgroundSize: '20px 20px',
        boxShadow: '10px 10px 0 #CBD5E1'
      }}
    >
      {/* 放射線背景 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,#9333ea_0deg_10deg,#a855f7_10deg_20deg)] opacity-15 transform scale-150 rotate-[35deg]"></div>
      </div>

      <Brain className="absolute top-8 left-1/4 w-7 h-7 text-amber-500 opacity-80" strokeWidth={1} />
      <Zap className="absolute top-1/3 left-10 w-9 h-9 text-amber-500 opacity-80" strokeWidth={1} />
      <Flame className="absolute top-10 right-1/4 w-7 h-7 text-fuchsia-600 opacity-80" strokeWidth={1} />
      <Pencil className="absolute bottom-20 left-10 w-7 h-7 text-fuchsia-600 opacity-80" strokeWidth={1} />
      <BookOpen className="absolute bottom-1/3 right-10 w-9 h-9 text-fuchsia-600 opacity-80" strokeWidth={1} />

      {/* 標題區 */}
      <div className="relative z-10 text-center mb-6 mt-2 print:mt-2 px-2">
        <div className="absolute inset-x-0 -top-6 h-12 bg-amber-100 rounded-full blur-xl opacity-80"></div>
        <h3 className="text-[2rem] font-[1000] text-amber-400 font-serif leading-[1.1] tracking-tighter break-words select-all uppercase" 
          style={{
            WebkitTextStroke: '1.5px #0F172A',
            paintOrder: 'stroke fill',
            textShadow: '3px 3px 0 #0F172A, 6px 6px 0 rgba(245, 158, 11, 0.4)'
          }}
        >
          {topic || '活動標題'}
        </h3>
      </div>
      
      {/* 🌟 圖片顯示區塊：如果有 AI 生的圖就顯示圖片，否則顯示預留區塊 */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full mb-4">
        {imageUrl ? (
          <div className="relative w-full h-full min-h-[200px] rounded-2xl overflow-hidden border-4 border-slate-900 shadow-[4px_4px_0_#0F172A]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={imageUrl} alt="AI Generated Graphic" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm p-5 py-6 rounded-2xl border-4 border-dashed border-fuchsia-300 text-center space-y-2 group shadow-xl max-w-[200px]">
            <Package className="w-10 h-10 mx-auto text-fuchsia-600 group-hover:scale-110 transition-transform" />
            <p className="font-extrabold text-[11px] text-fuchsia-600 tracking-wider">AI 插畫預留區</p>
          </div>
        )}
      </div>

      {/* 資訊框 */}
      <div className="bg-white border-8 border-slate-900 p-5 rounded-t-lg print:rounded-lg relative z-10 shadow-lg mt-auto mx-1 print:mx-0 print:border-4" 
        style={{
          boxShadow: '-8px -8px 0 rgba(147, 51, 234, 0.1), 8px 8px 0 rgba(147, 51, 234, 0.1)',
          backgroundImage: 'radial-gradient(#9333ea 0.5px, transparent 0.5px)',
          backgroundSize: '8px 8px'
        }}
      >
        <div className="absolute -inset-2.5 border-4 border-dashed border-fuchsia-300 rounded-lg pointer-events-none"></div>
        <h4 className="text-sm font-[1000] text-white uppercase tracking-wider mb-3 border-b-4 border-slate-900 pb-2 inline-block px-4 -ml-4 rounded-r-lg bg-slate-900 shadow-md">
            聚會資訊 | <span className="text-amber-400">🔥 限時參加</span>
        </h4>
        <div className="space-y-2 text-slate-900 font-extrabold text-[12px] leading-relaxed">
          <p className="flex items-center gap-3"><span className="text-lg">⏰</span> {timeLoc || '聚會時間'}</p>
          <div className="mt-3 pt-3 border-t border-dashed border-slate-400/70 whitespace-pre-wrap leading-relaxed text-slate-700 font-medium text-[11px] print:text-[10px] select-all">
            {details || '記得帶著期待的心來喔！'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DMGenerator() {
  const [topic, setTopic] = useState("");
  const [timeLoc, setTimeLoc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [format, setFormat] = useState("POSTER"); 

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState("");
  const [promptResult, setPromptResult] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // 🌟 新增狀態來儲存圖片網址
  const [isCopied, setIsCopied] = useState(false);

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      if (selectedStyles.length >= 3) return;
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSuggestTopic = () => {
    const ideas = ["週末桌遊紓壓夜 🎲", "深夜食堂真心話 🍜", "微光敬拜禱告會 ✨", "期中考爆吉派對 🍕", "大自然踏青芬多精 🌳"];
    setTopic(ideas[Math.floor(Math.random() * ideas.length)]);
  };

  const handleGenerate = async () => {
    if (!topic) { alert("請至少填寫一個原始活動主題！"); return; }
    setIsGenerating(true);
    setResult("");
    setPromptResult("");
    setImageUrl(""); // 清空上一張圖

    try {
      const response = await fetch('/api/generate-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          timeLoc,
          details,
          styles: selectedStyles,
          format: FORMATS.find(f => f.id === format)?.name || format 
        })
      });

      const data = await response.json();

      if (data.success) {
        setTopic(data.optimizedTitle); 
        setResult(data.socialCopy); 
        setPromptResult(data.imagePrompt);
        if(data.imageUrl) setImageUrl(data.imageUrl); // 🌟 接收並設定圖片
      } else {
        alert("產生失敗：" + data.error);
      }
    } catch (error) {
      console.error("生成錯誤:", error);
      alert("網路連線發生錯誤，請稍後再試！");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageFormat: 'png' | 'jpeg') => {
    const element = document.getElementById('preview-canvas');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true, // 允許跨域讀取 OpenAI 的圖片
        backgroundColor: '#ffffff'
      });
      
      const data = canvas.toDataURL(`image/${imageFormat}`, 1.0);
      const link = document.createElement('a');
      link.href = data;
      link.download = `活動海報-${topic || '設計'}.${imageFormat === 'jpeg' ? 'jpg' : 'png'}`;
      link.click();
    } catch (error) {
      console.error("下載圖片失敗", error);
      alert("下載圖片時發生錯誤！");
    } finally {
      setIsDownloading(false);
    }
  };

  const currentFormat = FORMATS.find(f => f.id === format);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-hidden font-sans">
      <nav className="max-w-6xl mx-auto px-6 py-8 relative z-10 print:hidden">
        <Link href="/tools-hub" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-fuchsia-600 bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回工具箱
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:items-start">
          
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 print:hidden">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 tracking-tighter">
              <Sparkles className="w-6 h-6 text-fuchsia-500" /> AI 靈感設定
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">你的原始主題</label>
                  <button onClick={handleSuggestTopic} className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-md">🪄 主題發想</button>
                </div>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none font-bold text-lg" placeholder="輸入活動草稿，讓 AI 幫你優化" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">時間與地點</label>
                <input type="text" value={timeLoc} onChange={(e) => setTimeLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none" placeholder="例如：12/25 19:30 教會副堂 S307" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">補充細節 / 特別提醒</label>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none h-24 font-medium" placeholder="有什麼想特別補充的內容或活動亮點..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">選擇風格混搭 (最多3種)</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => toggleStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedStyles.includes(s) ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-all">
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '🚀 一鍵生成文案與客製化插畫 (約需10秒)'}
            </button>
          </div>

          <div className="flex-1 space-y-6 flex flex-col h-full min-h-[500px] lg:max-w-md">
            <div className="bg-slate-900 rounded-[2rem] p-8 flex-1 flex flex-col items-center justify-center shadow-2xl relative border border-slate-800">
              
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-700 border-t-fuchsia-500 rounded-full animate-spin"></div>
                  <p className="font-medium tracking-widest animate-pulse">大腦構思中... 畫師作畫中...</p>
                </div>
              ) : result ? (
                <>
                  {/* 🌟 傳入 imageUrl 給海報組件 */}
                  <PopArtDMTemplate topic={topic} timeLoc={timeLoc} details={details} currentFormat={currentFormat} imageUrl={imageUrl} />

                  <div className="flex flex-wrap gap-4 mt-8 print:hidden">
                    <button onClick={() => downloadImage('png')} disabled={isDownloading} className="flex items-center gap-2 bg-white/15 hover:bg-white/20 text-white px-7 py-3 rounded-full text-sm font-bold backdrop-blur-lg border border-white/25 transition-all shadow-md group w-full justify-center">
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      下載這張專屬海報
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-600 text-center opacity-70">
                  <Package className="w-20 h-20 mx-auto mb-5 opacity-15 stroke-1" />
                  <p className="font-bold text-lg text-slate-500">漫畫 DM 海報海報預覽區</p>
                  <p className="text-sm">填寫左側資訊並生成，這裡將呈現最高質量的設計成果</p>
                </div>
              )}
            </div>

            {result && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative group shadow-sm print:hidden">
                <button onClick={() => { navigator.clipboard.writeText(result); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-lg hover:bg-fuchsia-50 transition-colors">
                  {isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">任務二：優化後的完整社群文案</h4>
                <textarea 
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 font-sans whitespace-pre-wrap leading-relaxed text-[16px] border border-slate-100 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 min-h-[300px]"
                  spellCheck="false"
                />
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}