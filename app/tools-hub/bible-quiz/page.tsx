'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // 🌟 引入 Link 組件

// --- 題庫 (放入你的 50 題) ---
const BIBLE_QUESTIONS = [
  { id: 1, category: "猜人物", difficulty: "簡單", question: "帶領以色列人出埃及，並在西奈山領受十誡的領袖是誰？", answer: "摩西" },
  { id: 2, category: "聖經填空", difficulty: "簡單", question: "「起初，神創造______。」(創世記1:1)", answer: "天地" },
  { id: 3, category: "聖經歷史", difficulty: "中等", question: "以色列的第一位國王是誰？", answer: "掃羅" },
  { id: 4, category: "猜人物", difficulty: "中等", question: "耶穌的十二門徒中，為了三十塊錢出賣耶穌的是誰？", answer: "加略人猶大" },
  { id: 6, category: "聖經歷史", difficulty: "困難", question: "尼希米帶領以色列人回歸耶路撒冷，主要是為了重建什麼？", answer: "城牆" },
  { id: 7, category: "猜人物", difficulty: "困難", question: "原本名叫亞伯蘭，後來被神改名，並被稱為「信心之父」的是誰？", answer: "亞伯拉罕" },
  // ... 為了保持程式碼簡潔，這裡我先放幾題代表，你可以把原本完整的 50 題貼回來 ...
  { id: 50, category: "聖經填空", difficulty: "困難", question: "「草必枯乾，花必凋殘，惟有我們神的話必______。」(以賽亞書40:8)", answer: "永遠立定" }
];

