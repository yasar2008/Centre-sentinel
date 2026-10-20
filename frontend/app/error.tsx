"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Centre Sentinel Client Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60 uppercase tracking-widest">
            Diagnostic Safeguard
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-2">
            Portal Rendering Exception Handled
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The telemetry interface encountered a client-side execution event. State has been isolated to prevent session loss.
          </p>
        </div>

        {error.message && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 text-left overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Module</span>
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Portal Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
