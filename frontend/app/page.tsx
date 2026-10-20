"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { LoadingScreen } from "../components/LoadingScreen";
import {
  Video,
  LayoutDashboard,
  Database,
  Building2,
  Gavel,
  Users,
  Shield,
  CheckCircle2,
  Activity,
  ArrowRight,
  ExternalLink,
  Wifi,
  Radio,
  FileText,
  MapPin,
  Sparkles
} from "lucide-react";
import { playTacticalClick } from "../components/SoundFx";

export default function GrandMainPage() {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [forceLoader, setForceLoader] = useState<boolean>(false);

  const subpages = [
    {
      title: "Live Camera Wall (12 National Locations)",
      desc: "Simultaneous live CCTV streams across Uttar Pradesh, Maharashtra, Bihar, Jharkhand, and 8 other states with DPDP face privacy blurring.",
      href: "/cameras",
      icon: Video,
      badge: "12 Live Streams",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cta: "Open Live Wall",
      highlight: "Real-Time 25 FPS Feeds",
    },
    {
      title: "Surveillance Cockpit",
      desc: "High-resolution inspection monitor with spatial equipment hands-on operability (OCI) and 24-hour continuous attendance trend telemetry.",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Operational Cockpit",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      cta: "Launch Cockpit",
      highlight: "YOLOv8 + IoU Matrix",
    },
    {
      title: "Real SQLite Database & AEBAS Biometric Terminal",
      desc: "Live Aadhaar biometric punch recorder, candidate enrollment workbench, and sandboxed SQL query explorer with instant database export.",
      href: "/database",
      icon: Database,
      badge: "Persistent DB",
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      cta: "Open Database",
      highlight: "SQLite WAL Engine",
    },
    {
      title: "Attendance Verification & Trainee Roster",
      desc: "Candidate-by-candidate audit cross-referencing biometric punch timestamps against physical camera presence to flag ghost attendance.",
      href: "/audit",
      icon: Users,
      badge: "Trainee Roster",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      cta: "Inspect Roster",
      highlight: "Ghost Detection",
    },
    {
      title: "Empaneled Centres Directory (15,000+ Facilities)",
      desc: "National registry of accredited training centres under PMKK, KVK, JSS, and NSDC schemes with state-wise filtering and compliance records.",
      href: "/directory",
      icon: Building2,
      badge: "National Registry",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      cta: "Browse Directory",
      highlight: "15,482 Facilities",
    },
    {
      title: "Section 12-A Statutory Subsidy Compliance",
      desc: "PFMS Direct Benefit Transfer subsidy withholding engine with penalty calculations and official Ministry Show-Cause Notice dossiers.",
      href: "/compliance",
      icon: Gavel,
      badge: "Rule 12-A Enforcement",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      cta: "View Grant Orders",
      highlight: "₹14.8 Cr Protected",
    },
  ];

  const featuredFeeds = [
    {
      name: "Varanasi Textile & Apparel Center",
      location: "Uttar Pradesh",
      scheme: "PMKK",
      videoSrc: "/videos/cam01_sewing.webm",
      trade: "Industrial Sewing (JUKI)",
      claimed: 28,
      detected: 22,
      status: "Discrepancy (-6)",
    },
    {
      name: "Pune Precision Robotics Lab",
      location: "Maharashtra",
      scheme: "NSDC",
      videoSrc: "/videos/cam02_cnc.webm",
      trade: "CNC Machining & SMT",
      claimed: 25,
      detected: 21,
      status: "Review Needed",
    },
    {
      name: "Ranchi Advanced Electrical Hub",
      location: "Jharkhand",
      scheme: "PMKK",
      videoSrc: "/videos/cam03_electronics.webm",
      trade: "SMT Circuit Soldering",
      claimed: 24,
      detected: 22,
      status: "Compliant",
    },
    {
      name: "Guwahati Agro-Processing Unit",
      location: "Assam",
      scheme: "KVK",
      videoSrc: "/videos/cam04_classroom.webm",
      trade: "Food Tech Practical",
      claimed: 18,
      detected: 14,
      status: "Discrepancy (-4)",
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Official Institutional Loading Screen */}
      {showLoader && (
        <LoadingScreen
          onComplete={() => {
            setShowLoader(false);
            setForceLoader(false);
          }}
          forceShow={forceLoader}
        />
      )}

      {/* 2. Official Ministry Header */}
      <Header
        activeTab="home"
        onTriggerLoading={() => {
          setForceLoader(true);
          setShowLoader(true);
        }}
      />

      {/* 3. Main Landing Surface */}
      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 py-12 px-5 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto space-y-6 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
                Government of India • Ministry Portal
              </span>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                Smart India Hackathon 2026 • Problem ID 26245
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                National Grid Active
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                PRASHIKSHAN SAMIKSHA
              </h1>
              <div className="text-lg sm:text-xl font-bold text-blue-800">
                राष्ट्रीय कौशल प्रशिक्षण केंद्र निगरानी एवं बायोमेट्रिक सत्यापन पोर्टल
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                National real-time privacy-preserving video analytics platform monitoring empaneled vocational training centres across India.
                Reconciles digital Aadhaar AEBAS biometric attendance sheets against physical CCTV headcount while auditing hands-on machinery operability under rural low-bandwidth constraints.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <Link
                href="/cameras"
                onClick={() => playTacticalClick()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <Video className="w-4 h-4" />
                <span>View All 12 Live Cameras</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                onClick={() => playTacticalClick()}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Surveillance Cockpit</span>
              </Link>

              <Link
                href="/database"
                onClick={() => playTacticalClick()}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
              >
                <Database className="w-4 h-4 text-slate-600" />
                <span>AEBAS Database</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. National Key Performance Indicators Ribbon */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accredited Centres</div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">15,482</div>
              <div className="text-[10px] text-slate-400 mt-0.5">PMKK, JSS, KVK, NSDC</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Trainees</div>
              <div className="text-2xl font-bold tracking-tight text-blue-700 mt-1">482,910</div>
              <div className="text-[10px] text-slate-400 mt-0.5">AEBAS Registered</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Attendance Match</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1">99.4%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Physical Reconciliation</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Cameras</div>
              <div className="text-2xl font-bold tracking-tight text-purple-700 mt-1">12 Streams</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Nationwide Coverage</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Protected Subsidies</div>
              <div className="text-2xl font-bold tracking-tight text-rose-700 mt-1">₹14.82 Cr</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Sec 12-A Recovered</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bandwidth Saved</div>
              <div className="text-2xl font-bold tracking-tight text-amber-700 mt-1">99.98%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">2KB Solar Telemetry</div>
            </div>
          </div>
        </section>

        {/* 5. Subpage Directory Gateway */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">
          <div className="flex justify-between items-end pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                National Portal Architecture &amp; Subpages
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct access to specialized surveillance, biometric database, compliance enforcement, and audit modules
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">6 Functional Modules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subpages.map((sp) => {
              const Icon = sp.icon;
              return (
                <Link
                  key={sp.href}
                  href={sp.href}
                  onClick={() => playTacticalClick()}
                  className="bg-white border border-slate-200 hover:border-blue-500/80 hover:shadow-md rounded-2xl p-5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-800 group-hover:text-blue-700 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sp.badgeColor}`}>
                        {sp.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                        {sp.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {sp.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {sp.highlight}
                    </span>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {sp.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 6. Live National Camera Snapshot Preview Strip */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                Live Camera Feeds Snapshot (Featured National Labs)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time optical audit streaming directly from remote vocational training classrooms
              </p>
            </div>
            <Link
              href="/cameras"
              onClick={() => playTacticalClick()}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All 12 Feeds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredFeeds.map((ff, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900">
                  <video
                    src={ff.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-medium">
                    {ff.location} • {ff.scheme}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-900/80 backdrop-blur-xs text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    DPDP
                  </div>
                </div>

                <div className="p-3 space-y-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 truncate">{ff.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{ff.trade}</p>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-slate-600">Present: <strong className="text-emerald-700">{ff.detected}</strong> / {ff.claimed}</span>
                    <span className="font-semibold text-slate-800">{ff.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Institutional Compliance & Privacy Guarantee */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              Statutory Privacy &amp; Data Security Guarantee
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  Adherence to Digital Personal Data Protection (DPDP) Act 2023
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  All computer vision inference is processed exclusively on localized edge hardware. Faces of trainees are automatically anonymized via dynamic Gaussian blurring ($k=51 \times 51$). No raw biometric images or facial embeddings are stored or transmitted, guaranteeing strict adherence to citizen privacy and MSDE security guidelines.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Biometric Image Storage</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SHA-256 Tamper-Proof Audit Hashes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PFMS Direct Benefit Transfer Integration</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Official Government Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-5 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-slate-800">
              PRASHIKSHAN SAMIKSHA • Scheme Monitoring Unit (SMU)
            </div>
            <div>
              Ministry of Skill Development and Entrepreneurship, Government of India
            </div>
            <div className="text-[11px] text-slate-400">
              Smart India Hackathon 2026 • Problem ID 26245
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-slate-600">
            <Link href="/cameras" className="hover:text-blue-700">12 Live Cameras</Link>
            <Link href="/dashboard" className="hover:text-blue-700">Surveillance Cockpit</Link>
            <Link href="/database" className="hover:text-blue-700">AEBAS Database</Link>
            <Link href="/directory" className="hover:text-blue-700">Centres Directory</Link>
            <Link href="/compliance" className="hover:text-blue-700">Rule 12-A Notices</Link>
            <Link href="/audit" className="hover:text-blue-700">Attendance Roster</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
