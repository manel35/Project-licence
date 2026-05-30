import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicBugs, useToggleLike, useComments, useAddComment, useDeleteComment, useFollowing, useToggleFollow, useUserRole } from "@/hooks/useCommunity";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Pin, UserPlus, UserCheck, Send, Trash2, Code, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/icon.jpg";

const priorityBadge: Record<string, string> = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const FeedCard = ({ bug }: { bug: any }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const { data: following } = useFollowing();
  const toggleFollow = useToggleFollow();

  // Get likes count
  const { data: likes } = useQuery({
    queryKey: ["likes", bug.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("bug_id", bug.id);
      if (error) throw error;
      return data;
    },
  });

  const { data: comments } = useComments(bug.id);

  const isLiked = likes?.some((l: any) => l.user_id === user?.id);
  const isFollowing = following?.includes(bug.user_id);
  const isOwnBug = user?.id === bug.user_id;

  const handleLike = () => {
    if (!user) { toast.error("Sign in to like"); return; }
    toggleLike.mutate(bug.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in to comment"); return; }
    if (!commentText.trim()) return;
    addComment.mutate({ bugId: bug.id, content: commentText.trim() });
    setCommentText("");
  };

  const handleFollow = () => {
    if (!user) { toast.error("Sign in to follow"); return; }
    toggleFollow.mutate(bug.user_id);
  };

  const displayName = bug.profiles?.display_name || "Anonymous";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-accent">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{displayName}</p>
            <p className="text-xs text-muted-foreground">{new Date(bug.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {bug.is_pinned && (
            <span className="flex items-center gap-1 text-xs text-accent font-medium">
              <Pin size={12} /> Pinned
            </span>
          )}
          {!isOwnBug && user && (
            <button onClick={handleFollow}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${isFollowing ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Bug content */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityBadge[bug.priority]}`}>
          {bug.priority}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{bug.title}</h3>

      {bug.description && (
        <p className={`text-sm text-muted-foreground mb-3 ${!expanded && bug.description.length > 150 ? "line-clamp-3" : ""}`}>
          {bug.description}
        </p>
      )}

      {bug.code_snippet && (
        <div className="mb-3">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-accent mb-2 hover:underline">
            <Code size={12} /> {expanded ? "Hide code" : "Show code"}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {expanded && (
            <pre className="bg-background border border-border rounded-xl p-4 text-xs text-muted-foreground overflow-x-auto font-mono">
              {bug.code_snippet}
            </pre>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}>
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          {likes?.length || 0}
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle size={16} />
          {comments?.length || 0}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {comments?.map((c: any) => (
            <div key={c.id} className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
              <div className="flex-1">
                <p className="text-sm text-foreground">{c.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
              {c.user_id === user?.id && (
                <button onClick={() => deleteComment.mutate({ id: c.id, bugId: bug.id })}
                  className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          {user && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-all" />
              <button type="submit"
                className="bg-gold-gradient p-2.5 rounded-xl text-accent-foreground hover:shadow-gold transition-all">
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

const CommunityFeed = () => {
  const { user } = useAuth();
  const { data: bugs, isLoading } = usePublicBugs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SmartBug" className="w-10 h-10 rounded-lg" />
          <span className="font-display text-lg font-bold text-foreground">Community</span>
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <Link to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
          <Link to={user ? "/dashboard" : "/auth"}
            className="bg-gold-gradient px-5 py-2 rounded-full text-sm font-medium text-accent-foreground hover:shadow-gold transition-all">
            {user ? "My Bugs" : "Sign In"}
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-display">
            <span className="text-gradient-gold">Bug Feed</span>
          </h1>
          <p className="text-muted-foreground mt-2">See what the community is working on. Share your bugs and solutions.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading feed...</div>
        ) : !bugs?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            No public bugs yet. Make your bugs public to share with the community!
          </div>
        ) : (
          <div className="space-y-4">
            {bugs.map((bug: any) => (
              <FeedCard key={bug.id} bug={bug} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityFeed;
