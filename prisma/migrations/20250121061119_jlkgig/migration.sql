-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Faculty" ADD VALUE 'AGRICULTURE';
ALTER TYPE "Faculty" ADD VALUE 'ELECTRONICS';
ALTER TYPE "Faculty" ADD VALUE 'ARCHITECTURE';

-- AlterEnum
ALTER TYPE "Section" ADD VALUE 'EF';

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "section" "Section";

-- AlterTable
ALTER TABLE "InternalMarks" ADD COLUMN     "section" "Section";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "section" "Section";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "section" "Section";
