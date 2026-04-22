-- CreateTable
CREATE TABLE "ajustes_nomina" (
    "id" SERIAL NOT NULL,
    "detalle_nomina_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "campo_modificado" VARCHAR(100) NOT NULL,
    "valor_anterior" DECIMAL(10,2),
    "valor_nuevo" DECIMAL(10,2),
    "motivo" TEXT,
    "fecha_cambio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ajustes_nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_nomina" (
    "id" SERIAL NOT NULL,
    "nomina_id" INTEGER NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "salario_base" DECIMAL(10,2) NOT NULL,
    "horas_trabajadas" DECIMAL(10,2) DEFAULT 0,
    "horas_extra" DECIMAL(10,2) DEFAULT 0,
    "monto_horas_extra" DECIMAL(10,2) DEFAULT 0,
    "bonificaciones" DECIMAL(10,2) DEFAULT 0,
    "comisiones" DECIMAL(10,2) DEFAULT 0,
    "deducciones" DECIMAL(10,2) DEFAULT 0,
    "descuentos_legales" DECIMAL(10,2) DEFAULT 0,
    "igss" DECIMAL(10,2) DEFAULT 0,
    "irtra" DECIMAL(10,2) DEFAULT 0,
    "salario_final" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "tipo_documento" VARCHAR(100) NOT NULL,
    "fecha_carga" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "dpi" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE,
    "direccion" TEXT,
    "telefono" VARCHAR(20),
    "salario" DECIMAL(10,2) NOT NULL,
    "cargo" VARCHAR(100),
    "departamento" VARCHAR(100),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado_expediente" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_revision" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estado_expediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nomina" (
    "id" SERIAL NOT NULL,
    "tipo_periodo" VARCHAR(20) NOT NULL,
    "periodo" VARCHAR(20) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'abierta',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametros_nomina" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parametros_nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_academico" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "institucion" VARCHAR(150) NOT NULL,
    "fecha_graduacion" DATE,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_academico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rol" VARCHAR(20) NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empleados_usuario_id_key" ON "empleados"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_dpi_key" ON "empleados"("dpi");

-- CreateIndex
CREATE UNIQUE INDEX "estado_expediente_empleado_id_key" ON "estado_expediente"("empleado_id");

-- CreateIndex
CREATE UNIQUE INDEX "parametros_nomina_nombre_key" ON "parametros_nomina"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "ajustes_nomina" ADD CONSTRAINT "fk_ajuste_detalle_nomina" FOREIGN KEY ("detalle_nomina_id") REFERENCES "detalle_nomina"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ajustes_nomina" ADD CONSTRAINT "fk_ajuste_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_nomina" ADD CONSTRAINT "fk_detalle_nomina_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_nomina" ADD CONSTRAINT "fk_detalle_nomina_nomina" FOREIGN KEY ("nomina_id") REFERENCES "nomina"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "fk_documento_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "fk_documento_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "fk_empleado_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estado_expediente" ADD CONSTRAINT "fk_estado_expediente_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "registro_academico" ADD CONSTRAINT "fk_academico_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
