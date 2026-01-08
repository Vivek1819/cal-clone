-- AlterTable
ALTER TABLE "DateOverride" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT;
