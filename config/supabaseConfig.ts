import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANTE: Substitua estas credenciais pelas suas credenciais reais do Supabase
// Você pode encontrá-las em: https://app.supabase.com/project/[seu-projeto]/settings/api

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima-aqui';

// Validação básica das credenciais
if (!SUPABASE_URL || SUPABASE_URL.includes('seu-projeto')) {
  console.warn(
    'Aviso: Credenciais do Supabase não configuradas. ' +
    'Configure as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type { User, Session } from '@supabase/supabase-js';
