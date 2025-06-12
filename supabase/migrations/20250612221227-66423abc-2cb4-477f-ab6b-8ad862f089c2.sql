
-- Agregar campos de vencimiento a la tabla operadores
ALTER TABLE public.operadores 
ADD COLUMN vencimiento_licencia DATE,
ADD COLUMN vencimiento_examenes DATE;

-- Agregar campos de vencimiento a la tabla gruas
ALTER TABLE public.gruas 
ADD COLUMN vencimiento_permiso_circulacion DATE,
ADD COLUMN vencimiento_seguro_obligatorio DATE,
ADD COLUMN vencimiento_revision_tecnica DATE;
