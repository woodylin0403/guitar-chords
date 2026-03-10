import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. 標題加上你的專屬筆名，這超級重要！
  title: "烏鴉Lin 的老詩歌吉他譜 | 為青年復興而生的數位樂譜",
  
  // 2. 描述裡面也要自然地提到你
  description: "由烏鴉Lin整理提供。收錄豐富的老詩歌、敬拜讚美吉他譜，支援線上自動轉調、CDEFGAB 七大調快速分類。專為青年小組、團契與教會敬拜設計的數位樂譜平台。",
  
  // 3. 關鍵字加上你的名字
  keywords: "烏鴉Lin, 吉他譜, 詩歌, 敬拜, 轉調, 和弦, 舉目仰望, 團契, 老詩歌吉他譜",
  
  // 4. Google 搜尋引擎驗證碼 (請保持你原本填寫的真實亂碼)
  verification: {
    google: "tAqrHN-QWf94SGf9R3t5NHqkv5nC2nneq6seJ3dLyGE", 
  },
  
  // 🌟 新增：Open Graph 設定 (當別人把你的網址貼到 Line 或 FB 時，會顯示漂亮的預覽)
  openGraph: {
    title: '烏鴉Lin 的老詩歌吉他譜',
    description: '專為教會敬拜與小組聚會打造的老詩歌吉他譜網站。提供智能和弦轉調、吉他彈唱譜、YouTube 示範影片，讓敬拜更順暢。',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      {/* 🌟 融合了字體 (inter.className) 與我們原本設定好的網站背景色與抗鋸齒 */}
      <body className={`${inter.className} bg-[#FDFBF7] antialiased`}>
        {children}
      </body>
    </html>
  );
}