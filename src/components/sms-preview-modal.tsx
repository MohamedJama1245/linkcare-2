"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Smartphone,
  X,
  Stethoscope,
  CalendarDays,
  AlertTriangle,
  BookOpen,
  Clock,
  Shield,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitConfirmation } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface ScheduledMessage {
  id: string;
  messageContent: string;
  taskDescription: string | null;
  category: string;
  niceReference: string | null;
  sendAt: Date | string;
  status: string;
  patientResponse: string | null;
  confirmationToken: string | null;
}

interface Patient {
  name: string;
  procedureType: string;
  procedureDate: Date | string;
  phone: string;
}

interface SMSPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ScheduledMessage | null;
  patient: Patient | null;
  onConfirmationSubmitted?: () => void;
}

// Category display info
const categoryInfo: Record<string, { label: string; className: string; emoji: string }> = {
  medication: { label: "Medication", className: "bg-violet-50 text-violet-700 border-violet-200/60", emoji: "💊" },
  diet: { label: "Diet", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", emoji: "🥗" },
  fasting: { label: "Fasting", className: "bg-orange-50 text-orange-700 border-orange-200/60", emoji: "⏰" },
  hygiene: { label: "Hygiene", className: "bg-sky-50 text-sky-700 border-sky-200/60", emoji: "🧼" },
  lifestyle: { label: "Lifestyle", className: "bg-cyan-50 text-cyan-700 border-cyan-200/60", emoji: "🏃" },
  preparation: { label: "Preparation", className: "bg-amber-50 text-amber-700 border-amber-200/60", emoji: "📋" },
  arrival: { label: "Day of Procedure", className: "bg-rose-50 text-rose-700 border-rose-200/60", emoji: "🏥" },
  general: { label: "General", className: "bg-slate-100 text-slate-700 border-slate-200/60", emoji: "ℹ️" },
};

export function SMSPreviewModal({ 
  open, 
  onOpenChange, 
  message, 
  patient,
  onConfirmationSubmitted 
}: SMSPreviewModalProps) {
  const [currentView, setCurrentView] = useState<"sms" | "browser">("sms");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [note, setNote] = useState("");
  const [demoResult, setDemoResult] = useState<{ success: boolean; response?: string } | null>(null);

  if (!message || !patient) return null;

  const category = categoryInfo[message.category] || categoryInfo.general;
  const isAlreadyResponded = message.patientResponse !== null;
  const isPending = message.status === "PENDING";
  const canRespond = message.status === "SENT" && !isAlreadyResponded && message.confirmationToken;
  
  // Generate a fake but realistic looking URL
  const confirmUrl = `preop.check/c/${message.confirmationToken?.slice(0, 8) || 'abc123'}`;

  const handleConfirm = async () => {
    if (!message.confirmationToken) return;
    setIsSubmitting(true);
    try {
      const response = await submitConfirmation(message.confirmationToken, "CONFIRMED");
      if (response.success) {
        setDemoResult({ success: true, response: "CONFIRMED" });
        onConfirmationSubmitted?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!message.confirmationToken) return;
    setIsSubmitting(true);
    try {
      const response = await submitConfirmation(message.confirmationToken, "REJECTED", note || undefined);
      if (response.success) {
        setDemoResult({ success: true, response: "REJECTED" });
        onConfirmationSubmitted?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDemo = () => {
    setCurrentView("sms");
    setDemoResult(null);
    setShowRejectForm(false);
    setNote("");
  };

  const handleClose = () => {
    resetDemo();
    onOpenChange(false);
  };

  const openBrowserView = () => {
    setCurrentView("browser");
  };

  const goBackToSMS = () => {
    setCurrentView("sms");
    setShowRejectForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[380px] p-0 overflow-hidden rounded-[3rem] border-[8px] border-slate-800 shadow-2xl bg-slate-800">
        <VisuallyHidden.Root asChild>
          <DialogTitle>Patient SMS Preview</DialogTitle>
        </VisuallyHidden.Root>

        {/* Phone Frame */}
        <div className="relative bg-slate-800">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-20" />
          
          {/* Status Bar */}
          <div className="relative bg-slate-900 px-6 pt-2 pb-1 flex items-center justify-between text-white text-xs z-10">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-3.5 w-3.5" />
              <Wifi className="h-3.5 w-3.5" />
              <Battery className="h-4 w-4" />
            </div>
          </div>

          {/* Demo Badge */}
          <div className="absolute top-10 right-3 z-30">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-500 text-white text-[9px] font-bold rounded-full shadow-lg">
              <Sparkles className="h-2.5 w-2.5" />
              DEMO
            </span>
          </div>

          {/* Screen Content */}
          <div className="bg-white min-h-[580px] max-h-[580px] overflow-y-auto">
            {currentView === "sms" ? (
              /* SMS Messages View */
              <div className="flex flex-col h-full">
                {/* SMS App Header */}
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">LinkCare</p>
                        <p className="text-[11px] text-slate-500">NHS Hospital</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
                  {/* Date Bubble */}
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-slate-200/80 text-slate-600 text-[10px] font-medium rounded-full">
                      {format(new Date(message.sendAt), "EEEE, MMM d")}
                    </span>
                  </div>

                  {/* SMS Message Bubble */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {message.messageContent}
                      </p>
                      
                      {message.taskDescription && (
                        <p className="text-sm text-slate-800 mt-2 leading-relaxed">
                          ✅ Please confirm: {message.taskDescription}
                        </p>
                      )}

                      {/* The Link */}
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-700 mb-2">
                          👉 Tap to confirm:
                        </p>
                        {isPending ? (
                          <span className="text-sm text-slate-400 italic">
                            [Link will appear when sent]
                          </span>
                        ) : (
                          <button
                            onClick={openBrowserView}
                            className="inline-flex items-center gap-1 text-sm text-teal-600 font-medium hover:text-teal-700 hover:underline transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {confirmUrl}
                          </button>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p className="text-[10px] text-slate-400 mt-2 text-right">
                        {format(new Date(message.sendAt), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {/* If already responded, show response as patient's message */}
                  {isAlreadyResponded && (
                    <div className="flex justify-end">
                      <div className={cn(
                        "max-w-[75%] rounded-2xl rounded-tr-md px-4 py-3 shadow-sm",
                        message.patientResponse === "CONFIRMED" 
                          ? "bg-teal-500 text-white"
                          : "bg-rose-500 text-white"
                      )}>
                        <p className="text-sm">
                          {message.patientResponse === "CONFIRMED" 
                            ? "✓ I confirm I have completed this task"
                            : "✗ I'm unable to complete this task"
                          }
                        </p>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {format(new Date(), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pending message notice */}
                  {isPending && (
                    <div className="flex justify-center mt-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-[90%]">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800">Scheduled Message</p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              This will be sent on {format(new Date(message.sendAt), "MMM d 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMS Input Area (disabled, just for show) */}
                <div className="bg-slate-100 px-3 py-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-slate-400 border border-slate-200">
                      Message
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-lg">↑</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Browser/Confirmation Page View */
              <div className="flex flex-col h-full">
                {/* Browser Header */}
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 sticky top-0 z-10">
                  {/* Browser Controls */}
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={goBackToSMS}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div className="flex-1 bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 border border-slate-200">
                      <Shield className="h-3.5 w-3.5 text-teal-600" />
                      <span className="text-xs text-slate-600 truncate">{confirmUrl}</span>
                    </div>
                  </div>
                </div>

                {/* Webpage Content */}
                <div className="flex-1 bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
                  {/* Mini Header */}
                  <div className="bg-white border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
                        <Stethoscope className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h1 className="text-sm font-bold text-slate-900">LinkCare</h1>
                        <p className="text-[10px] text-slate-500">Secure Confirmation</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Patient Welcome */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white shadow-lg">
                      <p className="text-slate-400 text-xs">Hello,</p>
                      <h2 className="text-lg font-bold">{patient.name.split(" ")[0]}</h2>
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-3 w-3 text-slate-400" />
                          {patient.procedureType}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3 text-slate-400" />
                          {format(new Date(patient.procedureDate), "MMM d")}
                        </span>
                      </div>
                    </div>

                    {/* Task Card */}
                    <div className="rounded-xl bg-white p-4 shadow-md border border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Instruction</h3>
                        <span className={cn(
                          "ml-auto inline-flex items-center px-2 py-0.5 text-[9px] font-semibold rounded-full border",
                          category.className
                        )}>
                          {category.emoji} {category.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">{message.messageContent}</p>

                      {message.taskDescription && (
                        <div className="mt-3 rounded-lg bg-teal-50 border border-teal-200/60 p-3">
                          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">
                            Please Confirm
                          </p>
                          <p className="text-sm text-slate-700">{message.taskDescription}</p>
                        </div>
                      )}

                      {message.niceReference && (
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-teal-600">
                          <BookOpen className="h-3 w-3" />
                          <span className="font-medium">{message.niceReference}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirmation Section */}
                    {demoResult?.success ? (
                      <div className={cn(
                        "rounded-xl p-5 text-center border",
                        demoResult.response === "CONFIRMED" 
                          ? "bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-200"
                          : "bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200"
                      )}>
                        {demoResult.response === "CONFIRMED" ? (
                          <>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 mx-auto mb-2">
                              <CheckCircle2 className="h-6 w-6 text-teal-500" />
                            </div>
                            <h3 className="text-sm font-bold text-teal-800">Thank You!</h3>
                            <p className="text-xs text-teal-600 mt-1">Response recorded</p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mx-auto mb-2">
                              <MessageSquare className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="text-sm font-bold text-amber-800">Response Recorded</h3>
                            <p className="text-xs text-amber-600 mt-1">We&apos;ll be in touch</p>
                          </>
                        )}
                      </div>
                    ) : isAlreadyResponded ? (
                      <div className={cn(
                        "rounded-xl p-5 text-center border",
                        message.patientResponse === "CONFIRMED" 
                          ? "bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-200"
                          : "bg-gradient-to-br from-rose-50 to-red-50/50 border-rose-200"
                      )}>
                        {message.patientResponse === "CONFIRMED" ? (
                          <>
                            <CheckCircle2 className="h-10 w-10 text-teal-500 mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-teal-800">Confirmed</h3>
                            <p className="text-xs text-teal-600 mt-1">You already confirmed this</p>
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="h-10 w-10 text-rose-500 mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-rose-800">Response Recorded</h3>
                            <p className="text-xs text-rose-600 mt-1">Team will contact you</p>
                          </>
                        )}
                      </div>
                    ) : canRespond ? (
                      showRejectForm ? (
                        <div className="rounded-xl bg-white p-4 shadow-md border border-slate-100">
                          <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Complete?</h3>
                          <p className="text-xs text-slate-500 mb-3">Let us know why</p>

                          <Textarea
                            placeholder="Optional reason..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            className="text-sm resize-none mb-3"
                          />

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => setShowRejectForm(false)}
                              disabled={isSubmitting}
                            >
                              Back
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs bg-rose-600 hover:bg-rose-700"
                              onClick={handleReject}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Submit"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl p-4 font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                <ThumbsUp className="h-5 w-5" />
                                Yes, I Confirm
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => setShowRejectForm(true)}
                            disabled={isSubmitting}
                            className="w-full bg-white text-slate-600 rounded-xl p-4 font-medium text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <ThumbsDown className="h-5 w-5" />
                            I Can&apos;t Complete This
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="rounded-xl bg-indigo-50 p-4 text-center border border-indigo-200">
                        <Clock className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-indigo-700">Preview Only</p>
                        <p className="text-xs text-indigo-600 mt-1">
                          Send the message to enable responses
                        </p>
                      </div>
                    )}

                    {/* Security Footer */}
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 py-2">
                      <Shield className="h-3 w-3 text-teal-500" />
                      <span>Secure NHS Portal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Home Indicator */}
          <div className="bg-slate-800 py-2 flex justify-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
