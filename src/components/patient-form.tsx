"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  User, 
  Phone, 
  Stethoscope, 
  Loader2,
  ChevronDown,
  Info,
  CheckCircle2,
  Sparkles,
  Shield,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createPatient } from "@/lib/actions";
import { 
  PROCEDURE_CATEGORIES, 
  RISK_FACTOR_CATEGORIES,
  type CreatePatientInput,
  type RiskFactorKey
} from "@/lib/types";

// Default values for all risk factors
const defaultRiskFactors: Record<RiskFactorKey, boolean> = {
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
};

// Category color configuration
const categoryColorConfig: Record<string, { bg: string; border: string; text: string; activeBg: string; activeBorder: string; iconBg: string }> = {
  metabolic: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", activeBg: "bg-violet-100", activeBorder: "border-violet-300", iconBg: "bg-violet-100" },
  cardiovascular: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", activeBg: "bg-rose-100", activeBorder: "border-rose-300", iconBg: "bg-rose-100" },
  respiratory: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", activeBg: "bg-sky-100", activeBorder: "border-sky-300", iconBg: "bg-sky-100" },
  renal_hepatic: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", activeBg: "bg-amber-100", activeBorder: "border-amber-300", iconBg: "bg-amber-100" },
  allergies: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", activeBg: "bg-orange-100", activeBorder: "border-orange-300", iconBg: "bg-orange-100" },
  lifestyle: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", activeBg: "bg-slate-100", activeBorder: "border-slate-300", iconBg: "bg-slate-100" },
  other: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", activeBg: "bg-cyan-100", activeBorder: "border-cyan-300", iconBg: "bg-cyan-100" },
};

export function PatientForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePatientInput>({
    defaultValues: {
      name: "",
      phone: "",
      procedureType: "",
      ...defaultRiskFactors,
    },
  });

  const procedureType = watch("procedureType");
  const watchedValues = watch();

  // Count active risk factors per category
  const getCategoryRiskCount = (categoryId: string): number => {
    const category = RISK_FACTOR_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return 0;
    return category.factors.filter(f => watchedValues[f.key as keyof CreatePatientInput]).length;
  };

  // Get total active risk factors
  const totalRiskFactors = RISK_FACTOR_CATEGORIES.reduce(
    (sum, cat) => sum + getCategoryRiskCount(cat.id), 
    0
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSubmit = async (data: CreatePatientInput) => {
    if (!date) return;

    setIsSubmitting(true);
    try {
      const result = await createPatient({
        ...data,
        procedureDate: date,
      });

      if (result.success) {
        reset();
        setDate(undefined);
        setExpandedCategories([]);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to create patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="premium-dialog sm:max-w-[640px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Add New Patient
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-teal-500" />
                  NICE-compliant instructions will be generated automatically
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Patient Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Patient Information
              </span>
            </div>
            
            {/* Name & Phone Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="John Smith"
                    className="premium-input pl-10 h-11"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    placeholder="+44 7700 900000"
                    className="premium-input pl-10 h-11"
                    {...register("phone", { required: "Phone is required" })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-500 font-medium">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Procedure Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center">
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Procedure Details
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Procedure Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Procedure Type</Label>
                <Select
                  value={procedureType}
                  onValueChange={(value) => setValue("procedureType", value)}
                >
                  <SelectTrigger className="premium-input h-11">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Select procedure" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-xl">
                    {PROCEDURE_CATEGORIES.map((category) => (
                      <SelectGroup key={category.id}>
                        <SelectLabel className="text-slate-500 text-xs uppercase tracking-wide font-bold px-2">
                          {category.label}
                        </SelectLabel>
                        {category.procedures.map((proc) => (
                          <SelectItem key={proc.value} value={proc.value} className="rounded-lg">
                            <span className="font-medium">{proc.label}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Procedure Date */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Procedure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "premium-input w-full justify-start text-left font-normal h-11",
                        !date && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Risk Factors Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Risk Factors
                </span>
              </div>
              {totalRiskFactors > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                  <CheckCircle2 className="h-3 w-3" />
                  {totalRiskFactors} selected
                </span>
              )}
            </div>
            
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
              {RISK_FACTOR_CATEGORIES.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);
                const riskCount = getCategoryRiskCount(category.id);
                const colors = categoryColorConfig[category.id] || categoryColorConfig.other;

                return (
                  <div key={category.id}>
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 transition-all",
                        isExpanded ? "bg-slate-50" : "hover:bg-slate-50/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-9 rounded-sm",
                          colors.iconBg
                        )} />
                        <div className="text-left">
                          <span className="font-semibold text-slate-700 text-sm block">
                            {category.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {category.factors.length} factors
                          </span>
                        </div>
                        {riskCount > 0 && (
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full",
                            colors.bg,
                            colors.text
                          )}>
                            {riskCount} active
                          </span>
                        )}
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-slate-400 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    </button>

                    {/* Category Factors */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 bg-slate-50/50 animate-fade-in-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.factors.map((factor) => {
                            const isChecked = watchedValues[factor.key as keyof CreatePatientInput];
                            
                            return (
                              <label
                                key={factor.key}
                                htmlFor={factor.key}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                  isChecked
                                    ? cn(colors.activeBg, colors.activeBorder, "shadow-sm")
                                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                )}
                              >
                                <Checkbox
                                  id={factor.key}
                                  checked={!!isChecked}
                                  onCheckedChange={(checked) =>
                                    setValue(factor.key as keyof CreatePatientInput, !!checked)
                                  }
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-semibold text-slate-800 block">
                                    {factor.label}
                                  </span>
                                  <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                                    {factor.description}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Info tip */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
              <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Expand categories to select relevant risk factors. This personalizes NICE-compliant protocols.</span>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !date || !procedureType}
              className="btn-primary min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Add Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
