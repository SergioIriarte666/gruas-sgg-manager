
-- Actualizar la función generate_folio para fijar el search_path
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
    SELECT COALESCE(MAX(CAST(SUBSTRING(folio FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
    INTO next_number
    FROM (
        SELECT folio FROM public.servicios WHERE folio LIKE prefix || '%'
        UNION ALL
        SELECT folio FROM public.cierres WHERE folio LIKE prefix || '%'
        UNION ALL
        SELECT folio FROM public.facturas WHERE folio LIKE prefix || '%'
    ) AS all_folios;
    
    -- Formatear el folio con ceros a la izquierda
    folio := prefix || LPAD(next_number::TEXT, 6, '0');
    
    RETURN folio;
END;
$function$;

-- También actualizar update_updated_at_column para consistencia
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;
