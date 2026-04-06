import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Users, BarChart3, Settings } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40 via-purple-50/20 to-transparent pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 w-full p-4 pb-28 md:p-8 md:pb-8 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 flex justify-around items-center pt-2 pb-6 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <MobileNavLink to="/" icon={<LayoutDashboard size={22} />} label="Dash" />
         <MobileNavLink to="/leads" icon={<TrendingUp size={22} />} label="Leads" />
         <MobileNavLink to="/agents" icon={<Users size={22} />} label="Agents" />
         <MobileNavLink to="/reports" icon={<BarChart3 size={22} />} label="Reports" />
         <MobileNavLink to="/settings" icon={<Settings size={22} />} label="Config" />
      </div>
    </div>
  );
}

function MobileNavLink({ to, icon, label }) {
  return (
    <NavLink
       to={to}
       className={({ isActive }) =>
         `flex flex-col items-center justify-center p-2 min-w-[64px] transition-all duration-300 ${
           isActive
             ? "text-brand-600 scale-110"
             : "text-gray-400"
         }`
       }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-brand-50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]' : 'bg-transparent'}`}>
             {icon}
          </div>
          <span className={`text-[10px] font-extrabold mt-1 tracking-wide ${isActive ? 'text-brand-700' : 'text-gray-500'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
}