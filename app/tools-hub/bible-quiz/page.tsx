'use client';
import React, { useState, useEffect, useRef } from 'react';

// --- 題庫 (共50題，大幅增加困難題) ---
const BIBLE_QUESTIONS = [
  // 簡單
  { id: 1, category: "猜人物", difficulty: "簡單", question: "帶領以色列人出埃及，並在西奈山領受十誡的領袖是誰？", answer: "摩西" },
  { id: 2, category: "聖經填空", difficulty: "簡單", question: "「起初，神創造______。」(創世記1:1)", answer: "天地" },
  { id: 8, category: "聖經填空", difficulty: "簡單", question: "「耶和華是我的______，我必不致缺乏。」(詩篇23:1)", answer: "牧者" },
  { id: 9, category: "聖經歷史", difficulty: "簡單", question: "耶穌降生在哪個城市？", answer: "伯利恆" },
  { id: 15, category: "猜人物", difficulty: "簡單", question: "耶穌在地上的養父（馬利亞的丈夫）叫什麼名字？", answer: "約瑟" },
  { id: 19, category: "聖經填空", difficulty: "簡單", question: "「常常喜樂，不住地______，凡事謝恩...」(帖前5:16)", answer: "禱告" },
  
  // 中等
  { id: 3, category: "聖經歷史", difficulty: "中等", question: "以色列的第一位國王是誰？", answer: "掃羅" },
  { id: 4, category: "猜人物", difficulty: "中等", question: "耶穌的十二門徒中，為了三十塊錢出賣耶穌的是誰？", answer: "加略人猶大" },
  { id: 5, category: "聖經填空", difficulty: "中等", question: "「神愛世人，甚至將他的______賜給他們...」(約翰福音3:16)", answer: "獨生子" },
  { id: 10, category: "猜人物", difficulty: "中等", question: "因為逃避神的呼召，而在大魚的肚子裡待了三天三夜的先知是誰？", answer: "約拿" },
  { id: 12, category: "猜人物", difficulty: "中等", question: "誰只用了一塊石頭和機弦，就擊敗了非利士的巨人歌利亞？", answer: "大衛" },
  { id: 13, category: "聖經填空", difficulty: "中等", question: "「愛是恆久忍耐，又有______...」(哥林多前書13:4)", answer: "恩慈" },
  { id: 17, category: "聖經歷史", difficulty: "中等", question: "摩西死後，是誰接續他帶領以色列人過約旦河進入迦南地？", answer: "約書亞" },
  { id: 21, category: "猜人物", difficulty: "中等", question: "他在墳墓裡已經四天了，後來耶穌流淚並大聲呼叫使他從死裡復活。他是誰？", answer: "拉撒路" },
  { id: 22, category: "聖經填空", difficulty: "中等", question: "「你們要先求他的______和他的______，這些東西都要加給你們了。」(太6:33)", answer: "國、義" },
  { id: 25, category: "聖經歷史", difficulty: "中等", question: "耶穌被釘十字架的地方，名叫「各各他」，翻出來是什麼意思？", answer: "髑髏地" },
  { id: 37, category: "猜人物", difficulty: "中等", question: "賣了長子名分給弟弟雅各的人是誰？", answer: "以掃" },
  { id: 46, category: "猜人物", difficulty: "中等", question: "誰在五旬節聖靈降臨後，站起來講道，一天之內有三千人信主洗禮？", answer: "彼得" },

  // 困難
  { id: 6, category: "聖經歷史", difficulty: "困難", question: "尼希米帶領以色列人回歸耶路撒冷，主要是為了重建什麼？", answer: "城牆" },
  { id: 7, category: "猜人物", difficulty: "困難", question: "原本名叫亞伯蘭，後來被神改名，並被稱為「信心之父」的是誰？", answer: "亞伯拉罕" },
  { id: 11, category: "聖經填空", difficulty: "困難", question: "「我就是______、______、______；若不藉著我，沒有人能到父那裡去。」(約14:6)", answer: "道路、真理、生命" },
  { id: 14, category: "聖經歷史", difficulty: "困難", question: "哪一個帝國摧毀了所羅門建立的第一聖殿，並將猶大人擄去？", answer: "巴比倫" },
  { id: 16, category: "聖經填空", difficulty: "困難", question: "聖靈所結的果子：仁愛、喜樂、和平、忍耐、恩慈、良善、______、______、______。(加5:22)", answer: "信實、溫柔、節制" },
  { id: 18, category: "猜人物", difficulty: "困難", question: "誰是舊約中最後一位先知，穿著駱駝毛的衣服，並且為耶穌施洗？", answer: "施洗約翰" },
  { id: 20, category: "聖經歷史", difficulty: "困難", question: "使徒保羅在哪個城市看見了寫著「未識之神」的祭壇？", answer: "雅典" },
  { id: 23, category: "聖經歷史", difficulty: "困難", question: "雅各在雅博渡口與神（天使）摔跤後，他的名字被神改為什麼？", answer: "以色列" },
  { id: 24, category: "猜人物", difficulty: "困難", question: "聖經中記載壽命最長的人是誰？他活了969歲。", answer: "瑪土撒拉" },
  { id: 26, category: "聖經歷史", difficulty: "困難", question: "以色列分裂後，北國的第一任國王是誰？", answer: "耶羅波安" },
  { id: 27, category: "猜人物", difficulty: "困難", question: "誰是帶領以色列人回歸並教導律法的文士？", answer: "以斯拉" },
  { id: 28, category: "聖經填空", difficulty: "困難", question: "「信就是所望之事的實底，是______的確據。」(希伯來書11:1)", answer: "未見之事" },
  { id: 29, category: "猜人物", difficulty: "困難", question: "聖經中第一位為主殉道的門徒是誰？", answer: "司提反" },
  { id: 30, category: "猜人物", difficulty: "困難", question: "耶穌被捕時，誰拔刀削掉大祭司僕人的右耳？", answer: "彼得" },
  { id: 31, category: "聖經填空", difficulty: "困難", question: "「我們曉得萬事都互相效力，叫______的人得益處...」(羅馬書8:28)", answer: "愛神" },
  { id: 32, category: "猜人物", difficulty: "困難", question: "誰與保羅一起在腓立比的監獄裡半夜唱詩讚美神，引發大地震？", answer: "西拉" },
  { id: 33, category: "聖經歷史", difficulty: "困難", question: "保羅在哪個島上被毒蛇咬卻沒有受傷？", answer: "米利大島(馬耳他島)" },
  { id: 34, category: "猜人物", difficulty: "困難", question: "舊約中，唯一一位成為以色列士師的女性是誰？", answer: "底波拉" },
  { id: 35, category: "聖經填空", difficulty: "困難", question: "「因為世人都犯了罪，虧缺了神的______。」(羅馬書3:23)", answer: "榮耀" },
  { id: 36, category: "聖經歷史", difficulty: "困難", question: "啟示錄是使徒約翰被放逐到哪個島上時所寫的？", answer: "拔摩海島" },
  { id: 38, category: "聖經填空", difficulty: "困難", question: "「你要專心仰賴耶和華，不可倚靠自己的______。」(箴言3:5)", answer: "聰明" },
  { id: 39, category: "聖經歷史", difficulty: "困難", question: "摩西派了十二個探子去窺探迦南地，其中只有哪兩個人回報好消息？", answer: "約書亞和迦勒" },
  { id: 40, category: "猜人物", difficulty: "困難", question: "誰在路上遇見耶穌後，決定把所有財產的一半給窮人，並訛詐了誰就還他四倍？", answer: "撒該" },
  { id: 41, category: "聖經填空", difficulty: "困難", question: "「世人哪，耶和華已指示你何為善...只要你行公義，______，存謙卑的心，與神同行。」(彌6:8)", answer: "好憐憫" },
  { id: 42, category: "聖經歷史", difficulty: "困難", question: "在舊約中，哪一座城市因為罪惡極大，被神從天上降下硫磺與火毀滅？", answer: "所多瑪(和蛾摩拉)" },
  { id: 43, category: "猜人物", difficulty: "困難", question: "誰為了保護猶太人不被滅族，冒死違例去見波斯國王，並說「我若死就死吧」？", answer: "以斯帖" },
  { id: 44, category: "聖經填空", difficulty: "困難", question: "「我已經與基督同釘十字架，現在活著的不再是我，乃是______在我裡面活著。」(加2:20)", answer: "基督" },
  { id: 45, category: "聖經歷史", difficulty: "困難", question: "哪一個帝國摧毀了北國以色列，並將人民擄走？", answer: "亞述帝國" },
  { id: 47, category: "聖經填空", difficulty: "困難", question: "「你要保守你心，勝過保守一切，因為一生的______是由心發出。」(箴言4:23)", answer: "果效" },
  { id: 48, category: "聖經歷史", difficulty: "困難", question: "亞伯拉罕獻以撒的地方在哪座山上？", answer: "摩利亞山" },
  { id: 49, category: "猜人物", difficulty: "困難", question: "新約中，誰被稱為「安慰之子」，並且賣了田地把錢放在使徒腳前？", answer: "巴拿巴" },
  { id: 50, category: "聖經填空", difficulty: "困難", question: "「草必枯乾，花必凋殘，惟有我們神的話必______。」(以賽亞書40:8)", answer: "永遠立定" }
];

