import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, timeLoc, details, styles, format } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "API Key 未設定" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    你是一位專門為教會和社群團體設計創意行銷文案的行銷大師，擁有超過 10 年的社群媒體經營經驗。
    請根據以下資訊，幫我完成三個任務：

    任務一：智慧優化主題
    請分析我輸入的原始主題：「${topic}」。
    請將它優化成一個超級吸睛、引人好奇、極具行銷力和傳播力的「新標題」 (不超過 20 個字)。

    任務二：生成完整社群邀請文案
    請使用優化後的新標題、時間與地點：「${timeLoc || '這週聚會'}」、特別提醒：「${details || '帶著期待的心'}」、以及風格混搭：「${styles.length > 0 ? styles.join('、') : '溫馨走心'}」。
    針對輸出平台：「${format}」，生成一份完整的邀請文案。
    這份文案必須：
    1. 開頭要有具備吸引力的「鉤子 (Hook)」。
    2. 核心內容清晰、重點突出。
    3. 在文案中穿插大量、恰當的「表情符號 (Emojis)」來增加視覺溫度和樂趣。
    4. 結尾必須有明確的「Call to Action (報名/行動呼籲)」。
    5. 語氣要完美混合所選的風格。

    任務三：AI 繪圖提示詞 (英文)
    請附上一句給美宣參考的 Midjourney/AI 繪圖提示詞，需符合文案的配色與風格，加上參數「--ar 16:9」或「--ar 4:5」(根據format自定)。

    請嚴格執行指令，並直接輸出 JSON 格式，包含三個欄位：
    1. "optimizedTitle": 優化後的新標題。
    2. "socialCopy": 生成的完整社群文案。
    3. "imagePrompt": 給美宣的英文繪圖提示詞 (需包含比例參數)。
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // 🌟 防呆機制：過濾掉 AI 有時候會雞婆加上的 Markdown 標記
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(responseText);

    return NextResponse.json({ 
      success: true, 
      optimizedTitle: parsedData.optimizedTitle,
      socialCopy: parsedData.socialCopy, 
      imagePrompt: parsedData.imagePrompt 
    });

  } catch (error: any) {
    console.error("Gemini API 錯誤細節:", error);
    // 🌟 錯誤顯示升級：把真正的錯誤訊息傳給前端
    const errorMessage = error.message || String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}