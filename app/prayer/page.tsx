'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// 40組天父回信資料庫 (沿用你之前的資料庫，或者未來你可以換成禱告專屬的版本)
const heavenlyLetters = [
  { keywords: ['累', '重擔', '疲倦', '辛苦', '撐不下去', '休息', '壓力', '喘不過氣'], text: "親愛的孩子，你寫下的每一個字，我都仔細聽見了。\n\n我知道你有時會感到疲憊，覺得肩膀上的擔子好重。但請記得，你不必獨自面對這一切。我愛你，勝過這世界上的任何事物。把你的擔憂交給我吧，我會為你開路，賜給你平靜安穩的力量。", verse: "「凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。」", ref: "— 馬太福音 11:28" },
  { keywords: ['迷茫', '害怕', '未來', '不知道', '方向', '恐懼', '迷路'], text: "親愛的孩子，我看見了你心裡的擔憂與迷茫。\n\n未來的路或許看起來有些模糊，但我是牽著你手的那一位。不要害怕犯錯，也不要害怕未知，因為我的恩典夠你用。勇敢地往前走吧，我會一直在你身旁保護你、引導你。", verse: "「你不要害怕，因為我與你同在；不要驚惶，因為我是你的神。」", ref: "— 以賽亞書 41:10" },
  { keywords: ['心願', '祈求', '渴望', '希望', '想要', '等待', '盼望', '夢想'], text: "親愛的孩子，你心裡渴望完成的心願，我完全明白。\n\n我是創造一切美好事物的源頭，我對你的生命有一個極美好的計畫。耐心等候，繼續保持你的善良與信心，我會用最適合的時間和方式，把這份最美好的禮物送到你手中。", verse: "「應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。」", ref: "— 腓立比書 4:6" },
  { keywords: ['軟弱', '跌倒', '做錯', '自責', '不夠好', '失敗'], text: "親愛的孩子，不要因為覺得自己做得不夠好而自責。\n\n我知道你的軟弱，但在我看來，你依然如此寶貴。當你覺得自己無能為力的時候，正是我要在你生命中彰顯大能的時候。依靠我，我會給你重新站起來的勇氣。", verse: "「我的恩典夠你用的，因為我的能力是在人的軟弱上顯得完全。」", ref: "— 哥林多後書 12:9" },
  { keywords: ['孤單', '一個人', '沒人懂', '邊緣', '寂寞', '不理解'], text: "親愛的孩子，當你覺得全世界都不理解你的時候，請記得我懂。\n\n我數過你掉下的每一滴眼淚。你從來不是一個人，我的愛永遠不會離開你。安靜下來，用心體會，我那份超越一切理解的愛，正緊緊擁抱著你。", verse: "「我總不撇下你，也不丟棄你。」", ref: "— 希伯來書 13:5" },
  { keywords: ['焦慮', '擔心', '睡不著', '煩躁', '不安', '緊張'], text: "親愛的孩子，我看到你心裡那些翻騰的思緒與焦慮。\n\n深呼吸，把一切無法掌控的事情都交在我的手中。我賜給你的不是膽怯的心，而是平安。這份平安能保守你的心懷意念，讓你在風暴中依然能安穩入睡。", verse: "「我留下平安給你們；我將我的平安賜給你們。你們心裡不要憂愁，也不要膽怯。」", ref: "— 約翰福音 14:27" },
  { keywords: ['十字路口', '選擇', '決定', '不知道怎麼辦', '指引', '猶豫'], text: "親愛的孩子，當你走到十字路口，不知道該往哪裡去時，呼求我吧。\n\n我是那指引你道路的真光。當你專心仰賴我，不倚靠自己的聰明，我會清楚地為你指出當行的路。一步一步走，我會照亮你前方的腳步。", verse: "「你要專心仰賴耶和華，不可倚靠自己的聰明，在你一切所行的事上都要認定他，他必指引你的路。」", ref: "— 箴言 3:5-6" },
  { keywords: ['挫折', '打擊', '輸了', '沒考好', '被拒絕', '放棄'], text: "親愛的孩子，失敗並不代表結束，它只是生命旅程中的一小段。\n\n即便跌倒，我也會用我公義的右手扶持你。萬事互相效力，這個挫折最終會成為你生命中美好的見證與養分。抬起頭來，我的恩典為你預備了更寬廣的路。", verse: "「因為義人跌倒七次，必再起來。」", ref: "— 箴言 24:16" },
  { keywords: ['心碎', '難過', '想哭', '悲傷', '失戀', '痛', '分手'], text: "親愛的孩子，當你的心碎了，我會靠近你，為你裹傷。\n\n我明白你正在經歷的痛楚。你不需要假裝堅強，在我的懷抱裡，你可以盡情哭泣。我會醫治你破碎的心，並在未來的日子裡，用喜樂油代替你的悲哀。", verse: "「耶和華靠近傷心的人，拯救靈性痛悔的人。」", ref: "— 詩篇 34:18" },
  { keywords: ['缺乏', '沒錢', '不夠', '窮', '資源', '匱乏'], text: "親愛的孩子，當你感到資源匱乏、好像什麼都不夠的時候，請看向我。\n\n我是耶和華以勒，是為你預備的那一位。我顧念你一切的需要。先求我的國和我的義，你所擔心的一切所需用的，我都會豐豐富富地加添給你。", verse: "「我的神必照他榮耀的豐富，在基督耶穌裡，使你們一切所需用的都充足。」", ref: "— 腓立比書 4:19" },
  { keywords: ['病', '痛', '醫治', '健康', '不舒服', '生病'], text: "親愛的孩子，我看見你身體的軟弱與病痛，我的心與你同在。\n\n我是耶和華拉法，是醫治你的神。請把你的病痛交託在我的手中，因我受的鞭傷，你必得醫治。安心在我的懷抱裡休養，我會賜給你意想不到的平安與恢復的力量。", verse: "「哪知他為我們的過犯受害，為我們的罪孽壓傷。因他受的刑罰，我們得平安；因他受的鞭傷，我們得醫治。」", ref: "— 以賽亞書 53:5" },
  { keywords: ['家人', '父母', '孩子', '關係', '和好', '家'], text: "親愛的孩子，我知道你為了家人的關係而掛心。\n\n我是一切家庭與愛的源頭。把你的家人交在我的手中吧！我也愛他們。我會親自動工，修復那些破裂的關係，用我的愛來融化一切的堅冰。請繼續帶著愛與耐心去守望，我必成就美好的事。", verse: "「當信主耶穌，你和你一家都必得救。」", ref: "— 使徒行傳 16:31" },
  { keywords: ['朋友', '同學', '同事', '祝福', '為別人'], text: "親愛的孩子，看到你如此用心為身邊的朋友代禱，我非常喜悅。\n\n你的愛心與代求，在天上已經蒙了紀念。我會親自看顧你所掛念的這些人，將你的祝福化為他們生命中真實的恩典。你也要知道，使人和睦的人有福了！", verse: "「我勸你，第一要為萬人懇求、禱告、代求、祝謝。」", ref: "— 提摩太前書 2:1" }
];

