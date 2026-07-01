-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('perder_gordura', 'ganhar_massa_muscular', 'definir_corpo', 'aumentar_forca', 'melhorar_condicionamento', 'melhorar_saude', 'manter_peso', 'ganhar_resistencia', 'melhorar_mobilidade');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('sedentario', 'pouco_ativo', 'moderadamente_ativo', 'ativo', 'muito_ativo', 'atleta');

-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('iniciante', 'intermediario', 'avancado', 'especialista');

-- CreateEnum
CREATE TYPE "Injury" AS ENUM ('nenhuma', 'joelho', 'ombro', 'coluna', 'lombar', 'cervical', 'quadril', 'cotovelo', 'punho', 'tornozelo', 'tendinite', 'lesao_muscular', 'hernia_de_disco', 'outra');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'nonBinary', 'nonInformation');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "targetWeight" DOUBLE PRECISION,
    "goal" "Goal" NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL,
    "experience" "Experience" NOT NULL,
    "injuries" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
