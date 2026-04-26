
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hatqljndawhsdckkizec.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdHFsam5kYXdoc2Rja2tpemVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDc1MjYsImV4cCI6MjA2MDI4MzUyNn0.SklE3BfN29lHnavaenrpz8ULkeB9MBnMCn1fkRSvf20";



export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);