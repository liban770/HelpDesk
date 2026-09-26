import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, signInWithPassword, signUpWithPassword, signOut, switchMockRole } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff_engineer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (mode === 'signin') {
      const res = await signInWithPassword(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Successfully authenticated with Supabase!');
        setTimeout(() => onClose(), 1200);
      } else {
        setErrorMessage(res.error || 'Failed to authenticate');
      }
    } else {
      const res = await signUpWithPassword(email, password, fullName, selectedRole);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Account created and logged in with Supabase Auth!');
        setTimeout(() => onClose(), 1200);
      } else {
        setErrorMessage(res.error || 'Failed to register account');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl bg-[#0F172A] border border-[#334155] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#1E293B]/70 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-white">
                NexusDesk Identity & RBAC
              </h2>
              <p className="text-xs text-[#c7c4d7]/70 font-mono">
                Supabase Auth (Option B)
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Active User Card */}
          {user ? (
            <div className="p-3.5 rounded-lg bg-[#060E20] border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[#10B981] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  Supabase Session Active
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff] uppercase">
                  {profile?.role.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{profile?.fullName}</div>
              <div className="font-mono text-xs text-[#c7c4d7]">{user.email}</div>
              <div className="text-[11px] text-[#c7c4d7]/80">
                Department: <span className="text-white">{profile?.department}</span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1.5 rounded bg-[#F43F5E]/20 text-[#F43F5E] hover:bg-[#F43F5E]/30 text-xs font-mono font-semibold transition-colors"
                >
                  Sign Out of Supabase
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-[#1E293B] text-white text-xs hover:bg-[#222A3D] transition-colors"
                >
                  Continue as Agent
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick RBAC Role Switcher */}
              <div className="p-3 rounded-lg bg-[#060E20] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#c7c4d7] uppercase tracking-wider font-semibold">
                    Current Agent Profile:
                  </span>
                  <span className="font-mono text-[10px] text-[#4cd7f6] uppercase">
                    {profile?.role}
                  </span>
                </div>
                <div className="text-xs text-white font-semibold flex items-center gap-2">
                  <img
                    alt={profile?.fullName}
                    className="w-5 h-5 rounded-full object-cover"
                    src={profile?.avatarUrl}
                  />
                  <span>{profile?.fullName}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-mono text-[10px] text-[#c7c4d7]">Role Switcher:</span>
                  {(['staff_engineer', 'admin', 'tier2_lead', 'viewer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchMockRole(r)}
                      className={`font-mono text-[10px] px-2 py-0.5 rounded transition-colors ${
                        profile?.role === r
                          ? 'bg-[#8083ff] text-[#0d0096] font-bold'
                          : 'bg-[#1E293B] text-[#c7c4d7] hover:text-white'
                      }`}
                    >
                      {r === 'staff_engineer' ? 'Staff' : r === 'tier2_lead' ? 'Lead' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex border-b border-[#334155] gap-4 font-mono text-xs">
                <button
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    mode === 'signin'
                      ? 'border-[#8083ff] text-[#c0c1ff]'
                      : 'border-transparent text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  Sign In to Supabase
                </button>
                <button
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    mode === 'signup'
                      ? 'border-[#8083ff] text-[#c0c1ff]'
                      : 'border-transparent text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  Create Supabase User
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#060E20] border border-[#334155] text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#8083ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1">
                        ROLE ASSIGNMENT
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#060E20] border border-[#334155] text-xs text-white font-mono focus:outline-none focus:border-[#8083ff]"
                      >
                        <option value="staff_engineer">Staff Support Engineer (Triage, Compose, Macros)</option>
                        <option value="tier2_lead">Tier 2 Escalation Lead (All Workflows, SLA Overrides)</option>
                        <option value="admin">Platform Admin (Database, Schema, User Management)</option>
                        <option value="viewer">Viewer (Read-only tickets & telemetry)</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="agent@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#060E20] border border-[#334155] text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#8083ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#c7c4d7] mb-1">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#060E20] border border-[#334155] text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#8083ff]"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-xs text-[#F43F5E] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-2.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs rounded bg-[#1E293B] text-[#c7c4d7] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 text-xs font-semibold rounded bg-[#8083ff] text-[#0d0096] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[14px]">progress_activity</span>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        <span>{mode === 'signin' ? 'Sign In with Supabase' : 'Create Account'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
