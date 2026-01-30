"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processAllPendingMessages } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function ProcessMessagesButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ count: number } | null>(null);

  const handleProcess = async () => {
    setIsProcessing(true);
    setLastResult(null);
    try {
      const result = await processAllPendingMessages();
      if (result.success) {
        setLastResult({ count: result.count });
        // Clear the result after 3 seconds
        setTimeout(() => setLastResult(null), 3000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {lastResult !== null && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 text-sm font-semibold border border-teal-500/20 animate-in fade-in slide-in-from-right-2 duration-200">
          <CheckCircle className="h-4 w-4" />
          {lastResult.count} sent
        </span>
      )}
      <Button
        onClick={handleProcess}
        disabled={isProcessing}
        className={cn(
          "h-10 rounded-xl border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15] transition-all font-semibold",
          isProcessing && "bg-white/[0.04]"
        )}
        variant="outline"
        size="sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white/40" />
            <span className="text-white/40">Sending...</span>
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4 text-amber-400" />
            Send Due Messages
          </>
        )}
      </Button>
    </div>
  );
}
