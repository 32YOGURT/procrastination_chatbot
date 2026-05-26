"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "홈", icon: "🏠" },
  { href: "/personality_result", label: "검사", icon: "🔍" },
  { href: "/agent1", label: "할 일", icon: "📋" },
  { href: "/mypage", label: "마이페이지", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="border-t border-neutral-100 bg-white flex justify-around items-center shrink-0" style={{ height: "60px" }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 flex-1 py-2">
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className={`text-[10px] font-medium ${isActive ? "text-emerald-600" : "text-neutral-400"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
