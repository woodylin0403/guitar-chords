'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// 40組天父回信資料庫
const heavenlyLetters = [
  { keywords: ['累', '重擔', '疲倦', '辛苦', '撐不下去', '休息', '壓力', '喘不過氣'], text: "親愛的孩子，你寫下的每一個字，我都仔細聽見了。\n\n我知道你有時會感到疲憊，覺得肩膀上的擔子好重。但請記得，你不必獨自面對這一切。我愛你，勝過這世界上的任何事物。把你的擔憂交給我吧，我會為你開路，賜給你平靜安穩的力量。", verse: "「凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。」", ref: "— 馬太福音 11:28" },
  { keywords: ['迷茫', '害怕', '未來', '不知道', '方向', '恐懼', '迷路'], text: "親愛的孩子，我看見了你心裡的擔憂與迷茫。\n\n未來的路或許看起來有些模糊，但我是牽著你手的那一位。不要害怕犯錯，也不要害怕未知，因為我的恩典夠你用。勇敢地往前走吧，我會一直在你身旁保護你、引導你。", verse: "「你不要害怕，因為我與你同在；不要驚惶，因為我是你的神。」", ref: "— 以賽亞書 41:10" },
  { keywords: ['心願', '祈求', '渴望', '希望', '想要', '等待', '盼望', '夢想'], text: "親愛的孩子，你心裡渴望完成的心願，我完全明白。\n\n我是創造一切美好事物的源頭，我對你的生命有一個極美好的計畫。耐心等候，繼續保持你的善良與信心，我會用最適合的時間和方式，把這份最美好的禮物送到你手中。", verse: "「應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。」", ref: "— 腓立比書 4:6" },
  { keywords: ['軟弱', '跌倒', '做錯', '自責', '不夠好', '失敗'], text: "親愛的孩子，不要因為覺得自己做得不夠好而自責。\n\n我知道你的軟弱，但在我看來，你依然如此寶貴。當你覺得自己無能為力的時候，正是我要在你生命中彰顯大能的時候。依靠我，我會給你重新站起來的勇氣。", verse: "「我的恩典夠你用的，因為我的能力是在人的軟弱上顯得完全。」", ref: "— 哥林多後書 12:9" },
  { keywords: ['孤單', '一個人', '沒人懂', '邊緣', '寂寞', '不理解'], text: "親愛的孩子，當你覺得全世界都不理解你的時候，請記得我懂。\n\n我數過你掉下的每一滴眼淚。你從來不是一個人，我的愛永遠不會離開你。安靜下來，用心體會，我那份超越一切理解的愛，正緊緊擁抱著你。", verse: "「我總不撇下你，也不丟棄你。」", ref: "— 希伯來書 13:5" },
  { keywords: ['價值', '比較', '沒自信', '自卑', '醜', '笨', '沒用'], text: "親愛的孩子，你的價值不是建立在成績、外表或別人的評價上。\n\n你在我眼中是無價之寶，是我用重價贖回來的。不要再試圖透過別人的眼光來證明自己。只要安息在我的愛裡，你就會發現你原本就閃閃發光。", verse: "「因我看你為寶為尊；又因我愛你。」", ref: "— 以賽亞書 43:4" },
  { keywords: ['焦慮', '擔心', '睡不著', '煩躁', '不安', '緊張'], text: "親愛的孩子，我看到你心裡那些翻騰的思緒與焦慮。\n\n深呼吸，把一切無法掌控的事情都交在我的手中。我賜給你的不是膽怯的心，而是平安。這份平安能保守你的心懷意念，讓你在風暴中依然能安穩入睡。", verse: "「我留下平安給你們；我將我的平安賜給你們。你們心裡不要憂愁，也不要膽怯。」", ref: "— 約翰福音 14:27" },
  { keywords: ['十字路口', '選擇', '決定', '不知道怎麼辦', '指引', '猶豫'], text: "親愛的孩子，當你走到十字路口，不知道該往哪裡去時，呼求我吧。\n\n我是那指引你道路的真光。當你專心仰賴我，不倚靠自己的聰明，我會清楚地為你指出當行的路。一步一步走，我會照亮你前方的腳步。", verse: "「你要專心仰賴耶和華，不可倚靠自己的聰明，在你一切所行的事上都要認定他，他必指引你的路。」", ref: "— 箴言 3:5-6" },
  { keywords: ['挫折', '打擊', '輸了', '沒考好', '被拒絕', '放棄'], text: "親愛的孩子，失敗並不代表結束，它只是生命旅程中的一小段。\n\n即便跌倒，我也會用我公義的右手扶持你。萬事互相效力，這個挫折最終會成為你生命中美好的見證與養分。抬起頭來，我的恩典為你預備了更寬廣的路。", verse: "「因為義人跌倒七次，必再起來。」", ref: "— 箴言 24:16" },
  { keywords: ['心碎', '難過', '想哭', '悲傷', '失戀', '痛', '分手'], text: "親愛的孩子，當你的心碎了，我會靠近你，為你裹傷。\n\n我明白你正在經歷的痛楚。你不需要假裝堅強，在我的懷抱裡，你可以盡情哭泣。我會醫治你破碎的心，並在未來的日子裡，用喜樂油代替你的悲哀。", verse: "「耶和華靠近傷心的人，拯救靈性痛悔的人。」", ref: "— 詩篇 34:18" },
  { keywords: ['缺乏', '沒錢', '不夠', '窮', '資源', '匱乏'], text: "親愛的孩子，當你感到資源匱乏、好像什麼都不夠的時候，請看向我。\n\n我是耶和華以勒，是為你預備的那一位。我顧念你一切的需要。先求我的國和我的義，你所擔心的一切所需用的，我都會豐豐富富地加添給你。", verse: "「我的神必照他榮耀的豐富，在基督耶穌裡，使你們一切所需用的都充足。」", ref: "— 腓立比書 4:19" },
  { keywords: ['死水', '無聊', '懊悔', '重新', '後悔', '重來'], text: "親愛的孩子，如果你覺得生活像一灘死水，渴望改變，請來到我面前。\n\n我是使一切更新的神。若你在基督裡，你就是新造的人。把過去的懊悔放下吧，我每一天都賜給你全新的開始。接受我的愛，讓你的生命再次充滿活力。", verse: "「若有人在基督裡，他就是新造的人，舊事已過，都變成新的了。」", ref: "— 哥林多後書 5:17" },
  { keywords: ['等候', '煎熬', '太久', '沒耐心', '什麼時候'], text: "親愛的孩子，等候的過程有時令人心焦，但我希望你能相信我的時間表。\n\n我在為你預備最好的。在等候中，不要急躁，專心尋求我的面。那些等候我的，必重新得力，他們必如鷹展翅上騰。", verse: "「但那等候耶和華的必重新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。」", ref: "— 以賽亞書 40:31" },
  { keywords: ['不配', '罪惡感', '糟糕', '原諒', '髒'], text: "親愛的孩子，有時你會覺得自己不夠好，不配得到這份愛。\n\n但你要知道，我的愛是無條件的禮物。你不需要靠自己努力去賺取。因為我愛你，所以你在我眼中就是完美的。坦然無懼地來到我的施恩寶座前吧，我充滿了憐憫。", verse: "「我們愛，因為神先愛我們。」", ref: "— 約翰一書 4:19" },
  { keywords: ['人際', '吵架', '生氣', '委屈', '討厭', '朋友', '關係'], text: "親愛的孩子，人與人之間的摩擦常常會帶來傷害。\n\n當你感到生氣或委屈時，把這些情緒交給我。讓我用我的愛充滿你，使你有力量去寬恕。正如我饒恕了你一樣，學著去愛，你就能在這個過程中得到真正的釋放與自由。", verse: "「要以恩慈相待，存憐憫的心，彼此饒恕，正如神在基督裡饒恕了你們一樣。」", ref: "— 以弗所書 4:32" },
  { keywords: ['退縮', '不敢', '逃避', '懦弱'], text: "親愛的孩子，面對前面的挑戰，你是不是感到有些退縮？\n\n我是賜剛強、仁愛、謹守之心的神。你要剛強壯膽！不要因為環境艱難就氣餒，因為無論你走到哪裡，我都會與你同去。我必不撇下你。", verse: "「我豈沒有吩咐你嗎？你當剛強壯膽！不要懼怕，也不要驚惶；因為你無論往哪裡去，耶和華你的神必與你同在。」", ref: "— 約書亞記 1:9" },
  { keywords: ['絕望', '世界', '不公', '灰心', '爛', '社會'], text: "親愛的孩子，這個世界有時充滿了苦難和不公，讓你感到灰心。\n\n但在這個世界上有苦難，在我裡面有平安。請你放心，我已經勝過了這個世界。將你的目光定睛在永恆的盼望上，我會成為你在黑暗中最亮的光。", verse: "「在世上，你們有苦難；但你們可以放心，我已經勝了世界。」", ref: "— 約翰福音 16:33" },
  { keywords: ['誘惑', '試探', '癮', '戒不掉', '掙扎', '慾望'], text: "親愛的孩子，我知道你正在與心中的試探和誘惑抗爭。\n\n我不會讓你受試探過於你所能受的。當你覺得快要撐不下去時，呼求我的名，我一定會為你開一條出路。靠著我的靈，你必定能戰勝這些掙扎。", verse: "「在受試探的時候，總要給你們開一條出路，叫你們能忍受得住。」", ref: "— 哥林多前書 10:13" },
  { keywords: ['遺忘', '忽略', '邊緣人', '沒人在乎', '透明'], text: "親愛的孩子，你是不是覺得自己被大家遺忘了，好像沒有人真正在乎你？\n\n即便婦人忘記她吃奶的嬰孩，我也不會忘記你。我已將你的名字銘刻在我的掌上。你是我所深愛的，我時時刻刻都在看顧著你。", verse: "「看哪，我將你銘刻在我掌上。」", ref: "— 以賽亞書 49:16" },
  { keywords: ['開心', '謝謝'], text: "親愛的孩子，看到你帶著感恩的心來到我面前，我非常喜悅。\n\n繼續保持這份讚美的心吧！感恩能打開天上窗戶的祝福。願你的生命如同這明亮的陽光一樣，成為周圍人的祝福，並常常結出喜樂的果子。", verse: "「常常喜樂，不住的禱告，凡事謝恩；因為這是神在基督耶穌裡向你們所定的旨意。」", ref: "— 帖撒羅尼迦前書 5:16-18" },
  { keywords: ['突破', '擴張', '舒適圈', '限制', '提升'], text: "親愛的孩子，我知道你現在過得不錯，但我為你預備的遠不止於此。\n\n現在是跨出舒適圈的時候了！不要被現有的成就限制住，我要擴張你的境界。勇敢地撐大你的帳幕，向左向右開展吧！我會賜給你前所未有的能力與視野，帶你進入更寬廣的豐盛。", verse: "「要擴張你帳幕之地，張大你居所的幔子，不要限制；要放長你的繩子，堅固你的橛子。」", ref: "— 以賽亞書 54:2" },
  { keywords: ['進步', '改變', '更新', '改變自己', '變好'], text: "親愛的孩子，你看見自己的成長了嗎？我為你感到驕傲！\n\n但我對你的計畫是「榮上加榮」。你的生命就像一面鏡子，正逐漸反射出我的榮耀。繼續保持一顆敞開的心，我會持續雕琢你，讓你的生命展現出超越現在的美麗與光彩。", verse: "「我們眾人既然敞著臉得以看見主的榮光... 就變成主的形狀，榮上加榮，如同從主的靈變成的。」", ref: "— 哥林多後書 3:18" },
  { keywords: ['豐富', '滿足', '充實', '美好', '豐富'], text: "親愛的孩子，你渴望生命中有更多的熱情與動力嗎？\n\n我來到這世界，不只是為了讓你勉強度日，而是要讓你得著「更豐盛」的生命。打開你的心，準備好迎接我那源源不絕的創意、喜樂與熱情，我會讓你的人生充滿驚喜與意義！", verse: "「我來了，是要叫羊得生命，並且得的更豐盛。」", ref: "— 約翰福音 10:10" },
  { keywords: ['新', '開始', '創意', '不同', '改變現狀'], text: "親愛的孩子，如果你覺得日子開始一成不變，注意了，我正在為你準備新的季節！\n\n不要一直回頭看過去的成功或失敗，因為我將要在你的生命中做一件「新事」。我會在沙漠中為你開江河，在曠野中為你開道路。帶著期待的心，迎接我為你量身打造的嶄新旅程吧！", verse: "「看哪，我要做一件新事；如今要發現，你們豈不知道嗎？我必在曠野開道路，在沙漠開江河。」", ref: "— 以賽亞書 43:19" },
  { keywords: ['成就', '超越', '想像', '期待', '大計劃'], text: "親愛的孩子，你的夢想很美，但我的計畫比你的夢想還要宏大。\n\n不要限制我能為你成就的事。把你心裡的願望交給我，因為我能照著運行在你心裡的大能，充充足足地成就一切，甚至遠超過你所求所想的！準備好迎接超乎想像的祝福吧！", verse: "「神能照著運行在我們心裡的大力充充足足的成就一切，超過我們所求所想的。」", ref: "— 以弗所書 3:20" },
  { keywords: ['飛', '高', '力量', '再創', '巔峰'], text: "親愛的孩子，你已經做得很好，現在是時候讓你「展翅上騰」了！\n\n有時候，好的事物會讓你感到安逸，但我呼召你像老鷹一樣，乘著聖靈的風飛向更高的高度。當你定睛仰望我，你將會獲得源源不絕的嶄新力量，奔跑卻不困倦！", verse: "「但那等候耶和華的必重新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。」", ref: "— 以賽亞書 40:31" },
  { keywords: ['深', '探索', '冒險', '勇敢', '嘗試'], text: "親愛的孩子，你在淺水區已經學會了游泳，現在我邀請你和我一起「開到水深之處」。\n\n不要害怕未知的領域，最豐盛的漁獲往往在最深的水域。跨出你熟悉的安全地帶，勇敢地回應我的呼召，你將會看見前所未見的奇妙收穫與神蹟！", verse: "「耶穌對西門說：『把船開到水深之處，下網打魚。』」", ref: "— 路加福音 5:4" },
  { keywords: ['光', '明亮', '前途', '順利', '發展'], text: "親愛的孩子，為你現在所擁有的一切感恩，因為這只是一個美好的開始！\n\n你的人生軌跡在我的手中，只會越來越明亮。就像清晨的曙光，雖然一開始是微光，但會逐漸照耀，直到日午的耀眼。不要停下腳步，繼續行在我的真理中，未來的光景將會燦爛無比。", verse: "「但義人的路好像黎明的光，越照越明，直到日午。」", ref: "— 箴言 4:18" },
  { keywords: ['成果', '收穫', '結果', '影響力', '發揮'], text: "親愛的孩子，你是一棵栽在溪水旁的樹，現在是你結出更多果子的季節！\n\n只要你常在我裡面，我也常在你裡面，你的生命自然就會結出豐盛的果實。這份果實不僅會豐富你的人生，更會成為周遭許多人的祝福。享受與我連結的養分吧！", verse: "「我是葡萄樹，你們是枝子。常在我裡面的，我也常在他裡面，這人就多結果子。」", ref: "— 約翰福音 15:5" },
  { keywords: ['計畫', '指望', '藍圖', '安排', '更好'], text: "親愛的孩子，即使現在看起來一切順利，你仍可以對未來抱持著更大的期待！\n\n因為我對你的意念，是賜平安的意念，不是降災禍的意念。我為你的未來繪製了一幅充滿希望的藍圖。大膽地夢想吧，因為你擁有一個為你預備美好未來的阿爸父。", verse: "「耶和華說：我知道我向你們所懷的意念是賜平安的意念，不是降災禍的意念，要叫你們末後有指望。」", ref: "— 耶利米書 29:11" },
  { keywords: ['目標', '前進', '放下', '追求', '標竿'], text: "親愛的孩子，過去的成功很美好，但不要讓它成為你停止前進的理由。\n\n我鼓勵你「忘記背後，努力面前」。前方還有更高、更榮耀的標竿等著你去觸摸。清空你的雙手，準備好領受我為你在基督耶穌裡預備的那份更大的獎賞吧！", verse: "「我只有一件事，就是忘記背後，努力面前的，向著標竿直跑...」", ref: "— 腓立比書 3:13-14" },
  { keywords: ['發光', '影響', '領袖', '帶領', '榜樣'], text: "親愛的孩子，你不再只是隱藏在人群中，我要使你成為「造在山上的城」。\n\n我已經將光賜給你，這份光是不能隱藏的。我呼召你起來發揮你的影響力，成為你所在之處的祝福與領袖。讓你的好行為照在人前，讓人們因為你，看見天父的榮耀。", verse: "「你們是世上的光。城造在山上是不能隱藏的。」", ref: "— 馬太福音 5:14" },
  { keywords: ['得勝', '產業', '應許', '踏出', '行動'], text: "親愛的孩子，應許之地就在你的眼前，現在是你採取行動的時候了！\n\n不要因為眼前的挑戰而退縮。我要你「剛強壯膽」，去得著我為你預備的那份豐盛產業。只要你腳踏出去，我就會為你開路。勇敢去拿屬於你的美好未來吧！", verse: "「你當剛強壯膽！因為你必使這百姓承受那地為業，就是我起誓應許賜他們列祖的地。」", ref: "— 約書亞記 1:6" },
  { keywords: ['渴慕', '充滿', '活水', '靈命', '更多'], text: "親愛的孩子，我感受到你心裡那份想要「更多」的渴慕。\n\n你對現在的狀態不滿足，這是一件好事！因為我承諾過，我會將水澆灌口渴的人，將河澆灌乾旱之地。敞開你的靈，我將用我的靈大大澆灌你，讓你的生命如春天的草木般繁盛茂密。", verse: "「因為我要將水澆灌口渴的人，將河澆灌乾旱之地。我必將我的靈澆灌你的後裔...」", ref: "— 以賽亞書 44:3" },
  { keywords: ['興起', '發揮', '時刻', '站出來', '表現'], text: "親愛的孩子，準備好了嗎？現在就是你「興起發光」的時刻！\n\n你已經積累了足夠的能量，我的榮耀也已經發現照耀在你身上。不要再覺得自己微不足道，勇敢地站出來，發揮你的恩賜與才華，這個世界正等著看見你身上的光芒！", verse: "「興起，發光！因為你的光已經來到！耶和華的榮耀發現照耀你。」", ref: "— 以賽亞書 60:1" },
  { keywords: ['快樂', '喜樂', '享受', '心願', '賜給'], text: "親愛的孩子，看見你享受生活的樣子，我也感到非常快樂。\n\n當你以我為樂，將你的焦點放在我的美好上，我會做一件奇妙的事：我會將你心裡真正渴求的那份深層願望，一一賜給你。繼續在我的愛中喜樂地生活，並準備迎接驚喜吧！", verse: "「又要以耶和華為樂，他就將你心裡所求的賜給你。」", ref: "— 詩篇 37:4" },
  { keywords: ['超越', '更大', '過去', '榮耀', '突破極限'], text: "親愛的孩子，你或許認為過去的某些時刻是你人生的巔峰，但我告訴你，最好的還沒來！\n\n我要在你生命中動工，使你「後來的榮耀，必大過先前的榮耀」。不要被過去的經驗限制，為即將到來的、前所未有的豐盛與平安歡呼吧！", verse: "「這殿後來的榮耀必大過先前的榮耀；在這地方我必賜平安。這是萬軍之耶和華說的。」", ref: "— 哈該書 2:9" },
  { keywords: ['恩典', '感謝', '祝福', '恩寵', '加倍'], text: "親愛的孩子，你現在所經歷的順利，都是我對你愛的證明。\n\n但我是一個樂意給予的神，從我的豐滿裡，你要領受「恩上加恩」。意思是，一個祝福接著另一個祝福，像海浪一樣不斷地湧向你。帶著感恩的心，準備好你的容器來承接這份無盡的恩典吧！", verse: "「從他豐滿的恩典裡，我們都領受了，而且恩上加恩。」", ref: "— 約翰福音 1:16" },
  { keywords: ['智慧', '聰明', '明白', '旨意', '洞察', '見識'], text: "親愛的孩子，我看到你渴望擁有更深的智慧與洞察力去面對生活。\n\n我會賜給你屬靈的智慧和悟性，讓你能「滿心知道神的旨意」。這將使你的每一步都走得極其精準、有力量。你不再只是憑著自己的聰明，而是帶著從天上來的遠見去影響這個世界。", verse: "「...願你們在一切屬靈的智慧悟性上，滿心知道神的旨意。」", ref: "— 歌羅西書 1:9" },
  { keywords: ['祝福別人', '給予', '幫助', '分享', '愛人', '給'], text: "親愛的孩子，當你的生命已經滿溢，你最大的突破，將是成為別人的祝福。\n\n我賜福給你，不只是為了你自己，更是為了讓你成為管道。去分享你的愛、你的資源、你的微笑吧！當你開始「叫別人得福」，你會發現自己的生命被擴張到一個你從未想過的榮耀境界。", verse: "「我必賜福給你，叫你的名為大；你也要叫別人得福。」", ref: "— 創世記 12:2" }
];

