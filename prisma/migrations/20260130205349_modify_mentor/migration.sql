/*
  Warnings:

  - You are about to drop the column `job1` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `job2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `job3` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MentorJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "MentorJob_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MentorProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MentorCareer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "period" TEXT,
    "role" TEXT,
    "company" TEXT,
    CONSTRAINT "MentorCareer_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "MentorJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MentorCertificate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "date" TEXT,
    "name" TEXT,
    "issuer" TEXT,
    CONSTRAINT "MentorCertificate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "MentorJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MentorAward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "date" TEXT,
    "title" TEXT,
    "organization" TEXT,
    CONSTRAINT "MentorAward_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "MentorJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MentorLecture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "period" TEXT,
    "title" TEXT,
    "organization" TEXT,
    CONSTRAINT "MentorLecture_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "MentorJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "howcome" TEXT,
    "graduationYear" TEXT,
    "schoolName" TEXT,
    "major" TEXT,
    "introduction" TEXT,
    "role" TEXT,
    "isTeacher" BOOLEAN,
    "isMentor" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("created_at", "email", "graduationYear", "howcome", "id", "introduction", "isMentor", "isTeacher", "major", "name", "password", "phone", "role", "schoolName", "updated_at") SELECT "created_at", "email", "graduationYear", "howcome", "id", "introduction", "isMentor", "isTeacher", "major", "name", "password", "phone", "role", "schoolName", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");
