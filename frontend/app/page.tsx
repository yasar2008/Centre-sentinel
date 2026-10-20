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
          ? "CRITICAL ALERT: PFMS DIRECT BENEFIT TRANSFER TRANCHE FROZEN UNDER SECTION 12-A"
          : "PFMS DBT TRANCHE RESUMED"
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
    setNotification(`MISSION CONTROL FOCUS SHIFTED TO: ${c.id} (${c.district}, ${c.state})`);
    setTimeout(() => setNotification(null), 4000);
    setActiveTab("cockpit");
  };

  const ghostCount = Math.max(0, currentCentre.claimed - currentCentre.detected);

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col tactical-grid selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* 1. Top Executive Tactical Header */}
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

      {/* Global Alert Notification Banner */}
      {notification && (
        <div className="w-full bg-red-950/90 border-y border-red-500 py-1.5 px-4 text-center font-mono text-xs text-red-200 font-bold tracking-wider animate-in fade-in duration-150 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-none animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Main Operational Viewport: Docked Sidebar + Fluid Command Canvas */}
      <div className="flex-1 flex w-full relative">
        {/* Docked Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDispatchNotice={() => {
            playNoticeFreezeSound();
            setActiveTab("section12a");
          }}
        />

        {/* Dynamic Command Canvas */}
        <main className="flex-1 p-2 sm:p-4 space-y-4 max-w-full overflow-hidden">
          {/* Sovereign Metric Ribbon (Always visible in cockpit) */}
          <MetricRibbon
            centreId={currentCentre.id}
            centreName={currentCentre.name}
            portalClaim={currentCentre.claimed}
            detectedCount={currentCentre.detected}
            discrepancyCount={ghostCount}
            operabilityScore={currentCentre.oci}
            frozenAmount={isFrozen ? currentCentre.frozenAmount : currentCentre.frozenAmount}
          />

          {/* Conditional View Router */}
          {activeTab === "cockpit" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Main Surveillance & Triage Cockpit Grid (7 cols left, 5 cols right) */}
              <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Left & Center: Live CCTV with HUD + Equipment Operability */}
                <div className="xl:col-span-7 space-y-4">
                  <LiveVideoQuadrant />
                  <OperabilityGauge
                    initialOci={currentCentre.oci}
                    onOciChange={(newOci) =>
                      setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                    }
                  />
                </div>

                {/* Right: Attendance Discrepancy Matrix + Section 12-A + Low-BW Monitor */}
                <div className="xl:col-span-5 space-y-4">
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

              {/* 24-Hour Continuous Discrepancy & OCI Trend Strip */}
              <section className="bg-surface-container-low border border-outline-variant p-3.5 hud-bracket">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-outline-variant/60">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-on-surface">
                      24-Hour Continuous Discrepancy &amp; OCI Trend
                    </span>
                    <span className="font-mono text-[10px] text-outline uppercase">
                      [POLLING INTERVAL: 60s • SEC-HASH: 8F9A2B]
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-primary">
                      <span className="w-2.5 h-0.5 bg-primary inline-block"></span> Vision Headcount
                    </span>
                    <span className="flex items-center gap-1.5 text-outline">
                      <span className="w-2.5 h-0.5 bg-outline inline-block"></span> Claimed Biometric
                    </span>
                    <span className="flex items-center gap-1.5 text-secondary">
                      <span className="w-2.5 h-0.5 bg-secondary inline-block"></span> OCI Operability %
                    </span>
                  </div>
                </div>

                {/* Tactical SVG Telemetry Graph */}
                <div className="w-full h-24 bg-surface-container-lowest border border-outline-variant/40 relative overflow-hidden flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                    <line stroke="#1e293b" strokeDasharray="4,4" strokeWidth="0.8" x1="0" x2="1000" y1="25" y2="25"></line>
                    <line stroke="#1e293b" strokeDasharray="4,4" strokeWidth="0.8" x1="0" x2="1000" y1="50" y2="50"></line>
                    <line stroke="#1e293b" strokeDasharray="4,4" strokeWidth="0.8" x1="0" x2="1000" y1="75" y2="75"></line>
                    {/* Portal Claim Line (Dotted Gray) */}
                    <path d="M 0,30 L 100,30 L 250,28 L 400,28 L 600,28 L 800,28 L 1000,28" fill="none" stroke="#88929b" strokeDasharray="6,3" strokeWidth="1.5"></path>
                    {/* OCI Operability (Amber) */}
                    <path d="M 0,80 L 120,65 L 250,55 L 420,48 L 550,52 L 720,45 L 850,50 L 1000,52" fill="none" stroke="#ffb77a" strokeWidth="1.8"></path>
                    {/* Vision Detected Headcount Line (Cyan Glow) */}
                    <path d="M 0,85 L 120,50 L 250,38 L 420,42 L 550,45 L 720,48 L 850,50 L 1000,50" fill="none" stroke="#89ceff" strokeWidth="2.2"></path>
                    {/* Discrepancy Highlight Area */}
                    <polygon fill="rgba(255, 153, 51, 0.12)" points="720,28 1000,28 1000,50 720,48"></polygon>
                  </svg>
                </div>
              </section>
            </div>
          )}

          {activeTab === "cctv" && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
            <div className="space-y-4 animate-in fade-in duration-150">
              <DiscrepancyMatrix />
            </div>
          )}

          {activeTab === "assets" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <OperabilityGauge
                initialOci={currentCentre.oci}
                onOciChange={(newOci) =>
                  setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                }
              />
            </div>
          )}

          {activeTab === "section12a" && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
            <div className="space-y-4 animate-in fade-in duration-150">
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
            <div className="space-y-4 animate-in fade-in duration-150">
              <EdgeCalibrator onSyncSuccess={pollTelemetry} />
            </div>
          )}

          {activeTab === "directory" && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
