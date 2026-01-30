-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "procedureDate" DATETIME NOT NULL,
    "procedureType" TEXT NOT NULL,
    "riskDiabetesType1" BOOLEAN NOT NULL DEFAULT false,
    "riskDiabetesType2" BOOLEAN NOT NULL DEFAULT false,
    "riskThyroidDisorder" BOOLEAN NOT NULL DEFAULT false,
    "riskBloodThinner" BOOLEAN NOT NULL DEFAULT false,
    "riskAntiplatelet" BOOLEAN NOT NULL DEFAULT false,
    "riskHypertension" BOOLEAN NOT NULL DEFAULT false,
    "riskHeartFailure" BOOLEAN NOT NULL DEFAULT false,
    "riskAtrialFib" BOOLEAN NOT NULL DEFAULT false,
    "riskPacemaker" BOOLEAN NOT NULL DEFAULT false,
    "riskAsthma" BOOLEAN NOT NULL DEFAULT false,
    "riskCOPD" BOOLEAN NOT NULL DEFAULT false,
    "riskSleepApnoea" BOOLEAN NOT NULL DEFAULT false,
    "riskKidneyDisease" BOOLEAN NOT NULL DEFAULT false,
    "riskLiverDisease" BOOLEAN NOT NULL DEFAULT false,
    "riskLatexAllergy" BOOLEAN NOT NULL DEFAULT false,
    "riskContrastAllergy" BOOLEAN NOT NULL DEFAULT false,
    "riskDrugAllergies" BOOLEAN NOT NULL DEFAULT false,
    "riskSmoker" BOOLEAN NOT NULL DEFAULT false,
    "riskAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "riskObesity" BOOLEAN NOT NULL DEFAULT false,
    "riskImmunosuppressed" BOOLEAN NOT NULL DEFAULT false,
    "riskPregnancy" BOOLEAN NOT NULL DEFAULT false,
    "riskFrailty" BOOLEAN NOT NULL DEFAULT false,
    "riskCognitiveImpair" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ON_TRACK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProtocolTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "procedureType" TEXT NOT NULL,
    "daysOffset" INTEGER NOT NULL,
    "messageContent" TEXT NOT NULL,
    "taskDescription" TEXT,
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "niceReference" TEXT,
    "requiredRiskTag" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'general'
);

-- CreateTable
CREATE TABLE "ScheduledMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "sendAt" DATETIME NOT NULL,
    "messageContent" TEXT NOT NULL,
    "taskDescription" TEXT,
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" DATETIME,
    "confirmationToken" TEXT,
    "confirmedAt" DATETIME,
    "rejectedAt" DATETIME,
    "patientResponse" TEXT,
    "patientNote" TEXT,
    "niceReference" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScheduledMessage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Patient_procedureDate_idx" ON "Patient"("procedureDate");

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "ProtocolTemplate_procedureType_idx" ON "ProtocolTemplate"("procedureType");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolTemplate_procedureType_daysOffset_requiredRiskTag_key" ON "ProtocolTemplate"("procedureType", "daysOffset", "requiredRiskTag");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledMessage_confirmationToken_key" ON "ScheduledMessage"("confirmationToken");

-- CreateIndex
CREATE INDEX "ScheduledMessage_sendAt_idx" ON "ScheduledMessage"("sendAt");

-- CreateIndex
CREATE INDEX "ScheduledMessage_patientId_idx" ON "ScheduledMessage"("patientId");

-- CreateIndex
CREATE INDEX "ScheduledMessage_status_idx" ON "ScheduledMessage"("status");

-- CreateIndex
CREATE INDEX "ScheduledMessage_confirmationToken_idx" ON "ScheduledMessage"("confirmationToken");
