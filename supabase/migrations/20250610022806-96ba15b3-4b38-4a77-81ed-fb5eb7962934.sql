
-- Crear tabla de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razon_social TEXT NOT NULL,
  rut TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  direccion TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de grúas
CREATE TABLE public.gruas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patente TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Liviana', 'Mediana', 'Pesada')),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de operadores
CREATE TABLE public.operadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  rut TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL,
  numero_licencia TEXT NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de tipos de servicio
CREATE TABLE public.tipos_servicio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de servicios
CREATE TABLE public.servicios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  folio TEXT NOT NULL UNIQUE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  orden_compra TEXT,
  marca_vehiculo TEXT NOT NULL,
  modelo_vehiculo TEXT NOT NULL,
  patente TEXT NOT NULL,
  ubicacion_origen TEXT NOT NULL,
  ubicacion_destino TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  grua_id UUID NOT NULL REFERENCES public.gruas(id),
  operador_id UUID NOT NULL REFERENCES public.operadores(id),
  tipo_servicio_id UUID NOT NULL REFERENCES public.tipos_servicio(id),
  estado TEXT NOT NULL DEFAULT 'en_curso' CHECK (estado IN ('en_curso', 'cerrado', 'facturado')),
  observaciones TEXT,
  cierre_id UUID,
  factura_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de cierres
CREATE TABLE public.cierres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folio TEXT NOT NULL UNIQUE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  facturado BOOLEAN NOT NULL DEFAULT false,
  factura_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de facturas
CREATE TABLE public.facturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folio TEXT NOT NULL UNIQUE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE NOT NULL,
  cierre_id UUID NOT NULL REFERENCES public.cierres(id),
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'vencida')),
  fecha_pago DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar foreign keys faltantes
ALTER TABLE public.servicios ADD CONSTRAINT fk_servicios_cierre 
  FOREIGN KEY (cierre_id) REFERENCES public.cierres(id);

ALTER TABLE public.servicios ADD CONSTRAINT fk_servicios_factura 
  FOREIGN KEY (factura_id) REFERENCES public.facturas(id);

ALTER TABLE public.cierres ADD CONSTRAINT fk_cierres_factura 
  FOREIGN KEY (factura_id) REFERENCES public.facturas(id);

-- Crear índices para mejorar performance
CREATE INDEX idx_servicios_cliente_id ON public.servicios(cliente_id);
CREATE INDEX idx_servicios_grua_id ON public.servicios(grua_id);
CREATE INDEX idx_servicios_operador_id ON public.servicios(operador_id);
CREATE INDEX idx_servicios_tipo_servicio_id ON public.servicios(tipo_servicio_id);
CREATE INDEX idx_servicios_estado ON public.servicios(estado);
CREATE INDEX idx_servicios_fecha ON public.servicios(fecha);
CREATE INDEX idx_facturas_estado ON public.facturas(estado);
CREATE INDEX idx_facturas_fecha_vencimiento ON public.facturas(fecha_vencimiento);

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gruas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cierres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS básicas (permitir todo por ahora)
CREATE POLICY "Permitir todo en clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en gruas" ON public.gruas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en operadores" ON public.operadores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en tipos_servicio" ON public.tipos_servicio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en servicios" ON public.servicios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en cierres" ON public.cierres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en facturas" ON public.facturas FOR ALL USING (true) WITH CHECK (true);

-- Insertar tipos de servicio básicos
INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES
('Traslado de Vehículos', 'Servicio de traslado de vehículos livianos y medianos'),
('Rescate de Vehículos', 'Rescate de vehículos accidentados o varados'),
('Traslado de Maquinaria', 'Traslado de maquinaria pesada y equipos industriales'),
('Servicio de Emergencia', 'Servicios de grúa las 24 horas para emergencias'),
('Traslado Especial', 'Servicios especializados para vehículos de lujo o clásicos');

-- Insertar datos de ejemplo para clientes
INSERT INTO public.clientes (razon_social, rut, telefono, email, direccion) VALUES
('Transportes López S.A.', '96.123.456-7', '+56 9 8765 4321', 'contacto@transporteslopez.cl', 'Av. Industrial 1234, Santiago'),
('Constructora San Miguel Ltda.', '76.234.567-8', '+56 9 7654 3210', 'ventas@sanmiguel.cl', 'Calle Los Aromos 567, Las Condes'),
('Rent a Car Premium', '77.345.678-9', '+56 9 6543 2109', 'info@rentacarpremium.cl', 'Av. Providencia 890, Providencia'),
('Distribuidora Central S.A.', '96.456.789-0', '+56 9 5432 1098', 'admin@distribuidoracentral.cl', 'Av. Maipú 2345, Maipú');

-- Insertar datos de ejemplo para grúas
INSERT INTO public.gruas (patente, marca, modelo, tipo) VALUES
('BDXY12', 'Mercedes-Benz', 'Atego 1725', 'Mediana'),
('CFGH34', 'Volvo', 'FL 240', 'Pesada'),
('HJKL56', 'Isuzu', 'NPR 75L', 'Liviana'),
('MNOP78', 'Scania', 'P 280', 'Pesada'),
('QRST90', 'Ford', 'F-350', 'Liviana');

-- Insertar datos de ejemplo para operadores
INSERT INTO public.operadores (nombre_completo, rut, telefono, numero_licencia) VALUES
('Carlos Rodríguez García', '12.345.678-9', '+56 9 8888 7777', 'A2-1234567'),
('Ana María Pérez Silva', '23.456.789-0', '+56 9 7777 6666', 'A3-2345678'),
('José Manuel Torres López', '34.567.890-1', '+56 9 6666 5555', 'A2-3456789'),
('Patricia Morales Vega', '45.678.901-2', '+56 9 5555 4444', 'A3-4567890'),
('Roberto Silva Hernández', '56.789.012-3', '+56 9 4444 3333', 'A2-5678901');

-- Función para generar folios automáticamente
CREATE OR REPLACE FUNCTION generate_folio(prefix TEXT)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gruas_updated_at BEFORE UPDATE ON public.gruas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operadores_updated_at BEFORE UPDATE ON public.operadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tipos_servicio_updated_at BEFORE UPDATE ON public.tipos_servicio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON public.servicios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cierres_updated_at BEFORE UPDATE ON public.cierres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON public.facturas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
