'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ShieldAlert, Crosshair, Heart, Zap, Sun, BookText } from 'lucide-react';

// 🌟 經文點擊互動元件
function BibleVerse({ reference, text }: { reference: string, text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="inline-block align-middle w-full mt-1">
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${isOpen ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'bg-rose-50 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white border border-rose-100'}`}
      >
        <BookText size={14} /> {reference}
      </button>
      <span className={`block overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-3 mb-2' : 'max-h-0 opacity-0 mt-0 mb-0'}`}>
        <span className="block p-4 bg-rose-50/50 border-l-4 border-[var(--accent-primary)] rounded-r-xl text-[0.95rem] font-medium text-slate-700 shadow-sm">
          {text}
        </span>
      </span>
    </span>
  );
}

export default function JesusSonOfGodLesson() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  // 🌟 滾動漸顯動畫
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
      "https://images.unsplash.com/photo-1544098281-073ae35c98b0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1473654729519-7af26932eb51?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1437603562860-19efb19ebc51?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518991043183-1e5b88820d88?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519818173456-114ebfa2409b?auto=format&fit=crop&w=600&q=80"
  ];

  const heavenlyLetters = [
      { keywords: ['復活', '懷疑', '證據', '真理', '空墳墓', '真的嗎'], text: "親愛的孩子，我完全理解你的理性和疑惑。\n\n耶穌的復活不是一個神話故事，而是人類歷史上最震撼的真實事件。連當時最想推翻這個事實的人，都無法解釋那座空墳墓。當你願意用心去查考，你會發現所有的證據都指向一個榮耀的真相：祂真的已經復活了！祂現在活著，而且渴望參與你的人生。", verse: "「因為我活著，你們也要活著。」", ref: "— 約翰福音 14:19" },
      { keywords: ['罪', '赦免', '內疚', '做錯', '原諒', '洗淨'], text: "親愛的孩子，我看見你背負著罪疚感，覺得自己不夠好、不配得愛。\n\n但請看看十字架！耶穌這位無罪的神之子，親自為你承擔了一切的代價。當祂在十字架上說『成了』的時候，你所有的過犯就已經被完全洗淨了。不要再定自己的罪了，接受這份重價的恩典，在我眼中，你是聖潔且美麗的。", verse: "「我們藉這愛子的血得蒙救贖，過犯得以赦免，乃是照他豐富的恩典。」", ref: "— 以弗所書 1:7" },
      { keywords: ['死亡', '害怕', '絕望', '盡頭', '失去'], text: "親愛的孩子，死亡曾是人類最大的恐懼，但耶穌已經為你打破了這個魔咒。\n\n祂勝過了死亡的權勢，把生命的鑰匙奪了回來。因為有祂，死亡不再是終點，而是一扇通往永恆榮耀的門。不要害怕未來的終局，因為把持你生命氣息的，是那位勝過死亡的生命之主。", verse: "「死啊！你得勝的權勢在哪裡？死啊！你的毒鉤在哪裡？... 感謝神，使我們藉著我們的主耶穌基督得勝。」", ref: "— 哥林多前書 15:55, 57" },
      { keywords: ['撒旦', '攻擊', '綑綁', '自由', '魔鬼', '軟弱', '癮'], text: "親愛的孩子，當你覺得自己被某種癮、軟弱或黑暗的思緒綑綁時，請呼喊耶穌的名字。\n\n神的兒子顯現，為要除滅魔鬼的作為！耶穌已經在十字架上廢除了仇敵的權勢，牠在你的生命中已經毫無合法著力點。站起來，奉耶穌的名宣告你的自由，我賜給你的不是膽怯的心，而是剛強、仁愛、謹守的心！", verse: "「神的兒子顯現出來，為要除滅魔鬼的作為。」", ref: "— 約翰一書 3:8" },
      { keywords: ['接受', '呼召', '相信', '決定', '受洗', '跟隨', '生命'], text: "親愛的孩子，我看到你做出了生命中最重要的一個決定：接受耶穌成為你的救主！\n\n天上正為你歡呼！從這一刻起，你領受了屬靈的全新 DNA，你正式成為了我國度裡尊貴的孩子。接下來的日子，帶著耶穌給你的權柄，去支取恩典、去愛人、去完成你的使命吧。我會永遠與你同在，直到世界的末了！", verse: "「凡接待他的，就是信他名的人，他就賜他們權柄作神的兒女。」", ref: "— 約翰福音 1:12" }
  ];

  const fallbackLetter = { 
    text: "親愛的小孩，很高興你能勇敢地探索『耶穌是誰』這個終極問題。\n\n耶穌不只是一位偉大的老師，祂是那道路、真理和生命。祂愛你到一個地步，願意為你降生、受死並復活。這一切的救恩與權柄，只要你願意打開心門，現在就可以立刻白白領受。帶著信心，去經歷這位榮耀的神之子吧！", 
    verse: "「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」", 
    ref: "— 約翰福音 3:16" 
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
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vh] bg-orange-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #FFFDF9; 
            --text-main: #43302B; 
            --text-light: #785A52; 
            --accent-primary: #F43F5E; 
            --accent-secondary: #F59E0B; 
            --accent-tertiary: #FB923C; 
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(244, 63, 94, 0.15);
            --modal-bg: rgba(67, 48, 43, 0.7);
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
        .equip-list li { font-size: 1.1rem; color: var(--text-main); margin-bottom: 16px; position: relative; padding-left: 25px; line-height: 1.6; background: var(--card-bg); border: 1px solid var(--card-border); padding: 15px 20px 15px 40px; border-radius: 12px; backdrop-filter: blur(10px); box-shadow: 0 4px 6px rgba(244,63,94,0.02);}
        .equip-list li::before { content: "✦"; position: absolute; left: 15px; color: var(--accent-tertiary); font-size: 1.2rem; top: 15px; }

        .highlight-box { background: linear-gradient(145deg, #FFF1F2, #FEFCE8); border-left: 5px solid var(--accent-primary); padding: 25px; margin: 25px 0; text-align: left; border-radius: 0 12px 12px 0; box-shadow: 0 10px 30px rgba(244,63,94,0.04); width: 100%; }
        .question-card { background: #FFF; border: 1px solid rgba(245, 158, 11, 0.2); border-left: 5px solid var(--accent-secondary); padding: 25px; border-radius: 12px; margin-bottom: 20px; text-align: left; width: 100%; box-shadow: 0 10px 25px rgba(245,158,11,0.05);}
        .question-card .q-label { font-weight: 800; color: var(--accent-secondary); font-size: 1.15rem; margin-bottom: 8px; display: block; letter-spacing: 1px;}
        .question-card .q-text { font-size: 1.2rem; color: var(--text-main); font-weight: 700; line-height: 1.6; }

        .grid-4 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0 30px 0;}
        .grid-card { background: #FFF; border: 1px solid var(--card-border); padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); text-align: center; transition: all 0.3s;}
        .grid-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(244,63,94,0.1); border-color: var(--accent-primary);}
        .grid-card h4 { font-size: 1.2rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 5px;}
        .grid-card p { font-size: 0.95rem; color: var(--text-light); text-align: center; margin: 0; line-height: 1.4;}

        .trilemma-box { display: flex; justify-content: space-between; gap: 10px; margin: 25px 0;}
        .tri-item { flex: 1; background: #FFF; border: 2px dashed rgba(245,158,11,0.3); border-radius: 12px; padding: 15px 10px; text-align: center; position: relative;}
        .tri-item.active { border-style: solid; border-color: var(--accent-primary); background: #FFF1F2; box-shadow: 0 5px 15px rgba(244,63,94,0.15);}
        .tri-item h4 { font-size: 1.1rem; font-weight: 800; margin: 0; color: var(--text-light);}
        .tri-item.active h4 { color: var(--accent-primary); }

        .think-space { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.8; }
        .think-space span { font-size: 0.85rem; letter-spacing: 4px; color: var(--accent-secondary); text-transform: uppercase; margin-bottom: 15px; animation: pulseText 2.5s infinite; font-weight: 700;}
        .think-space .scroll-line { width: 2px; height: 60px; background: linear-gradient(to bottom, var(--accent-secondary), transparent); animation: pulseLine 2.5s infinite; }
        @keyframes pulseText { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes pulseLine { 0%, 100% { transform: scaleY(1); transform-origin: top; opacity: 0.4;} 50% { transform: scaleY(1.3); transform-origin: top; opacity: 1;} }

        .graphic-container { width: 100%; height: 240px; display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 30px;}
        .graphic-container svg { width: 100%; height: 100%; max-width: 450px; overflow: visible;}
        .svg-text { font-family: 'Noto Sans TC', sans-serif; font-size: 15px; font-weight: 700; fill: var(--text-main); text-anchor: middle; letter-spacing: 1px;}

        /* 🌟 CSS 漸顯動畫 */
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        
        .custom-btn { display: inline-block; margin-top: 30px; padding: 16px 45px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary)); color: white; border: none; border-radius: 30px; font-weight: 700; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(244, 63, 94, 0.3); cursor: pointer; font-size: 1.15rem; text-transform: uppercase;}
        .custom-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(251, 146, 60, 0.4); }
        .custom-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; opacity: 0.6; animation: bounce 2.5s infinite; }
        .scroll-indicator span { font-size: 0.75rem; letter-spacing: 3px; margin-bottom: 10px; color: var(--accent-primary); text-transform: uppercase; font-weight: 700;}
        .scroll-indicator .line { width: 2px; height: 50px; background: linear-gradient(to bottom, var(--accent-primary), transparent); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-12px) translateX(-50%); } 60% { transform: translateY(-6px) translateX(-50%); } }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--modal-bg); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-card { background: #FFF; border: 1px solid var(--card-border); width: 90%; max-width: 600px; border-radius: 24px; padding: 45px 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); position: relative; transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 90vh; overflow-y: auto; }
        .modal-overlay.active .modal-card { transform: translateY(0) scale(1); }
        .close-btn { position: absolute; top: 20px; right: 25px; background: none; border: none; font-size: 2rem; color: var(--text-light); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: var(--text-main); }
        
        .modal-textarea { width: 100%; height: 180px; padding: 20px; border: 2px solid #FEE2E2; border-radius: 12px; resize: none; font-family: inherit; font-size: 1.05rem; color: var(--text-main); background: #FFFBFB; margin-bottom: 25px; transition: all 0.3s; line-height: 1.6; }
        .modal-textarea:focus { outline: none; border-color: var(--accent-secondary); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); background: #FFF;}
        
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(244, 63, 94, 0.2); border-top: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-secondary); border-radius: 50%; margin: 0 auto 30px auto; animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
            .custom-theme-wrapper h1 { font-size: 2.3rem; } .custom-theme-wrapper h2 { font-size: 1.6rem; } 
            .grid-4 { grid-template-columns: 1fr; }
            .graphic-container { height: 180px; } .modal-card { padding: 35px 25px; width: 95%;}
        }
      `}} />

      <nav className="custom-nav">
        <Link href="/seekers-books" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <ArrowLeft className="w-4 h-4" /> 返回慕道裝備
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content" style={{ textAlign: 'center' }}>
                <p style={{ textAlign: 'center', color: 'var(--accent-secondary)', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.9rem' }}>THE SON OF GOD</p>
                <h1>耶穌是神的兒子嗎？</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '15px', fontWeight:'600' }}>對應進度：118 Q&A — Q16~31，Q38~41</p>
            </div>
            
            <div className="graphic-container">
                <svg viewBox="0 0 400 250">
                    <circle cx="200" cy="150" r="80" fill="var(--accent-secondary)" opacity="0.15" filter="blur(20px)"/>
                    <path d="M 200 150 L 100 50 M 200 150 L 200 20 M 200 150 L 300 50" stroke="var(--accent-secondary)" strokeWidth="3" strokeDasharray="5 5" opacity="0.5"/>
                    <path d="M 50 220 Q 200 100 350 220 Z" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="3"/>
                    <path d="M 170 220 L 170 160 Q 200 130 230 160 L 230 220 Z" fill="var(--bg-color)" stroke="var(--accent-primary)" strokeWidth="3"/>
                    <circle cx="140" cy="190" r="35" fill="var(--card-bg)" stroke="var(--accent-tertiary)" strokeWidth="3"/>
                    <path d="M 200 180 L 200 100 M 180 140 L 220 140" stroke="var(--accent-secondary)" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
                </svg>
            </div>
        </div>
        <div className="scroll-indicator"><span>開始探索</span><div className="line"></div></div>
      </section>

      {/* 1. 耶穌是誰？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>一、教主還是救主？</h2>
                
                <div className="question-card">
                    <span className="q-label">Q1. 思考一下：</span>
                    <span className="q-text">如果耶穌只是一個好人或道德老師，祂為什麼要宣告自己是神？</span>
                </div>
                
                <div className="think-space">
                    <span>往下看解答</span>
                    <div className="scroll-line"></div>
                </div>

                <h3><Search className="w-6 h-6 inline mr-2 text-accent-tertiary" /> 祂自稱是神 (I AM)</h3>
                <p>耶穌的自我宣示非常驚人，祂不只說自己是先知，祂宣告自己就是神：</p>
                <ul className="equip-list">
                    <li>
                        「你們若不信我是基督(I AM)，必要死在罪中。」
                        <BibleVerse reference="(約8:24)" text="所以我對你們說，你們要死在罪中。你們若不信我是基督，必要死在罪中。" />
                    </li>
                    <li>
                        「還沒有亞伯拉罕就有了我(I AM)。」
                        <BibleVerse reference="(約8:58)" text="耶穌說：我實實在在地告訴你們，還沒有亞伯拉罕就有了我。" />
                    </li>
                    <li>
                        「我就是道路、真理、生命...」
                        <BibleVerse reference="(約14:6)" text="耶穌說：我就是道路、真理、生命；若不藉著我，沒有人能到父那裡去。" />
                    </li>
                </ul>

                <h3><ShieldAlert className="w-6 h-6 inline mr-2 text-accent-primary" /> 著名的三難困境 (Trilemma)</h3>
                <p>面對耶穌自稱為神的宣告，邏輯上只有三種可能。祂如果不是神，那祂就是個騙子或瘋子。你必須做出選擇：</p>
                
                <div className="trilemma-box">
                    <div className="tri-item">
                        <h4>騙子 (Liar)</h4>
                        <p style={{fontSize:'0.85rem', color:'var(--text-light)', marginTop:'5px'}}>祂明知不是神卻騙人，這與祂高尚的道德矛盾。</p>
                    </div>
                    <div className="tri-item">
                        <h4>瘋子 (Lunatic)</h4>
                        <p style={{fontSize:'0.85rem', color:'var(--text-light)', marginTop:'5px'}}>祂有嚴重的妄想症，這與祂清晰的智慧矛盾。</p>
                    </div>
                    <div className="tri-item active">
                        <h4>是神 (Lord)</h4>
                        <p style={{fontSize:'0.85rem', color:'var(--accent-primary)', marginTop:'5px'}}>祂說的是真的，祂就是神親自道成肉身。</p>
                    </div>
                </div>

                <div className="highlight-box">
                    <strong style={{color:'var(--accent-primary)', fontSize:'1.2rem'}}>死裡復活的終極證據：</strong><br/><br/>
                    耶穌是神的保證，在於祂戰勝了死亡！連《誰移走了石頭》這本書的無神論作者，在查考了「兵丁移走屍體？」、「門徒偷走？」、「婦女走錯墳墓？」等假設後，最後都只能承認復活是唯一的真相。門徒彼得、多馬、保羅更用生命為此作見證。
                </div>
            </div>
        </div>
      </section>

      {/* 2. 耶穌是神兒子的解釋 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            
            <div className="graphic-container" style={{height:'180px'}}>
                <svg viewBox="0 0 400 150">
                    <circle cx="150" cy="75" r="50" fill="var(--card-bg)" stroke="var(--accent-secondary)" strokeWidth="3"/>
                    <text x="150" y="80" className="svg-text" fill="var(--accent-secondary)" fontSize="18">聖父</text>
                    <circle cx="250" cy="75" r="50" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="3"/>
                    <text x="250" y="80" className="svg-text" fill="var(--accent-primary)" fontSize="18">聖子</text>
                    <path d="M 190 75 L 210 75" stroke="var(--text-main)" strokeWidth="2" markerEnd="url(#arrow-head)" markerStart="url(#arrow-head-rev)"/>
                    <text x="200" y="55" className="svg-text" fontSize="12" fill="var(--text-light)">原為一</text>
                    <defs>
                        <marker id="arrow-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-main)" />
                        </marker>
                        <marker id="arrow-head-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-main)" />
                        </marker>
                    </defs>
                </svg>
            </div>

            <div className="text-content">
                <h2>二、「神兒子」是什麼意思？</h2>
                <p>我們說耶穌是「神的兒子」，這不是生物學上的繁衍，而是一種奧秘的屬靈關係：</p>

                <ul className="equip-list">
                    <li>
                        <strong className="text-accent-secondary">等於神 (Equal)：</strong>本質本性完全合一。
                        <BibleVerse reference="(約10:30)" text="我與父原為一。" />
                    </li>
                    <li>
                        <strong className="text-accent-secondary">出於神 (From)：</strong>祂非被造，乃是被生。擁有與神相同的生命。
                        <BibleVerse reference="(約5:26)" text="因為父怎樣在自己有生命，就賜給他兒子也照樣在自己有生命。" />
                    </li>
                    <li>
                        <strong className="text-accent-secondary">代表神 (Represents)：</strong>彰顯神的生命與權柄。看見子，就是看見了父。
                    </li>
                </ul>

                <p style={{marginTop:'20px'}}>因為這份「父與子」的關係，耶穌擁有了絕對的權柄：</p>
                <div className="grid-4">
                    <div className="grid-card">
                        <h4>創造的主</h4>
                        <p>萬有都是靠祂造的</p>
                    </div>
                    <div className="grid-card">
                        <h4>生命的主</h4>
                        <p>生命在祂裡頭</p>
                    </div>
                    <div className="grid-card">
                        <h4>赦罪的主</h4>
                        <p>在地上有赦罪權柄</p>
                    </div>
                    <div className="grid-card">
                        <h4>審判的主</h4>
                        <p>將審判活人死人</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. 神兒子的救恩 (得勝) */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                <svg viewBox="0 0 400 220">
                    <path d="M 50 180 L 350 180" stroke="var(--text-light)" strokeWidth="2" strokeDasharray="5 5"/>
                    <line x1="200" y1="40" x2="200" y2="180" stroke="var(--accent-primary)" strokeWidth="8"/>
                    <line x1="140" y1="80" x2="260" y2="80" stroke="var(--accent-primary)" strokeWidth="8"/>
                    <path d="M 160 160 Q 180 120 180 180" fill="none" stroke="var(--text-main)" strokeWidth="4" opacity="0.3"/>
                    <path d="M 240 160 Q 220 120 220 180" fill="none" stroke="var(--text-main)" strokeWidth="4" opacity="0.3"/>
                    <path d="M 170 150 L 190 170 M 230 150 L 210 170" stroke="var(--accent-primary)" strokeWidth="3"/>
                    <text x="200" y="210" className="svg-text" fill="var(--accent-primary)" fontWeight="800">十字架的得勝</text>
                </svg>
            </div>
            <div className="text-content">
                <h2>三、耶穌帶來的救恩</h2>
                <p>耶穌道成肉身（以馬內利），是為了帶來全面的勝利與拯救：</p>
                
                <div className="grid-4" style={{gridTemplateColumns: '1fr'}}>
                    <div className="grid-card" style={{display:'flex', alignItems:'center', textAlign:'left', gap:'15px'}}>
                        <div className="p-3 bg-rose-50 rounded-full text-rose-500"><Crosshair size={24}/></div>
                        <div className="w-full">
                            <h4 style={{margin:0, textAlign:'left'}}>1. 勝過罪性與罪行</h4>
                            <p style={{textAlign:'left'}}>洗淨良心與罪惡，使罪得赦免，不再被定罪。</p>
                            <BibleVerse reference="(約壹2:1-2)" text="若有人犯罪，在父那裡我們有一位中保，就是那義者耶穌基督..." />
                        </div>
                    </div>
                    <div className="grid-card" style={{display:'flex', alignItems:'center', textAlign:'left', gap:'15px'}}>
                        <div className="p-3 bg-orange-50 rounded-full text-orange-500"><Heart size={24}/></div>
                        <div>
                            <h4 style={{margin:0, textAlign:'left'}}>2. 勝過死亡</h4>
                            <p style={{textAlign:'left'}}>罪的工價乃是死，但主替我們免除了審判。</p>
                        </div>
                    </div>
                    <div className="grid-card" style={{display:'flex', alignItems:'center', textAlign:'left', gap:'15px'}}>
                        <div className="p-3 bg-amber-50 rounded-full text-amber-500"><Zap size={24}/></div>
                        <div>
                            <h4 style={{margin:0, textAlign:'left'}}>3. 勝過撒旦</h4>
                            <p style={{textAlign:'left'}}>廢除了律法的定罪，讓仇敵無法再掌死權，毫無著力點！</p>
                        </div>
                    </div>
                    <div className="grid-card" style={{display:'flex', alignItems:'center', textAlign:'left', gap:'15px'}}>
                        <div className="p-3 bg-slate-50 rounded-full text-slate-500"><Sun size={24}/></div>
                        <div className="w-full">
                            <h4 style={{margin:0, textAlign:'left'}}>4. 勝過世界</h4>
                            <p style={{textAlign:'left'}}>恢復神人關係，賜給我們神兒子的永生生命。</p>
                            <BibleVerse reference="(約3:16)" text="神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. 你的經歷與呼召 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>四、經歷祂並回應呼召</h2>
                
                <ul className="equip-list">
                    <li>
                        <strong className="text-accent-primary">接受祂：</strong>從神而生，領受新的生命 DNA。
                        <BibleVerse reference="(約1:12)" text="凡接待他的，就是信他名的人，他就賜他們權柄作神的兒女。" />
                    </li>
                    <li>
                        <strong className="text-accent-primary">支取祂：</strong>奉主的名禱告、宣告，擁有屬天的權柄。
                        <BibleVerse reference="(約16:24)" text="向來你們沒有奉我的名求什麼，如今你們求，就必得著..." />
                    </li>
                    <li><strong className="text-accent-primary">建立教會：</strong>以先知、祭司、君王的職份建造基督的身體。</li>
                    <li><strong className="text-accent-primary">完成使命：</strong>神常與同在，沛降聖靈能力，透過我們彰顯基督！</li>
                </ul>

                <p style={{color: 'var(--accent-secondary)', fontWeight: '800', marginTop: '40px', fontSize:'1.3rem'}}>你願意接受耶穌成為你的救主，經歷這份大能嗎？<br/>寫下你的決定，看看天父怎麼說。</p>
                
                <button className="custom-btn" onClick={openModal}>寫下我的決定與禱告</button>
            </div>
        </div>
      </section>

      {/* Modal 視窗 */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {modalState === 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '800' }}>裝備課回應卡</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6', fontWeight:'600' }}>1. 上完這課，你對耶穌有什麼新的認識？<br/>2. 面對耶穌為你成就的救恩，你現在最想對祂說什麼？</p>
                    <textarea className="modal-textarea" value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="原來耶穌為我做了這麼多...&#10;主耶穌，我願意打開心門接受祢，求祢赦免我..." />
                    <button className="custom-btn" style={{ width: '100%', marginTop: '0' }} onClick={submitPrayer} disabled={!prayerText.trim()}>送出回應與禱告</button>
                </div>
            )}
            {modalState === 'loading' && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '1px' }}>正在接收你的決定，為你開啟天父的信...</p>
                </div>
            )}
            {modalState === 'letter' && letterData && (
                <div style={{ textAlign: 'left' }}>
                    <img src={letterData.image} alt="插畫" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '15px', fontWeight: '800', textAlign: 'center', borderBottom: '2px dashed var(--card-border)', paddingBottom: '15px' }}>💌 來自天父的回應</h3>
                    <div style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontWeight:'500' }}>{letterData.text}</div>
                    <div style={{ background: '#FFF1F2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
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