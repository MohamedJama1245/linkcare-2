import Link from "next/link";
import { Stethoscope, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">LinkCare</h1>
              <p className="text-xs text-slate-500">Patient Confirmation Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-amber-900">
                Link Not Found
              </h2>
              <p className="text-sm text-amber-700 mt-3 max-w-sm">
                This confirmation link is invalid or has expired. If you believe this is an error, 
                please contact your healthcare provider for assistance.
              </p>
              <Link href="/" className="mt-6">
                <Button variant="outline" className="border-amber-300">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto absolute bottom-0 w-full">
        <div className="max-w-lg mx-auto px-4 py-4 text-center">
          <p className="text-xs text-slate-500">
            © 2026 LinkCare • Contact your hospital for support
          </p>
        </div>
      </footer>
    </div>
  );
}
