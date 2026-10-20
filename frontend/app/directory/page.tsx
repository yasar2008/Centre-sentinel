"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { NationalCentresDirectory, CentreItem } from "../../components/NationalCentresDirectory";
import { useRouter } from "next/navigation";

export default function DirectorySubpage() {
  const router = useRouter();
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("TC-UP-VNS-0492");

  const handleSelectCentre = (c: CentreItem) => {
    setSelectedId(c.id);
    router.push(`/dashboard?centre=${encodeURIComponent(c.id)}`);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        activeTab="directory"
        lowBwMode={lowBwMode}
        setLowBwMode={setLowBwMode}
        soundEnabled={soundActive}
        setSoundEnabled={setSoundActive}
        onRefresh={() => {}}
        onEmergencyFreeze={() => setIsFrozen((p) => !p)}
        freezeActive={isFrozen}
      />

      <div className="flex-1 flex w-full relative">
        <Sidebar activeTab="directory" />

        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          <NationalCentresDirectory
            selectedCentreId={selectedId}
            onSelectCentre={handleSelectCentre}
          />
        </main>
      </div>
    </div>
  );
}
