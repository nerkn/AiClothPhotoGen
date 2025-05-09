export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          desc: string | null
          id: number
          name: string | null
          prompts: Json | null
        }
        Insert: {
          created_at?: string
          desc?: string | null
          id?: number
          name?: string | null
          prompts?: Json | null
        }
        Update: {
          created_at?: string
          desc?: string | null
          id?: number
          name?: string | null
          prompts?: Json | null
        }
        Relationships: []
      }
      items: {
        Row: {
          aiPhotos: Json | null
          aiVideos: Json | null
          barcode: string | null
          id: number
          img: string | null
          img2: string | null
          link: string | null
          name: string | null
          price: number | null
          stories: Json | null
          type: string | null
        }
        Insert: {
          aiPhotos?: Json | null
          aiVideos?: Json | null
          barcode?: string | null
          id?: number
          img?: string | null
          img2?: string | null
          link?: string | null
          name?: string | null
          price?: number | null
          stories?: Json | null
          type?: string | null
        }
        Update: {
          aiPhotos?: Json | null
          aiVideos?: Json | null
          barcode?: string | null
          id?: number
          img?: string | null
          img2?: string | null
          link?: string | null
          name?: string | null
          price?: number | null
          stories?: Json | null
          type?: string | null
        }
        Relationships: []
      }
      jobCombine: {
        Row: {
          desc: string | null
          id: number
          name: string | null
          prompt: string | null
          status: string | null
        }
        Insert: {
          desc?: string | null
          id: number
          name?: string | null
          prompt?: string | null
          status?: string | null
        }
        Update: {
          desc?: string | null
          id?: number
          name?: string | null
          prompt?: string | null
          status?: string | null
        }
        Relationships: []
      }
      jobCombineItems: {
        Row: {
          id: number
          itemBag: number | null
          itemBottom: number | null
          itemHead: number | null
          itemShoe: number | null
          itemTop: number | null
          jobId: number | null
          output: string | null
          status: string | null
        }
        Insert: {
          id: number
          itemBag?: number | null
          itemBottom?: number | null
          itemHead?: number | null
          itemShoe?: number | null
          itemTop?: number | null
          jobId?: number | null
          output?: string | null
          status?: string | null
        }
        Update: {
          id?: number
          itemBag?: number | null
          itemBottom?: number | null
          itemHead?: number | null
          itemShoe?: number | null
          itemTop?: number | null
          jobId?: number | null
          output?: string | null
          status?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          createDate: string | null
          id: number
          itemId: number | null
          "meta.status": string | null
          originalImage: string | null
          prompt: string | null
          submitDate: string | null
          submitee: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          createDate?: string | null
          id?: number
          itemId?: number | null
          "meta.status"?: string | null
          originalImage?: string | null
          prompt?: string | null
          submitDate?: string | null
          submitee?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          createDate?: string | null
          id?: number
          itemId?: number | null
          "meta.status"?: string | null
          originalImage?: string | null
          prompt?: string | null
          submitDate?: string | null
          submitee?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
