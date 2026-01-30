"use client";

import { useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetDemo } from "@/lib/actions";

export function ResetDemoButton() {
  const [isResetting, setIsResetting] = useState(false);

  async function handleReset() {
    if (!confirm("This will delete all patients and messages, and create fresh demo data. Continue?")) {
      return;
    }

    setIsResetting(true);
    try {
      const result = await resetDemo();
      if (result.success) {
        // Reload the page to show fresh data
        window.location.reload();
      } else {
        alert("Failed to reset demo. Please try again.");
      }
    } catch (error) {
      alert("Failed to reset demo. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      className="h-10 rounded-xl border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15] gap-2"
    >
      {isResetting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Resetting...
        </>
      ) : (
        <>
          <RotateCcw className="h-4 w-4" />
          Reset Demo
        </>
      )}
    </Button>
  );
}
