import { useState, useRef } from "react";
import { useCreateBug, useUpdateBug, type Bug } from "@/hooks/useBugs";
import { X, Upload, Image, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type BugPriority = Database["public"]["Enums"]["bug_priority"];
type BugStatus = Database["public"]["Enums"]["bug_status"];

interface BugFormProps {
  bug?: Bug | null;
  onClose: () => void;
}

const BugForm = ({ bug, onClose }: BugFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(bug?.title || "");
  const [description, setDescription] = useState(bug?.description || "");
  const [priority, setPriority] = useState<BugPriority>(bug?.priority || "medium");
  const [status, setStatus] = useState<BugStatus>(bug?.status || "open");
  const [isPublic, setIsPublic] = useState((bug as any)?.is_public || false);
  const [codeSnippet, setCodeSnippet] = useState((bug as any)?.code_snippet || "");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>((bug as any)?.attachment_url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createBug = useCreateBug();
  const updateBug = useUpdateBug();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file || !user) return (bug as any)?.attachment_url || null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("bug-attachments")
      .upload(path, file);
    if (error) throw new Error("Upload failed: " + error.message);
    const { data } = supabase.storage.from("bug-attachments").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      const attachment_url = file ? await uploadFile() : (filePreview ? (bug as any)?.attachment_url : null);

      if (bug) {
        await updateBug.mutateAsync({ id: bug.id, title, description, priority, status, is_public: isPublic, code_snippet: codeSnippet || null, attachment_url } as any);
        toast.success("Bug updated");
      } else {
        await createBug.mutateAsync({ title, description, priority, status, is_public: isPublic, code_snippet: codeSnippet || null, attachment_url } as any);
        toast.success("Bug reported");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent focus:shadow-gold transition-all";
  const selectClass = "px-4 py-3 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:border-accent transition-all";

  const isImage = file?.type.startsWith("image/") || (filePreview && !file);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-display font-bold">{bug ? "Edit Bug" : "Report New Bug"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Bug title" value={title} onChange={(e) => setTitle(e.target.value)}
            required maxLength={200} className={inputClass} />
          <textarea placeholder="Describe the bug..." value={description} onChange={(e) => setDescription(e.target.value)}
            rows={4} className={`${inputClass} resize-none`} />
          <textarea placeholder="Paste your code snippet (optional)..." value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)}
            rows={3} className={`${inputClass} resize-none font-mono text-xs`} />

          {/* File Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.log,.json,.xml,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {!file && !filePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-accent hover:text-foreground transition-all"
              >
                <Upload size={18} />
                <span className="text-sm">Attach screenshot or file (max 5MB)</span>
              </button>
            ) : (
              <div className="relative rounded-xl border border-border bg-secondary/50 p-3">
                <button type="button" onClick={removeFile}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors">
                  <Trash2 size={14} />
                </button>
                {isImage && filePreview ? (
                  <div className="flex items-center gap-3">
                    <img src={filePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image size={14} />
                      {file?.name || "Attached image"}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-1">
                    <FileText size={24} className="text-accent" />
                    <span className="text-sm text-foreground">{file?.name || "Attached file"}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <select value={priority} onChange={(e) => setPriority(e.target.value as BugPriority)} className={`flex-1 ${selectClass}`}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as BugStatus)} className={`flex-1 ${selectClass}`}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`relative w-10 h-6 rounded-full transition-colors ${isPublic ? "bg-accent" : "bg-secondary"}`}
              onClick={() => setIsPublic(!isPublic)}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${isPublic ? "left-5" : "left-1"}`} />
            </div>
            <span className="text-sm text-muted-foreground">
              {isPublic ? "🌐 Public — visible in community feed" : "🔒 Private — only you can see"}
            </span>
          </label>
          <button type="submit" disabled={createBug.isPending || updateBug.isPending || uploading}
            className="bg-gold-gradient px-6 py-3 rounded-full font-medium text-accent-foreground hover:-translate-y-0.5 hover:shadow-gold transition-all disabled:opacity-50">
            {uploading ? "Uploading..." : bug ? "Update Bug" : "Report Bug"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BugForm;
