import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, timeLoc, details, styles, format } = body;

    // 1. 檢查 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key 未設定，請檢查 .env.local 或 Vercel 設定" }, { status: 500 });
    }

    // 2. 初始化 Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    /**
     * 🌟 修正 404 問題的關鍵：
     * 如果 'gemini-1.5-flash-latest' 還是報錯，請將下面改為 'gemini-pro'
     */
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 3. 設定 Prompt (強制 JSON 格式)
    const prompt = `
    你是一位專門為教會和社群團體設計創意行銷文案的行銷大師。
    請根據以下資訊，幫我完成三個任務：

    任務一：智慧優化主題
    將原始主題：「${topic}」優化成一個超級吸睛、更具行銷力的新標題 (不超過 20 個字)。

    任務二：生成完整社群邀請文案
    時間地點：「${timeLoc || '這週聚會'}」
    特別提醒：「${details || '帶著期待的心'}」
    風格混搭：「${styles.length > 0 ? styles.join('、') : '溫馨走心'}」
    輸出平台：「${format}」
    文案要求：要有吸睛開頭、重點清晰、加入大量合適的表情符號 (Emoji)、明確的行動呼籲。

    任務三：AI 繪圖提示詞 (英文)
    提供一句給美宣參考的 Midjourney 英文提示詞，需符合文案配色，並加上參數「--ar 16:9」或「--ar 4:5」。

    【極度重要指令】：
    你只能回傳合法的 JSON 格式，不要包含任何 markdown 標記 (如 \`\`\`json)，也絕對不要有任何解釋文字。
    格式必須嚴格如下：
    {
      "optimizedTitle": "優化後的標題",
      "socialCopy": "完整的文案內容",
      "imagePrompt": "英文提示詞"
    }
    `;

    // 4. 執行生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // 🌟 5. 終極防呆：只擷取第一個 { 到最後一個 } 之間的 JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("AI 回傳原始文字：", responseText);
      throw new Error("AI 回傳內容不包含有效的 JSON 格式");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // 6. 成功回傳
    return NextResponse.json({ 
      success: true, 
      optimizedTitle: parsedData.optimizedTitle || topic,
      socialCopy: parsedData.socialCopy || "文案生成異常，請重試", 
      imagePrompt: parsedData.imagePrompt || "" 
    });

  } catch (error: any) {
    // 🌟 7. 錯誤攔截與詳細回報
    console.error("Gemini API 詳細錯誤:", error);
    
    let userErrorMessage = error.message || "發生未知錯誤";
    
    // 如果是模型找不到的 404 錯誤，給予直覺提示
    if (userErrorMessage.includes("404") || userErrorMessage.includes("not found")) {
      userErrorMessage = "模型代號錯誤 (404)。請嘗試將 route.ts 中的模型改為 'gemini-pro'";
    }

    return NextResponse.json({ 
      success: false, 
      error: userErrorMessage 
    }, { status: 500 });
  }
}