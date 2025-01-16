/*
  Warnings:

  - Changed the type of `section` on the `Notes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `section` on the `Notice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `section` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Section" AS ENUM ('AB', 'CD');

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "section",
ADD COLUMN     "section" "Section" NOT NULL;

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "section",
ADD COLUMN     "section" "Section" NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "section",
ADD COLUMN     "section" "Section" NOT NULL;
