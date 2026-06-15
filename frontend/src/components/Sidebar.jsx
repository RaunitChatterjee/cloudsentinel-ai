import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Radar,
} from 'lucide-react';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/findings',
    label: 'Findings',
    icon: ShieldAlert,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col bg-[#0d1321] border-r border-slate-800">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30">
          <Radar className="w-4 h-4 text-cyan-400" />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-100">
            CloudSentinel
          </p>

          <p className="text-[10px] text-cyan-500 font-medium uppercase tracking-widest">
            AI
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        {navItems.map(
          ({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 border-t border-gray-800/60">
        <p className="text-[10px] text-gray-600">
          AWS Misconfiguration Scanner
        </p>

        <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-medium text-cyan-500/70 bg-cyan-500/10 border border-cyan-500/15 rounded px-1.5 py-0.5 tracking-wide">
          v0.1.0 — Alpha
        </span>
      </div>
    </aside>
  );
}