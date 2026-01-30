//fix
export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import { getConfirmationData } from "@/lib/actions";
import { ConfirmationForm } from "./confirmation-form";
import { format } from "date-fns";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  BookOpen,
  Shield,
  Heart,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationPageProps {
  params: Promise<{ token: string }>;
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { token } = await params;
  const data = await getConfirmationData(token);

  if (!data) {
    notFound();
  }

  const { message, patient, isExpired, isAlreadyResponded } = data;

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

  const category = categoryInfo[message.category] || categoryInfo.general;

  return (
    <div className="min-h-screen premium-bg">
      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 shadow-lg shadow-teal-600/25">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">LinkCare</h1>
              <p className="text-xs text-slate-500 font-medium">Patient Confirmation Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-lg mx-auto px-5 py-8 space-y-6">
        {/* Welcome Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Hello,</p>
              <h2 className="text-2xl font-bold mt-0.5">{patient.name.split(" ")[0]}</h2>
            </div>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border",
              category.className
            )}>
              {category.emoji} {category.label}
            </span>
          </div>
          
          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Procedure
                </div>
                <p className="text-sm font-semibold">{patient.procedureType}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Date
                </div>
                <p className="text-sm font-semibold">{format(new Date(patient.procedureDate), "MMM d, yyyy")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 border border-slate-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Important Instruction</h3>
          </div>

          {/* Main message */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 p-5">
            <p className="text-slate-700 leading-relaxed">{message.messageContent}</p>
          </div>

          {/* Task to confirm */}
          {message.taskDescription && (
            <div className="mt-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50/50 border border-teal-200/60 p-5">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                Please Confirm
              </p>
              <p className="text-slate-700 font-medium">{message.taskDescription}</p>
            </div>
          )}

          {/* NICE Reference */}
          {message.niceReference && (
            <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-50">
              <BookOpen className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Clinical Guideline
                </p>
                <p className="text-xs text-teal-600 font-semibold mt-0.5">{message.niceReference}</p>
              </div>
            </div>
          )}

          {/* Sent time */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Clock className="h-3 w-3" />
            <span>Sent {format(new Date(message.sendAt), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </div>

        {/* Confirmation Form or Status */}
        {isExpired ? (
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50/50 border border-rose-200 p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 mx-auto mb-4">
              <XCircle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-rose-800">Link Expired</h3>
            <p className="text-sm text-rose-600 mt-2 max-w-xs mx-auto">
              This procedure date has passed. Please contact the hospital if you need assistance.
            </p>
          </div>
        ) : isAlreadyResponded ? (
          <div className={cn(
            "rounded-2xl p-8 text-center border",
            message.patientResponse === "CONFIRMED" 
              ? "bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-200"
              : "bg-gradient-to-br from-rose-50 to-red-50/50 border-rose-200"
          )}>
            {message.patientResponse === "CONFIRMED" ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-bold text-teal-800">Already Confirmed</h3>
                <p className="text-sm text-teal-600 mt-2 max-w-xs mx-auto">
                  Thank you! You have already confirmed this instruction.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-rose-800">Response Recorded</h3>
                <p className="text-sm text-rose-600 mt-2 max-w-xs mx-auto">
                  We have recorded that you could not complete this instruction. 
                  The hospital team will contact you.
                </p>
              </>
            )}
          </div>
        ) : (
          <ConfirmationForm token={token} taskDescription={message.taskDescription} />
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <Shield className="h-3.5 w-3.5 text-teal-500" />
          <span>Secure patient portal • Your response is confidential</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-200/50 bg-white/60 backdrop-blur-sm mt-8">
        <div className="max-w-lg mx-auto px-5 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
            <Heart className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-xs text-slate-500">
            © 2026 LinkCare · If you have questions, please contact your healthcare provider
          </p>
        </div>
      </footer>
    </div>
  );
}
