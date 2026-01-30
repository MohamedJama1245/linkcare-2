// LinkCare - Demo Data Initialization
// Auto-seeds protocol templates and creates demo patients on first visit
// This ensures the demo works for all Vercel visitors

import { db } from "./db";
import { generateMessagesForPatient } from "./message-engine";
import { addDays } from "date-fns";

// Flag to prevent multiple concurrent initializations
let isInitializing = false;
let hasInitialized = false;

/**
 * Protocol templates (condensed version for auto-seeding)
 * These are essential templates for the demo to work
 */
const essentialTemplates = [
  // Colonoscopy - Full protocol
  { procedureType: "Colonoscopy", daysOffset: -7, messageContent: "Hi {patient_name}, your colonoscopy is on {procedure_date}. Start a LOW-FIBER diet this week: avoid seeds, nuts, popcorn, raw vegetables, and whole grains.", taskDescription: "I will follow a low-fiber diet this week", requiresConfirmation: true, niceReference: "NICE DG30", requiredRiskTag: null, priority: 1, category: "diet" },
  { procedureType: "Colonoscopy", daysOffset: -3, messageContent: "Hi {patient_name}, 3 days to your colonoscopy. Switch to CLEAR LIQUIDS ONLY from tomorrow. No solid food, milk, or juice with pulp.", taskDescription: "I will start clear liquids only tomorrow", requiresConfirmation: true, niceReference: "NICE DG30", requiredRiskTag: null, priority: 2, category: "diet" },
  { procedureType: "Colonoscopy", daysOffset: -1, messageContent: "PREP DAY: {patient_name}, start your bowel prep at 6 PM. Stay near a bathroom. Drink plenty of clear fluids. Nothing to eat or drink after midnight.", taskDescription: "I have my bowel prep ready and will start at 6 PM", requiresConfirmation: true, niceReference: "NICE DG30", requiredRiskTag: null, priority: 3, category: "preparation" },
  { procedureType: "Colonoscopy", daysOffset: 0, messageContent: "Good morning {patient_name}! Colonoscopy day. No food or water. Arrive 1 hour early. Bring ID and arrange a ride home - you cannot drive after sedation.", taskDescription: "I have arranged transport home and will not drive", requiresConfirmation: true, niceReference: "NICE NG180", requiredRiskTag: null, priority: 3, category: "arrival" },
  
  // Diabetes-specific for colonoscopy
  { procedureType: "Colonoscopy", daysOffset: -7, messageContent: "DIABETES ALERT: {patient_name}, please contact your diabetes team about adjusting your medication before your colonoscopy. This is important for your safety.", taskDescription: "I have contacted my diabetes team about medication adjustments", requiresConfirmation: true, niceReference: "NICE NG180 1.3.7", requiredRiskTag: "diabetes", priority: 2, category: "medication" },
  { procedureType: "Colonoscopy", daysOffset: -1, messageContent: "DIABETES REMINDER: Do NOT take your oral diabetes medication tonight or tomorrow morning. If on insulin, take HALF your usual dose. Check blood sugar frequently.", taskDescription: "I understand my diabetes medication instructions for surgery day", requiresConfirmation: true, niceReference: "NICE NG180 1.3.7", requiredRiskTag: "diabetes", priority: 3, category: "medication" },
  
  // Blood thinner specific
  { procedureType: "Colonoscopy", daysOffset: -7, messageContent: "ANTICOAGULANT ALERT: {patient_name}, you may need to stop your blood thinning medication before your colonoscopy. Contact your doctor urgently to discuss bridging therapy.", taskDescription: "I have discussed my anticoagulant management with my doctor", requiresConfirmation: true, niceReference: "NICE NG180 1.3.4", requiredRiskTag: "blood_thinner", priority: 3, category: "medication" },
  
  // Cardiac Catheterization
  { procedureType: "Cardiac Catheterization", daysOffset: -7, messageContent: "Hi {patient_name}, your cardiac catheterization is on {procedure_date}. Complete pre-op blood tests this week including kidney function.", taskDescription: "I have completed my pre-op blood tests", requiresConfirmation: true, niceReference: "NICE CG95", requiredRiskTag: null, priority: 1, category: "preparation" },
  { procedureType: "Cardiac Catheterization", daysOffset: -3, messageContent: "Hi {patient_name}, 3 days until your cardiac cath. Drink extra water to stay well hydrated. This helps protect your kidneys from contrast dye.", taskDescription: "I am drinking extra water to stay hydrated", requiresConfirmation: true, niceReference: "NICE CG169", requiredRiskTag: null, priority: 1, category: "preparation" },
  { procedureType: "Cardiac Catheterization", daysOffset: -1, messageContent: "Hi {patient_name}, your cardiac catheterization is tomorrow. NO food for 6 hours and NO clear fluids for 2 hours before your procedure. Confirm you understand.", taskDescription: "I understand the fasting requirements (no food 6hrs, no fluids 2hrs before)", requiresConfirmation: true, niceReference: "NICE NG180 1.3.1", requiredRiskTag: null, priority: 2, category: "fasting" },
  { procedureType: "Cardiac Catheterization", daysOffset: 0, messageContent: "Good morning {patient_name}! Your cardiac catheterization is TODAY. Arrive at your scheduled time. Bring ID, insurance card, and medication list.", taskDescription: "I am ready with all required documents", requiresConfirmation: true, niceReference: "NICE CG95", requiredRiskTag: null, priority: 3, category: "arrival" },
  
  // Kidney disease specific for cardiac cath
  { procedureType: "Cardiac Catheterization", daysOffset: -3, messageContent: "KIDNEY ALERT: {patient_name}, drink extra water before your procedure to protect your kidneys. Stop Metformin if taking it. Your kidney function will be checked.", taskDescription: "I am drinking extra fluids and have stopped Metformin if applicable", requiresConfirmation: true, niceReference: "NICE CG169", requiredRiskTag: "renal", priority: 2, category: "preparation" },
  
  // Joint Replacement
  { procedureType: "Joint Replacement", daysOffset: -14, messageContent: "Hi {patient_name}, your joint replacement is in 2 weeks ({procedure_date}). Complete pre-op assessment and dental check - dental infections risk joint infections.", taskDescription: "I have scheduled pre-op assessment and dental check", requiresConfirmation: true, niceReference: "NICE NG157", requiredRiskTag: null, priority: 1, category: "preparation" },
  { procedureType: "Joint Replacement", daysOffset: -7, messageContent: "Hi {patient_name}, 1 week until surgery. STOP ibuprofen, naproxen, and aspirin unless your surgeon says otherwise. Paracetamol is OK for pain.", taskDescription: "I have stopped anti-inflammatory medications", requiresConfirmation: true, niceReference: "NICE NG180 1.3.5", requiredRiskTag: null, priority: 2, category: "medication" },
  { procedureType: "Joint Replacement", daysOffset: -3, messageContent: "Hi {patient_name}, 3 days to surgery. Start using antibacterial body wash daily. Practice with your walking aids. Pack for 1-2 night stay.", taskDescription: "I am using antibacterial wash and have my walking aids ready", requiresConfirmation: true, niceReference: "NICE NG180 1.3.3", requiredRiskTag: null, priority: 1, category: "hygiene" },
  { procedureType: "Joint Replacement", daysOffset: -1, messageContent: "Hi {patient_name}, your joint replacement is tomorrow. NO food for 6 hours and NO clear fluids for 2 hours before your procedure. Confirm you understand.", taskDescription: "I understand the fasting requirements", requiresConfirmation: true, niceReference: "NICE NG180 1.3.1", requiredRiskTag: null, priority: 2, category: "fasting" },
  { procedureType: "Joint Replacement", daysOffset: 0, messageContent: "Good morning {patient_name}! Your joint replacement is TODAY. Arrive at your scheduled time. Bring ID, walking aids, and overnight bag.", taskDescription: "I am ready with all required items", requiresConfirmation: true, niceReference: "NICE NG157", requiredRiskTag: null, priority: 3, category: "arrival" },
  
  // Smoker advice for joint replacement
  { procedureType: "Joint Replacement", daysOffset: -14, messageContent: "SMOKING ADVICE: {patient_name}, stopping smoking before surgery reduces complications. Even stopping 24-48 hours before helps. Speak to your GP about support.", taskDescription: "I understand the benefits of stopping smoking before surgery", requiresConfirmation: true, niceReference: "NICE NG180 1.1", requiredRiskTag: "smoker", priority: 1, category: "lifestyle" },
  
  // General Surgery
  { procedureType: "General Surgery", daysOffset: -7, messageContent: "Hi {patient_name}, your surgery is on {procedure_date}. Complete any required pre-op tests this week. Stop NSAIDs (ibuprofen, naproxen) 5 days before.", taskDescription: "I have completed tests and stopped NSAIDs", requiresConfirmation: true, niceReference: "NICE NG180", requiredRiskTag: null, priority: 1, category: "preparation" },
  { procedureType: "General Surgery", daysOffset: -1, messageContent: "Hi {patient_name}, your surgery is tomorrow. NO food for 6 hours and NO clear fluids for 2 hours before your procedure. Confirm you understand.", taskDescription: "I understand the fasting requirements", requiresConfirmation: true, niceReference: "NICE NG180 1.3.1", requiredRiskTag: null, priority: 2, category: "fasting" },
  { procedureType: "General Surgery", daysOffset: 0, messageContent: "Good morning {patient_name}! Your surgery is TODAY. Arrive at your scheduled time. Bring ID, insurance card, and medication list.", taskDescription: "I am ready with all required documents", requiresConfirmation: true, niceReference: "NICE NG180", requiredRiskTag: null, priority: 3, category: "arrival" },
  
  // Diabetes for general surgery
  { procedureType: "General Surgery", daysOffset: -7, messageContent: "DIABETES ALERT: {patient_name}, please contact your diabetes team about adjusting your medication before your surgery. This is important for your safety.", taskDescription: "I have contacted my diabetes team about medication adjustments", requiresConfirmation: true, niceReference: "NICE NG180 1.3.7", requiredRiskTag: "diabetes", priority: 2, category: "medication" },
  
  // Blood thinner for general surgery
  { procedureType: "General Surgery", daysOffset: -7, messageContent: "ANTICOAGULANT ALERT: {patient_name}, you may need to stop your blood thinning medication before your surgery. Contact your doctor urgently to discuss bridging therapy.", taskDescription: "I have discussed my anticoagulant management with my doctor", requiresConfirmation: true, niceReference: "NICE NG180 1.3.4", requiredRiskTag: "blood_thinner", priority: 3, category: "medication" },
  
  // Cataract Surgery
  { procedureType: "Cataract Surgery", daysOffset: -3, messageContent: "Hi {patient_name}, your cataract surgery is in 3 days ({procedure_date}). Start antibiotic eye drops 4 times daily. Wash face thoroughly, no eye makeup.", taskDescription: "I have started antibiotic drops and will avoid eye makeup", requiresConfirmation: true, niceReference: "NICE NG77", requiredRiskTag: null, priority: 2, category: "medication" },
  { procedureType: "Cataract Surgery", daysOffset: 0, messageContent: "Good morning {patient_name}! Cataract surgery day. Light breakfast OK before 6am. Arrive 1 hour early. Bring sunglasses. Arrange a ride home.", taskDescription: "I have sunglasses and transport arranged", requiresConfirmation: true, niceReference: "NICE NG77", requiredRiskTag: null, priority: 2, category: "arrival" },
  
  // Upper Endoscopy
  { procedureType: "Upper Endoscopy", daysOffset: -3, messageContent: "Hi {patient_name}, your upper endoscopy is in 3 days ({procedure_date}). You can eat normally until the day before.", taskDescription: "I understand I can eat normally until the day before", requiresConfirmation: true, niceReference: "NICE NG180", requiredRiskTag: null, priority: 1, category: "diet" },
  { procedureType: "Upper Endoscopy", daysOffset: -1, messageContent: "Hi {patient_name}, your upper endoscopy is tomorrow. NO food for 6 hours and NO clear fluids for 2 hours before your procedure. Confirm you understand.", taskDescription: "I understand the fasting requirements", requiresConfirmation: true, niceReference: "NICE NG180 1.3.1", requiredRiskTag: null, priority: 2, category: "fasting" },
  { procedureType: "Upper Endoscopy", daysOffset: 0, messageContent: "Good morning {patient_name}! Your upper endoscopy is TODAY. Arrive at your scheduled time. Bring ID and arrange a ride home - you cannot drive after sedation.", taskDescription: "I have arranged transport home", requiresConfirmation: true, niceReference: "NICE NG180", requiredRiskTag: null, priority: 3, category: "arrival" },
];

