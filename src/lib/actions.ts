"use server";

// LinkCare - Server Actions
// All database mutations go through here (no API routes needed)

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { generateMessagesForPatient, regenerateMessagesForPatient, processPendingMessages, handlePatientResponse, autoProcessDueMessages } from "./message-engine";
import { initializeDemoData, resetDemoData } from "./demo-init";
import type { 
  CreatePatientInput, 
  PatientStatus, 
  DashboardStats, 
  PatientWithMessages, 
  MessageStatus,
  ConfirmationPageData,
  UpcomingReminder,
  PatientResponse
} from "./types";
import { startOfDay, addDays, differenceInDays } from "date-fns";

// ============================================
// PATIENT ACTIONS
// ============================================

/**
 * Create a new patient and automatically generate their message schedule
 */
export async function createPatient(input: CreatePatientInput): Promise<{ success: boolean; patientId?: string; error?: string }> {
  try {
    // Create the patient with all risk factors
    const patient = await db.patient.create({
      data: {
        name: input.name,
        phone: input.phone,
        procedureDate: input.procedureDate,
        procedureType: input.procedureType,
        // Metabolic & Endocrine
        riskDiabetesType1: input.riskDiabetesType1,
        riskDiabetesType2: input.riskDiabetesType2,
        riskThyroidDisorder: input.riskThyroidDisorder,
        // Cardiovascular
        riskBloodThinner: input.riskBloodThinner,
        riskAntiplatelet: input.riskAntiplatelet,
        riskHypertension: input.riskHypertension,
        riskHeartFailure: input.riskHeartFailure,
        riskAtrialFib: input.riskAtrialFib,
        riskPacemaker: input.riskPacemaker,
        // Respiratory
        riskAsthma: input.riskAsthma,
        riskCOPD: input.riskCOPD,
        riskSleepApnoea: input.riskSleepApnoea,
        // Renal & Hepatic
        riskKidneyDisease: input.riskKidneyDisease,
        riskLiverDisease: input.riskLiverDisease,
        // Allergies
        riskLatexAllergy: input.riskLatexAllergy,
        riskContrastAllergy: input.riskContrastAllergy,
        riskDrugAllergies: input.riskDrugAllergies,
        // Lifestyle
        riskSmoker: input.riskSmoker,
        riskAlcohol: input.riskAlcohol,
        riskObesity: input.riskObesity,
        // Other Clinical
        riskImmunosuppressed: input.riskImmunosuppressed,
        riskPregnancy: input.riskPregnancy,
        riskFrailty: input.riskFrailty,
        riskCognitiveImpair: input.riskCognitiveImpair,
        status: "ON_TRACK",
      },
    });

    // Generate scheduled messages based on protocol templates
    await generateMessagesForPatient(patient);

    revalidatePath("/");
    revalidatePath("/patients");
    revalidatePath("/reminders");

    return { success: true, patientId: patient.id };
  } catch (error) {
    console.error("[Action] Failed to create patient:", error);
    return { success: false, error: "Failed to create patient" };
  }
}

/**
 * Update patient information
 */
export async function updatePatient(
  id: string,
  data: Partial<CreatePatientInput> & { status?: PatientStatus }
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingPatient = await db.patient.findUnique({ where: { id } });
    
    if (!existingPatient) {
      return { success: false, error: "Patient not found" };
    }

    const procedureDateChanged = 
      data.procedureDate && 
      data.procedureDate.getTime() !== existingPatient.procedureDate.getTime();

    // Check if any risk factor changed
    const riskFactorKeys = [
      'riskDiabetesType1', 'riskDiabetesType2', 'riskThyroidDisorder',
      'riskBloodThinner', 'riskAntiplatelet', 'riskHypertension', 
      'riskHeartFailure', 'riskAtrialFib', 'riskPacemaker',
      'riskAsthma', 'riskCOPD', 'riskSleepApnoea',
      'riskKidneyDisease', 'riskLiverDisease',
      'riskLatexAllergy', 'riskContrastAllergy', 'riskDrugAllergies',
      'riskSmoker', 'riskAlcohol', 'riskObesity',
      'riskImmunosuppressed', 'riskPregnancy', 'riskFrailty', 'riskCognitiveImpair'
    ] as const;

    const riskFactorsChanged = riskFactorKeys.some(key => 
      data[key] !== undefined && data[key] !== existingPatient[key]
    );

    await db.patient.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.procedureDate && { procedureDate: data.procedureDate }),
        ...(data.procedureType && { procedureType: data.procedureType }),
        ...(data.status && { status: data.status }),
        // Update risk factors if provided
        ...Object.fromEntries(
          riskFactorKeys
            .filter(key => data[key] !== undefined)
            .map(key => [key, data[key]])
        ),
      },
    });

    // Regenerate messages if procedure date or risk factors changed
    if (procedureDateChanged || riskFactorsChanged) {
      await regenerateMessagesForPatient(id);
    }

    revalidatePath("/");
    revalidatePath("/patients");
    revalidatePath("/reminders");
    revalidatePath(`/patients/${id}`);

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to update patient:", error);
    return { success: false, error: "Failed to update patient" };
  }
}

