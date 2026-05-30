import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, useAllUsers, useAllBugs } from "@/hooks/useCommunity";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Users, Bug as BugIcon, Pin, Trash2, ArrowLeft, BarChart3, Mail, Eye, Trash, MessageSquare, Ban, CheckCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/icon.jpg";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: roles, isLoading: rolesLoading } = useUserRole();
  const { data: users } = useAllUsers();
  const { data: allBugs } = useAllBugs();
  const [tab, setTab] = useState<"overview" | "users" | "bugs" | "messages">("overview");
  const qc = useQueryClient();

  const { data: contactMessages } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const isAdmin = roles?.includes("admin");

  const togglePin = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const { error } = await supabase.from("bugs").update({ is_pinned: !pinned } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-bugs"] });
      qc.invalidateQueries({ queryKey: ["public-bugs"] });
      toast.success("Updated");
    },
  });

  const deleteBug = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bugs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-bugs"] });
      toast.success("Bug deleted");
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages" as any).update({ is_read: true } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("Message deleted");
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-profiles"] });
      toast.success("Role updated");
    },
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ profileId, isBlocked }: { profileId: string; isBlocked: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_blocked: !isBlocked } as any).eq("id", profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-profiles"] });
      toast.success("User updated");
    },
  });

  if (rolesLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const totalBugs = allBugs?.length || 0;
  const publicBugs = allBugs?.filter((b: any) => b.is_public).length || 0;
  const resolvedBugs = allBugs?.filter((b: any) => b.status === "resolved" || b.status === "closed").length || 0;
  const totalUsers = users?.length || 0;

  const tabClass = (t: string) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartBug" className="w-10 h-10 rounded-lg" />
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            <span className="font-display text-lg font-bold text-foreground">Admin Panel</span>
          </div>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab("overview")} className={tabClass("overview")}>
            <BarChart3 size={14} className="inline mr-1.5" /> Overview
          </button>
          <button onClick={() => setTab("users")} className={tabClass("users")}>
            <Users size={14} className="inline mr-1.5" /> Users
          </button>
          <button onClick={() => setTab("bugs")} className={tabClass("bugs")}>
            <BugIcon size={14} className="inline mr-1.5" /> All Bugs
          </button>
          <button onClick={() => setTab("messages")} className={tabClass("messages")}>
            <Mail size={14} className="inline mr-1.5" /> Messages
            {contactMessages && contactMessages.filter((m: any) => !m.is_read).length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-destructive text-destructive-foreground">
                {contactMessages.filter((m: any) => !m.is_read).length}
              </span>
            )}
          </button>
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
              { label: "Total Users", value: totalUsers, icon: Users },
              { label: "Total Bugs", value: totalBugs, icon: BugIcon },
              { label: "Public Bugs", value: publicBugs, icon: Pin },
              { label: "Resolved", value: resolvedBugs, icon: Shield },
              { label: "Messages", value: contactMessages?.length || 0, icon: Mail },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                <s.icon size={20} className="text-accent mb-2" />
                <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">{users?.length || 0} registered users</p>
            {users?.map((u: any) => (
              <div key={u.id} className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {(u.display_name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{u.display_name || "No name"}</p>
                      {(u as any).is_blocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-medium">Blocked</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                      {u.user_roles?.[0]?.role || "user"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBlock.mutate({ profileId: u.id, isBlocked: !!(u as any).is_blocked })}
                    className={`p-2 rounded-lg transition-colors ${(u as any).is_blocked ? "text-destructive hover:text-foreground" : "text-muted-foreground hover:text-destructive"} hover:bg-secondary`}
                    title={(u as any).is_blocked ? "Unblock user" : "Block user"}
                  >
                    {(u as any).is_blocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                  </button>
                  <select
                    value={u.user_roles?.[0]?.role || "user"}
                    onChange={(e) => setRole.mutate({ userId: u.user_id, role: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-border bg-secondary text-sm text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Bugs */}
        {tab === "bugs" && (
          <div className="space-y-3">
            {allBugs?.map((bug: any) => (
              <div key={bug.id} className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {bug.is_pinned && <Pin size={12} className="text-accent" />}
                    {bug.is_public && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Public</span>}
                  </div>
                  <p className="font-medium text-foreground truncate">{bug.title}</p>
                  <p className="text-xs text-muted-foreground">{bug.status} · {bug.priority}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePin.mutate({ id: bug.id, pinned: bug.is_pinned })}
                    className={`p-2 rounded-lg hover:bg-secondary transition-colors ${bug.is_pinned ? "text-accent" : "text-muted-foreground"}`}
                    title={bug.is_pinned ? "Unpin" : "Pin"}>
                    <Pin size={16} />
                  </button>
                  <button onClick={() => { if (confirm("Delete this bug?")) deleteBug.mutate(bug.id); }}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-secondary transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        {tab === "messages" && (
          <div className="space-y-3">
            {(!contactMessages || contactMessages.length === 0) && (
              <p className="text-muted-foreground text-center py-8">No messages yet.</p>
            )}
            {contactMessages?.map((msg: any) => (
              <div key={msg.id} className={`rounded-2xl border bg-card p-5 ${msg.is_read ? "border-border opacity-70" : "border-accent/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{msg.name}</p>
                      {!msg.is_read && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">New</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{msg.email} · {new Date(msg.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!msg.is_read && (
                      <button onClick={() => markRead.mutate(msg.id)}
                        className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-secondary transition-colors" title="Mark as read">
                        <Eye size={16} />
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Delete this message?")) deleteMessage.mutate(msg.id); }}
                      className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-secondary transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
