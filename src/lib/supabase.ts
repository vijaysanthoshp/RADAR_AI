import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase admin client for server-side operations (API routes, server actions)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types (will be auto-generated after running: npx supabase gen types typescript)
export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          name: string;
          age: number;
          gender: string;
          medical_record_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          age: number;
          gender: string;
          medical_record_number: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          age?: number;
          gender?: string;
          medical_record_number?: string;
          updated_at?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          patient_id: string;
          name: string;
          role: string;
          phone: string;
          email: string | null;
          priority: number;
          notification_preferences: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          name: string;
          role: string;
          phone: string;
          email?: string | null;
          priority?: number;
          notification_preferences: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          patient_id?: string;
          name?: string;
          role?: string;
          phone?: string;
          email?: string | null;
          priority?: number;
          notification_preferences?: string[];
          updated_at?: string;
        };
      };
      alert_history: {
        Row: {
          id: string;
          patient_id: string;
          severity: string;
          message: string;
          heart_rate: number;
          respiratory_rate: number;
          spo2: number;
          perfusion_index: number;
          fusion_score: number;
          channels_sent: string[];
          acknowledged: boolean;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          severity: string;
          message: string;
          heart_rate: number;
          respiratory_rate: number;
          spo2: number;
          perfusion_index: number;
          fusion_score: number;
          channels_sent: string[];
          acknowledged?: boolean;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          created_at?: string;
        };
        Update: {
          acknowledged?: boolean;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
        };
      };
    };
  };
};
