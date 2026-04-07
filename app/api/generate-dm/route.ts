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
    
    // 🌟 關鍵修正：這裡確實改用最穩定不會報 404 的 gemini-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    你是一位專門為教會和社群團體設計創意行銷文案的行銷大師。
    請根據以下資訊，幫我完成三個任務：

    任務一：智慧優化主題
    將原始主題：「${topic}」優化成一個超級吸睛的新標題 (不超過 20 個字)。

    任務二：生成完整社群邀請文案
    時間地點：「${timeLoc || '這週聚會'}」
    特別提醒：「${details || '帶著期待的心'}」
    風格混搭：「${styles.length > 0 ? styles.join('、') : '溫馨走心'}」
    輸出平台：「${format}」
    文案要求：要有鉤子、重點清晰、大量表情符號、明確的行動呼籲。

    任務三：AI 繪圖提示詞 (英文)
    一句給美宣參考的 Midjourney 繪圖提示詞，加上參數「--ar 16:9」或「--ar 4:5」(根據format自定)。

    【極度重要指令】：
    你只能回傳合法的 JSON 格式，不要包含任何 markdown 標記 (如 \`\`\`json)，也不要有任何前後文解釋。
    必須包含以下三個 key:
    {
      "optimizedTitle": "...",
      "socialCopy": "...",
      "imagePrompt": "..."
    }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // 🌟 終極防呆：強制只擷取 { 到 } 之間的 JSON 內容，過濾掉 AI 亂講話
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI 回傳的格式不正確，找不到 JSON 資料");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ 
      success: true, 
      optimizedTitle: parsedData.optimizedTitle || topic,
      socialCopy: parsedData.socialCopy || "文案生成發生異常，請重試", 
      imagePrompt: parsedData.imagePrompt || "" 
    });

  } catch (error: any) {
    console.error("Gemini API 詳細錯誤:", error);
    return NextResponse.json({ success: false, error: error.message || "未知錯誤" }, { status: 500 });
  }
}