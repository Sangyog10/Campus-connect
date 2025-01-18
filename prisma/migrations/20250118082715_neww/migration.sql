/*
  Warnings:

  - Added the required column `updatedAt` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'student';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'teacher';

-- CreateIndex
CREATE INDEX "Attendance_teacherId_subjectId_studentId_idx" ON "Attendance"("teacherId", "subjectId", "studentId");
