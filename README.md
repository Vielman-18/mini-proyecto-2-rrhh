# Mini Proyecto 2 – Sistema de Gestión de RRHH y Nómina

## Integrantes
- Vielman-18 (Coordinador)
- Marvin204
- jruanos7
- rrivera004
- Eliasif

## URLs de despliegue
- **Backend**: https://rrhh-nomina-backend.onrender.com
- **Swagger API**: https://rrhh-nomina-backend.onrender.com/api
- **Base de datos**: PostgreSQL en Neon

## Cómo ejecutar localmente

### Backend
cd backend
npm install
npm run start:dev

### Variables de entorno
Crear archivo `.env` en la carpeta `backend`:
DATABASE_URL="postgresql://..."
JWT_SECRET="rrhh-nomina-secret-key-2026"

## PRs principales
- #7 AUTH: implementar registro, login y roles
- #15 EMP: implementar CRUD empleados
- #17 ACAD: mover academico a carpeta backend correcta
- #19 EXP: modulo expediente documentos
- #20 VAL: implementar validacion expediente
- #21 SETUP: configurar base de datos PostgreSQL Neon
- #22 SETUP: agregar archivos faltantes
- #23 SETUP: fix archivos faltantes
- #24 REP: implementar reportes nomina y expedientes

## Stack tecnológico
- Backend: NestJS + TypeScript
- Base de datos: PostgreSQL + Prisma
- Autenticación: JWT + Passport
- Documentación: Swagger