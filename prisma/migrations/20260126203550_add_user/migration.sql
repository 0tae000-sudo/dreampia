-- CreateTable
CREATE TABLE "User" (
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
    "job1" TEXT,
    "job2" TEXT,
    "job3" TEXT,
    "role" TEXT,
    "isTeacher" BOOLEAN,
    "isMentor" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
