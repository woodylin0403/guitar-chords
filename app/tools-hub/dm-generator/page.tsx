'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, MessageCircle, Instagram, FileText, CheckCircle2, Lightbulb, Download, Monitor, Layout, Loader2, CalendarDays, MapPin, Ticket } from 'lucide-react';
import html2canvas from 'html2canvas';

const STYLES = [
  "☕ 溫馨走心", "🌿 療癒舒壓", "🫂 溫柔陪伴", "📖 故事感", "❤️ 內在醫治",
  "🔥 熱情活潑", "🏕️ 冒險熱血", "⚡ 活力全開", "🎵 節奏感強", 
  "😂 幽默搞笑", "🤡 迷因梗王", "🥳 派對咖", "✨ 潮流 Y2K",
  "✍️ 文青詩意", "☁️ 極簡留白", "🤔 哲學思辨", "📻 復古懷舊",
  "🕊️ 聖經真理", "🎓 質感講座", "🏛️ 嚴肅莊重"
];

const FORMATS = [
  { id: 'LINE', name: 'LINE 群組', icon: <MessageCircle className="w-4 h-4" />, ratio: 'auto', desc: '純文字排版' },
  { id: 'IG_STORY', name: 'IG 限動 9:16', icon: <Instagram className="w-4 h-4" />, ratio: 'aspect-[9/16]', desc: '直式全螢幕' },
  { id: 'IG_POST', name: 'IG 貼文 4:5', icon: <Instagram className="w-4 h-4" />, ratio: 'aspect-[4/5]', desc: '人像比例貼文' },
  { id: 'SLIDE', name: '投影片 16:9', icon: <Monitor className="w-4 h-4" />, ratio: 'aspect-[16/9]', desc: '橫向簡報比例' },
  { id: 'POSTER', name: '長文海報', icon: <FileText className="w-4 h-4" />, ratio: 'aspect-[1/1.414]', desc: 'A4 比例海報' }
];

