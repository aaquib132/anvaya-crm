import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings 
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 glass z-20 flex-col hidden md:flex h-screen sticky top-0 m-4 rounded-3xl overflow-hidden self-start">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-400 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl">
             <LayoutDashboard className="w-6 h-6 text-brand-600" />
          </div>
          Anvaya
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/leads" icon={<TrendingUp size={20} />} label="Leads" />
        <SidebarLink to="/agents" icon={<Users size={20} />} label="Agents" />
        <SidebarLink to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
        
        <div className="pt-6 mt-6 border-t border-gray-100/50">
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </nav>

      <div className="p-4 m-4 glass-card bg-white/50">
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
            AA
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Aaquib Ahmad</p>
            <p className="text-xs text-brand-600 font-medium">Admin Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
       to={to}
       className={({ isActive }) =>
         `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
           isActive
             ? "text-brand-700 bg-white shadow-sm shadow-brand-500/10"
             : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
         }`
       }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full" />
          )}
          <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`}>
             {icon}
          </span>
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
}