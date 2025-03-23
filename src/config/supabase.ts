import { createClient } from '@supabase/supabase-js';

// Safely get environment variables with fallbacks
const getSupabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // For client-side rendering, env vars might be undefined
  if (!url) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined');
    return '';
  }
  console.log('Supabase URL:', url); // Debugging log
  return url;
};

const getSupabaseAnonKey = (): string => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
    return '';
  }
  console.log('Supabase Anon Key length:', key.length); // Debugging log (don't log full key)
  return key;
};

// Create a safe URL
const getSafeUrl = (url: string): string => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

// Create Supabase client - returns null if credentials are missing
export const createSupabaseClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Failed to create Supabase client: Missing URL or Anon Key');
    return null;
  }
  
  try {
    const client = createClient(getSafeUrl(supabaseUrl), supabaseAnonKey);
    console.log('Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Determine if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';
console.log('Environment:', isDevelopment ? 'Development' : 'Production');

// Create mock operations for development
export const mockSupabaseOps = {
  async insert(data: any) {
    console.log("Mock insert:", data);
    return new Promise<{ data: any[]; error: null | Error }>(resolve => {
      setTimeout(() => {
        resolve({
          data: [{ id: `mock-${Date.now()}`, ...data[0] }],
          error: null
        });
      }, 1000);
    });
  },
  async upload(path: string, file: File) {
    console.log(`Mock upload: ${path}, File: ${file.name}`);
    return new Promise<{ data: { path: string }; error: null | Error }>(resolve => {
      setTimeout(() => {
        resolve({ data: { path }, error: null });
      }, 500);
    });
  }
};

// Create a singleton instance
export const supabase = createSupabaseClient();
console.log('Supabase initialization complete, client available:', !!supabase); 