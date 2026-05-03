import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgklrflfrvodlqllbxrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJna2xyZmxmcnZvZGxxbGxieHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDMxNzIsImV4cCI6MjA5MjE3OTE3Mn0.pJofBTf180jUQm3rNZljd7OuStNQSBYWzrvQ9PXMPJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
