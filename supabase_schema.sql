-- Drop existing tables if they exist (USE WITH CAUTION!)
DROP TABLE IF EXISTS public.videos;
DROP TABLE IF EXISTS public.businesses;

-- Helper Function: Auto-update updated_at Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role;

-- Create businesses Table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) > 0),
  description TEXT,
  address TEXT,
  phone_number TEXT,
  website TEXT CHECK (website IS NULL OR website ~ '^https?://.+'),
  hours_of_operation JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.businesses IS 'Stores information about registered businesses.';
COMMENT ON COLUMN public.businesses.owner_id IS 'The user who owns and manages this business profile.';
COMMENT ON COLUMN public.businesses.hours_of_operation IS 'Stores opening hours, e.g., {"Mon": "9am-5pm", "Tue": "9am-5pm"}';

DROP TRIGGER IF EXISTS on_businesses_updated ON public.businesses;
CREATE TRIGGER on_businesses_updated
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- Create videos Table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  description TEXT,
  video_url TEXT NOT NULL CHECK (video_url ~ '^https?://.+'),
  thumbnail_url TEXT CHECK (thumbnail_url IS NULL OR thumbnail_url ~ '^https?://.+'),
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_videos_business_id ON public.videos(business_id);
CREATE INDEX idx_videos_uploader_id ON public.videos(uploader_id);

COMMENT ON TABLE public.videos IS 'Stores metadata for uploaded storefront videos.';
COMMENT ON COLUMN public.videos.business_id IS 'The business this video belongs to.';
COMMENT ON COLUMN public.videos.uploader_id IS 'The user who uploaded the video.';
COMMENT ON COLUMN public.videos.video_url IS 'Public URL of the video file (e.g., on Cloudinary).';
COMMENT ON COLUMN public.videos.tags IS 'Keywords for searching and filtering.';

DROP TRIGGER IF EXISTS on_videos_updated ON public.videos;
CREATE TRIGGER on_videos_updated
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Define RLS Policies for businesses
DROP POLICY IF EXISTS "Allow public read access" ON public.businesses;
CREATE POLICY "Allow public read access"
ON public.businesses
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert their own business" ON public.businesses;
CREATE POLICY "Allow authenticated users to insert their own business"
ON public.businesses
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

DROP POLICY IF EXISTS "Allow owners to update their own business" ON public.businesses;
CREATE POLICY "Allow owners to update their own business"
ON public.businesses
FOR UPDATE
USING (auth.role() = 'authenticated' AND owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Allow owners to delete their own business" ON public.businesses;
CREATE POLICY "Allow owners to delete their own business"
ON public.businesses
FOR DELETE
USING (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Define RLS Policies for videos
DROP POLICY IF EXISTS "Allow public read access" ON public.videos;
CREATE POLICY "Allow public read access"
ON public.videos
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert videos for own business" ON public.videos;
CREATE POLICY "Allow authenticated users to insert videos for own business"
ON public.videos
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  uploader_id = auth.uid() AND
  EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = videos.business_id AND b.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow uploaders to update their own videos" ON public.videos;
CREATE POLICY "Allow uploaders to update their own videos"
ON public.videos
FOR UPDATE
USING (auth.role() = 'authenticated' AND uploader_id = auth.uid())
WITH CHECK (uploader_id = auth.uid());

DROP POLICY IF EXISTS "Allow uploaders to delete their own videos" ON public.videos;
CREATE POLICY "Allow uploaders to delete their own videos"
ON public.videos
FOR DELETE
USING (auth.role() = 'authenticated' AND uploader_id = auth.uid());