/**
 * Demo patients with realistic data
 */
const demoPatients = [
  {
    name: "Sarah Mitchell",
    phone: "+44 7700 900123",
    procedureType: "Colonoscopy",
    daysFromNow: 5,
    riskDiabetesType2: true,
    riskBloodThinner: false,
  },
  {
    name: "James Wilson",
    phone: "+44 7700 900456",
    procedureType: "Cardiac Catheterization",
    daysFromNow: 8,
    riskDiabetesType1: false,
    riskBloodThinner: true,
    riskKidneyDisease: true,
  },
  {
    name: "Emma Thompson",
    phone: "+44 7700 900789",
    procedureType: "Joint Replacement",
    daysFromNow: 12,
    riskSmoker: true,
    riskObesity: true,
  },
  {
    name: "Robert Brown",
    phone: "+44 7700 900321",
    procedureType: "General Surgery",
    daysFromNow: 3,
    riskDiabetesType2: true,
    riskHeartFailure: true,
  },
  {
    name: "Helen Davis",
    phone: "+44 7700 900654",
    procedureType: "Cataract Surgery",
    daysFromNow: 4,
  },
  {
    name: "Michael Chen",
    phone: "+44 7700 900987",
    procedureType: "Upper Endoscopy",
    daysFromNow: 2,
    riskBloodThinner: true,
  },
];

