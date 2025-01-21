/*
  Warnings:

  - A unique constraint covering the columns `[subjectCode,faculty,semester]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subject_subjectCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectCode_faculty_semester_key" ON "Subject"("subjectCode", "faculty", "semester");
