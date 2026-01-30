// Pre-Op Check - Database Seed Script
// Comprehensive Protocol Templates based on NICE Guidelines
// Supports expanded risk factors and procedure types

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TemplateData {
  procedureType: string;
  daysOffset: number;
  messageContent: string;
  taskDescription: string | null;
  requiresConfirmation: boolean;
  niceReference: string | null;
  requiredRiskTag: string | null;
  priority: number;
  category: string;
}

// Helper to generate standard templates for a procedure
function generateBaseTemplates(procedureType: string, niceRef: string): TemplateData[] {
  return [
    // Standard fasting (all procedures)
    {
      procedureType,
      daysOffset: -1,
      messageContent: `Hi {patient_name}, your ${procedureType} is tomorrow. NO food for 6 hours and NO clear fluids for 2 hours before your procedure. Confirm you understand.`,
      taskDescription: "I understand the fasting requirements (no food 6hrs, no fluids 2hrs before)",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.3.1 - Preoperative fasting",
      requiredRiskTag: null,
      priority: 2,
      category: "fasting",
    },
    // Day of procedure
    {
      procedureType,
      daysOffset: 0,
      messageContent: `Good morning {patient_name}! Your ${procedureType} is TODAY. Arrive at your scheduled time. Bring ID, insurance card, and medication list.`,
      taskDescription: "I am ready with all required documents",
      requiresConfirmation: true,
      niceReference: niceRef,
      requiredRiskTag: null,
      priority: 3,
      category: "arrival",
    },
  ];
}

