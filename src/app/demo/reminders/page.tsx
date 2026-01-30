export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Bell,
  Home,
  Smartphone,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUpcomingReminders } from "@/lib/actions";
import { RemindersClient } from "./reminders-client";

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
      ))}
    </div>
  );
}

// Server component to fetch data
async function RemindersData() {
  const reminders = await getUpcomingReminders();
  
  console.log(`[RemindersPage] Fetched ${reminders.length} reminders`);
  
  return <RemindersClient reminders={reminders} />;
}

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0d]">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-teal-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0a0b0d]/80 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <Link href="/demo/dashboard">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/[0.06] text-white/60 hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/20">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-white tracking-tight">
                      Message Timeline
                    </h1>
                    <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold rounded-full border border-teal-500/20 uppercase tracking-wider">
                      Demo
                    </span>
                  </div>
                  <p className="text-xs text-white/40 font-medium">
                    Preview scheduled messages & patient interactions
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg h-9 px-4">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/demo/dashboard">
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg h-9 px-4">
                  <Activity className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/demo/reminders">
                <Button variant="ghost" size="sm" className="text-white bg-white/[0.08] hover:bg-white/[0.12] rounded-lg h-9 px-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto px-6 lg:px-8 py-10">
        {/* Info Banner */}
        <div className="p-5 mb-10 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Eye className="h-6 w-6 text-teal-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-white">Preview Any Message</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20 uppercase tracking-wider">
                  <Smartphone className="h-3 w-3" />
                  Interactive
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Click &quot;Preview&quot; on any message to see exactly what patients will receive on their phone. 
                For scheduled messages, see what they&apos;ll get. For sent messages, interact as the patient.
              </p>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <Suspense fallback={<LoadingSkeleton />}>
          <RemindersData />
        </Suspense>
      </main>
    </div>
  );
}
