import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import {
  Plus, Clock, Phone, CheckCircle2,
  X, User, Briefcase, AlertCircle, ChevronRight, Send, ShieldCheck
} from "lucide-react";
import LeadStatusChart from "../components/LeadStatusChart";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

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
      return matchFilter;
    });
  }, [leads, filter]);

  const stats = {
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    proposalSent: leads.filter((l) => l.status === "Proposal Sent").length,
    closed: leads.filter((l) => l.status === "Closed").length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
           <div className="glass-card px-8 py-6 flex flex-col items-center gap-4 border border-white/60 shadow-lg animate-in zoom-in-95 duration-500">
             <div className="relative">
                <div className="w-12 h-12 border-4 border-brand-100 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-brand-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
             </div>
             <div className="text-brand-700 font-bold bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100 shadow-sm animate-pulse">
               Loading Dashboard...
             </div>
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track leads, performance, and conversions</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 cursor-pointer hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            >
              <Plus size={18} />
              <span className="sm:inline font-bold">Add Lead</span>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="New Leads" value={stats.new} icon={<Clock size={20} />} color="text-amber-500" bg="bg-amber-50" linkTo="/status/New" />
          <StatCard title="Contacted" value={stats.contacted} icon={<Phone size={20} />} color="text-blue-500" bg="bg-blue-50" linkTo="/status/Contacted" />
          <StatCard title="Qualified" value={stats.qualified} icon={<CheckCircle2 size={20} />} color="text-emerald-500" bg="bg-emerald-50" linkTo="/status/Qualified" />
          <StatCard title="Proposal Sent" value={stats.proposalSent} icon={<Send size={20} />} color="text-purple-500" bg="bg-purple-50" linkTo="/status/Proposal%20Sent" />
          <StatCard title="Closed" value={stats.closed} icon={<ShieldCheck size={20} />} color="text-indigo-500" bg="bg-indigo-50" linkTo="/status/Closed" />
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
              <SummaryRow label="Contacted" value={stats.contacted} total={leads.length} color="bg-blue-400" />
              <SummaryRow label="Qualified" value={stats.qualified} total={leads.length} color="bg-emerald-400" />
              <SummaryRow label="Proposal Sent" value={stats.proposalSent} total={leads.length} color="bg-purple-400" />
              <SummaryRow label="Closed" value={stats.closed} total={leads.length} color="bg-indigo-400" />
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
              {["All", "New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 cursor-pointer rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
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
                    <tr 
                      key={lead.id || lead._id} 
                      onClick={() => navigate(`/leads/${lead.id || lead._id}`)}
                      className="hover:bg-white/50 transition-all group cursor-pointer"
                    >
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
                         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-400 group-hover:text-brand-600 group-hover:bg-brand-50 rounded-xl transition-all font-semibold text-sm">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 hidden sm:inline-block">View Details</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                         </div>
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

function StatCard({ title, value, icon, color, bg, linkTo }) {
  const content = (
    <div className={`glass-card p-6 flex flex-col justify-between transition-all h-full ${linkTo ? 'hover:-translate-y-1 hover:shadow-lg hover:border-brand-200' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-gray-500 tracking-wide">{title}</span>
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>
    </div>
  );
  return linkTo ? <Link to={linkTo} className="block h-full">{content}</Link> : content;
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
    Contacted: "bg-blue-100/80 text-blue-700 border-blue-200",
    Qualified: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
    "Proposal Sent": "bg-purple-100/80 text-purple-700 border-purple-200",
    Closed: "bg-indigo-100/80 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function Modal({ agents, setLeads, close }) {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    API.get("/tags").then((res) => setTags(res.data)).catch(console.error);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex justify-center items-start z-50 pb-12 transition-all duration-300 overflow-y-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-white p-8 rounded-4xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 my-8">
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
              source: fd.get("source"),
              salesAgent: fd.get("salesAgent"),
              status: fd.get("status"),
              timeToClose: Number(fd.get("timeToClose")),
              priority: fd.get("priority"),
              tags: fd.getAll("tags"),
            };
            try {
              const res = await API.post("/leads", newLead);
              setLeads((prev) => [res.data, ...prev]);
              close();
              showToast("Lead added successfully!");
            } catch (err) {
              console.error(err);
              showToast(err.response?.data?.error || "Failed to add lead.", "error");
            }
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lead Source</label>
            <select name="source" className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
               <option>Website</option>
               <option>Referral</option>
               <option>Social Media</option>
               <option>Direct</option>
               <option>Cold Call</option>
               <option>Advertisement</option>
               <option>Email</option>
               <option>Other</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Agent</label>
             <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select name="salesAgent" className="w-full border border-gray-200/50 bg-white/50 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none transition-shadow">
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                <select name="priority" className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                 <select name="status" className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
                   <option>New</option>
                   <option>Contacted</option>
                   <option>Qualified</option>
                   <option>Proposal Sent</option>
                   <option>Closed</option>
                 </select>
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Days to Close</label>
             <input name="timeToClose" type="number" min="0" placeholder="e.g. 14" required className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
             <select name="tags" multiple className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow h-24">
               {tags.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
             </select>
             <p className="text-xs text-gray-400 mt-1">Hold Ctrl (or Cmd) to select multiple tags</p>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={close} className="flex-1 px-4 py-3 cursor-pointer rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Cancel
             </button>
             <button type="submit" className="flex-1 bg-brand-600 text-white py-3 cursor-pointer rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all active:scale-[0.98]">
               Create Lead
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}