const illustrationImages = [
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&w=600&q=80"
];

// 為了讓滾動動畫生效的自訂 Hook
function useOnScreen(options: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // 如果想讓它只觸發一次，可以在這裡呼叫 observer.disconnect()
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
}

// 提取區塊元件來處理各自的 fade-up
function FadeSection({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.3 });
  return (
    <div ref={ref} className={`container transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
}

export default function SalvationTool() {
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
    }, 400); // 等待動畫結束後重置
  };

  return (
    <div className="bg-[#FDFBF7] text-[#5C5446] font-sans min-h-screen selection:bg-[#E2A76F] selection:text-white">
      <Head>
        <title>救恩的禮物 - 生命的選擇</title>
      </Head>

      {/* 導覽列：返回認識基督教分類頁 */}
      <nav className="fixed top-0 w-full p-6 z-50 flex justify-start">
        <Link href="/christianity" className="text-[#8E867A] hover:text-[#5C5446] font-medium transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm border border-[#E0E0E0]/50">
          ← 返回認識基督教
        </Link>
      </nav>

      <svg style={{ display: 'none' }}>
        <defs>
          <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#A8B1B8" />
          </marker>
        </defs>
      </svg>

      {/* 0. 封面區塊 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="text-center mb-12 max-w-[650px] z-10 mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium text-[#5C5446] mb-6 tracking-widest">救恩的禮物</h1>
            
            <div className="mx-auto mb-10 max-w-[500px]">
              <p className="text-[#8E867A] text-base mb-4 tracking-wide">首先，讓我們分享一首好聽的詩歌：</p>
              <div className="text-[#5C5446] text-lg leading-loose font-light">
                <div className="font-medium mb-2 text-[#D97757]">《感謝你全能十架》</div>
                主，我感謝你，全能十架，<br/>你親自為我們，捨命十架，<br/>在每一天你更新我們，能夠更像你，<br/>靠主十架，我們生命被改變，何等奇妙恩，<br/>我們讚美你，你救贖我們不惜代價，何等奇妙恩，<br/>我們讚美你，因為十架的大能，因為十架的大能。
              </div>
            </div>

            <div className="bg-[#E2A76F]/10 border-l-4 border-[#E2A76F] p-6 mb-10 text-left rounded-r-lg">
              <p className="text-lg font-medium leading-relaxed mb-2">「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。」</p>
              <p className="text-sm text-[#8E867A] italic">— 約翰福音 3:16</p>
            </div>
            
            <p className="text-lg">很久… 很久以前…<br/>起初… 神創造天地</p>
          </div>
          
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="100" y1="150" x2="500" y2="150" stroke="#E2A76F" strokeWidth="4" strokeLinecap="round" />
              <circle cx="300" cy="150" r="8" fill="#E2A76F" />
            </svg>
          </div>
        </FadeSection>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 animate-bounce">
          <span className="text-xs tracking-widest mb-2 text-[#8E867A]">向下滾動</span>
          <div className="w-px h-10 bg-[#8E867A]"></div>
        </div>
      </section>

      {/* 1. 起初創造 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#E2A76F" strokeWidth="6" strokeLinecap="round" />
              <text x="30" y="85" textAnchor="end" className="text-base font-bold fill-[#E2A76F]">神</text>
              <text x="570" y="85" textAnchor="start" className="text-base font-bold fill-[#E2A76F]">生命</text>
              <circle cx="300" cy="80" r="12" fill="#fff" stroke="#E2A76F" strokeWidth="4" />
              <text x="300" y="55" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">人</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#5C5446]">起初的創造與關係</h2>
            <p className="text-lg mb-4">神創造人，要他們永遠與祂相交、來往。</p>
            <p className="text-lg mb-4">神本要我們與祂建立關係。<br/>祂將祂的靈吹入我們的<span className="text-[#E2A76F] font-medium">生命</span>。</p>
          </div>
        </FadeSection>
      </section>

      {/* 2. 伊甸園的選擇與隔絕 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#E2A76F" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
              <text x="30" y="85" textAnchor="end" className="text-base font-bold fill-[#E2A76F]" opacity="0.4">神</text>
              <path d="M 50 80 L 150 80 C 250 80, 250 240, 350 240 L 550 240" fill="none" stroke="#A8B1B8" strokeWidth="6" strokeLinecap="round" />
              <text x="250" y="165" textAnchor="middle" className="text-base font-bold fill-[#A8B1B8]">罪</text>
              <circle cx="450" cy="240" r="12" fill="#fff" stroke="#A8B1B8" strokeWidth="4" />
              <text x="450" y="275" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">人</text>
              <text x="570" y="245" textAnchor="start" className="text-base font-bold fill-[#A8B1B8]">死亡</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#5C5446]">伊甸園的選擇與隔絕</h2>
            <p className="text-lg mb-4">在起初的伊甸園裡，神給了人自由。然而，第一對人類（亞當與夏娃）卻選擇了不信任神，違背了祂的教導。</p>
            <p className="text-lg mb-4">這個選擇，使人與神隔絕了！因為<span className="text-[#A8B1B8] font-medium">罪</span>，人與神的道斷開了連結。</p>
            <p className="text-lg mb-4">罪的結局，就是偏離生命軌道，走向另一端——<span className="text-[#A8B1B8] font-medium">死亡</span>！</p>
          </div>
        </FadeSection>
      </section>

      {/* 3. 人的徒勞 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#E2A76F" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
              <text x="30" y="85" textAnchor="end" className="text-base font-bold fill-[#E2A76F]" opacity="0.4">神</text>
              <line x1="50" y1="240" x2="550" y2="240" stroke="#A8B1B8" strokeWidth="6" strokeLinecap="round" />
              <text x="570" y="245" textAnchor="start" className="text-base font-bold fill-[#A8B1B8]">死亡</text>
              
              <line x1="120" y1="240" x2="120" y2="150" stroke="#A8B1B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" markerEnd="url(#arrow-up)" />
              <text x="120" y="130" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">行善</text>
              <line x1="210" y1="240" x2="210" y2="160" stroke="#A8B1B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" markerEnd="url(#arrow-up)" />
              <text x="210" y="140" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">積功德</text>
              <line x1="300" y1="240" x2="300" y2="145" stroke="#A8B1B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" markerEnd="url(#arrow-up)" />
              <text x="300" y="125" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">宗教</text>
              <line x1="390" y1="240" x2="390" y2="155" stroke="#A8B1B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" markerEnd="url(#arrow-up)" />
              <text x="390" y="135" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">醫療</text>
              <line x1="480" y1="240" x2="480" y2="165" stroke="#A8B1B8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" markerEnd="url(#arrow-up)" />
              <text x="480" y="145" textAnchor="middle" className="text-sm font-medium fill-[#5C5446]">養生</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#5C5446]">渴望回到神那裡</h2>
            <p className="text-lg mb-4">人渴望回到神那裡，也極力想要跨越死亡的終局！</p>
            <p className="text-lg mb-4">然而，不論我們如何努力向上攀爬（如行善、積功德、宗教，甚至是依賴醫療與養生試圖延長生命），都無法跨越罪的鴻溝，無法使我們回到神那裡！</p>
          </div>
        </FadeSection>
      </section>

      {/* 4. 神的方法與耶穌降世 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#E2A76F" strokeWidth="6" strokeLinecap="round" />
              <line x1="50" y1="240" x2="550" y2="240" stroke="#A8B1B8" strokeWidth="6" strokeLinecap="round" />
              <line x1="300" y1="80" x2="300" y2="240" stroke="#D97757" strokeWidth="8" strokeLinecap="round" />
              <line x1="250" y1="130" x2="350" y2="130" stroke="#D97757" strokeWidth="8" strokeLinecap="round" />
              <text x="300" y="60" textAnchor="middle" className="text-sm fill-[#D97757] font-bold">主耶穌降世</text>
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#5C5446]">神預備的方法</h2>
            <p className="text-lg mb-4">神為絕望的我們，預備了一個方法！<br/>神因為愛我們的緣故，把祂獨生的愛子<span className="text-[#D97757] font-medium">耶穌</span>賜給我們，成為我們生命當中最美好的禮物！</p>
            <p className="text-lg mb-4">主耶穌降世，是為了世人！<br/>也是為我，也是為你。</p>
          </div>
        </FadeSection>
      </section>

      {/* 5. 轉回與選擇 */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-5 relative">
        <FadeSection>
          <div className="w-full h-[250px] md:h-[300px] flex justify-center items-center relative mx-auto">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[650px] overflow-visible">
              <line x1="50" y1="80" x2="550" y2="80" stroke="#E2A76F" strokeWidth="6" strokeLinecap="round" />
              <line x1="50" y1="240" x2="300" y2="240" stroke="#A8B1B8" strokeWidth="6" strokeLinecap="round" />
              <line x1="300" y1="80" x2="300" y2="240" stroke="#D97757" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>
              <path d="M 200 240 L 250 240 C 280 240, 300 220, 300 160 C 300 100, 320 80, 350 80 L 400 80" fill="none" stroke="#E2A76F" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
              <polygon points="400,80 390,75 390,85" fill="#E2A76F" />
              <circle cx="200" cy="240" r="12" fill="#fff" stroke="#A8B1B8" strokeWidth="4" />
            </svg>
          </div>
          <div className="text-center max-w-[650px] mx-auto z-10">
            <h2 className="text-3xl font-medium mb-6 text-[#5C5446]">我們的選擇</h2>
            <p className="text-lg mb-4">耶穌為你我的罪而死，三天後復活、升天。<br/>其實我們有個選擇… 有一條道路可以回到神那裡！！！</p>
            <p className="text-lg mb-4">離開死亡之路！！！如果我們願意及時轉回！！！</p>
            <p className="text-lg mb-8">然而耶穌的死與復活，與你如何發生關係？<br/><strong>你可以把你的心聲告訴祂。</strong></p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-block mt-4 px-10 py-3 bg-[#D97757] hover:bg-[#C66242] text-white rounded-full text-lg tracking-wider transition-all shadow-[0_4px_15px_rgba(217,119,87,0.2)] hover:shadow-[0_6px_20px_rgba(217,119,87,0.4)] hover:-translate-y-1"
            >
              我也想要拿禮物
            </button>
          </div>
        </FadeSection>
      </section>

      {/* 互動彈出視窗 (Modal) */}
      <div 
        className={`fixed inset-0 w-full h-full bg-[#5C5446]/60 backdrop-blur-sm flex justify-center items-center z-[1000] transition-opacity duration-400 ease-in-out ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className={`bg-white w-[90%] max-w-[500px] rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative transition-transform duration-400 ease-in-out max-h-[90vh] overflow-y-auto ${isModalOpen ? 'translate-y-0' : 'translate-y-5'}`}>
          <button 
            onClick={closeModal}
            className="absolute top-5 right-5 bg-transparent border-none text-2xl text-[#8E867A] hover:text-[#5C5446] cursor-pointer transition-colors"
          >
            &times;
          </button>
          
          {modalState === 'input' && (
            <div>
              <h3 className="text-2xl font-medium mb-3 text-[#5C5446]">親愛的天父...</h3>
              <p className="text-base text-[#8E867A] mb-6">請寫下你目前遇到的困難，或是對未來的期待與渴望。不用擔心，這份祈禱只有你跟天父知道。</p>
              <textarea 
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder={prayerError ? "請先寫下一些想對天父說的話喔..." : "我想對祢說..."}
                className={`w-full h-[150px] p-4 border rounded-xl resize-none font-sans text-base text-[#5C5446] bg-[#F9F9F9] focus:bg-white focus:outline-none transition-colors mb-6 ${prayerError ? 'border-[#A8B1B8]' : 'border-[#E0E0E0] focus:border-[#E2A76F]'}`}
              />
              <button 
                onClick={handleSubmit}
                className="w-full py-3 bg-[#D97757] hover:bg-[#C66242] text-white rounded-full text-lg tracking-wider transition-all shadow-[0_4px_15px_rgba(217,119,87,0.2)]"
              >
                送出我的心聲
              </button>
            </div>
          )}

          {modalState === 'loading' && (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-[#E2A76F]/30 border-t-[#E2A76F] rounded-full mx-auto mb-5 animate-spin"></div>
              <p className="text-[#5C5446] text-lg">正在為你尋找天父的回信...</p>
            </div>
          )}

          {modalState === 'letter' && letterData && (
            <div className="text-left bg-[#FFFCF5] rounded-xl p-6 md:p-8 border border-[#F0E6D2]">
              <img 
                src={letterImage} 
                alt="溫暖插畫" 
                className="w-full h-[180px] object-cover rounded-lg mb-6 border-[6px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.06)] bg-white"
                style={{ filter: 'contrast(0.85) saturate(1.3) sepia(0.2)' }}
              />
              <h3 className="text-2xl font-medium text-[#D97757] mb-4 tracking-wide">💌 來自天父的信</h3>
              <div className="text-lg mb-6 leading-loose whitespace-pre-wrap text-[#5C5446]">
                {letterData.text}
              </div>
              <div className="bg-[#D97757]/5 p-4 border-l-4 border-[#D97757] rounded-r-md">
                <p className="text-base font-medium mb-2 text-[#5C5446]">{letterData.verse}</p>
                <p className="text-sm text-[#8E867A] text-right italic m-0">{letterData.ref}</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}