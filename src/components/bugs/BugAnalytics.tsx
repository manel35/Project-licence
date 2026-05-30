import { type Bug } from "@/hooks/useBugs";
import { BarChart3, Bug as BugIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface BugAnalyticsProps {
  bugs: Bug[];
}

const BugAnalytics = ({ bugs }: BugAnalyticsProps) => {
  const total = bugs.length;
  const open = bugs.filter((b) => b.status === "open").length;
  const inProgress = bugs.filter((b) => b.status === "in_progress").length;
  const resolved = bugs.filter((b) => b.status === "resolved").length;
  const closed = bugs.filter((b) => b.status === "closed").length;
  const critical = bugs.filter((b) => b.priority === "critical").length;
  const high = bugs.filter((b) => b.priority === "high").length;

  const stats = [
    { label: "Total Bugs", value: total, icon: BugIcon, color: "text-foreground" },
    { label: "Open", value: open, icon: Clock, color: "text-blue-400" },
    { label: "In Progress", value: inProgress, icon: BarChart3, color: "text-purple-400" },
    { label: "Resolved", value: resolved + closed, icon: CheckCircle, color: "text-green-400" },
    { label: "Critical/High", value: critical + high, icon: AlertTriangle, color: "text-red-400" },
  ];

  // Resolution rate bar
  const resolutionRate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
        <BarChart3 size={20} className="text-accent" /> Analytics Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-border bg-card text-center">
            <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Resolution Rate */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Resolution Rate</span>
          <span className="text-sm font-bold text-accent">{resolutionRate}%</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-gradient rounded-full transition-all duration-500"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BugAnalytics;
