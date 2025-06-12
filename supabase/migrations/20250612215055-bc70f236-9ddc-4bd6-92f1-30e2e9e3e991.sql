
-- Limpieza completa corregida - eliminando primero las referencias
-- Primero eliminar las referencias de foreign keys, luego los registros

-- 1. Limpiar referencias en servicios (eliminar cierre_id y factura_id)
UPDATE public.servicios SET cierre_id = NULL, factura_id = NULL;

-- 2. Limpiar referencias en cierres (eliminar factura_id)
UPDATE public.cierres SET factura_id = NULL;

-- 3. Ahora eliminar facturas
DELETE FROM public.facturas;

-- 4. Eliminar servicios
DELETE FROM public.servicios;

-- 5. Eliminar cierres
DELETE FROM public.cierres;

-- 6. Eliminar datos maestros
DELETE FROM public.clientes;
DELETE FROM public.gruas;
DELETE FROM public.operadores;
DELETE FROM public.tipos_servicio;

-- 7. Verificar que todas las tablas estén vacías
SELECT 
  'facturas' as tabla, COUNT(*) as registros FROM public.facturas
UNION ALL
SELECT 
  'servicios' as tabla, COUNT(*) as registros FROM public.servicios
UNION ALL
SELECT 
  'cierres' as tabla, COUNT(*) as registros FROM public.cierres
UNION ALL
SELECT 
  'clientes' as tabla, COUNT(*) as registros FROM public.clientes
UNION ALL
SELECT 
  'gruas' as tabla, COUNT(*) as registros FROM public.gruas
UNION ALL
SELECT 
  'operadores' as tabla, COUNT(*) as registros FROM public.operadores
UNION ALL
SELECT 
  'tipos_servicio' as tabla, COUNT(*) as registros FROM public.tipos_servicio;
