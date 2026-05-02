import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '神學學院戲劇決選',
  description: '數位聖殿 - 即時戲劇決選投票系統',
  icons: {
    icon: '🏆', // 這裡可以換成你喜歡的 Emoji，或是你自己的 favicon 網址
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}