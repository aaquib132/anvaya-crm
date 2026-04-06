import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";
import { 
  ArrowLeft, User, Users, Briefcase, Mail, Phone, Calendar, Clock, AlertTriangle, MessageSquare, Send, Check
} from "lucide-react";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [agents, setAgents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    API.get(`/leads`).then(res => {
      const found = res.data.find(l => (l._id === id || l.id === id));
      setLead(found);
      setEditForm(found); // Initialize form
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
      author: agents[0]._id || agents[0].id, 
      commentText: text,
    });
    setText("");
    const res = await API.get(`/leads/${id}/comments`);
    setComments(res.data);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await API.put(`/leads/${id}`, {
        name: editForm.name,
        salesAgent: editForm.salesAgent?._id || editForm.salesAgent?.id || editForm.salesAgent,
        source: editForm.source,
        status: editForm.status,
        priority: editForm.priority,
        timeToClose: editForm.timeToClose
      });
      setLead(res.data);
      setEditForm(res.data);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save lead updates.");
    }
  };

  if (!lead) return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="glass-card px-8 py-6 flex flex-col items-center gap-4 border border-white/60 shadow-lg animate-in zoom-in-95 duration-500">
           <div className="relative">
              <div className="w-12 h-12 border-4 border-brand-100 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-brand-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
           </div>
           <div className="text-brand-700 font-bold bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100 shadow-sm animate-pulse">
             Loading Lead Details...
           </div>
         </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-8 p-6 glass-card border border-brand-200/50 bg-white/40 shadow-sm rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-500">Lead Management:</span> {lead.name}
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Main Area */}
          <div className="flex-1 space-y-8">
            
            {/* Lead Details */}
            <div className="glass-card p-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
               <div className="px-8 py-6 border-b border-gray-100/60 bg-white/40 flex justify-between items-center backdrop-blur-md">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-500" /> Lead Details
                 </h2>
                 {!isEditing && (
                   <button 
                     onClick={() => setIsEditing(true)} 
                     className="px-5 py-2.5 cursor-pointer bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 active:scale-95"
                   >
                     Edit Lead Details
                   </button>
                 )}
               </div>
               
               <div className="p-8">
                 {isEditing ? (
                   <div className="space-y-6 animate-in fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Name</label>
                         <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm transition-shadow bg-white/60" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Sales Agent</label>
                         <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white" value={editForm.salesAgent?._id || editForm.salesAgent?.id || editForm.salesAgent || ""} onChange={e => setEditForm({...editForm, salesAgent: e.target.value})}>
                            <option value="">Unassigned</option>
                            {agents.map(a => <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>)}
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Source</label>
                         <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white/60" value={editForm.source || ""} onChange={e => setEditForm({...editForm, source: e.target.value})} />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Status</label>
                         <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white" value={editForm.status || "New"} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                           <option value="New">New</option>
                           <option value="Contacted">Contacted</option>
                           <option value="Qualified">Qualified</option>
                           <option value="Proposal Sent">Proposal Sent</option>
                           <option value="Closed">Closed</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                         <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white" value={editForm.priority || "Medium"} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
                           <option value="High">High</option>
                           <option value="Medium">Medium</option>
                           <option value="Low">Low</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Time to Close (Days)</label>
                         <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white/60" value={editForm.timeToClose || 0} onChange={e => setEditForm({...editForm, timeToClose: e.target.value})} />
                       </div>
                     </div>
                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                       <button onClick={() => { setEditForm(lead); setIsEditing(false); }} className="px-5 cursor-pointer py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors">Cancel</button>
                       <button onClick={handleSaveEdit} className="px-5 py-2.5 bg-brand-600 cursor-pointer hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"><Check size={16} /> Save Changes</button>
                     </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                     <DetailItem label="Lead Name" value={lead.name} />
                     <DetailItem label="Sales Agent" value={lead.salesAgent?.name || "Unassigned"} />
                     <DetailItem label="Lead Source" value={lead.source || "Direct"} />
                     <DetailItem label="Lead Status" value={<StatusBadge status={lead.status} />} />
                     <DetailItem label="Priority" value={<PriorityBadge priority={lead.priority} />} />
                     <DetailItem label="Time to Close" value={`${lead.timeToClose || 0} Days`} />
                   </div>
                 )}
               </div>
            </div>

            {/* Comments Section */}
            <div className="glass-card p-0 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
              <div className="px-8 py-5 border-b border-gray-100/60 bg-white/40 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <h2 className="text-xl font-bold text-gray-900">Comments Section</h2>
              </div>

              <div className="flex-1 max-h-[400px] overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                {comments.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p>No comments recorded yet.</p>
                   </div>
                ) : (
                  comments.map((c, idx) => (
                    <div key={c._id || Math.random()} className="relative pl-6">
                      {idx !== comments.length - 1 && (
                        <div className="absolute top-8 bottom-[-24px] left-2.5 w-0.5 bg-brand-200/60"></div>
                      )}
                      
                      <div className="absolute top-1 left-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center border-2 border-white shadow-sm">
                         <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative ml-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-gray-900 flex items-center gap-2"><User size={14} className="text-gray-400" /> {c.author?.name || "Unknown Agent"}</span>
                          <span className="text-gray-400 text-xs font-medium flex items-center gap-1"><Clock size={12} /> {new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{c.commentText}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100/60 bg-white/50 rounded-b-3xl">
                <div className="flex gap-3">
                  <textarea
                    placeholder="Add a new comment..."
                    className="flex-1 border border-gray-200 bg-white rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand-500 min-h-[60px] max-h-[150px] outline-none resize-y shadow-inner"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    onClick={handleComment}
                    className="bg-brand-600 cursor-pointer hover:bg-brand-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center h-fit shadow-md shadow-brand-500/20 transition-all font-bold active:scale-95 self-end gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit
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

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
       <div className="text-base font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    New: "bg-amber-100/80 text-amber-700 border-amber-200",
    Contacted: "bg-brand-100/80 text-brand-700 border-brand-200",
    Qualified: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
    "Proposal Sent": "bg-purple-100/80 text-purple-700 border-purple-200",
    Closed: "bg-gray-100/80 text-gray-700 border-gray-200"
  };
  return (
    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-bold border shadow-sm ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
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
    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-bold border shadow-sm uppercase tracking-wider ${map[priority] || "text-gray-500 bg-gray-50"}`}>
      {priority}
    </span>
  );
}