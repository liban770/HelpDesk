/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkspaceView } from './components/WorkspaceView';
import { AIAutomationsView } from './components/AIAutomationsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AnalyticsView } from './components/AnalyticsView';
import { SupabaseModal } from './components/SupabaseModal';
import { AuthModal } from './components/AuthModal';
import { CommandPalette } from './components/CommandPalette';
import { INITIAL_TICKETS, INITIAL_MESSAGES } from './data/mockData';
import { Ticket, TicketMessage } from './types/nexus';
import { getSupabaseConfig, getSupabaseClient } from './lib/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';

function NexusDeskApp() {
  const [activeTab, setActiveTab] = useState<'inbox-workspace' | 'ai-automations' | 'knowledge-base' | 'analytics'>('inbox-workspace');
  const [activeSidebarSection, setActiveSidebarSection] = useState('my-assigned');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('tk_8492');
  const [messagesMap, setMessagesMap] = useState<Record<string, TicketMessage[]>>(INITIAL_MESSAGES);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const { profile } = useAuth();

  // Check Supabase connection on mount
  useEffect(() => {
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);

    if (config.isConfigured) {
      loadSupabaseData();
    }
  }, []);

  const loadSupabaseData = async () => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { data: dbTickets, error } = await client.from('tickets').select('*');
      if (!error && dbTickets && dbTickets.length > 0) {
        // Map database records to frontend Ticket interface
        const mapped: Ticket[] = dbTickets.map((row: any) => ({
          id: row.id,
          ticketNumber: row.ticket_number || row.id,
          title: row.title,
          description: row.description || '',
          status: row.status || 'open',
          priority: row.priority || 'P2',
          priorityLabel: row.priority_label || 'P2 - High',
          channel: row.channel || 'slack',
          channelDetails: row.channel_details || '',
          customer: row.customer || { name: 'Customer', company: 'Acme', arr: '$0', healthScore: 90 },
          assignee: row.assignee || { name: 'Elena Rostova', role: 'Support' },
          createdAt: row.created_at,
          timeAgo: 'Just now',
          slaMinutesRemaining: row.sla_minutes_remaining || 60,
          slaCountdownFormatted: '00:60:00 until SLA breach',
          tags: row.tags || [],
          sentiment: row.sentiment || 'neutral',
          sentimentLabel: row.sentiment_label || 'Neutral',
          aiMatchScore: row.ai_match_score || 90,
          aiSummary: row.ai_summary || {
            title: 'AI Triage',
            description: 'Analyzed with Nexus LLM.',
            affectedUsers: 1,
            suggestedMacro: 'Review Ticket',
            confidence: 90,
          },
        }));
        setTickets(mapped);
      }
    } catch (err) {
      console.warn('Could not load Supabase tickets yet (table might be unseeded):', err);
    }
  };

  // Keyboard shortcut listener for global actions
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // ⌘1, ⌘2, ⌘3, ⌘4 for tab switching
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setActiveTab('inbox-workspace');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setActiveTab('ai-automations');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        setActiveTab('knowledge-base');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '4') {
        e.preventDefault();
        setActiveTab('analytics');
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  const handleSendMessage = async (ticketId: string, content: string, isInternal: boolean) => {
    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      authorType: isInternal ? 'internal_note' : 'staff_reply',
      authorName: isInternal ? 'Elena Rostova (Internal Note)' : 'Elena Rostova (You)',
      authorRole: 'Staff Support Engineer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      isStaffRestricted: isInternal,
      content,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), newMsg],
    }));

    // Update ticket status to pending if public reply
    if (!isInternal) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: 'pending' } : t))
      );
    }

    // If Supabase is connected, write to Supabase table
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('ticket_messages').insert({
          id: newMsg.id,
          ticket_id: ticketId,
          author_type: newMsg.authorType,
          author_name: newMsg.authorName,
          author_role: newMsg.authorRole,
          content: newMsg.content,
          is_staff_restricted: isInternal,
        });

        if (!isInternal) {
          await client.from('tickets').update({ status: 'pending' }).eq('id', ticketId);
        }
      } catch (err) {
        console.warn('Failed to sync message to Supabase:', err);
      }
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('tickets').update({ status }).eq('id', ticketId);
      } catch (err) {
        console.warn('Failed to update ticket status on Supabase:', err);
      }
    }
  };

  const handleUpdateTicketPriority = async (ticketId: string, priority: Ticket['priority']) => {
    const labelMap: Record<Ticket['priority'], string> = {
      P0: 'P0 - Critical',
      P1: 'P1 - Urgent',
      P2: 'P2 - High',
      P3: 'P3 - Normal',
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, priority, priorityLabel: labelMap[priority] } : t
      )
    );

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('tickets').update({ priority, priority_label: labelMap[priority] }).eq('id', ticketId);
      } catch (err) {
        console.warn('Failed to update ticket priority on Supabase:', err);
      }
    }
  };

  return (
    <div className="bg-[#090D16] min-h-screen text-[#dae2fd] antialiased">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* Main Layout Body */}
      <div className="flex pt-14">
        {/* Left Queues & Engines Sidebar */}
        <Sidebar
          activeSection={activeSidebarSection}
          setActiveSection={(sec) => {
            setActiveSidebarSection(sec);
            setActiveTab('inbox-workspace');
          }}
          onOpenAutomations={() => setActiveTab('ai-automations')}
          onOpenKnowledgeBase={() => setActiveTab('knowledge-base')}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Content Area Offset for Sidebar */}
        <div className="pl-64 flex-1 min-h-[calc(100vh-3.5rem)] min-w-0">
          {activeTab === 'inbox-workspace' && (
            <WorkspaceView
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
              messages={messagesMap[selectedTicketId] || []}
              onSendMessage={handleSendMessage}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onUpdateTicketPriority={handleUpdateTicketPriority}
            />
          )}

          {activeTab === 'ai-automations' && <AIAutomationsView />}

          {activeTab === 'knowledge-base' && (
            <KnowledgeBaseView
              onOpenNewTicket={() => {
                setActiveTab('inbox-workspace');
              }}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </div>

      {/* Supabase Integration & Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnectedChange={(connected) => {
          setIsSupabaseConnected(connected);
          if (connected) loadSupabaseData();
        }}
      />

      {/* Supabase Auth & RBAC Modal (Option B) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tickets={tickets}
        onSelectTicket={setSelectedTicketId}
        onNavigate={setActiveTab}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NexusDeskApp />
    </AuthProvider>
  );
}
