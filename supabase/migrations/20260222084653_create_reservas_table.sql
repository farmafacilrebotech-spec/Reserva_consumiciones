/*
  # Tabla de reservas de eventos

  1. Nueva tabla
    - `reservas`
      - `id` (uuid, primary key)
      - `nombre` (text) - Nombre completo del cliente
      - `email` (text) - Email del cliente
      - `telefono` (text) - Teléfono de contacto
      - `copas` (integer) - Cantidad de copas/combinados
      - `cervezas` (integer) - Cantidad de cervezas/chupitos
      - `refrescos` (integer) - Cantidad de refrescos/agua
      - `vasos` (integer) - Cantidad de vasos reutilizables
      - `total` (decimal) - Total a pagar en euros
      - `created_at` (timestamp) - Fecha de creación
      
  2. Seguridad
    - Habilitar RLS en la tabla reservas
    - Política para permitir inserciones públicas (necesario para formulario público)
    - Política para lectura solo a usuarios autenticados
*/

CREATE TABLE IF NOT EXISTS reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  copas integer DEFAULT 0,
  cervezas integer DEFAULT 0,
  refrescos integer DEFAULT 0,
  vasos integer DEFAULT 0,
  total decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción pública de reservas"
  ON reservas
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer reservas"
  ON reservas
  FOR SELECT
  TO authenticated
  USING (true);