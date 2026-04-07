'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, MessageCircle, Instagram, FileText, CheckCircle2, Lightbulb } from 'lucide-react';

const STYLES = [
  "☕ 溫馨走心", "🌿 療癒舒壓", "🫂 溫柔陪伴", "📖 故事感", "❤️ 內在醫治",
  "🔥 熱情活潑", "🏕️ 冒險熱血", "⚡ 活力全開", "🎵 節奏感強", 
  "😂 幽默搞笑", "🤡 迷因梗王", "🥳 派對咖", "✨ 潮流 Y2K",
  "✍️ 文青詩意", "☁️ 極簡留白", "🤔 哲學思辨", "📻 復古懷舊",
  "🕊️ 聖經真理", "🎓 質感講座", "🏛️ 嚴肅莊重"
];

const FORMATS = [
  { id: 'LINE', name: 'LINE 群組版', icon: <MessageCircle className="w-4 h-4" />, desc: '善用 Emoji 分段，重點清楚' },
  { id: 'IG', name: 'IG 限動版', icon: <Instagram className="w-4 h-4" />, desc: '字數極簡，大標題為主' },
  { id: 'POSTER', name: '長文海報版', icon: <FileText className="w-4 h-4" />, desc: '細節完整，包含感性引言' }
];

export default function DMGenerator() {
  const [topic, setTopic] = useState("");
  const [timeLoc, setTimeLoc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [format, setFormat] = useState("LINE");

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [promptResult, setPromptResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // 🏷️ 切換風格標籤 (最多選 3 個)
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      if (selectedStyles.length >= 3) {
        alert("最多只能選擇 3 種風格混搭喔！");
        return;
      }
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // 🪄 AI 隨機想主題
  const handleSuggestTopic = () => {
    const ideas = ["週末桌遊紓壓夜 🎲", "深夜食堂真心話 🍜", "微光敬拜禱告會 ✨", "期中考爆吉派對 🍕", "大自然踏青芬多精 🌳"];
    setTopic(ideas[Math.floor(Math.random() * ideas.length)]);
  };

  // 🚀 模擬 AI 生成功能 (未來可以在這裡串接 Gemini API)
  const handleGenerate = () => {
    if (!topic) { alert("請填寫活動主題！"); return; }
    
    setIsGenerating(true);
    setResult("");
    setPromptResult("");

    // 模擬網路延遲與 AI 思考時間
    setTimeout(() => {
      setResult(`🔥 【${topic}】準備嗨翻天！🔥\n\n親愛的小組家人們！\n這次我們要來點不一樣的😎\n\n⏰ 時間：${timeLoc || '這週五晚上 19:30'}\n📍 地點：小組副堂\n\n✨ 這次的亮點：\n${details || '帶著一顆期待的心來就對了！'}\n\n不管這週過得有多累，來這裡讓我們一起充電、大笑、聊聊天！\n\n👇 趕快在底下 +1 報名！\n期待看到大家喔！`);
      setPromptResult("Midjourney 提示詞：一群年輕人在溫暖的咖啡廳裡開心大笑，桌上有桌遊和飲料，拍立得風格，暖色調，電影感 --ar 9:16");
      setIsGenerating(false);
    }, 2000);
  };

  // 📋 一鍵複製功能
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-fuchsia-200 selection:text-fuchsia-900 pb-20 relative overflow-hidden">
      
      {/* 🎨 現代感背景光暈 */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-fuchsia-400/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 🧭 頂部導覽列 */}
      <nav className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <Link href="/tools-hub" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-fuchsia-600 hover:bg-white px-4 py-2 rounded-full transition-all bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> 返回工具箱
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* 📝 頁面標題區塊 */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter">
            小組 DM <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-orange-500">靈感產生器</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            告別文案難產！只要輸入基本資訊並挑選風格，AI 就能幫你生出有溫度、有吸引力的聚會邀請文。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* =========================================
              左側：控制台表單 (輸入區)
             ========================================= */}
          <div className="flex-1 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
            
            {/* Step 1: 基本資訊 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">1. 活動主題</label>
                <button onClick={handleSuggestTopic} className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  <Lightbulb className="w-3 h-3" /> 沒靈感？
                </button>
              </div>
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="例如：期中考舒壓派對、聖誕交換禮物"
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">時間與地點</label>
                <input 
                  type="text" 
                  value={timeLoc} 
                  onChange={(e) => setTimeLoc(e.target.value)} 
                  placeholder="例如：本週五 19:30 @教會副堂"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">活動亮點 / 特別提醒</label>
                <textarea 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)} 
                  placeholder="有什麼想特別告訴大家的？例如：記得帶50元披薩費用、穿著紅色系衣服..."
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all resize-none h-24 font-medium text-slate-600"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Step 2: 風格混搭 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">2. 文案風格混搭</label>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">已選 {selectedStyles.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                      selectedStyles.includes(style) 
                        ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md shadow-fuchsia-500/20 scale-105' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Step 3: 輸出格式 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">3. 輸出版本</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FORMATS.map(f => (
                  <div 
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      format === f.id 
                        ? 'border-fuchsia-500 bg-fuchsia-50/50' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex items-center gap-2 font-bold mb-1 ${format === f.id ? 'text-fuchsia-700' : 'text-slate-700'}`}>
                      {f.icon} {f.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🚀 生成按鈕 */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isGenerating ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'AI 正在施展魔法...' : '呼叫 AI 生成專屬文案'}
            </button>

          </div>

          {/* =========================================
              右側：結果展示區 (輸出區)
             ========================================= */}
          <div className="flex-1 flex flex-col h-full min-h-[600px]">
            {/* 深色工具列 */}
            <div className="bg-slate-800 rounded-t-2xl px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm tracking-widest">
                <Sparkles className="w-4 h-4 text-orange-400" /> AI 生成結果
              </div>
              {result && (
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                  {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? '已複製' : '一鍵複製'}
                </button>
              )}
            </div>
            
            {/* 內容顯示區 */}
            <div className="bg-[#1E293B] rounded-b-2xl p-6 md:p-8 flex-1 relative border border-slate-700 shadow-xl overflow-y-auto">
              
              {isGenerating ? (
                // 載入中動畫
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-600 border-t-fuchsia-500 rounded-full animate-spin"></div>
                  <p className="font-medium tracking-widest animate-pulse">正在為你提煉靈感文字...</p>
                </div>
              ) : result ? (
                // 顯示生成結果
                <div className="h-full flex flex-col">
                  {/* 文案結果 (可讓使用者自行二次編輯) */}
                  <textarea 
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full flex-1 bg-transparent text-slate-200 text-lg leading-relaxed focus:outline-none resize-none"
                    spellCheck="false"
                  />
                  
                  {/* AI 繪圖提示詞彩蛋 (給美宣) */}
                  {promptResult && (
                    <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                      <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        🎨 給美宣的 AI 繪圖提示詞
                      </div>
                      <p className="text-sm text-slate-400 font-mono leading-relaxed select-all">
                        {promptResult}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // 初始空狀態
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-60">
                  <FileText className="w-16 h-16 mb-4 stroke-1" />
                  <p className="font-medium">填妥左側資訊，讓 AI 幫你寫文案</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}