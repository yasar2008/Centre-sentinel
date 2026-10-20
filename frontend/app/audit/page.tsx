"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { DiscrepancyMatrix } from "../../components/DiscrepancyMatrix";

export default function AuditSubpage() {
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        activeTab="audit"
        lowBwMode={lowBwMode}
        setLowBwMode={setLowBwMode}
        soundEnabled={soundActive}
        setSoundEnabled={setSoundActive}
        onRefresh={() => {}}
        onEmergencyFreeze={() => setIsFrozen((p) => !p)}
        freezeActive={isFrozen}
      />

      <div className="flex-1 flex w-full relative">
        <Sidebar activeTab="audit" />

        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          <DiscrepancyMatrix />
        </main>
      </div>
    </div>
  );
}
