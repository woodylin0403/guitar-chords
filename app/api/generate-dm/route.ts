import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, timeLoc, details, styles, format } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key 未設定" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🌟 已經幫你替換成全世界最穩定、支援度最高的 gemini-pro 模型
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    一句給美宣參考的 Midjourney 繪圖提示詞，加上參數「--ar 16:9」或「--ar 4:5」。

    【極度重要指令】：
    你只能回傳合法的 JSON 格式，不要包含任何 markdown 標記 (如 \`\`\`json)，也不要有任何前後文解釋。
    格式必須嚴格如下：
    {
      "optimizedTitle": "...",
      "socialCopy": "...",
      "imagePrompt": "..."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // 強制擷取 JSON 內容，過濾掉 AI 亂講話
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI 回傳格式錯誤，請重新產生一次");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ 
      success: true, 
      optimizedTitle: parsedData.optimizedTitle || topic,
      socialCopy: parsedData.socialCopy, 
      imagePrompt: parsedData.imagePrompt 
    });

  } catch (error: any) {
    console.error("Gemini API 錯誤:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}