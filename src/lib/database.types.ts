export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: string
          submitted_by: string
          arbitrator_id: string | null
          documents: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: string
          submitted_by: string
          arbitrator_id?: string | null
          documents?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: string
          submitted_by?: string
          arbitrator_id?: string | null
          documents?: Json | null
        }
      }
      user_roles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          role: string
          is_approved: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          role: string
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          role?: string
          is_approved?: boolean
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          role_id: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          role_id: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          role_id?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      role_changes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          email: string
          new_role: string
          updated_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          email: string
          new_role: string
          updated_by: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          email?: string
          new_role?: string
          updated_by?: string
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
      [_ in never]: never
    }
  }
} 