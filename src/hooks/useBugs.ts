import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type Bug = Database["public"]["Tables"]["bugs"]["Row"];
type BugInsert = Database["public"]["Tables"]["bugs"]["Insert"];
type BugUpdate = Database["public"]["Tables"]["bugs"]["Update"];
type Resolution = Database["public"]["Tables"]["resolutions"]["Row"];
type ResolutionInsert = Database["public"]["Tables"]["resolutions"]["Insert"];
type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
type ReminderInsert = Database["public"]["Tables"]["reminders"]["Insert"];

export type { Bug, BugInsert, BugUpdate, Resolution, ResolutionInsert, Reminder, ReminderInsert };

export const useBugs = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bugs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bugs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Bug[];
    },
    enabled: !!user,
  });
};

export const useCreateBug = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (bug: Omit<BugInsert, "user_id">) => {
      const { data, error } = await supabase
        .from("bugs")
        .insert({ ...bug, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bugs"] }),
  });
};

export const useUpdateBug = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: BugUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("bugs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bugs"] }),
  });
};

export const useDeleteBug = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bugs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bugs"] }),
  });
};

// Resolutions
export const useResolutions = (bugId?: string) => {
  return useQuery({
    queryKey: ["resolutions", bugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resolutions")
        .select("*")
        .eq("bug_id", bugId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Resolution[];
    },
    enabled: !!bugId,
  });
};

export const useCreateResolution = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (res: Omit<ResolutionInsert, "user_id">) => {
      const { data, error } = await supabase
        .from("resolutions")
        .insert({ ...res, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["resolutions", vars.bug_id] });
      qc.invalidateQueries({ queryKey: ["bugs"] });
    },
  });
};

// Reminders
export const useReminders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*, bugs(title)")
        .eq("is_dismissed", false)
        .order("remind_at", { ascending: true });
      if (error) throw error;
      return data as (Reminder & { bugs: { title: string } | null })[];
    },
    enabled: !!user,
    refetchInterval: 30000, // check every 30s
  });
};

export const useCreateReminder = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (rem: Omit<ReminderInsert, "user_id">) => {
      const { data, error } = await supabase
        .from("reminders")
        .insert({ ...rem, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
};

export const useDismissReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reminders")
        .update({ is_dismissed: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
};
