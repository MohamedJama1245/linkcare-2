// LinkCare - Type Definitions
// Expanded Risk Factors and Procedures

// Patient Status
export type PatientStatus = "ON_TRACK" | "AT_RISK" | "CANCELLED";

// Message Status
export type MessageStatus = "PENDING" | "SENT" | "CONFIRMED" | "REJECTED" | "FAILED" | "EXPIRED";

// Patient Response
export type PatientResponse = "CONFIRMED" | "REJECTED" | null;

// ============================================
// RISK FACTOR DEFINITIONS BY CATEGORY
// ============================================

export interface RiskFactorCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  factors: RiskFactorDefinition[];
}

export interface RiskFactorDefinition {
  key: string;
  label: string;
  description: string;
  niceRef?: string;
}

// Risk factor categories for UI grouping
export const RISK_FACTOR_CATEGORIES: RiskFactorCategory[] = [
  {
    id: "metabolic",
    label: "Metabolic & Endocrine",
    icon: "",
    color: "purple",
    factors: [
      { key: "riskDiabetesType1", label: "Diabetes Type 1", description: "Insulin-dependent diabetes", niceRef: "NG180 1.3.7" },
      { key: "riskDiabetesType2", label: "Diabetes Type 2", description: "Non-insulin dependent diabetes", niceRef: "NG180 1.3.7" },
      { key: "riskThyroidDisorder", label: "Thyroid Disorder", description: "Hypo/hyperthyroidism", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    icon: "",
    color: "red",
    factors: [
      { key: "riskBloodThinner", label: "Anticoagulants", description: "Warfarin, Apixaban, Rivaroxaban, etc.", niceRef: "NG180 1.3.4" },
      { key: "riskAntiplatelet", label: "Antiplatelet Therapy", description: "Aspirin, Clopidogrel, Ticagrelor", niceRef: "NG180 1.3.5" },
      { key: "riskHypertension", label: "Hypertension", description: "High blood pressure", niceRef: "NG180 1.2" },
      { key: "riskHeartFailure", label: "Heart Failure", description: "Reduced cardiac function", niceRef: "NG180 1.2" },
      { key: "riskAtrialFib", label: "Atrial Fibrillation", description: "AF - irregular heart rhythm", niceRef: "NG180 1.3.4" },
      { key: "riskPacemaker", label: "Pacemaker/ICD", description: "Implanted cardiac device", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    icon: "",
    color: "blue",
    factors: [
      { key: "riskAsthma", label: "Asthma", description: "Reactive airway disease", niceRef: "NG180 1.2" },
      { key: "riskCOPD", label: "COPD", description: "Chronic obstructive pulmonary disease", niceRef: "NG180 1.2" },
      { key: "riskSleepApnoea", label: "Sleep Apnoea", description: "OSA - airway management concerns", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "renal_hepatic",
    label: "Renal & Hepatic",
    icon: "",
    color: "amber",
    factors: [
      { key: "riskKidneyDisease", label: "Kidney Disease", description: "CKD - contrast/drug dosing concerns", niceRef: "CG169" },
      { key: "riskLiverDisease", label: "Liver Disease", description: "Hepatic impairment", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "allergies",
    label: "Allergies",
    icon: "",
    color: "orange",
    factors: [
      { key: "riskLatexAllergy", label: "Latex Allergy", description: "Allergic to latex products", niceRef: "NG180 1.2" },
      { key: "riskContrastAllergy", label: "Contrast Allergy", description: "Allergic to iodine/contrast dye", niceRef: "CG169" },
      { key: "riskDrugAllergies", label: "Drug Allergies", description: "Known medication allergies", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    icon: "",
    color: "slate",
    factors: [
      { key: "riskSmoker", label: "Current Smoker", description: "Active tobacco use", niceRef: "NG180 1.1" },
      { key: "riskAlcohol", label: "Alcohol Use", description: "Heavy alcohol consumption", niceRef: "NG180 1.1" },
      { key: "riskObesity", label: "Obesity", description: "BMI > 30", niceRef: "NG180 1.2" },
    ],
  },
  {
    id: "other",
    label: "Other Clinical",
    icon: "",
    color: "teal",
    factors: [
      { key: "riskImmunosuppressed", label: "Immunosuppressed", description: "Steroids, chemotherapy, transplant", niceRef: "NG180 1.2" },
      { key: "riskPregnancy", label: "Pregnancy", description: "Currently pregnant", niceRef: "NG180 1.2" },
      { key: "riskFrailty", label: "Frailty", description: "Elderly or physically frail", niceRef: "NG180 1.1" },
      { key: "riskCognitiveImpair", label: "Cognitive Impairment", description: "Dementia or confusion", niceRef: "NG180 1.1" },
    ],
  },
];

// All risk factor keys for type safety
export type RiskFactorKey =
  | "riskDiabetesType1"
  | "riskDiabetesType2"
  | "riskThyroidDisorder"
  | "riskBloodThinner"
  | "riskAntiplatelet"
  | "riskHypertension"
  | "riskHeartFailure"
  | "riskAtrialFib"
  | "riskPacemaker"
  | "riskAsthma"
  | "riskCOPD"
  | "riskSleepApnoea"
  | "riskKidneyDisease"
  | "riskLiverDisease"
  | "riskLatexAllergy"
  | "riskContrastAllergy"
  | "riskDrugAllergies"
  | "riskSmoker"
  | "riskAlcohol"
  | "riskObesity"
  | "riskImmunosuppressed"
  | "riskPregnancy"
  | "riskFrailty"
  | "riskCognitiveImpair";

// ============================================
// PROCEDURE DEFINITIONS BY SPECIALTY
// ============================================

export interface ProcedureCategory {
  id: string;
  label: string;
  icon: string;
  procedures: ProcedureDefinition[];
}

export interface ProcedureDefinition {
  value: string;
  label: string;
  description: string;
  niceGuideline?: string;
}

export const PROCEDURE_CATEGORIES: ProcedureCategory[] = [
  {
    id: "gastroenterology",
    label: "Gastroenterology",
    icon: "",
    procedures: [
      { value: "Colonoscopy", label: "Colonoscopy", description: "Examination of the colon", niceGuideline: "DG30" },
      { value: "Upper Endoscopy", label: "Upper GI Endoscopy (OGD)", description: "Examination of oesophagus, stomach, duodenum", niceGuideline: "NG180" },
      { value: "ERCP", label: "ERCP", description: "Endoscopic retrograde cholangiopancreatography", niceGuideline: "NG180" },
      { value: "Liver Biopsy", label: "Liver Biopsy", description: "Percutaneous liver tissue sampling", niceGuideline: "NG180" },
      { value: "PEG Insertion", label: "PEG Tube Insertion", description: "Percutaneous endoscopic gastrostomy", niceGuideline: "CG32" },
    ],
  },
  {
    id: "cardiology",
    label: "Cardiology",
    icon: "",
    procedures: [
      { value: "Cardiac Catheterization", label: "Cardiac Catheterization", description: "Coronary angiography", niceGuideline: "CG95" },
      { value: "Angioplasty", label: "Coronary Angioplasty (PCI)", description: "Percutaneous coronary intervention with stent", niceGuideline: "CG95" },
      { value: "Pacemaker Insertion", label: "Pacemaker Insertion", description: "Permanent pacemaker implantation", niceGuideline: "TA324" },
      { value: "Cardioversion", label: "DC Cardioversion", description: "Electrical cardioversion for AF", niceGuideline: "NG196" },
      { value: "TOE", label: "TOE (Echo)", description: "Transoesophageal echocardiogram", niceGuideline: "NG180" },
    ],
  },
  {
    id: "orthopaedics",
    label: "Orthopaedics",
    icon: "",
    procedures: [
      { value: "Joint Replacement", label: "Total Joint Replacement", description: "Hip or knee replacement surgery", niceGuideline: "NG157" },
      { value: "Arthroscopy", label: "Arthroscopy", description: "Keyhole joint surgery", niceGuideline: "NG180" },
      { value: "Spinal Surgery", label: "Spinal Surgery", description: "Lumbar/cervical spine procedures", niceGuideline: "NG180" },
      { value: "Fracture Fixation", label: "Fracture Fixation", description: "ORIF - Open reduction internal fixation", niceGuideline: "NG180" },
      { value: "Carpal Tunnel", label: "Carpal Tunnel Release", description: "Carpal tunnel decompression", niceGuideline: "CG173" },
    ],
  },
  {
    id: "urology",
    label: "Urology",
    icon: "",
    procedures: [
      { value: "Cystoscopy", label: "Cystoscopy", description: "Bladder examination", niceGuideline: "NG180" },
      { value: "TURP", label: "TURP", description: "Transurethral resection of prostate", niceGuideline: "CG97" },
      { value: "Kidney Stone", label: "Kidney Stone Procedure", description: "Lithotripsy or ureteroscopy", niceGuideline: "NG118" },
      { value: "Prostate Biopsy", label: "Prostate Biopsy", description: "Transrectal/transperineal biopsy", niceGuideline: "NG131" },
      { value: "Nephrectomy", label: "Nephrectomy", description: "Kidney removal surgery", niceGuideline: "NG180" },
    ],
  },
  {
    id: "gynaecology",
    label: "Gynaecology",
    icon: "",
    procedures: [
      { value: "Hysterectomy", label: "Hysterectomy", description: "Removal of uterus", niceGuideline: "NG88" },
      { value: "Laparoscopy Gynae", label: "Diagnostic Laparoscopy", description: "Keyhole pelvic examination", niceGuideline: "NG180" },
      { value: "Hysteroscopy", label: "Hysteroscopy", description: "Uterine cavity examination", niceGuideline: "NG88" },
      { value: "D&C", label: "D&C", description: "Dilation and curettage", niceGuideline: "NG180" },
      { value: "Ovarian Surgery", label: "Ovarian Surgery", description: "Oophorectomy or cystectomy", niceGuideline: "NG180" },
    ],
  },
  {
    id: "general_surgery",
    label: "General Surgery",
    icon: "",
    procedures: [
      { value: "General Surgery", label: "General Surgery", description: "General surgical procedure", niceGuideline: "NG180" },
      { value: "Cholecystectomy", label: "Cholecystectomy", description: "Gallbladder removal", niceGuideline: "NG104" },
      { value: "Hernia Repair", label: "Hernia Repair", description: "Inguinal or umbilical hernia", niceGuideline: "NG180" },
      { value: "Appendectomy", label: "Appendectomy", description: "Appendix removal", niceGuideline: "NG180" },
      { value: "Thyroidectomy", label: "Thyroidectomy", description: "Thyroid gland removal", niceGuideline: "NG180" },
      { value: "Mastectomy", label: "Breast Surgery", description: "Mastectomy or lumpectomy", niceGuideline: "NG101" },
    ],
  },
  {
    id: "ophthalmology",
    label: "Ophthalmology",
    icon: "",
    procedures: [
      { value: "Cataract Surgery", label: "Cataract Surgery", description: "Lens replacement surgery", niceGuideline: "NG77" },
      { value: "Vitrectomy", label: "Vitrectomy", description: "Vitreous surgery", niceGuideline: "NG180" },
      { value: "Glaucoma Surgery", label: "Glaucoma Surgery", description: "Trabeculectomy or tube shunt", niceGuideline: "NG81" },
    ],
  },
  {
    id: "ent",
    label: "ENT",
    icon: "",
    procedures: [
      { value: "Tonsillectomy", label: "Tonsillectomy", description: "Tonsil removal", niceGuideline: "NG180" },
      { value: "Septoplasty", label: "Septoplasty", description: "Nasal septum correction", niceGuideline: "NG180" },
      { value: "Mastoidectomy", label: "Mastoidectomy", description: "Middle ear surgery", niceGuideline: "NG180" },
      { value: "Thyroid Surgery ENT", label: "Thyroid/Parathyroid", description: "Neck endocrine surgery", niceGuideline: "NG180" },
    ],
  },
  {
    id: "vascular",
    label: "Vascular",
    icon: "",
    procedures: [
      { value: "Varicose Veins", label: "Varicose Vein Surgery", description: "Vein stripping or ablation", niceGuideline: "CG168" },
      { value: "Carotid Endarterectomy", label: "Carotid Endarterectomy", description: "Carotid artery surgery", niceGuideline: "NG128" },
      { value: "AAA Repair", label: "AAA Repair", description: "Abdominal aortic aneurysm repair", niceGuideline: "NG156" },
      { value: "Peripheral Bypass", label: "Peripheral Bypass", description: "Leg bypass surgery", niceGuideline: "CG147" },
    ],
  },
];

// Flat list of all procedure values for validation
export const PROCEDURE_TYPES = PROCEDURE_CATEGORIES.flatMap(cat => 
  cat.procedures.map(p => p.value)
) as string[];

// Message Categories (based on NICE guidelines)
export type MessageCategory = 
  | "medication"
  | "diet"
  | "fasting"
  | "hygiene"
  | "lifestyle"
  | "preparation"
  | "arrival"
  | "general";

// ============================================
// FORM AND DATA TYPES
// ============================================

// Patient risk factors as a record
export type PatientRiskFactors = {
  [K in RiskFactorKey]?: boolean;
};

// Form Input Types
export interface CreatePatientInput {
  name: string;
  phone: string;
  procedureDate: Date;
  procedureType: string;
  // All risk factors
  riskDiabetesType1: boolean;
  riskDiabetesType2: boolean;
  riskThyroidDisorder: boolean;
  riskBloodThinner: boolean;
  riskAntiplatelet: boolean;
  riskHypertension: boolean;
  riskHeartFailure: boolean;
  riskAtrialFib: boolean;
  riskPacemaker: boolean;
  riskAsthma: boolean;
  riskCOPD: boolean;
  riskSleepApnoea: boolean;
  riskKidneyDisease: boolean;
  riskLiverDisease: boolean;
  riskLatexAllergy: boolean;
  riskContrastAllergy: boolean;
  riskDrugAllergies: boolean;
  riskSmoker: boolean;
  riskAlcohol: boolean;
  riskObesity: boolean;
  riskImmunosuppressed: boolean;
  riskPregnancy: boolean;
  riskFrailty: boolean;
  riskCognitiveImpair: boolean;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {
  id: string;
  status?: PatientStatus;
}

// Scheduled Message with confirmation details
export interface ScheduledMessageWithDetails {
  id: string;
  sendAt: Date;
  messageContent: string;
  taskDescription: string | null;
  requiresConfirmation: boolean;
  isSent: boolean;
  status: MessageStatus;
  sentAt: Date | null;
  confirmationToken: string | null;
  confirmedAt: Date | null;
  rejectedAt: Date | null;
  patientResponse: PatientResponse;
  patientNote: string | null;
  niceReference: string | null;
  category: string;
}

// Patient with Messages (for dashboard view)
export interface PatientWithMessages {
  id: string;
  name: string;
  phone: string;
  procedureDate: Date;
  procedureType: string;
  // All risk factors
  riskDiabetesType1: boolean;
  riskDiabetesType2: boolean;
  riskThyroidDisorder: boolean;
  riskBloodThinner: boolean;
  riskAntiplatelet: boolean;
  riskHypertension: boolean;
  riskHeartFailure: boolean;
  riskAtrialFib: boolean;
  riskPacemaker: boolean;
  riskAsthma: boolean;
  riskCOPD: boolean;
  riskSleepApnoea: boolean;
  riskKidneyDisease: boolean;
  riskLiverDisease: boolean;
  riskLatexAllergy: boolean;
  riskContrastAllergy: boolean;
  riskDrugAllergies: boolean;
  riskSmoker: boolean;
  riskAlcohol: boolean;
  riskObesity: boolean;
  riskImmunosuppressed: boolean;
  riskPregnancy: boolean;
  riskFrailty: boolean;
  riskCognitiveImpair: boolean;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  scheduledMessages: ScheduledMessageWithDetails[];
}

// Dashboard Stats
export interface DashboardStats {
  totalPatients: number;
  onTrack: number;
  atRisk: number;
  cancelled: number;
  pendingMessages: number;
  sentMessages: number;
  confirmedMessages: number;
  rejectedMessages: number;
  awaitingResponse: number;
  upcomingProcedures: number;
}

// Confirmation Page Data
export interface ConfirmationPageData {
  message: {
    id: string;
    taskDescription: string | null;
    messageContent: string;
    sendAt: Date;
    status: MessageStatus;
    patientResponse: PatientResponse;
    niceReference: string | null;
    category: string;
  };
  patient: {
    name: string;
    procedureType: string;
    procedureDate: Date;
  };
  isExpired: boolean;
  isAlreadyResponded: boolean;
}

// Upcoming Reminder for timeline view
export interface UpcomingReminder {
  id: string;
  patientId: string;
  patientName: string;
  procedureType: string;
  procedureDate: Date;
  sendAt: Date;
  messageContent: string;
  taskDescription: string | null;
  status: MessageStatus;
  patientResponse: PatientResponse;
  category: string;
  niceReference: string | null;
  daysUntilProcedure: number;
  daysUntilSend: number;
  confirmationToken: string | null;
}

// Helper function to get active risk factors from a patient
export function getActiveRiskFactors(patient: PatientWithMessages): RiskFactorDefinition[] {
  const activeFactors: RiskFactorDefinition[] = [];
  
  for (const category of RISK_FACTOR_CATEGORIES) {
    for (const factor of category.factors) {
      if (patient[factor.key as keyof PatientWithMessages]) {
        activeFactors.push(factor);
      }
    }
  }
  
  return activeFactors;
}

// Helper to check if patient has any risk in a category
export function hasRiskInCategory(patient: PatientWithMessages, categoryId: string): boolean {
  const category = RISK_FACTOR_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return false;
  
  return category.factors.some(factor => 
    patient[factor.key as keyof PatientWithMessages] === true
  );
}
