export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cierres: {
        Row: {
          cliente_id: string | null
          created_at: string
          factura_id: string | null
          facturado: boolean
          fecha_fin: string
          fecha_inicio: string
          folio: string
          id: string
          total: number
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          factura_id?: string | null
          facturado?: boolean
          fecha_fin: string
          fecha_inicio: string
          folio: string
          id?: string
          total?: number
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          factura_id?: string | null
          facturado?: boolean
          fecha_fin?: string
          fecha_inicio?: string
          folio?: string
          id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cierres_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cierres_factura"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          activo: boolean
          created_at: string
          direccion: string
          email: string
          id: string
          razon_social: string
          rut: string
          telefono: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          direccion: string
          email: string
          id?: string
          razon_social: string
          rut: string
          telefono: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          direccion?: string
          email?: string
          id?: string
          razon_social?: string
          rut?: string
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      facturas: {
        Row: {
          cierre_id: string
          created_at: string
          estado: string
          fecha: string
          fecha_pago: string | null
          fecha_vencimiento: string
          folio: string
          id: string
          iva: number
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          cierre_id: string
          created_at?: string
          estado?: string
          fecha?: string
          fecha_pago?: string | null
          fecha_vencimiento: string
          folio: string
          id?: string
          iva: number
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          cierre_id?: string
          created_at?: string
          estado?: string
          fecha?: string
          fecha_pago?: string | null
          fecha_vencimiento?: string
          folio?: string
          id?: string
          iva?: number
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facturas_cierre_id_fkey"
            columns: ["cierre_id"]
            isOneToOne: false
            referencedRelation: "cierres"
            referencedColumns: ["id"]
          },
        ]
      }
      gruas: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          marca: string
          modelo: string
          patente: string
          tipo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          marca: string
          modelo: string
          patente: string
          tipo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          marca?: string
          modelo?: string
          patente?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      operadores: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          nombre_completo: string
          numero_licencia: string
          rut: string
          telefono: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre_completo: string
          numero_licencia: string
          rut: string
          telefono: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre_completo?: string
          numero_licencia?: string
          rut?: string
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      servicios: {
        Row: {
          cierre_id: string | null
          cliente_id: string
          created_at: string
          estado: string
          factura_id: string | null
          fecha: string
          folio: string
          grua_id: string
          id: string
          marca_vehiculo: string
          modelo_vehiculo: string
          observaciones: string | null
          operador_id: string
          orden_compra: string | null
          patente: string
          tipo_servicio_id: string
          ubicacion_destino: string
          ubicacion_origen: string
          updated_at: string
          valor: number
        }
        Insert: {
          cierre_id?: string | null
          cliente_id: string
          created_at?: string
          estado?: string
          factura_id?: string | null
          fecha?: string
          folio: string
          grua_id: string
          id?: string
          marca_vehiculo: string
          modelo_vehiculo: string
          observaciones?: string | null
          operador_id: string
          orden_compra?: string | null
          patente: string
          tipo_servicio_id: string
          ubicacion_destino: string
          ubicacion_origen: string
          updated_at?: string
          valor: number
        }
        Update: {
          cierre_id?: string | null
          cliente_id?: string
          created_at?: string
          estado?: string
          factura_id?: string | null
          fecha?: string
          folio?: string
          grua_id?: string
          id?: string
          marca_vehiculo?: string
          modelo_vehiculo?: string
          observaciones?: string | null
          operador_id?: string
          orden_compra?: string | null
          patente?: string
          tipo_servicio_id?: string
          ubicacion_destino?: string
          ubicacion_origen?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_servicios_cierre"
            columns: ["cierre_id"]
            isOneToOne: false
            referencedRelation: "cierres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_servicios_factura"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_grua_id_fkey"
            columns: ["grua_id"]
            isOneToOne: false
            referencedRelation: "gruas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "operadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_tipo_servicio_id_fkey"
            columns: ["tipo_servicio_id"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_servicio: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion: string
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_folio: {
        Args: Record<PropertyKey, never> | { prefix: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
