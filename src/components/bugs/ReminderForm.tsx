import { useState } from "react";
import { useCreateReminder } from "@/hooks/useBugs";
import { toast } from "sonner";

interface ReminderFormProps {
  bugId: string;
  onDone: () => void;
}

const ReminderForm = ({ bugId, onDone }: ReminderFormProps) => {
  const [remindAt, setRemindAt] = useState("");
  const [message, setMessage] = useState("");
  const createReminder = useCreateReminder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReminder.mutateAsync({ bug_id: bugId, remind_at: new Date(remindAt).toISOString(), message: message || null });
      toast.success("Reminder set");
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-accent transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">Remind me at:</label>
      <input type="datetime-local" value={remindAt} onChange={(e) => setRemindAt(e.target.value)}
        required min={new Date().toISOString().slice(0, 16)} className={inputClass} />
      <input type="text" placeholder="Reminder note (optional)" value={message}
        onChange={(e) => setMessage(e.target.value)} maxLength={300} className={inputClass} />
      <button type="submit" disabled={createReminder.isPending}
        className="self-start text-sm bg-gold-gradient px-4 py-2 rounded-full font-medium text-accent-foreground hover:shadow-gold transition-all disabled:opacity-50">
        Set Reminder
      </button>
    </form>
  );
};

export default ReminderForm;