/**
 * Update patient status
 */
export async function updatePatientStatus(
  id: string,
  status: PatientStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.patient.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/patients");
    revalidatePath("/reminders");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to update patient status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Delete a patient and their messages
 */
export async function deletePatient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.patient.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/patients");
    revalidatePath("/reminders");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to delete patient:", error);
    return { success: false, error: "Failed to delete patient" };
  }
}

// ============================================
// DATA FETCHING
// ============================================

/**
 * Get all patients with their scheduled messages
 * Also auto-processes any due messages
 */
export async function getPatients(): Promise<PatientWithMessages[]> {
  try {
    // Initialize demo data if needed (first visit on Vercel)
    await initializeDemoData();

    // Auto-process any due messages before fetching
    await autoProcessDueMessages();

    const patients = await db.patient.findMany({
      include: {
        scheduledMessages: {
          orderBy: { sendAt: "asc" },
        },
      },
      orderBy: { procedureDate: "asc" },
    });

    return patients.map((p) => ({
      ...p,
      status: p.status as PatientStatus,
      scheduledMessages: p.scheduledMessages.map((m) => ({
        ...m,
        status: m.status as MessageStatus,
        patientResponse: m.patientResponse as PatientResponse,
      })),
    }));
  } catch (error) {
    console.error("[Actions] Database error in getPatients:", error);
    // Return empty array instead of crashing
    return [];
  }
}

/**
 * Get a single patient by ID
 */
export async function getPatientById(id: string): Promise<PatientWithMessages | null> {
  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      scheduledMessages: {
        orderBy: { sendAt: "asc" },
      },
    },
  });

  if (!patient) return null;

  return {
    ...patient,
    status: patient.status as PatientStatus,
    scheduledMessages: patient.scheduledMessages.map((m) => ({
      ...m,
      status: m.status as MessageStatus,
      patientResponse: m.patientResponse as PatientResponse,
    })),
  };
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Initialize demo data if needed (first visit on Vercel)
    await initializeDemoData();

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);

    const [
      totalPatients,
      onTrack,
      atRisk,
      cancelled,
      pendingMessages,
      sentMessages,
      confirmedMessages,
      rejectedMessages,
      awaitingResponse,
      upcomingProcedures,
    ] = await Promise.all([
      db.patient.count(),
      db.patient.count({ where: { status: "ON_TRACK" } }),
      db.patient.count({ where: { status: "AT_RISK" } }),
      db.patient.count({ where: { status: "CANCELLED" } }),
      db.scheduledMessage.count({ where: { status: "PENDING" } }),
      db.scheduledMessage.count({ where: { status: "SENT" } }),
      db.scheduledMessage.count({ where: { status: "CONFIRMED" } }),
      db.scheduledMessage.count({ where: { status: "REJECTED" } }),
      db.scheduledMessage.count({
        where: {
          status: "SENT",
          requiresConfirmation: true,
          patientResponse: null,
        }
      }),
      db.patient.count({
        where: {
          procedureDate: {
            gte: today,
            lte: nextWeek,
          },
          status: { not: "CANCELLED" },
        },
      }),
    ]);

    return {
      totalPatients,
      onTrack,
      atRisk,
      cancelled,
      pendingMessages,
      sentMessages,
      confirmedMessages,
      rejectedMessages,
      awaitingResponse,
      upcomingProcedures,
    };
  } catch (error) {
    console.error("[Actions] Database error in getDashboardStats:", error);
    // Return zero values instead of crashing
    return {
      totalPatients: 0,
      onTrack: 0,
      atRisk: 0,
      cancelled: 0,
      pendingMessages: 0,
      sentMessages: 0,
      confirmedMessages: 0,
      rejectedMessages: 0,
      awaitingResponse: 0,
      upcomingProcedures: 0,
    };
  }
}

