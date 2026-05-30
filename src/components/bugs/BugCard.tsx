import { useState } from "react";
import { type Bug, useDeleteBug } from "@/hooks/useBugs";
import { Trash2, Edit, Link, Bell, ChevronDown, ChevronUp, Globe, Lock, Paperclip, Bot } from "lucide-react";
import { toast } from "sonner";
import ResolutionPanel from "./ResolutionPanel";
import ReminderForm from "./ReminderForm";

const priorityBadge: Record<string, string> = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const statusBadge: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-purple-500/20 text-purple-400",
  resolved: "bg-green-500/20 text-green-400",
  closed: "bg-muted text-muted-foreground",
};

interface BugCardProps {
  bug: Bug;
  onEdit: (bug: Bug) => void;
}

const BugCard = ({ bug, onEdit }: BugCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showResolutions, setShowResolutions] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const deleteBug = useDeleteBug();

  const handleDelete = async () => {
    if (!confirm("Delete this bug?")) return;
    try {
      await deleteBug.mutateAsync(bug.id);
      toast.success("Bug deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityBadge[bug.priority]}`}>
              {bug.priority}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[bug.status]}`}>
              {bug.status.replace("_", " ")}
            </span>
            {(bug as any).is_public ? (
              <span className="flex items-center gap-1 text-xs text-accent"><Globe size={10} /> Public</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock size={10} /> Private</span>
            )}
          </div>
          <h4 className="font-semibold text-foreground truncate">{bug.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(bug.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              const prompt = `Help me fix this bug:\n\nTitle: ${bug.title}\nPriority: ${bug.priority}\nStatus: ${bug.status}${bug.description ? `\nDescription: ${bug.description}` : ""}`;
              window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank");
            }}
            className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-secondary transition-colors"
            title="Ask ChatGPT"
          >
            <Bot size={16} />
          </button>
          <button onClick={() => onEdit(bug)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors" title="Edit">
            <Edit size={16} />
          </button>
          <button onClick={() => setShowResolutions(!showResolutions)} className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-secondary transition-colors" title="Resolutions">
            <Link size={16} />
          </button>
          <button onClick={() => setShowReminder(!showReminder)} className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-secondary transition-colors" title="Set Reminder">
            <Bell size={16} />
          </button>
          <button onClick={handleDelete} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-secondary transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-border pt-3 space-y-3">
          {bug.description && <p className="text-sm text-muted-foreground">{bug.description}</p>}
          {(bug as any).attachment_url && (
            <div>
              {(bug as any).attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <a href={(bug as any).attachment_url} target="_blank" rel="noopener noreferrer">
                  <img src={(bug as any).attachment_url} alt="Attachment" className="max-w-xs rounded-xl border border-border" />
                </a>
              ) : (
                <a href={(bug as any).attachment_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                  <Paperclip size={14} /> View attachment
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {showResolutions && (
        <div className="mt-3 border-t border-border pt-3">
          <ResolutionPanel bugId={bug.id} bugStatus={bug.status} />
        </div>
      )}

      {showReminder && (
        <div className="mt-3 border-t border-border pt-3">
          <ReminderForm bugId={bug.id} onDone={() => setShowReminder(false)} />
        </div>
      )}
    </div>
  );
};

export default BugCard;
