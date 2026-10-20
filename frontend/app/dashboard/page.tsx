"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { MetricRibbon } from "../../components/MetricRibbon";
import { LiveVideoQuadrant } from "../../components/LiveVideoQuadrant";
import { OperabilityGauge } from "../../components/OperabilityGauge";
import { DiscrepancyMatrix } from "../../components/DiscrepancyMatrix";
import { Section12ANotice } from "../../components/Section12ANotice";
import { LowBandwidthMonitor } from "../../components/LowBandwidthMonitor";
import { DevToolsWaterfall } from "../../components/DevToolsWaterfall";
import { EdgeCalibrator } from "../../components/EdgeCalibrator";
import { NationalCentresDirectory, CentreItem } from "../../components/NationalCentresDirectory";
import { RealWorldDatabaseManager } from "../../components/RealWorldDatabaseManager";
import { playNoticeFreezeSound, setSoundEnabled } from "../../components/SoundFx";

export default function SurveillanceCockpitPage() {
  const [activeTab, setActiveTab] = useState<string>("cockpit");
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

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

  useEffect(() => {
    setSoundEnabled(soundActive);
  }, [soundActive]);

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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden font-sans">
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

      {notification && (
        <div className="w-full bg-amber-50 border-b border-amber-200 py-2.5 px-6 text-center text-xs text-amber-900 font-medium tracking-normal animate-in fade-in duration-200 flex items-center justify-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span>{notification}</span>
        </div>
      )}

      <div className="flex-1 flex w-full relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDispatchNotice={() => {
            playNoticeFreezeSound();
            setActiveTab("section12a");
          }}
        />

        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          <MetricRibbon
            centreId={currentCentre.id}
            centreName={currentCentre.name}
            portalClaim={currentCentre.claimed}
            detectedCount={currentCentre.detected}
            discrepancyCount={ghostCount}
            operabilityScore={currentCentre.oci}
            frozenAmount={isFrozen ? currentCentre.frozenAmount : currentCentre.frozenAmount}
          />

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-6">
              <LiveVideoQuadrant />
              <OperabilityGauge
                initialOci={currentCentre.oci}
                onOciChange={(newOci) =>
                  setCurrentCentre((prev) => ({ ...prev, oci: newOci }))
                }
              />
            </div>

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

          {/* 24-Hour Continuous Telemetry Trend Strip */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                  24-Hour Continuous Attendance &amp; Machinery Trend
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Reconciled optical CCTV detection vs digital AEBAS biometric attendance across rolling 24 hours
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Verified Headcount
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Digital Biometric
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Equipment Util %
                </span>
              </div>
            </div>

            <div className="w-full h-28 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden flex items-end p-2">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <line stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="25" y2="25"></line>
                <line stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
                <line stroke="rgba(15, 23, 42, 0.06)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="1000" y1="75" y2="75"></line>
                
                <path d="M 0,30 L 120,30 L 250,28 L 420,28 L 600,28 L 800,28 L 1000,28" fill="none" stroke="#64748b" strokeDasharray="5,4" strokeWidth="1.75"></path>
                <path d="M 0,75 L 120,62 L 250,55 L 420,48 L 550,52 L 720,45 L 850,50 L 1000,52" fill="none" stroke="#d97706" strokeWidth="2"></path>
                <path d="M 0,80 L 120,48 L 250,38 L 420,42 L 550,45 L 720,48 L 850,50 L 1000,50" fill="none" stroke="#2563eb" strokeWidth="2.25"></path>
                <polygon fill="rgba(217, 119, 6, 0.09)" points="720,28 1000,28 1000,50 720,48"></polygon>
              </svg>
            </div>
          </section>

          <section>
            <RealWorldDatabaseManager onDatabaseUpdate={pollTelemetry} />
          </section>
        </main>
      </div>
    </div>
  );
}
