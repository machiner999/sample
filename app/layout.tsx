import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "株価チェッカー",
  description: "株価を検索・表示するアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
