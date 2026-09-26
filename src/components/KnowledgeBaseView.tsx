import React, { useState } from 'react';
import { KNOWLEDGE_DOMAINS } from '../data/mockData';

interface KnowledgeBaseViewProps {
  onOpenNewTicket?: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ onOpenNewTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex flex-col w-full bg-[#090D16] min-h-[calc(100vh-3.5rem)] text-[#dae2fd]">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden px-6 lg:px-8 py-10">
        {/* Ambient radial glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-[#8083ff]/10 via-[#4cd7f6]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 left-12 w-72 h-72 bg-[#8083ff]/5 rounded-full blur-2xl pointer-events-none -z-10"></div>
        <div className="absolute top-52 right-16 w-80 h-80 bg-[#4cd7f6]/5 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Migration Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B]/80 border border-white/[0.08] shadow-sm hover:bg-[#1E293B] transition-colors mb-6 group cursor-pointer">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
            <span className="font-mono text-xs text-[#dae2fd]">Nexus Platform v3.0 is live!</span>
            <span className="text-xs text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors flex items-center">
              Explore the migration guide
              <span className="material-symbols-outlined text-[16px] ml-0.5 transform group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4cd7f6] font-semibold">
              Nexus Self-Service Hub
            </span>
            <span className="text-[#334155] font-mono text-[10px]">•</span>
            <span className="font-mono text-[10px] text-[#c7c4d7]">Docs & Verified Playbooks</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight max-w-2xl font-semibold mb-2">
            How can we help you today?
          </h1>
          <p className="text-sm text-[#c7c4d7] max-w-xl mx-auto mb-6 leading-relaxed">
            Search our developer guides, API references, troubleshooting playbooks, or synthesize answers with Nexus AI Copilot.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-2xl relative mb-3">
            <div className="relative flex items-center rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-xl focus-within:border-[#8083ff] focus-within:shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-all">
              <div className="pl-4 flex items-center pointer-events-none text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[22px] text-[#8083ff]">search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search "OAuth 2.0 PKCE setup", "Webhook retries", or ask a question...'
                className="w-full h-12 bg-transparent pl-3 pr-20 text-white text-sm placeholder:text-[#c7c4d7]/60 focus:outline-none"
              />
              <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-[#334155] font-mono text-[11px] text-[#c7c4d7] shadow-sm">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick Queries */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl text-[#c7c4d7] font-mono text-[11px]">
            <span className="uppercase text-[#c7c4d7]/70 mr-1 font-medium text-[10px]">Quick Queries:</span>
            {['API Rate Limits', 'SSO & SAML 2.0', 'Webhook Security', 'Billing & Invoices', 'Python SDK'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="px-2.5 py-1 rounded-full bg-[#1E293B] border border-white/[0.05] text-[#dae2fd] hover:text-[#8083ff] hover:border-[#8083ff]/40 transition-colors shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Copilot Box */}
      <div className="px-6 lg:px-8 max-w-6xl mx-auto w-full -mt-2 mb-8">
        <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] p-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#171F33] border border-white/[0.08] flex items-center justify-center text-[#4cd7f6] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-semibold text-white">Nexus Instant AI Copilot</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-white/[0.06] text-[#4cd7f6] font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-[#c7c4d7] max-w-2xl leading-relaxed">
                  Need an immediate technical answer? Type your question and our AI synthesizes verified documentation with runnable code snippets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-[#dae2fd] text-xs hover:bg-[#222A3D] transition-colors flex items-center gap-1.5 border border-white/[0.06] shadow-sm"
              >
                <span>Live Demonstration</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    showDemo ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSearch('How to configure OAuth 2.0 PKCE')}
                className="px-3 py-1.5 rounded-lg bg-[#8083ff] text-[#0d0096] text-xs font-semibold hover:brightness-110 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Ask Nexus Copilot</span>
              </button>
            </div>
          </div>

          {/* Expandable Demo */}
          {showDemo && (
            <div className="mt-4 pt-4 border-t border-white/[0.08] animate-in fade-in duration-150">
              <div className="rounded-lg bg-[#060E20] border border-white/[0.06] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#4cd7f6]">
                    Q: &quot;How do I configure OAuth 2.0 PKCE in React?&quot;
                  </span>
                  <span className="font-mono text-[10px] text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    Synthesized from 3 verified articles
                  </span>
                </div>
                <div className="text-xs text-white leading-relaxed">
                  NexusDesk PKCE requires generating a cryptographic code verifier and code challenge using SHA-256 before invoking the authorize endpoint. Use the official client helper:
                </div>
                <div className="p-3 rounded bg-[#0F172A] border border-white/[0.06] font-mono text-[11px] text-[#dae2fd] overflow-x-auto shadow-inner">
                  <pre className="text-[#dae2fd]">
                    <code>{`import { createNexusAuthClient } from '@nexusdesk/auth';

const client = createNexusAuthClient({
  clientId: 'nx_live_948a3b',
  redirectUri: 'https://app.nexusdesk.io/callback',
  flow: 'pkce'
});

await client.authorizeWithPopup();`}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explore Documentation by Domain */}
      <div className="px-6 lg:px-8 max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl text-white font-semibold tracking-tight">
              Explore Documentation by Domain
            </h2>
            <p className="text-xs text-[#c7c4d7]">
              Structured architecture references, guides, and integration kits
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#c7c4d7]">
            <span>6 Core Categories</span>
            <span>•</span>
            <span>110 Verified Articles</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KNOWLEDGE_DOMAINS.map((domain) => (
            <div
              key={domain.id}
              className="rounded-xl bg-[#0F172A] border border-white/[0.08] p-4 flex flex-col justify-between hover:bg-[#131B2E] hover:border-white/20 transition-all duration-150 shadow-md group cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-[#1E293B] border border-white/[0.06] flex items-center justify-center ${domain.colorClass} group-hover:scale-105 transition-transform`}>
                    <span className="material-symbols-outlined text-[24px]">{domain.icon}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#060E20] font-mono text-[10px] text-[#c7c4d7] font-medium border border-white/[0.04]">
                    {domain.articlesCount} Articles
                  </span>
                </div>

                <h3 className="font-display text-sm font-semibold text-white mb-1 group-hover:text-[#c0c1ff] transition-colors">
                  {domain.title}
                </h3>
                <p className="text-xs text-[#c7c4d7] mb-3 leading-relaxed">
                  {domain.description}
                </p>

                <ul className="space-y-1.5 text-xs text-[#dae2fd]">
                  {domain.featuredArticles.map((art) => (
                    <li
                      key={art.id}
                      className="flex items-center gap-1.5 hover:text-[#8083ff] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#c7c4d7]">article</span>
                      <span className="truncate">{art.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.05] flex items-center justify-between text-[#c7c4d7] font-mono text-[10px]">
                <span>{domain.footerLink}</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Systems Operational & Still Stuck */}
      <div className="px-6 lg:px-8 max-w-6xl mx-auto w-full mb-8">
        <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <span className="font-display font-semibold text-white">All Systems Operational</span>
              <span className="px-2 py-0.5 rounded bg-[#1E293B] border border-white/[0.06] font-mono text-[10px] text-[#10B981]">
                99.998% Uptime
              </span>
            </div>
            <p className="text-xs text-[#c7c4d7] mb-3">
              Past 90 days across 14 edge clusters. Ingestion pipeline latency: 28ms average.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[10px]">
                <span>90 Days Ago</span>
                <span className="text-[#10B981] font-medium">100% Core API Availability</span>
                <span>Today</span>
              </div>
              <div className="grid grid-cols-45 gap-1 h-3 py-0.5">
                {Array.from({ length: 45 }).map((_, i) => (
                  <div key={i} className="h-2 rounded-[1px] bg-[#10B981]/90"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-80 flex flex-col justify-center rounded-lg bg-[#060E20] border border-white/[0.06] p-4 shadow-inner">
            <h4 className="font-display font-semibold text-sm text-white mb-0.5">Still stuck?</h4>
            <p className="text-xs text-[#c7c4d7] mb-3">
              Reach an on-call solutions engineer or escalate an urgent ticket.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="w-full px-3 py-2 rounded-lg bg-[#8083ff] text-[#0d0096] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Start Live AI Chat</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewTicket}
                className="w-full px-3 py-2 rounded-lg bg-[#1E293B] border border-white/[0.08] text-white text-xs hover:bg-[#222A3D] transition-colors flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">confirmation_number</span>
                  <span>Open Support Ticket</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#090D16] border border-[#334155] font-mono text-[10px] text-[#c7c4d7]">
                  ⌘N
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 lg:px-8 max-w-6xl mx-auto w-full pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-[#c7c4d7] font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span>NexusDesk Support Engine v4.2</span>
            <span>•</span>
            <span>
              Docs synced from Git commit <code className="text-white">3f88d1b</code>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Changelog</span>
            <span className="hover:text-white cursor-pointer transition-colors">Detailed Status</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security & Compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
