import React from 'react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-[#090D16] min-h-[calc(100vh-3.5rem)] text-[#dae2fd] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
            Engineering Health & Support Analytics
          </h1>
          <p className="text-xs text-[#c7c4d7] mt-1">
            Real-time telemetry across clusters, response times, MTTR velocity, and AI resolution rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] border border-white/[0.08] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span>Cluster: eu-west-1 (Active)</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#8083ff] text-[#0d0096] text-xs font-semibold hover:brightness-110 transition-all shadow-md">
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[11px]">
            <span>Global SLA Attainment</span>
            <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
          </div>
          <div className="font-display text-2xl font-bold text-white">99.4%</div>
          <div className="text-[11px] font-mono text-[#10B981] flex items-center gap-1">
            <span>+0.2%</span> <span className="text-[#c7c4d7]/70">vs trailing 30d (target 99.0%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[11px]">
            <span>Mean Time to Resolution (MTTR)</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">speed</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#4cd7f6]">14m 12s</div>
          <div className="text-[11px] font-mono text-[#10B981] flex items-center gap-1">
            <span>-3m 40s</span> <span className="text-[#c7c4d7]/70">faster with AI Copilot</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[11px]">
            <span>AI Autonomous Resolution</span>
            <span className="material-symbols-outlined text-[#8083ff] text-[18px]">auto_awesome</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#c0c1ff]">78.4%</div>
          <div className="text-[11px] font-mono text-[#c7c4d7]/80">
            1,170 tickets solved without human page
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#c7c4d7] font-mono text-[11px]">
            <span>Critical Incidents (P0/P1)</span>
            <span className="material-symbols-outlined text-[#F43F5E] text-[18px]">crisis_alert</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#F43F5E]">3 Active</div>
          <div className="text-[11px] font-mono text-[#F59E0B]">
            0 SLA breaches recorded this week
          </div>
        </div>
      </div>

      {/* Telemetry Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-base text-white">
              Hourly Ticket Ingestion vs Auto-Resolution
            </h3>
            <span className="font-mono text-[11px] text-[#c7c4d7]">Last 24 Hours</span>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-1 pt-4">
            {[45, 60, 32, 70, 95, 120, 80, 55, 90, 110, 140, 130, 95, 65, 80, 110, 105, 85, 70, 95, 125, 115, 80, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#8083ff]/40 to-[#4cd7f6] group-hover:brightness-125 transition-all"
                  style={{ height: `${(h / 140) * 100}%` }}
                ></div>
                <span className="text-[9px] font-mono text-[#c7c4d7]/60">{i}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="font-display font-semibold text-base text-white">Channel Distribution</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[#c7c4d7]">
                <span>Slack Connect VIP</span>
                <span className="text-white">48%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#4cd7f6] h-1.5 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#c7c4d7]">
                <span>REST API / Webhooks</span>
                <span className="text-white">26%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#8083ff] h-1.5 rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#c7c4d7]">
                <span>Email Ingestion</span>
                <span className="text-white">16%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#c7c4d7]">
                <span>In-App Chat SDK</span>
                <span className="text-white">10%</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
