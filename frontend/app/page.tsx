"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MetricRibbon } from "../components/MetricRibbon";
import { LiveVideoQuadrant } from "../components/LiveVideoQuadrant";
import { OperabilityGauge } from "../components/OperabilityGauge";
import { DiscrepancyMatrix } from "../components/DiscrepancyMatrix";
import { Section12ANotice } from "../components/Section12ANotice";
import { LowBandwidthMonitor } from "../components/LowBandwidthMonitor";
import { DevToolsWaterfall } from "../components/DevToolsWaterfall";
import { EdgeCalibrator } from "../components/EdgeCalibrator";
import { NationalCentresDirectory, CentreItem } from "../components/NationalCentresDirectory";
import { playNoticeFreezeSound, setSoundEnabled } from "../components/SoundFx";

export default function MissionControlDashboard() {
  const [activeTab, setActiveTab] = useState<string>("cockpit");
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  // Active Target Centre State
  const [currentCentre, setCurrentCentre] = useState<{
    id: string;
    name: string;
    claimed: number;
    detected: number;
    oci: number;
    frozenAmount: number;
  }>({
    id: "TC-UP-VNS-0492",
    name: "Varanasi Textile & Apparel Center",
    claimed: 28,
    detected: 22,
    oci: 74.2,
    frozenAmount: 184000,
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Sync sound setting
  useEffect(() => {
    setSoundEnabled(soundActive);
  }, [soundActive]);

  // Periodic Telemetry Poll
  const pollTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.detected_headcount) {
          setCurrentCentre((prev) => ({
            ...prev,
            detected: data.detected_headcount,
            claimed: data.claimed_lms_attendance || prev.claimed,
            oci: data.operability?.operability_score || prev.oci,
          }));
        }
      }
    } catch (_err) {
      // Ignored
    }
  }, []);

  useEffect(() => {
    pollTelemetry();
    const interval = setInterval(pollTelemetry, 15000);
    return () => clearInterval(interval);
  }, [pollTelemetry]);

  const handleToggleFreeze = () => {
    setIsFrozen((prev) => {
      const next = !prev;
      setNotification(
        next
          ? "PFMS Direct Benefit Transfer tranche frozen under Section 12-A compliance order"
          : "PFMS Direct Benefit Transfer tranche resumed"
      );
      setTimeout(() => setNotification(null), 5000);
      return next;
    });
  };

  const handleSelectCentre = (c: CentreItem) => {
    setCurrentCentre({
      id: c.id,
      name: c.name,
      claimed: c.claimed,
      detected: c.detected,
      oci: c.oci,
      frozenAmount: c.penalty || 184000,
    });
    setNotification(`Monitoring focus switched to: ${c.id} (${c.name})`);
    setTimeout(() => setNotification(null), 4000);
    setActiveTab("cockpit");
  };

  const ghostCount = Math.max(0, currentCentre.claimed - currentCentre.detected);

  return (
    <div className="bg-[#080c14] text-slate-100 min-h-screen flex flex-col selection:bg-sky-500 selection:text-black overflow-x-hidden font-sans">
      {/* 1. Executive Minimalist Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowBwMode={lowBwMode}
        setLowBwMode={setLowBwMode}
        soundEnabled={soundActive}
        setSoundEnabled={setSoundActive}
        onRefresh={pollTelemetry}
        onEmergencyFreeze={handleToggleFreeze}
        freezeActive={isFrozen}
      />

      {/* Global Minimal Notification Banner */}
      {notification && (
        <div className="w-full bg-rose-500/[0.08] border-b border-rose-500/20 py-2 px-6 text-center text-xs text-rose-300 font-medium tracking-wide animate-in fade-in duration-200 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Main Executive Workspace: Sidebar + Command Surface */}
      <div className="flex-1 flex w-full relative">
        {/* Sleek Docked Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDispatchNotice={() => {
            playNoticeFreezeSound();
            setActiveTab("section12a");
          }}
        />

        {/* Dynamic Executive Surface */}
        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          {/* Executive Metric Ribbon (Visible in overview) */}
          <MetricRibbon
            centreId={currentCentre.id}
            centreName={currentCentre.name}
            portalClaim={currentCentre.claimed}
            detectedCount={currentCentre.detected}
            discrepancyCount={ghostCount}
            operabilityScore={currentCentre.oci}
            frozenAmount={isFrozen ? currentCentre.frozenAmount : currentCentre.frozenAmount}
          />

          {/* View Router */}
          {activeTab === "cockpit" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Surveillance & Compliance Split Grid (7 cols left, 5 cols right) */}
              <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Column: Live Feed + Operability */}
                <div className="xl:col-span-7 space-y-6">
                  <LiveVideoQuadrant />
                  <OperabilityGauge
                    initialOci={currentCentre.oci}
                    onOciChange={(newOci) =>
                      setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                    }
                  />
                </div>

                {/* Right Column: Attendance Matrix + Section 12-A + Low-BW */}
                <div className="xl:col-span-5 space-y-6">
                  <DiscrepancyMatrix />
                  <Section12ANotice
                    frozenAmount={currentCentre.frozenAmount}
                    centreId={currentCentre.id}
                    centreName={currentCentre.name}
                    ghostCount={ghostCount}
                    ociScore={currentCentre.oci}
                    isFrozen={isFrozen}
                    onToggleFreeze={handleToggleFreeze}
                  />
                  <LowBandwidthMonitor
                    centreId={currentCentre.id}
                    detectedCount={currentCentre.detected}
                    portalClaim={currentCentre.claimed}
                    discrepancyDelta={-ghostCount}
                    ociScore={currentCentre.oci}
                  />
                </div>
              </section>

              {/* 24-Hour Continuous Telemetry Trend Strip (Luxury Minimalist Edition) */}
              <section className="luxury-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="font-semibold text-sm text-white tracking-tight">
                      24-Hour Continuous Telemetry &amp; OCI Trend
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">
                      Reconciled optical detection vs biometric claimed headcount over rolling 24-hour window
                    </p>
                  </div>
                  <div className="flex items-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span> Vision Headcount
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span> Claimed Biometric
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> OCI Util %
                    </span>
                  </div>
                </div>

                {/* Elegant SVG Chart */}
                <div className="w-full h-28 rounded-xl bg-white/[0.01] border border-white/[0.04] relative overflow-hidden flex items-end p-2">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                    {/* Subtle Gridlines */}
                    <line stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="25" y2="25"></line>
                    <line stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
                    <line stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="75" y2="75"></line>
                    
                    {/* Portal Claim Line (Dotted Slate) */}
                    <path d="M 0,30 L 120,30 L 250,28 L 420,28 L 600,28 L 800,28 L 1000,28" fill="none" stroke="rgba(148,163,184,0.4)" strokeDasharray="5,4" strokeWidth="1.5"></path>
                    
                    {/* OCI Operability (Champagne Amber) */}
                    <path d="M 0,75 L 120,62 L 250,55 L 420,48 L 550,52 L 720,45 L 850,50 L 1000,52" fill="none" stroke="#f59e0b" strokeWidth="1.75"></path>
                    
                    {/* Vision Detected Line (Sky Blue) */}
                    <path d="M 0,80 L 120,48 L 250,38 L 420,42 L 550,45 L 720,48 L 850,50 L 1000,50" fill="none" stroke="#38bdf8" strokeWidth="2"></path>
                    
                    {/* Soft Discrepancy Highlight */}
                    <polygon fill="rgba(245, 158, 11, 0.08)" points="720,28 1000,28 1000,50 720,48"></polygon>
                  </svg>
                </div>
              </section>
            </div>
          )}

          {activeTab === "cctv" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <LiveVideoQuadrant />
              <OperabilityGauge
                initialOci={currentCentre.oci}
                onOciChange={(newOci) =>
                  setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                }
              />
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <DiscrepancyMatrix />
            </div>
          )}

          {activeTab === "assets" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <OperabilityGauge
                initialOci={currentCentre.oci}
                onOciChange={(newOci) =>
                  setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                }
              />
            </div>
          )}

          {activeTab === "section12a" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <Section12ANotice
                frozenAmount={currentCentre.frozenAmount}
                centreId={currentCentre.id}
                centreName={currentCentre.name}
                ghostCount={ghostCount}
                ociScore={currentCentre.oci}
                isFrozen={isFrozen}
                onToggleFreeze={handleToggleFreeze}
              />
            </div>
          )}

          {activeTab === "waterfall" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <DevToolsWaterfall />
              <LowBandwidthMonitor
                centreId={currentCentre.id}
                detectedCount={currentCentre.detected}
                portalClaim={currentCentre.claimed}
                discrepancyDelta={-ghostCount}
                ociScore={currentCentre.oci}
              />
            </div>
          )}

          {activeTab === "calibrator" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <EdgeCalibrator onSyncSuccess={pollTelemetry} />
            </div>
          )}

          {activeTab === "directory" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <NationalCentresDirectory
                selectedCentreId={currentCentre.id}
                onSelectCentre={handleSelectCentre}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
