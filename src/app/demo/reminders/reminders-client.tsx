"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  BookOpen,
  Activity,
  CalendarDays,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Bell,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UpcomingReminder, MessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SMSPreviewModal } from "@/components/sms-preview-modal";

// Status badge component - dark theme
function StatusBadge({ status, patientResponse }: { status: MessageStatus; patientResponse: string | null }) {
  if (patientResponse === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
        <ThumbsUp className="h-3 w-3" />
        Confirmed
      </span>
    );
  }
  if (patientResponse === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <ThumbsDown className="h-3 w-3" />
        Needs Attention
      </span>
    );
  }
  
  const config: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    PENDING: { label: "Scheduled", className: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: Clock },
    SENT: { label: "Awaiting", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: Send },
    CONFIRMED: { label: "Confirmed", className: "bg-teal-500/10 text-teal-400 border-teal-500/20", icon: CheckCircle2 },
    REJECTED: { label: "Rejected", className: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: XCircle },
    FAILED: { label: "Failed", className: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: AlertTriangle },
    EXPIRED: { label: "Expired", className: "bg-white/[0.04] text-white/40 border-white/[0.06]", icon: Clock },
  };

  const { label, className, icon: Icon } = config[status] || config.PENDING;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border",
      className
    )}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// Category badge - dark theme
