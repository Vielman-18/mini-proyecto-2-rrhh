/*
  Warnings:

  - You are about to drop the column `archivo_binario` on the `documentos` table. All the data in the column will be lost.
  - You are about to drop the column `salario_base` on the `puestos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documentos" DROP COLUMN "archivo_binario";

-- AlterTable
ALTER TABLE "puestos" DROP COLUMN "salario_base";
