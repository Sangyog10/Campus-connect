/*
  Warnings:

  - You are about to drop the column `year` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Notice` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `subjectCode` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `semester` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "year",
ADD COLUMN     "semester" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "year",
ADD COLUMN     "semester" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "year",
ADD COLUMN     "semester" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "subjectCode",
ADD COLUMN     "faculty" "Faculty" NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL;
