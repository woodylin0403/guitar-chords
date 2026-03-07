export interface Song {
  id: string;
  title: string;
  originalKey: string;
  editor: string;
  content: string;
  ownerId?: string; // 新增：紀錄是哪個使用者的 ID 建立的
  ownerEmail?: string; // 新增：紀錄建立者的 Email
}

// ... 底下的 initialSongList 保持原樣不變 ...
  
  export const initialSongList: Song[] = [
    {
      id: "001-look-up-to-jesus",
      title: "舉目仰望",
      originalKey: "C",
      editor: "系統預設",
      content: `C         G        Am  F   C
  舉目仰望 仰望耶穌 仰望主耶穌榮光
  
  G7      C         G        Am  F   C
  舉目仰望 仰望耶穌 仰望主耶穌榮光
  
  Am  F     G7       Em7   Am7    F
  主是光 聖潔與真理全能神 主的榮光
  
  G         C     C7    F    G       Em7  Am7
  已臨到我們 齊來宣揚 宣揚我主 因
  
  Dm      G          C         F    G
  為祂的慈愛永遠長存 齊來宣揚 宣揚
  
  Em7  Am7   Dm      G7         C
  我主 因為祂的慈愛永遠長存`
    },
    {
      id: "002-whenever-i-look",
      title: "每當我瞻仰你",
      originalKey: "C",
      editor: "系統預設",
      content: `C         G/B       Am        Am/G
  每當我瞻仰你至聖榮面 每當我在愛中仰望你
  
  F         C/E       Dm7       G
  你在你榮耀光中 所有一切都失去光彩
  
  C         G/B       Am        Am/G
  何等喜樂當我進入你心意 我全心成為你愛的寶座
  
  F         C/E       Dm7       G
  你在你榮耀光中 所有一切都失去光彩
  
  F   G/F   Em  Am  Dm7 G       C   C7
  我敬拜你  我敬拜你  我一生活著為要敬拜你
  
  F   G/F   Em  Am  Dm7 G       C
  我敬拜你  我敬拜你  我一生活著為要敬拜你`
    }
  ];