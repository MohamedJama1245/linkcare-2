// LinkCare - Message Generation Engine
// The "Brain" of the system - generates scheduled messages based on NICE protocol templates
// Supports expanded risk factor categories

import { db } from "./db";
import { addDays, startOfDay, isBefore, isToday, startOfToday } from "date-fns";
import { randomBytes } from "crypto";

interface PatientData {
  id: string;
  procedureDate: Date;
  procedureType: string;
  name: string;
  // Metabolic & Endocrine
  riskDiabetesType1: boolean;
  riskDiabetesType2: boolean;
  riskThyroidDisorder: boolean;
  // Cardiovascular
  riskBloodThinner: boolean;
  riskAntiplatelet: boolean;
  riskHypertension: boolean;
  riskHeartFailure: boolean;
  riskAtrialFib: boolean;
  riskPacemaker: boolean;
  // Respiratory
  riskAsthma: boolean;
  riskCOPD: boolean;
  riskSleepApnoea: boolean;
  // Renal & Hepatic
  riskKidneyDisease: boolean;
  riskLiverDisease: boolean;
  // Allergies
  riskLatexAllergy: boolean;
  riskContrastAllergy: boolean;
  riskDrugAllergies: boolean;
  // Lifestyle
  riskSmoker: boolean;
  riskAlcohol: boolean;
  riskObesity: boolean;
  // Other Clinical
  riskImmunosuppressed: boolean;
  riskPregnancy: boolean;
  riskFrailty: boolean;
  riskCognitiveImpair: boolean;
}

/**
 * Generate a secure confirmation token
 */
function generateConfirmationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Check if a patient matches a required risk tag
 * Supports compound tags like "diabetes" (either type) or specific tags
 */
function patientMatchesRiskTag(patient: PatientData, tag: string | null): boolean {
  if (!tag) return true; // No tag required = applies to all

  // Map risk tags to patient fields
  const tagMappings: Record<string, () => boolean> = {
    // Diabetes (either type)
    "diabetes": () => patient.riskDiabetesType1 || patient.riskDiabetesType2,
    "diabetes_type1": () => patient.riskDiabetesType1,
    "diabetes_type2": () => patient.riskDiabetesType2,
    "thyroid": () => patient.riskThyroidDisorder,
    
    // Cardiovascular
    "blood_thinner": () => patient.riskBloodThinner,
    "anticoagulant": () => patient.riskBloodThinner,
    "antiplatelet": () => patient.riskAntiplatelet,
    "hypertension": () => patient.riskHypertension,
    "heart_failure": () => patient.riskHeartFailure,
    "atrial_fib": () => patient.riskAtrialFib || patient.riskBloodThinner, // AF patients often on anticoag
    "pacemaker": () => patient.riskPacemaker,
    "cardiac": () => patient.riskHeartFailure || patient.riskAtrialFib || patient.riskPacemaker,
    
    // Respiratory
    "asthma": () => patient.riskAsthma,
    "copd": () => patient.riskCOPD,
    "respiratory": () => patient.riskAsthma || patient.riskCOPD || patient.riskSleepApnoea,
    "sleep_apnoea": () => patient.riskSleepApnoea,
    
    // Renal & Hepatic
    "kidney_disease": () => patient.riskKidneyDisease,
    "renal": () => patient.riskKidneyDisease,
    "liver_disease": () => patient.riskLiverDisease,
    "hepatic": () => patient.riskLiverDisease,
    
    // Allergies
    "latex_allergy": () => patient.riskLatexAllergy,
    "contrast_allergy": () => patient.riskContrastAllergy,
    "drug_allergy": () => patient.riskDrugAllergies,
    "allergy": () => patient.riskLatexAllergy || patient.riskContrastAllergy || patient.riskDrugAllergies,
    
    // Lifestyle
    "smoker": () => patient.riskSmoker,
    "alcohol": () => patient.riskAlcohol,
    "obesity": () => patient.riskObesity,
    
    // Other
    "immunosuppressed": () => patient.riskImmunosuppressed,
    "pregnancy": () => patient.riskPregnancy,
    "frailty": () => patient.riskFrailty,
    "cognitive": () => patient.riskCognitiveImpair,
    
    // Legacy support
    "diabetic": () => patient.riskDiabetesType1 || patient.riskDiabetesType2,
  };

  const matcher = tagMappings[tag.toLowerCase()];
  return matcher ? matcher() : false;
}

