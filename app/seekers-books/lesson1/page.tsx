'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DoesGodExistOriginal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [letterData, setLetterData] = useState<any>(null);

  // 滾動漸顯動畫 Hook
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
    <div className="custom-theme-wrapper relative overflow-hidden">
      
      {/* 宇宙氛圍的背景光暈 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vh] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-theme-wrapper {
            --bg-color: #0B0F19; /* 星空深藍 */
            --text-main: #E2E8F0; /* 亮灰白 */
            --text-light: #94A3B8; /* 偏暗的鐵灰 */
            --accent-primary: #8B5CF6; /* 星雲紫 */
            --accent-secondary: #EC4899; /* 晨曦粉 */
            --accent-tertiary: #06B6D4; /* 極光青 */
            --card-bg: rgba(30, 41, 59, 0.6); /* 玻璃擬物背景 */
            --card-border: rgba(255, 255, 255, 0.08);
            --modal-bg: rgba(11, 15, 25, 0.85);
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

        /* 標題與字體設定 */
        .custom-theme-wrapper h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(to right, var(--accent-tertiary), var(--accent-primary)); -webkit-background-clip: text; color: transparent; margin-bottom: 15px; letter-spacing: 2px; text-align: center; line-height: 1.2;}
        .custom-theme-wrapper h2 { font-size: 2rem; font-weight: 700; margin-bottom: 25px; color: #FFF; border-bottom: 2px solid var(--accent-primary); padding-bottom: 10px; display: inline-block;}
        .custom-theme-wrapper h3 { font-size: 1.5rem; font-weight: 600; margin-top: 35px; margin-bottom: 15px; color: var(--accent-tertiary); text-align: left; width: 100%; display: flex; align-items: center; gap: 8px;}
        .custom-theme-wrapper p { font-size: 1.15rem; color: var(--text-main); font-weight: 400; margin-bottom: 15px; text-align: left;}

        /* 列表樣式 */
        .equip-list { list-style: none; padding: 0; margin: 0 0 20px 0; text-align: left; width: 100%; }
        .equip-list li { font-size: 1.1rem; color: var(--text-main); margin-bottom: 16px; position: relative; padding-left: 25px; line-height: 1.6; background: var(--card-bg); border: 1px solid var(--card-border); padding: 15px 20px 15px 40px; border-radius: 12px; backdrop-filter: blur(10px);}
        .equip-list li::before { content: "✦"; position: absolute; left: 15px; color: var(--accent-tertiary); font-size: 1.2rem; top: 15px; }
        .counter-example { font-size: 0.95rem; color: var(--accent-secondary); font-style: italic; display: block; margin-top: 6px; opacity: 0.9;}

        /* 重點與問題卡片 */
        .highlight-box { background: linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05)); border-left: 4px solid var(--accent-primary); padding: 25px; margin: 25px 0; text-align: left; border-radius: 0 12px 12px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; border-right: 1px solid var(--card-border); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border);}
        .question-card { background: rgba(236, 72, 153, 0.05); border: 1px solid rgba(236, 72, 153, 0.2); border-left: 4px solid var(--accent-secondary); padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: left; width: 100%; backdrop-filter: blur(5px);}
        .question-card .q-label { font-weight: 700; color: var(--accent-secondary); font-size: 1.15rem; margin-bottom: 8px; display: block; letter-spacing: 1px;}
        .question-card .q-text { font-size: 1.2rem; color: #FFF; font-weight: 600; line-height: 1.6; }
        .question-card .q-hint { font-size: 0.95rem; color: var(--text-light); margin-top: 10px; display: block; }

        /* 🌟 新增：現代感信念推演圖像模塊 */
        .belief-chain { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 15px; margin: 35px 0; width: 100%;}
        .belief-node { background: var(--card-bg); border: 1px solid var(--accent-tertiary); padding: 15px 30px; border-radius: 12px; font-weight: 700; font-size: 1.2rem; color: #FFF; box-shadow: 0 0 15px rgba(6, 182, 212, 0.15); backdrop-filter: blur(10px); position: relative; overflow: hidden;}
        .belief-node::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); transform: skewX(-20deg); animation: shine 3s infinite;}
        .belief-node.final { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: none; box-shadow: 0 0 25px rgba(236, 72, 153, 0.3); }
        .belief-arrow { color: var(--text-light); font-size: 1.5rem; animation: pulseArrow 2s infinite;}
        
        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
        @keyframes pulseArrow { 0%, 100% { transform: translateX(0); color: var(--text-light); } 50% { transform: translateX(5px); color: var(--accent-tertiary); } }

        /* 現代感支票 (I AM WHO I AM) */
        .css-check { width: 100%; max-width: 450px; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); border: 1px solid var(--accent-tertiary); border-radius: 16px; padding: 35px; margin: 10px auto 40px auto; position: relative; box-shadow: 0 15px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(6, 182, 212, 0.1); text-align: left; backdrop-filter: blur(10px);}
        .css-check::before { content: 'HEAVENLY BANK'; position: absolute; top: 15px; right: 20px; font-size: 0.7rem; letter-spacing: 2px; color: var(--text-light); opacity: 0.6;}
        .css-check .amount { font-size: 1.8rem; font-weight: 800; color: #FFF; margin-bottom: 35px; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,255,255,0.2);}
        .css-check .line { border-bottom: 1px dashed rgba(255,255,255,0.2); margin-bottom: 20px; }
        .css-check .signature-area { display: flex; align-items: center; justify-content: flex-start; gap: 20px; }
        .css-check .sign-label { color: var(--text-light); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;}
        .css-check .signature { font-family: 'Playfair Display', serif; font-size: 2.8rem; color: var(--accent-tertiary); font-style: italic; line-height: 1; text-shadow: 0 0 15px rgba(6, 182, 212, 0.4);}

        /* 圖形容器 */
        .graphic-container { width: 100%; height: 220px; display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 40px;}
        .graphic-container svg { width: 100%; height: 100%; max-width: 450px; overflow: visible; filter: drop-shadow(0 0 10px rgba(255,255,255,0.05));}
        .svg-text { font-family: 'Noto Sans TC', sans-serif; font-size: 15px; font-weight: 600; fill: var(--text-main); text-anchor: middle; letter-spacing: 1px;}

        /* 動畫 */
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        /* 按鈕 */
        .custom-btn { display: inline-block; margin-top: 40px; padding: 16px 45px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; border: none; border-radius: 30px; font-weight: 700; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); cursor: pointer; font-size: 1.15rem; text-transform: uppercase;}
        .custom-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(236, 72, 153, 0.5); }
        .custom-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* 向下滾動提示 */
        .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; opacity: 0.6; animation: bounce 2.5s infinite; }
        .scroll-indicator span { font-size: 0.75rem; letter-spacing: 3px; margin-bottom: 10px; color: var(--text-light); text-transform: uppercase;}
        .scroll-indicator .line { width: 1px; height: 50px; background: linear-gradient(to bottom, var(--accent-tertiary), transparent); }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-12px) translateX(-50%); } 60% { transform: translateY(-6px) translateX(-50%); } }

        /* Modal 視窗 */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--modal-bg); backdrop-filter: blur(12px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-card { background: rgba(15, 23, 42, 0.95); border: 1px solid var(--card-border); width: 90%; max-width: 600px; border-radius: 20px; padding: 45px 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); position: relative; transform: translateY(20px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 90vh; overflow-y: auto; }
        .modal-overlay.active .modal-card { transform: translateY(0) scale(1); }
        .close-btn { position: absolute; top: 20px; right: 25px; background: none; border: none; font-size: 2rem; color: var(--text-light); cursor: pointer; transition: color 0.2s; }
        .close-btn:hover { color: #FFF; }
        
        .modal-textarea { width: 100%; height: 180px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; resize: none; font-family: inherit; font-size: 1.05rem; color: #FFF; background: rgba(0,0,0,0.2); margin-bottom: 25px; transition: all 0.3s; line-height: 1.6; }
        .modal-textarea:focus { outline: none; border-color: var(--accent-tertiary); box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2); background: rgba(0,0,0,0.4);}
        
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-secondary); border-radius: 50%; margin: 0 auto 30px auto; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .custom-theme-wrapper h1 { font-size: 2.2rem; } .custom-theme-wrapper h2 { font-size: 1.6rem; } .custom-theme-wrapper p, .equip-list li { font-size: 1.05rem; }
            .graphic-container { height: 180px; } .modal-card { padding: 35px 25px; width: 95%;} .belief-node { padding: 12px 20px; font-size: 1.1rem;}
        }
      `}} />

      {/* 導覽列 */}
      <nav className="custom-nav">
        <Link href="/seekers-books" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/10">
          <ArrowLeft className="w-4 h-4" /> 返回慕道裝備
        </Link>
      </nav>

      {/* 0. 封面區塊 */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content" style={{ textAlign: 'center' }}>
                <p style={{ textAlign: 'center', color: 'var(--accent-tertiary)', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.9rem' }}>EXPLORE THE TRUTH</p>
                <h1>到底有沒有神？</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '20px' }}>這是一場關於真理、邏輯與關係的探索之旅。</p>
            </div>
            
            {/* 探索宇宙的羅盤 SVG (配色更新為賽博龐克感) */}
            <div className="graphic-container">
                <svg viewBox="0 0 400 250">
                    <circle cx="200" cy="125" r="90" fill="none" stroke="var(--accent-tertiary)" strokeWidth="2" opacity="0.3" strokeDasharray="4 6"/>
                    <circle cx="200" cy="125" r="60" fill="none" stroke="var(--accent-primary)" strokeWidth="3" opacity="0.8"/>
                    <circle cx="200" cy="125" r="8" fill="var(--accent-secondary)" />
                    <polygon points="200,35 215,110 200,125 185,110" fill="url(#grad1)" opacity="0.9"/>
                    <polygon points="200,215 215,140 200,125 185,140" fill="var(--card-bg)" stroke="var(--accent-tertiary)" strokeWidth="1" opacity="0.6"/>
                    <line x1="110" y1="125" x2="290" y2="125" stroke="var(--accent-tertiary)" strokeWidth="1" opacity="0.4"/>
                    <line x1="200" y1="35" x2="200" y2="215" stroke="var(--accent-tertiary)" strokeWidth="1" opacity="0.4"/>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:'var(--accent-tertiary)', stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'var(--accent-primary)', stopOpacity:1}} />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
        <div className="scroll-indicator"><span>開始探索</span><div className="line"></div></div>
      </section>

      {/* 1. 神存在嗎？ (移除了開頭的重複 SVG) */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="text-content">
                <h2>一、神存在嗎？</h2>
                
                <div className="question-card">
                    <span className="q-label">Q1. 思考一下：</span>
                    <span className="q-text">你相信有神嗎？覺得是一神還是多神呢？</span>
                </div>
                
                <h3>✦ 一神(真神) or 多神(假神)？</h3>
                <p>若有神，我們必須辨別真神的卓越性。真神必須具備以下條件：</p>
                <ul className="equip-list">
                    <li><strong>超自然的、無限的：</strong>神不能有多位，否則就是有限的。 <span className="counter-example">(反例：媽祖、文昌帝君等各有轄區)</span></li>
                    <li><strong>擁有完美的良善與良知：</strong> <span className="counter-example">(反例：充滿情慾與嫉妒的希臘眾神)</span></li>
                    <li><strong>全知全能，沒有範圍：</strong> <span className="counter-example">(反例：有地域限制的埃及眾神)</span></li>
                    <li><strong>能夠創造：</strong>神是造物主，人是受造者。 <span className="counter-example">(反例：關公是受造的人)</span></li>
                </ul>

                {/* 🌟 現代感圖像模塊：取代原本文字的「信念重要性」 */}
                <h3>✦ 為什麼有信仰這麼重要？</h3>
                <p>在探討神是否存在之前，我們必須了解信念的力量。掌控人生關鍵的不是基因，而是我們的<strong>「信念」</strong>。你相信什麼，將直接決定你的未來：</p>
                
                <div className="belief-chain">
                    <div className="belief-node">信念</div>
                    <div className="belief-arrow">➔</div>
                    <div className="belief-node">思想</div>
                    <div className="belief-arrow">➔</div>
                    <div className="belief-node">行為</div>
                    <div className="belief-arrow">➔</div>
                    <div className="belief-node final">人生</div>
                </div>

                <div className="highlight-box">
                    <strong>神是無法被完全定義的：</strong>因為人的有限，無法測度神的主權，因此我們需要神親自的<strong>『天啟』</strong>。<br/><br/>
                    <strong>神也必須被定義：</strong>這樣人方能認識祂。如何定義？答案就在<strong>『聖經』</strong>。
                </div>
            </div>
        </div>
      </section>

      {/* 2. 如何證明神存在？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            <div className="graphic-container">
                {/* 重新配色的 2D/3D 示意圖 */}
                <svg viewBox="0 0 400 220">
                    <polygon points="80,160 180,160 150,190 50,190" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeDasharray="4 4"/>
                    <text x="110" y="210" className="svg-text" fill="var(--text-light)">二度空間</text>
                    
                    <rect x="230" y="60" width="80" height="80" fill="var(--card-bg)" stroke="var(--accent-primary)" strokeWidth="2" opacity="0.9"/>
                    <polygon points="230,60 260,30 340,30 310,60" fill="var(--accent-primary)" opacity="0.4"/>
                    <polygon points="310,60 340,30 340,110 310,140" fill="var(--accent-primary)" opacity="0.7"/>
                    <text x="285" y="170" className="svg-text" fill="var(--accent-tertiary)" fontWeight="700">三度空間</text>

                    <line x1="160" y1="160" x2="230" y2="120" stroke="var(--accent-secondary)" strokeWidth="3" markerEnd="url(#arrow-pink)"/>
                    <text x="195" y="130" className="svg-text" fontSize="12" fill="var(--accent-secondary)">無法完全測透</text>
                    <defs>
                        <marker id="arrow-pink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-secondary)" />
                        </marker>
                    </defs>
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
                <div className="highlight-box" style={{ background: 'var(--card-bg)', borderLeftColor: 'var(--accent-tertiary)' }}>
                    <span style={{color: 'var(--accent-tertiary)', fontWeight: 'bold'}}>更何況—神主動顯現，祂已顯現！</span><br/>
                    <strong>❹ 聖經的啟示：</strong>這是神親自對人類的說話與啟示。
                </div>
            </div>
        </div>
      </section>

      {/* 3. 祂是誰？祂作了什麼？ */}
      <section className="custom-section">
        <div className="custom-container fade-up">
            
            {/* 深色科技感支票 */}
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
                <p>要認識一個人，必須透過他的言論與著作。就像要認識國父，就要由他的著作、言談、見證人來認識。聖經正是神親自的啟示。</p>

                <h3>✦ 由神的名字來看祂的性情與作為</h3>
                <p>神的名字證明祂的存在（出三：13-15）。祂的名字是：</p>
                <ul className="equip-list">
                    <li><strong>我是 (I am)：</strong>一『位』的意思是祂有情感、意志、理性、行動，代表絕對的存在。</li>
                    <li><strong>我是，即我是 (I am who I am)：</strong>這就像是一張 <strong>簽好名的空白支票 (Signed check)</strong>，讓我們以信心來兌現！</li>
                </ul>
                
                <div className="highlight-box" style={{borderColor: 'var(--accent-secondary)'}}>
                    <p style={{ marginBottom: '10px', color: 'var(--accent-secondary)', fontWeight: '700' }}>這張支票可以兌現出什麼？</p>
                    <ul style={{ listStyle: 'none', paddingLeft: '0', color: '#FFF', fontWeight: '500', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <li style={{background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px'}}>❶ 神是<strong>供應者</strong> <span style={{color: 'var(--text-light)', fontSize: '0.85rem', display:'block'}}>(耶和華以勒)</span></li>
                        <li style={{background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px'}}>❷ 神是<strong>醫治者</strong> <span style={{color: 'var(--text-light)', fontSize: '0.85rem', display:'block'}}>(耶和華拉法)</span></li>
                        <li style={{background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px'}}>❸ 神是<strong>賜平安的神</strong> <span style={{color: 'var(--text-light)', fontSize: '0.85rem', display:'block'}}>(耶和華沙龍)</span></li>
                        <li style={{background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px'}}>❹ 神是<strong>得勝者</strong> <span style={{color: 'var(--text-light)', fontSize: '0.85rem', display:'block'}}>(耶和華尼西)</span></li>
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
                    <path d="M 50 180 Q 200 80, 350 180" fill="none" stroke="var(--accent-secondary)" strokeWidth="4" strokeDasharray="8 6" opacity="0.8"/>
                    <line x1="200" y1="50" x2="200" y2="150" stroke="var(--accent-primary)" strokeWidth="8"/>
                    <line x1="160" y1="90" x2="240" y2="90" stroke="var(--accent-primary)" strokeWidth="8"/>
                    
                    <rect x="300" y="100" width="60" height="80" fill="var(--card-bg)" stroke="var(--accent-tertiary)" strokeWidth="2" rx="4"/>
                    <circle cx="315" cy="140" r="4" fill="var(--accent-tertiary)"/>
                    <text x="200" y="210" className="svg-text" fill="#FFF" fontWeight="700">透過耶穌 • 打開心門</text>
                </svg>
            </div>
            <div className="text-content">
                <h2>三、如何認識祂？</h2>
                <p>想要認識神，不能只靠頭腦的知識，<strong>要有關係！而且勿用錯器官！</strong></p>
                
                <ul className="equip-list">
                    <li><strong>透過耶穌：</strong>祂是救恩的源頭（約 3:16），也是解決我們罪的中保（約壹 2:1-3），為我們搭建了通往天父的橋樑。</li>
                    <li><strong>透過信心：</strong>
                        <br/><span style={{color: 'var(--accent-tertiary)', fontWeight: 'bold'}}>❶ 打開心門：</span>接待祂成為你生命的主（約 1:12）。
                        <br/><span style={{color: 'var(--accent-tertiary)', fontWeight: 'bold'}}>❷ 開口禱告：</span>向祂說話，因為求就必得著（約 16:24）。
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
                <p style={{color: 'var(--accent-tertiary)', fontWeight: '700', marginTop: '20px'}}>請完成你的讀後心得與禱告，並看看天父要對你說什麼。</p>
                
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
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#FFF', fontWeight: '800' }}>裝備課回應卡</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6' }}>1. 讀後心得：你覺得有神嗎？為什麼？(200字內)<br/>2. 你最渴慕經歷神的哪一個名字？請為此寫下一段禱告。</p>
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
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--accent-tertiary)', fontWeight: '600', letterSpacing: '1px' }}>正在接收你的回應，並為你開啟天父的信...</p>
                </div>
            )}

            {modalState === 'letter' && letterData && (
                <div style={{ textAlign: 'left' }}>
                    <img src={letterData.image} alt="插畫" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-secondary)', marginBottom: '15px', fontWeight: '700', textAlign: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '15px' }}>💌 來自天父的回應</h3>
                    <div style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#FFF' }}>{letterData.text}</div>
                    <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
                        <p style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', color: 'var(--accent-tertiary)' }}>{letterData.verse}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'right', margin: '0' }}>{letterData.ref}</p>
                    </div>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}