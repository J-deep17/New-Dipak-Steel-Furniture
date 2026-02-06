export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          home_order: number | null
          id: string
          image_url: string | null
          name: string
          show_on_home: boolean | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          home_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          show_on_home?: boolean | null
          slug: string
        }
        Update: {
          created_at?: string | null
          home_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          show_on_home?: boolean | null
          slug?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          content: Json
          id: string
          page_key: string
          updated_at: string | null
        }
        Insert: {
          content?: Json
          id?: string
          page_key: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          id?: string
          page_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          advance_after_video: boolean | null
          created_at: string
          id: string
          is_active: boolean | null
          media_type: string | null
          media_url: string
          order_index: number | null
          overlay_opacity: number | null
          primary_button_link: string | null
          primary_button_text: string | null
          secondary_button_link: string | null
          secondary_button_text: string | null
          subtitle: string | null
          text_position: string | null
          title: string | null
        }
        Insert: {
          advance_after_video?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type?: string | null
          media_url: string
          order_index?: number | null
          overlay_opacity?: number | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          subtitle?: string | null
          text_position?: string | null
          title?: string | null
        }
        Update: {
          advance_after_video?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type?: string | null
          media_url?: string
          order_index?: number | null
          overlay_opacity?: number | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          subtitle?: string | null
          text_position?: string | null
          title?: string | null
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          autoplay: boolean | null
          autoplay_interval: number | null
          id: string
          pause_on_hover: boolean | null
          show_arrows: boolean | null
          show_dots: boolean | null
          transition_effect: string | null
        }
        Insert: {
          autoplay?: boolean | null
          autoplay_interval?: number | null
          id?: string
          pause_on_hover?: boolean | null
          show_arrows?: boolean | null
          show_dots?: boolean | null
          transition_effect?: string | null
        }
        Update: {
          autoplay?: boolean | null
          autoplay_interval?: number | null
          id?: string
          pause_on_hover?: boolean | null
          show_arrows?: boolean | null
          show_dots?: boolean | null
          transition_effect?: string | null
        }
        Relationships: []
      }
      homepage_about: {
        Row: {
          button_link: string | null
          button_text: string | null
          description: string
          id: string
          title: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          description: string
          id?: string
          title: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      homepage_categories: {
        Row: {
          id: string
          image_url: string | null
          link: string | null
          title: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          link?: string | null
          title: string
        }
        Update: {
          id?: string
          image_url?: string | null
          link?: string | null
          title?: string
        }
        Relationships: []
      }
      homepage_cta: {
        Row: {
          background_color: string | null
          button_link: string | null
          button_text: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          background_color?: string | null
          button_link?: string | null
          button_text?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          background_color?: string | null
          button_link?: string | null
          button_text?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      homepage_faq: {
        Row: {
          answer: string
          id: string
          question: string
        }
        Insert: {
          answer: string
          id?: string
          question: string
        }
        Update: {
          answer?: string
          id?: string
          question?: string
        }
        Relationships: []
      }
      homepage_features: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Relationships: []
      }
      homepage_hero: {
        Row: {
          cta_primary_link: string | null
          cta_primary_text: string | null
          cta_secondary_link: string | null
          cta_secondary_text: string | null
          heading: string
          hero_image: string | null
          highlight_text: string | null
          id: string
          subheading: string | null
        }
        Insert: {
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          heading: string
          hero_image?: string | null
          highlight_text?: string | null
          id?: string
          subheading?: string | null
        }
        Update: {
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          heading?: string
          hero_image?: string | null
          highlight_text?: string | null
          id?: string
          subheading?: string | null
        }
        Relationships: []
      }
      homepage_stats: {
        Row: {
          id: string
          label: string
          value: string
        }
        Insert: {
          id?: string
          label: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          value?: string
        }
        Relationships: []
      }
      homepage_testimonials: {
        Row: {
          id: string
          message: string
          name: string
          rating: number | null
        }
        Insert: {
          id?: string
          message: string
          name: string
          rating?: number | null
        }
        Update: {
          id?: string
          message?: string
          name?: string
          rating?: number | null
        }
        Relationships: []
      }
      legal_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_published: boolean | null
          slug: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          slug: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      product_page_settings: {
        Row: {
          created_at: string | null
          delivery_button_text: string
          delivery_title: string
          id: string
          pincode_placeholder: string
          pricing_note: string
          product_tag_label: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_button_text?: string
          delivery_title?: string
          id?: string
          pincode_placeholder?: string
          pricing_note?: string
          product_tag_label?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_button_text?: string
          delivery_title?: string
          id?: string
          pincode_placeholder?: string
          pricing_note?: string
          product_tag_label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_templates: {
        Row: {
          created_at: string
          dimensions: string | null
          id: string
          key_features: string[] | null
          name: string
          warranty_care: string[] | null
          warranty_coverage: string[] | null
        }
        Insert: {
          created_at?: string
          dimensions?: string | null
          id?: string
          key_features?: string[] | null
          name: string
          warranty_care?: string[] | null
          warranty_coverage?: string[] | null
        }
        Update: {
          created_at?: string
          dimensions?: string | null
          id?: string
          key_features?: string[] | null
          name?: string
          warranty_care?: string[] | null
          warranty_coverage?: string[] | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          discount_percent: number | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          key_features: string[] | null
          mrp: number | null
          price: number
          short_description: string | null
          slug: string | null
          specifications: Json | null
          title: string
          warranty_care: string[] | null
          warranty_coverage: string[] | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          key_features?: string[] | null
          mrp?: number | null
          price: number
          short_description?: string | null
          slug?: string | null
          specifications?: Json | null
          title: string
          warranty_care?: string[] | null
          warranty_coverage?: string[] | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          key_features?: string[] | null
          mrp?: number | null
          price?: number
          short_description?: string | null
          slug?: string | null
          specifications?: Json | null
          title?: string
          warranty_care?: string[] | null
          warranty_coverage?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
