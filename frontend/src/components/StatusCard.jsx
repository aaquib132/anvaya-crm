export default function StatusCard({ label, count, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className={`p-6 rounded-2xl shadow ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{count}</h2>
    </div>
  );
}