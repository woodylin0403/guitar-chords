'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BIBLE_QUESTIONS } from './questionsData'; // 🌟 引入你的大題庫

// 🌟 角色設定 (維持舊版連結，或者你可以改成上一步生成的角色圖)
const CHARACTERS = [
  { id: 'david', name: '大衛', title: '巨人殺手', desc: '對抗「困難」時，傷害 x 1.5', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/david.png' },
  { id: 'solomon', name: '所羅門', title: '智慧之王', desc: '任何題目答對，傷害 x 1.2', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/%E6%89%80%E7%BE%85%E9%96%80.png' },
  { id: 'peter', name: '彼得', title: '磐石爆發', desc: '對抗「簡單」時，傷害 x 1.5', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/peter.png' },
  { id: 'moses', name: '摩西', title: '逆境分海', desc: '己方血量較低時，傷害 x 1.5', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/mose.png' },
  { id: 'paul', name: '保羅', title: '外邦使徒', desc: '歷史/猜人物題，傷害 x 1.2', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/paul.png' }
];

const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const calculateDamage = (charId: string | null, myHp: number, enemyHp: number, question: any, combo: number) => {
  let baseDmg = question.difficulty === '簡單' ? 100 : question.difficulty === '中等' ? 150 : 200;
  let skillTriggered = false;

  if (charId === 'david' && question.difficulty === '困難') { baseDmg *= 1.5; skillTriggered = true; }
  if (charId === 'solomon') { baseDmg *= 1.2; skillTriggered = true; }
  if (charId === 'peter' && question.difficulty === '簡單') { baseDmg *= 1.5; skillTriggered = true; }
  if (charId === 'moses' && myHp < enemyHp) { baseDmg *= 1.5; skillTriggered = true; }
  if (charId === 'paul' && (question.category === '聖經歷史' || question.category === '猜人物')) { baseDmg *= 1.2; skillTriggered = true; }
  
  const comboMultiplier = 1 + (combo * 0.2);
  return { dmg: Math.floor(baseDmg * comboMultiplier), skillTriggered };
};

export default function BibleQuiz() {
  const [gameState, setGameState] = useState('init'); 
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const MAX_HP = 1500;
  const [hp, setHp] = useState({ teamA: MAX_HP, teamB: MAX_HP });
  const [combo, setCombo] = useState({ teamA: 0, teamB: 0 });
  const [floatingText, setFloatingText] = useState({ teamA: [] as any[], teamB: [] as any[] });
  
  // 動畫狀態
  const [hitState, setHitState] = useState<'A' | 'B' | null>(null);
  const [attackState, setAttackState] = useState<'A' | 'B' | null>(null); // 誰正在發動攻擊衝刺

  const [showAnswer, setShowAnswer] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  
  const [teamAChar, setTeamAChar] = useState<string | null>(null);
  const [teamBChar, setTeamBChar] = useState<string | null>(null);

  const introAudioRef = useRef<HTMLAudioElement>(null);
  const gameAudioRef = useRef<HTMLAudioElement>(null);
  const cheerAudioRef = useRef<HTMLAudioElement>(null);
  const winnerAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-80px) scale(1.2); opacity: 0; } }
      .anim-float-dmg { animation: float-up 1s ease-out forwards; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000; }
      
      @keyframes skill-pop { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { transform: translateY(-20px) scale(1.3) rotate(-5deg); opacity: 1; } 80% { transform: translateY(-30px) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translateY(-50px) scale(0.8); opacity: 0; } }
      .anim-float-skill { animation: skill-pop 1.2s ease-out forwards; color: #FCD34D; text-shadow: 2px 2px 0 #B45309, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000; }

      @keyframes breathing { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.95) translateY(3px); } }
      .anim-idle { animation: breathing 2s infinite ease-in-out; transform-origin: bottom center; }
      @keyframes hit-shake { 0%, 100% { transform: translateX(0); filter: hue-rotate(0deg); } 25%, 75% { transform: translateX(-15px); filter: hue-rotate(90deg) brightness(0.5); } 50% { transform: translateX(15px); } }
      .anim-hit { animation: hit-shake 0.4s ease-in-out; }
      .hp-bar-fill { transition: width 0.5s ease-out, background-color 0.5s; }

      @keyframes flash-screen { 0%, 10%, 20%, 30%, 40% { background-color: white; } 5%, 15%, 25%, 35%, 45% { background-color: black; } 100% { background-color: #1e293b; } }
      @keyframes slide-left { 0% { transform: translateX(-150%) skewX(-15deg); opacity: 0; } 100% { transform: translateX(0) skewX(-15deg); opacity: 1; } }
      @keyframes slide-right { 0% { transform: translateX(150%) skewX(-15deg); opacity: 0; } 100% { transform: translateX(0) skewX(-15deg); opacity: 1; } }
      @keyframes scale-boom { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      
      .anim-kof-bg { animation: flash-screen 1s ease-out forwards; }
      .anim-slide-l { animation: slide-left 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.5s forwards; opacity: 0; }
      .anim-slide-r { animation: slide-right 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.7s forwards; opacity: 0; }
      .anim-boom { animation: scale-boom 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) 1.2s forwards; opacity: 0; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleWinnerAudioEnded = () => {
    let winnerText = "It's a draw! No winner this time.";
    if (hp.teamA > hp.teamB) winnerText = "The champion is... TEAM A!!!";
    if (hp.teamB > hp.teamA) winnerText = "The champion is... TEAM B!!!";
    
    const utterance = new SpeechSynthesisUtterance(winnerText);
    utterance.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.name.includes('Google US English') || voice.lang === 'en-US');
    if (englishVoice) utterance.voice = englishVoice;
    utterance.pitch = 1.2;  
    utterance.rate = 1.1;   
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!introAudioRef.current || !gameAudioRef.current) return;
    
    if (!bgmPlaying) {
      introAudioRef.current.pause();
      gameAudioRef.current.pause();
      if (winnerAudioRef.current) winnerAudioRef.current.pause();
      return;
    }

    if (gameState === 'end') {
      if (gameAudioRef.current) gameAudioRef.current.volume = 0.2;
      if (introAudioRef.current) introAudioRef.current.volume = 0.2;
      if (winnerAudioRef.current) {
        winnerAudioRef.current.currentTime = 0;
        winnerAudioRef.current.play().catch(e => console.log(e));
      }
    } else {
      if (gameAudioRef.current) gameAudioRef.current.volume = 1;
      if (introAudioRef.current) introAudioRef.current.volume = 1;
      
      if (gameState === 'playing') {
        introAudioRef.current.pause();
        gameAudioRef.current.play().catch(e => console.log(e));
      } else {
        gameAudioRef.current.pause();
        introAudioRef.current.play().catch(e => console.log(e));
      }
    }
  }, [gameState, bgmPlaying]);

  const playHitSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(2, ctx.currentTime); 
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      if (cheerAudioRef.current) {
        cheerAudioRef.current.currentTime = 0;
        cheerAudioRef.current.volume = 0.8;
        cheerAudioRef.current.play().catch(e => console.log(e));
      }
    } catch (e) { console.error(e); }
  };

  const initGame = () => {
    setBgmPlaying(true);
    setGameState('intro');
    window.speechSynthesis.getVoices();
    setTimeout(() => setGameState('selectA'), 3000); // 🌟 保留舊版時序，開頭動畫後進入選角
  };

  const handleCharSelect = (charId: string) => {
    if (gameState === 'selectA') { 
      setTeamAChar(charId); 
      setTimeout(() => setGameState('selectB'), 400); 
    } 
    else if (gameState === 'selectB') { 
      setTeamBChar(charId); 
      // 🌟 兩邊選完後，切換到「技能揭曉 + 背景圖淡入」畫面！
      setTimeout(() => setGameState('start'), 400);
    }
  };

  const startBattle = () => {
    const shuffledQuestions = shuffleArray(BIBLE_QUESTIONS);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setHp({ teamA: MAX_HP, teamB: MAX_HP }); 
    setCombo({ teamA: 0, teamB: 0 });
    setShowAnswer(false);
    setIsScoring(false);
    setGameState('playing'); // 🌟 FIGHT 按下後，正式進入戰鬥，背景遮罩啟動！
  };

  const handleScore = (attacker: 'A' | 'B') => {
    if (isScoring) return; 
    setIsScoring(true);
    
    // 1️⃣ 啟動攻擊衝刺 (此時畫面上的題目會被 CSS 隱藏，角色衝向中央)
    setAttackState(attacker);

    // 2️⃣ 衝刺 300 毫秒後，擊中對手！
    setTimeout(() => {
      playHitSound();

      const currentQ = questions[currentIndex];
      const newId = Date.now();
      
      if (attacker === 'A') {
        const { dmg, skillTriggered } = calculateDamage(teamAChar, hp.teamA, hp.teamB, currentQ, combo.teamA);
        setHp(prev => ({ ...prev, teamB: Math.max(0, prev.teamB - dmg) }));
        setCombo(prev => ({ teamA: prev.teamA + 1, teamB: 0 })); 
        setHitState('B'); 
        
        const newTexts = [{ id: newId, text: `-${dmg}`, type: 'dmg' }];
        if (skillTriggered) newTexts.push({ id: newId + 1, text: '✨SKILL!', type: 'skill' });
        setFloatingText(prev => ({ ...prev, teamB: [...prev.teamB, ...newTexts] }));
      } else {
        const { dmg, skillTriggered } = calculateDamage(teamBChar, hp.teamB, hp.teamA, currentQ, combo.teamB);
        setHp(prev => ({ ...prev, teamA: Math.max(0, prev.teamA - dmg) }));
        setCombo(prev => ({ teamB: prev.teamB + 1, teamA: 0 })); 
        setHitState('A'); 
        
        const newTexts = [{ id: newId, text: `-${dmg}`, type: 'dmg' }];
        if (skillTriggered) newTexts.push({ id: newId + 1, text: '✨SKILL!', type: 'skill' });
        setFloatingText(prev => ({ ...prev, teamA: [...prev.teamA, ...newTexts] }));
      }

      // 3️⃣ 停留展示傷害 1.2 秒後，收起特效與衝刺狀態
      setTimeout(() => {
        setHitState(null);
        setFloatingText(prev => ({ 
          teamA: prev.teamA.filter(t => t.id !== newId && t.id !== newId + 1), 
          teamB: prev.teamB.filter(t => t.id !== newId && t.id !== newId + 1) 
        }));
        setAttackState(null); // 角色退回原位

        // 4️⃣ 退回原位 300 毫秒後，進入下一題
        setTimeout(() => {
          checkWinCondition();
        }, 300);

      }, 1200);

    }, 300); // 衝刺時間
  };

  const checkWinCondition = () => {
    setHp(currentHp => {
      if (currentHp.teamA <= 0 || currentHp.teamB <= 0) {
        setGameState('end'); 
      } else {
        setCurrentIndex(prevIndex => {
          if (prevIndex + 1 >= questions.length) {
            setQuestions(shuffleArray(BIBLE_QUESTIONS));
            return 0;
          }
          return prevIndex + 1;
        });
        setShowAnswer(false);
        setIsScoring(false);
      }
      return currentHp;
    });
  };

  const skipQuestion = () => {
    if (isScoring) return;
    setIsScoring(true);
    setCombo({ teamA: 0, teamB: 0 }); 
    setTimeout(() => checkWinCondition(), 500); 
  };

  const getHpColor = (currentHp: number) => {
    const ratio = currentHp / MAX_HP;
    if (ratio > 0.5) return 'bg-green-500';
    if (ratio > 0.2) return 'bg-yellow-400';
    return 'bg-red-600';
  };

  const currentQ = questions[currentIndex];
  
  const pixelBoxClass = "bg-slate-800 border-4 border-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white p-4 md:p-6";
  const pixelButtonClass = "transform active:translate-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 md:border-4 border-black font-black cursor-pointer transition-all disabled:opacity-50";

  // 🌟 判斷是否要顯示新的背景圖 (避開 init 和 intro 狀態)
  const showCustomBackground = !['init', 'intro', 'selectA', 'selectB'].includes(gameState);

  return (
    <div className="h-screen w-full bg-black flex justify-center items-center relative overflow-hidden font-dotgothic selection:bg-yellow-400">
      
      {/* 🌟 核心修改：將新的背景圖（`image_26.png`）淡入載入，避開開頭動畫！ */}
      {showCustomBackground && (
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: 'url(https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/refs/heads/main/stage.png)', // 請上傳 `image_26.png` 後替換此連結
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1, // 🌟 淡入效果
          }}
        />
      )}

      {/* 🌟 戰鬥時的遮罩與 UI：當進入 `playing` 時淡入毛玻璃遮罩 */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 z-[5] bg-black/50 backdrop-blur-sm z-10 transition-opacity duration-500" />
      )}

      <div className={`w-full h-full relative z-20 flex flex-col items-center justify-center p-4 md:p-6 border-x-[8px] md:border-x-[12px] border-slate-900 overflow-hidden`}>
        
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-[120] flex flex-col gap-2">
          <Link href="/tools-hub" className="bg-slate-700 text-white border-2 md:border-4 border-black px-3 py-1 md:px-4 md:py-2 text-xs md:text-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-slate-600 font-bold hover:-translate-y-0.5 transition-transform">
          ← 回工具箱
          </Link>
          {gameState !== 'init' && (
            <button onClick={() => setGameState('init')} className="bg-orange-600 text-white border-2 md:border-4 border-black px-3 py-1 md:px-4 md:py-2 text-xs md:text-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-orange-500 font-bold hover:-translate-y-0.5 transition-transform text-left">
              🏠 遊戲首頁
            </button>
          )}
        </div>

        <button onClick={() => setBgmPlaying(!bgmPlaying)} className="absolute top-2 right-2 md:top-4 md:right-4 z-[120] bg-yellow-400 text-black border-2 md:border-4 border-black px-3 py-1 md:px-4 md:py-2 text-xs md:text-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 font-bold hover:-translate-y-0.5 transition-transform">
          {bgmPlaying ? "🔊 BGM ON" : "🔇 BGM OFF"}
        </button>

        {/* 🌟 保留舊版 BGM */}
        <audio ref={introAudioRef} src="https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song_1.mp3" loop />
        <audio ref={gameAudioRef} src="https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song_2.mp3" loop />
        <audio ref={cheerAudioRef} src="https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song3.mp3" />
        <audio ref={winnerAudioRef} src="https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song4.mp3" onEnded={handleWinnerAudioEnded} />
        
        {gameState === 'init' && (
          <div className="z-10 text-center">
            <h1 className="text-6xl md:text-[6rem] lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-900 font-black mb-8 md:mb-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] stroke-black tracking-widest leading-tight">BIBLE QUIZ <br /> BATTLE</h1>
            <button onClick={initGame} className={`${pixelButtonClass} bg-yellow-500 hover:bg-yellow-400 text-black text-3xl md:text-5xl px-8 md:px-12 py-4 md:py-6 animate-pulse`}>INSERT COIN</button>
          </div>
        )}

        {gameState === 'intro' && (
          <div className="z-[100] w-full h-full flex items-center justify-center anim-kof-bg absolute inset-0 bg-black/80 backdrop-blur-sm z-10 transition-opacity duration-500">
            <div className="relative w-full flex items-center justify-center flex-col md:flex-row h-full px-4 overflow-hidden">
              <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-10 mb-8 md:mb-0 anim-slide-l">
                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-red-600 drop-shadow-[8px_8px_0px_white] transform -skew-x-12 tracking-tighter">BIBLE</h1>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 anim-boom">
                <span className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-yellow-400 drop-shadow-[8px_8px_0px_black] italic">VS</span>
              </div>
              <div className="w-full md:w-1/2 flex justify-center md:justify-start pl-0 md:pl-10 anim-slide-r">
                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-blue-600 drop-shadow-[8px_8px_0px_white] transform -skew-x-12 tracking-tighter">BATTLE</h1>
              </div>
            </div>
          </div>
        )}

        {(gameState === 'selectA' || gameState === 'selectB') && (
           <div className="z-10 w-full max-w-6xl">
           <h2 className="text-3xl md:text-4xl text-white font-black mb-6 text-center bg-slate-900/80 p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-slate-950">
             {gameState === 'selectA' ? "PLAYER 1 (A隊) 選擇角色" : "PLAYER 2 (B隊) 選擇角色"}
           </h2>
           <div className="grid grid-cols-5 gap-3 md:gap-5">
             {CHARACTERS.map(char => {
               const isP1 = teamAChar === char.id;
               const isP2 = teamBChar === char.id;
               let boxStyles = "bg-slate-800 hover:bg-slate-700 border-slate-900 cursor-pointer hover:-translate-y-1";
               
               if (isP1) boxStyles = "bg-red-900/90 border-red-500 opacity-80 cursor-not-allowed transform scale-95 shadow-none";
               if (isP2) boxStyles = "bg-blue-900/90 border-blue-500 opacity-80 cursor-not-allowed transform scale-95 shadow-none";

               return (
                 <button key={char.id} onClick={() => handleCharSelect(char.id)} disabled={isP1 || isP2} className={`${pixelBoxClass} ${boxStyles} flex flex-col items-center justify-center p-2 md:p-4 relative transition-all duration-200`}>
                   {isP1 && <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 border-b-2 border-l-2 border-black z-20">P1 已選</span>}
                   {isP2 && <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 border-b-2 border-l-2 border-black z-20">P2 已選</span>}
                   <img src={char.img} className="w-20 h-20 md:w-28 md:h-28 mb-3 md:mb-4 anim-idle bg-slate-600 p-1 md:p-2 border-2 border-black object-contain" alt="character" />
                   <h3 className="text-lg md:text-2xl text-yellow-400 font-black text-center leading-tight">{char.name}</h3>
                   <p className="text-[10px] md:text-xs text-slate-400 font-medium text-center leading-tight hidden md:block mt-2 animate-pulse">??? 隱藏技能 ???</p>
                 </button>
               );
             })}
           </div>
         </div>
        )}

        {/* 🌟 核心修改：技能揭曉 + 背景淡入，並覆蓋真實的 START 按鈕！ */}
        {gameState === 'start' && (
          <div className="z-10 w-full max-w-4xl text-center bg-slate-900/90 border-4 border-slate-950 p-6 md:p-10 shadow-[6px_6px_0px_rgba(0,0,0,1)] backdrop-blur-sm z-10 transition-opacity duration-500">
            <h2 className="text-4xl md:text-6xl text-yellow-400 font-black mb-6 md:mb-10 drop-shadow-[3px_3px_0px_black]">SKILL REVEAL!</h2>
            <div className="flex justify-center items-center gap-4 md:gap-12 mb-8 md:mb-10 relative">
              
              <div className={`${pixelBoxClass} anim-slide-l flex flex-col items-center w-[45%] md:w-64 bg-slate-950 border-4 border-red-500`}>
                <span className="text-xl md:text-3xl text-red-500 font-black mb-2 md:mb-4 drop-shadow-[2px_2px_0px_white]">TEAM A</span>
                {teamAChar && (() => {
                  const c = CHARACTERS.find(x => x.id === teamAChar);
                  return c && (
                    <>
                      <img src={c.img} className="w-16 h-16 md:w-28 md:h-28 mb-2 md:mb-4 rendering-pixelated object-contain bg-slate-700/80 p-2 border-2 border-black" alt="P1" />
                      <h3 className="text-lg md:text-3xl text-yellow-400 font-black mb-1">{c.name}</h3>
                      <p className="text-xs md:text-sm text-blue-300 font-bold mb-2 md:mb-3">{c.title}</p>
                      <div className="bg-slate-800 border-2 border-yellow-400 p-2 w-full">
                        <p className="text-[10px] md:text-sm text-white font-bold">{c.desc}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* 🌟 核心修改：移除假 VS 文字，用真 `FIGHT START!` 按鈕準確覆蓋能量衝突處 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4">
                  <div className="text-4xl md:text-7xl text-white font-black italic anim-boom drop-shadow-[4px_4px_0px_black]">VS</div>
                  <button onClick={startBattle} className={`${pixelButtonClass} bg-green-600 text-white text-3xl md:text-4xl px-8 md:px-10 py-4 md:py-5 animate-pulse border-4 md:border-6 border-slate-950`}>FIGHT!</button>
              </div>

              <div className={`${pixelBoxClass} anim-slide-r flex flex-col items-center w-[45%] md:w-64 bg-slate-950 border-4 border-blue-500`}>
                <span className="text-xl md:text-3xl text-blue-500 font-black mb-2 md:mb-4 drop-shadow-[2px_2px_0px_white]">TEAM B</span>
                {teamBChar && (() => {
                  const c = CHARACTERS.find(x => x.id === teamBChar);
                  return c && (
                    <>
                      <img src={c.img} className="w-16 h-16 md:w-28 md:h-28 mb-2 md:mb-4 rendering-pixelated object-contain bg-slate-700/80 p-2 border-2 border-black transform scale-x-[-1]" alt="P2" />
                      <h3 className="text-lg md:text-3xl text-yellow-400 font-black mb-1">{c.name}</h3>
                      <p className="text-xs md:text-sm text-blue-300 font-bold mb-2 md:mb-3">{c.title}</p>
                      <div className="bg-slate-800 border-2 border-yellow-400 p-2 w-full">
                        <p className="text-[10px] md:text-sm text-white font-bold">{c.desc}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              
            </div>
            {/* 🌟 FIGHT 按鈕已移動到中央 VS 文字下方 */}
          </div>
        )}

        {gameState === 'playing' && currentQ && (
          <div className="z-10 w-full max-w-5xl flex flex-col h-full py-2">
            
            {/* 血條與 Combo */}
            <div className="flex justify-between items-start mb-3 bg-slate-900 border-[3px] md:border-4 border-black p-2 md:p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative z-20">
              <div className="absolute left-1/2 transform -translate-x-1/2 top-2 md:top-3 text-center z-20">
                <span className="text-lg md:text-2xl text-yellow-400 font-black block drop-shadow-[2px_2px_0px_black] bg-black px-3 py-1 md:px-4 md:py-2 border-2 border-white">ROUND {currentIndex + 1}</span>
              </div>

              <div className="flex flex-col w-[42%] relative">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xl md:text-3xl text-red-500 font-black drop-shadow-[2px_2px_0px_white]">TEAM A</span>
                  {combo.teamA > 1 && <span className="text-sm md:text-lg text-yellow-400 font-black animate-pulse">{combo.teamA} HITS!</span>}
                </div>
                <div className="w-full h-5 md:h-6 border-2 md:border-4 border-white bg-slate-800 relative">
                  <div className={`h-full hp-bar-fill ${getHpColor(hp.teamA)}`} style={{ width: `${(hp.teamA / MAX_HP) * 100}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col w-[42%] relative">
                <div className="flex justify-between items-end mb-1 flex-row-reverse">
                  <span className="text-xl md:text-3xl text-blue-500 font-black drop-shadow-[2px_2px_0px_white]">TEAM B</span>
                  {combo.teamB > 1 && <span className="text-sm md:text-lg text-yellow-400 font-black animate-pulse">{combo.teamB} HITS!</span>}
                </div>
                <div className="w-full h-5 md:h-6 border-2 md:border-4 border-white bg-slate-800 relative flex justify-end">
                  <div className={`h-full hp-bar-fill ${getHpColor(hp.teamB)}`} style={{ width: `${(hp.teamB / MAX_HP) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* 戰鬥舞台本體 */}
            <div className={`bg-slate-900 border-[3px] md:border-4 border-slate-950 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white flex-1 flex flex-col justify-between mb-3 relative overflow-hidden backdrop-blur-sm z-10 transition-opacity duration-500`}>
              
              {/* 🌟 攻擊動畫與角色 */}
              <div className="absolute inset-0 flex justify-between items-end px-4 md:px-8 pb-4 pointer-events-none z-30">
                <div className={`relative transition-all duration-300 ease-in-out z-[60] ${attackState === 'A' ? 'translate-x-[30vw] md:translate-x-[40vw] -translate-y-10 scale-[1.3]' : 'translate-x-0'}`}>
                  <img src={CHARACTERS.find(c => c.id === teamAChar)?.img} className={`w-28 h-28 md:w-44 md:h-44 rendering-pixelated object-contain bg-slate-700/80 p-2 md:p-3 border-2 md:border-4 border-black ${hitState === 'A' ? 'anim-hit' : 'anim-idle'}`} alt="Player A" />
                  {floatingText.teamA.map(txt => (
                    <div key={txt.id} className={`absolute z-[100] ${txt.type === 'skill' ? 'anim-float-skill -top-20 left-6 text-4xl md:text-5xl font-black' : 'anim-float-dmg -top-16 left-2 md:left-6 text-4xl md:text-5xl text-red-500 font-black'}`}>
                      {txt.text}
                    </div>
                  ))}
                </div>
                
                <div className={`relative transition-all duration-300 ease-in-out z-[60] ${attackState === 'B' ? '-translate-x-[30vw] md:-translate-x-[40vw] -translate-y-10 scale-[1.3]' : 'translate-x-0'}`}>
                  <img src={CHARACTERS.find(c => c.id === teamBChar)?.img} className={`w-28 h-28 md:w-44 md:h-44 rendering-pixelated object-contain bg-slate-700/80 p-2 md:p-3 border-2 md:border-4 border-black transform scale-x-[-1] ${hitState === 'B' ? 'anim-hit' : 'anim-idle'}`} alt="Player B" />
                  {floatingText.teamB.map(txt => (
                    <div key={txt.id} className={`absolute z-[100] transform scale-x-[-1] ${txt.type === 'skill' ? 'anim-float-skill -top-20 right-6 text-4xl md:text-5xl font-black' : 'anim-float-dmg -top-16 right-2 md:right-6 text-4xl md:text-5xl text-red-500 font-black'}`}>
                      {txt.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* 🌟 題目與答案 */}
              <div className={`flex-1 flex flex-col justify-between w-full h-full transition-opacity duration-300 z-10 p-3 md:p-4 bg-slate-800/80 ${attackState ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                
                <div className="flex justify-between items-start p-3">
                  <span className="bg-yellow-400 text-black px-4 py-1 text-sm md:text-lg font-black border-2 border-black">{currentQ.category}</span>
                  <span className={`px-4 py-1 text-sm md:text-lg font-black border-2 border-black text-white ${currentQ.difficulty === '困難' ? 'bg-red-600' : 'bg-orange-500'}`}>{currentQ.difficulty}</span>
                </div>

                <div className="flex-1 flex items-center justify-center py-2 px-12 md:py-4 md:px-24">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold leading-normal md:leading-snug text-center drop-shadow-[3px_3px_0px_black] bg-slate-900/90 p-4 rounded-2xl w-full border-2 border-slate-700">
                    {currentQ.question}
                  </h2>
                </div>

                {!showAnswer ? (
                  <div className="flex justify-center gap-4 md:gap-8 mb-4 md:mb-6">
                    <button onClick={() => setShowAnswer(true)} className={`${pixelButtonClass} bg-blue-600 text-white text-xl md:text-3xl px-8 py-3 md:px-12 md:py-4`}>SHOW ANSWER</button>
                    <button onClick={skipQuestion} disabled={isScoring} className={`${pixelButtonClass} bg-slate-600 text-white text-lg md:text-xl px-6 py-3 md:px-8 md:py-4`}>SKIP</button>
                  </div>
                ) : (
                  <div className="text-center mb-4 md:mb-6 mx-6 md:mx-12 bg-slate-950 border-[3px] md:border-4 border-yellow-400 p-3 md:p-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    <h3 className="text-3xl md:text-5xl text-green-400 font-black drop-shadow-[2px_2px_0px_black]">{currentQ.answer}</h3>
                  </div>
                )}
              </div>
            </div>

            {/* 🌟 攻擊按鈕 */}
            {showAnswer && (
              <div className={`grid grid-cols-2 gap-4 md:gap-6 pb-1 transition-opacity duration-300 ${attackState ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={() => handleScore('A')} disabled={isScoring} className={`${pixelButtonClass} bg-red-600 hover:bg-red-500 text-white text-2xl md:text-4xl py-3 md:py-5 border-4 md:border-8 border-slate-950 group`}>
                  <span className="group-hover:scale-110 transition-transform block">A隊 攻擊! 🗡️</span>
                </button>
                <button onClick={() => handleScore('B')} disabled={isScoring} className={`${pixelButtonClass} bg-blue-600 hover:bg-blue-500 text-white text-2xl md:text-4xl py-3 md:py-5 border-4 md:border-8 border-slate-950 group`}>
                  <span className="group-hover:scale-110 transition-transform block">B隊 攻擊! 🗡️</span>
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'end' && (
          <div className="z-10 w-full max-w-4xl text-center bg-slate-900/95 p-6 md:p-10 border-4 border-slate-950 p-6 md:p-10 shadow-[6px_6px_0px_rgba(0,0,0,1)] backdrop-blur-sm z-10 transition-opacity duration-500">
            <h1 className="text-6xl md:text-[6rem] text-yellow-400 font-black mb-10 drop-shadow-[4px_4px_0px_black]">K.O.!</h1>
            <div className="flex justify-center gap-10 md:gap-20 mb-10">
              <div className={`${pixelBoxClass} ${hp.teamA > hp.teamB ? 'border-yellow-400 scale-110' : 'opacity-50'} p-6 md:p-8 w-1/2 max-w-[250px] bg-slate-950`}>
                <span className="text-3xl md:text-4xl text-red-500 font-black mb-3 block">TEAM A</span>
                <span className="text-2xl md:text-3xl text-white font-black block">HP: {hp.teamA}</span>
              </div>
              <div className={`${pixelBoxClass} ${hp.teamB > hp.teamA ? 'border-yellow-400 scale-110' : 'opacity-50'} p-6 md:p-8 w-1/2 max-w-[250px] bg-slate-950`}>
                <span className="text-3xl md:text-4xl text-blue-500 font-black mb-3 block">TEAM B</span>
                <span className="text-2xl md:text-3xl text-white font-black block">HP: {hp.teamB}</span>
              </div>
            </div>
            <button onClick={initGame} className={`${pixelButtonClass} bg-green-600 text-white text-4xl md:text-5xl px-12 md:px-20 py-4 md:py-6 border-4 md:border-8 border-slate-950`}>REMATCH</button>
          </div>
        )}
      </div>
    </div>
  );
}