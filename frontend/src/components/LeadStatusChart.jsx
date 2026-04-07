import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = {
  New: "#f59e0b",          // Amber (Matches bg-amber-400)
  Contacted: "#3b82f6",    // Brand/Blue (Matches bg-brand-400)
  Qualified: "#10b981",    // Emerald (Matches bg-emerald-400)
  ProposalSent: "#a855f7", // Purple (Matches bg-purple-400)
  Closed: "#6366f1",       // Indigo (Matches bg-indigo-400)
};

// 🔥 MOVED OUTSIDE: Declare the tooltip component outside of the main component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-lg ring-1 ring-black/5">
        <p className="font-semibold text-gray-900 mb-1">{data.name} Leads</p>
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{data.value}</span> total
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function LeadStatusChart({ stats }) {
  const data = [
    { name: "New", value: stats.new, color: CHART_COLORS.New },
    { name: "Contacted", value: stats.contacted, color: CHART_COLORS.Contacted },
    { name: "Qualified", value: stats.qualified, color: CHART_COLORS.Qualified },
    { name: "Proposal Sent", value: stats.proposalSent, color: CHART_COLORS.ProposalSent },
    { name: "Closed", value: stats.closed, color: CHART_COLORS.Closed },
  ];

  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col h-full min-h-80">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Lead Distribution
      </h2>

      <div className="relative flex-1 min-h-[200px] h-[250px] w-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-900 leading-none">{totalLeads}</span>
          <span className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wide">Total Leads</span>
        </div>

        <ResponsiveContainer width="100%" height={250} minHeight={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity duration-300 outline-none" 
                />
              ))}
            </Pie>
            
            {/* Pass the component as the content prop */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full shadow-sm" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-sm font-medium text-gray-600">
              {item.name} <span className="text-gray-400 ml-1">({item.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}