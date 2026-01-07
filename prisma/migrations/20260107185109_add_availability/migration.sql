/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fridayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayEnabled` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "dayOfWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fridayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "fridayEnd" TEXT,
ADD COLUMN     "fridayStart" TEXT,
ADD COLUMN     "mondayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "mondayEnd" TEXT,
ADD COLUMN     "mondayStart" TEXT,
ADD COLUMN     "saturdayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "saturdayEnd" TEXT,
ADD COLUMN     "saturdayStart" TEXT,
ADD COLUMN     "sundayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "sundayEnd" TEXT,
ADD COLUMN     "sundayStart" TEXT,
ADD COLUMN     "thursdayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "thursdayEnd" TEXT,
ADD COLUMN     "thursdayStart" TEXT,
ADD COLUMN     "tuesdayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "tuesdayEnd" TEXT,
ADD COLUMN     "tuesdayStart" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "wednesdayEnabled" BOOLEAN NOT NULL,
ADD COLUMN     "wednesdayEnd" TEXT,
ADD COLUMN     "wednesdayStart" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Availability_userId_key" ON "Availability"("userId");
