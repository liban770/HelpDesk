import React, { useState, useEffect } from 'react';
import { Ticket, TicketMessage } from '../types/nexus';

interface WorkspaceViewProps {
  tickets: Ticket[];
  selectedTicketId: string;
  onSelectTicket: (ticketId: string) => void;
  messages: TicketMessage[];
  onSendMessage: (ticketId: string, content: string, isInternal: boolean) => void;
  onUpdateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  onUpdateTicketPriority: (ticketId: string, priority: Ticket['priority']) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  messages,
  onSendMessage,
  onUpdateTicketStatus,
  onUpdateTicketPriority,
}) => {
  const [activeQueueFilter, setActiveQueueFilter] = useState<'assigned' | 'ai-triaged' | 'urgent' | 'unassigned' | 'all'>('assigned');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'urgent'>('all');
  const [composerMode, setComposerMode] = useState<'public' | 'internal'>('public');
  const [composerText, setComposerText] = useState(
    'Hi Alex, our infrastructure team just deployed an Envoy gateway fix to the EU-West token proxy. Could you test the OAuth exchange with header X-Nexus-Route: direct and confirm if 200 OK is returned?'
  );
  const [isPolishing, setIsPolishing] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60 + 42); // 18m 42s

  // Live countdown timer for SLA breach
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs} until SLA breach`;
  };

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Filtering tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.title.toLowerCase().includes(q) ||
        ticket.ticketNumber.toLowerCase().includes(q) ||
        ticket.customer.name.toLowerCase().includes(q) ||
        ticket.customer.company.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeTagFilter && !ticket.tags.includes(activeTagFilter)) {
      return false;
    }

    if (activeQueueFilter === 'urgent' && ticket.priority !== 'P0' && ticket.priority !== 'P1') {
      return false;
    }

    if (priorityFilter === 'high' && ticket.priority !== 'P1' && ticket.priority !== 'P2') {
      return false;
    }

    return true;
  });

  const handleSend = () => {
    if (!composerText.trim()) return;
    onSendMessage(currentTicket.id, composerText, composerMode === 'internal');
    setComposerText('');
  };

  const handleApplyMacro = (macroText: string) => {
    setComposerText((prev) => (prev ? `${prev}\n\n${macroText}` : macroText));
  };

  const handleAiPolish = () => {
    setIsPolishing(true);
    setTimeout(() => {
      setComposerText(
        `Hi Alex,\n\nOur infrastructure team deployed an Envoy gateway configuration patch to the EU-West token proxy at 10:45 AM UTC. Latency is confirmed normalized under 40ms.\n\nCould you please trigger token generation with the direct bypass header below to confirm immediate resolution on your mobile clients?\n\nX-Nexus-Route: direct\n\nStanding by for your verification.`
      );
      setIsPolishing(false);
    }, 600);
  };

  // Keyboard shortcut listener (J/K navigation, E resolve)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'j' || e.key === 'J') {
        const idx = filteredTickets.findIndex((t) => t.id === selectedTicketId);
        if (idx < filteredTickets.length - 1) {
          onSelectTicket(filteredTickets[idx + 1].id);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        const idx = filteredTickets.findIndex((t) => t.id === selectedTicketId);
        if (idx > 0) {
          onSelectTicket(filteredTickets[idx - 1].id);
        }
      } else if (e.key === 'e' || e.key === 'E') {
        onUpdateTicketStatus(currentTicket.id, 'resolved');
      } else if (e.key === 's' || e.key === 'S') {
        onUpdateTicketStatus(currentTicket.id, 'snoozed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredTickets, selectedTicketId, currentTicket.id]);

  return (
    <div className="flex flex-col w-full text-[#dae2fd] select-none">
      {/* Top Secondary Workspace Bar / Global State */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#060E20] text-[#c7c4d7] text-[10px] font-mono border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#4cd7f6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider">Stream Sync Live</span>
          </div>
          <span className="text-[#c7c4d7]/40">/</span>
          <span className="text-[#dae2fd]">Queue: Production Triage</span>
          <span className="text-[#c7c4d7]/40">/</span>
          <span className="text-[#c7c4d7]/70">Cluster: eu-west-1a [Latency 14ms]</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>Auto-routing: Active (Nexus Copilot v4.2)</span>
          </div>
          <div className="flex items-center gap-1 text-[#c7c4d7]">
            <span>Global SLA:</span>
            <span className="text-[#dae2fd] font-semibold">99.4%</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Split-Pane Workbench */}
      <div className="flex w-full h-[calc(100vh-5.5rem)] overflow-hidden">
        {/* ========================================== */}
        {/* COLUMN 1: Sub-Sidebar / Views Column (240px) */}
        {/* ========================================== */}
        <aside className="w-60 flex-shrink-0 bg-[#0F172A] border-r border-white/[0.08] flex flex-col justify-between overflow-y-auto">
          <div className="p-2 space-y-3">
            {/* Workspace Switcher */}
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] transition-colors text-left group border border-white/[0.05]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded bg-[#8083ff] text-[#0d0096] flex items-center justify-center font-display text-[12px] font-bold shadow-sm">
                    A
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[13px] font-semibold text-[#dae2fd] truncate flex items-center gap-1.5">
                      Acme Corp
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
                    </div>
                    <div className="font-mono text-[10px] text-[#c7c4d7]/70 uppercase tracking-wider truncate">
                      Production Env
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#c7c4d7] group-hover:text-white transition-colors">
                  unfold_more
                </span>
              </button>
            </div>

            {/* Views & Queues */}
            <div className="space-y-0.5">
              <div className="px-1 py-1 flex items-center justify-between text-[#c7c4d7]/60 font-mono text-[10px] uppercase tracking-wider font-semibold">
                <span>Views & Queues</span>
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </div>

              {/* Assigned to Me */}
              <button
                onClick={() => {
                  setActiveQueueFilter('assigned');
                  setActiveTagFilter(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors relative text-left ${
                  activeQueueFilter === 'assigned'
                    ? 'bg-[#1E293B] text-white font-medium shadow-sm'
                    : 'text-[#c7c4d7] hover:bg-[#1E293B]/60 hover:text-white'
                }`}
              >
                {activeQueueFilter === 'assigned' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-[#8083ff]"></span>
                )}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-[#c0c1ff]">inbox</span>
                  <span className="font-medium truncate">Assigned to Me</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#171F33] text-white font-medium">
                    4
                  </span>
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-[#0F172A] text-[#c7c4d7]/80">
                    G I
                  </kbd>
                </div>
              </button>

              {/* AI Triaged */}
              <button
                onClick={() => {
                  setActiveQueueFilter('ai-triaged');
                  setActiveTagFilter(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left ${
                  activeQueueFilter === 'ai-triaged'
                    ? 'bg-[#1E293B] text-white font-medium shadow-sm'
                    : 'text-[#c7c4d7] hover:bg-[#1E293B]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-[#4cd7f6]">auto_awesome</span>
                  <span className="truncate">AI Triaged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-medium">
                    12
                  </span>
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-[#171F33] text-[#c7c4d7]/70">
                    G A
                  </kbd>
                </div>
              </button>

              {/* Urgent / SLA Breach */}
              <button
                onClick={() => {
                  setActiveQueueFilter('urgent');
                  setActiveTagFilter(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left ${
                  activeQueueFilter === 'urgent'
                    ? 'bg-[#1E293B] text-white font-medium shadow-sm'
                    : 'text-[#c7c4d7] hover:bg-[#1E293B]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-[#F43F5E]">local_fire_department</span>
                  <span className="truncate">Urgent / SLA Breach</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F43F5E]/20 text-[#F43F5E] font-bold">
                    2
                  </span>
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-[#171F33] text-[#c7c4d7]/70">
                    G U
                  </kbd>
                </div>
              </button>

              {/* Unassigned Pool */}
              <button
                onClick={() => {
                  setActiveQueueFilter('unassigned');
                  setActiveTagFilter(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left ${
                  activeQueueFilter === 'unassigned'
                    ? 'bg-[#1E293B] text-white font-medium shadow-sm'
                    : 'text-[#c7c4d7] hover:bg-[#1E293B]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-[#c7c4d7]">all_inbox</span>
                  <span className="truncate">Unassigned Pool</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#171F33] text-[#c7c4d7]">
                  28
                </span>
              </button>

              {/* All Open */}
              <button
                onClick={() => {
                  setActiveQueueFilter('all');
                  setActiveTagFilter(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left ${
                  activeQueueFilter === 'all'
                    ? 'bg-[#1E293B] text-white font-medium shadow-sm'
                    : 'text-[#c7c4d7] hover:bg-[#1E293B]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-[#c7c4d7]">folder_open</span>
                  <span className="truncate">All Open</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#171F33] text-[#c7c4d7]">
                  64
                </span>
              </button>
            </div>

            {/* Saved Tag Filters */}
            <div className="pt-2 space-y-1">
              <div className="px-1 py-1 flex items-center justify-between text-[#c7c4d7]/60 font-mono text-[10px] uppercase tracking-wider font-semibold">
                <span>Saved Tag Filters</span>
                <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-white">add</span>
              </div>
              <button
                onClick={() => setActiveTagFilter(activeTagFilter === '# enterprise-vip' ? null : '# enterprise-vip')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono text-[11px] transition-colors text-left ${
                  activeTagFilter === '# enterprise-vip' ? 'bg-[#1E293B] text-white' : 'text-[#c7c4d7] hover:bg-[#1E293B]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                <span className="truncate"># enterprise-vip</span>
              </button>
              <button
                onClick={() => setActiveTagFilter(activeTagFilter === '# auth0-migration' ? null : '# auth0-migration')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono text-[11px] transition-colors text-left ${
                  activeTagFilter === '# auth0-migration' ? 'bg-[#1E293B] text-white' : 'text-[#c7c4d7] hover:bg-[#1E293B]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                <span className="truncate"># auth0-migration</span>
              </button>
              <button
                onClick={() => setActiveTagFilter(activeTagFilter === '# billing-dispute' ? null : '# billing-dispute')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono text-[11px] transition-colors text-left ${
                  activeTagFilter === '# billing-dispute' ? 'bg-[#1E293B] text-white' : 'text-[#c7c4d7] hover:bg-[#1E293B]/60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></span>
                <span className="truncate"># billing-dispute</span>
              </button>
            </div>
          </div>

          {/* Bottom Quick Stats Widget with Sparkline */}
          <div className="p-3 bg-[#060E20] m-1 rounded-lg space-y-2 border border-white/[0.05]">
            <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#10B981]">analytics</span>
                Engineering Health
              </span>
              <span className="text-[#10B981] font-medium">Healthy</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded bg-[#0F172A]/80 border border-white/[0.04]">
                <div className="font-mono text-[10px] text-[#c7c4d7] uppercase">SLA Target</div>
                <div className="font-display text-base font-semibold text-[#10B981]">99.4%</div>
                <div className="text-[10px] text-[#c7c4d7]/70">+0.2% vs avg</div>
              </div>
              <div className="p-2 rounded bg-[#0F172A]/80 border border-white/[0.04]">
                <div className="font-mono text-[10px] text-[#c7c4d7] uppercase">MTTR Speed</div>
                <div className="font-display text-base font-semibold text-[#4cd7f6]">14m</div>
                <div className="text-[10px] text-[#c7c4d7]/70">Top 5% speed</div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-6 w-full pt-1 flex items-center justify-between">
              <svg className="w-full h-5 text-[#10B981] opacity-80" fill="none" viewBox="0 0 100 20">
                <path
                  d="M0 16 L15 14 L30 17 L45 8 L60 11 L75 5 L90 7 L100 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                ></path>
              </svg>
            </div>
          </div>
        </aside>

        {/* ========================================== */}
        {/* COLUMN 2: Ticket Stream (380px)           */}
        {/* ========================================== */}
        <section className="w-96 flex-shrink-0 bg-[#090D16] border-r border-white/[0.08] flex flex-col justify-between">
          {/* Filter & Stream Header */}
          <div className="p-2 space-y-2 bg-[#0F172A]/60 backdrop-blur-md border-b border-white/[0.05]">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-[#c7c4d7]">search</span>
              <input
                type="text"
                placeholder="Search tickets, stacks, logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-8 rounded bg-[#171F33] text-[#dae2fd] text-xs placeholder:text-[#c7c4d7]/50 focus:outline-none focus:bg-[#1E293B] border border-transparent focus:border-[#8083ff]/40 transition-colors"
              />
              <span className="absolute right-2 flex items-center gap-0.5">
                <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-[#0F172A] text-[#c7c4d7]">
                  /
                </kbd>
              </span>
            </div>

            {/* Filter Chips Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  priorityFilter === 'high'
                    ? 'bg-[#F43F5E]/25 text-[#F43F5E] ring-1 ring-[#F43F5E]/40'
                    : 'bg-[#F43F5E]/15 text-[#F43F5E] hover:bg-[#F43F5E]/25'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></span>
                Priority: High
              </button>

              <button
                type="button"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E293B] text-[#c7c4d7] hover:text-white whitespace-nowrap transition-colors"
              >
                <span>Channel: All</span>
                <span className="material-symbols-outlined text-[12px]">keyboard_arrow_down</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E293B] text-[#F59E0B] whitespace-nowrap"
              >
                <span>Sentiment: Negative</span>
              </button>
            </div>
          </div>

          {/* Ticket Cards Scroll Feed */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === currentTicket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket.id)}
                  className={`p-3 rounded-lg relative cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#0F172A] border-[#8083ff]/40 shadow-md ring-1 ring-[#8083ff]/20'
                      : 'bg-[#131B2E] border-white/[0.04] hover:bg-[#1E293B]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-[#8083ff]"></div>
                  )}

                  <div className="flex items-center justify-between mb-1 pl-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className={`${isSelected ? 'text-[#c0c1ff] font-bold' : 'text-[#c7c4d7] font-medium'}`}>
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-[#c7c4d7]/40">•</span>
                      {ticket.priority === 'P1' || ticket.priority === 'P0' ? (
                        <span className="px-1.5 py-0.2 rounded bg-[#F43F5E]/15 text-[#F43F5E] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-pulse"></span>
                          {ticket.slaMinutesRemaining}m left
                        </span>
                      ) : (
                        <span className="text-[#F59E0B] font-medium">{ticket.priorityLabel}</span>
                      )}
                    </div>

                    {/* Channel Indicator */}
                    <div className="flex items-center gap-1 text-[#c7c4d7]/80 text-[11px] font-mono">
                      {ticket.channel === 'slack' && (
                        <>
                          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">tag</span>
                          <span>Slack</span>
                        </>
                      )}
                      {ticket.channel === 'email' && (
                        <>
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          <span>Email</span>
                        </>
                      )}
                      {ticket.channel === 'api' && (
                        <>
                          <span className="material-symbols-outlined text-[14px] text-[#10B981]">api</span>
                          <span>API/Hook</span>
                        </>
                      )}
                      {ticket.channel === 'chat' && (
                        <>
                          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">forum</span>
                          <span>Chat</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pl-1">
                    <h4
                      className={`font-display text-[13px] font-semibold line-clamp-1 transition-colors ${
                        isSelected ? 'text-white' : 'text-[#dae2fd]'
                      }`}
                    >
                      {ticket.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1 text-[#c7c4d7] text-[11px]">
                      <span className="truncate text-[#dae2fd]">
                        {ticket.customer.name}{' '}
                        <span className="text-[#c7c4d7]/70 font-mono">({ticket.customer.role})</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#c7c4d7]/70 shrink-0 ml-1">
                        {ticket.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Tags & AI Metadata */}
                  <div className="mt-2 pl-1 flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      {ticket.sentiment === 'frustrated' && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F43F5E]/15 text-[#F43F5E] font-medium">
                          {ticket.sentimentLabel}
                        </span>
                      )}
                      {ticket.sentiment === 'neutral' && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#222A3D] text-[#c7c4d7]">
                          {ticket.sentimentLabel}
                        </span>
                      )}
                      {ticket.sentiment === 'positive' && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">
                          {ticket.sentimentLabel}
                        </span>
                      )}

                      {ticket.tags.map((t, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#8083ff]/15 text-[#c0c1ff]"
                        >
                          {t.replace('# ', '')}
                        </span>
                      ))}
                    </div>

                    <span className="font-mono text-[10px] text-[#4cd7f6] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">neurology</span>
                      {ticket.aiMatchScore}% match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feed Status Footer */}
          <div className="px-3 py-1.5 bg-[#0F172A]/80 border-t border-white/[0.05] flex items-center justify-between font-mono text-[10px] text-[#c7c4d7]/70">
            <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
            <span>
              Press <kbd className="px-1 py-0.5 bg-[#171F33] rounded text-white">J</kbd>/
              <kbd className="px-1 py-0.5 bg-[#171F33] rounded text-white">K</kbd> to navigate
            </span>
          </div>
        </section>

        {/* ============================================================== */}
        {/* COLUMN 3: Active Ticket Detail & Workspace Conversation View  */}
        {/* ============================================================== */}
        <main className="flex-1 flex flex-col justify-between bg-[#090D16] overflow-hidden min-w-0 relative">
          {/* Top Action Toolbar */}
          <div className="px-4 py-2 bg-[#0F172A] border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
            {/* Left: Ticket Identification & Metadata Pickers */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-[#171F33] px-2 py-1 rounded border border-white/[0.06]">
                <span className="font-mono text-xs text-[#c0c1ff] font-bold tracking-tight">
                  {currentTicket.ticketNumber}
                </span>
                <button
                  type="button"
                  title="Copy ticket ID"
                  onClick={() => navigator.clipboard.writeText(currentTicket.ticketNumber)}
                  className="text-[#c7c4d7] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                </button>
                <button
                  type="button"
                  title="Open in new window"
                  className="text-[#c7c4d7] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8083ff]/20 text-[#c0c1ff] font-mono text-[11px] font-semibold hover:bg-[#8083ff]/30 transition-colors border border-[#8083ff]/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
                  <span className="capitalize">{currentTicket.status.replace('_', ' ')}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-36 rounded-lg bg-[#1E293B] border border-[#334155] shadow-xl py-1 z-30 font-mono text-xs">
                    {(['in_progress', 'open', 'pending', 'resolved', 'snoozed'] as Ticket['status'][]).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onUpdateTicketStatus(currentTicket.id, s);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0F172A] text-[#dae2fd] capitalize transition-colors"
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#F43F5E]/15 text-[#F43F5E] font-mono text-[11px] font-semibold hover:bg-[#F43F5E]/25 transition-colors border border-[#F43F5E]/30"
                >
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  <span>{currentTicket.priorityLabel}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </button>
                {priorityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-36 rounded-lg bg-[#1E293B] border border-[#334155] shadow-xl py-1 z-30 font-mono text-xs">
                    {(['P0', 'P1', 'P2', 'P3'] as Ticket['priority'][]).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          onUpdateTicketPriority(currentTicket.id, p);
                          setPriorityDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#0F172A] text-[#dae2fd] transition-colors"
                      >
                        {p} - {p === 'P0' ? 'Critical' : p === 'P1' ? 'Urgent' : p === 'P2' ? 'High' : 'Normal'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignee Chip */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1E293B] text-[#dae2fd] text-xs border border-white/[0.05]">
                <img
                  alt={currentTicket.assignee.name}
                  className="w-4 h-4 rounded-full object-cover"
                  src={currentTicket.assignee.avatar}
                />
                <span className="font-medium text-xs">{currentTicket.assignee.name}</span>
                <span className="material-symbols-outlined text-[14px] text-[#c7c4d7]">expand_more</span>
              </div>

              {/* SLA Countdown with Live Tick */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono text-[11px] font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)] border border-[#F59E0B]/30">
                <span className="material-symbols-outlined text-[15px] animate-spin text-[#F59E0B]" style={{ animationDuration: '6s' }}>
                  timer
                </span>
                <span>{formatCountdown(secondsRemaining)}</span>
              </div>
            </div>

            {/* Right: Quick Hotkeys & Customer Inspector Toggle */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="hidden xl:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateTicketStatus(currentTicket.id, 'resolved')}
                  className="px-2 py-1 rounded bg-[#1E293B] hover:bg-[#222A3D] text-[#c7c4d7] hover:text-white flex items-center gap-1 transition-colors border border-white/[0.04]"
                >
                  <kbd className="font-mono text-[10px] text-white bg-[#0F172A] px-1 rounded">E</kbd>
                  <span>Resolve</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateTicketStatus(currentTicket.id, 'snoozed')}
                  className="px-2 py-1 rounded bg-[#1E293B] hover:bg-[#222A3D] text-[#c7c4d7] hover:text-white flex items-center gap-1 transition-colors border border-white/[0.04]"
                >
                  <kbd className="font-mono text-[10px] text-white bg-[#0F172A] px-1 rounded">S</kbd>
                  <span>Snooze</span>
                </button>
                <button
                  type="button"
                  className="px-2 py-1 rounded bg-[#1E293B] hover:bg-[#222A3D] text-[#c7c4d7] hover:text-white flex items-center gap-1 transition-colors border border-white/[0.04]"
                >
                  <kbd className="font-mono text-[10px] text-white bg-[#0F172A] px-1 rounded">T</kbd>
                  <span>Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyMacro('Applying incident escalation workflow.')}
                  className="px-2 py-1 rounded bg-[#1E293B] hover:bg-[#222A3D] text-[#c7c4d7] hover:text-white flex items-center gap-1 transition-colors border border-white/[0.04]"
                >
                  <kbd className="font-mono text-[10px] text-white bg-[#0F172A] px-1 rounded">M</kbd>
                  <span>Macro</span>
                </button>
              </div>

              {/* Customer Inspector Toggle Pill */}
              <button
                type="button"
                onClick={() => setShowCustomerDrawer(!showCustomerDrawer)}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#171F33] hover:bg-[#1E293B] text-[#dae2fd] transition-colors border border-white/[0.06]"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="font-semibold text-xs">{currentTicket.customer.company}</span>
                <span className="text-[#c7c4d7] text-[11px] hidden 2xl:inline">
                  ARR {currentTicket.customer.arr} • Health {currentTicket.customer.healthScore}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#c7c4d7]">
                  {showCustomerDrawer ? 'vertical_split' : 'dock_to_right'}
                </span>
              </button>
            </div>
          </div>

          {/* Ticket Main Canvas: AI Banner + Message Thread */}
          <div className="flex-1 flex flex-col overflow-y-auto px-6 py-4 space-y-4">
            {/* AI Summary & Context Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1E293B] via-[#8083ff]/10 to-[#222A3D] p-4 shadow-md border border-white/[0.08]">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#8083ff]/30 text-[#c0c1ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[13px] font-semibold text-white">
                        {currentTicket.aiSummary.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[10px] uppercase font-bold tracking-wider">
                        Confidence {currentTicket.aiSummary.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-[#c7c4d7] leading-relaxed max-w-3xl">
                      {currentTicket.aiSummary.description}
                    </p>

                    {/* Quick AI Suggested Action pills */}
                    <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyMacro(
                            'Please retry with header X-Nexus-Route: direct to route directly through the recycled EU pod pool.'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8083ff] text-[#0d0096] font-mono text-[11px] font-semibold hover:brightness-110 transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        <span>{currentTicket.aiSummary.suggestedMacro}</span>
                      </button>
                      {currentTicket.aiSummary.relatedIncidentId && (
                        <button
                          type="button"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#060E20] hover:bg-[#171F33] text-[#c7c4d7] hover:text-white font-mono text-[11px] transition-colors border border-white/[0.06]"
                        >
                          <span className="material-symbols-outlined text-[13px]">link</span>
                          <span>View Related Incident {currentTicket.aiSummary.relatedIncidentId}</span>
                        </button>
                      )}
                      <span className="text-[#c7c4d7]/50 text-[11px] font-mono">Suggested 2m ago</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-[#c7c4d7] hover:text-white p-1 rounded hover:bg-[#0F172A]/40"
                >
                  <span className="material-symbols-outlined text-[16px]">more_vert</span>
                </button>
              </div>
            </div>

            {/* Conversation Timeline Thread */}
            <div className="space-y-4 flex-1">
              {messages.map((msg) => {
                if (msg.authorType === 'internal_note') {
                  return (
                    <div key={msg.id} className="flex items-start gap-3 pl-8">
                      <div className="w-7 h-7 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                      </div>
                      <div className="flex-1 space-y-1 max-w-4xl">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <div className="flex items-center gap-1.5 text-[#F59E0B] font-semibold">
                            <span>{msg.authorName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-[#F59E0B]/20 text-[10px]">
                              Restricted to Staff
                            </span>
                          </div>
                          <span className="text-[#c7c4d7]/60">{msg.timeAgo}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#dae2fd] space-y-1">
                          <p className="text-xs leading-snug">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#2D3449] border border-white/[0.08] flex items-center justify-center font-display font-semibold text-[#4cd7f6] text-xs shadow-sm">
                        {msg.authorAvatar || 'AC'}
                      </div>
                      <span className="material-symbols-outlined text-[12px] absolute -bottom-1 -right-1 bg-[#0F172A] rounded-full text-[#4cd7f6] p-0.5">
                        tag
                      </span>
                    </div>
                    <div className="flex-1 space-y-1.5 max-w-4xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-[13px] font-semibold text-white">
                            {msg.authorName}
                          </span>
                          <span className="font-mono text-[10px] text-[#c7c4d7]">{msg.authorRole}</span>
                          <span className="px-1 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-[10px] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">verified</span> Verified Enterprise
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-[#c7c4d7]/60 flex items-center gap-2">
                          <span>{msg.channelBadge || 'via Slack'}</span>
                          <span>•</span>
                          <span>{msg.timestamp} ({msg.timeAgo})</span>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#dae2fd] space-y-2.5 shadow-sm">
                        <p className="text-xs leading-relaxed">{msg.content}</p>

                        {/* Syntax Highlighted Code Snippet Box */}
                        {msg.codeSnippet && (
                          <div className="rounded-lg bg-[#060E20] border border-white/[0.05] p-2.5 font-mono text-[11px] text-[#c7c4d7] overflow-x-auto space-y-1">
                            <div className="flex items-center justify-between text-[#c7c4d7]/60 text-[10px] pb-1 border-b border-white/[0.08]">
                              <span>{msg.codeSnippet.header}</span>
                            </div>
                            <pre className="font-mono text-[11px] leading-relaxed text-[#4cd7f6]/90">
                              <code>{msg.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Live Dynamic Typing Indicator */}
              <div className="flex items-center gap-2 text-[#c7c4d7]/80 font-mono text-[11px] pl-11 py-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="italic text-[#dae2fd]">{currentTicket.customer.name} is typing a response in Slack...</span>
              </div>
            </div>
          </div>

          {/* High-Performance Composer Dock */}
          <div className="p-3 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/[0.08] space-y-2">
            {/* Composer Mode Tabs & Macros */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#131B2E] p-0.5 rounded-lg font-mono text-[11px] border border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setComposerMode('public')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    composerMode === 'public'
                      ? 'bg-[#1E293B] text-white font-semibold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] text-[#8083ff]">reply</span>
                  <span>Public Reply</span>
                  <kbd className="text-[9px] text-[#c7c4d7] px-1 rounded bg-[#0F172A]">Enter</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => setComposerMode('internal')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    composerMode === 'internal'
                      ? 'bg-[#1E293B] text-white font-semibold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] text-[#F59E0B]">lock</span>
                  <span>Internal Note</span>
                  <kbd className="text-[9px] text-[#c7c4d7] px-1 rounded bg-[#0F172A]">⇧ Enter</kbd>
                </button>
              </div>

              {/* Quick Macro Buttons */}
              <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-[#c7c4d7]">
                <span className="text-[10px] mr-1">Quick Macros:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyMacro('Deploying proxy hotfix to EU-West cluster; latency ETA is 3 minutes.')
                  }
                  className="px-2 py-0.5 rounded bg-[#171F33] hover:bg-[#1E293B] text-[#4cd7f6] transition-colors border border-white/[0.04]"
                >
                  /oauth-fix
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyMacro('Escalating ticket to Tier-2 Engineering Infrastructure on-call rotations.')
                  }
                  className="px-2 py-0.5 rounded bg-[#171F33] hover:bg-[#1E293B] hover:text-white transition-colors border border-white/[0.04]"
                >
                  /escalate
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyMacro('Crediting account with SLA outage waiver for current billing cycle.')
                  }
                  className="px-2 py-0.5 rounded bg-[#171F33] hover:bg-[#1E293B] hover:text-white transition-colors border border-white/[0.04]"
                >
                  /refund
                </button>
              </div>
            </div>

            {/* Rich Text Area */}
            <div className="relative rounded-lg bg-[#060E20] border border-white/[0.08] p-2 focus-within:ring-1 focus-within:ring-[#8083ff] transition-all">
              {/* Toolstrip */}
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.06] text-[#c7c4d7] text-[13px]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setComposerText((t) => `**${t}**`)}
                    className="hover:text-white p-1 rounded hover:bg-[#1E293B]"
                    title="Bold"
                  >
                    <span className="material-symbols-outlined text-[15px]">format_bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerText((t) => `*${t}*`)}
                    className="hover:text-white p-1 rounded hover:bg-[#1E293B]"
                    title="Italic"
                  >
                    <span className="material-symbols-outlined text-[15px]">format_italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerText((t) => `\`\`\`\n${t}\n\`\`\``)}
                    className="hover:text-white p-1 rounded hover:bg-[#1E293B]"
                    title="Insert Code Block"
                  >
                    <span className="material-symbols-outlined text-[15px]">code</span>
                  </button>
                  <button
                    type="button"
                    className="hover:text-white p-1 rounded hover:bg-[#1E293B]"
                    title="Attach file"
                  >
                    <span className="material-symbols-outlined text-[15px]">attach_file</span>
                  </button>
                  <button
                    type="button"
                    className="hover:text-white p-1 rounded hover:bg-[#1E293B]"
                    title="Insert Emoji"
                  >
                    <span className="material-symbols-outlined text-[15px]">sentiment_satisfied</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#c7c4d7]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>Draft auto-saved</span>
                </div>
              </div>

              <textarea
                rows={3}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Type your response or press '/' for commands..."
                className="w-full bg-transparent text-[#dae2fd] text-xs resize-none focus:outline-none placeholder:text-[#c7c4d7]/40 leading-relaxed font-sans"
              />

              {/* Composer Bottom Action Bar */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAiPolish}
                    disabled={isPolishing}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-[#8083ff]/30 to-[#4cd7f6]/20 text-[#dae2fd] hover:from-[#8083ff]/40 hover:to-[#4cd7f6]/30 transition-all font-mono text-[11px] font-semibold shadow-sm border border-[#8083ff]/30"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                      {isPolishing ? 'progress_activity' : 'auto_fix_high'}
                    </span>
                    <span>{isPolishing ? 'Polishing...' : 'AI Polish & Refine Tone'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMacro('We are monitoring server response codes on the gateway.')
                    }
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#1E293B] hover:bg-[#171F33] text-[#c7c4d7] hover:text-white font-mono text-[11px] transition-colors border border-white/[0.04]"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>Insert Macro</span>
                    <span className="material-symbols-outlined text-[12px]">expand_more</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateTicketStatus(currentTicket.id, 'snoozed')}
                    className="px-2.5 py-1.5 rounded bg-[#1E293B] hover:bg-[#171F33] text-[#c7c4d7] hover:text-white font-mono text-[11px] transition-colors border border-white/[0.05]"
                  >
                    Snooze
                  </button>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleSend}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-l bg-[#c0c1ff] text-[#1000a9] font-display text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md"
                    >
                      <span>Send & Mark Pending</span>
                      <kbd className="text-[9px] px-1 py-0.5 rounded bg-black/20 font-mono text-black font-bold">
                        ⌘↵
                      </kbd>
                    </button>
                    <button
                      type="button"
                      className="px-1.5 py-1.5 rounded-r bg-[#8083ff] text-white hover:brightness-110 transition-colors border-l border-white/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Inspector Drawer */}
          {showCustomerDrawer && (
            <aside className="absolute top-0 right-0 bottom-0 w-80 bg-[#0F172A] border-l border-white/[0.08] p-4 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">domain</span>
                    <h3 className="font-display font-semibold text-sm text-white">Customer Profile</h3>
                  </div>
                  <button
                    onClick={() => setShowCustomerDrawer(false)}
                    className="p-1 rounded text-[#c7c4d7] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E293B] border border-white/[0.08] flex items-center justify-center font-bold text-sm text-[#4cd7f6]">
                    {currentTicket.customer.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{currentTicket.customer.name}</h4>
                    <p className="text-xs text-[#c7c4d7]">{currentTicket.customer.role}</p>
                    <p className="text-[11px] font-mono text-[#c7c4d7]/70">{currentTicket.customer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-[#060E20] border border-white/[0.05]">
                    <span className="font-mono text-[10px] text-[#c7c4d7] uppercase">Contract ARR</span>
                    <p className="font-display text-base font-semibold text-[#10B981]">
                      {currentTicket.customer.arr}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#060E20] border border-white/[0.05]">
                    <span className="font-mono text-[10px] text-[#c7c4d7] uppercase">Account Health</span>
                    <p className="font-display text-base font-semibold text-[#4cd7f6]">
                      {currentTicket.customer.healthScore} / 100
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[10px] text-[#c7c4d7] uppercase tracking-wider font-semibold">
                    Technical Environment
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#060E20] border border-white/[0.05] space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-[#c7c4d7]">
                      <span>SDK Version:</span>
                      <span className="text-white">v2.4.1 (Node/Hermes)</span>
                    </div>
                    <div className="flex justify-between text-[#c7c4d7]">
                      <span>Primary Region:</span>
                      <span className="text-white">eu-west-1 (Frankfurt)</span>
                    </div>
                    <div className="flex justify-between text-[#c7c4d7]">
                      <span>Contract Tier:</span>
                      <span className="text-[#10B981]">Enterprise Gold</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
};
