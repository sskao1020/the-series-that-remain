import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";

export const metadata: Metadata = { title:"時間留下的影集｜The Series That Remain", description:"不是當下最紅，而是時間留下。50 部值得重看的已完結歐美影集。" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600&amp;family=Noto+Serif+TC:wght@500;600;700&amp;display=swap" rel="stylesheet"/></head><body>{children}</body></html>}
