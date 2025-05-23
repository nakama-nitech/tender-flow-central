// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Extended RPC functions interface
interface RPCFunctions {
  create_supplier: (args: {
    supplier_id: string;
    company_type_id_input: number;
    company_name_input: string;
    location_input: string;
    country_input: string;
    phone_number_input: string;
    kra_pin_input: string;
    physical_address_input: string | null;
    website_url_input: string | null;
  }) => Promise<{ data: null; error: any }>;
  
  add_supplier_category: (args: {
    supplier_id_input: string;
    category_id_input: number;
  }) => Promise<{ data: null; error: any }>;
  
  add_supplier_location: (args: {
    supplier_id_input: string;
    location_id_input: number;
  }) => Promise<{ data: null; error: any }>;
}

// Extend the supabase client's rpc method to include our custom functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database> {
    rpc<T = any>(
      fn: string,
      params?: Record<string, unknown>,
      options?: {
        count?: 'exact' | 'planned' | 'estimated';
        head?: boolean;
      }
    ): Promise<{
      data: T;
      error: Error | null;
      count: number | null;
    }>;
  }
}