/**
 * Generate scheduled messages for a patient based on their procedure type and risk factors
 */
export async function generateMessagesForPatient(
  patient: PatientData
): Promise<number> {
  // 1. Fetch all protocol templates for this procedure type
  const templates = await db.protocolTemplate.findMany({
    where: {
      procedureType: patient.procedureType,
    },
    orderBy: {
      daysOffset: "asc",
    },
  });

  if (templates.length === 0) {
    console.warn(
      `[MessageEngine] No templates found for procedure type: ${patient.procedureType}`
    );
    return 0;
  }

  // 2. Filter templates based on patient risk factors
  const applicableTemplates = templates.filter((template) => 
    patientMatchesRiskTag(patient, template.requiredRiskTag)
  );

  // 3. Generate scheduled messages
  const procedureDate = startOfDay(patient.procedureDate);
  const today = startOfToday();
  
  const messagesToCreate = applicableTemplates.map((template) => {
    const sendAt = addDays(procedureDate, template.daysOffset);
    
    // If the sendAt is in the past or today, the message should be sent immediately
    // We'll mark it with a flag for auto-processing
    const shouldSendImmediately = isBefore(sendAt, today) || isToday(sendAt);

    // Personalize the message content
    const personalizedContent = personalizeMessage(
      template.messageContent,
      patient.name,
      patient.procedureDate
    );

    return {
      patientId: patient.id,
      sendAt,
      messageContent: personalizedContent,
      taskDescription: template.taskDescription,
      requiresConfirmation: template.requiresConfirmation,
      confirmationToken: template.requiresConfirmation ? generateConfirmationToken() : null,
      niceReference: template.niceReference,
      category: template.category,
      isSent: false,
      status: "PENDING",
    };
  });

  // 4. Bulk create all scheduled messages
  if (messagesToCreate.length > 0) {
    await db.scheduledMessage.createMany({
      data: messagesToCreate,
    });

    console.log(
      `[MessageEngine] Generated ${messagesToCreate.length} messages for patient: ${patient.name}`
    );
    
    // 5. Auto-process any messages that should be sent immediately
    await autoProcessDueMessages();
  }

  return messagesToCreate.length;
}

/**
 * Personalize message content with patient details
 */
function personalizeMessage(
  template: string,
  patientName: string,
  procedureDate: Date
): string {
  const formattedDate = procedureDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return template
    .replace(/\{patient_name\}/g, patientName)
    .replace(/\{procedure_date\}/g, formattedDate);
}

/**
 * Get the base URL for confirmation links
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

/**
 * Mock SMS sending function with confirmation link
 */
