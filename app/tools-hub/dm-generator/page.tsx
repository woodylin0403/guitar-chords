'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, MessageCircle, Instagram, FileText, CheckCircle2, Lightbulb, Download, Monitor, Layout } from 'lucide-react';

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
  const [format, setFormat] = useState("LINE");

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
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

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setResult(`【${topic}】\n\n⏰ 時間：${timeLoc || '本週五 19:30'}\n📍 地點：教會副堂\n\n✨ 活動亮點：\n${details || '驚喜活動內容，保密中！'}\n\n期待與你見面！`);
      setIsGenerating(false);
    }, 1500);
  };

  const currentFormat = FORMATS.find(f => f.id === format);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-hidden font-sans">
      {/* 導覽列 */}
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
              <Sparkles className="w-6 h-6 text-fuchsia-500" /> 文案設定
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">活動主題</label>
                  <button onClick={handleSuggestTopic} className="text-xs font-bold text-fuchsia-600">🪄 AI 靈感</button>
                </div>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none" placeholder="輸入活動名稱" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">時間與地點</label>
                <input type="text" value={timeLoc} onChange={(e) => setTimeLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none" placeholder="例如：12/25 19:30 教會" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">補充描述</label>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 outline-none h-24" placeholder="其他活動細節..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">選擇風格 (最多3種)</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => toggleStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedStyles.includes(s) ? 'bg-fuchsia-600 text-white border-fuchsia-600' : 'bg-white text-slate-500 border-slate-200'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">輸出版本比例</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FORMATS.map(f => (
                    <button key={f.id} onClick={() => setFormat(f.id)} className={`p-3 rounded-xl border text-left transition-all ${format === f.id ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-2 text-sm font-bold mb-1">{f.icon} {f.name}</div>
                      <div className="text-[10px] text-slate-400">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-all">
              {isGenerating ? 'AI 魔法施展中...' : '生成文案與視覺預覽'}
            </button>
          </div>

          {/* 右側：視覺預覽 */}
          <div className="flex-1 space-y-6">
            <div className="bg-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] shadow-2xl relative">
              {/* 模擬圖片預覽區域 */}
              {result ? (
                <div className={`bg-gradient-to-br from-fuchsia-100 to-orange-50 w-full max-w-sm rounded-lg shadow-xl p-8 flex flex-col justify-between overflow-hidden relative ${currentFormat?.ratio}`}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-orange-500"></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{topic}</h3>
                    <div className="space-y-2 text-slate-600 font-bold text-sm">
                      <p>📍 {timeLoc || '聚會地點'}</p>
                      <p className="whitespace-pre-wrap">{details || '活動亮點內容...'}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-fuchsia-600 tracking-widest border-t border-fuchsia-200 pt-4">
                    烏鴉的嗎哪小工具製作
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center">
                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>生成文案後，這裡會顯示視覺預覽</p>
                </div>
              )}

              {/* 下載按鈕 */}
              {result && (
                <div className="flex gap-4 mt-8">
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 transition-all">
                    <Download className="w-4 h-4" /> 下載 PNG
                  </button>
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 transition-all">
                    <Download className="w-4 h-4" /> 下載 JPG
                  </button>
                </div>
              )}
            </div>

            {/* 純文字結果 */}
            {result && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 relative group">
                <button onClick={() => { navigator.clipboard.writeText(result); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-lg hover:bg-fuchsia-50 transition-colors">
                  {isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">文案複製區</h4>
                <pre className="text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">{result}</pre>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}