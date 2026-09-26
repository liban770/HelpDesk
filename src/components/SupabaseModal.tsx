import React, { useState, useEffect } from 'react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  SUPABASE_SCHEMA_SQL,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectedChange?: (connected: boolean) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConnectedChange,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'schema' | 'instructions'>('credentials');

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setAnonKey(config.anonKey || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url, anonKey);
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      saveSupabaseConfig(url, anonKey);
      if (onConnectedChange) onConnectedChange(true);
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    if (onConnectedChange) onConnectedChange(false);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl bg-[#0F172A] border border-[#334155] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#1E293B]/70 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.416 13.918a.396.396 0 0 0 .313.636H12v8.958a.396.396 0 0 0 .716.233l10.868-13.755a.396.396 0 0 0-.313-.636z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-white">
                Supabase Backend Setup & Connection
              </h2>
              <p className="text-xs text-[#c7c4d7]/70">
                Connect your real Supabase PostgreSQL instance to NexusDesk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c7c4d7] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#334155] bg-[#090D16]/60 px-4 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'credentials'
                ? 'border-[#3ECF8E] text-[#3ECF8E]'
                : 'border-transparent text-[#c7c4d7] hover:text-white'
            }`}
          >
            1. Credentials & Connect
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'schema'
                ? 'border-[#3ECF8E] text-[#3ECF8E]'
                : 'border-transparent text-[#c7c4d7] hover:text-white'
            }`}
          >
            2. SQL Schema DDL
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'instructions'
                ? 'border-[#3ECF8E] text-[#3ECF8E]'
                : 'border-transparent text-[#c7c4d7] hover:text-white'
            }`}
          >
            3. Step-by-Step Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'credentials' && (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div className="p-3 rounded-lg bg-[#090D16] border border-[#334155]/60 text-xs text-[#c7c4d7] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">info</span>
                  <span>How Supabase connects to NexusDesk:</span>
                </div>
                <p>
                  You can paste your Supabase Project URL and Public Anon Key below. Alternatively, you can add them to your environment secrets or <code className="text-[#4cd7f6] bg-[#1E293B] px-1 py-0.5 rounded">.env</code> as <code className="text-[#8083ff]">VITE_SUPABASE_URL</code> and <code className="text-[#8083ff]">VITE_SUPABASE_ANON_KEY</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1.5">
                  SUPABASE PROJECT URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-project-id.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#090D16] border border-[#334155] text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#3ECF8E] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1.5">
                  SUPABASE ANON PUBLIC KEY
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#090D16] border border-[#334155] text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#3ECF8E] transition-colors"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                    testResult.success
                      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                      : 'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                    {testResult.success ? 'check_circle' : 'error'}
                  </span>
                  <div>
                    <p className="font-semibold">{testResult.success ? 'Success' : 'Connection Error'}</p>
                    <p className="opacity-90">{testResult.message}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-xs text-[#F43F5E] hover:bg-[#F43F5E]/10 rounded border border-transparent hover:border-[#F43F5E]/30 transition-colors"
                >
                  Clear Saved Credentials
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs rounded bg-[#1E293B] text-[#c7c4d7] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={testing}
                    className="px-4 py-1.5 text-xs font-semibold rounded bg-[#3ECF8E] text-[#090D16] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[14px]">progress_activity</span>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Connect & Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#c7c4d7]">
                  Copy this SQL script and execute it in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to create the schema and seed data:
                </p>
                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1 rounded bg-[#1E293B] hover:bg-[#334155] text-xs font-mono text-white flex items-center gap-1.5 transition-colors border border-[#334155]"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedSchema ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                </button>
              </div>

              <div className="rounded-lg bg-[#060E20] border border-[#334155] p-3 max-h-72 overflow-y-auto font-mono text-[11px] text-[#dae2fd]/85 leading-relaxed">
                <pre>{SUPABASE_SCHEMA_SQL}</pre>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-[#c7c4d7] leading-relaxed">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#090D16] border border-[#334155]/60">
                <div className="w-6 h-6 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Create your Supabase Project</h4>
                  <p>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#4cd7f6] underline">supabase.com</a>, log in and create a new project (e.g. named <code>nexusdesk-app</code>).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#090D16] border border-[#334155]/60">
                <div className="w-6 h-6 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Run the SQL Schema</h4>
                  <p>Open the <strong>SQL Editor</strong> tab in your Supabase dashboard, paste the SQL from Tab 2, and click <strong>Run</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#090D16] border border-[#334155]/60">
                <div className="w-6 h-6 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Get API Keys</h4>
                  <p>In Supabase, navigate to <strong>Project Settings &gt; API</strong>. Copy the <strong>Project URL</strong> and the <strong>anon public</strong> key, then paste them into Tab 1 above.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
