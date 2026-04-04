import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import {
  Search, Plus, MoreVertical, AlertCircle, ChevronRight, X, User, Briefcase, Filter
} from "lucide-react";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [search, setSearch] = useState("");

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

  const processedLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "All") {
      result = result.filter(l => l.status === statusFilter);
    }
    if (agentFilter !== "All") {
      result = result.filter(l => l.salesAgent?._id === agentFilter);
    }
    if (search) {
      result = result.filter(l => 
        l.name?.toLowerCase().includes(search.toLowerCase()) || 
        l.source?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "Priority") {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    } else if (sortBy === "TimeToClose") {
      result.sort((a, b) => (a.timeToClose || 999) - (b.timeToClose || 999));
    }

    return result;
  }, [leads, statusFilter, agentFilter, search, sortBy]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
           <div className="animate-pulse text-brand-600 font-semibold">Loading Leads...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Leads</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your entire pipeline</p>
          </div>
          <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={18} />
              Add New Lead
          </button>
        </div>

        {/* CONTROLS */}
        <div className="glass-card mb-6 p-4">
           <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px] relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input
                    type="text"
                    placeholder="Search by name or source..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200/50 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                 <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                      className="bg-transparent text-sm font-medium text-gray-700 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                    </select>
                 </div>
                 
                 <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <User className="w-4 h-4 text-gray-400" />
                    <select 
                      className="bg-transparent text-sm font-medium text-gray-700 outline-none"
                      value={agentFilter}
                      onChange={(e) => setAgentFilter(e.target.value)}
                    >
                      <option value="All">All Agents</option>
                      {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                 </div>

                 <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

                 <select 
                    className="bg-white border border-gray-200 text-sm font-medium text-gray-700 px-3 py-2.5 rounded-xl outline-none"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Default">Sort By: Default</option>
                    <option value="Priority">Sort By: Priority</option>
                    <option value="TimeToClose">Sort By: Time to Close</option>
                  </select>
              </div>
           </div>
        </div>

        {/* LIST */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/40 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-white/50">
                <tr>
                  <th className="px-6 py-4">Lead Name</th>
                  <th className="px-6 py-4">Sales Agent</th>
                  <th className="px-6 py-4">Status & Priority</th>
                  <th className="px-6 py-4">Time to Close</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {processedLeads.length > 0 ? (
                  processedLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{lead.source || "Direct"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shadow-sm">
                            {lead.salesAgent?.name?.charAt(0) || "-"}
                          </div>
                          <span className="text-gray-700 font-semibold">{lead.salesAgent?.name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex gap-2 items-center">
                           <StatusBadge status={lead.status} />
                           <PriorityBadge priority={lead.priority} />
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-gray-600 font-medium">
                           {lead.timeToClose ? `${lead.timeToClose} Days` : "-"}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Link to={`/leads/${lead._id}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                            <ChevronRight size={18} />
                         </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-base font-semibold">No leads found matching criteria</p>
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

function StatusBadge({ status }) {
  const map = {
    New: "bg-amber-100/80 text-amber-700 border-amber-200",
    Contacted: "bg-brand-100/80 text-brand-700 border-brand-200",
    Qualified: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
    "Proposal Sent": "bg-purple-100/80 text-purple-700 border-purple-200"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High: "text-red-600 bg-red-50",
    Medium: "text-orange-600 bg-orange-50",
    Low: "text-blue-600 bg-blue-50"
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${map[priority] || "text-gray-500 bg-gray-50"}`}>
      {priority}
    </span>
  );
}

function Modal({ agents, setLeads, close }) {
  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lead Source</label>
            <select name="source" className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow">
               <option>Website</option>
               <option>Referral</option>
               <option>Social Media</option>
               <option>Direct</option>
            </select>
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
                </select>
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Days to Close</label>
             <input name="timeToClose" type="number" min="0" placeholder="e.g. 14" required className="w-full border border-gray-200/50 bg-white/50 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
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