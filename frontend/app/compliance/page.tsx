"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Section12ANotice } from "../../components/Section12ANotice";
import { Gavel, ShieldCheck, AlertOctagon, FileText, Download } from "lucide-react";

export default function ComplianceSubpage() {
  const [lowBwMode, setLowBwMode] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        activeTab="section12a"
        lowBwMode={lowBwMode}
        setLowBwMode={setLowBwMode}
        soundEnabled={soundActive}
        setSoundEnabled={setSoundActive}
        onRefresh={() => {}}
        onEmergencyFreeze={() => setIsFrozen((p) => !p)}
        freezeActive={isFrozen}
      />

      <div className="flex-1 flex w-full relative">
        <Sidebar activeTab="section12a" />

        <main className="flex-1 p-5 sm:p-7 space-y-6 max-w-full overflow-hidden">
          {/* Statutory Scheme Directive Banner */}
          <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <Gavel className="w-4 h-4 text-rose-600" />
              Statutory Section 12-A Enforcement Framework (Rule 12-A Guidelines)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under Section 12-A of the National Skill Development Scheme Guidelines, training provider grant disbursements
              are automatically subjected to statutory withholding orders if physical attendance falls below digital claims
              or practical hands-on machinery operability (OCI) drops under the statutory 80% benchmark.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <Section12ANotice
                frozenAmount={184000}
                centreId="TC-UP-VNS-0492"
                centreName="Varanasi Textile & Apparel Center"
                ghostCount={6}
                ociScore={74.2}
                isFrozen={isFrozen}
                onToggleFreeze={() => setIsFrozen((p) => !p)}
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  National Recovery &amp; DBT Protection Ledger
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Total National Protected Subsidies</div>
                      <div className="text-slate-500 text-[11px]">FY 2025-26 Cumulative Recovery</div>
                    </div>
                    <div className="text-base font-bold text-emerald-700">₹14,82,40,000</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Show-Cause Notices Issued</div>
                      <div className="text-slate-500 text-[11px]">Active Section 12-A Inquiries</div>
                    </div>
                    <div className="text-base font-bold text-amber-700">142 Facilities</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Resolved &amp; Grants Released</div>
                      <div className="text-slate-500 text-[11px]">Post-Rectification Audits Passed</div>
                    </div>
                    <div className="text-base font-bold text-blue-700">1,108 Facilities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
