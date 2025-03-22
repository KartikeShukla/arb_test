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
      users: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          role_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          role_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          role_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          }
        ]
      },
      case_submissions: {
        Row: {
          id: string;
          title: string;
          description: string;
          claimant_name: string;
          claimant_email: string;
          claimant_phone?: string;
          respondent_name: string;
          respondent_email?: string;
          respondent_phone?: string;
          dispute_type: string;
          dispute_amount?: number;
          status: CaseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          claimant_name: string;
          claimant_email: string;
          claimant_phone?: string;
          respondent_name: string;
          respondent_email?: string;
          respondent_phone?: string;
          dispute_type: string;
          dispute_amount?: number;
          status?: CaseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          claimant_name?: string;
          claimant_email?: string;
          claimant_phone?: string;
          respondent_name?: string;
          respondent_email?: string;
          respondent_phone?: string;
          dispute_type?: string;
          dispute_amount?: number;
          status?: CaseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      },
      case_documents: {
        Row: {
          id: string;
          case_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          uploaded_at?: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string;
          file_size?: number;
          uploaded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_submissions";
            referencedColumns: ["id"];
          }
        ];
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }[]
      }
      check_user_permission: {
        Args: {
          user_id: string
          permission_name: string
        }
        Returns: boolean
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

// Define the case status type
export type CaseStatus = 'pending' | 'in_review' | 'accepted' | 'rejected' | 'completed';

// Interface for case submission form data
export interface CaseSubmissionFormData {
  title: string;
  description: string;
  claimant_name: string;
  claimant_email: string;
  respondent_name: string;
  dispute_type: string;
  status?: CaseStatus;
} 