"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import {
  User,
  Phone,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Send,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Smartphone,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SMSPreviewModal } from "@/components/sms-preview-modal";
import { updatePatientStatus, deletePatient } from "@/lib/actions";
import { 
  RISK_FACTOR_CATEGORIES,
  getActiveRiskFactors,
  type PatientWithMessages, 
  type PatientStatus, 
  type MessageStatus 
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface PatientTableProps {
  patients: PatientWithMessages[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMessages | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [previewMessage, setPreviewMessage] = useState<PatientWithMessages["scheduledMessages"][0] | null>(null);
  const [previewPatient, setPreviewPatient] = useState<PatientWithMessages | null>(null);

  const getStatusBadge = (status: PatientStatus) => {
    const config = {
      ON_TRACK: {
        label: "On Track",
        className: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        icon: CheckCircle2,
      },
      AT_RISK: {
        label: "At Risk",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: AlertTriangle,
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-white/[0.04] text-white/40 border-white/[0.08]",
        icon: XCircle,
      },
    };

    const { label, className, icon: Icon } = config[status];

    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
        className
      )}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getMessageStatusBadge = (status: MessageStatus, patientResponse: string | null) => {
    if (patientResponse === "CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
          <ThumbsUp className="h-2.5 w-2.5" />
          Confirmed
        </span>
      );
    }
    if (patientResponse === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ThumbsDown className="h-2.5 w-2.5" />
          Rejected
        </span>
      );
    }

    const config: Record<string, { label: string; className: string; icon: React.ElementType }> = {
      PENDING: {
        label: "Pending",
        className: "bg-white/[0.04] text-white/50 border-white/[0.08]",
        icon: Clock,
      },
      SENT: {
        label: "Awaiting",
        className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        icon: Send,
      },
      CONFIRMED: {
        label: "Confirmed",
        className: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        icon: CheckCircle2,
      },
      REJECTED: {
        label: "Rejected",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        icon: XCircle,
      },
      FAILED: {
        label: "Failed",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        icon: XCircle,
      },
      EXPIRED: {
        label: "Expired",
        className: "bg-white/[0.04] text-white/40 border-white/[0.08]",
        icon: Clock,
      },
    };

    const { label, className, icon: Icon } = config[status] || config.PENDING;

    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border",
        className
      )}>
        <Icon className="h-2.5 w-2.5" />
        {label}
      </span>
    );
  };

  const handleStatusChange = async (patientId: string, newStatus: PatientStatus) => {
    await updatePatientStatus(patientId, newStatus);
  };

  const handleDelete = async (patientId: string) => {
    setIsDeleting(patientId);
    try {
      await deletePatient(patientId);
    } finally {
      setIsDeleting(null);
    }
  };

  const getMessageStats = (messages: PatientWithMessages["scheduledMessages"]) => {
    const total = messages.length;
    const confirmed = messages.filter((m) => m.patientResponse === "CONFIRMED").length;
    const rejected = messages.filter((m) => m.patientResponse === "REJECTED").length;
    const awaiting = messages.filter((m) => m.status === "SENT" && !m.patientResponse).length;
    const pending = messages.filter((m) => m.status === "PENDING").length;
    return { total, confirmed, rejected, awaiting, pending };
  };

  // Get risk factor summary for a patient
  const getRiskFactorSummary = (patient: PatientWithMessages) => {
    const activeFactors = getActiveRiskFactors(patient);
    return activeFactors;
  };

  // Get category colors - refined
  const getCategoryClass = (categoryId: string): string => {
    const classes: Record<string, string> = {
      metabolic: "risk-metabolic",
      cardiovascular: "risk-cardiovascular",
      respiratory: "risk-respiratory",
      renal_hepatic: "risk-renal",
      allergies: "risk-allergy",
      lifestyle: "risk-lifestyle",
      other: "risk-other",
    };
    return classes[categoryId] || classes.other;
  };

  const openPreview = (message: PatientWithMessages["scheduledMessages"][0], patient: PatientWithMessages) => {
    setPreviewMessage(message);
    setPreviewPatient(patient);
  };

  const handleConfirmationSubmitted = () => {
    // Refresh the page to show updated data
    router.refresh();
  };

  if (patients.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-6">
          <User className="h-10 w-10 text-white/30" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No patients yet</h3>
        <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
          Add your first patient to start scheduling pre-operative instructions and NICE-compliant reminders.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-white/30">
          <Zap className="h-4 w-4" />
          <span>Messages will be generated automatically based on procedure type and risk factors</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.02]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-white/[0.06] bg-white/[0.02]">
                <TableHead className="w-[220px] text-white/50 text-xs uppercase tracking-wider font-semibold">Patient</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider font-semibold">Procedure</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider font-semibold">Date</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider font-semibold">Risk Factors</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider font-semibold">Progress</TableHead>
                <TableHead className="text-white/50 text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                <TableHead className="w-[48px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient, idx) => {
                const messageStats = getMessageStats(patient.scheduledMessages);
                const procedureDate = new Date(patient.procedureDate);
                const isUrgent = isToday(procedureDate) || isPast(procedureDate);
                const hasRejections = messageStats.rejected > 0;
                const riskFactors = getRiskFactorSummary(patient);
                const completionRate = messageStats.total > 0 
                  ? Math.round(((messageStats.confirmed) / messageStats.total) * 100) 
                  : 0;

                return (
                  <TableRow
                    key={patient.id}
                    className={cn(
                      "group transition-all cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03]",
                      patient.status === "CANCELLED" && "opacity-50",
                      hasRejections && "bg-rose-500/5"
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    {/* Patient Info */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-sm">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate group-hover:text-teal-400 transition-colors flex items-center gap-1">
                            {patient.name}
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </p>
                          <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Procedure Type */}
                    <TableCell className="py-4">
                      <span className="text-sm text-white/70 font-medium">
                        {patient.procedureType}
                      </span>
                    </TableCell>

                    {/* Procedure Date */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-lg transition-colors border",
                          isUrgent ? "bg-rose-500/10 border-rose-500/20" : "bg-white/[0.04] border-white/[0.06]"
                        )}>
                          <CalendarDays className={cn(
                            "h-4 w-4",
                            isUrgent ? "text-rose-400" : "text-white/40"
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-semibold",
                            isUrgent ? "text-rose-400" : "text-white/80"
                          )}>
                            {format(procedureDate, "MMM d")}
                          </p>
                          <p className="text-[10px] text-white/30 uppercase tracking-wide font-medium">
                            {isToday(procedureDate)
                              ? "Today"
                              : isPast(procedureDate)
                              ? "Past"
                              : formatDistanceToNow(procedureDate, { addSuffix: false })}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Risk Factors */}
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {riskFactors.length === 0 ? (
                          <span className="text-xs text-white/30">—</span>
                        ) : riskFactors.length <= 2 ? (
                          riskFactors.map((factor) => {
                            const category = RISK_FACTOR_CATEGORIES.find(c => 
                              c.factors.some(f => f.key === factor.key)
                            );
                            return (
                              <Tooltip key={factor.key}>
                                <TooltipTrigger>
                                  <span className={cn(
                                    "risk-badge",
                                    category ? getCategoryClass(category.id) : ""
                                  )}>
                                    {factor.label}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-semibold">{factor.label}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{factor.description}</p>
                                  {factor.niceRef && (
                                    <p className="text-[10px] text-teal-500 mt-1 flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      {factor.niceRef}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })
                        ) : (
                          <>
                            {riskFactors.slice(0, 2).map((factor) => {
                              const category = RISK_FACTOR_CATEGORIES.find(c => 
                                c.factors.some(f => f.key === factor.key)
                              );
                              return (
                                <span
                                  key={factor.key}
                                  className={cn(
                                    "risk-badge",
                                    category ? getCategoryClass(category.id) : ""
                                  )}
                                >
                                  {factor.label}
                                </span>
                              );
                            })}
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="risk-badge bg-slate-100 text-slate-600 border border-slate-200/50">
                                  +{riskFactors.length - 2}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {riskFactors.slice(2).map((f) => (
                                    <p key={f.key} className="text-sm">{f.label}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="py-4">
                      <div className="space-y-2 w-[140px]">
                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                completionRate >= 50 && !hasRejections && "bg-teal-500",
                                completionRate < 50 && !hasRejections && "bg-amber-500",
                                hasRejections && "bg-rose-500"
                              )}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-white/70 tabular-nums w-10 text-right">
                            {completionRate}%
                          </span>
                        </div>
                        {/* Stats row */}
                        <div className="flex items-center gap-3 text-[10px] font-medium">
                          <span className="flex items-center gap-1 text-teal-400">
                            <ThumbsUp className="h-2.5 w-2.5" />
                            {messageStats.confirmed}
                          </span>
                          {messageStats.rejected > 0 && (
                            <span className="flex items-center gap-1 text-rose-400">
                              <ThumbsDown className="h-2.5 w-2.5" />
                              {messageStats.rejected}
                            </span>
                          )}
                          {messageStats.awaiting > 0 && (
                            <span className="flex items-center gap-1 text-indigo-400">
                              <Clock className="h-2.5 w-2.5" />
                              {messageStats.awaiting}
                            </span>
                          )}
                          <span className="text-white/30">
                            / {messageStats.total}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      {getStatusBadge(patient.status)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/[0.06] rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4 text-white/40" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl bg-[#1a1b1e] border-white/[0.1]">
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                            className="rounded-lg"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {patient.status !== "ON_TRACK" && (
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(patient.id, "ON_TRACK"); }}
                              className="rounded-lg"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-teal-600" />
                              Mark On Track
                            </DropdownMenuItem>
                          )}
                          {patient.status !== "AT_RISK" && (
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(patient.id, "AT_RISK"); }}
                              className="rounded-lg"
                            >
                              <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                              Mark At Risk
                            </DropdownMenuItem>
                          )}
                          {patient.status !== "CANCELLED" && (
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(patient.id, "CANCELLED"); }}
                              className="rounded-lg"
                            >
                              <XCircle className="mr-2 h-4 w-4 text-slate-500" />
                              Cancel Procedure
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }}
                            className="text-rose-600 focus:text-rose-600 rounded-lg"
                            disabled={isDeleting === patient.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Patient Details Dialog */}
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 bg-[#0f1012] border-white/[0.1] rounded-2xl">
            {selectedPatient && (
              <>
                {/* Accessible title for screen readers */}
                <VisuallyHidden.Root asChild>
                  <DialogTitle>Patient Details: {selectedPatient.name}</DialogTitle>
                </VisuallyHidden.Root>
                
                {/* Header */}
                <div className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-2xl">
                      {selectedPatient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-white">
                          {selectedPatient.name}
                        </h2>
                        {getStatusBadge(selectedPatient.status)}
                      </div>
                      <p className="text-sm text-white/50 mt-1 font-medium">
                        {selectedPatient.procedureType}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1.5 text-white/60">
                          <Phone className="h-4 w-4 text-white/30" />
                          {selectedPatient.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-white/60">
                          <CalendarDays className="h-4 w-4 text-white/30" />
                          {format(new Date(selectedPatient.procedureDate), "PPPP")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Risk Factors */}
                  {getRiskFactorSummary(selectedPatient).length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                        Risk Factors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {RISK_FACTOR_CATEGORIES.map((category) => {
                          const activeInCategory = category.factors.filter(
                            (f) => selectedPatient[f.key as keyof PatientWithMessages]
                          );
                          if (activeInCategory.length === 0) return null;

                          return activeInCategory.map((factor) => (
                            <Tooltip key={factor.key}>
                              <TooltipTrigger>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-help transition-all hover:scale-105 bg-white/[0.04] border border-white/[0.08] text-white/70">
                                  {factor.label}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#1a1b1e] border-white/[0.1] text-white">
                                <p>{factor.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          ));
                        })}
                      </div>
                    </div>
                  )}

                  {/* Message Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">
                        Task Timeline
                      </h3>
                      <span className="text-xs text-white/30 font-medium">
                        {selectedPatient.scheduledMessages.length} tasks scheduled
                      </span>
                    </div>
                    
                    <div className="space-y-0 relative">
                      {selectedPatient.scheduledMessages.map((message, idx) => {
                        const isConfirmed = message.patientResponse === "CONFIRMED";
                        const isRejected = message.patientResponse === "REJECTED";
                        const isSent = message.status === "SENT" && !message.patientResponse;
                        const isPending = message.status === "PENDING";
                        const isLast = idx === selectedPatient.scheduledMessages.length - 1;
                        const canPreview = true; // Allow preview for all messages
                        
                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "relative pl-9 pb-6",
                              !isLast && "border-l-2 border-white/[0.06] ml-[11px]"
                            )}
                          >
                            {/* Timeline dot */}
                            <div className={cn(
                              "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0f1012]",
                              isConfirmed && "bg-teal-500",
                              isRejected && "bg-rose-500",
                              isSent && "bg-indigo-500",
                              isPending && "bg-white/10"
                            )}>
                              {isConfirmed && <ThumbsUp className="h-3 w-3 text-white" />}
                              {isRejected && <ThumbsDown className="h-3 w-3 text-white" />}
                              {isSent && <Send className="h-3 w-3 text-white" />}
                              {isPending && <Clock className="h-3 w-3 text-white/40" />}
                            </div>
                            
                            {/* Content */}
                            <div className={cn(
                              "rounded-xl p-4 ml-3 transition-all group/card border",
                              isConfirmed && "bg-teal-500/10 border-teal-500/20",
                              isRejected && "bg-rose-500/10 border-rose-500/20",
                              isSent && "bg-indigo-500/10 border-indigo-500/20",
                              isPending && "bg-white/[0.02] border-white/[0.06]"
                            )}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <span className="text-xs font-bold text-white/70">
                                      {format(new Date(message.sendAt), "MMM d, yyyy")}
                                    </span>
                                    {getMessageStatusBadge(message.status, message.patientResponse)}
                                    {message.category && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 font-medium">
                                        {message.category}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-white/60 leading-relaxed">
                                    {message.messageContent}
                                  </p>
                                  {message.taskDescription && (
                                    <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                      <p className="text-[11px] text-white/40 mb-1 font-bold uppercase tracking-wide">
                                        Task to confirm
                                      </p>
                                      <p className="text-sm text-white/70">
                                        {message.taskDescription}
                                      </p>
                                    </div>
                                  )}
                                  {message.niceReference && (
                                    <div className="flex items-center gap-1.5 mt-3">
                                      <BookOpen className="h-3 w-3 text-teal-400" />
                                      <span className="text-[10px] text-teal-400 font-semibold">
                                        {message.niceReference}
                                      </span>
                                    </div>
                                  )}
                                  {message.patientNote && (
                                    <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                      <p className="text-[11px] text-rose-400 mb-1 font-bold uppercase tracking-wide">
                                        Patient note
                                      </p>
                                      <p className="text-sm text-rose-300">
                                        {message.patientNote}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Preview Button */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="shrink-0 rounded-lg text-xs gap-1.5 transition-all opacity-0 group-hover/card:opacity-100 border-white/[0.1] bg-white/[0.02] hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 text-white/60"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openPreview(message, selectedPatient);
                                      }}
                                    >
                                      <Smartphone className="h-3.5 w-3.5" />
                                      Preview
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-[#1a1b1e] border-white/[0.1] text-white">
                                    {isPending 
                                      ? "Preview what patient will see when sent"
                                      : "See what the patient sees & interact as patient"
                                    }
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Demo Info Banner */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-transparent rounded-xl p-4 border border-indigo-500/20">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Interactive Demo</h4>
                        <p className="text-xs text-white/50 mt-0.5">
                          Click &quot;Preview&quot; on any sent message to see exactly what patients see on their phone. 
                          You can even respond as the patient to test the full confirmation flow!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* SMS Preview Modal */}
        <SMSPreviewModal
          open={!!previewMessage}
          onOpenChange={(open) => {
            if (!open) {
              setPreviewMessage(null);
              setPreviewPatient(null);
            }
          }}
          message={previewMessage}
          patient={previewPatient}
          onConfirmationSubmitted={handleConfirmationSubmitted}
        />
      </>
    </TooltipProvider>
  );
}
