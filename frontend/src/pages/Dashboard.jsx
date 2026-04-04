import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import {
  Search, Plus, Filter, MoreVertical, Clock, Phone, CheckCircle2,
  X, User, Briefcase, AlertCircle
} from "lucide-react";
import LeadStatusChart from "../components/LeadStatusChart";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, agentsRes] = await Promise.all([
          API.get("/leads"),
          API.get("/agents"),
        ]);
        setLeads(leadsRes.data || []);
        setAgents(agentsRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchFilter = filter === "All" || lead.status === filter;
      const matchSearch =
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.source?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [leads, filter, search]);

  const stats = {
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-pulse text-lg font-medium text-brand-600">
            Loading dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Track leads, performance, and conversions</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2.5 border border-white/60 bg-white/40 backdrop-blur-md rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="New Leads" value={stats.new} icon={<Clock />} color="text-amber-500" bg="bg-amber-50" />
          <StatCard title="Contacted" value={stats.contacted} icon={<Phone />} color="text-brand-500" bg="bg-brand-50" />
          <StatCard title="Qualified" value={stats.qualified} icon={<CheckCircle2 />} color="text-emerald-500" bg="bg-emerald-50" />
        </div>

        {/* CHART + SUMMARY */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-card p-6">
             <LeadStatusChart stats={stats} />
          </div>

          <div className="glass-card p-6 flex flex-col">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Pipeline Summary</h2>
            <div className="space-y-6 flex-1">
              <SummaryRow label="New Leads" value={stats.new} total={leads.length} color="bg-amber-400" />
              <SummaryRow label="Contacted" value={stats.contacted} total={leads.length} color="bg-brand-400" />
              <SummaryRow label="Qualified" value={stats.qualified} total={leads.length} color="bg-emerald-400" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100/50">
               <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-sm font-medium">Total Pipeline</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-400">{leads.length}</span>
               </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="glass-card overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-white/50 bg-white/20 gap-4">
            <div className="flex gap-2 p-1 bg-gray-100/50 backdrop-blur-md rounded-xl overflow-x-auto w-full sm:w-auto">
              {["All", "New", "Contacted", "Qualified"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/40 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-white/50">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Assigned Agent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{lead.source || "Direct"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                            {lead.salesAgent?.name?.charAt(0) || "-"}
                          </div>
                          <span className="text-gray-600 font-semibold">{lead.salesAgent?.name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-base font-semibold">No leads found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <Modal agents={agents} setLeads={setLeads} close={() => setIsModalOpen(false)} />
        )}
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-gray-500 tracking-wide">{title}</span>
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>
    </div>
  );
}

function SummaryRow({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{value} <span className="text-gray-400 font-medium ml-1">({percentage}%)</span></span>
      </div>
      <div className="w-full bg-gray-100/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-black/5">
        <div className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    New: "bg-amber-100/80 text-amber-700 border-amber-200",
    Contacted: "bg-brand-100/80 text-brand-700 border-brand-200",
    Qualified: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function Modal({ agents, setLeads, close }) {
  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Lead</h2>
           <button onClick={close} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const newLead = {
              name: fd.get("name"),
              source: "Website",
              salesAgent: fd.get("salesAgent"),
              status: fd.get("status"),
              timeToClose: Number(fd.get("timeToClose")),
              priority: "Medium",
            };
            const res = await API.post("/leads", newLead);
            setLeads((prev) => [res.data, ...prev]);
            close();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lead Name</label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input name="name" placeholder="e.g. John Doe" required className="w-full border border-gray-200/50 bg-white/50 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow" />
            </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Agent</label>
             <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select name="salesAgent" className="w-full border border-gray-200/50 bg-white/50 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none transition-shadow">
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select name="status" className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Days to Close</label>
                <input name="timeToClose" type="number" min="0" placeholder="e.g. 14" required className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
             </div>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={close} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Cancel
             </button>
             <button type="submit" className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all active:scale-[0.98]">
               Create Lead
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}