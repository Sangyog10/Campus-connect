/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "semester" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notice" ALTER COLUMN "semester" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "semester" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "semester" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");
