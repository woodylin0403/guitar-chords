'use client';
import React, { useState, useEffect } from 'react'; // 🌟 移除了沒用到的 useRef
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
// 🌟 移除了 Head 的引入

export default function DoesGodExistOriginal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  // 滾動漸顯動畫 Hook
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);
    
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  // 知性、晨曦、星空風格圖庫
  const illustrationImages = [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505506874110-6a7a48e50cb5?auto=format&fit=crop&w=600&q=80"
  ];

  // 天父的回信資料庫
  const heavenlyLetters = [
      { keywords: ['懷疑', '真的有神嗎', '看不見', '不確定', '疑問', '證據'], text: "親愛的孩子，我看到你心中帶著疑問和渴望來尋找我。懷疑並不可怕，它是通往真理的必經之路。\n\n當你抬頭看見浩瀚的星空，或感受內心深處的良知時，那就是我在對你說話。雖然你的肉眼看不見我，但我邀請你用『心』來經歷我。只要你願意敞開那扇心門，我一定會向你顯現，讓你知道我真實存在。", verse: "「你們尋求我，若專心尋求我，就必尋見。」", ref: "— 耶利米書 29:13" },
      { keywords: ['科學', '進化論', '宇宙', '證明', '邏輯', '大自然', '星空'], text: "親愛的孩子，你擁有理性的頭腦，這正是我賜給你的禮物。\n\n當你讚嘆宇宙的浩瀚與生命的精密時，你其實正在閱讀我寫的兩本書：一本是大自然，另一本是聖經。我超越了二度空間的邏輯，我是創造這一切的三維度之主。繼續保持你的好奇心，在真理中，你會發現科學與信仰最終都指向我的榮耀。", verse: "「諸天述說神的榮耀；穹蒼傳揚他的手段。」", ref: "— 詩篇 19:1" },
      { keywords: ['宗教', '比較', '其他神', '媽祖', '偶像', '都一樣'], text: "親愛的孩子，你在眾多信仰中尋找唯一的真理，我欣賞你的認真。\n\n世上有許多受造物被當作神來敬拜，但我與他們不同。我是創造宇宙萬有的主宰，我是那位『I AM』。我不僅擁有無限的權能，我更有一顆願意為你上十字架的愛心。認識我不是加入一個宗教，而是回到創造你的阿爸父身邊。", verse: "「除他以外，別無拯救；因為在天下人間，沒有賜下別的名，我們可以靠著得救。」", ref: "— 使徒行傳 4:12" },
      { keywords: ['我覺得有神', '相信有神', '創造', '奇妙', '感動', '經歷過'], text: "親愛的孩子，看見你在生活中察覺到我的存在，我感到非常喜悅！\n\n是的，我一直都在你身邊，透過萬物、透過平安、透過愛向你啟示我自己。你已經跨出了信心的第一步，接下來，我渴望帶你進入更深的關係裡。繼續透過禱告和我說話，我會讓你經歷更多超乎想像的奇妙作為。", verse: "「自從造天地以來，神的永能和神性是明明可知的，雖是眼不能見，但藉著所造之物就可以曉得，叫人無可推諉。」", ref: "— 羅馬書 1:20" },
      { keywords: ['以勒', '供應', '錢', '缺乏', '工作', '學費', '經濟', '需要', '不夠', '找工作', '房租'], text: "親愛的孩子，我聽到你呼求『耶和華以勒』。我看見了你在經濟與生活上的缺乏與重擔。\n\n我是為你預備一切的神。這張空白支票，我已經簽好名了。先求我的國和我的義，把你現在的憂慮交給我。在看似沒有道路的山上，我必為你預備豐盛的恩典，供應你一切所需用的。", verse: "「我的神必照他榮耀的豐富，在基督耶穌裡，使你們一切所需用的都充足。」", ref: "— 腓立比書 4:19" },
      { keywords: ['拉法', '醫治', '生病', '痛', '受傷', '醫院', '恢復', '健康', '心碎', '憂鬱'], text: "親愛的孩子，你呼求了『耶和華拉法』。我看到你身體或心靈正承受著巨大的痛苦。\n\n我是醫治你的神。耶穌在十字架上所受的鞭傷，已經為你買贖了醫治的恩典。讓我大能的手按在你疼痛的地方，無論是肉體的疾病還是心裡的創傷，我都要親自為你包紮、使你痊癒。", verse: "「他醫治傷心的人，裹好他們的傷處。」", ref: "— 詩篇 147:3" },
      { keywords: ['沙龍', '平安', '害怕', '焦慮', '擔心', '睡不著', '緊張', '恐懼', '壓力'], text: "親愛的孩子，你呼求『耶和華沙龍』。我看見風暴正在你的周圍肆虐，讓你的心無法平靜。\n\n我是賜平安的神。我所賜的平安，不像世人所賜的，它能超越一切環境的動盪。現在，深深吸一口氣，把重擔交給我。我會保守你的心懷意念，讓你在狂風暴雨中依然能安穩入睡。", verse: "「我留下平安給你們；我將我的平安賜給你們。你們心裡不要憂愁，也不要膽怯。」", ref: "— 約翰福音 14:27" },
      { keywords: ['尼西', '得勝', '輸', '挫折', '考試', '比賽', '挑戰', '打仗', '敵人', '誘惑'], text: "親愛的孩子，你正面臨一場艱難的戰役，你呼求了『耶和華尼西』——你的得勝旌旗！\n\n不要看敵人的強大，不要看自己的軟弱。這場爭戰的勝敗不在乎你，乃在乎我。我已經在十字架上宣告了最終的得勝！舉起你的雙手讚美我，我會親自為你爭戰，帶領你跨越這個巨大的挑戰。", verse: "「然而，靠著愛我們的主，在這一切的事上已經得勝有餘了。」", ref: "— 羅馬書 8:37" }
  ];

  const fallbackLetter = { 
    text: "親愛的小孩，很高興你能藉著這堂課來到我面前，向我敞開心房。\n\n無論你今天心得寫了什麼、心裡正在經歷什麼挑戰，請記住，我是一位『I AM』的真神。我聽見了你的呼求。這張名為恩典的空白支票已經為你簽好，帶著盼望去經歷我吧！我的供應、醫治、平安與得勝，必會一生一世隨著你。", 
    verse: "「你們尋求我，若專心尋求我，就必尋見。」", 
    ref: "— 耶利米書 29:13" 
  };

  const submitPrayer = () => {
    if(prayerText.trim() === '') return;
    setModalState('loading');

    setTimeout(() => {
        let highestScore = 0;
        let candidateLetters: typeof heavenlyLetters = [];

        heavenlyLetters.forEach(letter => {
            let score = 0;
            letter.keywords.forEach(kw => {
                if (prayerText.includes(kw)) score++;
            });
            if (score > highestScore) {
                highestScore = score;
                candidateLetters = [letter];
            } else if (score === highestScore && score > 0) {
                candidateLetters.push(letter);
            }
        });

        let selectedLetter = highestScore === 0 
          ? fallbackLetter 
          : candidateLetters[Math.floor(Math.random() * candidateLetters.length)];

        setLetterData({
          ...selectedLetter,
          image: illustrationImages[Math.floor(Math.random() * illustrationImages.length)]
        });
        setModalState('letter');
    }, 1800);
  };

  const openModal = () => {
    setModalState('input');
    setPrayerText('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="custom-theme-wrapper">
      {/* 🌟 移除了 <Head> 區塊 */}

      {/* 將原本的 CSS 寫入這裡，確保只影響這個元件 */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #F8F9FA;
            --text-main: #2C3E50;
            --text-light: #7F8C8D;
            --accent-gold: #D4AF37;
            --accent-blue: #34495E;
            --accent-red: #E67E22;
            --modal-bg: rgba(44, 62, 80, 0.8);
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Noto Sans TC', sans-serif;
            line-height: 1.8;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .custom-nav {
            padding: 20px 30px;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 50;
        }

        .custom-section {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 80px 20px;
            position: relative;
        }

        .custom-container {
            max-width: 850px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .text-content { text-align: center; margin-bottom: 50px; max-width: 700px; z-index: 2; }

        .custom-theme-wrapper h1 { font-size: 2.8rem; font-weight: 700; color: var(--accent-blue); margin-bottom: 15px; letter-spacing: 2px; text-align: center;}
        .custom-theme-wrapper h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 20px; color: var(--accent-blue); border-bottom: 2px solid var(--accent-gold); padding-bottom: 10px; display: inline-block;}
        .custom-theme-wrapper h3 { font-size: 1.4rem; font-weight: 600; margin-top: 25px; margin-bottom: 15px; color: var(--accent-blue); text-align: left; width: 100%;}
        .custom-theme-wrapper p { font-size: 1.15rem; color: var(--text-main); font-weight: 400; margin-bottom: 15px; text-align: left;}

        .equip-list { list-style: none; padding: 0; margin: 0 0 20px 0; text-align: left; width: 100%; }
        .equip-list li { font-size: 1.15rem; color: var(--text-main); margin-bottom: 12px; position: relative; padding-left: 25px; line-height: 1.6; }
        .equip-list li::before { content: "✦"; position: absolute; left: 0; color: var(--accent-gold); font-size: 1.2rem; top: 2px; }
        .counter-example { font-size: 0.95rem; color: var(--text-light); font-style: italic; display: block; margin-top: 4px; }

        .highlight-box { background-color: white; border-left: 5px solid var(--accent-gold); padding: 20px 25px; margin: 20px 0; text-align: left; border-radius: 0 8px 8px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); width: 100%; }
        .question-card { background-color: #F1F4F6; border-left: 5px solid var(--accent-red); padding: 20px 25px; border-radius: 8px; margin-bottom: 25px; text-align: left; width: 100%; }
        .question-card .q-label { font-weight: 700; color: var(--accent-red); font-size: 1.15rem; margin-bottom: 5px; display: block; }
        .question-card .q-text { font-size: 1.15rem; color: var(--accent-blue); font-weight: 600; line-height: 1.6; }
        .question-card .q-hint { font-size: 0.95rem; color: var(--text-light); margin-top: 8px; display: block; }

        .css-check { width: 100%; max-width: 400px; background: #FFF; border: 3px solid var(--accent-gold); border-radius: 10px; padding: 30px; margin: 10px auto 35px auto; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: left; }
        .css-check .amount { font-size: 1.6rem; font-weight: 700; color: var(--accent-blue); margin-bottom: 30px; letter-spacing: 1px; }
        .css-check .line { border-bottom: 1px dashed var(--text-light); margin-bottom: 15px; }
        .css-check .signature-area { display: flex; align-items: center; justify-content: flex-start; gap: 15px; }
        .css-check .sign-label { color: var(--text-light); font-size: 1rem; }
        .css-check .signature { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: var(--accent-gold); font-style: italic; line-height: 1; }

        .graphic-container { width: 100%; height: 220px; display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 30px;}
        .graphic-container svg { width: 100%; height: 100%; max-width: 450px; overflow: visible; }
        .svg-text { font-family: 'Noto Sans TC', sans-serif; font-size: 15px; font-weight: 500; fill: var(--text-main); text-anchor: middle; }

        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .custom-btn { display: inline-block; margin-top: 30px; padding: 14px 40px; background-color: var(--accent-gold); color: white; border: none; border-radius: 30px; font-weight: 500; letter-spacing: 1px; transition: all 0.3s ease; box-shadow: 0 6px 15px rgba(212, 175, 55, 0.3); cursor: pointer; font-size: 1.1rem; }
        .custom-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5); background-color: #B8972E; }

        .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; opacity: 0.5; animation: bounce 2s infinite; }
        .scroll-indicator span { font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 8px; color: var(--accent-blue); }
        .scroll-indicator .line { width: 1px; height: 40px; background-color: var(--accent-blue); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-10px) translateX(-50%); } 60% { transform: translateY(-5px) translateX(-50%); } }

        /* Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--modal-bg); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-card { background-color: #FFF; width: 90%; max-width: 600px; border-radius: 12px; padding: 40px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); position: relative; transform: translateY(20px); transition: transform 0.4s ease; max-height: 90vh; overflow-y: auto; }
        .modal-overlay.active .modal-card { transform: translateY(0); }
        .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 1.8rem; color: var(--text-light); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: var(--text-main); }
        .modal-textarea { width: 100%; height: 180px; padding: 18px; border: 1px solid #BDC3C7; border-radius: 8px; resize: none; font-family: inherit; font-size: 1.05rem; color: var(--text-main); background-color: #FAFAFA; margin-bottom: 20px; transition: all 0.3s; line-height: 1.6; }
        .modal-textarea:focus { outline: none; border-color: var(--accent-gold); background-color: #FFF; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1); }
        
        .spinner { width: 45px; height: 45px; border: 4px solid rgba(212, 175, 55, 0.2); border-top: 4px solid var(--accent-gold); border-radius: 50%; margin: 0 auto 25px auto; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .custom-theme-wrapper h1 { font-size: 2.2rem; } .custom-theme-wrapper h2 { font-size: 1.5rem; } .custom-theme-wrapper p, .equip-list li { font-size: 1.05rem; }
            .graphic-container { height: 180px; } .modal-card { padding: 30px 20px; width: 95%;}
        }
      `}} />

      <nav className="custom-nav">
        <Link href="/seekers-books" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-gold)] transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <ArrowLeft className="w-4 h-4" /> 返回慕道裝備
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content" style={{ textAlign: 'center' }}>
                <h1>到底有沒有神？</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>這是一場關於真理、邏輯與關係的探索之旅。</p>
            </div>
            
            {/* 探索宇宙的羅盤 SVG */}
            <div className="graphic-container">
                <svg viewBox="0 0 400 250">
                    <circle cx="200" cy="125" r="90" fill="none" stroke="var(--accent-blue)" strokeWidth="2" opacity="0.2" strokeDasharray="5 5"/>
                    <circle cx="200" cy="125" r="60" fill="none" stroke="var(--accent-gold)" strokeWidth="3" />
                    <circle cx="200" cy="125" r="8" fill="var(--accent-blue)" />
                    <polygon points="200,35 215,110 200,125 185,110" fill="var(--accent-gold)" opacity="0.8"/>
                    <polygon points="200,215 215,140 200,125 185,140" fill="var(--accent-blue)" opacity="0.5"/>
                    <line x1="110" y1="125" x2="290" y2="125" stroke="var(--accent-blue)" strokeWidth="1" opacity="0.3"/>
                    <line x1="200" y1="35" x2="200" y2="215" stroke="var(--accent-blue)" strokeWidth="1" opacity="0.3"/>
                </svg>
            </div>
        </div>
        <div className="scroll-indicator"><span>開始探索</span><div className="line"></div></div>
      </section>

      {/* 1. 神存在嗎？ (先講一神/多神，再講信念) */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                <svg viewBox="0 0 400 220">
                    <rect x="50" y="90" width="60" height="40" rx="5" fill="var(--accent-blue)" opacity="0.1"/>
                    <text x="80" y="115" className="svg-text" fontWeight="700">信念</text>
                    <line x1="120" y1="110" x2="140" y2="110" stroke="var(--accent-gold)" strokeWidth="3" markerEnd="url(#arrow)"/>
                    
                    <rect x="145" y="90" width="60" height="40" rx="5" fill="var(--accent-blue)" opacity="0.3"/>
                    <text x="175" y="115" className="svg-text">思想</text>
                    <line x1="215" y1="110" x2="235" y2="110" stroke="var(--accent-gold)" strokeWidth="3" markerEnd="url(#arrow)"/>
                    
                    <rect x="240" y="90" width="60" height="40" rx="5" fill="var(--accent-blue)" opacity="0.6"/>
                    <text x="270" y="115" className="svg-text" fill="#FFF">行為</text>
                    <line x1="310" y1="110" x2="330" y2="110" stroke="var(--accent-gold)" strokeWidth="3" markerEnd="url(#arrow)"/>
                    
                    <rect x="335" y="80" width="60" height="60" rx="30" fill="var(--accent-gold)"/>
                    <text x="365" y="115" className="svg-text" fill="#FFF" fontWeight="700">人生</text>

                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-gold)" />
                        </marker>
                    </defs>
                </svg>
            </div>
            <div className="text-content">
                <h2>一、神存在嗎？</h2>
                
                <div className="question-card">
                    <span className="q-label">Q1. 思考一下：</span>
                    <span className="q-text">你相信有神嗎？覺得是一神還是多神呢？</span>
                </div>
                
                {/* 🌟 順序調換：先一神/多神 */}
                <h3>✦ 一神(真神) or 多神(假神)？</h3>
                <p>若有神，我們必須辨別真神的卓越性。真神必須具備以下條件：</p>
                <ul className="equip-list">
                    <li><strong>超自然的、無限的：</strong>神不能有多位，否則就是有限的。 <span className="counter-example">(反例：媽祖、文昌帝君等各有轄區)</span></li>
                    <li><strong>擁有完美的良善與良知：</strong> <span className="counter-example">(反例：充滿情慾與嫉妒的希臘眾神)</span></li>
                    <li><strong>全知全能，沒有範圍：</strong> <span className="counter-example">(反例：有地域限制的埃及眾神)</span></li>
                    <li><strong>能夠創造：</strong>神是造物主，人是受造者。 <span className="counter-example">(反例：關公是受造的人)</span></li>
                </ul>

                {/* 🌟 順序調換：後信念 */}
                <h3>✦ 為什麼有信仰這麼重要？</h3>
                <p>在探討神是否存在之前，我們必須了解信念的力量。掌控人生關鍵的不是基因，而是我們的<strong>「信念」</strong>。你相信什麼，決定了你的人生軌跡：</p>
                <div className="highlight-box" style={{ textAlign: 'center', fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
                    信念 ➔ 思想 ➔ 行為 ➔ 人生
                </div>

                <div className="highlight-box">
                    <strong>神是無法被完全定義的：</strong>因為人的有限，無法測度神的主權，因此我們需要神親自的<strong>『天啟』</strong>。<br/>
                    <strong>神也必須被定義：</strong>這樣人方能認識祂。如何定義？透過<strong>『聖經』</strong>。
                </div>
            </div>
        </div>
      </section>

      {/* 2. 如何證明神存在？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                <svg viewBox="0 0 400 220">
                    <polygon points="80,160 180,160 150,190 50,190" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeDasharray="4 4"/>
                    <text x="110" y="210" className="svg-text" fill="var(--text-light)">二度空間</text>
                    
                    <rect x="230" y="60" width="80" height="80" fill="var(--accent-blue)" opacity="0.8"/>
                    <polygon points="230,60 260,30 340,30 310,60" fill="var(--accent-blue)" opacity="0.6"/>
                    <polygon points="310,60 340,30 340,110 310,140" fill="var(--accent-blue)" opacity="0.9"/>
                    <text x="285" y="170" className="svg-text" fill="var(--accent-blue)" fontWeight="700">三度空間</text>

                    <line x1="160" y1="160" x2="230" y2="120" stroke="var(--accent-gold)" strokeWidth="3" markerEnd="url(#arrow)"/>
                    <text x="195" y="130" className="svg-text" fontSize="12" fill="var(--accent-red)">無法完全窺探</text>
                </svg>
            </div>
            <div className="text-content">
                <h2>如何證明神存在？</h2>

                <div className="question-card">
                    <span className="q-label">Q2. 思考一下：</span>
                    <span className="q-text">你覺得是「人找神」比較容易，還是「神找人」比較容易？</span>
                </div>

                <p>嚴格來說，要求人類去「證明」神存在是一個<strong>非法的問題</strong>。因為位階低的，不能決定或完全測透位階高的 <span className="counter-example">（例如：生活在二度空間的，無法完全認識三度空間的存在）</span>。</p>
                <p>這也是為什麼「神找人」（神主動啟示）遠比「人找神」容易。即或如此，以下四點皆已證明有神：</p>
                <ul className="equip-list">
                    <li><strong>❶ 宇宙萬有：</strong>萬物有序、人體構造、生命的創造（推翻進化論的隨機性）。</li>
                    <li><strong>❷ 人的宗教性：</strong>人類獨有的道德良心、求神的天性、報應觀念、渴求平安感。</li>
                    <li><strong>❸ 個人經驗：</strong>生活體驗、神蹟奇事（有鬼的存在，相對也證明有神）。</li>
                </ul>
                <div className="highlight-box" style={{ backgroundColor: 'var(--accent-blue)', color: 'white', borderColor: 'var(--accent-gold)' }}>
                    更何況—神主動顯現，祂已顯現！<br/>
                    <strong>❹ 聖經的啟示：</strong>這是神親自對人類的啟示。
                </div>
            </div>
        </div>
      </section>

      {/* 3. 祂是誰？祂作了什麼？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            
            {/* 完美對齊的 CSS Blank Check */}
            <div className="css-check">
                <div className="amount">I AM WHO I AM</div>
                <div className="line"></div>
                <div className="signature-area">
                    <span className="sign-label">Signed by:</span>
                    <span className="signature">Jehovah</span>
                </div>
            </div>

            <div className="text-content">
                <h2>二、祂是誰？ 祂作了什麼？</h2>

                <div className="question-card">
                    <span className="q-label">Q3. 思考一下：</span>
                    <span className="q-text">人要如何能夠認識神呢？</span>
                    <span className="q-hint">（Hint: 如果你要認識一個歷史人物或新朋友，你會怎麼做？）</span>
                </div>

                <h3>✦ 要由聖經來看</h3>
                <p>要認識一個人，必須透過他的言論與著作。就像要認識國父，就要由他的著作（三民主義）、言談、見證人（黨國元老、歷史課本）來認識。聖經正是神親自的啟示。</p>

                <h3>✦ 由神的名字來看祂的性情與作為</h3>
                <p>神的名字證明祂的存在（出三：13-15）。祂的名字是：</p>
                <ul className="equip-list">
                    <li><strong>我是 (I am)：</strong>一『位』的意思是祂有情感、意志、理性、行動，代表絕對的存在。</li>
                    <li><strong>我是，即我是 (I am who I am)：</strong>這就像是一張 <strong>Signed check（簽好名的空白支票）</strong>，讓我們以信心來兌現！</li>
                </ul>
                
                <div className="highlight-box">
                    <p style={{ marginBottom: '5px' }}>這張支票可以兌現出什麼？</p>
                    <ul style={{ listStyle: 'none', paddingLeft: '10px', color: 'var(--accent-blue)', fontWeight: '500' }}>
                        <li>❶ 耶和華以勒：神是<strong>供應者</strong></li>
                        <li>❷ 耶和華拉法：神是<strong>醫治者</strong></li>
                        <li>❸ 耶和華沙龍：神是<strong>賜平安的神</strong></li>
                        <li>❹ 耶和華尼西：神是<strong>得勝者</strong></li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* 4. 如何認識祂？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                <svg viewBox="0 0 400 220">
                    <path d="M 50 180 Q 200 80, 350 180" fill="none" stroke="var(--accent-red)" strokeWidth="6"/>
                    <line x1="200" y1="50" x2="200" y2="150" stroke="var(--accent-red)" strokeWidth="6"/>
                    <line x1="160" y1="90" x2="240" y2="90" stroke="var(--accent-red)" strokeWidth="6"/>
                    
                    <rect x="300" y="100" width="60" height="80" fill="none" stroke="var(--accent-gold)" strokeWidth="3"/>
                    <circle cx="315" cy="140" r="3" fill="var(--accent-gold)"/>
                    <text x="200" y="210" className="svg-text" fill="var(--text-main)">透過耶穌 • 打開心門</text>
                </svg>
            </div>
            <div className="text-content">
                <h2>三、如何認識祂？</h2>
                <p>想要認識神，不能只靠頭腦的知識，<strong>要有關係！而且勿用錯器官！</strong></p>
                
                <ul className="equip-list">
                    <li><strong>透過耶穌：</strong>祂是救恩的源頭（約三：16），也是解決我們罪的中保（約壹二：1-3），為我們搭建了通往天父的橋樑。</li>
                    <li><strong>透過信心：</strong>
                        <br/>❶ <strong>打開心門：</strong>接待祂成為你生命的主（約一：12）。
                        <br/>❷ <strong>開口禱告：</strong>向祂說話，因為求就必得著（約十六：24）。
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* 5. 課後作業與回應 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>四、你的回應與作業</h2>
                <p>神如此好（充滿權能與愛），你最渴慕（需要）經驗神的哪一部份？<br/>是供應？醫治？平安？還是得勝？</p>
                <p><strong>請完成你的讀後心得與禱告，並看看天父要對你說什麼。</strong></p>
                
                <button className="custom-btn" onClick={openModal}>寫下我的心得與禱告</button>
            </div>
        </div>
      </section>

      {/* 互動彈出視窗 (Modal) */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            
            {modalState === 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: 'var(--accent-blue)', textAlign: 'center' }}>裝備課回應卡</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '20px', lineHeight: '1.6' }}>1. 讀後心得：你覺得有神嗎？為什麼？(200字內)<br/>2. 你最渴慕經歷神的哪一個名字？請為此寫下一段禱告。</p>
                    <textarea 
                        className="modal-textarea"
                        value={prayerText} 
                        onChange={(e) => setPrayerText(e.target.value)} 
                        placeholder="我覺得有神，因為...&#10;天父，我現在最需要經歷祢是『耶和華...』"
                    />
                    <button className="custom-btn" style={{ width: '100%', marginTop: '0' }} onClick={submitPrayer} disabled={!prayerText.trim()}>送出作業與禱告</button>
                </div>
            )}

            {modalState === 'loading' && (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--text-light)' }}>正在接收你的回應，並為你開啟天父的信...</p>
                </div>
            )}

            {modalState === 'letter' && letterData && (
                <div style={{ textAlign: 'left' }}>
                    <img src={letterData.image} alt="插畫" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '25px' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-blue)', marginBottom: '15px', fontWeight: '600', textAlign: 'center', borderBottom: '1px solid #EEE', paddingBottom: '15px' }}>💌 來自天父的回應</h3>
                    <div style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{letterData.text}</div>
                    <div style={{ backgroundColor: '#F8F9FA', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)' }}>
                        <p style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '8px', color: 'var(--accent-blue)' }}>{letterData.verse}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'right', margin: '0' }}>{letterData.ref}</p>
                    </div>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}