export default function DMGenerator() {
  const [topic, setTopic] = useState("");
  const [timeLoc, setTimeLoc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [format, setFormat] = useState("IG_POST"); 

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState("");
  const [promptResult, setPromptResult] = useState("");
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

  // 🚀 真實呼叫 Gemini API 實作
  const handleGenerate = async () => {
    if (!topic) { 
      alert("請至少填寫一個原始活動主題，讓 AI 幫你優化並生成文案！"); 
      return; 
    }
    
    setIsGenerating(true);
    setResult("");
    setPromptResult("");

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
        // 🌟 任務一：更新優化後的主題
        setTopic(data.optimizedTitle);
        // 🌟 任務二：更新完整文案
        setResult(data.socialCopy);
        setPromptResult(data.imagePrompt);
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
        scale: 3, // 高質量圖片 (3倍)
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const data = canvas.toDataURL(`image/${imageFormat}`, 0.95);
      const link = document.createElement('a');
      link.href = data;
      link.download = `小組邀請卡-${topic || '設計'}.${imageFormat === 'jpeg' ? 'jpg' : 'png'}`;
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
      <nav className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <Link href="/tools-hub" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-fuchsia-600 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> 返回工具箱
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 左側：控制台 */}
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <Sparkles className="w-6 h-6 text-fuchsia-500" /> AI 靈感設定
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">你的原始主題</label>
                  <button onClick={handleSuggestTopic} className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-md">🪄 主題發想</button>
                </div>
                {/* 🌟 這個欄位會被 AI 優化後的新標題填寫 */}
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none font-bold text-lg" placeholder="輸入活動草稿，讓 AI 幫你優化" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">時間與地點</label>
                <input type="text" value={timeLoc} onChange={(e) => setTimeLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none" placeholder="例如：12/25 19:30 教會副堂" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">補充細節 / 提醒</label>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none h-24" placeholder="例如：記得帶著禮物喔、這次吃披薩、有破冰遊戲..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">風格標籤 (最多3種)</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => toggleStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedStyles.includes(s) ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md shadow-fuchsia-500/10' : 'bg-white text-slate-500 border-slate-200'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">輸出比例</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FORMATS.map(f => (
                    <button key={f.id} onClick={() => setFormat(f.id)} className={`p-3 rounded-xl border text-left transition-all ${format === f.id ? 'border-fuchsia-500 bg-fuchsia-50/50 shadow-inner' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-2 text-sm font-bold mb-1 ${format === f.id ? 'text-fuchsia-700' : 'text-slate-700'}">{f.icon} {f.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-all">
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '🚀 開始 AI 智慧生成 (包含標題優化)'}
            </button>
          </div>

          {/* 🌟 升級版：最高質量右側視覺預覽區 */}
          <div className="flex-1 space-y-6 flex flex-col h-full min-h-[500px]">
            <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 flex-1 flex flex-col items-center justify-center shadow-2xl relative border border-slate-800">
              
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-700 border-t-fuchsia-500 rounded-full animate-spin"></div>
                  <p className="font-medium tracking-widest animate-pulse">AI 正在深度優化文案中...</p>
                </div>
              ) : result ? (
                <>
                  {/* 🌟 這個框框重新設計了：增加質感漸層、清晰字體排版、邊框特效，確保截圖質量最高 */}
                  <div 
                    id="preview-canvas"
                    className={`bg-gradient-to-br from-white to-slate-50 w-full rounded-2xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden relative ${currentFormat?.ratio} border border-slate-100 max-w-sm`}
                  >
                    <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-fuchsia-500 via-orange-400 to-fuchsia-500"></div>
                    <div>
                      {/* 這裡顯示 AI 優化過的主題 */}
                      <h3 className="text-[2rem] font-black text-slate-950 leading-[1.1] tracking-tighter mb-8 break-words select-all">{topic}</h3>
                      
                      <div className="space-y-4 text-slate-800 font-semibold text-[15px]">
                        <p className="flex items-center gap-3 bg-fuchsia-50/50 p-2.5 rounded-lg border border-fuchsia-100">
                          <span className="bg-fuchsia-100 text-fuchsia-600 p-2 rounded-lg shadow-sm"><CalendarDays className="w-4 h-4" /></span> {timeLoc || '聚會時間'}
                        </p>
                        <p className="flex items-center gap-3 bg-fuchsia-50/50 p-2.5 rounded-lg border border-fuchsia-100">
                          <span className="bg-fuchsia-100 text-fuchsia-600 p-2 rounded-lg shadow-sm"><MapPin className="w-4 h-4" /></span> 教會副堂
                        </p>
                        <div className="mt-8 pt-6 border-t border-dashed border-fuchsia-200 whitespace-pre-wrap leading-relaxed text-slate-700 font-medium text-sm">
                          {details || '手刀報名中🏃‍♂️🏃‍♂️🏃‍♂️'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-[11px] font-extrabold text-fuchsia-600 tracking-wider pt-6 border-t-2 border-fuchsia-100 mt-6 flex justify-between items-center">
                      烏鴉的嗎哪小工具 • 邀請卡
                      <span className="text-slate-300 font-medium">#worshiptools</span>
                    </div>
                  </div>

                  {/* 🌟 下載按鈕區塊，綁定高清下載函數 */}
                  <div className="flex flex-wrap gap-4 mt-10 print:hidden">
                    <button 
                      onClick={() => downloadImage('png')}
                      disabled={isDownloading}
                      className="flex items-center gap-2 bg-gradient-to-b from-white/10 to-transparent hover:bg-white/15 text-white px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 transition-all disabled:opacity-50 shadow-md"
                    >
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      下載 PNG 圖片
                    </button>
                    <button 
                      onClick={() => downloadImage('jpeg')}
                      disabled={isDownloading}
                      className="flex items-center gap-2 bg-gradient-to-b from-white/10 to-transparent hover:bg-white/15 text-white px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 transition-all disabled:opacity-50 shadow-md"
                    >
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      下載 JPG 圖片
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-600 text-center opacity-70">
                  <Layout className="w-16 h-16 mx-auto mb-5 opacity-20" />
                  <p className="font-bold text-lg">AI 文案與圖片預覽</p>
                  <p className="text-sm">填寫左側設定並生成，這裡將呈現最高質量的設計成果</p>
                </div>
              )}
            </div>

            {/* 純文字結果複製區 */}
            {result && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 relative group shadow-sm">
                <button onClick={() => { navigator.clipboard.writeText(result); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-lg hover:bg-fuchsia-50 transition-colors">
                  {isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">任務二：完整社群文案預覽 (可直接二次修改)</h4>
                {/* 🌟 這個文字框容納真正的 AI 調整過的社群文案 */}
                <textarea 
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 font-sans whitespace-pre-wrap leading-relaxed text-[16px] border border-slate-100 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 min-h-[300px]"
                  spellCheck="false"
                />
              </div>
            )}
            
            {/* 繪圖提示詞區 (隱藏起來) */}
            {promptResult && (
               <div className="bg-slate-800 rounded-[1.5rem] p-5 border border-slate-700 mt-4 text-slate-400 text-xs font-mono">
                  繪圖提示：{promptResult}
               </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}