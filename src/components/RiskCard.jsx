export default function RiskCard({ title, score, level, icon: Icon, trend }) {
  let colorClass = "text-green-500";
  let bgClass = "bg-green-500";
  let borderClass = "border-green-500/30";
  
  if (level === "HIGH") {
    colorClass = "text-orange-500";
    bgClass = "bg-orange-500";
    borderClass = "border-orange-500/30";
  } else if (level === "CRITICAL") {
    colorClass = "text-red-500";
    bgClass = "bg-red-500";
    borderClass = "border-red-500/30";
  } else if (level === "WATCH") {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-500";
    borderClass = "border-yellow-500/30";
  }

  return (
    <div className={`glass-card p-5 border ${borderClass} relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgClass} opacity-5 rounded-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon className={colorClass} size={24} />
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${bgClass} bg-opacity-20 ${colorClass}`}>
          {level}
        </div>
      </div>
      
      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-gray-400 mb-1">/ 100</span>
      </div>
      
      <div className="w-full bg-navy-900 rounded-full h-2 mb-2">
        <div className={`${bgClass} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      
      <div className="text-xs text-gray-400 mt-3 flex justify-between">
        <span>Risk Score</span>
        <span className="flex items-center gap-1">
          Trend: {trend === 'up' ? '↗️ Increasing' : trend === 'down' ? '↘️ Decreasing' : '➡️ Stable'}
        </span>
      </div>
    </div>
  );
}
