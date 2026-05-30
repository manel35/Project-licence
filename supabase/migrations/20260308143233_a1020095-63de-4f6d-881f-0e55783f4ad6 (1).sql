
-- Add attachment_url column to bugs table
ALTER TABLE public.bugs ADD COLUMN attachment_url text DEFAULT NULL;

-- Create storage bucket for bug attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('bug-attachments', 'bug-attachments', true);

-- RLS: authenticated users can upload to their own folder
CREATE POLICY "Users can upload bug attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'bug-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: anyone can view attachments (public bucket)
CREATE POLICY "Anyone can view bug attachments"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'bug-attachments');

-- RLS: users can delete their own attachments
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'bug-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
