import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// Never import this in client components.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : "https://placeholder-url.supabase.co";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DriveFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  message_id: number;
  folder_path: string;
  uploaded_at: string;
}
