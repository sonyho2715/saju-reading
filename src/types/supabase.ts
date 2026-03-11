export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          preferred_language: string;
          subscription_tier: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          preferred_language?: string;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          preferred_language?: string;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      birth_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          birth_date: string;
          birth_time: string | null;
          birth_time_known: boolean;
          gender: string;
          calendar_type: string;
          is_leap_month: boolean;
          timezone: string;
          is_primary: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          birth_date: string;
          birth_time?: string | null;
          birth_time_known?: boolean;
          gender: string;
          calendar_type?: string;
          is_leap_month?: boolean;
          timezone?: string;
          is_primary?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          birth_date?: string;
          birth_time?: string | null;
          birth_time_known?: boolean;
          gender?: string;
          calendar_type?: string;
          is_leap_month?: boolean;
          timezone?: string;
          is_primary?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'birth_profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      charts: {
        Row: {
          id: string;
          profile_id: string | null;
          hour_stem: number | null;
          hour_branch: number | null;
          day_stem: number;
          day_branch: number;
          month_stem: number;
          month_branch: number;
          year_stem: number;
          year_branch: number;
          day_master: number;
          day_master_strength: string;
          element_balance: Json;
          ten_gods: Json;
          hidden_stems: Json;
          useful_god: number | null;
          jealousy_god: number | null;
          chart_pattern: string | null;
          special_stars: Json;
          combinations: Json;
          clashes: Json;
          life_stages: Json;
          luck_cycles: Json;
          engine_version: string;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          hour_stem?: number | null;
          hour_branch?: number | null;
          day_stem: number;
          day_branch: number;
          month_stem: number;
          month_branch: number;
          year_stem: number;
          year_branch: number;
          day_master: number;
          day_master_strength: string;
          element_balance?: Json;
          ten_gods?: Json;
          hidden_stems?: Json;
          useful_god?: number | null;
          jealousy_god?: number | null;
          chart_pattern?: string | null;
          special_stars?: Json;
          combinations?: Json;
          clashes?: Json;
          life_stages?: Json;
          luck_cycles?: Json;
          engine_version: string;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          hour_stem?: number | null;
          hour_branch?: number | null;
          day_stem?: number;
          day_branch?: number;
          month_stem?: number;
          month_branch?: number;
          year_stem?: number;
          year_branch?: number;
          day_master?: number;
          day_master_strength?: string;
          element_balance?: Json;
          ten_gods?: Json;
          hidden_stems?: Json;
          useful_god?: number | null;
          jealousy_god?: number | null;
          chart_pattern?: string | null;
          special_stars?: Json;
          combinations?: Json;
          clashes?: Json;
          life_stages?: Json;
          luck_cycles?: Json;
          engine_version?: string;
          calculated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'charts_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'birth_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      readings: {
        Row: {
          id: string;
          chart_id: string | null;
          user_id: string | null;
          reading_type: string;
          language: string;
          content: Json;
          target_year: number | null;
          target_month: number | null;
          partner_chart_id: string | null;
          ai_model: string | null;
          token_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chart_id?: string | null;
          user_id?: string | null;
          reading_type: string;
          language?: string;
          content?: Json;
          target_year?: number | null;
          target_month?: number | null;
          partner_chart_id?: string | null;
          ai_model?: string | null;
          token_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chart_id?: string | null;
          user_id?: string | null;
          reading_type?: string;
          language?: string;
          content?: Json;
          target_year?: number | null;
          target_month?: number | null;
          partner_chart_id?: string | null;
          ai_model?: string | null;
          token_count?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'readings_chart_id_fkey';
            columns: ['chart_id'];
            isOneToOne: false;
            referencedRelation: 'charts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'readings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      compatibility: {
        Row: {
          id: string;
          chart_a_id: string;
          chart_b_id: string;
          overall_score: number | null;
          analysis: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          chart_a_id: string;
          chart_b_id: string;
          overall_score?: number | null;
          analysis?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          chart_a_id?: string;
          chart_b_id?: string;
          overall_score?: number | null;
          analysis?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'compatibility_chart_a_id_fkey';
            columns: ['chart_a_id'];
            isOneToOne: false;
            referencedRelation: 'charts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'compatibility_chart_b_id_fkey';
            columns: ['chart_b_id'];
            isOneToOne: false;
            referencedRelation: 'charts';
            referencedColumns: ['id'];
          },
        ];
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          transaction_type: string;
          description: string | null;
          stripe_payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          transaction_type: string;
          description?: string | null;
          stripe_payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          transaction_type?: string;
          description?: string | null;
          stripe_payment_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'credits_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      daily_energies: {
        Row: {
          id: string;
          date: string;
          stem_index: number;
          branch_index: number;
          element_highlights: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          stem_index: number;
          branch_index: number;
          element_highlights?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          stem_index?: number;
          branch_index?: number;
          element_highlights?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
