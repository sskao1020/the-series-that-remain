import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "時間留下的影集｜私人編輯預覽",
  description: "為對熱門排行榜疲乏的觀眾，留下真正值得投入時間的完結影集。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
