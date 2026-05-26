import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserInit from "@/components/UserInit";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GO북이",
  description: "지연 행동 교정 웰니스 프로그램",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-950 flex items-center justify-center">
        <UserInit />
        <div
          className="relative flex flex-col rounded-[44px] overflow-hidden"
          style={{
            width: "390px",
            height: "844px",
            border: "10px solid #1c1c1e",
            boxShadow:
              "0 80px 160px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-6 bg-white shrink-0 text-neutral-900"
            style={{ height: "44px" }}
          >
            <span className="text-[11px] font-semibold tracking-tight">9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="7" width="3" height="5" rx="0.5" />
                <rect x="5" y="4" width="3" height="8" rx="0.5" />
                <rect x="10" y="1.5" width="3" height="10.5" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" fillOpacity="0.3" />
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <circle cx="8" cy="11" r="1.5" fill="currentColor" />
                <path d="M4.8 7.5a4.5 4.5 0 0 1 6.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 4.5a8.5 8.5 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <div className="flex items-center">
                <div
                  className="relative rounded-[2.5px] border border-current flex items-center"
                  style={{ width: "24px", height: "12px", padding: "1.5px" }}
                >
                  <div className="bg-current rounded-[1px] h-full" style={{ width: "80%" }} />
                </div>
                <div className="bg-current rounded-r-sm ml-[1px]" style={{ width: "2px", height: "6px" }} />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="phone-content">
            <div className="page-scroll">
              {children}
            </div>
            <BottomNav />
          </div>

          {/* Home indicator */}
          <div className="bg-white flex items-center justify-center shrink-0" style={{ height: "28px" }}>
            <div className="w-28 rounded-full bg-black opacity-20" style={{ height: "5px" }} />
          </div>
        </div>
      </body>
    </html>
  );
}