// Risk-specific templates that apply across procedures
function generateRiskSpecificTemplates(procedureType: string): TemplateData[] {
  return [
    // Diabetes management
    {
      procedureType,
      daysOffset: -7,
      messageContent: `DIABETES ALERT: {patient_name}, please contact your diabetes team about adjusting your medication before your ${procedureType}. This is important for your safety.`,
      taskDescription: "I have contacted my diabetes team about medication adjustments",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.3.7 - Perioperative diabetes",
      requiredRiskTag: "diabetes",
      priority: 2,
      category: "medication",
    },
    {
      procedureType,
      daysOffset: -1,
      messageContent: "DIABETES REMINDER: Do NOT take your oral diabetes medication tonight or tomorrow morning. If on insulin, take HALF your usual dose. Check blood sugar frequently.",
      taskDescription: "I understand my diabetes medication instructions for surgery day",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.3.7 - Perioperative diabetes",
      requiredRiskTag: "diabetes",
      priority: 3,
      category: "medication",
    },
    // Anticoagulant management
    {
      procedureType,
      daysOffset: -7,
      messageContent: `ANTICOAGULANT ALERT: {patient_name}, you may need to stop your blood thinning medication before your ${procedureType}. Contact your doctor urgently to discuss bridging therapy.`,
      taskDescription: "I have discussed my anticoagulant management with my doctor",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.3.4 - Anticoagulation",
      requiredRiskTag: "blood_thinner",
      priority: 3,
      category: "medication",
    },
    // Antiplatelet management
    {
      procedureType,
      daysOffset: -7,
      messageContent: "ANTIPLATELET ALERT: {patient_name}, you may need to stop aspirin or clopidogrel before your procedure. Confirm with your surgeon - do NOT stop without medical advice.",
      taskDescription: "I have confirmed whether to stop my antiplatelet medication",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.3.5 - Antiplatelet therapy",
      requiredRiskTag: "antiplatelet",
      priority: 2,
      category: "medication",
    },
    // Kidney disease - contrast precautions
    {
      procedureType,
      daysOffset: -3,
      messageContent: "KIDNEY ALERT: {patient_name}, drink extra water before your procedure to protect your kidneys. Stop Metformin if taking it. Your kidney function will be checked.",
      taskDescription: "I am drinking extra fluids and have stopped Metformin if applicable",
      requiresConfirmation: true,
      niceReference: "NICE CG169 - Contrast-induced AKI",
      requiredRiskTag: "renal",
      priority: 2,
      category: "preparation",
    },
    // Contrast allergy
    {
      procedureType,
      daysOffset: -3,
      messageContent: "ALLERGY ALERT: {patient_name}, you have a contrast allergy on record. Inform the team on arrival. You may receive preventive medication.",
      taskDescription: "I will inform the team about my contrast allergy on arrival",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.2 - Allergy documentation",
      requiredRiskTag: "contrast_allergy",
      priority: 3,
      category: "preparation",
    },
    // Respiratory
    {
      procedureType,
      daysOffset: -1,
      messageContent: "RESPIRATORY ALERT: {patient_name}, bring all your inhalers to the hospital. Use your reliever inhaler if needed. Tell the anaesthetist about your breathing condition.",
      taskDescription: "I will bring my inhalers and inform the anaesthetic team",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.2 - Respiratory assessment",
      requiredRiskTag: "respiratory",
      priority: 2,
      category: "medication",
    },
    // Sleep apnoea
    {
      procedureType,
      daysOffset: -1,
      messageContent: "SLEEP APNOEA ALERT: {patient_name}, bring your CPAP machine to the hospital. This is essential for your safety during and after the procedure.",
      taskDescription: "I will bring my CPAP machine to the hospital",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.2 - OSA considerations",
      requiredRiskTag: "sleep_apnoea",
      priority: 3,
      category: "preparation",
    },
    // Smoking
    {
      procedureType,
      daysOffset: -14,
      messageContent: "SMOKING ADVICE: {patient_name}, stopping smoking before surgery reduces complications. Even stopping 24-48 hours before helps. Speak to your GP about support.",
      taskDescription: "I understand the benefits of stopping smoking before surgery",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.1 - Smoking cessation",
      requiredRiskTag: "smoker",
      priority: 1,
      category: "lifestyle",
    },
    // Pacemaker/ICD
    {
      procedureType,
      daysOffset: -3,
      messageContent: "CARDIAC DEVICE ALERT: {patient_name}, your pacemaker/ICD may need checking before surgery. Bring your device card. Diathermy settings may be adjusted.",
      taskDescription: "I will bring my pacemaker/ICD card to the hospital",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.2 - Cardiac devices",
      requiredRiskTag: "pacemaker",
      priority: 3,
      category: "preparation",
    },
    // Immunosuppressed
    {
      procedureType,
      daysOffset: -7,
      messageContent: "IMMUNOSUPPRESSION ALERT: {patient_name}, please discuss your immunosuppressant medications with your surgical team. You may need antibiotic prophylaxis.",
      taskDescription: "I have discussed my immunosuppressant medications with the team",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.2 - Immunosuppression",
      requiredRiskTag: "immunosuppressed",
      priority: 2,
      category: "medication",
    },
    // Frailty
    {
      procedureType,
      daysOffset: -7,
      messageContent: "IMPORTANT: {patient_name}, ensure you have support at home after your procedure. Consider arranging help with meals and mobility for the first few days.",
      taskDescription: "I have arranged support at home for after my procedure",
      requiresConfirmation: true,
      niceReference: "NICE NG180 1.1 - Frailty assessment",
      requiredRiskTag: "frailty",
      priority: 2,
      category: "preparation",
    },
  ];
}

