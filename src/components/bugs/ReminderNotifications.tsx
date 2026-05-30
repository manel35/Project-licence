import { useReminders, useDismissReminder } from "@/hooks/useBugs";
import { Bell, X } from "lucide-react";

const ReminderNotifications = () => {
  const { data: reminders } = useReminders();
  const dismiss = useDismissReminder();

  const activeReminders = reminders?.filter(
    (r) => new Date(r.remind_at) <= new Date()
  ) || [];

  if (activeReminders.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={18} className="text-accent animate-pulse" />
        <h3 className="text-sm font-semibold text-foreground">Active Reminders ({activeReminders.length})</h3>
      </div>
      <div className="space-y-2">
        {activeReminders.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-accent/10 border border-accent/30">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {r.bugs?.title || "Bug"}
              </p>
              {r.message && <p className="text-xs text-muted-foreground">{r.message}</p>}
            </div>
            <button onClick={() => dismiss.mutate(r.id)}
              className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderNotifications;