/**
 * Check if database has been initialized with templates
 */
async function needsInitialization(): Promise<boolean> {
  try {
    const templateCount = await db.protocolTemplate.count();
    return templateCount === 0;
  } catch (error) {
    console.error("[DemoInit] Database connection error, assuming needs initialization:", error);
    // Return false to prevent initialization attempts when DB is down
    return false;
  }
}

/**
 * Seed protocol templates
 */
async function seedTemplates(): Promise<void> {
  console.log("[DemoInit] Seeding protocol templates...");
  
  let inserted = 0;
  for (const template of essentialTemplates) {
    try {
      await db.protocolTemplate.create({
        data: template,
      });
      inserted++;
    } catch (error: unknown) {
      // Skip duplicates
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        continue;
      }
    }
  }
  
  console.log(`[DemoInit] Inserted ${inserted} protocol templates`);
}

/**
 * Create demo patients
 */
async function createDemoPatients(): Promise<void> {
  const existingPatients = await db.patient.count();
  
  if (existingPatients > 0) {
    console.log("[DemoInit] Demo patients already exist, skipping...");
    return;
  }
  
  console.log("[DemoInit] Creating demo patients...");
  
  const today = new Date();
  
  for (const demoPatient of demoPatients) {
    const procedureDate = addDays(today, demoPatient.daysFromNow);
    
    const patient = await db.patient.create({
      data: {
        name: demoPatient.name,
        phone: demoPatient.phone,
        procedureType: demoPatient.procedureType,
        procedureDate,
        riskDiabetesType1: demoPatient.riskDiabetesType1 || false,
        riskDiabetesType2: demoPatient.riskDiabetesType2 || false,
        riskBloodThinner: demoPatient.riskBloodThinner || false,
        riskKidneyDisease: demoPatient.riskKidneyDisease || false,
        riskSmoker: demoPatient.riskSmoker || false,
        riskObesity: demoPatient.riskObesity || false,
        riskHeartFailure: demoPatient.riskHeartFailure || false,
        status: "ON_TRACK",
      },
    });
    
    // Generate messages for this patient
    await generateMessagesForPatient(patient);
    
    console.log(`[DemoInit] Created patient: ${patient.name} (${patient.procedureType})`);
  }
  
  console.log(`[DemoInit] Created ${demoPatients.length} demo patients`);
}

