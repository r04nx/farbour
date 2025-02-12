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
      profiles: {
        Row: {
          id: string
          name: string
          phone: string
          user_type: 'farmer' | 'laborer'
          created_at: string
          updated_at: string
          avatar_url: string | null
          is_phone_verified: boolean
        }
        Insert: {
          id: string
          name: string
          phone: string
          user_type: 'farmer' | 'laborer'
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          is_phone_verified?: boolean
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          user_type?: 'farmer' | 'laborer'
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          is_phone_verified?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'farmer' | 'laborer'
    }
  }
} 