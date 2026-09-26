import React, { useState, useEffect } from 'react';
import { Ticket } from '../types/nexus';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onNavigate: (tab: 'inbox-workspace' | 'ai-automations' | 'knowledge-base' | 'analytics') => void;
  onOpenSupabase: () => void;
  onOpenAuth?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tickets,
  onSelectTicket,
  onNavigate,
  onOpenSupabase,
  onOpenAuth,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketNumber.toLowerCase().includes(query.toLowerCase()) ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.customer.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-xl rounded-xl bg-[#0F172A] border border-[#334155] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3 bg-[#1E293B]/70 border-b border-[#334155] flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-[#8083ff]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tickets, actions, and settings..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-[#c7c4d7]/50"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#090D16] border border-[#334155] font-mono text-[10px] text-[#c7c4d7]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1 font-mono text-xs">
          {/* Quick Actions */}
          <div className="px-2 py-1 text-[10px] text-[#c7c4d7]/60 uppercase tracking-wider font-semibold">
            System Commands
          </div>

          {onOpenAuth && (
            <button
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] text-left text-[#dae2fd] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#8083ff]">admin_panel_settings</span>
                <span>Supabase Authentication & Agent Roles (Option B)</span>
              </div>
              <span className="text-[10px] text-[#c0c1ff] font-medium">Auth & RBAC</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenSupabase();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] text-left text-[#dae2fd] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-[#3ECF8E]">database</span>
              <span>Open Supabase Connection & SQL Migration Setup</span>
            </div>
            <span className="text-[10px] text-[#3ECF8E] font-medium">PostgreSQL</span>
          </button>

          <button
            onClick={() => {
              onNavigate('ai-automations');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] text-left text-[#dae2fd] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-[#8083ff]">account_tree</span>
              <span>Go to AI Automations Workflow Builder</span>
            </div>
            <kbd className="text-[10px] text-[#c7c4d7] bg-[#171F33] px-1 rounded">⌘2</kbd>
          </button>

          <button
            onClick={() => {
              onNavigate('knowledge-base');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] text-left text-[#dae2fd] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">library_books</span>
              <span>Go to Knowledge Base & Playbooks</span>
            </div>
            <kbd className="text-[10px] text-[#c7c4d7] bg-[#171F33] px-1 rounded">⌘3</kbd>
          </button>

          {/* Tickets List */}
          <div className="px-2 pt-2 py-1 text-[10px] text-[#c7c4d7]/60 uppercase tracking-wider font-semibold border-t border-white/[0.05]">
            Active Tickets ({filteredTickets.length})
          </div>

          {filteredTickets.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTicket(t.id);
                onNavigate('inbox-workspace');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] text-left text-[#dae2fd] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[#c0c1ff] font-bold text-xs">{t.ticketNumber}</span>
                <span className="truncate text-xs font-sans text-white">{t.title}</span>
              </div>
              <span className="text-[10px] text-[#c7c4d7] shrink-0 ml-2">{t.customer.company}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
