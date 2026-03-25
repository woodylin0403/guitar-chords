'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, Coffee, Footprints, ShieldAlert, Swords, Home, BookText } from 'lucide-react';

// 🌟 經文點擊互動元件 (溫暖綠色版)
function BibleVerse({ reference, text }: { reference: string, text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="inline-block align-middle w-full mt-2">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100'}`}
      >
        <BookText size={14} /> {reference}
      </button>
      <span className={`block overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-3 mb-2' : 'max-h-0 opacity-0 mt-0 mb-0'}`}>
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
    <div ref={ref} className={`w-full flex flex-col transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`}>
      {children}
    </div>
  );
}

export default function Psalm23Lesson() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  // 牧者、草原、溫暖陽光圖庫
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
      
      {/* 草原晨光的背景光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vh] bg-amber-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #FAFAF9; 
            --text-main: #44403C; 
            --text-light: #78716C; 
            --accent-primary: #059669; 
            --accent-secondary: #D97706; 
            --accent-tertiary: #65A30D; 
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
        .custom-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 100px 20px 60px 20px; position: relative; }
        .custom-container { max-width: 800px; width: 100%; display: flex; flex-direction: column; align-items: center; z-index: 10;}
        .text-content { text-align: center; margin-bottom: 50px; max-width: 750px; width: 100%; z-index: 2; }
        
        .custom-theme-wrapper h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(to right, var(--accent-primary), var(--accent-tertiary)); -webkit-background-clip: text; color: transparent; margin-bottom: 15px; letter-spacing: 2px; text-align: center; line-height: 1.2;}
        .custom-theme-wrapper h2 { font-size: 2rem; font-weight: 700; margin-bottom: 25px; color: var(--text-main); border-bottom: 3px solid var(--accent-secondary); padding-bottom: 10px; display: inline-block;}
        .custom-theme-wrapper h3 { font-size: 1.4rem; font-weight: 700; margin-top: 35px; margin-bottom: 15px; color: var(--accent-primary); text-align: left; width: 100%; display: flex; align-items: center; gap: 8px;}
        .custom-theme-wrapper p { font-size: 1.15rem; color: var(--text-main); font-weight: 500; margin-bottom: 15px; text-align: left; line-height: 1.7;}

        /* 🌟 停靠站卡片設計 (Timeline Style) */
        .journey-step { background: #FFF; border: 1px solid var(--card-border); border-left: 6px solid var(--accent-primary); border-radius: 16px; padding: 30px; margin-bottom: 35px; text-align: left; width: 100%; box-shadow: 0 10px 30px rgba(5,150,105,0.05); position: relative; transition: transform 0.3s;}
        .journey-step:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(5,150,105,0.1);}
        .step-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px;}
        .step-icon { width: 45px; height: 45px; border-radius: 12px; background: #ECFDF5; color: var(--accent-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;}
        .step-title { font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;}
        
        /* 內部列表與對比 */
        .vs-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; background: #FAFAF9; padding: 15px; border-radius: 12px; border: 1px dashed #D6D3D1;}
        .vs-item { text-align: center; padding: 10px;}
        .vs-item h4 { font-size: 1.1rem; color: var(--accent-secondary); font-weight: 800; margin-bottom: 5px; border: none; padding:0;}
        
        .point-list { list-style: none; padding: 0; margin: 15px 0;}
        .point-list li { position: relative; padding-left: 20px; margin-bottom: 10px; font-size: 1.05rem;}
        .point-list li::before { content: "•"; position: absolute; left: 0; color: var(--accent-secondary); font-weight: bold; font-size: 1.2rem;}

        /* 動畫與按鈕 */
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .custom-btn { display: inline-block; margin-top: 30px; padding: 16px 45px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary)); color: white; border: none; border-radius: 30px; font-weight: 700; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(5,150,105, 0.3); cursor: pointer; font-size: 1.15rem;}
        .custom-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(5,150,105, 0.4); }

        /* 向下滾動提示 */
        .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; opacity: 0.6; animation: bounce 2.5s infinite; }
        .scroll-indicator span { font-size: 0.75rem; letter-spacing: 3px; margin-bottom: 10px; color: var(--accent-primary); text-transform: uppercase; font-weight: 700;}
        .scroll-indicator .line { width: 2px; height: 50px; background: linear-gradient(to bottom, var(--accent-primary), transparent); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-12px) translateX(-50%); } 60% { transform: translateY(-6px) translateX(-50%); } }

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
            .custom-theme-wrapper h1 { font-size: 2.3rem; } .custom-theme-wrapper h2 { font-size: 1.6rem; } 
            .vs-box { grid-template-columns: 1fr; gap:0;}
            .modal-card { padding: 35px 25px; width: 95%;}
        }
      `}} />

      <nav className="custom-nav">
        {/* 🌟 已經將返回連結設定為 /christianity */}
        <Link href="/christianity" className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-emerald-600 transition-colors bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-stone-200">
          <ArrowLeft className="w-4 h-4" /> 返回認識基督信仰
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="custom-section">
        <FadeSection>
            <div className="text-content" style={{ textAlign: 'center' }}>
                <p style={{ textAlign: 'center', color: 'var(--accent-secondary)', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.9rem' }}>THE LORD IS MY SHEPHERD</p>
                <h1>神是我們的牧者</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '15px', fontWeight:'600' }}>詩篇 23 篇：一場真實的信仰天路歷程</p>
            </div>
            
            <div style={{width:'100%', maxWidth:'600px', margin:'0 auto', textAlign:'center'}}>
              <p style={{fontSize:'1.1rem', color:'var(--text-main)', fontStyle:'italic', padding:'20px', background:'#FFF', borderRadius:'16px', border:'1px solid var(--card-border)', boxShadow:'0 10px 30px rgba(0,0,0,0.03)'}}>
                 為什麼「大衛」寫下這個詩篇？<br/>這不是童話，而是一個「王」經歷過生命極大高低起伏後的真實寫照。
              </p>
            </div>
        </FadeSection>
        <div className="scroll-indicator"><span>啟程</span><div className="line"></div></div>
      </section>

      {/* 旅程內容區 */}
      <section className="custom-section" style={{paddingTop:'50px'}}>
        <div className="custom-container">
            <h2 style={{alignSelf:'center', marginBottom:'40px'}}>天路歷程的六個停靠站</h2>

            {/* Stop 1 */}
            <FadeSection>
                <div className="journey-step">
                    <div className="step-header">
                        <div className="step-icon"><Map size={24}/></div>
                        <h3 className="step-title">Stop 1. 不致缺乏 vs. 常常缺乏</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:1" text="耶和華是我的牧者，我必不致缺乏。" />
                    <div className="vs-box">
                        <div className="vs-item" style={{borderRight:'1px dashed #D6D3D1'}}>
                            <h4>靠自己闖 (常常缺乏)</h4>
                            <p style={{fontSize:'0.95rem', margin:0}}>把工作、金錢、另一半當牧者，愁苦必加增。</p>
                        </div>
                        <div className="vs-item">
                            <h4>牧者帶領 (不致缺乏)</h4>
                            <p style={{fontSize:'0.95rem', margin:0}}>神定意讓兒女富足。信仰的入門，就是讓祂成為「我的」牧者。</p>
                        </div>
                    </div>
                    <p style={{fontSize:'0.95rem', color:'var(--text-light)', marginTop:'10px'}}>＊信仰不是用眼睛看擁有多少，而是從「客觀應許」走到「主觀經歷」的過程。</p>
                </div>
            </FadeSection>

            {/* Stop 2 */}
            <FadeSection>
                <div className="journey-step">
                    <div className="step-header">
                        <div className="step-icon"><Coffee size={24}/></div>
                        <h3 className="step-title">Stop 2. 有求必應 vs. 牧者供應</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:2" text="他使我躺臥在青草地上，領我在可安歇的水邊。" />
                    <ul className="point-list">
                        <li><strong>無限豐盛的命定：</strong>神要給我們吃不完的草、喝不完的水。</li>
                        <li><strong>經營落差：</strong>為什麼有時候「有求不應」？因為我們想要 A，但神要給 B。信仰不是聖誕老公公。</li>
                        <li><strong>最大的祝福：</strong>不是拿到東西，而是「跟對牧者」。有一位神陪著走高山低谷，才是真祝福。</li>
                    </ul>
                </div>
            </FadeSection>

            {/* Stop 3 */}
            <FadeSection>
                <div className="journey-step">
                    <div className="step-header">
                        <div className="step-icon"><Footprints size={24}/></div>
                        <h3 className="step-title">Stop 3. 靈魂甦醒，知行合一</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:3" text="他使我的靈魂甦醒，為自己的名引導我走義路。" />
                    <p>到了青草地還要走嗎？是的，信仰不能當躺平族！</p>
                    <ul className="point-list">
                        <li><strong>從「睡」到「醒」：</strong>靈魂必須被喚醒，看見神的標準，才能從「不知」到「真知」。</li>
                        <li><strong>走義路：</strong>這是一條因信稱義的路。真知必須帶出真行，一面走、一面信，不能停下腳步。</li>
                        <li><strong>為自己的名：</strong>神用祂的名字遮蓋我們，引導我們前進。</li>
                    </ul>
                </div>
            </FadeSection>

            {/* Stop 4 */}
            <FadeSection>
                <div className="journey-step" style={{borderLeftColor: 'var(--text-main)'}}>
                    <div className="step-header">
                        <div className="step-icon" style={{background:'#F5F5F4', color:'var(--text-main)'}}><ShieldAlert size={24}/></div>
                        <h3 className="step-title">Stop 4. 信仰需要經歷死蔭幽谷</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:4" text="我雖然行過死蔭的幽谷，也不怕遭害，因為你與我同在；你的杖，你的竿，都安慰我。" />
                    <p>生老病死、挫折挑戰，人生本有高低起伏，好基督徒也會遇到苦難。</p>
                    <ul className="point-list">
                        <li><strong>行「過」幽谷：</strong>神應許的是「走過去」，這是信心的挑戰。Fear no evil！</li>
                        <li><strong>把上帝請出來：</strong>苦難中沒有標準答案，但有「神的同在」。</li>
                        <li><strong>杖與竿的安慰：</strong>杖代表神的主權與保護，竿代表神把我們勾回來的啟示。</li>
                    </ul>
                </div>
            </FadeSection>

            {/* Stop 5 */}
            <FadeSection>
                <div className="journey-step" style={{borderLeftColor: 'var(--accent-secondary)'}}>
                    <div className="step-header">
                        <div className="step-icon" style={{background:'#FEF3C7', color:'var(--accent-secondary)'}}><Swords size={24}/></div>
                        <h3 className="step-title">Stop 5. 做得勝者 vs. 失敗者</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:5" text="在我敵人面前，你為我擺設筵席；你用油膏了我的頭，使我的福杯滿溢。" />
                    <p>信仰離不開爭戰。我們要面對世界、撒旦、罪惡，甚至自己的惰性。</p>
                    <div className="vs-box">
                        <div className="vs-item" style={{borderRight:'1px dashed #D6D3D1'}}>
                            <h4 style={{color:'var(--text-light)'}}>宿命論 (逃兵)</h4>
                            <p style={{fontSize:'0.95rem', margin:0}}>遇到害怕就躲避，永遠無法突破。</p>
                        </div>
                        <div className="vs-item">
                            <h4 style={{color:'var(--accent-secondary)'}}>命運開創者 (得勝)</h4>
                            <p style={{fontSize:'0.95rem', margin:0}}>打過仗就有產業！神已為我們擺設慶功宴。</p>
                        </div>
                    </div>
                    <p style={{fontSize:'0.95rem', color:'var(--text-main)', marginTop:'10px', fontWeight:'bold'}}>＊領受得勝膏抹：神允許敵人，是為了提升我們的戰鬥力，讓我們福杯滿溢、帶出祝福。</p>
                </div>
            </FadeSection>

            {/* Stop 6 */}
            <FadeSection>
                <div className="journey-step" style={{marginBottom:'0'}}>
                    <div className="step-header">
                        <div className="step-icon"><Home size={24}/></div>
                        <h3 className="step-title">Stop 6. 神的同在 vs. 神的祝福</h3>
                    </div>
                    <BibleVerse reference="詩篇 23:6" text="我一生一世必有恩惠慈愛隨著我；我且要住在耶和華的殿中，直到永遠。" />
                    <p>每一段走過的過程，都會成為下一段的基礎。恩惠慈愛不代表一帆風順（想想前面的幽谷與敵人），而是神親自的陪伴。</p>
                    <ul className="point-list">
                        <li><strong>信神的手 vs. 信神的臉：</strong>不要只渴慕神的祝福（手），更要渴慕神的同在（臉）。</li>
                        <li><strong>累積產業：</strong>真正服在神面前的人，能在失敗中看見恩典，讓靈命突破。</li>
                        <li><strong>永恆的家：</strong>在永恆裡繼續走恩典之路，住在耶和華的殿中，這才是天路歷程真正的目的地。</li>
                    </ul>
                </div>
            </FadeSection>

            <FadeSection>
                <div style={{marginTop:'50px', textAlign:'center'}}>
                    <p style={{color: 'var(--accent-primary)', fontWeight: '800', fontSize:'1.3rem'}}>你現在正走到旅程的哪一站呢？<br/>寫下你的心情，看看牧者要對你說什麼。</p>
                    <button className="custom-btn" onClick={openModal}>寫下我的筆記與禱告</button>
                </div>
            </FadeSection>
        </div>
      </section>

      {/* Modal 視窗 */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {modalState === 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '800' }}>天路歷程筆記</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6', fontWeight:'600' }}>1. 上完這課，你覺得自己現在走在哪一站？<br/>2. 面對這位大牧者，你現在最想對祂說什麼禱告？</p>
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