import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenAutomations: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenSupabaseModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onOpenAutomations,
  onOpenKnowledgeBase,
  onOpenSupabaseModal,
}) => {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#0F172A] border-r border-white/[0.08] z-40 flex flex-col justify-between overflow-y-auto">
      <div className="p-2 space-y-3">
        {/* Queues Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-[#c7c4d7]/70 tracking-wider font-semibold">
            Queues & Triage
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#c7c4d7] hover:text-white cursor-pointer">
            filter_list
          </span>
        </div>

        {/* Queues Navigation */}
        <nav className="space-y-0.5 text-xs">
          <button
            onClick={() => setActiveSection('my-assigned')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors border ${
              activeSection === 'my-assigned'
                ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">inbox</span>
              <span>My Assigned</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#090D16] border border-white/[0.08] text-[#c7c4d7]">
              14
            </span>
          </button>

          <button
            onClick={() => setActiveSection('ai-triaged')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors border ${
              activeSection === 'ai-triaged'
                ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">auto_awesome</span>
              <span>AI Triaged</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#090D16] border border-white/[0.08] text-[#4cd7f6]">
              8
            </span>
          </button>

          <button
            onClick={() => setActiveSection('urgent-incidents')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors border ${
              activeSection === 'urgent-incidents'
                ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#F43F5E]">error</span>
              <span>P0 / Urgent</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] font-semibold">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveSection('team-queue')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors border ${
              activeSection === 'team-queue'
                ? 'bg-[#1E293B] text-[#dae2fd] border-white/[0.08] font-medium'
                : 'text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">all_inbox</span>
              <span>Team Queue</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#090D16] border border-white/[0.08] text-[#c7c4d7]">
              42
            </span>
          </button>
        </nav>

        {/* AI Copilot Engines Header */}
        <div className="pt-2 border-t border-white/[0.08]">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#c7c4d7]/70 tracking-wider font-semibold">
              AI Copilot Engines
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#c7c4d7] hover:text-white cursor-pointer">
              tune
            </span>
          </div>

          <nav className="space-y-0.5 text-xs">
            <button
              onClick={onOpenAutomations}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 transition-colors border border-transparent text-left"
            >
              <span className="material-symbols-outlined text-[18px]">neurology</span>
              <span>Autonomous Agents</span>
            </button>
            <button
              onClick={onOpenAutomations}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 transition-colors border border-transparent text-left"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>SLA Workflows</span>
            </button>
            <button
              onClick={onOpenKnowledgeBase}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#1E293B]/60 transition-colors border border-transparent text-left"
            >
              <span className="material-symbols-outlined text-[18px]">library_books</span>
              <span>Doc Embeddings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-2 border-t border-white/[0.08] bg-[#090D16]/50">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#c7c4d7]">memory</span>
            <div className="leading-tight">
              <p className="font-mono text-[10px] text-[#dae2fd]">Nexus LLM v4.2</p>
              <p className="font-mono text-[10px] text-[#10B981]">Model Ready</p>
            </div>
          </div>
          <button
            onClick={onOpenSupabaseModal}
            className="text-[#c7c4d7] hover:text-white p-1 rounded hover:bg-[#1E293B] transition-colors"
            title="Nexus & Supabase Configuration"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
