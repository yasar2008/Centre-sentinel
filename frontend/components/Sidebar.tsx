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
  Send,
  Cpu,
  Layers,
  Activity
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
  const navItems = [
    { id: "cockpit", label: "Executive Overview", icon: LayoutDashboard },
    { id: "database", label: "Real SQLite Database", icon: Database },
    { id: "cctv", label: "Live Surveillance Feed", icon: Video },
    { id: "audit", label: "Attendance Matrix", icon: Users },
    { id: "assets", label: "Equipment & OCI", icon: Wrench },
    { id: "section12a", label: "Section 12-A Enforcement", icon: Gavel },
    { id: "waterfall", label: "Rural Telemetry & DevTools", icon: Radio },
    { id: "calibrator", label: "Edge AI Calibration", icon: Sliders },
    { id: "directory", label: "National Centres", icon: Building2 },
  ];

  return (
    <aside className="w-16 lg:w-64 border-r border-white/[0.06] bg-[#080c14]/50 backdrop-blur-xl flex flex-col justify-between py-5 px-3 shrink-0 select-none z-40 transition-all duration-300">
      {/* Navigation Group */}
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div className="hidden lg:block px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Platform Navigation
        </div>

        {/* Tab Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playTacticalClick();
                  setActiveTab(item.id);
                }}
                className={`w-full text-left text-xs flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white/[0.08] text-white font-medium border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 stroke-[1.75] transition-colors ${
                  isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span className="hidden lg:inline truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="pt-2 px-1">
          <button
            onClick={() => {
              playTacticalClick();
              onDispatchNotice();
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-amber-500/20 border border-rose-500/25 hover:border-rose-500/40 text-rose-300 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
          >
            <Send className="w-3.5 h-3.5 stroke-[1.75]" />
            <span className="hidden lg:inline">Dispatch Notice</span>
          </button>
        </div>
      </div>

      {/* Bottom Luxury Node Status Card */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <div className="hidden lg:block p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2 shadow-inner">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px]">Edge Node:</span>
            <span className="text-emerald-400 font-mono text-[10px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              99.8% Online
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px]">Latency:</span>
            <span className="text-sky-400 font-mono text-[10px]">18.2ms INT8</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px]">Pipeline:</span>
            <span className="text-slate-300 font-mono text-[10px]">48 FPS</span>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-between px-2 text-[10px] text-slate-500">
          <span className="hidden lg:inline">SMU Secure Gateway</span>
          <span className="font-mono">v4.2.0</span>
        </div>
      </div>
    </aside>
  );
};
