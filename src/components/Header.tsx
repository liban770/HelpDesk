import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'inbox-workspace' | 'ai-automations' | 'knowledge-base' | 'analytics';
  setActiveTab: (tab: 'inbox-workspace' | 'ai-automations' | 'knowledge-base' | 'analytics') => void;
  onOpenCommandPalette: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAuthModal: () => void;
  isSupabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onOpenSupabaseModal,
  onOpenAuthModal,
  isSupabaseConnected,
}) => {
  const { user, profile } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="w-full h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('inbox-workspace')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* Geometric Brand Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8083ff] to-[#4cd7f6] p-0.5 shadow-md group-hover:brightness-110 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#0F172A] rounded-[6px] flex items-center justify-center relative overflow-hidden">
                <div className="w-4 h-4 bg-[#8083ff] transform rotate-45 translate-x-[-2px] opacity-90"></div>
                <div className="w-3.5 h-3.5 bg-[#4cd7f6] transform rotate-45 translate-x-[2px] opacity-90"></div>
              </div>
            </div>
            <span className="font-display text-lg font-semibold text-[#dae2fd] tracking-tight">
              NexusDesk
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-white/[0.08] font-mono text-[10px] text-[#4cd7f6] font-medium uppercase tracking-wider">
              Enterprise
            </span>
          </div>

          <div className="h-4 w-px bg-white/[0.08] hidden lg:block"></div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('inbox-workspace')}
              className={`px-3 py-1.5 rounded transition-colors border ${
                activeTab === 'inbox-workspace'
                  ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
              }`}
            >
              Inbox / Workspace
            </button>
            <button
              onClick={() => setActiveTab('ai-automations')}
              className={`px-3 py-1.5 rounded transition-colors border ${
                activeTab === 'ai-automations'
                  ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
              }`}
            >
              AI Automations
            </button>
            <button
              onClick={() => setActiveTab('knowledge-base')}
              className={`px-3 py-1.5 rounded transition-colors border ${
                activeTab === 'knowledge-base'
                  ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
              }`}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded transition-colors border ${
                activeTab === 'analytics'
                  ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Center: Command Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full h-8 px-3 bg-[#090D16] rounded border border-white/[0.08] flex items-center justify-between text-[#c7c4d7] hover:border-[#334155] hover:text-[#dae2fd] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="text-xs">Search tickets, docs, or run actions...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-[#334155] text-[#c7c4d7]">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-[#334155] text-[#c7c4d7]">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Operational Status, Supabase Indicator & Profile */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              isSupabaseConnected
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/25'
                : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/25'
            }`}
            title="Configure Supabase connection"
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span className="font-semibold text-[11px]">
              {isSupabaseConnected ? 'Supabase Live' : 'Supabase Setup'}
            </span>
          </button>

          {/* Operational Beacon */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20 font-mono text-[10px] text-[#10B981]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span>All systems operational</span>
          </div>

          <div className="h-4 w-px bg-white/[0.08] hidden sm:block"></div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Notifications"
              className="relative p-1.5 text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B] rounded transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E]"></span>
            </button>
            <button
              aria-label="Keyboard shortcuts"
              onClick={onOpenCommandPalette}
              className="p-1.5 text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B] rounded transition-colors hidden sm:inline-flex"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">keyboard</span>
            </button>
            <button
              aria-label="Documentation & Help"
              onClick={() => setActiveTab('knowledge-base')}
              className="p-1.5 text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B] rounded transition-colors hidden sm:inline-flex"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
            </button>
          </div>

          {/* Profile Avatar / User Badge */}
          <div className="relative flex items-center pl-1">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="relative cursor-pointer flex items-center gap-2 p-1 rounded-lg hover:bg-[#1E293B] transition-colors border border-transparent hover:border-white/[0.08]"
              title="Manage Supabase Auth & Agent Role"
            >
              <div className="relative">
                <img
                  alt={profile?.fullName || 'Agent'}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                  src={profile?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtH2iqbsmZ_rDtikzjLjxwQ7FvOs6WJETrzFHTDt8goMNhoC5hz0JWvFJrkt7njXIHnn8OCVFEd_6AiJfTNaUyqPglAaRlMKo6ZScMSYjWPk3ZNuNDqtvPbCDA2XmPN5yMamBuhCsvgCD5GdfBHEaVVQLEoJ7SnBIsd0mNmUfVqXkbC04AUo5Vh52hv1mZAlY9JcMwqtxAQcZU7LDn-zlO9TvoN0RfunbG7cqvfKBwFnW6oBUby_kg'}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0F172A]"></span>
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {profile?.fullName.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] text-[#4cd7f6] uppercase">
                  {user ? 'Auth: ' + (profile?.role.replace('_', ' ') || 'agent') : 'Role: ' + (profile?.role || 'staff')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
