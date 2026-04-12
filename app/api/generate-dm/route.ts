import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, timeLoc, details, styles, format } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!geminiApiKey || !openaiApiKey) {
      return NextResponse.json({ success: false, error: "API Key 未設定，請確認 Gemini 與 OpenAI 鑰匙皆已填寫" }, { status: 500 });
    }

    // ==========================================
    // 階段 1：呼叫 Gemini (大腦) 寫文案與生圖提示詞
    // ==========================================
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
    請寫一段給 DALL-E 3 的精準英文提示詞。
    核心重點：畫面中【絕對不要包含任何文字、字母或數字】 (No text, no typography, pure illustration)。
    風格需符合主題，若主題歡樂請用 Pop art (普普風) 或是 3D 渲染風格。

    【極度重要指令】：
    你只能回傳合法的 JSON 格式。
    {
      "optimizedTitle": "...",
      "socialCopy": "...",
      "imagePrompt": "..."
    }
    `;

    // 呼叫 Gemini 2.5 模型
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const geminiData = await geminiResponse.json();
    if (!geminiResponse.ok) throw new Error(geminiData.error?.message || "Gemini 發生錯誤");

    const responseText = geminiData.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini 回傳格式異常");
    const parsedData = JSON.parse(jsonMatch[0]);

    // ==========================================
    // 階段 2：呼叫 OpenAI (畫筆) 根據提示詞畫圖
    // ==========================================
    // 我們在結尾再次強調「不要有文字」，確保背景乾淨
    const finalImagePrompt = parsedData.imagePrompt + " IMPORTANT: Ensure there is absolutely NO text, no typography, and no words in the image. It must be a pure illustration.";

    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalImagePrompt,
        n: 1, // 生成 1 張
        size: "1024x1024", // 高畫質正方形
        response_format: "url"
      })
    });

    const openaiData = await openaiRes.json();
    if (!openaiRes.ok) throw new Error(openaiData.error?.message || "OpenAI 畫圖發生錯誤");

    const imageUrl = openaiData.data[0].url;

    // ==========================================
    // 階段 3：把所有成果打包傳回給前端
    // ==========================================
    return NextResponse.json({ 
      success: true, 
      optimizedTitle: parsedData.optimizedTitle || topic,
      socialCopy: parsedData.socialCopy, 
      imagePrompt: parsedData.imagePrompt,
      imageUrl: imageUrl // 🌟 新增：把畫好的圖片網址傳出去
    });

  } catch (error: any) {
    console.error("API 執行錯誤:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}