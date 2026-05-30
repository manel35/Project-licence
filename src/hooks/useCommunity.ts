import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Public bugs feed
export const usePublicBugs = () => {
  return useQuery({
    queryKey: ["public-bugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bugs")
        .select("*, profiles!bugs_user_id_fkey(display_name, avatar_url)")
        .eq("is_public", true)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) {
        // fallback without join if fkey doesn't exist
        const { data: d2, error: e2 } = await supabase
          .from("bugs")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false });
        if (e2) throw e2;
        return d2;
      }
      return data;
    },
  });
};

// Likes
export const useLikes = (bugId: string) => {
  return useQuery({
    queryKey: ["likes", bugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("bug_id", bugId);
      if (error) throw error;
      return data;
    },
  });
};

export const useToggleLike = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (bugId: string) => {
      // Check if already liked
      const { data: existing } = await supabase
        .from("likes")
        .select("id")
        .eq("bug_id", bugId)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("likes").delete().eq("id", existing.id);
      } else {
        await supabase.from("likes").insert({ bug_id: bugId, user_id: user!.id });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["likes"] });
      qc.invalidateQueries({ queryKey: ["public-bugs"] });
    },
  });
};

// Comments
export const useComments = (bugId: string) => {
  return useQuery({
    queryKey: ["comments", bugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("bug_id", bugId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddComment = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ bugId, content }: { bugId: string; content: string }) => {
      const { error } = await supabase
        .from("comments")
        .insert({ bug_id: bugId, user_id: user!.id, content });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["comments", vars.bugId] });
    },
  });
};

export const useDeleteComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bugId }: { id: string; bugId: string }) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
      return bugId;
    },
    onSuccess: (bugId) => {
      qc.invalidateQueries({ queryKey: ["comments", bugId] });
    },
  });
};

// Follows
export const useFollowing = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["following", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      if (error) throw error;
      return data.map((f) => f.following_id);
    },
    enabled: !!user,
  });
};

export const useToggleFollow = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: existing } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user!.id)
        .eq("following_id", targetUserId)
        .maybeSingle();

      if (existing) {
        await supabase.from("follows").delete().eq("id", existing.id);
      } else {
        await supabase.from("follows").insert({ follower_id: user!.id, following_id: targetUserId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["following"] });
    },
  });
};

// User role check
export const useUserRole = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((r) => r.role);
    },
    enabled: !!user,
  });
};

// All users (admin)
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      const { data: roles, error: rErr } = await supabase
        .from("user_roles")
        .select("*");
      if (rErr) throw rErr;

      return (profiles || []).map((p: any) => ({
        ...p,
        user_roles: (roles || []).filter((r: any) => r.user_id === p.user_id),
      }));
    },
  });
};

// All bugs (admin)
export const useAllBugs = () => {
  return useQuery({
    queryKey: ["all-bugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bugs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
