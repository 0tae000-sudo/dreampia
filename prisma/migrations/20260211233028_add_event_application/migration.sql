-- CreateTable
CREATE TABLE "EventApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schoolName" TEXT NOT NULL,
    "schoolLevel" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detailAddress" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "managerPosition" TEXT NOT NULL,
    "managerPhone" TEXT NOT NULL,
    "managerEmail" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminPosition" TEXT NOT NULL,
    "adminPhone" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "targetGrades" JSONB NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "studentChangeType" TEXT NOT NULL,
    "mentorRequestCount" INTEGER NOT NULL,
    "mentorPreference" TEXT,
    "providedItems" JSONB NOT NULL,
    "expectedQuote" TEXT,
    "inquiry" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventTimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationId" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "startHour" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    CONSTRAINT "EventTimeSlot_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "EventApplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
