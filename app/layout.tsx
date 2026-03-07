import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "老詩歌吉他譜 | 為青年復興而生的數位樂譜",
  description: "提供豐富的老詩歌、敬拜讚美詩歌吉他譜，支援線上自動轉調、CDEFGAB 七大調快速分類。專為青年小組、團契與教會敬拜設計的數位樂譜平台。",
  keywords: "吉他譜, 詩歌, 敬拜, 轉調, 和弦, 舉目仰望, 團契, 老詩歌吉他譜",
  verification: {
    google: "tAqrHN-QWf94SGf9R3t5NHqkv5nC2nneq6seJ3dLyGE", // 👈 把你剛才複製的亂碼貼到引號裡面
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