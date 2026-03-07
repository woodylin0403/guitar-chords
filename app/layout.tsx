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
  
  verification: {
    google: "你的Google驗證碼請保留在這裡", // 👈 這裡維持你剛才貼的亂碼不要動喔！
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>{children}</body>
    </html>
  );
}