import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { 
  ArrowLeft, User, Briefcase, Mail, Phone, Calendar, Clock, AlertTriangle, MessageSquare, Send
} from "lucide-react";

export default function LeadDetails() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    API.get(`/leads`).then(res => {
      const found = res.data.find(l => l._id === id);
      setLead(found);
    });

    API.get(`/leads/${id}/comments`).then(res => {
      setComments(res.data);
    });

    API.get(`/agents`).then(res => {
      setAgents(res.data);
    });
  }, [id]);

  const handleComment = async () => {
    if (!text || agents.length === 0) return;
    await API.post(`/leads/${id}/comments`, {
      author: agents[0]._id, // using first agent as default current user for demonstration
      commentText: text,
    });
    setText("");
    const res = await API.get(`/leads/${id}/comments`);
    setComments(res.data);
  };

  if (!lead) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
         <div className="animate-pulse text-brand-600 font-semibold">Loading Details...</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="mb-6">
          <Link to="/leads" className="inline-flex items-center text-gray-500 hover:text-brand-600 font-medium mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Leads
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                 {lead.name}
               </h1>
               <p className="text-gray-500 mt-1 flex items-center gap-2">
                 <Briefcase size={14}/> Lead ID: <span className="font-mono text-xs">{lead._id}</span>
               </p>
             </div>
             <div className="flex gap-2">
               <StatusBadge status={lead.status} />
               <PriorityBadge priority={lead.priority} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Details Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
               <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100/50">Lead Information</h2>
               <div className="space-y-4">
                 <DetailItem icon={<Briefcase/>} label="Source" value={lead.source || "Direct"} />
                 <DetailItem icon={<User/>} label="Assigned Agent" value={lead.salesAgent?.name || "Unassigned"} />
                 <DetailItem icon={<Calendar/>} label="Created On" value={new Date(lead.createdAt || Date.now()).toLocaleDateString()} />
                 <DetailItem icon={<Clock/>} label="Time to Close" value={`${lead.timeToClose || 0} Days`} />
               </div>
            </div>
          </div>

          {/* Activity / Comments Main Area */}
          <div className="lg:col-span-2">
            <div className="glass-card p-0 flex flex-col h-[600px]">
              
              <div className="px-6 py-4 border-b border-gray-100/50 bg-white/30 backdrop-blur-md sticky top-0 z-10 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-bold text-gray-900">Activity Timeline & Comments</h2>
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {comments.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p>No activity recorded yet.</p>
                   </div>
                ) : (
                  comments.map((c, idx) => (
                    <div key={c._id} className="relative pl-6">
                      {/* Timeline Line */}
                      {idx !== comments.length - 1 && (
                        <div className="absolute top-8 bottom-[-24px] left-2.5 w-0.5 bg-brand-100"></div>
                      )}
                      
                      {/* Timeline Dot */}
                      <div className="absolute top-1 left-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center border-2 border-white shadow-sm">
                         <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                      </div>

                      <div className="bg-white/60 p-4 rounded-2xl shadow-sm border border-gray-50/50 relative">
                        <div className="flex justify-between items-start mb-2 text-sm">
                          <span className="font-bold text-gray-900">{c.author?.name || "Unknown Agent"}</span>
                          <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{c.commentText}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-gray-100/50 bg-white/40">
                <div className="flex gap-2">
                  <textarea
                    placeholder="Add a comment or update..."
                    className="flex-1 border border-gray-200/60 bg-white/70 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 min-h-[50px] max-h-[150px] outline-none resize-y"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    onClick={handleComment}
                    className="bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-2xl flex items-center justify-center h-fit shadow-md transition-transform active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
         {icon}
      </div>
      <div>
         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
         <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
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
    <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border shadow-sm ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
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
    <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border shadow-sm uppercase tracking-wider ${map[priority] || "text-gray-500 bg-gray-50"}`}>
      {priority}
    </span>
  );
}