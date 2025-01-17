/*
  Warnings:

  - You are about to drop the column `faculty` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `subjectCode` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "faculty",
ADD COLUMN     "subjectCode" TEXT NOT NULL;
