/**
 * Shared type definitions for the Arbitration Platform
 */

/**
 * User role type definition
 */
export type UserRole = 'admin' | 'user' | 'arbitrator';

/**
 * Permissions available in the system
 */
export type Permission = 
  | 'view:cases'
  | 'create:cases'
  | 'update:cases'
  | 'delete:cases'
  | 'view:users'
  | 'update:users'
  | 'approve:users'
  | 'assign:roles'
  | 'view:all_cases'
  | 'update:any_case';

/**
 * Map of roles to their permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'view:cases',
    'create:cases',
    'update:cases',
    'delete:cases',
    'view:users',
    'update:users',
    'approve:users',
    'assign:roles',
    'view:all_cases',
    'update:any_case'
  ],
  user: [
    'view:cases',
    'create:cases',
    'update:cases'
  ],
  arbitrator: [
    'view:cases',
    'update:cases',
    'view:all_cases',
    'update:any_case'
  ]
};

/**
 * Case status type
 */
export type CaseStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

/**
 * Document structure
 */
export interface Document {
  id: string;
  case_id: string;
  filename: string;
  url: string;
  content_type: string;
  size: number;
  uploaded_at?: string;
}

/**
 * Case data structure
 */
export interface CaseData {
  id: string;
  name: string;
  email: string;
  description: string;
  status: CaseStatus;
  user_id?: string;
  created_at: string;
  updated_at: string;
  documents: Document[];
}

/**
 * User data structure
 */
export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_approved: boolean;
  created_at: string;
}

/**
 * User role data structure from database
 */
export interface UserRoleData {
  user_id: string;
  role: UserRole;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Form field error type
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalCount: number;
}

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameter structure
 */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/**
 * User profile in the database
 */
export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Utility type for typing async functions/methods
 */
export type AsyncFunction<T = void> = () => Promise<T>;

/**
 * Type for form submission handlers
 */
export type FormSubmitHandler = (e: React.FormEvent) => Promise<void>;

/**
 * Function type for handling permission checks
 */
export type PermissionChecker = (permission: Permission) => boolean; 