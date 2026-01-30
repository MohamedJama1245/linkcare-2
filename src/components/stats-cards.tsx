"use client";

import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const complianceRate = stats.totalPatients > 0 
    ? Math.round((stats.onTrack / stats.totalPatients) * 100) 
    : 0;
  
  const responseRate = (stats.awaitingResponse + stats.confirmedMessages + stats.rejectedMessages) > 0
    ? Math.round((stats.confirmedMessages / (stats.awaitingResponse + stats.confirmedMessages + stats.rejectedMessages)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Row 1: Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Patients */}
        <div className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] group hover:border-white/[0.12] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Total Patients
                </p>
                <p className="text-[11px] text-white/30">
                  Active in system
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <Users className="h-6 w-6 text-teal-400" />
              </div>
            </div>
            
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-white tracking-tight">
                {stats.totalPatients}
              </span>
              {stats.totalPatients > 0 && (
                <div className="flex items-center gap-1.5 pb-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
                  <Activity className="h-3.5 w-3.5 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* On Track */}
        <div className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px]" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">
                  On Track
                </p>
                <p className="text-[11px] text-emerald-300/50">
                  Following protocol
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-white tracking-tight">
                {stats.onTrack}
              </span>
              {complianceRate > 0 && (
                <div className="flex items-center gap-1.5 pb-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    {complianceRate}%
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* At Risk */}
        <div className={cn(
          "relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/20 group hover:border-amber-500/30 transition-all",
          stats.atRisk > 0 && "ring-1 ring-amber-500/30"
        )}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[60px]" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">
                  At Risk
                </p>
                <p className="text-[11px] text-amber-300/50">
                  Needs attention
                </p>
              </div>
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30",
                stats.atRisk > 0 && "animate-pulse"
              )}>
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-white tracking-tight">
                {stats.atRisk}
              </span>
              {stats.atRisk > 0 && stats.totalPatients > 0 && (
                <div className="flex items-center gap-1.5 pb-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">
                    {Math.round((stats.atRisk / stats.totalPatients) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Workflow Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Awaiting Response */}
        <div className="relative p-5 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group hover:border-white/[0.1] hover:bg-white/[0.03] transition-all">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/15 transition-colors">
              <Clock className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.awaitingResponse}
              </p>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
                Awaiting
              </p>
            </div>
            {stats.awaitingResponse > 0 && (
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Confirmed */}
        <div className="relative p-5 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group hover:border-white/[0.1] hover:bg-white/[0.03] transition-all">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/15 transition-colors">
              <ThumbsUp className="h-5 w-5 text-teal-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.confirmedMessages}
              </p>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
                Confirmed
              </p>
            </div>
            {responseRate > 70 && (
              <ArrowUpRight className="h-4 w-4 text-teal-400" />
            )}
          </div>
        </div>

        {/* Rejected */}
        <div className={cn(
          "relative p-5 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group hover:border-white/[0.1] hover:bg-white/[0.03] transition-all",
          stats.rejectedMessages > 0 && "ring-1 ring-rose-500/20 bg-rose-500/5"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center justify-center w-11 h-11 rounded-xl transition-colors",
              stats.rejectedMessages > 0 
                ? "bg-rose-500/15 border border-rose-500/20 group-hover:bg-rose-500/20" 
                : "bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.06]"
            )}>
              <ThumbsDown className={cn(
                "h-5 w-5",
                stats.rejectedMessages > 0 ? "text-rose-400" : "text-white/30"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-2xl font-bold tabular-nums",
                stats.rejectedMessages > 0 ? "text-rose-300" : "text-white"
              )}>
                {stats.rejectedMessages}
              </p>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
                Rejected
              </p>
            </div>
            {stats.rejectedMessages > 0 && (
              <ArrowDownRight className="h-4 w-4 text-rose-400" />
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="relative p-5 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group hover:border-white/[0.1] hover:bg-white/[0.03] transition-all">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/15 transition-colors">
              <Calendar className="h-5 w-5 text-violet-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.upcomingProcedures}
              </p>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
                Next 7d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Response Rate Overview */}
      {(stats.confirmedMessages + stats.rejectedMessages + stats.awaitingResponse) > 0 && (
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-white/40" />
              <span className="text-sm font-medium text-white/70">Response Overview</span>
            </div>
            <span className="text-xs text-white/30 tabular-nums">
              {stats.confirmedMessages + stats.rejectedMessages + stats.awaitingResponse} total messages
            </span>
          </div>
          
          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.06]">
            <div 
              className="bg-teal-500 transition-all duration-700"
              style={{ 
                width: `${(stats.confirmedMessages / (stats.confirmedMessages + stats.rejectedMessages + stats.awaitingResponse)) * 100}%` 
              }}
            />
            <div 
              className="bg-rose-500 transition-all duration-700"
              style={{ 
                width: `${(stats.rejectedMessages / (stats.confirmedMessages + stats.rejectedMessages + stats.awaitingResponse)) * 100}%` 
              }}
            />
            <div 
              className="bg-indigo-500 transition-all duration-700"
              style={{ 
                width: `${(stats.awaitingResponse / (stats.confirmedMessages + stats.rejectedMessages + stats.awaitingResponse)) * 100}%` 
              }}
            />
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-white/50">Confirmed ({stats.confirmedMessages})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-white/50">Rejected ({stats.rejectedMessages})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-white/50">Awaiting ({stats.awaitingResponse})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
