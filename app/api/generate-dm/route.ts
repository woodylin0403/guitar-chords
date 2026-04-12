import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 🌟 接收新參數：format
    const { action, description, topic, timeLoc, details, style, format } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!geminiApiKey || !openaiApiKey) {
      return NextResponse.json({ success: false, error: "API Key 未設定" }, { status: 500 });
    }

    if (action === 'get_suggestions') {
      const prompt = `
      我有一個活動：「${description}」
      請幫我：
      1. 發想 3 個超級吸睛、有創意的活動標題（15字內）。
      2. 推薦 3 種最適合的視覺設計風格（例如：3D Pixar、美式復古漫畫、極簡雜誌風、賽博龐克 等）。
      請嚴格回傳 JSON：{"titles": ["..."], "styles": ["..."]}
      `;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await geminiRes.json();
      const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
      return NextResponse.json({ success: true, data: JSON.parse(jsonMatch[0]) });
    }

    if (action === 'generate_final') {
      // 🌟 強化 Gemini 的 Prompt，要求生出神級品質的提示詞
      const prompt = `
      活動標題：「${topic}」
      視覺風格：「${style}」

      任務一：寫一篇 150 字 IG/LINE 邀請文案（含 Emoji）。
      任務二：寫一段給 DALL-E 3 的英文繪圖提示詞 (Image Prompt)。
      【畫質要求】：請加上 "Masterpiece, award-winning, ultra-detailed, highly aesthetic, trending on ArtStation" 等字眼確保最高品質。
      【構圖要求】：這是一張海報的底圖，請確保畫面邊緣有足夠的「留白或純色空間 (negative space)」，方便後續疊加文字。
      【極度重要】：畫面中絕對不能有任何文字、字母 (NO TEXT, NO WORDS)。

      請回傳 JSON：{ "socialCopy": "...", "imagePrompt": "..." }
      `;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const geminiData = await geminiRes.json();
      const jsonMatch = geminiData.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
      const parsedData = JSON.parse(jsonMatch[0]);

      // 🌟 根據使用者選擇的格式，決定 OpenAI 生成的尺寸
      let imageSize = "1024x1024"; // 預設 1:1
      if (format === 'IG_STORY' || format === 'A4') imageSize = "1024x1792"; // 垂直
      if (format === 'SLIDE') imageSize = "1792x1024"; // 水平

      const finalImagePrompt = parsedData.imagePrompt + " Ensure NO TEXT, NO TYPOGRAPHY.";
      
      const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
        body: JSON.stringify({ 
          model: "dall-e-3", 
          prompt: finalImagePrompt, 
          n: 1, 
          size: imageSize, 
          quality: "hd", // 🌟 開啟 DALL-E 3 的最高畫質模式
          response_format: "url" 
        })
      });
      const openaiData = await openaiRes.json();
      if (!openaiRes.ok) throw new Error(openaiData.error?.message);

      const imageResponse = await fetch(openaiData.data[0].url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

      return NextResponse.json({ success: true, socialCopy: parsedData.socialCopy, imageUrl: base64Image });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}