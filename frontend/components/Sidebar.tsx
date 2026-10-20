"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Video,
  Users,
  Wrench,
  Gavel,
  Radio,
  Sliders,
  Building2,
  Database,
  FileText
} from "lucide-react";
import { playTacticalClick } from "./SoundFx";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onDispatchNotice?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = "cockpit",
  setActiveTab,
  onDispatchNotice,
}) => {
  const pathname = usePathname();

  const sections = [
    {
      category: "Main Portal",
      items: [
        { id: "home", label: "Portal Home", icon: Home, href: "/" },
        { id: "cockpit", label: "Surveillance Cockpit", icon: LayoutDashboard, href: "/dashboard" },
        { id: "cctv", label: "Live Cameras (12)", icon: Video, href: "/cameras" },
        { id: "audit", label: "Attendance Verification", icon: Users, href: "/audit" },
      ],
    },
    {
      category: "Registry & Records",
      items: [
        { id: "database", label: "AEBAS Database", icon: Database, href: "/database" },
        { id: "directory", label: "Empaneled Centres", icon: Building2, href: "/directory" },
        { id: "assets", label: "Equipment & Machinery", icon: Wrench, href: "/dashboard" },
      ],
    },
    {
      category: "Statutory Enforcement",
      items: [
        { id: "section12a", label: "Section 12-A Grants", icon: Gavel, href: "/compliance" },
        { id: "waterfall", label: "Rural Telemetry Logs", icon: Radio, href: "/dashboard" },
        { id: "calibrator", label: "System Calibration", icon: Sliders, href: "/dashboard" },
      ],
    },
  ];

  return (
    <aside className="w-16 lg:w-64 border-r border-slate-200 bg-white flex flex-col justify-between py-5 px-3 shrink-0 select-none z-40 shadow-sm transition-all duration-200">
      <div className="space-y-6">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="hidden lg:block px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {sec.category}
            </div>
            <nav className="space-y-1">
              {sec.items.map((item) => {
                const isPathActive = pathname === item.href && item.href !== "/";
                const isHomeActive = pathname === "/" && item.href === "/" && (!activeTab || activeTab === "home");
                const isTabActive = activeTab === item.id;
                const isActive = isPathActive || isHomeActive || isTabActive;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      playTacticalClick();
                      if (setActiveTab) setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Official Footnote */}
      <div className="hidden lg:block p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          SkillWatch National Grid v4.2
        </div>
        <div className="text-[10px] text-slate-400">
          Smart India Hackathon 2026 • ID 26245
        </div>
      </div>
    </aside>
  );
};
