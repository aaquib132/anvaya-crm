import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { 
  ArrowLeft, User, Briefcase, Filter, ChevronRight, AlertCircle, Clock, CheckCircle2
} from "lucide-react";

export default function AgentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, leadsRes] = await Promise.all([
          API.get("/agents"),
          API.get(`/leads`)
        ]);
        
        const currentAgent = agentsRes.data.find(a => (a._id === id || a.id === id));
        setAgent(currentAgent);

        const agentLeads = leadsRes.data.filter(l => (
          l.salesAgent?._id === id || l.salesAgent?.id === id || l.salesAgent === id
        ));
        setLeads(agentLeads);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const processedLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "All") {
      result = result.filter(l => l.status === statusFilter);
    }
    if (priorityFilter !== "All") {
      result = result.filter(l => l.priority === priorityFilter);
    }

    if (sortBy === "TimeToCloseAsc") {
      result.sort((a, b) => (a.timeToClose || 999) - (b.timeToClose || 999));
    } else if (sortBy === "TimeToCloseDesc") {
      result.sort((a, b) => (b.timeToClose || 0) - (a.timeToClose || 0));
    }

    return result;
  }, [leads, statusFilter, priorityFilter, sortBy]);

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
               Loading Agent Data...
             </div>
           </div>
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
         <div className="flex justify-center items-center h-64">
           <div className="text-gray-500 font-semibold bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
             <AlertCircle className="w-5 h-5 text-red-500" /> Agent not found
           </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
        
        {/* Top Header matching wireframe "Leads by Sales Agent" */}
        <div className="mb-8 p-6 glass-card border border-brand-200/50 bg-white/40 shadow-sm rounded-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-500">Leads by Sales Agent</span>
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Main Area: Lead List by Agent */}
          <div className="flex-1 space-y-6">
            
            <div className="glass-card p-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
               
               {/* Sales Agent Details Header */}
               <div className="px-8 py-6 border-b border-gray-100/60 bg-white/40 flex justify-between items-center backdrop-blur-md">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-100 to-indigo-100 text-brand-600 flex items-center justify-center font-bold text-lg border border-white shadow-inner">
                      {agent.name?.charAt(0) || "A"}
                    </div>
                    Sales Agent: <span className="text-brand-700">{agent.name}</span>
                 </h2>
                 <div className="text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
                   <Briefcase size={16} className="text-brand-400" />
                   Total Leads: {leads.length}
                 </div>
               </div>
               
               {/* Controls: Filtering and Sorting */}
               <div className="p-6 bg-gray-50/50 border-b border-gray-100/60 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">Filters:</span>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 ring-brand-500 transition-shadow">
                      <Filter className="w-4 h-4 text-gray-400 mr-2" />
                      <select 
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none w-32"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 ring-brand-500 transition-shadow">
                      <select 
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none w-28"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                      >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">Sort by:</span>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 ring-brand-500 transition-shadow">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <select 
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none w-44"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="Default">Default</option>
                        <option value="TimeToCloseAsc">Time to Close (Asc)</option>
                        <option value="TimeToCloseDesc">Time to Close (Desc)</option>
                      </select>
                    </div>
                  </div>
               </div>

               {/* Lead List */}
               <div className="p-0">
                 {processedLeads.length > 0 ? (
                   <ul className="divide-y divide-gray-100 bg-white">
                     {processedLeads.map((lead, idx) => (
                       <li 
                         key={lead.id || lead._id} 
                         onClick={() => navigate(`/leads/${lead.id || lead._id}`)}
                         className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-brand-50/30 transition-colors group cursor-pointer"
                       >
                          <div>
                            <span className="text-xs font-bold text-gray-400 mb-1 block">Lead {idx + 1}</span>
                            <div className="font-bold text-gray-900 text-lg flex items-center gap-3">
                              {lead.name}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <StatusBadge status={lead.status} />
                              <PriorityBadge priority={lead.priority} />
                              {(lead.timeToClose !== undefined) && (
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                                  <Clock size={12} /> {lead.timeToClose} Days to Close
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-gray-200 text-gray-600 group-hover:text-brand-600 group-hover:border-brand-300 group-hover:bg-brand-50 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-1">
                             View Details <ChevronRight size={16} />
                          </div>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                       <AlertCircle className="w-8 h-8 text-gray-300" />
                     </div>
                     <p className="text-gray-500 text-lg font-semibold mb-1">No Leads Found</p>
                     <p className="text-sm text-gray-400 max-w-sm">No leads match your current filter settings for this sales agent.</p>
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }) {
  const map = {
    New: "bg-amber-100/80 text-amber-700 border-amber-200",
    Contacted: "bg-blue-100/80 text-blue-700 border-blue-200",
    Qualified: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
    "Proposal Sent": "bg-purple-100/80 text-purple-700 border-purple-200",
    Closed: "bg-indigo-100/80 text-indigo-700 border-indigo-200"
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      Status: {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High: "text-red-700 bg-red-100/80 border-red-200",
    Medium: "text-orange-700 bg-orange-100/80 border-orange-200",
    Low: "text-blue-700 bg-blue-100/80 border-blue-200"
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm uppercase tracking-wider ${map[priority] || "text-gray-500 bg-gray-50"}`}>
      Priority: {priority}
    </span>
  );
}
