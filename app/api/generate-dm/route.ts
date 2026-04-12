import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, description, topic, timeLoc, details, style } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!geminiApiKey || !openaiApiKey) {
      return NextResponse.json({ success: false, error: "API Key 未設定" }, { status: 500 });
    }

    // ==========================================
    // 動作 1：根據活動描述，推薦 3 個標題與 3 種風格
    // ==========================================
    if (action === 'get_suggestions') {
      const prompt = `
      我有一個活動，描述如下：「${description}」
      請幫我發想：
      1. 三個超級吸睛、有創意的活動標題（每個不超過 15 個字）。
      2. 推薦三種最適合這個活動的視覺設計風格（例如：3D卡通風、賽博龐克、極簡文青、美式普普風 等）。
      
      請嚴格回傳 JSON 格式：
      {
        "titles": ["標題一", "標題二", "標題三"],
        "styles": ["風格一", "風格二", "風格三"]
      }
      `;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await geminiRes.json();
      if (!geminiRes.ok) throw new Error(data.error?.message);
      
      const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
      return NextResponse.json({ success: true, data: JSON.parse(jsonMatch[0]) });
    }

    // ==========================================
    // 動作 2：生成最終海報底圖與社群文案
    // ==========================================
    if (action === 'generate_final') {
      // 1. 請 Gemini 寫文案與生圖提示詞
      const prompt = `
      活動標題：「${topic}」
      時間地點：「${timeLoc}」
      活動特色：「${details}」
      視覺風格：「${style}」

      任務一：根據以上資訊，寫一篇約 150 字的 IG/LINE 邀請文案（含大量 Emoji）。
      任務二：寫一段給 DALL-E 3 的英文繪圖提示詞 (Image Prompt)。要求畫出符合「${style}」風格的高品質背景插圖。
      【極度重要】：畫面中絕對不能包含任何文字、字母或數字 (No text, typography, or letters. Pure illustration only)。

      請回傳 JSON 格式：
      { "socialCopy": "...", "imagePrompt": "..." }
      `;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const geminiData = await geminiRes.json();
      const jsonMatch = geminiData.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
      const parsedData = JSON.parse(jsonMatch[0]);

      // 2. 請 OpenAI 畫圖 (底圖)
      const finalImagePrompt = parsedData.imagePrompt + " Ensure NO TEXT, NO WORDS, pure background illustration.";
      const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
        body: JSON.stringify({ model: "dall-e-3", prompt: finalImagePrompt, n: 1, size: "1024x1024", response_format: "url" })
      });
      const openaiData = await openaiRes.json();
      if (!openaiRes.ok) throw new Error(openaiData.error?.message);

      // 3. 轉成 Base64 避免下載報錯
      const imageResponse = await fetch(openaiData.data[0].url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

      return NextResponse.json({ success: true, socialCopy: parsedData.socialCopy, imageUrl: base64Image });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}