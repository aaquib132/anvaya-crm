import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

export default function Reports() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/leads").then(res => {
      setLeads(res.data || []);
      setLoading(false);
    });
  }, []);

  // 1. Pipeline vs Closed
  const closedVsPipelineData = useMemo(() => {
    const closed = leads.filter(l => l.status === "Closed" || l.status === "Qualified").length; 
    const pipeline = leads.length - closed;
    return [
      { name: "In Pipeline", value: pipeline },
      { name: "Closed / Qualified", value: closed }
    ];
  }, [leads]);
  const COLORS_PIPELINE = ["#6366f1", "#10b981"];

  // 2. Leads by Status Distribution
  const statusDistData = useMemo(() => {
    const dist = {};
    leads.forEach(l => {
      dist[l.status] = (dist[l.status] || 0) + 1;
    });
    return Object.keys(dist).map(k => ({ name: k, value: dist[k] }));
  }, [leads]);
  const COLORS_STATUS = ["#818cf8", "#f59e0b", "#10b981", "#a855f7", "#ec4899"];

  // 3. Leads by Agent Performance
  const agentPerfData = useMemo(() => {
    const agents = {};
    leads.forEach(l => {
      if (!l.salesAgent) return;
      const agentName = l.salesAgent.name;
      if (!agents[agentName]) {
        agents[agentName] = { name: agentName, total: 0, qualified: 0 };
      }
      agents[agentName].total += 1;
      if (l.status === "Qualified") agents[agentName].qualified += 1;
    });
    return Object.values(agents);
  }, [leads]);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="glass-card px-8 py-6 flex flex-col items-center gap-4 border border-white/60 shadow-lg animate-in zoom-in-95 duration-500">
           <div className="relative">
              <div className="w-12 h-12 border-4 border-brand-100 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-brand-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
           </div>
           <div className="text-brand-700 font-bold bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100 shadow-sm animate-pulse">
             Loading Reports...
           </div>
         </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        <div className="flex flex-col mb-8 gap-1">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500">Actionable insights from your CRM data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pie Chart: Pipeline vs Closed */}
          <div className="glass-card p-6 flex flex-col h-100">
            <div className="flex items-center gap-2 mb-6">
               <PieChartIcon className="w-5 h-5 text-brand-600"/>
               <h3 className="text-lg font-bold text-gray-900">Pipeline vs Closed</h3>
            </div>
            <div className="flex-1 w-full h-full min-h-0">
              <ResponsiveContainer width="100%" height={250} minHeight={250}>
                <PieChart>
                  <Pie
                    data={closedVsPipelineData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {closedVsPipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PIPELINE[index % COLORS_PIPELINE.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie/Bar Chart: Status Distribution */}
          <div className="glass-card p-6 flex flex-col h-100">
            <div className="flex items-center gap-2 mb-6">
               <TrendingUp className="w-5 h-5 text-amber-500"/>
               <h3 className="text-lg font-bold text-gray-900">Status Distribution</h3>
            </div>
            <div className="flex-1 w-full h-full min-h-0">
              <ResponsiveContainer width="100%" height={250} minHeight={250}>
                <PieChart>
                  <Pie
                    data={statusDistData}
                    cx="50%" cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Leads by Agent */}
          <div className="glass-card p-6 flex flex-col h-105 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <BarChart3 className="w-5 h-5 text-indigo-500"/>
               <h3 className="text-lg font-bold text-gray-900">Lead Performance by Agent</h3>
            </div>
            <div className="flex-1 w-full h-full min-h-0 pt-4">
               {agentPerfData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300} minHeight={300}>
                    <BarChart data={agentPerfData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 13, fontWeight: 500 }} />
                      <YAxis axisLine={false} tickLine={false} dx={-10} tick={{ fontSize: 13 }} />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }} 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="total" name="Total Assigned" fill="#e0e7ff" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="qualified" name="Qualified Leads" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
               ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-medium pb-10">
                     Not enough data to display agent performance.
                  </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}