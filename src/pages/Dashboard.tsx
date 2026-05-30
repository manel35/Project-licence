import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBugs, type Bug } from "@/hooks/useBugs";
import { useUserRole } from "@/hooks/useCommunity";
import { LogOut, User, Plus, Bug as BugIcon, Search, Shield, Globe } from "lucide-react";
import logo from "@/assets/icon.jpg";
import BugForm from "@/components/bugs/BugForm";
import BugCard from "@/components/bugs/BugCard";
import BugAnalytics from "@/components/bugs/BugAnalytics";
import ReminderNotifications from "@/components/bugs/ReminderNotifications";
import type { Database } from "@/integrations/supabase/types";

type BugStatus = Database["public"]["Enums"]["bug_status"];
type BugPriority = Database["public"]["Enums"]["bug_priority"];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: bugs, isLoading } = useBugs();
  const { data: roles } = useUserRole();
  const isAdmin = roles?.includes("admin");
  const [showForm, setShowForm] = useState(false);
  const [editBug, setEditBug] = useState<Bug | null>(null);
  const [filterStatus, setFilterStatus] = useState<BugStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<BugPriority | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredBugs = (bugs || []).filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterPriority !== "all" && b.priority !== filterPriority) return false;
    if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectClass = "px-3 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm focus:outline-none focus:border-accent transition-all";

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="tracker.com" className="w-10 h-10 rounded-lg" />
          <span className="font-display text-lg font-bold text-foreground">SmartBug Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/community" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Globe size={16} /> Community
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors">
              <Shield size={16} /> Admin
            </Link>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={18} />
            <span className="text-sm hidden sm:inline">{user?.email}</span>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            <span className="text-gradient-gold">Bug Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">Track, resolve, and manage your software bugs.</p>
        </div>

        {/* Reminders */}
        <ReminderNotifications />

        {/* Analytics */}
        {bugs && bugs.length > 0 && <BugAnalytics bugs={bugs} />}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <button onClick={() => { setEditBug(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-gold-gradient px-5 py-2.5 rounded-full font-medium text-accent-foreground hover:-translate-y-0.5 hover:shadow-gold transition-all">
            <Plus size={16} /> Report Bug
          </button>

          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search bugs..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm focus:outline-none focus:border-accent transition-all" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BugStatus | "all")} className={selectClass}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as BugPriority | "all")} className={selectClass}>
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Bug List */}
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading bugs...</div>
        ) : filteredBugs.length === 0 ? (
          <div className="text-center py-20">
            <BugIcon size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{bugs?.length ? "No bugs match your filters" : "No bugs reported yet. Click 'Report Bug' to get started!"}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredBugs.map((bug) => (
              <BugCard key={bug.id} bug={bug} onEdit={(b) => { setEditBug(b); setShowForm(true); }} />
            ))}
          </div>
        )}

        {/* Bug Form Modal */}
        {showForm && <BugForm bug={editBug} onClose={() => { setShowForm(false); setEditBug(null); }} />}
      </main>
    </div>
  );
};

export default Dashboard;
