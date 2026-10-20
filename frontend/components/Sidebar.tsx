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
  Send
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
    { id: "cockpit", label: "Command Matrix", icon: "dashboard" },
    { id: "cctv", label: "Edge CCTV", icon: "videocam" },
    { id: "audit", label: "Attendance Audit", icon: "groups" },
    { id: "assets", label: "Asset & OCI Audit", icon: "precision_manufacturing" },
    { id: "section12a", label: "Section 12-A Enforcement", icon: "gavel" },
    { id: "waterfall", label: "Rural Telemetry", icon: "wifi_tethering" },
    { id: "calibrator", label: "Edge Calibrator", icon: "tune" },
    { id: "directory", label: "National Centres", icon: "apartment" },
  ];

  return (
    <aside className="w-14 lg:w-60 border-r border-outline-variant bg-surface-container-low flex flex-col justify-between py-2 px-1.5 shrink-0 select-none z-40 transition-all duration-200">
      {/* Upper Navigation Cluster */}
      <div className="space-y-3">
        {/* Sub-header */}
        <div className="hidden lg:block px-2 py-1 border-b border-outline-variant/60">
          <div className="font-mono text-[11px] text-primary tracking-widest font-bold">
            KAUSHAL-DRISHTI
          </div>
          <div className="font-mono text-[9px] text-on-surface-variant/70">
            MSDE Edge Telemetry v4.2
          </div>
        </div>

        {/* Tab Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playTacticalClick();
                  setActiveTab(item.id);
                }}
                className={`w-full text-left font-mono text-[11px] flex items-center gap-2.5 px-2 py-1.5 rounded-sm transition-all group ${
                  isActive
                    ? "border-l-2 border-primary bg-surface-container-high text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-l-2 border-transparent"
                }`}
                title={item.label}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span className="hidden lg:inline uppercase tracking-wider truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Dispatch Notice Quick Action */}
        <div className="px-1 pt-1">
          <button
            onClick={() => {
              playTacticalClick();
              onDispatchNotice();
            }}
            className="w-full py-1.5 px-2 bg-primary/10 border border-primary/60 hover:bg-primary/20 text-primary font-mono text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all active:scale-98"
            title="Dispatch Section 12-A Show-Cause Notice"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span className="hidden lg:inline">Dispatch Notice</span>
          </button>
        </div>
      </div>

      {/* Lower Section: Edge Status Micro-Pill */}
      <div className="space-y-2 border-t border-outline-variant/60 pt-2">
        <div className="hidden lg:block p-2 bg-surface-container border border-outline-variant/60 font-mono text-[10px] space-y-1">
          <div className="flex justify-between items-center text-outline">
            <span>EDGE CLUSTER:</span>
            <span className="text-tertiary font-bold">UPTIME 99.8%</span>
          </div>
          <div className="flex justify-between items-center text-outline">
            <span>INFERENCE:</span>
            <span className="text-primary font-bold">18.2ms INT8</span>
          </div>
          <div className="flex justify-between items-center text-outline">
            <span>PIPELINE FPS:</span>
            <span className="text-on-surface">48 AGGREGATE</span>
          </div>
        </div>

        {/* Quick Diagnostic Links */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab("waterfall");
            }}
            className="w-full text-left text-on-surface-variant font-mono text-[10px] flex items-center gap-2 px-2 py-1 hover:text-on-surface hover:bg-surface-container rounded-sm"
          >
            <span className="material-symbols-outlined text-[16px]">memory</span>
            <span className="hidden lg:inline uppercase">Diagnostics</span>
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab("calibrator");
            }}
            className="w-full text-left text-on-surface-variant font-mono text-[10px] flex items-center gap-2 px-2 py-1 hover:text-on-surface hover:bg-surface-container rounded-sm"
          >
            <span className="material-symbols-outlined text-[16px]">settings_alert</span>
            <span className="hidden lg:inline uppercase">Edge Config</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
