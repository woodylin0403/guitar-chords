'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookText, MapPin } from 'lucide-react';

// 🌟 經文點擊互動元件 (溫暖大地綠版)
function BibleVerse({ reference, text }: { reference: string, text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="inline-block align-middle w-full mt-3 mb-1">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100'}`}
      >
        <BookText size={14} /> {reference}
      </button>
      <span className={`block overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-3 mb-4' : 'max-h-0 opacity-0 mt-0 mb-0'}`}>
        <span className="block p-4 bg-emerald-50/80 border-l-4 border-emerald-500 rounded-r-xl text-[0.95rem] font-medium text-stone-700 shadow-sm leading-relaxed">
          {text}
        </span>
      </span>
    </span>
  );
}

// 滾動漸顯動畫 Hook
function useOnScreen(options: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);

  return [ref, isVisible] as const;
}

function FadeSection({ children, delay = '' }: { children: React.ReactNode, delay?: string }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
  return (
    <div ref={ref} className={`w-full transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`}>
      {children}
    </div>
  );
}

export default function Psalm23Lesson() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  const illustrationImages = [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80"  
  ];

  const heavenlyLetters = [
      { keywords: ['缺乏', '不夠', '金錢', '時間', '擔心', '憂慮'], text: "親愛的孩子，我知道你常常看著眼前的不足而感到焦慮。\n\n但請抬起頭來看看我，我是你的大牧者。當你真正讓我成為你生命的主，即使在物質看似缺乏的時候，你的靈裡也能經歷到難以言喻的富足。把你的憂慮交給我，我定意要供應你一切真正的需要，因為你是我草場上的羊。", verse: "「耶和華是我的牧者，我必不致缺乏。」", ref: "— 詩篇 23:1" },
      { keywords: ['累', '休息', '壓力', '躺臥', '平靜', '青草地'], text: "親愛的孩子，你跑得太快、太累了。\n\n不要把信仰當作無止盡的業績追求。我為你預備了青草地和可安歇的水邊，就是要你學會『躺臥』與『安息』。停下腳步，來我的同在裡喝口水吧！讓我的恩典重新充滿你，這才是你繼續往前走的動力。", verse: "「他使我躺臥在青草地上，領我在可安歇的水邊。」", ref: "— 詩篇 23:2" },
      { keywords: ['迷失', '不知所措', '方向', '義路', '甦醒', '麻木'], text: "親愛的孩子，當你對生活感到麻木，甚至對信仰失去熱情時，讓我來喚醒你。\n\n信仰不是停留在原地享受，而是『知行合一』的旅程。我會使你的靈魂甦醒，打開你的屬靈眼睛。牽著我的手，為了我的名，勇敢踏上那條或許不容易、但卻充滿榮耀的義路吧！", verse: "「他使我的靈魂甦醒，為自己的名引導我走義路。」", ref: "— 詩篇 23:3" },
      { keywords: ['苦難', '死蔭', '幽谷', '生病', '挫折', '害怕', '黑暗'], text: "親愛的孩子，我知道你現在正走在死蔭的幽谷中，四周看起來很黑暗。\n\n請記住，這只是一個『過程』，我應許你要行『過』幽谷，而不是停留在裡面。不要害怕，因為我就在你身邊。我的杖會保護你免受仇敵攻擊，我的竿會把你輕輕勾回正軌。在最深的黑夜裡，我的同在就是你最大的安慰。", verse: "「我雖然行過死蔭的幽谷，也不怕遭害，因為你與我同在；你的杖，你的竿，都安慰我。」", ref: "— 詩篇 23:4" },
      { keywords: ['敵人', '攻擊', '爭戰', '失敗', '打仗', '得勝', '筵席'], text: "親愛的孩子，信仰的路上必定會有爭戰，但你不需要逃避。\n\n因為我是一位得勝的神！當敵人（世界、罪惡、恐懼）環繞你時，我不是帶你逃跑，我是在敵人面前為你擺設慶功宴！不要害怕上戰場，帶著我的膏油迎戰吧，你將會經歷福杯滿溢的得勝滋味！", verse: "「在我敵人面前，你為我擺設筵席；你用油膏了我的頭，使我的福杯滿溢。」", ref: "— 詩篇 23:5" },
      { keywords: ['同在', '永遠', '恩典', '家', '殿', '感謝'], text: "親愛的孩子，你這一生的天路歷程，每一個高山低谷，我都沒有缺席。\n\n不要只追求我手中的祝福（有求必應），我更希望你渴慕看見我的臉。當你學會在每個環境中尋找我的同在，你會發現，我的恩惠與慈愛就像影子一樣，一生一世緊緊跟隨著你，直到我們在永恆的家相聚。", verse: "「我一生一世必有恩惠慈愛隨著我；我且要住在耶和華的殿中，直到永遠。」", ref: "— 詩篇 23:6" }
  ];

  const fallbackLetter = { 
    text: "親愛的小孩，這條名為信仰的旅程，有高山也有低谷。\n\n但請放心，你永遠不是一個人在走。我是你的好牧人，我認識我的羊，我的羊也認識我。無論你現在正停留在詩篇23篇的哪一個階段，勇敢地把手交給我吧！我會帶領你，直到你平安抵達永恆的家。", 
    verse: "「耶和華是我的牧者，我必不致缺乏。」", 
    ref: "— 詩篇 23:1" 
  };

  const submitPrayer = () => {
    if(prayerText.trim() === '') return;
    setModalState('loading');
    setTimeout(() => {
        let highestScore = 0;
        let candidateLetters: typeof heavenlyLetters = [];
        heavenlyLetters.forEach(letter => {
            let score = 0;
            letter.keywords.forEach(kw => { if (prayerText.includes(kw)) score++; });
            if (score > highestScore) { highestScore = score; candidateLetters = [letter]; } 
            else if (score === highestScore && score > 0) { candidateLetters.push(letter); }
        });
        let selectedLetter = highestScore === 0 ? fallbackLetter : candidateLetters[Math.floor(Math.random() * candidateLetters.length)];
        setLetterData({ ...selectedLetter, image: illustrationImages[Math.floor(Math.random() * illustrationImages.length)] });
        setModalState('letter');
    }, 1800);
  };

  const openModal = () => { setModalState('input'); setPrayerText(''); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="custom-theme-wrapper relative overflow-hidden">
      
      {/* 溫暖的大地與晨光背景 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vh] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #FAFAF9; /* 溫暖米白 Stone 50 */
            --text-main: #44403C; /* 深褐 Stone 700 */
            --text-light: #78716C; /* 淺褐 Stone 500 */
            --accent-primary: #059669; /* 翡翠綠 Emerald 600 */
            --accent-secondary: #D97706; /* 晨光黃 Amber 600 */
            --accent-tertiary: #65A30D; /* 柔和青綠 Lime 600 */
            --card-bg: rgba(255, 255, 255, 0.9);
            --card-border: rgba(5, 150, 105, 0.15);
            --modal-bg: rgba(28, 25, 23, 0.7);
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Noto Sans TC', sans-serif;
            line-height: 1.8;
            min-height: 100vh;
        }

        .custom-nav { padding: 20px 30px; position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
        
        /* 🌟 圖像化交錯排版容器 */
        .journey-container { max-width: 1000px; margin: 0 auto; padding: 100px 20px 60px 20px; display: flex; flex-direction: column; gap: 80px; position: relative; z-index: 10;}
        
        .hero-section { text-align: center; margin-bottom: 40px; display: flex; flex-direction: column; align-items: center;}
        .hero-title { font-size: 3.5rem; font-weight: 800; background: linear-gradient(to right, var(--accent-primary), var(--accent-tertiary)); -webkit-background-clip: text; color: transparent; margin-bottom: 15px; letter-spacing: 2px; line-height: 1.2;}
        .hero-subtitle { font-size: 1.2rem; color: var(--text-light); font-weight: 600; letter-spacing: 1px;}

        /* 每一站的 Row 佈局 */
        .stop-row { display: flex; align-items: center; justify-content: space-between; gap: 40px; }
        .stop-row.reverse { flex-direction: row-reverse; }
        
        .stop-graphic { flex: 1; min-width: 300px; display: flex; justify-content: center; position: relative;}
        .stop-graphic svg { width: 100%; max-width: 380px; height: auto; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.06)); transition: transform 0.5s ease;}
        .stop-row:hover .stop-graphic svg { transform: scale(1.03) translateY(-5px); }

        .stop-content { flex: 1.2; background: #FFF; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.03); position: relative;}
        
        .stop-badge { position: absolute; top: -15px; left: 30px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary)); color: #FFF; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 800; letter-spacing: 2px; box-shadow: 0 5px 15px rgba(5,150,105,0.3);}
        
        .stop-content h3 { font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-top: 10px; margin-bottom: 15px;}
        .stop-content p { font-size: 1.1rem; color: var(--text-light); margin-bottom: 15px; line-height: 1.7;}

        .vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;}
        .vs-card { background: var(--bg-color); padding: 15px; border-radius: 12px; border: 1px dashed #D6D3D1;}
        .vs-card h4 { font-size: 1.05rem; font-weight: 800; margin-bottom: 8px; color: var(--text-main);}
        .vs-card p { font-size: 0.9rem; margin: 0; line-height: 1.5;}

        /* 畫龍點睛的重點框 */
        .key-point { background: #ECFDF5; border-left: 4px solid var(--accent-primary); padding: 15px 20px; border-radius: 0 8px 8px 0; margin-top: 20px; font-weight: 600; color: var(--accent-primary); font-size: 1.05rem;}

        /* 思考留白區域 */
        .think-space { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6; margin: 40px 0; }
        .think-space .scroll-line { width: 2px; height: 80px; background: linear-gradient(to bottom, var(--text-light), transparent); animation: pulseLine 2.5s infinite; }
        @keyframes pulseLine { 0%, 100% { transform: scaleY(1); transform-origin: top; opacity: 0.3;} 50% { transform: scaleY(1.5); transform-origin: top; opacity: 1;} }

        .custom-btn { display: inline-block; margin-top: 30px; padding: 16px 45px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary)); color: white; border: none; border-radius: 30px; font-weight: 700; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(5,150,105, 0.3); cursor: pointer; font-size: 1.15rem;}
        .custom-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(5,150,105, 0.4); }

        /* Modal 視窗 */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--modal-bg); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-card { background: #FFF; border: 1px solid var(--card-border); width: 90%; max-width: 600px; border-radius: 24px; padding: 45px 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); position: relative; transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 90vh; overflow-y: auto; }
        .modal-overlay.active .modal-card { transform: translateY(0) scale(1); }
        .close-btn { position: absolute; top: 20px; right: 25px; background: none; border: none; font-size: 2rem; color: var(--text-light); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: var(--text-main); }
        .modal-textarea { width: 100%; height: 180px; padding: 20px; border: 2px solid #D1FAE5; border-radius: 12px; resize: none; font-family: inherit; font-size: 1.05rem; color: var(--text-main); background: #F8FAFC; margin-bottom: 25px; transition: all 0.3s; line-height: 1.6; }
        .modal-textarea:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 4px rgba(5,150,105, 0.1); background: #FFF;}
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(5,150,105, 0.2); border-top: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-tertiary); border-radius: 50%; margin: 0 auto 30px auto; animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem; } 
            .stop-row, .stop-row.reverse { flex-direction: column; gap: 20px; }
            .stop-graphic { min-width: 100%; }
            .stop-content { padding: 30px 20px; width: 100%; }
            .vs-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <nav className="custom-nav">
        <Link href="/christianity" className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-emerald-600 transition-colors bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-stone-200">
          <ArrowLeft className="w-4 h-4" /> 返回認識基督信仰
        </Link>
      </nav>

      <div className="journey-container">
        
        {/* 0. 封面 */}
        <FadeSection>
            <div className="hero-section">
                <div style={{width:'80px', height:'80px', background:'#ECFDF5', borderRadius:'24px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', color:'var(--accent-primary)', transform:'rotate(-10deg)'}}>
                    <MapPin size={40} />
                </div>
                <h1 className="hero-title">神是我們的牧者</h1>
                <p className="hero-subtitle">詩篇 23 篇：大衛王寫下的一場真實天路歷程</p>
            </div>
            <div className="think-space"><div className="scroll-line"></div></div>
        </FadeSection>

        {/* Stop 1: 不致缺乏 */}
        <FadeSection>
            <div className="stop-row">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#F0FDF4"/>
                        {/* 山丘與草地 */}
                        <path d="M 0 200 Q 150 150 300 220 L 300 250 L 0 250 Z" fill="#D1FAE5"/>
                        <path d="M 0 250 Q 100 180 250 250 Z" fill="#A7F3D0"/>
                        {/* 牧杖 */}
                        <path d="M 150 200 L 150 80 Q 150 50 180 50 Q 200 50 200 70" fill="none" stroke="var(--accent-primary)" strokeWidth="8" strokeLinecap="round"/>
                        <circle cx="220" cy="150" r="40" fill="#FFF" opacity="0.6" filter="blur(15px)"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge">STOP 1</div>
                    <h3>不致缺乏 vs. 常常缺乏</h3>
                    <BibleVerse reference="詩篇 23:1" text="耶和華是我的牧者，我必不致缺乏。" />
                    <p>神造人本來是沒有缺乏的。當我們感到缺乏時，往往是因為我們找錯了牧者。</p>
                    
                    <div className="vs-grid">
                        <div className="vs-card">
                            <h4 style={{color:'var(--text-light)'}}>靠自己闖</h4>
                            <p>把工作、金錢當牧者，愁苦必加增。</p>
                        </div>
                        <div className="vs-card">
                            <h4 style={{color:'var(--accent-primary)'}}>牧者帶領</h4>
                            <p>神定意讓兒女富足。信仰的入門是讓祂成為「我的」牧者。</p>
                        </div>
                    </div>
                </div>
            </div>
        </FadeSection>

        {/* Stop 2: 有求必應 */}
        <FadeSection>
            <div className="stop-row reverse">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#F0F9FF"/>
                        {/* 水流 */}
                        <path d="M 0 180 Q 75 160 150 180 T 300 180 L 300 250 L 0 250 Z" fill="#BAE6FD" opacity="0.6"/>
                        <path d="M 0 210 Q 75 190 150 210 T 300 210 L 300 250 L 0 250 Z" fill="#7DD3FC" opacity="0.8"/>
                        {/* 太陽/恩典 */}
                        <circle cx="150" cy="100" r="30" fill="#FDE047"/>
                        <circle cx="150" cy="100" r="60" fill="#FEF08A" opacity="0.3"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge">STOP 2</div>
                    <h3>有求必應 vs. 牧者供應</h3>
                    <BibleVerse reference="詩篇 23:2" text="他使我躺臥在青草地上，領我在可安歇的水邊。" />
                    <p>基督徒的命定就是無限的豐盛：吃不完的草、喝不完的水。但為什麼有時候覺得神「有求不應」？</p>
                    <p>因為信仰不是阿拉丁神燈。有時候你想要 A，但神給的是 B。</p>
                    <div className="key-point">最大的祝福不是拿到東西，而是「跟對牧者」，有一位神陪你走高山低谷。</div>
                </div>
            </div>
        </FadeSection>

        {/* Stop 3: 靈魂甦醒 */}
        <FadeSection>
            <div className="stop-row">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#FEF3C7"/>
                        {/* 道路 */}
                        <path d="M 100 250 Q 150 150 180 80" fill="none" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round"/>
                        <path d="M 100 250 Q 150 150 180 80" fill="none" stroke="#FFF" strokeWidth="6" strokeDasharray="10 10"/>
                        {/* 閃耀的星 */}
                        <path d="M 180 50 L 185 70 L 205 75 L 185 80 L 180 100 L 175 80 L 155 75 L 175 70 Z" fill="#F59E0B"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge" style={{background: 'linear-gradient(135deg, var(--accent-secondary), #FCD34D)'}}>STOP 3</div>
                    <h3>靈魂甦醒，知行合一</h3>
                    <BibleVerse reference="詩篇 23:3" text="他使我的靈魂甦醒，為自己的名引導我走義路。" />
                    <p>到了青草地還要走嗎？是的，信仰不能當躺平族！必須從「不知」到「真知」。</p>
                    <ul style={{listStyle:'none', padding:0, margin:'15px 0'}}>
                        <li style={{marginBottom:'10px'}}>✨ <strong>靈魂甦醒：</strong>打開屬靈眼睛，看見神的標準。</li>
                        <li style={{marginBottom:'10px'}}>✨ <strong>走義路：</strong>真知必須帶出真行，一面走一面信。</li>
                    </ul>
                </div>
            </div>
        </FadeSection>

        {/* Stop 4: 死蔭幽谷 */}
        <FadeSection>
            <div className="stop-row reverse">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#292524"/>
                        {/* 幽谷峭壁 */}
                        <polygon points="0,250 120,50 140,250" fill="#44403C"/>
                        <polygon points="300,250 180,80 160,250" fill="#57534E"/>
                        {/* 發光的杖 */}
                        <line x1="150" y1="120" x2="150" y2="250" stroke="#FDE047" strokeWidth="6" strokeLinecap="round"/>
                        <circle cx="150" cy="150" r="30" fill="#FEF08A" opacity="0.2" filter="blur(10px)"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge" style={{background: 'linear-gradient(135deg, #57534E, #A8A29E)'}}>STOP 4</div>
                    <h3>死蔭幽谷的考驗</h3>
                    <BibleVerse reference="詩篇 23:4" text="我雖然行過死蔭的幽谷，也不怕遭害，因為你與我同在；你的杖，你的竿，都安慰我。" />
                    <p>人生本有高低起伏。上帝應許的是「行過 (Walk through)」，而不是停留在黑暗裡。</p>
                    <div className="key-point" style={{borderColor:'#A8A29E', background:'#F5F5F4', color:'var(--text-main)'}}>
                        Fear no evil！苦難中要把上帝請出來。<br/>「杖」代表主權與保護，「竿」代表把羊勾回來的啟示。
                    </div>
                </div>
            </div>
        </FadeSection>

        {/* Stop 5: 爭戰得勝 */}
        <FadeSection>
            <div className="stop-row">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#FEF2F2"/>
                        {/* 桌子與滿溢的杯 */}
                        <rect x="50" y="180" width="200" height="10" fill="#FCA5A5"/>
                        <path d="M 120 180 L 130 100 L 170 100 L 180 180 Z" fill="#FECDD3"/>
                        <path d="M 125 120 L 175 120 Q 150 180 125 120" fill="#E11D48"/>
                        {/* 油與光 */}
                        <circle cx="150" cy="80" r="25" fill="#FDE047" opacity="0.8"/>
                        <path d="M 150 80 L 150 130" stroke="#FDE047" strokeWidth="4" strokeDasharray="4 4"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge" style={{background: 'linear-gradient(135deg, #E11D48, #FDA4AF)'}}>STOP 5</div>
                    <h3>爭戰中做得勝者</h3>
                    <BibleVerse reference="詩篇 23:5" text="在我敵人面前，你為我擺設筵席；你用油膏了我的頭，使我的福杯滿溢。" />
                    <p>信仰離不開爭戰（面對世界、撒旦、罪惡與惰性）。但神不是帶我們逃跑，而是在敵人面前開慶功宴！</p>
                    <div className="vs-grid">
                        <div className="vs-card">
                            <h4 style={{color:'var(--text-light)'}}>宿命論 (逃兵)</h4>
                            <p>逃避爭戰，就沒有產業。</p>
                        </div>
                        <div className="vs-card">
                            <h4 style={{color:'#E11D48'}}>命運開創者</h4>
                            <p>領受得勝膏抹，靠主改變命運。</p>
                        </div>
                    </div>
                </div>
            </div>
        </FadeSection>

        {/* Stop 6: 永恆的家 */}
        <FadeSection>
            <div className="stop-row reverse">
                <div className="stop-graphic">
                    <svg viewBox="0 0 300 250">
                        <rect x="0" y="0" width="300" height="250" rx="30" fill="#FFFBEB"/>
                        {/* 殿宇與光 */}
                        <path d="M 150 50 L 50 150 L 250 150 Z" fill="#FDE047" opacity="0.3"/>
                        <rect x="100" y="150" width="100" height="100" fill="#FEF08A"/>
                        <rect x="130" y="180" width="40" height="70" fill="#FFF"/>
                        {/* 恩惠慈愛跟隨 */}
                        <path d="M 0 200 Q 60 160 130 200" fill="none" stroke="#F59E0B" strokeWidth="6" strokeDasharray="10 5"/>
                    </svg>
                </div>
                <div className="stop-content">
                    <div className="stop-badge" style={{background: 'linear-gradient(135deg, #D97706, #FDE047)'}}>STOP 6</div>
                    <h3>神的同在 vs. 神的祝福</h3>
                    <BibleVerse reference="詩篇 23:6" text="我一生一世必有恩惠慈愛隨著我；我且要住在耶和華的殿中，直到永遠。" />
                    <p>每一段走過的過程，都成為下一段的基礎。真正的祝福，是不管在哪裡，恩惠與慈愛就像影子一樣跟著你。</p>
                    <div className="key-point" style={{borderColor:'#D97706', color:'#D97706', background:'#FFFBEB'}}>
                        渴慕神的「臉」(同在)，勝過神的「手」(祝福)。<br/>完成天路歷程，進入永恆的國度經營產業。
                    </div>
                </div>
            </div>
        </FadeSection>

        <FadeSection>
            <div style={{marginTop:'20px', textAlign:'center'}}>
                <p style={{color: 'var(--accent-primary)', fontWeight: '800', fontSize:'1.4rem'}}>你現在正走到旅程的哪一站呢？<br/>寫下你的心情，看看牧者要對你說什麼。</p>
                <button className="custom-btn" onClick={openModal}>寫下我的天路筆記與禱告</button>
            </div>
        </FadeSection>

      </div>

      {/* Modal 視窗 */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {modalState === 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '800' }}>天路歷程筆記</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6', fontWeight:'600' }}>1. 走完這六站，你覺得自己現在正處於哪一站？<br/>2. 面對這位大牧者，你現在最想對祂說什麼禱告？</p>
                    <textarea className="modal-textarea" value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="我覺得我現在在死蔭的幽谷...&#10;主耶穌，求祢牽著我的手，帶我走過去..." />
                    <button className="custom-btn" style={{ width: '100%', marginTop: '0' }} onClick={submitPrayer} disabled={!prayerText.trim()}>送出筆記與禱告</button>
                </div>
            )}
            {modalState === 'loading' && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '1px' }}>牧者正在聆聽你的心聲...</p>
                </div>
            )}
            {modalState === 'letter' && letterData && (
                <div style={{ textAlign: 'left' }}>
                    <img src={letterData.image} alt="插畫" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '15px', fontWeight: '800', textAlign: 'center', borderBottom: '2px dashed #E2E8F0', paddingBottom: '15px' }}>💌 來自好牧人的回應</h3>
                    <div style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontWeight:'500' }}>{letterData.text}</div>
                    <div style={{ background: '#ECFDF5', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
                        <p style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-primary)' }}>{letterData.verse}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'right', margin: '0', fontWeight:'600' }}>{letterData.ref}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}