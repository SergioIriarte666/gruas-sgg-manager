
-- Corregir la función generate_folio para manejar folios con formato no estándar
DROP FUNCTION IF EXISTS public.generate_folio(text);

CREATE OR REPLACE FUNCTION public.generate_folio(prefix text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    next_number INTEGER;
    folio TEXT;
    extracted_number TEXT;
BEGIN
    -- Obtener el siguiente número secuencial usando aliases únicos y manejo de errores
    WITH all_folios AS (
        SELECT s.folio as folio_value FROM public.servicios s WHERE s.folio LIKE prefix || '%'
        UNION ALL
        SELECT c.folio as folio_value FROM public.cierres c WHERE c.folio LIKE prefix || '%'
        UNION ALL
        SELECT f.folio as folio_value FROM public.facturas f WHERE f.folio LIKE prefix || '%'
    ),
    valid_numbers AS (
        SELECT 
            CASE 
                WHEN SUBSTRING(all_folios.folio_value FROM LENGTH(prefix) + 1) ~ '^[0-9]+$' 
                THEN CAST(SUBSTRING(all_folios.folio_value FROM LENGTH(prefix) + 1) AS INTEGER)
                ELSE 0
            END as number_part
        FROM all_folios
        WHERE LENGTH(all_folios.folio_value) > LENGTH(prefix)
    )
    SELECT COALESCE(MAX(number_part), 0) + 1
    INTO next_number
    FROM valid_numbers;
    
    -- Formatear el folio con ceros a la izquierda
    folio := prefix || LPAD(next_number::TEXT, 6, '0');
    
    RETURN folio;
END;
$function$;
