import { useState } from "react";
import { useResolutions, useCreateResolution, useUpdateBug } from "@/hooks/useBugs";
import { CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";

interface ResolutionPanelProps {
  bugId: string;
  bugStatus: string;
}

const ResolutionPanel = ({ bugId, bugStatus }: ResolutionPanelProps) => {
  const { data: resolutions, isLoading } = useResolutions(bugId);
  const createResolution = useCreateResolution();
  const updateBug = useUpdateBug();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [fixDetails, setFixDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createResolution.mutateAsync({ bug_id: bugId, description, fix_details: fixDetails || null });
      if (bugStatus !== "resolved" && bugStatus !== "closed") {
        await updateBug.mutateAsync({ id: bugId, status: "resolved" });
      }
      toast.success("Resolution added — bug marked as resolved");
      setDescription("");
      setFixDetails("");
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-accent transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-semibold flex items-center gap-1.5">
          <CheckCircle size={14} className="text-accent" /> Resolutions ({resolutions?.length || 0})
        </h5>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs text-accent hover:underline flex items-center gap-1">
          <Plus size={12} /> Add Resolution
        </button>
      </div>

      {isLoading && <p className="text-xs text-muted-foreground">Loading...</p>}

      {resolutions?.map((r) => (
        <div key={r.id} className="mb-2 p-3 rounded-lg bg-secondary/50 text-sm">
          <p className="text-foreground">{r.description}</p>
          {r.fix_details && <p className="text-muted-foreground mt-1 text-xs">Fix: {r.fix_details}</p>}
          <p className="text-muted-foreground/60 text-xs mt-1">{new Date(r.resolved_at).toLocaleString()}</p>
        </div>
      ))}

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
          <input type="text" placeholder="What was the fix?" value={description}
            onChange={(e) => setDescription(e.target.value)} required maxLength={500} className={inputClass} />
          <input type="text" placeholder="Technical details (optional)" value={fixDetails}
            onChange={(e) => setFixDetails(e.target.value)} maxLength={1000} className={inputClass} />
          <button type="submit" disabled={createResolution.isPending}
            className="self-start text-sm bg-gold-gradient px-4 py-2 rounded-full font-medium text-accent-foreground hover:shadow-gold transition-all disabled:opacity-50">
            Save Resolution
          </button>
        </form>
      )}
    </div>
  );
};

export default ResolutionPanel;
