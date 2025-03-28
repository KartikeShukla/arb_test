import { Json } from './lib/database.types';

// User role type
export type UserRole = 'admin' | 'user' | 'arbitrator';

// Permission type for role-based access control
export type Permission = 'read:cases' | 'write:cases' | 'manage:users' | 'view:admin-dashboard';

// Case data type
export interface CaseData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submitted_by: string;
  arbitrator_id?: string | null;
  documents?: Json | null;
  // Added for UI convenience
  submitter_email?: string;
  submitter_name?: string;
}

// Document data type
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploaded_at: string;
}

// User data type
export interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: UserRole;
  is_approved?: boolean;
}

// Role change data type
export interface RoleChangeEvent {
  id: string;
  created_at: string;
  user_id: string;
  email: string;
  new_role: UserRole;
  updated_by: string;
} 