const CHARACTERS = [
  { id: 'david', name: '大衛', title: '巨人殺手', desc: '答對「困難」題目時，得分 x 2', img: 'https://mc-heads.net/body/David/256' },
  { id: 'solomon', name: '所羅門', title: '智慧之王', desc: '任何題目答對，得分 x 1.5', img: 'https://mc-heads.net/body/Solomon/256' },
  { id: 'peter', name: '彼得', title: '磐石爆發', desc: '答對「簡單」題目時，得分 x 2', img: 'https://mc-heads.net/body/Peter/256' },
  { id: 'moses', name: '摩西', title: '逆境分海', desc: '當己方總分「落後」對手時答對，得分 x 2', img: 'https://mc-heads.net/body/Moses/256' },
  { id: 'paul', name: '保羅', title: '外邦使徒', desc: '答對「聖經歷史」與「猜人物」時，得分 x 1.5', img: 'https://mc-heads.net/body/Paul/256' }
];

const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const calculatePoints = (charId: string | null, teamScore: number, opponentScore: number, question: any) => {
  let pts = 1;
  if (charId === 'david' && question.difficulty === '困難') pts = 2;
  if (charId === 'solomon') pts = 1.5;
  if (charId === 'peter' && question.difficulty === '簡單') pts = 2;
  if (charId === 'moses' && teamScore < opponentScore) pts = 2;
  if (charId === 'paul' && (question.category === '聖經歷史' || question.category === '猜人物')) pts = 1.5;
  return pts;
};

const playCorrectSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio API not supported", e);
  }
};

export default function BibleQuiz() {
  const [gameState, setGameState] = useState('init'); 
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  
  const [isScoring, setIsScoring] = useState(false);
  
  const [teamAChar, setTeamAChar] = useState<string | null>(null);
  const [teamBChar, setTeamBChar] = useState<string | null>(null);

  const introBgmUrl = 'https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song_1.mp3';
  const gameBgmUrl = 'https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song_2.mp3';
  const cheerSfxUrl = 'https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song3.mp3';
  const winnerSfxUrl = 'https://github.com/woodylin0403/bible-quiz-assets/raw/refs/heads/main/song4.mp3';

  const introAudioRef = useRef<HTMLAudioElement>(null);
  const gameAudioRef = useRef<HTMLAudioElement>(null);
  const winnerAudioRef = useRef<HTMLAudioElement>(null);

  const cheerAudioRef1 = useRef<HTMLAudioElement>(null); 
  const cheerAudioRef2 = useRef<HTMLAudioElement>(null); 
  const cheerAudioRef3 = useRef<HTMLAudioElement>(null); 

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 6000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log("原生全螢幕被阻擋", err);
          showToast('⚠️ 目前的預覽視窗限制了全螢幕功能！\n請按鍵盤【F11】強制放大，或將本程式碼下載成 HTML 檔執行。');
        });
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
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
    }
  }, [gameState]);

  const handleWinnerAudioEnded = () => {
    let winnerText = "It's a draw! No winner this time.";
    if (scores.teamA > scores.teamB) winnerText = "The champion is... TEAM A!!!";
    if (scores.teamB > scores.teamA) winnerText = "The champion is... TEAM B!!!";
    
    const utterance = new SpeechSynthesisUtterance(winnerText);
    utterance.lang = 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.name.includes('Google US English') || voice.lang === 'en-US');
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.pitch = 1.2;  
    utterance.rate = 1.1;   
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes flash-screen { 0%, 10%, 20%, 30%, 40% { background-color: white; } 5%, 15%, 25%, 35%, 45% { background-color: black; } 100% { background-color: #1e293b; } }
      @keyframes slide-left { 0% { transform: translateX(-150%) skewX(-15deg); opacity: 0; } 100% { transform: translateX(0) skewX(-15deg); opacity: 1; } }
      @keyframes slide-right { 0% { transform: translateX(150%) skewX(-15deg); opacity: 0; } 100% { transform: translateX(0) skewX(-15deg); opacity: 1; } }
      @keyframes scale-boom { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .anim-kof-bg { animation: flash-screen 1s ease-out forwards; }
      .anim-slide-l { animation: slide-left 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.5s forwards; opacity: 0; }
      .anim-slide-r { animation: slide-right 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.7s forwards; opacity: 0; }
      .anim-boom { animation: scale-boom 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) 1.2s forwards; opacity: 0; }
      .anim-float { animation: float 3s ease-in-out infinite; }
      .rendering-pixelated { image-rendering: pixelated; }
      
      .custom-scrollbar::-webkit-scrollbar { width: 8px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-left: 2px solid black; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #fbbf24; border: 2px solid black; border-radius: 4px; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!introAudioRef.current || !gameAudioRef.current) return;
    if (!bgmPlaying) {
      introAudioRef.current.pause();
      gameAudioRef.current.pause();
      return;
    }
    if (['intro', 'start', 'selectA', 'selectB', 'reveal', 'end'].includes(gameState)) {
      gameAudioRef.current.pause();
      if (introAudioRef.current.paused) introAudioRef.current.play().catch(e => e);
    } else if (gameState === 'playing') {
      introAudioRef.current.pause();
      if (gameAudioRef.current.paused) gameAudioRef.current.play().catch(e => e);
    }
  }, [gameState, bgmPlaying]);

  const toggleBgm = () => setBgmPlaying(!bgmPlaying);

  const initGame = () => {
    setBgmPlaying(true);
    setGameState('intro');
    if (introAudioRef.current) introAudioRef.current.play().catch(e => e);
    
    const audioRefs = [cheerAudioRef1, cheerAudioRef2, cheerAudioRef3, winnerAudioRef];
    audioRefs.forEach(ref => {
      if (ref.current) {
        ref.current.volume = 0; 
        ref.current.play().then(()=>{
          if (ref.current) {
            ref.current.pause(); 
            ref.current.volume = 1;
          }
        }).catch(e=>e);
      }
    });

    window.speechSynthesis.getVoices();

    setTimeout(() => setGameState('start'), 4000);
  };

  const handleCharSelect = (charId: string) => {
    if (gameState === 'selectA') {
      setTeamAChar(charId);
      setGameState('selectB');
    } else if (gameState === 'selectB') {
      setTeamBChar(charId);
      setGameState('reveal');
    }
  };

  const startBattle = () => {
    const random20Questions = shuffleArray(BIBLE_QUESTIONS).slice(0, 20);
    setQuestions(random20Questions);
    setCurrentIndex(0);
    setScores({ teamA: 0, teamB: 0 });
    setShowAnswer(false);
    setIsScoring(false);
    setGameState('playing');
  };

  const handleReveal = () => setShowAnswer(true);

  const handleScore = (team: 'A' | 'B') => {
    if (isScoring) return; 
    setIsScoring(true);

    playCorrectSound(); 
    
    [cheerAudioRef1, cheerAudioRef2, cheerAudioRef3].forEach(ref => {
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play().catch(e => e);
      }
    });

    const currentQ = questions[currentIndex];
    
    if (team === 'A') {
      const points = calculatePoints(teamAChar, scores.teamA, scores.teamB, currentQ);
      setScores(prev => ({ ...prev, teamA: prev.teamA + points }));
    } else if (team === 'B') {
      const points = calculatePoints(teamBChar, scores.teamB, scores.teamA, currentQ);
      setScores(prev => ({ ...prev, teamB: prev.teamB + points }));
    }
    
    setTimeout(() => nextQuestion(), 1500);
  };

  const nextQuestion = () => {
    setIsScoring(false); 
    if (currentIndex + 1 >= questions.length) {
      setGameState('end');
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const skipQuestion = () => {
    if (isScoring) return;
    setIsScoring(true);
    setTimeout(() => nextQuestion(), 500); 
  };

  const currentQ = questions[currentIndex];

  const pixelBoxClass = "bg-slate-800 border-4 md:border-8 border-slate-900 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-white p-4 md:p-8";
  const pixelButtonClass = "transform active:translate-y-2 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black px-4 py-2 sm:px-6 sm:py-4 font-black cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-center relative overflow-hidden font-dotgothic text-gray-800 selection:bg-yellow-400">
      
      {toastMsg && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-[9999] bg-red-600 border-4 border-black text-white px-6 py-3 text-lg md:text-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] text-center whitespace-pre-line animate-bounce w-11/12 max-w-xl">
          {toastMsg}
        </div>
      )}

      <div className="w-full min-h-[100dvh] md:min-h-0 md:h-screen md:max-h-screen md:aspect-video bg-slate-300 relative flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar md:border-x-[12px] border-slate-900">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-[100]"></div>

        <audio ref={introAudioRef} src={introBgmUrl} loop preload="auto" />
        <audio ref={gameAudioRef} src={gameBgmUrl} loop preload="auto" />
        
        <audio ref={cheerAudioRef1} src={cheerSfxUrl} preload="auto" />
        <audio ref={cheerAudioRef2} src={cheerSfxUrl} preload="auto" />
        <audio ref={cheerAudioRef3} src={cheerSfxUrl} preload="auto" />
        
        <audio ref={winnerAudioRef} src={winnerSfxUrl} preload="auto" onEnded={handleWinnerAudioEnded} />

        <button 
          onClick={toggleFullScreen}
          className="absolute top-2 left-2 md:top-6 md:left-6 z-[110] bg-slate-700 text-white border-2 md:border-4 border-black p-2 md:p-4 text-xs md:text-xl lg:text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-600 font-bold"
        >
          {isFullscreen ? "🗔 視窗" : "📺 全螢幕"}
        </button>

        {gameState !== 'init' && (
          <button 
            onClick={toggleBgm}
            className="absolute top-2 right-2 md:top-6 md:right-6 z-[110] bg-yellow-400 border-2 md:border-4 border-black p-2 md:p-4 text-xs md:text-xl lg:text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 font-bold"
          >
            {bgmPlaying ? "🔊 BGM ON" : "🔇 BGM OFF"}
          </button>
        )}

        {/* --- 1. 投幣畫面 --- */}
        {gameState === 'init' && (
          <div className="z-10 text-center flex flex-col items-center w-full my-auto px-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-900 font-black mb-12 md:mb-20 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)] stroke-black tracking-widest leading-tight">
              BIBLE QUIZ <br className="hidden md:block" /> BATTLE
            </h1>
            <button 
              onClick={initGame}
              className={`${pixelButtonClass} bg-yellow-500 hover:bg-yellow-400 text-black text-3xl sm:text-5xl lg:text-[4rem] px-8 sm:px-16 py-6 md:py-10 animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
            >
              INSERT COIN
            </button>
          </div>
        )}

        {/* --- 2. KOF 風格開場動畫 --- */}
        {gameState === 'intro' && (
          <div className="z-10 w-full h-full flex items-center justify-center anim-kof-bg absolute inset-0">
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

        {/* --- 3. 標題與說明 --- */}
        {gameState === 'start' && (
          <div className={`${pixelBoxClass} z-10 w-full max-w-[95%] md:max-w-4xl text-center anim-float my-auto`}>
            <h1 className="text-5xl sm:text-6xl md:text-8xl text-yellow-400 font-black mb-6 md:mb-12 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest leading-tight">BIBLE QUIZ BATTLE</h1>
            <div className="space-y-4 sm:space-y-6 text-xl sm:text-2xl md:text-3xl text-slate-300 font-bold mb-8 md:mb-16 leading-relaxed px-2">
              <p>選取專屬角色，發動特殊技能！</p>
              <p className="text-yellow-400">從 50 題題庫中隨機抽取 20 題，看誰能稱霸聖經大會考！</p>
            </div>
            <button 
              onClick={() => setGameState('selectA')}
              className={`${pixelButtonClass} bg-green-500 hover:bg-green-400 text-white text-3xl sm:text-4xl md:text-5xl px-8 sm:px-12 py-4 md:py-6`}
            >
              START GAME
            </button>
          </div>
        )}

        {/* --- 4. 角色選擇 --- */}
        {(gameState === 'selectA' || gameState === 'selectB') && (
          <div className="z-10 w-full max-w-[95%] lg:max-w-6xl my-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl text-white font-black mb-6 md:mb-10 text-center drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-slate-900 border-4 border-black p-4 inline-block shadow-[6px_6px_0px_rgba(0,0,0,1)] w-full">
              {gameState === 'selectA' ? "PLAYER 1 (A隊) 請選擇角色" : "PLAYER 2 (B隊) 請選擇角色"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {CHARACTERS.map(char => {
                const isSelected = (gameState === 'selectB' && teamAChar === char.id);
                return (
                  <button 
                    key={char.id}
                    onClick={() => handleCharSelect(char.id)}
                    disabled={isSelected}
                    className={`${pixelBoxClass} flex flex-col items-center hover:bg-slate-700 transition-colors p-3 md:p-6 ${isSelected ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer transform hover:-translate-y-2'}`}
                  >
                    <img src={char.img} alt={char.name} className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-3 md:mb-6 rendering-pixelated drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-slate-600 p-2 border-2 border-black" />
                    <h3 className="text-2xl sm:text-3xl md:text-4xl text-yellow-400 font-black mb-1 md:mb-2">{char.name}</h3>
                    <p className="text-sm sm:text-base md:text-xl text-blue-300 font-bold mb-2 md:mb-4">{char.title}</p>
                    <p className="text-xs sm:text-sm md:text-lg text-slate-300 font-medium text-center px-1 leading-snug">{char.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 5. 雙方揭曉 --- */}
        {gameState === 'reveal' && (
          <div className="z-10 w-full max-w-[95%] lg:max-w-5xl text-center my-auto px-2">
            <h2 className="text-4xl sm:text-6xl md:text-8xl text-yellow-400 font-black mb-10 md:mb-20 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">BATTLE START!</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 md:gap-24 mb-10 md:mb-20">
              
              <div className={`${pixelBoxClass} anim-slide-l flex flex-col items-center p-6 sm:p-8 md:p-12 border-b-8 md:border-b-8 border-b-red-500 min-w-[200px] sm:min-w-[250px] md:min-w-[300px]`}>
                <span className="text-3xl sm:text-4xl md:text-6xl text-red-500 font-black mb-4 md:mb-6 block drop-shadow-[2px_2px_0px_white]">TEAM A</span>
                {teamAChar && (() => {
                  const c = CHARACTERS.find(x => x.id === teamAChar);
                  return c ? (
                    <>
                      <img src={c.img} alt={c.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-4 md:mb-8 rendering-pixelated border-4 border-black bg-slate-700 p-2" />
                      <h3 className="text-4xl md:text-5xl text-white font-black mb-2 drop-shadow-[2px_2px_0px_black]">{c.name}</h3>
                      <p className="text-xl md:text-2xl text-blue-300 font-bold">{c.title}</p>
                    </>
                  ) : null;
                })()}
              </div>

              <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white italic drop-shadow-[6px_6px_0px_black] anim-boom">VS</div>

              <div className={`${pixelBoxClass} anim-slide-r flex flex-col items-center p-6 sm:p-8 md:p-12 border-b-8 md:border-b-8 border-b-blue-500 min-w-[200px] sm:min-w-[250px] md:min-w-[300px]`}>
                <span className="text-3xl sm:text-4xl md:text-6xl text-blue-500 font-black mb-4 md:mb-6 block drop-shadow-[2px_2px_0px_white]">TEAM B</span>
                {teamBChar && (() => {
                  const c = CHARACTERS.find(x => x.id === teamBChar);
                  return c ? (
                    <>
                      <img src={c.img} alt={c.name} className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-4 md:mb-8 rendering-pixelated border-4 border-black bg-slate-700 p-2" />
                      <h3 className="text-4xl md:text-5xl text-white font-black mb-2 drop-shadow-[2px_2px_0px_black]">{c.name}</h3>
                      <p className="text-xl md:text-2xl text-blue-300 font-bold">{c.title}</p>
                    </>
                  ) : null;
                })()}
              </div>
              
            </div>
            <button 
              onClick={startBattle}
              className={`${pixelButtonClass} bg-red-600 hover:bg-red-500 text-white text-3xl sm:text-4xl md:text-6xl px-12 sm:px-16 md:px-20 py-4 md:py-8 animate-pulse shadow-[8px_8px_0px_rgba(0,0,0,1)] border-8`}
            >
              FIGHT!
            </button>
          </div>
        )}

        {/* --- 6. 遊戲進行中 --- */}
        {gameState === 'playing' && currentQ && (
          <div className="z-10 w-full max-w-[98%] lg:max-w-6xl flex flex-col h-full py-4 md:py-8">
            
            {/* 上方分數與狀態列 */}
            <div className="flex justify-between items-center mb-4 md:mb-8 bg-slate-900 border-4 md:border-8 border-black p-3 md:p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              
              <div className="flex items-center gap-2 md:gap-4 flex-1">
                <img src={CHARACTERS.find(c => c.id === teamAChar)?.img} className="w-12 h-12 md:w-20 md:h-20 rendering-pixelated border-2 border-red-500 bg-slate-700 hidden sm:block" alt="A" />
                <div className="flex flex-col">
                  <span className="text-xl sm:text-3xl md:text-5xl text-red-500 font-black drop-shadow-[2px_2px_0px_white]">TEAM A</span>
                  <span className="text-3xl sm:text-5xl md:text-7xl text-white font-black">{scores.teamA}</span>
                </div>
              </div>

              <div className="text-center flex-1 px-2">
                <span className="text-xl sm:text-3xl md:text-5xl text-yellow-400 font-black block drop-shadow-[2px_2px_0px_black]">ROUND {currentIndex + 1} / {questions.length}</span>
              </div>

              <div className="flex items-center gap-2 md:gap-4 justify-end flex-1">
                <div className="flex flex-col text-right">
                  <span className="text-xl sm:text-3xl md:text-5xl text-blue-500 font-black drop-shadow-[2px_2px_0px_white]">TEAM B</span>
                  <span className="text-3xl sm:text-5xl md:text-7xl text-white font-black">{scores.teamB}</span>
                </div>
                <img src={CHARACTERS.find(c => c.id === teamBChar)?.img} className="w-12 h-12 md:w-20 md:h-20 rendering-pixelated border-2 border-blue-500 bg-slate-700 hidden sm:block" alt="B" />
              </div>

            </div>

            {/* 中間題目與控制區 */}
            <div className={`${pixelBoxClass} flex-1 flex flex-col justify-between mb-4 md:mb-8 border-8`}>
              
              <div className="flex justify-between items-start mb-6 md:mb-10">
                <span className="bg-yellow-400 text-black px-3 py-1 md:px-6 md:py-2 text-lg md:text-2xl font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">{currentQ.category}</span>
                <span className={`px-3 py-1 md:px-6 md:py-2 text-lg md:text-2xl font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white ${currentQ.difficulty === '簡單' ? 'bg-green-600' : currentQ.difficulty === '中等' ? 'bg-orange-500' : 'bg-red-600'}`}>
                  {currentQ.difficulty}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center py-4 md:py-8 px-2 md:px-12">
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-white font-bold leading-tight md:leading-snug text-center drop-shadow-[4px_4px_0px_black]">
                  {currentQ.question}
                </h2>
              </div>

              {!showAnswer ? (
                <div className="flex justify-center gap-6 md:gap-12 mt-6 md:mt-10">
                  <button onClick={handleReveal} className={`${pixelButtonClass} bg-blue-600 hover:bg-blue-500 text-white text-3xl md:text-5xl px-8 md:px-16 py-4 md:py-8 w-full max-w-2xl`}>SHOW ANSWER</button>
                  <button onClick={skipQuestion} disabled={isScoring} className={`${pixelButtonClass} bg-slate-600 hover:bg-slate-500 text-white text-xl md:text-3xl px-6 md:px-8 py-4 md:py-8 opacity-70 hover:opacity-100`}>SKIP</button>
                </div>
              ) : (
                <div className="text-center mt-6 md:mt-10 animate-pulse bg-slate-900 border-4 border-yellow-400 p-4 md:p-8 shadow-[inset_0_0_20px_rgba(250,204,21,0.5)]">
                  <span className="text-2xl md:text-3xl text-yellow-400 block mb-2 font-bold">ANSWER:</span>
                  <h3 className="text-4xl sm:text-6xl md:text-8xl text-green-400 font-black drop-shadow-[4px_4px_0px_black]">{currentQ.answer}</h3>
                </div>
              )}
              
            </div>

            {/* 下方得分按鈕 */}
            {showAnswer && (
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <button onClick={() => handleScore('A')} disabled={isScoring} className={`${pixelButtonClass} bg-red-600 hover:bg-red-500 text-white text-2xl sm:text-4xl md:text-6xl py-6 md:py-10 border-8 border-black flex flex-col items-center justify-center gap-2 md:gap-4 group`}>
                  <span className="group-hover:scale-110 transition-transform">TEAM A 得分!</span>
                  <span className="text-lg md:text-2xl font-bold bg-black px-4 py-2 text-yellow-400 border-2 border-white">+ {calculatePoints(teamAChar, scores.teamA, scores.teamB, currentQ)} PT</span>
                </button>
                <button onClick={() => handleScore('B')} disabled={isScoring} className={`${pixelButtonClass} bg-blue-600 hover:bg-blue-500 text-white text-2xl sm:text-4xl md:text-6xl py-6 md:py-10 border-8 border-black flex flex-col items-center justify-center gap-2 md:gap-4 group`}>
                  <span className="group-hover:scale-110 transition-transform">TEAM B 得分!</span>
                  <span className="text-lg md:text-2xl font-bold bg-black px-4 py-2 text-yellow-400 border-2 border-white">+ {calculatePoints(teamBChar, scores.teamB, scores.teamA, currentQ)} PT</span>
                </button>
              </div>
            )}
            
            {showAnswer && (
              <div className="mt-4 flex justify-center">
                <button onClick={skipQuestion} disabled={isScoring} className={`${pixelButtonClass} bg-slate-700 hover:bg-slate-600 text-white text-xl md:text-2xl px-6 md:px-12 py-3 md:py-4 border-4 border-black`}>沒人答對 (Next)</button>
              </div>
            )}

          </div>
        )}

        {/* --- 7. 結束畫面 --- */}
        {gameState === 'end' && (
          <div className="z-10 w-full max-w-[95%] lg:max-w-6xl text-center my-auto px-2">
            <h1 className="text-6xl sm:text-8xl md:text-[8rem] text-yellow-400 font-black mb-10 md:mb-20 drop-shadow-[8px_8px_0px_black] tracking-widest leading-tight">GAME OVER</h1>
            
            <div className="flex flex-col sm:flex-row justify-center items-end gap-6 sm:gap-12 md:gap-24 mb-10 md:mb-20">
              
              <div className={`${pixelBoxClass} flex flex-col items-center p-6 md:p-12 w-full sm:w-auto ${scores.teamA >= scores.teamB ? 'transform scale-110 z-10 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'opacity-70 scale-90'}`}>
                {scores.teamA > scores.teamB && <span className="text-2xl md:text-4xl text-yellow-400 font-black mb-4 animate-bounce">★ WINNER ★</span>}
                <span className="text-3xl md:text-5xl text-red-500 font-black mb-4 drop-shadow-[2px_2px_0px_white]">TEAM A</span>
                <img src={CHARACTERS.find(c => c.id === teamAChar)?.img} className="w-24 h-24 md:w-40 md:h-40 rendering-pixelated mb-6 bg-slate-700 p-2 border-4 border-black" alt="A" />
                <span className="text-6xl md:text-8xl text-white font-black">{scores.teamA}</span>
              </div>

              <div className={`${pixelBoxClass} flex flex-col items-center p-6 md:p-12 w-full sm:w-auto ${scores.teamB >= scores.teamA ? 'transform scale-110 z-10 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'opacity-70 scale-90'}`}>
                {scores.teamB > scores.teamA && <span className="text-2xl md:text-4xl text-yellow-400 font-black mb-4 animate-bounce">★ WINNER ★</span>}
                <span className="text-3xl md:text-5xl text-blue-500 font-black mb-4 drop-shadow-[2px_2px_0px_white]">TEAM B</span>
                <img src={CHARACTERS.find(c => c.id === teamBChar)?.img} className="w-24 h-24 md:w-40 md:h-40 rendering-pixelated mb-6 bg-slate-700 p-2 border-4 border-black" alt="B" />
                <span className="text-6xl md:text-8xl text-white font-black">{scores.teamB}</span>
              </div>

            </div>

            <button 
              onClick={initGame}
              className={`${pixelButtonClass} bg-green-600 hover:bg-green-500 text-white text-3xl sm:text-5xl md:text-6xl px-12 sm:px-16 md:px-24 py-6 md:py-8 animate-pulse border-8`}
            >
              PLAY AGAIN
            </button>
          </div>
        )}

      </div>
    </div>
  );
}