import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '數位聖殿｜神學學院戲劇決選',
  description: '神聖通道已開啟！請點擊進入數位聖殿，為您心中的最佳啟示投下神聖的一票。',
  icons: {
    icon: '🏆',
  },
  // 🌟 加入 Open Graph 專屬設定 (專門給 LINE, Facebook, IG 預覽用的)
  openGraph: {
    title: '數位聖殿｜神學學院戲劇決選',
    description: '神聖通道已開啟！請點擊進入數位聖殿，為您心中的最佳啟示投下神聖的一票。',
    siteName: '數位聖殿投票系統',
    type: 'website',
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}