function CategoryBadge({ category }: { category: string }) {
  const info: Record<string, { label: string; className: string }> = {
    medication: { label: "Medication", className: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    diet: { label: "Diet", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    fasting: { label: "Fasting", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    hygiene: { label: "Hygiene", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    lifestyle: { label: "Lifestyle", className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    preparation: { label: "Preparation", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    arrival: { label: "Arrival", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    general: { label: "General", className: "bg-white/[0.04] text-white/50 border-white/[0.06]" },
  };

  const cat = info[category] || info.general;

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border",
      cat.className
    )}>
      {cat.label}
    </span>
  );
}

// Reminder card component with preview
function ReminderCard({ 
  reminder, 
  index,
  onPreview 
}: { 
  reminder: UpcomingReminder; 
  index: number;
  onPreview: (reminder: UpcomingReminder) => void;
}) {
  const sendDate = new Date(reminder.sendAt);
  const procedureDate = new Date(reminder.procedureDate);
  const isOverdue = isPast(sendDate) && reminder.status === "PENDING";
  const isDueToday = isToday(sendDate);
  const isDueTomorrow = isTomorrow(sendDate);
  const isRejected = reminder.patientResponse === "REJECTED";
  const isConfirmed = reminder.patientResponse === "CONFIRMED";
  const isPending = reminder.status === "PENDING";
  const isSent = reminder.status === "SENT";

  return (
    <div 
      className={cn(
        "group relative",
        isRejected && "ring-1 ring-rose-500/30",
        isConfirmed && "ring-1 ring-teal-500/30",
        isOverdue && !isRejected && !isConfirmed && "ring-1 ring-amber-500/30"
      )}
    >
      <div className={cn(
        "rounded-2xl p-5 transition-all border",
        "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.03]",
        isRejected && "bg-rose-500/5 border-rose-500/20",
        isConfirmed && "bg-teal-500/5 border-teal-500/20",
        isOverdue && !isRejected && !isConfirmed && "bg-amber-500/5 border-amber-500/20"
      )}>
        <div className="flex items-start gap-4">
          {/* Left: Patient Avatar & Info */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-sm">
                  {reminder.patientName.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-white">{reminder.patientName}</span>
              </div>
              <StatusBadge status={reminder.status} patientResponse={reminder.patientResponse} />
              <CategoryBadge category={reminder.category} />
            </div>

            {/* Procedure & Date row */}
            <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
              <span className="flex items-center gap-1.5 font-medium">
                <Stethoscope className="h-3.5 w-3.5 text-white/30" />
                {reminder.procedureType}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-white/30" />
                Procedure: {format(procedureDate, "MMM d, yyyy")}
              </span>
            </div>

            {/* Message content */}
            <p className="text-sm text-white/60 leading-relaxed">
              {reminder.messageContent}
            </p>

            {/* Task description */}
            {reminder.taskDescription && (
              <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] text-white/40 mb-1 font-bold uppercase tracking-wider">
                  Patient confirms
                </p>
                <p className="text-sm text-white/70 font-medium">{reminder.taskDescription}</p>
              </div>
            )}

            {/* NICE Reference */}
            {reminder.niceReference && (
              <div className="flex items-center gap-1.5 mt-3">
                <BookOpen className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-[11px] text-teal-400 font-semibold">{reminder.niceReference}</span>
              </div>
            )}
          </div>

          {/* Right: Timing & Preview */}
          <div className="text-right shrink-0 min-w-[130px] flex flex-col items-end gap-3">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold",
              isOverdue && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
              isDueToday && !isOverdue && "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
              isDueTomorrow && !isOverdue && !isDueToday && "bg-violet-500/10 text-violet-400 border border-violet-500/20",
              !isOverdue && !isDueToday && !isDueTomorrow && isPending && "bg-white/[0.04] text-white/50 border border-white/[0.06]",
              isSent && !isConfirmed && !isRejected && "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
              isConfirmed && "bg-teal-500/10 text-teal-400 border border-teal-500/20",
              isRejected && "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {isOverdue ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Overdue
                </>
              ) : isDueToday ? (
                <>
                  <Clock className="h-4 w-4" />
                  Today
                </>
              ) : isDueTomorrow ? (
                "Tomorrow"
              ) : reminder.daysUntilSend > 0 ? (
                `In ${reminder.daysUntilSend}d`
              ) : isConfirmed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Done
                </>
              ) : isRejected ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Issue
                </>
              ) : (
                "Sent"
              )}
            </div>
            
            <div className="text-right">
              <p className="text-[11px] text-white/30 font-medium">
                Send: {format(sendDate, "MMM d, h:mm a")}
              </p>
              <p className="text-[11px] text-white/20 mt-0.5">
                {reminder.daysUntilProcedure > 0 
                  ? `${reminder.daysUntilProcedure}d to procedure`
                  : reminder.daysUntilProcedure === 0 
                    ? "Procedure today"
                    : "Procedure passed"
                }
              </p>
            </div>

            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 rounded-lg text-xs gap-1.5 border-white/[0.1] bg-white/[0.02] hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 text-white/60 transition-all"
              onClick={() => onPreview(reminder)}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Preview
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Group reminders by timing
function groupReminders(reminders: UpcomingReminder[]) {
  const groups = {
    attention: [] as UpcomingReminder[],
    overdue: [] as UpcomingReminder[],
    today: [] as UpcomingReminder[],
    tomorrow: [] as UpcomingReminder[],
    thisWeek: [] as UpcomingReminder[],
    later: [] as UpcomingReminder[],
    completed: [] as UpcomingReminder[],
  };

  for (const r of reminders) {
    if (r.patientResponse === "REJECTED") {
      groups.attention.push(r);
    } else if (r.patientResponse === "CONFIRMED") {
      groups.completed.push(r);
    } else if (r.status === "SENT" && !r.patientResponse) {
      groups.attention.push(r);
    } else if (isPast(new Date(r.sendAt)) && r.status === "PENDING") {
      groups.overdue.push(r);
    } else if (isToday(new Date(r.sendAt))) {
      groups.today.push(r);
    } else if (isTomorrow(new Date(r.sendAt))) {
      groups.tomorrow.push(r);
    } else if (r.daysUntilSend <= 7) {
      groups.thisWeek.push(r);
    } else {
      groups.later.push(r);
    }
  }

  return groups;
}

// Section header component - dark theme
function SectionHeader({ icon, title, count, variant }: { 
  icon: React.ReactNode; 
  title: string; 
  count: number;
  variant: "danger" | "warning" | "info" | "default" | "success";
}) {
  const variants = {
    danger: { iconBg: "bg-rose-500/10 border-rose-500/20", textColor: "text-rose-400" },
    warning: { iconBg: "bg-amber-500/10 border-amber-500/20", textColor: "text-amber-400" },
    info: { iconBg: "bg-indigo-500/10 border-indigo-500/20", textColor: "text-indigo-400" },
    success: { iconBg: "bg-teal-500/10 border-teal-500/20", textColor: "text-teal-400" },
    default: { iconBg: "bg-white/[0.04] border-white/[0.06]", textColor: "text-white/70" },
  };

  const { iconBg, textColor } = variants[variant];

  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl border", iconBg)}>
        {icon}
      </div>
      <div>
        <h2 className={cn("text-base font-bold", textColor)}>{title}</h2>
        <p className="text-xs text-white/40 font-medium">{count} {count === 1 ? "message" : "messages"}</p>
      </div>
    </div>
  );
}

interface RemindersClientProps {
  reminders: UpcomingReminder[];
}

export function RemindersClient({ reminders }: RemindersClientProps) {
  const router = useRouter();
  const [previewReminder, setPreviewReminder] = useState<UpcomingReminder | null>(null);

  const groups = groupReminders(reminders);

  const sections = [
    { key: "attention", title: "Needs Attention", items: groups.attention, icon: <AlertTriangle className="h-5 w-5 text-rose-400" />, variant: "danger" as const },
    { key: "overdue", title: "Overdue", items: groups.overdue, icon: <Clock className="h-5 w-5 text-amber-400" />, variant: "warning" as const },
    { key: "today", title: "Due Today", items: groups.today, icon: <Zap className="h-5 w-5 text-indigo-400" />, variant: "info" as const },
    { key: "tomorrow", title: "Due Tomorrow", items: groups.tomorrow, icon: <CalendarDays className="h-5 w-5 text-violet-400" />, variant: "info" as const },
    { key: "thisWeek", title: "This Week", items: groups.thisWeek, icon: <Calendar className="h-5 w-5 text-white/50" />, variant: "default" as const },
    { key: "later", title: "Upcoming", items: groups.later, icon: <Calendar className="h-5 w-5 text-white/40" />, variant: "default" as const },
    { key: "completed", title: "Completed", items: groups.completed, icon: <CheckCircle2 className="h-5 w-5 text-teal-400" />, variant: "success" as const },
  ];

  // Convert reminder to the format expected by SMSPreviewModal
  const convertReminderToMessage = (reminder: UpcomingReminder) => ({
    id: reminder.id,
    patientId: reminder.patientId,
    sendAt: reminder.sendAt,
    messageContent: reminder.messageContent,
    taskDescription: reminder.taskDescription,
    requiresConfirmation: true,
    confirmationToken: reminder.confirmationToken,
    niceReference: reminder.niceReference,
    category: reminder.category,
    isSent: reminder.status !== "PENDING",
    status: reminder.status,
    sentAt: null,
    patientResponse: reminder.patientResponse,
    patientNote: null,
    confirmedAt: null,
    rejectedAt: null,
  });

  const convertReminderToPatient = (reminder: UpcomingReminder) => ({
    id: reminder.patientId,
    name: reminder.patientName,
    phone: "+44 7XXX XXX XXX",
    procedureDate: reminder.procedureDate,
    procedureType: reminder.procedureType,
    status: "ON_TRACK" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    scheduledMessages: [],
    riskDiabetesType1: false,
    riskDiabetesType2: false,
    riskThyroidDisorder: false,
    riskBloodThinner: false,
    riskAntiplatelet: false,
    riskHypertension: false,
    riskHeartFailure: false,
    riskAtrialFib: false,
    riskPacemaker: false,
    riskAsthma: false,
    riskCOPD: false,
    riskSleepApnoea: false,
    riskKidneyDisease: false,
    riskLiverDisease: false,
    riskLatexAllergy: false,
    riskContrastAllergy: false,
    riskDrugAllergies: false,
    riskSmoker: false,
    riskAlcohol: false,
    riskObesity: false,
    riskImmunosuppressed: false,
    riskPregnancy: false,
    riskFrailty: false,
    riskCognitiveImpair: false,
  });

  const handleConfirmationSubmitted = () => {
    router.refresh();
    setPreviewReminder(null);
  };

  if (reminders.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-6">
          <Bell className="h-10 w-10 text-white/30" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No messages scheduled</h3>
        <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
          Add patients to start generating scheduled messages based on NICE guidelines.
        </p>
        <Link href="/demo">
          <Button className="h-10 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold">
            <Activity className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-2xl font-bold text-white">{reminders.length}</p>
          <p className="text-xs text-white/40">Total Messages</p>
        </div>
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-2xl font-bold text-violet-400">
            {reminders.filter(r => r.status === "PENDING").length}
          </p>
          <p className="text-xs text-violet-400/60">Scheduled</p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-2xl font-bold text-indigo-400">
            {reminders.filter(r => r.status === "SENT" && !r.patientResponse).length}
          </p>
          <p className="text-xs text-indigo-400/60">Awaiting Response</p>
        </div>
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
          <p className="text-2xl font-bold text-teal-400">
            {reminders.filter(r => r.patientResponse === "CONFIRMED").length}
          </p>
          <p className="text-xs text-teal-400/60">Confirmed</p>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-10">
        {sections.map(({ key, title, items, icon, variant }) => 
          items.length > 0 && (
            <section key={key}>
              <SectionHeader icon={icon} title={title} count={items.length} variant={variant} />
              <div className="space-y-3">
                {items.map((reminder, idx) => (
                  <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder} 
                    index={idx}
                    onPreview={setPreviewReminder}
                  />
                ))}
              </div>
            </section>
          )
        )}
      </div>

      {/* SMS Preview Modal */}
      <SMSPreviewModal
        open={!!previewReminder}
        onOpenChange={(open) => {
          if (!open) setPreviewReminder(null);
        }}
        message={previewReminder ? convertReminderToMessage(previewReminder) : null}
        patient={previewReminder ? convertReminderToPatient(previewReminder) : null}
        onConfirmationSubmitted={handleConfirmationSubmitted}
      />
    </>
  );
}
