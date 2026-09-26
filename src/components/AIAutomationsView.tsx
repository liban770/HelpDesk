import React, { useState } from 'react';

export const AIAutomationsView: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [systemPrompt, setSystemPrompt] = useState(
    'Analyze incoming ticket body and headers. Detect whether user is experiencing blocking outage, sentiment score < -0.6, or belongs to Tier-1 ARR accounts.'
  );
  const [selectedNode, setSelectedNode] = useState<'classifier' | 'trigger' | 'condition' | 'action' | 'docs'>('classifier');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveNode = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden select-none bg-[#090D16] text-[#dae2fd]">
      {/* Top Command Toolbar */}
      <header className="w-full h-14 bg-[#0F172A]/95 backdrop-blur-md px-6 flex items-center justify-between z-30 shadow-md border-b border-white/[0.08]">
        {/* Title & Workflow Meta */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#171F33] border border-white/[0.08] flex items-center justify-center text-[#8083ff] shadow-sm">
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-base font-semibold text-white tracking-tight">
                  Auto-Triage & Urgent Incident Escalation
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1E293B] text-[#c7c4d7] font-medium border border-white/[0.06]">
                  v3.2
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                  </span>
                  <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider font-semibold">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#c7c4d7] font-mono text-[10px]">
                <span>Last run 42s ago</span>
                <span className="opacity-40">•</span>
                <span>1,492 executions today</span>
                <span className="opacity-40">•</span>
                <span className="text-[#10B981] font-medium">99.8% success rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Canvas Toolset */}
        <div className="flex items-center gap-4">
          {/* Canvas Geometry Controls */}
          <div className="flex items-center bg-[#171F33] rounded-lg p-1 gap-1 border border-white/[0.06]">
            <button
              onClick={() => setZoom((z) => Math.max(40, z - 10))}
              className="p-1.5 rounded hover:bg-[#1E293B] text-[#c7c4d7] hover:text-white transition-colors"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono text-xs text-white px-1.5 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(180, z + 10))}
              className="p-1.5 rounded hover:bg-[#1E293B] text-[#c7c4d7] hover:text-white transition-colors"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
            <div className="w-px h-4 bg-[#1E293B] mx-0.5"></div>
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`p-1.5 rounded transition-colors ${
                snapToGrid ? 'bg-[#1E293B] text-[#4cd7f6]' : 'text-[#c7c4d7] hover:text-white'
              }`}
              title="Toggle Snap-to-Grid"
            >
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
            </button>
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={`p-1.5 rounded transition-colors ${
                showMinimap ? 'bg-[#1E293B] text-[#4cd7f6]' : 'text-[#c7c4d7] hover:text-white'
              }`}
              title="Toggle Minimap"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
            </button>
          </div>

          <div className="w-px h-6 bg-[#171F33]"></div>

          {/* Execution & Publish Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded bg-[#171F33] hover:bg-[#1E293B] text-[#dae2fd] text-xs flex items-center gap-1.5 border border-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#8083ff]">play_arrow</span>
              <span>Test Workflow</span>
              <kbd className="px-1 py-0.2 rounded bg-[#090D16] text-[#c7c4d7] font-mono text-[10px]">⌘T</kbd>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded bg-[#171F33] hover:bg-[#1E293B] text-[#c7c4d7] hover:text-white text-xs flex items-center gap-1.5 border border-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Execution Logs</span>
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded bg-[#8083ff] text-[#0d0096] font-display text-xs font-semibold hover:brightness-110 active:scale-95 shadow-md flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Publish Changes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Canvas & Inspector Main Area */}
      <div className="relative flex-1 w-full overflow-hidden flex">
        {/* Infinite Canvas Stage */}
        <div className="relative flex-1 h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#090D16]">
          {/* Subtle Dot Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>

          {/* Ambient Glow Backdrops */}
          <div className="absolute top-36 left-48 w-80 h-80 rounded-full bg-[#4cd7f6]/5 blur-3xl pointer-events-none"></div>
          <div className="absolute top-44 left-[520px] w-96 h-96 rounded-full bg-[#8083ff]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute top-28 left-[950px] w-96 h-96 rounded-full bg-[#F43F5E]/5 blur-3xl pointer-events-none"></div>

          {/* SVG Connection Graph Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <linearGradient id="cyan-to-indigo" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8083ff" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="indigo-to-amber" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#8083ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="amber-to-emerald" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="indigo-to-cyan-alt" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#8083ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Path 1: Trigger -> LLM Node */}
            <path
              d="M 330 180 C 420 180, 440 200, 520 200"
              fill="none"
              stroke="#4cd7f6"
              strokeOpacity="0.2"
              strokeWidth="6"
            />
            <path
              d="M 330 180 C 420 180, 440 200, 520 200"
              fill="none"
              stroke="url(#cyan-to-indigo)"
              strokeDasharray="6,4"
              strokeWidth="2.5"
              className="animate-pulse"
            />

            {/* Path 2: LLM Branch A (Urgent) -> Condition Filter Node */}
            <path
              d="M 830 200 C 890 200, 900 160, 950 160"
              fill="none"
              stroke="#8083ff"
              strokeOpacity="0.2"
              strokeWidth="6"
            />
            <path
              d="M 830 200 C 890 200, 900 160, 950 160"
              fill="none"
              stroke="url(#indigo-to-amber)"
              strokeDasharray="7,5"
              strokeWidth="2.5"
            />

            {/* Path 3: Condition Filter [True Branch] -> Multi-Action Node 4 */}
            <path
              d="M 1240 160 C 1300 160, 1310 190, 1370 190"
              fill="none"
              stroke="#F59E0B"
              strokeOpacity="0.2"
              strokeWidth="6"
            />
            <path
              d="M 1240 160 C 1300 160, 1310 190, 1370 190"
              fill="none"
              stroke="url(#amber-to-emerald)"
              strokeDasharray="8,4"
              strokeWidth="2.5"
            />

            {/* Path 4: LLM Branch B (Standard) -> Auto Knowledge Suggestion */}
            <path
              d="M 830 250 C 920 250, 950 460, 1020 460"
              fill="none"
              stroke="url(#indigo-to-cyan-alt)"
              strokeDasharray="4,6"
              strokeWidth="2"
            />

            {/* Live Particle Dots */}
            <circle cx="430" cy="190" fill="#4cd7f6" r="3.5" />
            <circle cx="890" cy="180" fill="#c0c1ff" r="3.5" />
            <circle cx="1305" cy="175" fill="#10B981" r="3.5" />
          </svg>

          {/* Nodes Container */}
          <div
            className="relative w-full h-full z-20 transition-transform origin-top-left"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* NODE 1: Trigger Node */}
            <div
              onClick={() => setSelectedNode('trigger')}
              className={`absolute top-24 left-16 w-72 rounded-xl bg-[#0F172A] p-4 shadow-xl border cursor-pointer transition-all ${
                selectedNode === 'trigger' ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]/40' : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#4cd7f6]/15 flex items-center justify-center text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[18px]">webhook</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#4cd7f6] font-semibold uppercase tracking-wider">
                      Trigger Source
                    </span>
                    <h4 className="font-display text-[13px] font-semibold text-white leading-snug">
                      When New Ticket Created
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 bg-[#060E20]/60 rounded p-2.5 text-xs">
                <div className="flex items-center justify-between text-[#c7c4d7]">
                  <span>Listening Channels</span>
                  <span className="font-mono text-white">4 Active</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#4cd7f6]">#Slack</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#4cd7f6]">Email API</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#4cd7f6]">Intercom</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#4cd7f6]">REST Hook</span>
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 flex items-center justify-between font-mono text-[10px] text-[#c7c4d7]">
                <div className="flex items-center gap-1 text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>Webhook Healthy</span>
                </div>
                <span>Event: #TK-POST</span>
              </div>
            </div>

            {/* NODE 2: AI Inference Node (Selected Active) */}
            <div
              onClick={() => setSelectedNode('classifier')}
              className={`absolute top-16 left-[520px] w-80 rounded-xl bg-[#0F172A] p-4 shadow-2xl border cursor-pointer transition-all ${
                selectedNode === 'classifier'
                  ? 'border-[#8083ff] ring-2 ring-[#8083ff] shadow-[0_0_24px_rgba(128,131,255,0.25)]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#c0c1ff] font-semibold uppercase tracking-wider">
                        AI Inference
                      </span>
                      {selectedNode === 'classifier' && (
                        <span className="font-mono text-[9px] px-1 rounded bg-[#8083ff]/30 text-[#c0c1ff]">
                          Selected
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-[13px] font-semibold text-white leading-snug">
                      Nexus LLM Classifier
                    </h4>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#8083ff]">tune</span>
              </div>

              <div className="space-y-2 bg-[#060E20]/80 rounded p-2.5 mb-2 border border-white/[0.04]">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#c7c4d7]">Engine</span>
                  <span className="text-[#c0c1ff] font-semibold">Nexus-Triage-v4.2-Pro</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#c7c4d7]">Dimensions</span>
                  <span className="text-white">Sentiment, Urgency, SLA, Tech</span>
                </div>
                <div className="w-full bg-[#171F33] rounded-full h-1 overflow-hidden mt-1">
                  <div className="bg-[#8083ff] h-1 rounded-full" style={{ width: `${confidenceThreshold * 100}%` }}></div>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-[#c7c4d7] pt-0.5">
                  <span>Confidence Target</span>
                  <span className="text-white">{(confidenceThreshold * 100).toFixed(0)}% (strict)</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between px-2 py-1 rounded bg-[#222A3D]/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span>
                    <span className="text-white font-medium text-xs">Branch A: Urgent / Negative</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#F43F5E] font-medium">High SLA</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-[#171F33]/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
                    <span className="text-[#c7c4d7] text-xs">Branch B: Standard / Inquiry</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#c7c4d7]">P3 Low</span>
                </div>
              </div>
            </div>

            {/* NODE 3: Conditional Filter Node */}
            <div
              onClick={() => setSelectedNode('condition')}
              className={`absolute top-12 left-[950px] w-72 rounded-xl bg-[#0F172A] p-4 shadow-xl border cursor-pointer transition-all ${
                selectedNode === 'condition' ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/40' : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
                    <span className="material-symbols-outlined text-[18px]">call_split</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#F59E0B] font-semibold uppercase tracking-wider">
                      Logic Gate
                    </span>
                    <h4 className="font-display text-[13px] font-semibold text-white leading-snug">
                      Condition Filter
                    </h4>
                  </div>
                </div>
              </div>

              <div className="bg-[#060E20]/70 rounded p-2.5 font-mono text-[10px] space-y-1 mb-2 border border-white/[0.04]">
                <div className="text-[#c7c4d7] font-medium">Evaluation Rule:</div>
                <div className="text-[#F59E0B] bg-[#1E293B] p-1.5 rounded">
                  sentiment == &apos;CRITICAL&apos;<br />
                  <span className="text-[#c7c4d7] font-bold">OR</span> arr &gt; $50,000
                </div>
              </div>

              <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[#10B981]/10 text-xs">
                <span className="text-[#10B981] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  True Path Escalation
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                  Lead Route
                </span>
              </div>
            </div>

            {/* NODE 4: Multi-Action Execution Node */}
            <div
              onClick={() => setSelectedNode('action')}
              className={`absolute top-10 left-[1370px] w-80 rounded-xl bg-[#0F172A] p-4 shadow-2xl border cursor-pointer transition-all ${
                selectedNode === 'action' ? 'border-[#10B981] ring-2 ring-[#10B981]/40' : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#10B981] font-semibold uppercase tracking-wider">
                      Multi-Action Runner
                    </span>
                    <h4 className="font-display text-[13px] font-semibold text-white leading-snug">
                      Escalate to Tier 2 & Page
                    </h4>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-semibold">
                  4 Tasks
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#060E20]/60">
                  <span className="font-mono text-[10px] text-[#F43F5E] font-bold w-4">1.</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F43F5E]">priority_high</span>
                  <span className="text-white">Set Priority = <strong className="text-[#F43F5E]">P1 Critical</strong></span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#060E20]/60">
                  <span className="font-mono text-[10px] text-[#c7c4d7] font-bold w-4">2.</span>
                  <span className="material-symbols-outlined text-[16px] text-[#8083ff]">groups</span>
                  <span className="text-white">Assign to: Senior Escalation Pool</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#060E20]/60">
                  <span className="font-mono text-[10px] text-[#F59E0B] font-bold w-4">3.</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">notifications_active</span>
                  <span className="text-white">Trigger PagerDuty Incident Alert</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#060E20]/60">
                  <span className="font-mono text-[10px] text-[#4cd7f6] font-bold w-4">4.</span>
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">smart_toy</span>
                  <span className="text-white">Draft AI Empathetic Response</span>
                </div>
              </div>
            </div>

            {/* NODE 5: Parallel Branch Node */}
            <div
              onClick={() => setSelectedNode('docs')}
              className={`absolute top-[420px] left-[1020px] w-76 rounded-xl bg-[#0F172A] p-4 shadow-lg border cursor-pointer transition-all ${
                selectedNode === 'docs' ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]/40' : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#4cd7f6]/15 flex items-center justify-center text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[18px]">library_books</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#4cd7f6] font-semibold uppercase tracking-wider">
                      Parallel Action
                    </span>
                    <h4 className="font-display text-[13px] font-semibold text-white leading-snug">
                      Auto-Suggest Docs
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#c7c4d7] mb-2 leading-relaxed">
                Synthesizes top 3 verified Vector KB answers and posts internal draft comment to assigned agent.
              </p>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#c7c4d7] bg-[#060E20]/50 p-2 rounded border border-white/[0.04]">
                <span>Embedding Engine: Ada-002</span>
                <span className="text-[#4cd7f6] font-medium">94% match</span>
              </div>
            </div>
          </div>

          {/* Floating Minimap Overlay */}
          {showMinimap && (
            <div className="absolute bottom-6 left-6 w-48 h-32 rounded-lg bg-[#0F172A]/90 backdrop-blur-md p-2 shadow-2xl border border-white/[0.08] flex flex-col justify-between z-30">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[10px] text-[#c7c4d7] font-medium">Canvas Overview</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              </div>
              <div className="relative w-full flex-1 bg-[#090D16]/80 rounded overflow-hidden border border-white/[0.04]">
                <div className="absolute top-2 left-2 w-6 h-4 rounded bg-[#4cd7f6]/50"></div>
                <div className="absolute top-3 left-12 w-8 h-6 rounded bg-[#8083ff] ring-1 ring-[#8083ff]/80"></div>
                <div className="absolute top-2 left-24 w-6 h-5 rounded bg-[#F59E0B]/60"></div>
                <div className="absolute top-1 left-32 w-8 h-7 rounded bg-[#10B981]/70"></div>
                <div className="absolute top-8 left-24 w-7 h-5 rounded bg-[#4cd7f6]/40"></div>
                <div className="absolute inset-0.5 border border-dashed border-[#8083ff]/60 rounded pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Floating Property Inspector Panel */}
        <aside className="w-80 h-full bg-[#0F172A] border-l border-white/[0.08] flex flex-col z-30 shadow-2xl overflow-y-auto">
          {/* Header */}
          <div className="p-4 bg-[#1E293B]/40 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#8083ff]">psychology</span>
              <div>
                <span className="font-mono text-[10px] text-[#c0c1ff] font-semibold uppercase tracking-wider">
                  Node Inspector
                </span>
                <h3 className="font-display font-semibold text-sm text-white leading-tight">
                  Nexus LLM Classifier
                </h3>
              </div>
            </div>
          </div>

          {/* Telemetry & Latency */}
          <div className="px-4 py-2 bg-[#060E20]/40 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#c7c4d7]">
              <span className="material-symbols-outlined text-[15px] text-[#10B981]">speed</span>
              <span>Avg Latency:</span>
              <span className="text-white font-semibold">142ms</span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-medium border border-[#10B981]/20">
              99.9% Uptime
            </span>
          </div>

          {/* Configuration Body */}
          <div className="p-4 space-y-4 flex-1 text-xs">
            {/* System Instructions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-white font-medium">System Instructions</label>
                <button
                  type="button"
                  onClick={() => setSystemPrompt((p) => `${p} [VIP_OVERRIDE]`)}
                  className="font-mono text-[10px] text-[#8083ff] hover:underline"
                >
                  Insert Tag
                </button>
              </div>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-[#060E20] border border-white/[0.08] text-[#dae2fd] font-mono text-[11px] p-2.5 rounded outline-none focus:border-[#8083ff] shadow-inner resize-none leading-relaxed"
              />
            </div>

            {/* Model Engine */}
            <div className="space-y-1.5">
              <label className="text-white font-medium">Model Engine</label>
              <div className="w-full bg-[#060E20] border border-white/[0.08] px-3 py-2 rounded flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#8083ff]">neurology</span>
                  <span>Nexus-Triage-v4.2-Pro</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#c7c4d7]">unfold_more</span>
              </div>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-white font-medium">Confidence Threshold</label>
                <span className="font-mono text-[#c0c1ff] font-semibold">
                  {confidenceThreshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#171F33] rounded-lg appearance-none cursor-pointer accent-[#8083ff]"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#c7c4d7]">
                <span>0.50 (Permissive)</span>
                <span>0.99 (Strict)</span>
              </div>
            </div>

            {/* Fallback Route */}
            <div className="space-y-1.5">
              <label className="text-white font-medium">Fallback Route (On Error)</label>
              <div className="w-full bg-[#060E20] border border-white/[0.08] px-3 py-2 rounded flex items-center justify-between text-xs text-[#c7c4d7]">
                <span>Queue: General Triage Bucket</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </div>
            </div>

            {/* Sample Test Payload */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Sample Test Payload</span>
                <span className="font-mono text-[10px] text-[#4cd7f6] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">refresh</span> Re-run
                </span>
              </div>
              <div className="bg-[#060E20] border border-white/[0.08] p-2.5 rounded font-mono text-[10px] text-[#c7c4d7] overflow-x-auto shadow-inner">
                <pre className="text-white leading-tight">
                  <span className="text-[#4cd7f6]">{'{'}</span>
                  {'\n  '}<span className="text-[#8083ff]">&quot;ticket_id&quot;</span>: <span className="text-[#F59E0B]">&quot;NX-89412&quot;</span>,
                  {'\n  '}<span className="text-[#8083ff]">&quot;sentiment_score&quot;</span>: <span className="text-[#F43F5E]">-0.88</span>,
                  {'\n  '}<span className="text-[#8083ff]">&quot;inferred_urgency&quot;</span>: <span className="text-[#F59E0B]">&quot;P0_BLOCKING&quot;</span>,
                  {'\n  '}<span className="text-[#8083ff]">&quot;account_arr&quot;</span>: <span className="text-[#10B981]">124000</span>,
                  {'\n  '}<span className="text-[#8083ff]">&quot;classification&quot;</span>: <span className="text-[#F43F5E]">&quot;Urgent / Negative&quot;</span>,
                  {'\n  '}<span className="text-[#8083ff]">&quot;latency_ms&quot;</span>: <span className="text-[#10B981]">138</span>
                  {'\n'}<span className="text-[#4cd7f6]">{'}'}</span>
                </pre>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#090D16]/90 border-t border-white/[0.08] flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfidenceThreshold(0.85);
                setSystemPrompt(
                  'Analyze incoming ticket body and headers. Detect whether user is experiencing blocking outage, sentiment score < -0.6, or belongs to Tier-1 ARR accounts.'
                );
              }}
              className="flex-1 py-1.5 rounded bg-[#1E293B] hover:bg-[#222A3D] text-[#dae2fd] text-xs transition-colors border border-white/[0.06]"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSaveNode}
              className="flex-1 py-1.5 rounded bg-[#8083ff] text-[#0d0096] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              {savedNotification ? 'Saved ✓' : 'Save Node'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
