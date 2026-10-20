"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { AllLocationsCameraWall } from "../../components/AllLocationsCameraWall";
import { useRouter } from "next/navigation";

export default function CamerasSubpage() {
  const router = useRouter();
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const handleInspectCentre = (centreId: string) => {
    router.push(`/dashboard?centre=${encodeURIComponent(centreId)}`);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        activeTab="cctv"
        lowBwMode={lowBwMode}
        setLowBwMode={setLowBwMode}
        soundEnabled={soundActive}
        setSoundEnabled={setSoundActive}
        onRefresh={() => {}}
        onEmergencyFreeze={() => setIsFrozen((p) => !p)}
        freezeActive={isFrozen}
      />

      <div className="flex-1 flex w-full relative">
        <Sidebar activeTab="cctv" />

        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          <AllLocationsCameraWall onSelectInspect={handleInspectCentre} />
        </main>
      </div>
    </div>
  );
}
