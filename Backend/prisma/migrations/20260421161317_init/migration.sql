-- CreateTable
CREATE TABLE "Empleado" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "fechaNacimiento" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dpi" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "cargo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroAcademico" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "fechaGrad" TEXT NOT NULL,
    "certificacion" TEXT,

    CONSTRAINT "RegistroAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentos" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaCarga" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,

    CONSTRAINT "Documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_dpi_key" ON "Empleado"("dpi");
