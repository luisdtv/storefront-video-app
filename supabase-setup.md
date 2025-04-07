# Supabase Database Setup Guide

This guide provides the SQL scripts needed to set up the database schema and security policies for the Storefront Video Platform project in your Supabase instance.

## How to Use This Guide

1.  **Navigate to Supabase Dashboard:** Log in to your Supabase project dashboard.
2.  **Open SQL Editor:** In the left sidebar, click on the **SQL Editor** icon (looks like `<> SQL`).
3.  **New Query:** Click on the "+ New query" button.
4.  **Copy and Run Scripts:** Copy each SQL script block below (one block at a time) into the query editor.
5.  **Execute:** Click the "Run" button (or use Cmd/Ctrl + Enter).
6.  **Verify:** Check for success messages. Repeat for each script block.

---

## 1. Helper Function: Auto-update `updated_at` Timestamp

This function automatically updates the `updated_at` column whenever a row is modified.

```sql
-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission (needed if function is security definer, good practice)
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role;

-- Note: Triggers will be added after table creation.
```

---

## 2. Create `businesses` Table

This table stores information about the businesses registered on the platform.

```sql
-- Create the businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) > 0),
  description TEXT,
  address TEXT,
  phone_number TEXT,
  website TEXT CHECK (website IS NULL OR website ~ '^https?://.+'), -- Basic URL check
  hours_of_operation JSONB, -- Flexible format for opening hours
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.businesses IS 'Stores information about registered businesses.';
COMMENT ON COLUMN public.businesses.owner_id IS 'The user who owns and manages this business profile.';
COMMENT ON COLUMN public.businesses.hours_of_operation IS 'Stores opening hours, e.g., {"Mon": "9am-5pm", "Tue": "9am-5pm"}';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS on_businesses_updated ON public.businesses; -- idempotent
CREATE TRIGGER on_businesses_updated
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();
```

---

## 3. Create `videos` Table

This table stores metadata about the videos uploaded by businesses.

```sql
-- Create the videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Keep video if uploader leaves? Or CASCADE? Let's keep it for now.
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  description TEXT,
  video_url TEXT NOT NULL CHECK (video_url ~ '^https?://.+'), -- URL from Cloudinary or other storage
  thumbnail_url TEXT CHECK (thumbnail_url IS NULL OR thumbnail_url ~ '^https?://.+'),
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  tags TEXT[], -- Array of text tags for categorization/search
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add indexes for common query patterns
CREATE INDEX idx_videos_business_id ON public.videos(business_id);
CREATE INDEX idx_videos_uploader_id ON public.videos(uploader_id);

-- Add comments
COMMENT ON TABLE public.videos IS 'Stores metadata for uploaded storefront videos.';
COMMENT ON COLUMN public.videos.business_id IS 'The business this video belongs to.';
COMMENT ON COLUMN public.videos.uploader_id IS 'The user who uploaded the video.';
COMMENT ON COLUMN public.videos.video_url IS 'Public URL of the video file (e.g., on Cloudinary).';
COMMENT ON COLUMN public.videos.tags IS 'Keywords for searching and filtering.';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS on_videos_updated ON public.videos; -- idempotent
CREATE TRIGGER on_videos_updated
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();
```

---

## 4. Enable Row Level Security (RLS)

RLS must be enabled on tables before policies can take effect.

```sql
-- Enable RLS for businesses table
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Enable RLS for videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
```

---

## 5. Define RLS Policies for `businesses`

These policies control who can view, create, update, or delete business profiles.

```sql
-- Allow public read access to all businesses
DROP POLICY IF EXISTS "Allow public read access" ON public.businesses;
CREATE POLICY "Allow public read access"
ON public.businesses
FOR SELECT
USING (true);

-- Allow authenticated users to insert their own business
DROP POLICY IF EXISTS "Allow authenticated users to insert their own business" ON public.businesses;
CREATE POLICY "Allow authenticated users to insert their own business"
ON public.businesses
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Allow owners to update their own business
DROP POLICY IF EXISTS "Allow owners to update their own business" ON public.businesses;
CREATE POLICY "Allow owners to update their own business"
ON public.businesses
FOR UPDATE
USING (auth.role() = 'authenticated' AND owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid()); -- Redundant check for clarity

-- Allow owners to delete their own business
DROP POLICY IF EXISTS "Allow owners to delete their own business" ON public.businesses;
CREATE POLICY "Allow owners to delete their own business"
ON public.businesses
FOR DELETE
USING (auth.role() = 'authenticated' AND owner_id = auth.uid());
```

---

## 6. Define RLS Policies for `videos`

These policies control who can view, create, update, or delete videos.

```sql
-- Allow public read access to all videos
DROP POLICY IF EXISTS "Allow public read access" ON public.videos;
CREATE POLICY "Allow public read access"
ON public.videos
FOR SELECT
USING (true);

-- Allow authenticated users to insert videos for businesses they own
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

-- Allow uploaders to update their own videos
DROP POLICY IF EXISTS "Allow uploaders to update their own videos" ON public.videos;
CREATE POLICY "Allow uploaders to update their own videos"
ON public.videos
FOR UPDATE
USING (auth.role() = 'authenticated' AND uploader_id = auth.uid())
WITH CHECK (uploader_id = auth.uid()); -- Redundant check for clarity

-- Allow uploaders to delete their own videos
DROP POLICY IF EXISTS "Allow uploaders to delete their own videos" ON public.videos;
CREATE POLICY "Allow uploaders to delete their own videos"
ON public.videos
FOR DELETE
USING (auth.role() = 'authenticated' AND uploader_id = auth.uid());

```

---

Setup Complete! You should now have the necessary tables and security policies configured in your Supabase database.