/**
 * Get upcoming reminders for all patients
 */
export async function getUpcomingReminders(): Promise<UpcomingReminder[]> {
  try {
    // Initialize demo data if needed (first visit on Vercel)
    await initializeDemoData();

    const today = new Date();

    const messages = await db.scheduledMessage.findMany({
      where: {
        patient: {
          status: { not: "CANCELLED" },
        },
      },
      include: {
        patient: true,
      },
      orderBy: [
        { sendAt: "asc" },
      ],
    });

    return messages.map((m) => ({
      id: m.id,
      patientId: m.patientId,
      patientName: m.patient.name,
      procedureType: m.patient.procedureType,
      procedureDate: m.patient.procedureDate,
      sendAt: m.sendAt,
      messageContent: m.messageContent,
      taskDescription: m.taskDescription,
      status: m.status as MessageStatus,
      patientResponse: m.patientResponse as PatientResponse,
      category: m.category,
      niceReference: m.niceReference,
      daysUntilProcedure: differenceInDays(m.patient.procedureDate, today),
      daysUntilSend: differenceInDays(m.sendAt, today),
      confirmationToken: m.confirmationToken,
    }));
  } catch (error) {
    console.error("[Actions] Database error in getUpcomingReminders:", error);
    // Return empty array instead of crashing
    return [];
  }
}

// ============================================
// MESSAGE ACTIONS
// ============================================

/**
 * Send a specific message (mock)
 */
export async function sendMessageAction(messageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { sendMessage } = await import("./message-engine");
    const success = await sendMessage(messageId);
    
    revalidatePath("/");
    revalidatePath("/reminders");
    
    return { success };
  } catch (error) {
    console.error("[Action] Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Process all pending messages
 */
export async function processAllPendingMessages(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const count = await processPendingMessages();
    
    revalidatePath("/");
    revalidatePath("/reminders");
    
    return { success: true, count };
  } catch (error) {
    console.error("[Action] Failed to process messages:", error);
    return { success: false, count: 0, error: "Failed to process messages" };
  }
}

/**
 * Update message status
 */
export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.scheduledMessage.update({
      where: { id: messageId },
      data: { 
        status,
        ...(status === "SENT" && { isSent: true, sentAt: new Date() }),
      },
    });

    revalidatePath("/");
    revalidatePath("/reminders");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to update message status:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

// ============================================
// PATIENT CONFIRMATION ACTIONS
// ============================================

/**
 * Get confirmation page data by token
 */
export async function getConfirmationData(token: string): Promise<ConfirmationPageData | null> {
  const message = await db.scheduledMessage.findUnique({
    where: { confirmationToken: token },
    include: { patient: true },
  });

  if (!message) return null;

  const now = new Date();
  const isExpired = message.patient.procedureDate < now;
  const isAlreadyResponded = !!message.patientResponse;

  return {
    message: {
      id: message.id,
      taskDescription: message.taskDescription,
      messageContent: message.messageContent,
      sendAt: message.sendAt,
      status: message.status as MessageStatus,
      patientResponse: message.patientResponse as PatientResponse,
      niceReference: message.niceReference,
      category: message.category,
    },
    patient: {
      name: message.patient.name,
      procedureType: message.patient.procedureType,
      procedureDate: message.patient.procedureDate,
    },
    isExpired,
    isAlreadyResponded,
  };
}

/**
 * Submit patient confirmation response
 */
export async function submitConfirmation(
  token: string,
  response: "CONFIRMED" | "REJECTED",
  note?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await handlePatientResponse(token, response, note);
    
    revalidatePath("/");
    revalidatePath("/reminders");
    
    return result;
  } catch (error) {
    console.error("[Action] Failed to submit confirmation:", error);
    return { success: false, error: "Failed to submit response" };
  }
}

// ============================================
// DEMO MANAGEMENT
// ============================================

/**
 * Reset demo to initial state
 * Deletes all patients and creates fresh demo data
 */
export async function resetDemo(): Promise<{ success: boolean; error?: string }> {
  try {
    await resetDemoData();
    
    revalidatePath("/");
    revalidatePath("/demo");
    revalidatePath("/demo/reminders");
    
    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to reset demo:", error);
    return { success: false, error: "Failed to reset demo" };
  }
}