// 🌟 角色設定 (已換上你的專屬圖片連結)
const CHARACTERS = [
  { id: 'david', name: '大衛', title: '巨人殺手', desc: '答對「困難」題目時，傷害 x 1.5', img: 'https://mc-heads.net/body/David/256' },
  { id: 'solomon', name: '所羅門', title: '智慧之王', desc: '任何題目答對，基礎傷害 x 1.2', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/%E6%89%80%E7%BE%85%E9%96%80.png' },
  { id: 'peter', name: '彼得', title: '磐石爆發', desc: '答對「簡單」題目時，傷害 x 1.5', img: 'https://mc-heads.net/body/Peter/256' },
  { id: 'moses', name: '摩西', title: '逆境分海', desc: '當己方血量「低於」對手時，傷害 x 1.5', img: 'https://mc-heads.net/body/Moses/256' },
  { id: 'paul', name: '保羅', title: '外邦使徒', desc: '答對「聖經歷史」與「猜人物」時，傷害 x 1.2', img: 'https://raw.githubusercontent.com/woodylin0403/bible-quiz-assets/main/paul.png' }
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
  if (charId === 'david' && question.difficulty === '困難') baseDmg *= 1.5;
  if (charId === 'solomon') baseDmg *= 1.2;
  if (charId === 'peter' && question.difficulty === '簡單') baseDmg *= 1.5;
  if (charId === 'moses' && myHp < enemyHp) baseDmg *= 1.5;
  if (charId === 'paul' && (question.category === '聖經歷史' || question.category === '猜人物')) baseDmg *= 1.2;
  const comboMultiplier = 1 + (combo * 0.2);
  return Math.floor(baseDmg * comboMultiplier);
};

export default function BibleQuiz() {
  const [gameState, setGameState] = useState('init'); 
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const MAX_HP = 1500;
  const [hp, setHp] = useState({ teamA: MAX_HP, teamB: MAX_HP });
  const [combo, setCombo] = useState({ teamA: 0, teamB: 0 });
  const [floatingText, setFloatingText] = useState({ teamA: [] as any[], teamB: [] as any[] });
  const [hitState, setHitState] = useState<'A' | 'B' | null>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  
  const [teamAChar, setTeamAChar] = useState<string | null>(null);
  const [teamBChar, setTeamBChar] = useState<string | null>(null);

  const introAudioRef = useRef<HTMLAudioElement>(null);
  const gameAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-60px) scale(1.2); opacity: 0; } }
      .anim-float-dmg { animation: float-up 1s ease-out forwards; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000; }
      @keyframes breathing { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.95) translateY(3px); } }
      .anim-idle { animation: breathing 2s infinite ease-in-out; transform-origin: bottom center; }
      @keyframes hit-shake { 0%, 100% { transform: translateX(0); filter: hue-rotate(0deg); } 25%, 75% { transform: translateX(-8px); filter: hue-rotate(90deg) brightness(0.5); } 50% { transform: translateX(8px); } }
      .anim-hit { animation: hit-shake 0.4s ease-in-out; }
      .hp-bar-fill { transition: width 0.5s ease-out, background-color 0.5s; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const playHitSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { console.error(e); }
  };

  const initGame = () => {
    setBgmPlaying(true);
    setGameState('intro');
    if (introAudioRef.current) introAudioRef.current.play().catch(e => e);
    setTimeout(() => setGameState('start'), 3000);
  };

  // 🌟 修改點 1：角色選擇加入視覺回饋與停頓延遲
  const handleCharSelect = (charId: string) => {
    if (gameState === 'selectA') { 
      setTeamAChar(charId); 
      setTimeout(() => setGameState('selectB'), 400); // 停頓 0.4 秒讓玩家看清楚選了誰
    } 
    else if (gameState === 'selectB') { 
      setTeamBChar(charId); 
      setTimeout(() => setGameState('reveal'), 400);
    }
  };

  // 🌟 修改點 2：移除題數限制 (不再使用 slice)
  const startBattle = () => {
    const shuffledQuestions = shuffleArray(BIBLE_QUESTIONS);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setHp({ teamA: MAX_HP, teamB: MAX_HP }); 
    setCombo({ teamA: 0, teamB: 0 });
    setShowAnswer(false);
    setIsScoring(false);
    setGameState('playing');
  };

  const handleScore = (attacker: 'A' | 'B') => {
    if (isScoring) return; 
    setIsScoring(true);
    playHitSound();

    const currentQ = questions[currentIndex];
    const newId = Date.now();
    
    if (attacker === 'A') {
      const dmg = calculateDamage(teamAChar, hp.teamA, hp.teamB, currentQ, combo.teamA);
      setHp(prev => ({ ...prev, teamB: Math.max(0, prev.teamB - dmg) }));
      setCombo(prev => ({ teamA: prev.teamA + 1, teamB: 0 })); 
      setHitState('B'); 
      setFloatingText(prev => ({ ...prev, teamB: [...prev.teamB, { id: newId, text: `-${dmg}` }] }));
    } else {
      const dmg = calculateDamage(teamBChar, hp.teamB, hp.teamA, currentQ, combo.teamB);
      setHp(prev => ({ ...prev, teamA: Math.max(0, prev.teamA - dmg) }));
      setCombo(prev => ({ teamB: prev.teamB + 1, teamA: 0 })); 
      setHitState('A'); 
      setFloatingText(prev => ({ ...prev, teamA: [...prev.teamA, { id: newId, text: `-${dmg}` }] }));
    }

    setTimeout(() => setHitState(null), 400);
    setTimeout(() => {
      setFloatingText(prev => ({ teamA: prev.teamA.filter(t => t.id !== newId), teamB: prev.teamB.filter(t => t.id !== newId) }));
      checkWinCondition();
    }, 1500);
  };

  const checkWinCondition = () => {
    setHp(currentHp => {
      if (currentHp.teamA <= 0 || currentHp.teamB <= 0) {
        setGameState('end'); // 血量歸零才結束
      } else {
        // 🌟 修改點 2：無限題庫輪迴，題目用光就重新洗牌
        setCurrentIndex(prevIndex => {
          if (prevIndex + 1 >= BIBLE_QUESTIONS.length) {
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

  return (
    <div className="h-screen w-full bg-black flex justify-center items-center relative overflow-hidden font-dotgothic selection:bg-yellow-400">
      <div className="w-full h-full bg-slate-300 relative flex flex-col items-center justify-center p-4 md:p-6 border-x-[8px] md:border-x-[12px] border-slate-900 overflow-hidden">
        
        {/* 🌟 修改點 3：導覽選單 (左上角) */}
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

        <audio ref={introAudioRef} src="https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song_1.mp3" loop />
        
        {gameState === 'init' && (
          <div className="z-10 text-center">
            <h1 className="text-6xl md:text-[6rem] lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-900 font-black mb-8 md:mb-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] stroke-black tracking-widest leading-tight">BIBLE QUIZ <br /> BATTLE</h1>
            <button onClick={initGame} className={`${pixelButtonClass} bg-yellow-500 hover:bg-yellow-400 text-black text-3xl md:text-5xl px-8 md:px-12 py-4 md:py-6 animate-pulse`}>INSERT COIN</button>
          </div>
        )}

        {gameState === 'intro' && (<div className="text-6xl md:text-8xl text-white font-black animate-pulse">VS ANIMATION...</div>)}

        {gameState === 'start' && (
          <div className={`${pixelBoxClass} z-10 w-full max-w-3xl text-center`}>
            <h1 className="text-5xl md:text-7xl text-yellow-400 font-black mb-8 drop-shadow-[3px_3px_0px_black]">QUIZ BATTLE</h1>
            <button onClick={() => setGameState('selectA')} className={`${pixelButtonClass} bg-green-500 text-white text-3xl md:text-4xl px-8 py-4`}>START</button>
          </div>
        )}

        {/* 🌟 修改點 1：角色選擇的邊框與顏色反饋 */}
        {(gameState === 'selectA' || gameState === 'selectB') && (
           <div className="z-10 w-full max-w-5xl">
           <h2 className="text-3xl md:text-4xl text-white font-black mb-6 text-center bg-slate-900 border-2 md:border-4 border-black p-3 inline-block shadow-[4px_4px_0px_rgba(0,0,0,1)] w-full">
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
                   
                   {/* 選擇標籤 */}
                   {isP1 && <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 border-b-2 border-l-2 border-black z-20">P1 已選</span>}
                   {isP2 && <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 border-b-2 border-l-2 border-black z-20">P2 已選</span>}

                   <img src={char.img} className="w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 anim-idle bg-slate-600 p-1 md:p-2 border-2 border-black" alt="character" />
                   <h3 className="text-xl md:text-2xl text-yellow-400 font-black text-center leading-tight">{char.name}</h3>
                 </button>
               );
             })}
           </div>
         </div>
        )}

        {gameState === 'reveal' && (<div className="text-6xl md:text-8xl text-white font-black animate-pulse"><button onClick={startBattle} className={`${pixelButtonClass} bg-red-600 text-white p-6 md:p-8`}>FIGHT!</button></div>)}

        {/* 遊戲進行中 */}
        {gameState === 'playing' && currentQ && (
          <div className="z-10 w-full max-w-5xl flex flex-col h-full py-2">
            
            <div className="flex justify-between items-start mb-3 bg-slate-900 border-[3px] md:border-4 border-black p-2 md:p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
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

            <div className={`bg-slate-800 border-[3px] md:border-4 border-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white flex-1 flex flex-col justify-between mb-3 relative overflow-hidden`}>
              
              <div className="flex justify-between items-start z-20 p-3">
                <span className="bg-yellow-400 text-black px-4 py-1 text-sm md:text-lg font-black border-2 border-black">{currentQ.category}</span>
                <span className={`px-4 py-1 text-sm md:text-lg font-black border-2 border-black text-white ${currentQ.difficulty === '困難' ? 'bg-red-600' : 'bg-orange-500'}`}>{currentQ.difficulty}</span>
              </div>

              <div className="absolute inset-0 flex justify-between items-end px-4 md:px-8 pb-4 pointer-events-none">
                <div className="relative">
                  <img src={CHARACTERS.find(c => c.id === teamAChar)?.img} className={`w-20 h-20 md:w-28 md:h-28 rendering-pixelated bg-slate-700/80 p-1 md:p-2 border-2 md:border-4 border-black ${hitState === 'A' ? 'anim-hit' : 'anim-idle'}`} alt="Player A" />
                  {floatingText.teamA.map(txt => (
                    <div key={txt.id} className="absolute -top-12 md:-top-16 left-2 md:left-6 text-3xl md:text-4xl text-red-500 font-black anim-float-dmg z-50">{txt.text}</div>
                  ))}
                </div>
                <div className="relative">
                  <img src={CHARACTERS.find(c => c.id === teamBChar)?.img} className={`w-20 h-20 md:w-28 md:h-28 rendering-pixelated bg-slate-700/80 p-1 md:p-2 border-2 md:border-4 border-black transform scale-x-[-1] ${hitState === 'B' ? 'anim-hit' : 'anim-idle'}`} alt="Player B" />
                  {floatingText.teamB.map(txt => (
                    <div key={txt.id} className="absolute -top-12 md:-top-16 right-2 md:right-6 text-3xl md:text-4xl text-red-500 font-black anim-float-dmg z-50 transform scale-x-[-1]">{txt.text}</div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center py-2 px-12 md:py-4 md:px-24 z-20">
                <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold leading-normal md:leading-snug text-center drop-shadow-[3px_3px_0px_black] bg-slate-800/80 p-4 rounded-2xl backdrop-blur-sm w-full">
                  {currentQ.question}
                </h2>
              </div>

              {!showAnswer ? (
                <div className="flex justify-center gap-4 md:gap-8 mb-4 md:mb-6 z-20">
                  <button onClick={() => setShowAnswer(true)} className={`${pixelButtonClass} bg-blue-600 text-white text-xl md:text-3xl px-8 py-3 md:px-12 md:py-4`}>SHOW ANSWER</button>
                  <button onClick={skipQuestion} disabled={isScoring} className={`${pixelButtonClass} bg-slate-600 text-white text-lg md:text-xl px-6 py-3 md:px-8 md:py-4`}>SKIP</button>
                </div>
              ) : (
                <div className="text-center mb-4 md:mb-6 mx-6 md:mx-12 bg-slate-900 border-[3px] md:border-4 border-yellow-400 p-3 md:p-4 z-20 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                  <h3 className="text-3xl md:text-5xl text-green-400 font-black drop-shadow-[2px_2px_0px_black]">{currentQ.answer}</h3>
                </div>
              )}
            </div>

            {showAnswer && (
              <div className="grid grid-cols-2 gap-4 md:gap-6 pb-1">
                <button onClick={() => handleScore('A')} disabled={isScoring} className={`${pixelButtonClass} bg-red-600 hover:bg-red-500 text-white text-2xl md:text-4xl py-3 md:py-5 border-4 md:border-8 border-black group`}>
                  <span className="group-hover:scale-110 transition-transform block">A隊 攻擊! 🗡️</span>
                </button>
                <button onClick={() => handleScore('B')} disabled={isScoring} className={`${pixelButtonClass} bg-blue-600 hover:bg-blue-500 text-white text-2xl md:text-4xl py-3 md:py-5 border-4 md:border-8 border-black group`}>
                  <span className="group-hover:scale-110 transition-transform block">B隊 攻擊! 🗡️</span>
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'end' && (
          <div className="z-10 w-full max-w-4xl text-center">
            <h1 className="text-6xl md:text-[6rem] text-yellow-400 font-black mb-10 drop-shadow-[4px_4px_0px_black]">K.O.!</h1>
            <div className="flex justify-center gap-10 md:gap-20 mb-10">
              <div className={`${pixelBoxClass} ${hp.teamA > hp.teamB ? 'border-yellow-400 scale-110' : 'opacity-50'} p-6 md:p-8 w-1/2 max-w-[250px]`}>
                <span className="text-3xl md:text-4xl text-red-500 font-black mb-3 block">TEAM A</span>
                <span className="text-2xl md:text-3xl text-white font-black block">HP: {hp.teamA}</span>
              </div>
              <div className={`${pixelBoxClass} ${hp.teamB > hp.teamA ? 'border-yellow-400 scale-110' : 'opacity-50'} p-6 md:p-8 w-1/2 max-w-[250px]`}>
                <span className="text-3xl md:text-4xl text-blue-500 font-black mb-3 block">TEAM B</span>
                <span className="text-2xl md:text-3xl text-white font-black block">HP: {hp.teamB}</span>
              </div>
            </div>
            <button onClick={initGame} className={`${pixelButtonClass} bg-green-600 text-white text-4xl md:text-5xl px-12 md:px-20 py-4 md:py-6`}>REMATCH</button>
          </div>
        )}
      </div>
    </div>
  );
}