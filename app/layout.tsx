import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";

export const metadata: Metadata = { title:"時間留下的影集｜The Series That Remain", description:"不是當下最紅，而是時間留下。50 部值得重看的已完結歐美影集。" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}
