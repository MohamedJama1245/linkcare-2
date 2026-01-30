export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import Link from "next/link";
import { 
  Plus, 
  Activity, 
  Stethoscope, 
  Calendar, 
  BookOpen, 
  ArrowLeft, 
  Home,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Users,
  Zap,
  BarChart3,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientForm } from "@/components/patient-form";
import { PatientTable } from "@/components/patient-table";
import { StatsCards } from "@/components/stats-cards";
import { ResetDemoButton } from "@/components/reset-demo-button";
import { getPatients, getDashboardStats } from "@/lib/actions";

// Loading skeleton for stats - enhanced
function StatsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[160px] bg-white/[0.03] rounded-2xl animate-pulse border border-white/[0.06]" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[90px] bg-white/[0.02] rounded-xl animate-pulse border border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}

// Loading skeleton for table - enhanced
function TableLoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.02]">
      <div className="h-14 bg-white/[0.03] border-b border-white/[0.06]" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 border-b border-white/[0.04] animate-pulse" />
      ))}
    </div>
  );
}

// Stats component with data fetching
async function DashboardStats() {
  const stats = await getDashboardStats();
  return <StatsCards stats={stats} />;
}

// Patients table with data fetching
async function PatientsData() {
  const patients = await getPatients();
  return <PatientTable patients={patients} />;
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0d]">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-teal-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header - Premium glass effect */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0a0b0d]/80 border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/[0.06] text-white/60 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="relative">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/20">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0b0d]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-semibold text-white tracking-tight">
                    LinkCare
                  </h1>
                  <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold rounded-full border border-teal-500/20 uppercase tracking-wider">
                    Dashboard
                  </span>
                </div>
                <p className="text-xs text-white/40 font-medium">
                  Patient Management System
                </p>
              </div>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-2">
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-1 mr-3 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg h-9 px-4">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/demo/dashboard">
                  <Button variant="ghost" size="sm" className="text-white bg-white/[0.08] hover:bg-white/[0.12] rounded-lg h-9 px-4">
                    <Activity className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/demo/reminders">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg h-9 px-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Timeline
                  </Button>
                </Link>
              </nav>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/[0.06] text-white/40 hover:text-white hidden lg:flex">
                  <Bell className="h-5 w-5" />
                </Button>
                
                {/* Add Patient Button */}
                <PatientForm>
                  <Button className="h-10 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30 gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Patient</span>
                  </Button>
                </PatientForm>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        <div className="space-y-10">
          {/* Page Header - Enhanced */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
                  <BarChart3 className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Patient Dashboard
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      Live
                    </span>
                  </div>
                  <p className="text-white/40 text-sm mt-1">
                    Monitor patient progress and pre-operative compliance
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ResetDemoButton />
              <Link href="/demo/reminders">
                <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15]">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Timeline
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium">NICE Compliant</p>
                <p className="text-sm text-white font-semibold">All protocols verified</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium">Auto-Send</p>
                <p className="text-sm text-white font-semibold">Messages sent on time</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium">Real-time</p>
                <p className="text-sm text-white font-semibold">Tracking active</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Clock className="h-4 w-4" />
              Auto-processing enabled
            </div>
          </div>

          {/* Stats Cards */}
          <section>
            <Suspense fallback={<StatsLoadingSkeleton />}>
              <DashboardStats />
            </Suspense>
          </section>

          {/* Patient Table Section */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <Users className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Patients</h3>
                  <p className="text-xs text-white/40">Click any row to view details and message timeline</p>
                </div>
              </div>
              
              {/* Search and Filter - Placeholder for future enhancement */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden lg:inline">Search</span>
                </Button>
                <Button variant="outline" size="sm" className="h-9 rounded-lg border-white/[0.08] bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden lg:inline">Filter</span>
                </Button>
              </div>
            </div>

            <Suspense fallback={<TableLoadingSkeleton />}>
              <PatientsData />
            </Suspense>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#0a0b0d]/80 backdrop-blur-xl mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                <Stethoscope className="h-4 w-4 text-white/40" />
              </div>
              <p className="text-sm text-white/30">
                2026 LinkCare - Medical-grade patient management
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                NICE Guidelines Compliant
              </span>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