const protocolTemplates: TemplateData[] = [
  // ====================================
  // GASTROENTEROLOGY PROCEDURES
  // ====================================
  
  // COLONOSCOPY - Comprehensive protocol
  {
    procedureType: "Colonoscopy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your colonoscopy is on {procedure_date}. Start a LOW-FIBER diet this week: avoid seeds, nuts, popcorn, raw vegetables, and whole grains.",
    taskDescription: "I will follow a low-fiber diet this week",
    requiresConfirmation: true,
    niceReference: "NICE DG30 - Bowel preparation",
    requiredRiskTag: null,
    priority: 1,
    category: "diet",
  },
  {
    procedureType: "Colonoscopy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, 3 days to your colonoscopy. Switch to CLEAR LIQUIDS ONLY from tomorrow. No solid food, milk, or juice with pulp.",
    taskDescription: "I will start clear liquids only tomorrow",
    requiresConfirmation: true,
    niceReference: "NICE DG30 - Clear liquid diet",
    requiredRiskTag: null,
    priority: 2,
    category: "diet",
  },
  {
    procedureType: "Colonoscopy",
    daysOffset: -1,
    messageContent: "PREP DAY: {patient_name}, start your bowel prep at 6 PM. Stay near a bathroom. Drink plenty of clear fluids. Nothing to eat or drink after midnight.",
    taskDescription: "I have my bowel prep ready and will start at 6 PM",
    requiresConfirmation: true,
    niceReference: "NICE DG30 - Bowel prep timing",
    requiredRiskTag: null,
    priority: 3,
    category: "preparation",
  },
  {
    procedureType: "Colonoscopy",
    daysOffset: 0,
    messageContent: "Good morning {patient_name}! Colonoscopy day. No food or water. Arrive 1 hour early. Bring ID and arrange a ride home - you cannot drive after sedation.",
    taskDescription: "I have arranged transport home and will not drive",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.5 - Safe discharge",
    requiredRiskTag: null,
    priority: 3,
    category: "arrival",
  },

  // UPPER ENDOSCOPY (OGD)
  {
    procedureType: "Upper Endoscopy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your upper endoscopy is in 3 days ({procedure_date}). You can eat normally until the day before.",
    taskDescription: "I understand I can eat normally until the day before",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.3.1",
    requiredRiskTag: null,
    priority: 1,
    category: "diet",
  },
  ...generateBaseTemplates("Upper Endoscopy", "NICE NG180"),

  // ERCP
  {
    procedureType: "ERCP",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your ERCP is scheduled for {procedure_date}. This is a more complex procedure. Please complete any blood tests requested.",
    taskDescription: "I have completed required blood tests",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.2",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("ERCP", "NICE NG180"),

  // LIVER BIOPSY
  {
    procedureType: "Liver Biopsy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your liver biopsy is on {procedure_date}. Blood clotting tests are essential. Stop any blood thinners as directed by your doctor.",
    taskDescription: "I have had my clotting tests and stopped blood thinners if advised",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.3.4",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Liver Biopsy", "NICE NG180"),

  // PEG INSERTION
  {
    procedureType: "PEG Insertion",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your PEG tube insertion is in 3 days. You may need antibiotics beforehand. Ensure you have support at home for tube care.",
    taskDescription: "I have arranged support for PEG tube care at home",
    requiresConfirmation: true,
    niceReference: "NICE CG32 - Nutrition support",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("PEG Insertion", "NICE CG32"),

  // ====================================
  // CARDIOLOGY PROCEDURES
  // ====================================

  // CARDIAC CATHETERIZATION
  {
    procedureType: "Cardiac Catheterization",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your cardiac catheterization is on {procedure_date}. Complete pre-op blood tests this week including kidney function.",
    taskDescription: "I have completed my pre-op blood tests",
    requiresConfirmation: true,
    niceReference: "NICE CG95 - Chest pain assessment",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  {
    procedureType: "Cardiac Catheterization",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, 3 days until your cardiac cath. Drink extra water to stay well hydrated. This helps protect your kidneys from contrast dye.",
    taskDescription: "I am drinking extra water to stay hydrated",
    requiresConfirmation: true,
    niceReference: "NICE CG169 - AKI prevention",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Cardiac Catheterization", "NICE CG95"),

  // ANGIOPLASTY (PCI)
  {
    procedureType: "Angioplasty",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your coronary angioplasty is on {procedure_date}. Continue aspirin unless told otherwise. Complete blood tests this week.",
    taskDescription: "I am continuing aspirin and have had blood tests",
    requiresConfirmation: true,
    niceReference: "NICE CG95 - PCI guidance",
    requiredRiskTag: null,
    priority: 2,
    category: "medication",
  },
  ...generateBaseTemplates("Angioplasty", "NICE CG95"),

  // PACEMAKER INSERTION
  {
    procedureType: "Pacemaker Insertion",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your pacemaker insertion is on {procedure_date}. You'll stay overnight. Pack a small bag with toiletries and loose-fitting top.",
    taskDescription: "I have packed for an overnight stay",
    requiresConfirmation: true,
    niceReference: "NICE TA324 - Cardiac devices",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Pacemaker Insertion", "NICE TA324"),

  // CARDIOVERSION
  {
    procedureType: "Cardioversion",
    daysOffset: -21,
    messageContent: "Hi {patient_name}, your cardioversion is on {procedure_date}. You MUST take your anticoagulant consistently for 3 weeks before. Missing doses may cancel procedure.",
    taskDescription: "I understand I must take anticoagulant consistently for 3 weeks",
    requiresConfirmation: true,
    niceReference: "NICE NG196 - AF management",
    requiredRiskTag: null,
    priority: 3,
    category: "medication",
  },
  ...generateBaseTemplates("Cardioversion", "NICE NG196"),

  // TOE (Echo)
  {
    procedureType: "TOE",
    daysOffset: -1,
    messageContent: "Hi {patient_name}, your TOE (heart scan) is tomorrow. No food 6 hours before. You'll have throat spray and possibly sedation. Arrange a ride home.",
    taskDescription: "I have arranged transport home",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("TOE", "NICE NG180"),

  // ====================================
  // ORTHOPAEDIC PROCEDURES
  // ====================================

  // JOINT REPLACEMENT
  {
    procedureType: "Joint Replacement",
    daysOffset: -14,
    messageContent: "Hi {patient_name}, your joint replacement is in 2 weeks ({procedure_date}). Complete pre-op assessment and dental check - dental infections risk joint infections.",
    taskDescription: "I have scheduled pre-op assessment and dental check",
    requiresConfirmation: true,
    niceReference: "NICE NG157 - Joint replacement",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  {
    procedureType: "Joint Replacement",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, 1 week until surgery. STOP ibuprofen, naproxen, and aspirin unless your surgeon says otherwise. Paracetamol is OK for pain.",
    taskDescription: "I have stopped anti-inflammatory medications",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.3.5 - NSAIDs",
    requiredRiskTag: null,
    priority: 2,
    category: "medication",
  },
  {
    procedureType: "Joint Replacement",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, 3 days to surgery. Start using antibacterial body wash daily. Practice with your walking aids. Pack for 1-2 night stay.",
    taskDescription: "I am using antibacterial wash and have my walking aids ready",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.3.3 - Skin prep",
    requiredRiskTag: null,
    priority: 1,
    category: "hygiene",
  },
  ...generateBaseTemplates("Joint Replacement", "NICE NG157"),

  // ARTHROSCOPY
  {
    procedureType: "Arthroscopy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your arthroscopy is in 3 days. This is usually a day case. Arrange transport home - you cannot drive after anaesthetic.",
    taskDescription: "I have arranged transport home",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Arthroscopy", "NICE NG180"),

  // SPINAL SURGERY
  {
    procedureType: "Spinal Surgery",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your spinal surgery is on {procedure_date}. Complete all pre-op tests. You may stay 1-3 nights depending on the procedure.",
    taskDescription: "I have completed pre-op tests and packed for hospital stay",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Spinal Surgery", "NICE NG180"),

  // FRACTURE FIXATION
  ...generateBaseTemplates("Fracture Fixation", "NICE NG180"),

  // CARPAL TUNNEL
  {
    procedureType: "Carpal Tunnel",
    daysOffset: -1,
    messageContent: "Hi {patient_name}, your carpal tunnel surgery is tomorrow. This is usually under local anaesthetic. You can eat and drink normally. Leave jewellery at home.",
    taskDescription: "I understand the procedure and will leave jewellery at home",
    requiresConfirmation: true,
    niceReference: "NICE CG173",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },

  // ====================================
  // UROLOGY PROCEDURES
  // ====================================

  // CYSTOSCOPY
  {
    procedureType: "Cystoscopy",
    daysOffset: -1,
    messageContent: "Hi {patient_name}, your cystoscopy is tomorrow. You may eat light breakfast if procedure is after midday. Drink plenty after to flush your bladder.",
    taskDescription: "I understand the eating guidelines for my procedure time",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Cystoscopy", "NICE NG180"),

  // TURP
  {
    procedureType: "TURP",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your TURP is on {procedure_date}. You'll stay 1-2 nights with a catheter. Stop blood thinners as directed. Complete blood tests.",
    taskDescription: "I have stopped blood thinners as directed and completed tests",
    requiresConfirmation: true,
    niceReference: "NICE CG97 - Lower urinary tract symptoms",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("TURP", "NICE CG97"),

  // KIDNEY STONE
  {
    procedureType: "Kidney Stone",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your kidney stone procedure is in 3 days. Drink plenty of water. You may need a stent placed temporarily.",
    taskDescription: "I am drinking plenty of water before my procedure",
    requiresConfirmation: true,
    niceReference: "NICE NG118 - Renal stones",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Kidney Stone", "NICE NG118"),

  // PROSTATE BIOPSY
  {
    procedureType: "Prostate Biopsy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your prostate biopsy is in 3 days. You'll receive antibiotics to take before. Stop blood thinners as advised.",
    taskDescription: "I have my antibiotics ready and stopped blood thinners if advised",
    requiresConfirmation: true,
    niceReference: "NICE NG131 - Prostate cancer",
    requiredRiskTag: null,
    priority: 2,
    category: "medication",
  },
  ...generateBaseTemplates("Prostate Biopsy", "NICE NG131"),

  // NEPHRECTOMY
  {
    procedureType: "Nephrectomy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your kidney surgery is on {procedure_date}. This is major surgery. Complete all pre-op tests. Pack for 3-5 night stay.",
    taskDescription: "I have completed tests and packed for hospital stay",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Nephrectomy", "NICE NG180"),

  // ====================================
  // GYNAECOLOGY PROCEDURES
  // ====================================

  // HYSTERECTOMY
  {
    procedureType: "Hysterectomy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your hysterectomy is on {procedure_date}. Complete pre-op assessment. You'll stay 1-3 nights depending on surgical approach.",
    taskDescription: "I have completed pre-op assessment",
    requiresConfirmation: true,
    niceReference: "NICE NG88 - Heavy menstrual bleeding",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Hysterectomy", "NICE NG88"),

  // LAPAROSCOPY GYNAE
  {
    procedureType: "Laparoscopy Gynae",
    daysOffset: -1,
    messageContent: "Hi {patient_name}, your laparoscopy is tomorrow. Usually a day case. You may have shoulder tip pain after from the gas - this is normal and settles.",
    taskDescription: "I understand the procedure and possible shoulder discomfort after",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Laparoscopy Gynae", "NICE NG180"),

  // HYSTEROSCOPY
  ...generateBaseTemplates("Hysteroscopy", "NICE NG88"),

  // D&C
  ...generateBaseTemplates("D&C", "NICE NG180"),

  // OVARIAN SURGERY
  ...generateBaseTemplates("Ovarian Surgery", "NICE NG180"),

  // ====================================
  // GENERAL SURGERY PROCEDURES
  // ====================================

  // GENERAL SURGERY (base)
  {
    procedureType: "General Surgery",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your surgery is on {procedure_date}. Complete any required pre-op tests this week. Stop NSAIDs (ibuprofen, naproxen) 5 days before.",
    taskDescription: "I have completed tests and stopped NSAIDs",
    requiresConfirmation: true,
    niceReference: "NICE NG180 1.2",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("General Surgery", "NICE NG180"),

  // CHOLECYSTECTOMY
  {
    procedureType: "Cholecystectomy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your gallbladder surgery is in 3 days. Usually keyhole and day case. You may feel bloated for a few days after.",
    taskDescription: "I understand the procedure and recovery",
    requiresConfirmation: true,
    niceReference: "NICE NG104 - Gallstone disease",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Cholecystectomy", "NICE NG104"),

  // HERNIA REPAIR
  ...generateBaseTemplates("Hernia Repair", "NICE NG180"),

  // APPENDECTOMY
  ...generateBaseTemplates("Appendectomy", "NICE NG180"),

  // THYROIDECTOMY
  {
    procedureType: "Thyroidectomy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your thyroid surgery is on {procedure_date}. You'll stay overnight. Your voice may be hoarse temporarily - this usually improves.",
    taskDescription: "I understand the procedure and potential temporary voice changes",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Thyroidectomy", "NICE NG180"),

  // MASTECTOMY
  {
    procedureType: "Mastectomy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your breast surgery is on {procedure_date}. Complete pre-op assessment. A breast care nurse will support you through this journey.",
    taskDescription: "I have had pre-op assessment and met the breast care team",
    requiresConfirmation: true,
    niceReference: "NICE NG101 - Early breast cancer",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Mastectomy", "NICE NG101"),

  // ====================================
  // OPHTHALMOLOGY PROCEDURES
  // ====================================

  // CATARACT SURGERY
  {
    procedureType: "Cataract Surgery",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your cataract surgery is in 3 days ({procedure_date}). Start antibiotic eye drops 4 times daily. Wash face thoroughly, no eye makeup.",
    taskDescription: "I have started antibiotic drops and will avoid eye makeup",
    requiresConfirmation: true,
    niceReference: "NICE NG77 - Cataracts",
    requiredRiskTag: null,
    priority: 2,
    category: "medication",
  },
  {
    procedureType: "Cataract Surgery",
    daysOffset: 0,
    messageContent: "Good morning {patient_name}! Cataract surgery day. Light breakfast OK before 6am. Arrive 1 hour early. Bring sunglasses. Arrange a ride home.",
    taskDescription: "I have sunglasses and transport arranged",
    requiresConfirmation: true,
    niceReference: "NICE NG77",
    requiredRiskTag: null,
    priority: 2,
    category: "arrival",
  },

  // VITRECTOMY
  ...generateBaseTemplates("Vitrectomy", "NICE NG180"),

  // GLAUCOMA SURGERY
  ...generateBaseTemplates("Glaucoma Surgery", "NICE NG81"),

  // ====================================
  // ENT PROCEDURES
  // ====================================

  // TONSILLECTOMY
  {
    procedureType: "Tonsillectomy",
    daysOffset: -3,
    messageContent: "Hi {patient_name}, your tonsillectomy is in 3 days. Stock up on soft foods and ice lollies for recovery. You'll need 2 weeks off work/school.",
    taskDescription: "I have prepared soft foods for recovery",
    requiresConfirmation: true,
    niceReference: "NICE NG180",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Tonsillectomy", "NICE NG180"),

  // SEPTOPLASTY
  ...generateBaseTemplates("Septoplasty", "NICE NG180"),

  // MASTOIDECTOMY
  ...generateBaseTemplates("Mastoidectomy", "NICE NG180"),

  // THYROID SURGERY ENT
  ...generateBaseTemplates("Thyroid Surgery ENT", "NICE NG180"),

  // ====================================
  // VASCULAR PROCEDURES
  // ====================================

  // VARICOSE VEINS
  {
    procedureType: "Varicose Veins",
    daysOffset: -1,
    messageContent: "Hi {patient_name}, your varicose vein procedure is tomorrow. Wear loose trousers. You'll wear compression stockings after - bring them if provided.",
    taskDescription: "I have loose clothes and compression stockings ready",
    requiresConfirmation: true,
    niceReference: "NICE CG168 - Varicose veins",
    requiredRiskTag: null,
    priority: 1,
    category: "preparation",
  },
  ...generateBaseTemplates("Varicose Veins", "NICE CG168"),

  // CAROTID ENDARTERECTOMY
  {
    procedureType: "Carotid Endarterectomy",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your carotid surgery is on {procedure_date}. This prevents stroke. Continue aspirin. Complete all pre-op tests including heart assessment.",
    taskDescription: "I have completed tests and am continuing aspirin",
    requiresConfirmation: true,
    niceReference: "NICE NG128 - Stroke prevention",
    requiredRiskTag: null,
    priority: 3,
    category: "preparation",
  },
  ...generateBaseTemplates("Carotid Endarterectomy", "NICE NG128"),

  // AAA REPAIR
  {
    procedureType: "AAA Repair",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your aortic aneurysm repair is on {procedure_date}. This is major surgery. Complete cardiac assessment. Pack for 5-7 night stay.",
    taskDescription: "I have completed cardiac tests and packed for hospital stay",
    requiresConfirmation: true,
    niceReference: "NICE NG156 - AAA screening",
    requiredRiskTag: null,
    priority: 3,
    category: "preparation",
  },
  ...generateBaseTemplates("AAA Repair", "NICE NG156"),

  // PERIPHERAL BYPASS
  {
    procedureType: "Peripheral Bypass",
    daysOffset: -7,
    messageContent: "Hi {patient_name}, your leg bypass surgery is on {procedure_date}. Stop smoking if possible - this significantly improves outcomes. Complete all tests.",
    taskDescription: "I understand the importance of stopping smoking and have completed tests",
    requiresConfirmation: true,
    niceReference: "NICE CG147 - Peripheral arterial disease",
    requiredRiskTag: null,
    priority: 2,
    category: "preparation",
  },
  ...generateBaseTemplates("Peripheral Bypass", "NICE CG147"),
];

// Add risk-specific templates for key procedures
const keyProcedures = [
  "Colonoscopy", "Cardiac Catheterization", "Joint Replacement", "General Surgery",
  "Hysterectomy", "TURP", "Spinal Surgery", "AAA Repair", "Angioplasty"
];

const allTemplates = [
  ...protocolTemplates,
  ...keyProcedures.flatMap(proc => generateRiskSpecificTemplates(proc)),
];

async function main() {
  console.log("🌱 Seeding database with comprehensive NICE guideline protocols...\n");

  // Clear existing templates
  await prisma.protocolTemplate.deleteMany();

  // Insert all templates (handle duplicates)
  let inserted = 0;
  let skipped = 0;

  for (const template of allTemplates) {
    try {
      await prisma.protocolTemplate.create({
        data: template,
      });
      inserted++;
    } catch (error: unknown) {
      // Skip duplicates (unique constraint violations)
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        skipped++;
      } else {
        throw error;
      }
    }
  }

  console.log(`✅ Inserted ${inserted} protocol templates (${skipped} duplicates skipped)\n`);

  // Show summary by procedure type
  const procedures = await prisma.protocolTemplate.groupBy({
    by: ["procedureType"],
    _count: { id: true },
  });

  console.log("📋 Templates by procedure type:");
  procedures.sort((a, b) => a.procedureType.localeCompare(b.procedureType));
  for (const proc of procedures) {
    console.log(`   - ${proc.procedureType}: ${proc._count.id} templates`);
  }

  // Show risk tag coverage
  const riskTags = await prisma.protocolTemplate.groupBy({
    by: ["requiredRiskTag"],
    _count: { id: true },
  });

  console.log("\n🏷️  Risk factor coverage:");
  for (const tag of riskTags) {
    console.log(`   - ${tag.requiredRiskTag || "(all patients)"}: ${tag._count.id} templates`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
