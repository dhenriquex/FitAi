-- CreateTable
CREATE TABLE "ExerciseLibraryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "gifUrl" TEXT NOT NULL,
    "secondaryMuscles" TEXT[],
    "instructions" TEXT[],
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ExerciseLibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExerciseLibraryItem_bodyPart_idx" ON "ExerciseLibraryItem"("bodyPart");

-- CreateIndex
CREATE INDEX "ExerciseLibraryItem_target_idx" ON "ExerciseLibraryItem"("target");

-- CreateIndex
CREATE INDEX "ExerciseLibraryItem_equipment_idx" ON "ExerciseLibraryItem"("equipment");
