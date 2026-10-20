"use client";

import React from "react";
import {
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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDispatchNotice: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onDispatchNotice,
}) => {
  const sections = [
    {
      category: "Surveillance & Attendance",
      items: [
        { id: "cockpit", label: "National Overview", icon: LayoutDashboard },
        { id: "cctv", label: "Live CCTV Feeds", icon: Video },
        { id: "audit", label: "Attendance Verification", icon: Users },
      ],
    },
    {
      category: "Records & Database",
      items: [
        { id: "database", label: "Real SQLite Database", icon: Database },
        { id: "directory", label: "Empaneled Centres", icon: Building2 },
        { id: "assets", label: "Equipment & Machinery", icon: Wrench },
      ],
    },
    {
      category: "Compliance & Enforcement",
      items: [
        { id: "section12a", label: "Section 12-A Notices", icon: Gavel },
        { id: "waterfall", label: "Rural Telemetry Logs", icon: Radio },
        { id: "calibrator", label: "System Calibration", icon: Sliders },
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
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playTacticalClick();
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </button>
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
          MSDE Portal v4.2
        </div>
        <div className="text-[10px] text-slate-400">
          Smart India Hackathon 2026
        </div>
      </div>
    </aside>
  );
};
