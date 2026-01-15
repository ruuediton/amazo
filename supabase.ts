import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejlbjitzocowhbkguavr.supabase.co';
const supabaseAnonKey = 'sb_publishable_s8w5k0Md8mPrqr3_IAMdQg_81esVNvo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
