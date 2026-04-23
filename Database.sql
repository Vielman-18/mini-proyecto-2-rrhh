
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'rrhh', 'empleado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dpi VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    telefono VARCHAR(20),
    salario NUMERIC(10,2) NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo'
        CHECK (estado IN ('activo', 'suspendido', 'retirado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empleado_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE SET NULL
);

CREATE TABLE registro_academico (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    fecha_graduacion DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_academico_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
        ON DELETE CASCADE
);

CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo TEXT NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documento_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_documento_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE RESTRICT
);

CREATE TABLE estado_expediente (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL
        CHECK (estado IN ('completo', 'incompleto', 'en_proceso')),
    observacion TEXT,
    fecha_revision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estado_expediente_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
        ON DELETE CASCADE
);

CREATE TABLE parametros_nomina (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    valor NUMERIC(10,2) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nomina (
    id SERIAL PRIMARY KEY,
    tipo_periodo VARCHAR(20) NOT NULL
        CHECK (tipo_periodo IN ('mensual', 'quincenal')),
    periodo VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta'
        CHECK (estado IN ('abierta', 'cerrada')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_nomina (
    id SERIAL PRIMARY KEY,
    nomina_id INT NOT NULL,
    empleado_id INT NOT NULL,
    salario_base NUMERIC(10,2) NOT NULL,
    horas_trabajadas NUMERIC(10,2) DEFAULT 0,
    horas_extra NUMERIC(10,2) DEFAULT 0,
    monto_horas_extra NUMERIC(10,2) DEFAULT 0,
    bonificaciones NUMERIC(10,2) DEFAULT 0,
    comisiones NUMERIC(10,2) DEFAULT 0,
    deducciones NUMERIC(10,2) DEFAULT 0,
    descuentos_legales NUMERIC(10,2) DEFAULT 0,
    igss NUMERIC(10,2) DEFAULT 0,
    irtra NUMERIC(10,2) DEFAULT 0,
    salario_final NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_detalle_nomina_nomina
        FOREIGN KEY (nomina_id) REFERENCES nomina(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_nomina_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
        ON DELETE CASCADE
);

CREATE TABLE ajustes_nomina (
    id SERIAL PRIMARY KEY,
    detalle_nomina_id INT NOT NULL,
    usuario_id INT NOT NULL,
    campo_modificado VARCHAR(100) NOT NULL,
    valor_anterior NUMERIC(10,2),
    valor_nuevo NUMERIC(10,2),
    motivo TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ajuste_detalle_nomina
        FOREIGN KEY (detalle_nomina_id) REFERENCES detalle_nomina(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ajuste_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE RESTRICT
);