/**
 * Initialize demo data (templates + patients)
 * Safe to call multiple times - will only run once
 */
export async function initializeDemoData(): Promise<void> {
  // Prevent concurrent initialization
  if (isInitializing || hasInitialized) {
    return;
  }
  
  isInitializing = true;
  
  try {
    const needsInit = await needsInitialization();
    
    if (needsInit) {
      console.log("[DemoInit] Database needs initialization...");
      await seedTemplates();
      await createDemoPatients();
      console.log("[DemoInit] Initialization complete!");
    }
    
    hasInitialized = true;
  } catch (error) {
    console.error("[DemoInit] Initialization failed:", error);
    // Allow retry on next request
    hasInitialized = false;
  } finally {
    isInitializing = false;
  }
}

/**
 * Reset demo data (delete all and recreate)
 * Useful for "reset demo" functionality
 */
export async function resetDemoData(): Promise<void> {
  console.log("[DemoInit] Resetting demo data...");
  
  // Delete all messages first (due to foreign key)
  await db.scheduledMessage.deleteMany();
  
  // Delete all patients
  await db.patient.deleteMany();
  
  // Reset flag so we recreate patients
  hasInitialized = false;
  
  // Recreate demo patients
  await createDemoPatients();
  
  console.log("[DemoInit] Demo data reset complete!");
}
