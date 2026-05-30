
-- Bug priority and status enums
CREATE TYPE public.bug_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.bug_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Bugs table
CREATE TABLE public.bugs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority bug_priority NOT NULL DEFAULT 'medium',
  status bug_status NOT NULL DEFAULT 'open',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bugs" ON public.bugs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bugs" ON public.bugs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bugs" ON public.bugs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bugs" ON public.bugs FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_bugs_updated_at
  BEFORE UPDATE ON public.bugs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resolutions table (linked to bugs)
CREATE TABLE public.resolutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bug_id UUID NOT NULL REFERENCES public.bugs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  fix_details TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resolutions" ON public.resolutions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resolutions" ON public.resolutions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resolutions" ON public.resolutions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resolutions" ON public.resolutions FOR DELETE USING (auth.uid() = user_id);

-- Reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bug_id UUID NOT NULL REFERENCES public.bugs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_bugs_user_id ON public.bugs(user_id);
CREATE INDEX idx_bugs_status ON public.bugs(status);
CREATE INDEX idx_bugs_priority ON public.bugs(priority);
CREATE INDEX idx_resolutions_bug_id ON public.resolutions(bug_id);
CREATE INDEX idx_reminders_bug_id ON public.reminders(bug_id);
CREATE INDEX idx_reminders_remind_at ON public.reminders(remind_at);