// 預設圖片 (偏向清晨、微光、安靜的風格)
const illustrationImages = [
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1444464666168-49b626f86221?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80"
];

// 處理滾動淡入的自訂 Hook
function useOnScreen(options: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);

  return [ref, isVisible] as const;
}

function FadeSection({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.3 });
  return (
    <div ref={ref} className={`container transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
}

export default function PrayerTool() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'letter'>('input');
  const [prayerText, setPrayerText] = useState('');
  const [prayerError, setPrayerError] = useState(false);
  const [letterData, setLetterData] = useState<any>(null);
  const [letterImage, setLetterImage] = useState('');

  const handleSubmit = () => {
    if (prayerText.trim() === '') {
      setPrayerError(true);
      return;
    }
    setPrayerError(false);
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

      let selectedLetter;
      if (highestScore === 0) {
        selectedLetter = heavenlyLetters[Math.floor(Math.random() * heavenlyLetters.length)];
      } else {
        selectedLetter = candidateLetters[Math.floor(Math.random() * candidateLetters.length)];
      }

      setLetterData(selectedLetter);
      setLetterImage(illustrationImages[Math.floor(Math.random() * illustrationImages.length)]);
      setModalState('letter');
    }, 1800);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalState('input');
      setPrayerText('');
      setPrayerError(false);
    }, 400);
  };

  return (
    <div className="bg-[#F4F7F9] text-[#3A4A5A] font-sans min-h-screen selection:bg-[#6EB5C0] selection:text-white pb-20">
      <Head>
        <title>禱告的大能 - 與天父的對話</title>
      </Head>

      <nav className="fixed top-0 w-full p-6 z-50 flex justify-start">
        <Link href="/" className="text-[#7B8B9A] hover:text-[#3A4A5A] font-medium transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]/50">
          ← 返回老詩歌吉他譜
        </Link>
      </nav>

      {/* 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="text-center mb-12 max-w-[650px] z-10 mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium text-[#3A4A5A] mb-6 tracking-widest">禱告的大能</h1>
            
            <div className="mx-auto mb-10 max-w-[500px]">
              <p className="text-[#7B8B9A] text-base mb-4 tracking-wide">安靜心，讓我們用這首詩歌來到祂面前：</p>
              <div className="text-[#3A4A5A] text-lg leading-loose font-light">
                <div className="font-medium mb-2 text-[#5C8CA6]">《我以禱告來到你面前》</div>
                我以禱告來到你面前，我要尋求你，<br/>
                我要站在破口之中，在那裡我尋求你。<br/>
                每一次我禱告，我搖動你的手，<br/>
                禱告做的事，我的手不能做。<br/>
                每一次我禱告，大山被挪移，<br/>
                道路被鋪平，使列國歸向你。
              </div>
            </div>

            <div className="bg-[#5C8CA6]/10 border-l-4 border-[#5C8CA6] px-6 py-5 mb-10 text-left rounded-r-lg">
              <p className="text-lg font-medium leading-relaxed mb-3 text-[#3A4A5A]">「你們祈求，就給你們；尋找，就尋見；叩門，就給你們開門。因為凡祈求的，就得著；尋找的，就尋見；叩門的，就給他開門。你們中間誰有兒子求餅，反給他石頭呢？求魚，反給他蛇呢？你們雖然不好，尚且知道拿好東西給兒女，何況你們在天上的父，豈不更把好東西給求他的人嗎？」</p>
              <p className="text-sm text-[#7B8B9A] italic">— 馬太福音 7:7-11</p>
            </div>
          </div>
          
          <div className="w-full h-[150px] flex justify-center items-center relative mx-auto mb-10">
            <svg viewBox="0 0 400 150" className="w-full h-full max-w-[500px] overflow-visible">
              <circle cx="200" cy="75" r="4" fill="#6EB5C0" />
              <circle cx="200" cy="75" r="30" fill="none" stroke="#6EB5C0" strokeWidth="2" opacity="0.6" strokeDasharray="4 4"/>
              <circle cx="200" cy="75" r="60" fill="none" stroke="#8E9AAF" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>
        </FadeSection>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 animate-bounce">
          <span className="text-xs tracking-widest mb-2 text-[#7B8B9A]">探索禱告的旅程</span>
          <div className="w-px h-10 bg-[#7B8B9A]"></div>
        </div>
      </section>

      {/* 1. 祈求 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible">
              <path d="M120 180 C 150 200, 250 200, 280 180" fill="none" stroke="#7B8B9A" strokeWidth="3" strokeLinecap="round"/>
              <path d="M150 185 C 170 195, 230 195, 250 185" fill="none" stroke="#7B8B9A" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="200" cy="140" r="12" fill="#6EB5C0" />
              <path d="M190 110 Q 200 90, 210 110" fill="none" stroke="#6EB5C0" strokeWidth="2" opacity="0.5"/>
              <path d="M180 80 Q 200 50, 220 80" fill="none" stroke="#6EB5C0" strokeWidth="2" opacity="0.3"/>
              <text x="200" y="240" textAnchor="middle" className="text-base font-medium fill-[#6EB5C0]">1. 祈求 (Ask)</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#3A4A5A]">第一步：建立信心的根基 <span className="text-[#6EB5C0] font-medium">(祈求)</span></h2>
            <ul className="text-left inline-block max-w-[550px] mx-auto mb-6 text-lg">
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#6EB5C0] before:leading-[1.2]">
                <strong>信心的約：</strong>神透過應許，將祂自己與我們緊緊綁在一起。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#6EB5C0] before:leading-[1.2]">
                <strong>信心的對象：</strong>禱告不是對空氣說話，而是向那位與我們立約的神呼求。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#6EB5C0] before:leading-[1.2]">
                <strong>回轉向神：</strong>當遇到難處，我們的第一步就是求告祂。
              </li>
            </ul>
            <p className="text-lg"><strong>祂承諾給予，因為祂是守約施慈愛的天父。</strong></p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 尋找 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible">
              <circle cx="200" cy="120" r="40" fill="none" stroke="#8E9AAF" strokeWidth="4" />
              <circle cx="200" cy="120" r="15" fill="#8E9AAF" opacity="0.8" />
              <line x1="200" y1="30" x2="200" y2="70" stroke="#8E9AAF" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="200" y1="170" x2="200" y2="210" stroke="#8E9AAF" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="110" y1="120" x2="150" y2="120" stroke="#8E9AAF" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="250" y1="120" x2="290" y2="120" stroke="#8E9AAF" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <text x="200" y="240" textAnchor="middle" className="text-base font-medium fill-[#8E9AAF]">2. 尋找 (Seek)</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#3A4A5A]">第二步：經歷信心的過程 <span className="text-[#8E9AAF] font-medium">(尋找)</span></h2>
            <ul className="text-left inline-block max-w-[550px] mx-auto mb-6 text-lg">
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#8E9AAF] before:leading-[1.2]">
                <strong>不只是求：</strong>不再只停留在求好處，而是主動尋求認識神、親近神。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#8E9AAF] before:leading-[1.2]">
                <strong>信心操練：</strong>在禱告中操練信心，也在信心裡尋求神的心意。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#8E9AAF] before:leading-[1.2]">
                <strong>目光轉向：</strong>將眼光從「律法中的祝福」，轉向「賜恩典的主」。
              </li>
            </ul>
            <p className="text-lg"><strong>尋找的過程，就是我們與天父關係更深的時刻。</strong></p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 叩門 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible">
              <rect x="140" y="50" width="120" height="160" fill="none" stroke="#7B8B9A" strokeWidth="3" />
              <polygon points="140,50 220,30 220,190 140,210" fill="#B5A2C4" opacity="0.2" stroke="#B5A2C4" strokeWidth="2"/>
              <path d="M 220 30 L 300 10 L 300 230 L 220 190 Z" fill="url(#light-gradient)" opacity="0.5"/>
              <defs>
                <linearGradient id="light-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B5A2C4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#B5A2C4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="205" cy="130" r="4" fill="#B5A2C4" />
              <text x="200" y="240" textAnchor="middle" className="text-base font-medium fill-[#B5A2C4]">3. 叩門 (Knock)</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#3A4A5A]">第三步：渴慕天父的同在 <span className="text-[#B5A2C4] font-medium">(叩門)</span></h2>
            <ul className="text-left inline-block max-w-[550px] mx-auto mb-6 text-lg">
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#B5A2C4] before:leading-[1.2]">
                <strong>遇見神：</strong>不單單滿足於問題被解決，更是渴望遇見神自己。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#B5A2C4] before:leading-[1.2]">
                <strong>沒有條件：</strong>「因為凡...」代表沒有其他門檻，有求必有回應。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#B5A2C4] before:leading-[1.2]">
                <strong>進入同在：</strong>叩門，是為了要真真實實地進入天父的同在裡。
              </li>
            </ul>
            <p className="text-lg"><strong>叩開的不是一扇門，而是進入天父永恆的擁抱。</strong></p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 明白天父的好東西 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] flex justify-center items-center relative mx-auto mb-8">
            <svg viewBox="0 0 400 250" className="w-full h-full max-w-[500px] overflow-visible">
              <path d="M 200 180 C 200 180, 140 120, 140 85 C 140 50, 190 40, 200 75 C 210 40, 260 50, 260 85 C 260 120, 200 180, 200 180 Z" fill="none" stroke="#5C8CA6" strokeWidth="4" strokeLinejoin="round"/>
              <circle cx="200" cy="100" r="25" fill="#5C8CA6" opacity="0.1" />
              <line x1="200" y1="75" x2="200" y2="125" stroke="#5C8CA6" strokeWidth="3" strokeLinecap="round"/>
              <line x1="185" y1="95" x2="215" y2="95" stroke="#5C8CA6" strokeWidth="3" strokeLinecap="round"/>
              <text x="200" y="240" textAnchor="middle" className="text-base font-medium fill-[#5C8CA6]">4. 明白天父的好東西</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#3A4A5A]">關鍵：明白天父的 <span className="text-[#5C8CA6] font-medium">「好東西」</span></h2>
            <ul className="text-left inline-block max-w-[550px] mx-auto mb-6 text-lg">
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#5C8CA6] before:leading-[1.2]">
                <strong>相同的 DNA：</strong>禱告不是法律規定，而是出自生命與愛的連結，我們是祂的兒女。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#5C8CA6] before:leading-[1.2]">
                <strong>看似堅硬的恩典：</strong>神給的看似辛苦（如十字架），其實是生命最需要的養分。
              </li>
              <li className="relative pl-6 mb-3 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-2xl before:text-[#5C8CA6] before:leading-[1.2]">
                <strong>永恆的預備：</strong>地上的父親為今生打算，但天父為我們預備的是永生與得勝。
              </li>
            </ul>
            <p className="text-lg"><strong>祂給的不只是短暫的滿足，而是永恆最美好的禮物。</strong></p>
          </div>
        </FadeSection>
      </section>

      {/* 結尾行動呼籲 */}
      <section className="flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#3A4A5A]">現在，換你來敲門了</h2>
            <p className="text-lg mb-4">天父正在等候聽你的聲音。<br/>不論是你自己正面臨的挑戰、需要做的決定，或是你心裡掛念的家人、朋友...</p>
            <p className="text-lg mb-10 text-[#5C8CA6] font-medium">大膽地寫下你最真實的需要，為那個人祈求祝福吧！</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-10 py-4 bg-[#5C8CA6] hover:bg-[#4A7A94] text-white rounded-full text-lg tracking-wider transition-all shadow-[0_6px_15px_rgba(92,140,166,0.25)] hover:shadow-[0_8px_25px_rgba(92,140,166,0.4)] hover:-translate-y-1"
            >
              我要寫下我的禱告
            </button>
          </div>
        </FadeSection>
      </section>

      {/* 互動彈出視窗 (Modal) */}
      <div 
        className={`fixed inset-0 w-full h-full bg-[#3A4A5A]/65 backdrop-blur-md flex justify-center items-center z-[1000] transition-opacity duration-400 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className={`bg-white w-[90%] max-w-[520px] rounded-2xl p-8 md:p-11 shadow-[0_15px_50px_rgba(0,0,0,0.15)] relative transition-transform duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0' : 'translate-y-5'}`}>
          <button 
            onClick={closeModal}
            className="absolute top-5 right-5 bg-transparent border-none text-3xl text-[#7B8B9A] hover:text-[#3A4A5A] cursor-pointer transition-colors"
          >
            &times;
          </button>
          
          {modalState === 'input' && (
            <div>
              <h3 className="text-2xl font-medium mb-4 text-[#5C8CA6]">親愛的天父...</h3>
              <p className="text-[1.05rem] text-[#7B8B9A] mb-6 leading-relaxed">請寫下你目前最真實的需要、你想突破的困境，或是你想為誰（家人/朋友）祈求祝福？這份禱告卡只有你和天父知道。</p>
              <textarea 
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder={prayerError ? "請先寫下一些祈求的話喔..." : "我想祈求..."}
                className={`w-full h-[160px] p-5 border rounded-xl resize-none font-sans text-[1.05rem] text-[#3A4A5A] bg-[#F8FAFC] focus:bg-white focus:outline-none transition-all mb-6 leading-relaxed ${prayerError ? 'border-[#B5A2C4]' : 'border-[#D1D9E0] focus:border-[#5C8CA6] focus:ring-4 focus:ring-[#5C8CA6]/10'}`}
              />
              <button 
                onClick={handleSubmit}
                className="w-full py-4 bg-[#5C8CA6] hover:bg-[#4A7A94] text-white rounded-full text-lg tracking-wider transition-all shadow-[0_6px_15px_rgba(92,140,166,0.25)] hover:shadow-[0_8px_25px_rgba(92,140,166,0.4)]"
              >
                送出我的禱告
              </button>
            </div>
          )}

          {modalState === 'loading' && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#5C8CA6]/20 border-t-[#5C8CA6] rounded-full mx-auto mb-6 animate-spin"></div>
              <p className="text-[#3A4A5A] text-[1.1rem]">正在將你的禱告帶到天父面前...</p>
            </div>
          )}

          {modalState === 'letter' && letterData && (
            <div className="text-left bg-white rounded-xl">
              <img 
                src={letterImage} 
                alt="禱告回應插畫" 
                className="w-full h-[200px] object-cover rounded-xl mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
                style={{ filter: 'contrast(0.9) saturate(1.1) brightness(1.05)' }}
              />
              <h3 className="text-xl font-normal text-[#7B8B9A] mb-5 tracking-wide">💌 來自天父的回應</h3>
              <div className="text-[1.15rem] mb-8 leading-[1.85] whitespace-pre-wrap text-[#3A4A5A]">
                {letterData.text}
              </div>
              <div className="bg-[#F4F7F9] p-5 border-l-4 border-[#5C8CA6] rounded-lg">
                <p className="text-[1.05rem] font-medium mb-2 text-[#3A4A5A] leading-relaxed">{letterData.verse}</p>
                <p className="text-[0.95rem] text-[#7B8B9A] text-right italic m-0">{letterData.ref}</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}