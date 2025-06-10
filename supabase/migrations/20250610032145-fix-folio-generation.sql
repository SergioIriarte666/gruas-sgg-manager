
-- Corregir la función generate_folio para evitar ambigüedad de columnas
CREATE OR REPLACE FUNCTION public.generate_folio(prefix text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    next_number INTEGER;
    folio TEXT;
BEGIN
    -- Obtener el siguiente número secuencial
    SELECT COALESCE(MAX(CAST(SUBSTRING(all_folios.folio FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
    INTO next_number
    FROM (
        SELECT s.folio FROM public.servicios s WHERE s.folio LIKE prefix || '%'
        UNION ALL
        SELECT c.folio FROM public.cierres c WHERE c.folio LIKE prefix || '%'
        UNION ALL
        SELECT f.folio FROM public.facturas f WHERE f.folio LIKE prefix || '%'
    ) AS all_folios;
    
    -- Formatear el folio con ceros a la izquierda
    folio := prefix || LPAD(next_number::TEXT, 6, '0');
    
    RETURN folio;
END;
$function$;
