'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Wind, ShieldCheck, Milestone, Search } from 'lucide-react';

export default function BibleInspirationLesson() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);
    
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const illustrationImages = [
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1447069387366-2a6739228eb1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80"
  ];

  const heavenlyLetters = [
      { keywords: ['不懂', '太難', '讀不懂', '枯燥', '不知道怎麼讀'], text: "親愛的孩子，有時候你會覺得聖經像是一本古老又難懂的書，這很正常。\n\n但請記得，這不是一本普通的書，這是我寫給你的情書。當你讀不懂的時候，請邀請聖靈——也就是這本書的『原作者』來做你的家教。每次打開書頁前，先在心裡輕輕呼喚我，我會親自開你的心眼，讓那些黑底白字變成活水，流進你的生命裡。", verse: "「求你開我的眼睛，使我看出你律法中的奇妙。」", ref: "— 詩篇 119:18" },
      { keywords: ['指引', '迷惘', '方向', '決定', '不知道該怎麼辦', '答案'], text: "親愛的孩子，我看見你正站在人生的十字路口，渴望尋找方向。\n\n不要在世界的喧囂中迷失了。我已經把最高明的導航系統交給了你——就是我的話語。當你願意安靜下來，每天在聖經中尋求我的心意，我會用我的話語成為你腳前的燈、路上的光，一步一步帶領你走在蒙福的道路上。", verse: "「你的話是我腳前的燈，是我路上的光。」", ref: "— 詩篇 119:105" },
      { keywords: ['真實', '奇妙', '感動', '原來如此', '相信', '神的話', '默示'], text: "親愛的孩子，看見你對我的話語產生敬畏與感動，我的心無比喜悅！\n\n是的，聖經中跨越千年的預言、40多位作者的完美和諧，都不是巧合，是我呼出的氣息。當你選擇將生命建造在這不改變的磐石上，即使世界動盪，你也絕不動搖。繼續渴慕我的話語吧，裡面藏著無盡的寶藏等你去發掘。", verse: "「草必枯乾，花必凋殘，惟有我們神的話必永遠立定。」", ref: "— 以賽亞書 40:8" },
      { keywords: ['力量', '軟弱', '低潮', '幫助', '功效', '改變'], text: "親愛的孩子，當你感到軟弱無力、想要放棄的時候，來讀我的話語吧。\n\n我的道是活潑的，是有功效的。它不是冰冷的教條，而是帶有創造天地的大能。當你把我的話吃進去、反覆思想，它就會在你裡面產生力量，醫治你的憂鬱，砍斷你的綑綁，使你的生命像奧古斯丁一樣經歷奇妙的翻轉！", verse: "「神的道是活潑的，是有功效的，比一切兩刃的劍更快...」", ref: "— 希伯來書 4:12" },
      { keywords: ['決定', '計畫', '開始讀經', '每天', '靈修', '堅持'], text: "親愛的孩子，我看到你立下了美好的心志，決定開始每天讀經靈修。\n\n這是我最期待的時刻！每一天清晨或夜晚，我都在書頁的那一端等你。也許有時候你會想偷懶，但只要你願意堅持，哪怕每天只是一小段經文，我都會用它來餵養你。我會親自賜給你渴慕真理的心，讓你越讀越甘甜。", verse: "「耶和華萬軍之神啊，我得著你的言語就當食物吃了；你的言語是我心中的歡喜快樂。」", ref: "— 耶利米書 15:16" }
  ];

  const fallbackLetter = { 
    text: "親愛的小孩，很高興你能藉著這堂課，開始認識這本天下奇書。\n\n聖經不只是一本歷史書，它是我對你永恆的承諾。無論你現在的心情如何，我邀請你從今天開始，每天花一點時間打開聖經。讓我透過這些文字親自對你說話，將得救的智慧與生命的豐盛賜給你！", 
    verse: "「聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的。」", 
    ref: "— 提摩太後書 3:16" 
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
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vh] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #F8FAFC; 
            --text-main: #334155; 
            --text-light: #64748B; 
            --accent-primary: #3B82F6; 
            --accent-secondary: #6366F1; 
            --accent-tertiary: #0EA5E9; 
            --card-bg: rgba(255, 255, 255, 0.85); 
            --card-border: rgba(226, 232, 240, 0.8);
            --modal-bg: rgba(15, 23, 42, 0.6);
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Noto Sans TC', sans-serif;
            line-height: 1.8;
            min-height: 100vh;
        }

        .custom-nav { padding: 20px 30px; position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
        .custom-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 100px 20px 60px 20px; position: relative; }
        .custom-container { max-width: 850px; width: 100%; display: flex; flex-direction: column; align-items: center; z-index: 10;}
        .text-content { text-align: center; margin-bottom: 50px; max-width: 750px; width: 100%; z-index: 2; }

        .custom-theme-wrapper h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; color: transparent; margin-bottom: 15px; letter-spacing: 2px; text-align: center; line-height: 1.2;}
        .custom-theme-wrapper h2 { font-size: 2rem; font-weight: 700; margin-bottom: 25px; color: var(--text-main); border-bottom: 3px solid var(--accent-tertiary); padding-bottom: 10px; display: inline-block;}
        .custom-theme-wrapper h3 { font-size: 1.4rem; font-weight: 700; margin-top: 35px; margin-bottom: 15px; color: var(--accent-primary); text-align: left; width: 100%; display: flex; align-items: center; gap: 8px;}
        .custom-theme-wrapper p { font-size: 1.15rem; color: var(--text-main); font-weight: 500; margin-bottom: 15px; text-align: left;}

        .equip-list { list-style: none; padding: 0; margin: 0 0 20px 0; text-align: left; width: 100%; }
        .equip-list li { font-size: 1.1rem; color: var(--text-main); margin-bottom: 16px; position: relative; padding-left: 25px; line-height: 1.6; background: var(--card-bg); border: 1px solid var(--card-border); padding: 15px 20px 15px 40px; border-radius: 12px; backdrop-filter: blur(10px); box-shadow: 0 4px 6px rgba(0,0,0,0.02);}
        .equip-list li::before { content: "✦"; position: absolute; left: 15px; color: var(--accent-tertiary); font-size: 1.2rem; top: 15px; }
        .counter-example { font-size: 0.95rem; color: var(--accent-secondary); font-style: italic; display: block; margin-top: 6px; font-weight: 600;}

        /* 🌟 經文引用區塊樣式 */
        .verse-quote { background: rgba(14, 165, 233, 0.05); border-left: 4px solid var(--accent-tertiary); padding: 12px 18px; border-radius: 0 8px 8px 0; font-size: 0.95rem; color: var(--text-light); margin-top: 10px; font-weight: 500; line-height: 1.6; }

        .highlight-box { background: linear-gradient(145deg, #F0F9FF, #EFF6FF); border-left: 5px solid var(--accent-primary); padding: 25px; margin: 25px 0; text-align: left; border-radius: 0 12px 12px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.04); width: 100%; }
        .question-card { background: #FFF; border: 1px solid rgba(99, 102, 241, 0.2); border-left: 5px solid var(--accent-secondary); padding: 25px; border-radius: 12px; margin-bottom: 20px; text-align: left; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.03);}
        .question-card .q-label { font-weight: 800; color: var(--accent-secondary); font-size: 1.15rem; margin-bottom: 8px; display: block; letter-spacing: 1px;}
        .question-card .q-text { font-size: 1.2rem; color: var(--text-main); font-weight: 700; line-height: 1.6; }

        .bible-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0 40px 0; width: 100%; text-align: left;}
        .bible-card { background: #FFF; border: 1px solid var(--card-border); padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.3s; }
        .bible-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1); border-color: var(--accent-tertiary);}
        .bible-card h4 { font-size: 1.2rem; color: var(--accent-primary); font-weight: 800; margin-bottom: 10px; border-bottom: 2px dashed #E2E8F0; padding-bottom: 8px;}
        .bible-tag { display: inline-block; background: #F1F5F9; color: var(--text-light); font-size: 0.9rem; padding: 4px 10px; border-radius: 20px; margin: 4px 4px 0 0; font-weight: 600;}
        .bible-tag.highlight { background: #EFF6FF; color: var(--accent-primary); }

        .think-space { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.8; }
        .think-space span { font-size: 0.85rem; letter-spacing: 4px; color: var(--accent-primary); text-transform: uppercase; margin-bottom: 15px; animation: pulseText 2.5s infinite; font-weight: 700;}
        .think-space .scroll-line { width: 2px; height: 60px; background: linear-gradient(to bottom, var(--accent-primary), transparent); animation: pulseLine 2.5s infinite; }

        @keyframes pulseText { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes pulseLine { 0%, 100% { transform: scaleY(1); transform-origin: top; opacity: 0.4;} 50% { transform: scaleY(1.3); transform-origin: top; opacity: 1;} }

        .graphic-container { width: 100%; height: 240px; display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 30px;}
        .graphic-container svg { width: 100%; height: 100%; max-width: 450px; overflow: visible;}
        .svg-text { font-family: 'Noto Sans TC', sans-serif; font-size: 15px; font-weight: 700; fill: var(--text-main); text-anchor: middle; letter-spacing: 1px;}

        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .custom-btn { display: inline-block; margin-top: 30px; padding: 16px 45px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; border: none; border-radius: 30px; font-weight: 700; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); cursor: pointer; font-size: 1.15rem; text-transform: uppercase;}
        .custom-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4); }

        .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; opacity: 0.6; animation: bounce 2.5s infinite; }
        .scroll-indicator span { font-size: 0.75rem; letter-spacing: 3px; margin-bottom: 10px; color: var(--accent-secondary); text-transform: uppercase; font-weight: 700;}
        .scroll-indicator .line { width: 2px; height: 50px; background: linear-gradient(to bottom, var(--accent-secondary), transparent); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-12px) translateX(-50%); } 60% { transform: translateY(-6px) translateX(-50%); } }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--modal-bg); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-card { background: #FFF; border: 1px solid var(--card-border); width: 90%; max-width: 600px; border-radius: 24px; padding: 45px 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); position: relative; transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 90vh; overflow-y: auto; }
        .modal-overlay.active .modal-card { transform: translateY(0) scale(1); }
        .close-btn { position: absolute; top: 20px; right: 25px; background: none; border: none; font-size: 2rem; color: var(--text-light); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: var(--text-main); }
        
        .modal-textarea { width: 100%; height: 180px; padding: 20px; border: 2px solid #E2E8F0; border-radius: 12px; resize: none; font-family: inherit; font-size: 1.05rem; color: var(--text-main); background: #F8FAFC; margin-bottom: 25px; transition: all 0.3s; line-height: 1.6; }
        .modal-textarea:focus { outline: none; border-color: var(--accent-tertiary); box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1); background: #FFF;}
        
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(59, 130, 246, 0.2); border-top: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-secondary); border-radius: 50%; margin: 0 auto 30px auto; animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
            .custom-theme-wrapper h1 { font-size: 2.3rem; } .custom-theme-wrapper h2 { font-size: 1.6rem; } .bible-grid { grid-template-columns: 1fr; }
            .graphic-container { height: 180px; } .modal-card { padding: 35px 25px; width: 95%;}
        }
      `}} />

      <nav className="custom-nav">
        <Link href="/seekers-books" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <ArrowLeft className="w-4 h-4" /> 返回慕道裝備
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content" style={{ textAlign: 'center' }}>
                <p style={{ textAlign: 'center', color: 'var(--accent-secondary)', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.9rem' }}>THE BREATH OF GOD</p>
                <h1>聖經是神所默示的嗎？</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '15px', fontWeight:'600' }}>對應進度：118 Q&A — Q32-37, 62-63</p>
            </div>
            
            <div className="graphic-container">
                <svg viewBox="0 0 400 250">
                    <path d="M 200 180 Q 250 150, 350 160 L 350 80 Q 250 70, 200 100 Z" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="2" />
                    <path d="M 200 180 Q 150 150, 50 160 L 50 80 Q 150 70, 200 100 Z" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="2" />
                    <line x1="200" y1="100" x2="200" y2="180" stroke="var(--accent-secondary)" strokeWidth="4" />
                    <path d="M 200 80 Q 200 40, 150 20" fill="none" stroke="var(--accent-tertiary)" strokeWidth="3" strokeDasharray="5 5" opacity="0.6"/>
                    <path d="M 200 80 Q 200 20, 200 0" fill="none" stroke="var(--accent-primary)" strokeWidth="4" opacity="0.8"/>
                    <path d="M 200 80 Q 200 40, 250 20" fill="none" stroke="var(--accent-tertiary)" strokeWidth="3" strokeDasharray="5 5" opacity="0.6"/>
                    <circle cx="200" cy="120" r="40" fill="var(--accent-primary)" opacity="0.1" filter="blur(10px)"/>
                </svg>
            </div>
        </div>
        <div className="scroll-indicator"><span>開始探索</span><div className="line"></div></div>
      </section>

      {/* 1. 認識神的途徑 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>一、認識神的途徑</h2>
                
                <div className="question-card">
                    <span className="q-label">Q1. 思考一下：</span>
                    <span className="q-text">如果神真的存在，祂會用什麼方法讓我們知道祂的心意？</span>
                </div>
                
                <div className="think-space">
                    <span>往下看解答</span>
                    <div className="scroll-line"></div>
                </div>

                <h3><Search className="w-6 h-6 inline mr-2" /> 普遍啟示 vs. 特殊啟示</h3>
                <p>人是有限且有罪的，如果沒有正確的根源，人無法自救。因此神透過兩種方式向人啟示祂自己：</p>
                <ul className="equip-list">
                    <li>
                        <strong>普遍啟示：</strong>大自然、人的良知、道德本性。
                        <div className="verse-quote">羅馬書 1:20「自從造天地以來，神的永能和神性是明明可知的，雖是眼不能見，但藉著所造之物就可以曉得，叫人無可推諉。」</div>
                    </li>
                    <li>
                        <strong>特殊啟示：</strong>神直接顯現、異象、異夢、先知傳話。
                        <div className="verse-quote">創世記 18:1「耶和華在幔利橡樹那裡向亞伯拉罕顯現出來...」</div>
                    </li>
                </ul>

                <div className="highlight-box">
                    <strong style={{color:'var(--accent-primary)', fontSize:'1.2rem'}}>神終極的啟示：</strong><br/><br/>
                    1. 透過<strong>耶穌基督</strong>
                    <div className="verse-quote" style={{background:'rgba(255,255,255,0.5)', marginTop:'5px', marginBottom:'15px'}}>約翰福音 1:18「從來沒有人看見神，只有在父懷裡的獨生子將他表明出來。」</div>
                    
                    2. 透過<strong>聖經</strong>，帶出神救贖的計畫：
                    <div className="verse-quote" style={{background:'rgba(255,255,255,0.5)', marginTop:'5px'}}>提摩太後書 3:15-16「...這聖經能使你因信基督耶穌，有得救的智慧。聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的...」</div>
                    <div className="verse-quote" style={{background:'rgba(255,255,255,0.5)', marginTop:'5px'}}>約翰福音 20:31「但記這些事要叫你們信耶穌是基督，是神的兒子，並且叫你們信了他，就可以因他的名得生命。」</div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. 聖經的結構 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            
            <div className="graphic-container" style={{height:'180px'}}>
                <svg viewBox="0 0 400 150">
                    <rect x="60" y="40" width="80" height="70" rx="8" fill="var(--accent-primary)" opacity="0.1"/>
                    <text x="100" y="85" className="svg-text" fontSize="30" fill="var(--accent-primary)">39</text>
                    <text x="100" y="130" className="svg-text" fontSize="12" fill="var(--text-light)">舊約 (Old)</text>
                    <text x="175" y="85" className="svg-text" fontSize="24" fill="var(--text-light)">+</text>
                    <rect x="210" y="40" width="80" height="70" rx="8" fill="var(--accent-secondary)" opacity="0.1"/>
                    <text x="250" y="85" className="svg-text" fontSize="30" fill="var(--accent-secondary)">27</text>
                    <text x="250" y="130" className="svg-text" fontSize="12" fill="var(--text-light)">新約 (New)</text>
                    <text x="320" y="85" className="svg-text" fontSize="24" fill="var(--text-light)">=</text>
                    <text x="360" y="85" className="svg-text" fontSize="35" fill="var(--text-main)" fontWeight="800">66</text>
                </svg>
            </div>

            <div className="text-content">
                <h2>二、聖經的結構</h2>
                <p>聖經共有 66 卷書，這不是一本單一的書，而是一座充滿歷史與智慧的圖書館：</p>

                <div className="bible-grid">
                    <div className="bible-card">
                        <h4>舊約 39 卷</h4>
                        <div>
                            <span className="bible-tag highlight">律法書 5卷</span>
                            <span className="bible-tag">歷史書 12卷</span>
                            <span className="bible-tag highlight">詩歌智慧書 5卷</span>
                            <span className="bible-tag">大先知書 5卷</span>
                            <span className="bible-tag">小先知書 12卷</span>
                        </div>
                    </div>
                    <div className="bible-card">
                        <h4>新約 27 卷</h4>
                        <div>
                            <span className="bible-tag highlight">福音書 4卷</span>
                            <span className="bible-tag">歷史書(徒) 1卷</span>
                            <span className="bible-tag highlight">保羅書信 13卷</span>
                            <span className="bible-tag">一般書信 8卷</span>
                            <span className="bible-tag highlight">預言(啟) 1卷</span>
                        </div>
                    </div>
                </div>

                <div className="highlight-box" style={{borderLeftColor: 'var(--accent-secondary)', background: '#F8FAFC'}}>
                    <strong style={{fontSize:'1.2rem', color:'var(--accent-secondary)'}}>★ 聖經的超凡記錄：</strong>
                    <ul style={{marginTop:'10px', fontWeight:'600'}}>
                        <li>出版、發行總數世界第一 (累積逾50億本)</li>
                        <li>譯本最多 (全書或部分翻譯超過3000種語言)</li>
                        <li>歷史上從不改版的書</li>
                        <li>第一部被帶到太空及月球的書</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* 3. 聖經的權威性 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                <svg viewBox="0 0 400 220">
                    <path d="M 50 180 L 350 180 L 330 200 L 70 200 Z" fill="var(--text-light)" opacity="0.2"/>
                    <rect x="80" y="80" width="40" height="100" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="2"/>
                    <text x="100" y="140" className="svg-text" fill="var(--accent-primary)">神</text>
                    <rect x="180" y="60" width="40" height="120" fill="var(--card-bg)" stroke="var(--accent-secondary)" strokeWidth="2"/>
                    <text x="200" y="130" className="svg-text" fill="var(--accent-secondary)">耶穌</text>
                    <rect x="280" y="80" width="40" height="100" fill="var(--card-bg)" stroke="var(--accent-tertiary)" strokeWidth="2"/>
                    <text x="300" y="140" className="svg-text" fill="var(--accent-tertiary)">教會</text>
                    <path d="M 40 80 L 360 80 L 200 30 Z" fill="var(--accent-primary)" opacity="0.1"/>
                    <line x1="40" y1="80" x2="360" y2="80" stroke="var(--accent-primary)" strokeWidth="3"/>
                    <text x="200" y="65" className="svg-text" fill="var(--accent-primary)" fontWeight="800">最高權威</text>
                </svg>
            </div>
            <div className="text-content">
                <h2>三、聖經的權威性</h2>
                <p>為什麼我們說聖經有絕對的權威？因為這本書建立在不可動搖的基石上：</p>
                
                <ul className="equip-list">
                    <li>
                        <strong>上帝不變的話語：</strong>聖經中出現 3808 次「耶和華說」。神的話具備永恆性、真實性、與功效性 (不徒勞無功)。
                    </li>
                    <li>
                        <strong>耶穌自己的宣告：</strong>耶穌親自背書舊約的權威，也授權給新約的使徒。
                        <div className="verse-quote">馬太福音 5:18「我實在告訴你們，就是到天地都廢去了，律法的一點一畫也不能廢去，都要成全。」</div>
                    </li>
                    <li><strong>歷代教會的教導：</strong>在逼迫與異端中，神護衛正典的流傳與保存。</li>
                    <li><strong>讀者生命的見證：</strong>放蕩不羈的奧古斯丁、放下名位的中國佈道家宋尚節，都是因為一句經文生命被徹底翻轉！</li>
                </ul>
            </div>
        </div>
      </section>

      {/* 4. 聖經的獨特性 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>四、聖經的獨特性</h2>

                <div className="question-card">
                    <span className="q-label">Q2. 思考一下：</span>
                    <span className="q-text">如果找 40 個不同職業的人，花 1500 年各寫一篇文章，最後拼在一起會發生什麼事？</span>
                </div>
                
                <div className="think-space">
                    <span>往下看解答</span>
                    <div className="scroll-line"></div>
                </div>
                
                <h3><Wind className="w-6 h-6 inline mr-2 text-accent-secondary"/> 神自己的默示 (呼氣)</h3>
                <p>「默示」在原文的意思是<strong>「呼氣」</strong>。人所寫出的是神呼出的氣息。神啟示真理，防止作者犯錯，卻不違反作者的人格與文筆。</p>
                
                <div className="highlight-box">
                    <strong style={{color:'var(--accent-primary)', fontSize:'1.2rem'}}>最不可思議的奇蹟：</strong><br/><br/>
                    聖經由 <strong>40多位作者</strong>（君王、牧羊人、漁夫、醫生等）在不同環境下，歷經 <strong>1500多年</strong> 寫成。但這 66 卷書拼在一起時，主題完全一致、連貫！這證明了<strong>神才是真正的作者</strong>。
                </div>

                <h3><Milestone className="w-6 h-6 inline mr-2 text-accent-primary"/> 預言的 100% 實現</h3>
                <p>考古學的證實、以色列的復國，以及舊約中關於耶穌的 <strong>300多個預言</strong>，完全精準地應驗在耶穌一人身上。</p>
            </div>
        </div>
      </section>

      {/* 5. 對聖經的回應 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>五、對聖經的回應</h2>
                <div className="verse-quote" style={{marginBottom:'20px'}}>提摩太後書 3:15「...這聖經能使你因信基督耶穌，有得救的智慧。」</div>
                <p>這本書不是用來供奉的，而是用來閱讀與活出來的。常見的讀經方式有：</p>
                
                <ul className="equip-list">
                    <li><strong className="text-accent-tertiary">速讀：</strong>抓住全貌與中心思想。</li>
                    <li><strong className="text-accent-tertiary">精讀：</strong>觀察 ➔ 解釋 ➔ 應用 (從文字 logos 變成生命的 rhema)。</li>
                    <li><strong className="text-accent-tertiary">默想：</strong>讓神的話從知識進入心靈反覆思想。</li>
                    <li><strong className="text-accent-tertiary">禱讀：</strong>用聖經的話來向神禱告。</li>
                    <li><strong className="text-accent-tertiary">研讀：</strong>查考背景與前後經文，尋出脈絡。</li>
                </ul>

                <p style={{color: 'var(--accent-primary)', fontWeight: '800', marginTop: '40px', fontSize:'1.3rem'}}>準備好開始每天的靈修生活了嗎？<br/>寫下你的決定，看看天父怎麼說。</p>
                
                <button className="custom-btn" onClick={openModal}>寫下我的作業與禱告</button>
            </div>
        </div>
      </section>

      {/* Modal 程式碼 (同前)... */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {modalState === 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '800' }}>裝備課回應卡</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6', fontWeight:'600' }}>1. 讀完這課，你對聖經有什麼新的認識？<br/>2. 你決定這週開始如何讀經？寫下你的禱告。</p>
                    <textarea className="modal-textarea" value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="原來聖經真的是神寫的...&#10;天父，我決定每天花十分鐘讀經，求祢幫助我..." />
                    <button className="custom-btn" style={{ width: '100%', marginTop: '0' }} onClick={submitPrayer} disabled={!prayerText.trim()}>送出作業與禱告</button>
                </div>
            )}
            {modalState === 'loading' && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '1px' }}>正在接收你的心志，為你開啟天父的信...</p>
                </div>
            )}
            {modalState === 'letter' && letterData && (
                <div style={{ textAlign: 'left' }}>
                    <img src={letterData.image} alt="插畫" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '15px', fontWeight: '800', textAlign: 'center', borderBottom: '2px dashed #E2E8F0', paddingBottom: '15px' }}>💌 來自天父的回應</h3>
                    <div style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontWeight:'500' }}>{letterData.text}</div>
                    <div style={{ background: '#F1F5F9', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-tertiary)' }}>
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