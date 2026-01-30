"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, MessageSquare, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitConfirmation } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface ConfirmationFormProps {
  token: string;
  taskDescription: string | null;
}

export function ConfirmationForm({ token, taskDescription }: ConfirmationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ success: boolean; response?: string } | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await submitConfirmation(token, "CONFIRMED");
      if (response.success) {
        setResult({ success: true, response: "CONFIRMED" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const response = await submitConfirmation(token, "REJECTED", note || undefined);
      if (response.success) {
        setResult({ success: true, response: "REJECTED" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (result?.success) {
    return (
      <div className={cn(
        "rounded-2xl p-8 text-center border animate-scale-in",
        result.response === "CONFIRMED" 
          ? "bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-200"
          : "bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200"
      )}>
        {result.response === "CONFIRMED" ? (
          <>
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-teal-100 mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-teal-800">Thank You!</h3>
            <p className="text-sm text-teal-600 mt-3 max-w-xs mx-auto leading-relaxed">
              Your confirmation has been recorded. The hospital team can now see your response.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-100 mx-auto mb-5">
              <MessageSquare className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-800">Response Recorded</h3>
            <p className="text-sm text-amber-600 mt-3 max-w-xs mx-auto leading-relaxed">
              We&apos;ve notified the hospital team. Someone will contact you to help resolve this.
            </p>
          </>
        )}
      </div>
    );
  }

  // Show rejection form
  if (showRejectForm) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 border border-slate-100 animate-fade-in-up">
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-900">Unable to Complete?</h3>
          <p className="text-sm text-slate-500 mt-1">
            Please let us know why you couldn&apos;t complete this instruction.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-semibold text-slate-700">
              Reason (optional)
            </Label>
            <Textarea
              id="note"
              placeholder="e.g., I don't have the medication yet, I have questions about the instructions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="premium-input resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold"
              onClick={() => setShowRejectForm(false)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Submit Response
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main confirmation buttons
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 border border-slate-100 animate-fade-in-up">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900">Your Response</h3>
        <p className="text-sm text-slate-500 mt-1">
          {taskDescription 
            ? "Can you confirm you have completed or understood this instruction?"
            : "Please confirm you have received and understood this message."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={cn(
            "relative flex flex-col items-center gap-3 p-6 rounded-2xl transition-all",
            "bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200",
            "hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100">
            {isSubmitting ? (
              <Loader2 className="h-7 w-7 text-teal-600 animate-spin" />
            ) : (
              <ThumbsUp className="h-7 w-7 text-teal-600" />
            )}
          </div>
          <span className="font-bold text-teal-800">Yes, I Confirm</span>
        </button>

        <button
          onClick={() => setShowRejectForm(true)}
          disabled={isSubmitting}
          className={cn(
            "relative flex flex-col items-center gap-3 p-6 rounded-2xl transition-all",
            "bg-gradient-to-br from-slate-50 to-slate-100/50 border-2 border-slate-200",
            "hover:border-rose-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-red-50/50",
            "hover:shadow-lg hover:shadow-rose-100/50 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-rose-100">
            <ThumbsDown className="h-7 w-7 text-slate-500" />
          </div>
          <span className="font-bold text-slate-700">Unable to Complete</span>
        </button>
      </div>

      <p className="text-xs text-center text-slate-400 mt-5 font-medium">
        Your response will be shared with your healthcare team
      </p>
    </div>
  );
}
