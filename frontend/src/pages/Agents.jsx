import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { Users, Plus, X, Mail, Phone, ExternalLink } from "lucide-react";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    API.get("/agents").then(res => {
      setAgents(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
         <div className="animate-pulse text-brand-600 font-semibold">Loading Agents...</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Sales Agents
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your team and track performance</p>
          </div>
          
          <button
             onClick={() => setIsModalOpen(true)}
             className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
             <Plus size={18} />
             Add New Agent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent._id} className="glass-card hover:-translate-y-2 transition-transform duration-300 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-brand-600"><ExternalLink size={18}/></button>
               </div>
               
               <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-inner border border-white">
                     <Users size={32} className="text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                  <div className="mt-4 w-full space-y-3">
                     <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50/50 py-2 px-3 rounded-xl border border-gray-100">
                        <Mail size={14} className="text-gray-400"/>
                        <span className="text-sm font-medium">{agent.email || "No email provided"}</span>
                     </div>
                  </div>
               </div>
            </div>
          ))}
          {agents.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-white/40 rounded-3xl border border-dashed border-gray-300">
               <Users className="w-12 h-12 mb-3 text-gray-400 opacity-50" />
               <p className="font-semibold">No Sales Agents found</p>
               <p className="text-sm">Add one to get started.</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-xl border border-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Agent</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const newAgent = {
                    name: fd.get("name"),
                    email: fd.get("email"),
                  };
                  try {
                    const res = await API.post("/agents", newAgent);
                    setAgents(prev => [...prev, res.data]);
                    setIsModalOpen(false);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to add agent.");
                  }
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Agent Name</label>
                  <div className="relative">
                     <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input name="name" placeholder="e.g. Jane Smith" required className="w-full border border-gray-200/50 bg-white/50 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input name="email" type="email" placeholder="e.g. jane@anvaya.com" required className="w-full border border-gray-200/50 bg-white/50 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" />
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                      Cancel
                   </button>
                   <button type="submit" className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all active:scale-[0.98]">
                     Create Agent
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}