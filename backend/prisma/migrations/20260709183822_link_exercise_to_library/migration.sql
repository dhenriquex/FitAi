/*
  Warnings:

  - Added the required column `technique` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "exerciseLibraryItemId" TEXT,
ADD COLUMN     "technique" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExerciseLibraryItem" ALTER COLUMN "gifUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exerciseLibraryItemId_fkey" FOREIGN KEY ("exerciseLibraryItemId") REFERENCES "ExerciseLibraryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
