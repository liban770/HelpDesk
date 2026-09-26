import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default credentials provided by user
const DEFAULT_SUPABASE_URL = 'https://vdzcvjqztadyldnyabqg.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_233my7pQUE61NyJshtEXgg_AdQVF-Np';

// Local storage keys for runtime configuration if .env was not rebuilt
const LOCAL_STORAGE_URL_KEY = 'nexus_supabase_url';
const LOCAL_STORAGE_ANON_KEY = 'nexus_supabase_anon_key';

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_URL_KEY) : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_ANON_KEY) : null;

  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (localKey || envKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key')
  );

  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.trim());
    localStorage.setItem(LOCAL_STORAGE_ANON_KEY, anonKey.trim());
  }
}

export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANON_KEY);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const key = `${url}-${anonKey}`;
  if (cachedClient && lastClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastClientKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const config = getSupabaseConfig();
    const targetUrl = url || config.url;
    const targetKey = anonKey || config.anonKey;

    if (!targetUrl || !targetKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon Public Key.' };
    }

    const testClient = createClient(targetUrl, targetKey);
    // Ping tickets table or auth health check
    const { error } = await testClient.from('tickets').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, it's still a valid client connection
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project! (Note: the "tickets" table has not been created yet. Run the SQL schema to initialize it.)'
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected and verified Supabase database schema!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection test failed. Check your Supabase URL & Key.' };
  }
}

/**
 * Ready-to-run PostgreSQL DDL schema for the user's Supabase SQL Editor.
 */
export const SUPABASE_SCHEMA_SQL = `-- ==========================================
-- NexusDesk Enterprise Support Schema for Supabase
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'P2',
  priority_label TEXT NOT NULL DEFAULT 'P2 - High',
  channel TEXT NOT NULL DEFAULT 'slack',
  channel_details TEXT,
  customer JSONB NOT NULL,
  assignee JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  sla_minutes_remaining INT DEFAULT 60,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  sentiment TEXT DEFAULT 'neutral',
  sentiment_label TEXT DEFAULT 'Neutral Sentiment',
  ai_match_score INT DEFAULT 90,
  ai_summary JSONB
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  content TEXT NOT NULL,
  code_snippet JSONB,
  channel_badge TEXT,
  is_staff_restricted BOOLEAN DEFAULT FALSE
);

-- 3. Create Automation Workflows Table
CREATE TABLE IF NOT EXISTS public.workflows (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  status TEXT NOT NULL DEFAULT 'active',
  last_run TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  executions_today INT DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 99.8,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- 5. Open Read/Write Policies for Demo/Workspace Anon Access
CREATE POLICY "Public Read Tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Public Write Tickets" ON public.tickets FOR ALL USING (true);

CREATE POLICY "Public Read Messages" ON public.ticket_messages FOR SELECT USING (true);
CREATE POLICY "Public Write Messages" ON public.ticket_messages FOR ALL USING (true);

CREATE POLICY "Public Read Workflows" ON public.workflows FOR SELECT USING (true);
CREATE POLICY "Public Write Workflows" ON public.workflows FOR ALL USING (true);

-- 6. Initial Seed Data
INSERT INTO public.tickets (
  id, ticket_number, title, description, status, priority, priority_label,
  channel, channel_details, customer, assignee, created_at, sla_minutes_remaining,
  tags, sentiment, sentiment_label, ai_match_score, ai_summary
) VALUES (
  'tk_8492', 'NEX-8492',
  'OAuth2 token exchange failing intermittently on EU-West cluster',
  'SSO failures when calling token exchange API',
  'in_progress', 'P1', 'P1 - Urgent',
  'slack', '#fintech-nexus-vip',
  '{"id":"cust_1","name":"Alex Chen","company":"Fintech Inc","role":"VP Eng @ Fintech Inc","arr":"$120k","healthScore":92,"isVip":true}'::jsonb,
  '{"id":"agent_1","name":"Elena Rostova (You)","role":"Senior Support Engineer","avatar":"https://lh3.googleusercontent.com/aida-public/AB6AXuAtH2iqbsmZ_rDtikzjLjxwQ7FvOs6WJETrzFHTDt8goMNhoC5hz0JWvFJrkt7njXIHnn8OCVFEd_6AiJfTNaUyqPglAaRlMKo6ZScMSYjWPk3ZNuNDqtvPbCDA2XmPN5yMamBuhCsvgCD5GdfBHEaVVQLEoJ7SnBIsd0mNmUfVqXkbC04AUo5Vh52hv1mZAlY9JcMwqtxAQcZU7LDn-zlO9TvoN0RfunbG7cqvfKBwFnW6oBUby_kg"}'::jsonb,
  NOW() - INTERVAL '28 minutes',
  18,
  ARRAY['# enterprise-vip', '# auth0-migration'],
  'frustrated', 'Frustrated / Urgent',
  96,
  '{"title":"Nexus AI Summary & Triage Insight","description":"Customer experiencing intermittent 504 Gateway Timeouts during OAuth token exchange specifically on eu-west-1 endpoints since the v2.4.1 ingress update. Impact assessment: 450 end-users affected.","affectedUsers":450,"suggestedMacro":"OAuth Eu-West Workaround","relatedIncidentId":"INC-309","confidence":96}'::jsonb
) ON CONFLICT (id) DO NOTHING;
`;