export async function sendMessage(messageId: string): Promise<boolean> {
  const message = await db.scheduledMessage.findUnique({
    where: { id: messageId },
    include: { patient: true },
  });

  if (!message) {
    console.error(`[SMS] Message not found: ${messageId}`);
    return false;
  }

  // Build confirmation URL if token exists
  const confirmationUrl = message.confirmationToken
    ? `${getBaseUrl()}/confirm/${message.confirmationToken}`
    : null;

  // Build the full SMS content
  let smsContent = message.messageContent;
  if (confirmationUrl && message.requiresConfirmation) {
    smsContent += `\n\n📱 Please confirm: ${confirmationUrl}`;
  }

  // Simulate SMS dispatch (mock)
  console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║  📱 SMS DISPATCH (MOCK)                                                ║
╠════════════════════════════════════════════════════════════════════════╣
║  To: ${message.patient.phone.padEnd(66)}║
║  Patient: ${message.patient.name.padEnd(61)}║
║  Category: ${(message.category || "general").toUpperCase().padEnd(60)}║
║  NICE Ref: ${(message.niceReference || "N/A").padEnd(60)}║
╠════════════════════════════════════════════════════════════════════════╣
║  Message:                                                              ║
║  ${smsContent.substring(0, 70).padEnd(70)}║
${smsContent.length > 70 ? `║  ${smsContent.substring(70, 140).padEnd(70)}║\n` : ""}${confirmationUrl ? `╠════════════════════════════════════════════════════════════════════════╣
║  🔗 Confirmation Link:                                                 ║
║  ${confirmationUrl.padEnd(70)}║\n` : ""}╠════════════════════════════════════════════════════════════════════════╣
║  Status: ✅ SENT SUCCESSFULLY - Awaiting patient confirmation          ║
╚════════════════════════════════════════════════════════════════════════╝
  `);

  // Update message status
  await db.scheduledMessage.update({
    where: { id: messageId },
    data: {
      isSent: true,
      status: "SENT",
      sentAt: new Date(),
    },
  });

  return true;
}

/**
 * Automatically process all pending messages that are due (sendAt <= today)
 * This is the automatic message sending system
 */
export async function autoProcessDueMessages(): Promise<number> {
  // Get end of today to include all messages due today
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const pendingMessages = await db.scheduledMessage.findMany({
    where: {
      status: "PENDING",
      sendAt: {
        lte: endOfToday, // All messages due today or earlier
      },
      patient: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    orderBy: {
      sendAt: "asc",
    },
  });

  let sentCount = 0;

  for (const message of pendingMessages) {
    const success = await sendMessage(message.id);
    if (success) {
      sentCount++;
    }
  }

  if (sentCount > 0) {
    console.log(`[AutoProcess] Automatically sent ${sentCount} due messages`);
  }

  return sentCount;
}

/**
 * Process all pending messages (manual trigger - now calls auto process)
 */
export async function processPendingMessages(): Promise<number> {
  return autoProcessDueMessages();
}

/**
 * Regenerate messages for a patient (e.g., when procedure date changes)
 */
export async function regenerateMessagesForPatient(
  patientId: string
): Promise<number> {
  // Delete all unsent messages
  await db.scheduledMessage.deleteMany({
    where: {
      patientId,
      isSent: false,
    },
  });

  // Fetch patient and regenerate
  const patient = await db.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    throw new Error(`Patient not found: ${patientId}`);
  }

  return generateMessagesForPatient(patient);
}

/**
 * Handle patient confirmation response
 */
export async function handlePatientResponse(
  token: string,
  response: "CONFIRMED" | "REJECTED",
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const message = await db.scheduledMessage.findUnique({
    where: { confirmationToken: token },
    include: { patient: true },
  });

  if (!message) {
    return { success: false, error: "Invalid confirmation link" };
  }

  if (message.patientResponse) {
    return { success: false, error: "You have already responded to this message" };
  }

  const updateData: {
    patientResponse: string;
    status: string;
    patientNote?: string;
    confirmedAt?: Date;
    rejectedAt?: Date;
  } = {
    patientResponse: response,
    status: response,
    ...(note && { patientNote: note }),
  };

  if (response === "CONFIRMED") {
    updateData.confirmedAt = new Date();
  } else {
    updateData.rejectedAt = new Date();
  }

  await db.scheduledMessage.update({
    where: { id: message.id },
    data: updateData,
  });

  // If rejected, update patient status to AT_RISK
  if (response === "REJECTED") {
    await db.patient.update({
      where: { id: message.patientId },
      data: { status: "AT_RISK" },
    });
  }

  console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║  ✅ PATIENT RESPONSE RECEIVED                                          ║
╠════════════════════════════════════════════════════════════════════════╣
║  Patient: ${message.patient.name.padEnd(61)}║
║  Response: ${response.padEnd(60)}║
║  Task: ${(message.taskDescription || "N/A").substring(0, 63).padEnd(63)}║
${note ? `║  Note: ${note.substring(0, 64).padEnd(64)}║\n` : ""}╚════════════════════════════════════════════════════════════════════════╝
  `);

  return { success: true };
}
