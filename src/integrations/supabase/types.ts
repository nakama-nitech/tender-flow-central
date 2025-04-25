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
      bids: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          proposal: string | null
          score: number | null
          status: string
          submitteddate: string
          tenderid: string
          updated_at: string
          vendor_id: string
          vendoremail: string | null
          vendorname: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          proposal?: string | null
          score?: number | null
          status?: string
          submitteddate?: string
          tenderid: string
          updated_at?: string
          vendor_id: string
          vendoremail?: string | null
          vendorname: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          proposal?: string | null
          score?: number | null
          status?: string
          submitteddate?: string
          tenderid?: string
          updated_at?: string
          vendor_id?: string
          vendoremail?: string | null
          vendorname?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_tenderid_fkey"
            columns: ["tenderid"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_types: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      supplier_categories: {
        Row: {
          category_id: number
          supplier_id: string
        }
        Insert: {
          category_id: number
          supplier_id: string
        }
        Update: {
          category_id?: number
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_categories_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_locations: {
        Row: {
          location_id: number
          supplier_id: string
        }
        Insert: {
          location_id: number
          supplier_id: string
        }
        Update: {
          location_id?: number
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_locations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          company_name: string
          company_type_id: number | null
          country: string
          created_at: string
          id: string
          kra_pin: string | null
          location: string
          phone_number: string
          physical_address: string | null
          updated_at: string
          verified: boolean
          website_url: string | null
        }
        Insert: {
          company_name: string
          company_type_id?: number | null
          country: string
          created_at?: string
          id: string
          kra_pin?: string | null
          location: string
          phone_number: string
          physical_address?: string | null
          updated_at?: string
          verified?: boolean
          website_url?: string | null
        }
        Update: {
          company_name?: string
          company_type_id?: number | null
          country?: string
          created_at?: string
          id?: string
          kra_pin?: string | null
          location?: string
          phone_number?: string
          physical_address?: string | null
          updated_at?: string
          verified?: boolean
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_type_id_fkey"
            columns: ["company_type_id"]
            isOneToOne: false
            referencedRelation: "company_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          budget: number
          category: Database["public"]["Enums"]["tender_category"]
          created_at: string
          created_by: string
          deadline: string
          description: string
          id: string
          status: Database["public"]["Enums"]["tender_status"]
          title: string
          updated_at: string
        }
        Insert: {
          budget: number
          category: Database["public"]["Enums"]["tender_category"]
          created_at?: string
          created_by: string
          deadline: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["tender_status"]
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number
          category?: Database["public"]["Enums"]["tender_category"]
          created_at?: string
          created_by?: string
          deadline?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["tender_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      upsert_profile: {
        Args: {
          user_id: string
          user_role: string
          first_name: string
          last_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      tender_category:
        | "construction"
        | "services"
        | "goods"
        | "consulting"
        | "other"
      tender_status:
        | "draft"
        | "published"
        | "under_evaluation"
        | "awarded"
        | "closed"
      user_role: "admin" | "supplier"
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
    Enums: {
      tender_category: [
        "construction",
        "services",
        "goods",
        "consulting",
        "other",
      ],
      tender_status: [
        "draft",
        "published",
        "under_evaluation",
        "awarded",
        "closed",
      ],
      user_role: ["admin", "supplier"],
    },
  },
} as const
