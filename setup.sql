-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS worker_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Create custom types
CREATE TYPE user_type AS ENUM ('farmer', 'laborer');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE worker_status AS ENUM ('available', 'working', 'unavailable');
CREATE TYPE notification_type AS ENUM (
    'application_received',
    'application_accepted',
    'application_rejected',
    'job_completed',
    'worker_hired',
    'payment_received',
    'review_received'
);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS worker_history CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name text NOT NULL,
    phone text NOT NULL UNIQUE,
    user_type user_type NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    avatar_url text,
    is_phone_verified boolean DEFAULT false,
    location jsonb,
    rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_ratings integer DEFAULT 0,
    bio text,
    skills text[],
    availability jsonb,
    wage_range jsonb,
    completed_jobs integer DEFAULT 0,
    total_earnings numeric(10,2) DEFAULT 0,
    status worker_status DEFAULT 'available',
    last_active timestamptz DEFAULT now(),
    notification_preferences jsonb DEFAULT '{"push": true, "email": true}'::jsonb,
    theme_preference text DEFAULT 'light',
    language_preference text DEFAULT 'en'
);

-- Create jobs table
CREATE TABLE public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    location jsonb NOT NULL,
    wage_per_day numeric(10,2) NOT NULL CHECK (wage_per_day > 0),
    workers_needed integer NOT NULL CHECK (workers_needed > 0),
    start_date date NOT NULL,
    end_date date NOT NULL,
    skills_required text[] NOT NULL,
    status job_status DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    applications_count integer DEFAULT 0,
    hired_count integer DEFAULT 0,
    category text,
    equipment_provided text[],
    accommodation_provided boolean DEFAULT false,
    accommodation_details text,
    transportation_provided boolean DEFAULT false,
    transportation_details text,
    additional_notes text,
    CHECK (start_date <= end_date)
);

-- Create job applications table
CREATE TABLE public.job_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    laborer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    cover_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    expected_start_date date,
    expected_end_date date,
    negotiated_wage numeric(10,2),
    farmer_notes text,
    laborer_notes text,
    rejection_reason text,
    completion_date timestamptz,
    UNIQUE(job_id, laborer_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    rating numeric(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    work_quality numeric(3,2) CHECK (work_quality >= 0 AND work_quality <= 5),
    reliability numeric(3,2) CHECK (reliability >= 0 AND reliability <= 5),
    communication numeric(3,2) CHECK (communication >= 0 AND communication <= 5),
    UNIQUE(reviewer_id, reviewee_id, job_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create worker history table
CREATE TABLE public.worker_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date,
    wage_per_day numeric(10,2) NOT NULL,
    total_days integer,
    total_earnings numeric(10,2),
    status application_status NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Function to check if user exists and get profile
CREATE OR REPLACE FUNCTION check_user_exists(phone_number text)
RETURNS TABLE (
    exists_in_auth boolean,
    exists_in_profiles boolean,
    profile_data json
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user auth.users;
    user_profile profiles;
BEGIN
    -- Check in auth.users
    SELECT * INTO auth_user FROM auth.users WHERE phone = phone_number LIMIT 1;
    
    -- Check in profiles
    SELECT * INTO user_profile FROM profiles 
    WHERE phone = phone_number LIMIT 1;

    RETURN QUERY
    SELECT 
        auth_user IS NOT NULL as exists_in_auth,
        user_profile IS NOT NULL as exists_in_profiles,
        CASE 
            WHEN user_profile IS NOT NULL THEN 
                row_to_json(user_profile)
            ELSE 
                NULL::json
        END as profile_data;
END;
$$;

-- Modified handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  phone_number text;
BEGIN
  -- Get the phone number from the new user
  phone_number := NEW.phone;

  -- Create a new profile for the user
  INSERT INTO public.profiles (
    id,
    name,
    phone,
    user_type,
    is_phone_verified,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    phone_number,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'farmer')::user_type,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    user_type = EXCLUDED.user_type,
    is_phone_verified = true,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_profile_rating()
returns trigger
language plpgsql
as $$
declare
    avg_rating numeric;
    total_count integer;
begin
    -- Calculate new average rating and total count
    select 
        avg(rating),
        count(*)
    into
        avg_rating,
        total_count
    from reviews
    where reviewee_id = new.reviewee_id;

    -- Update the profile
    update profiles
    set
        rating = coalesce(avg_rating, 0),
        total_ratings = total_count
    where id = new.reviewee_id;

    return new;
end;
$$;

CREATE OR REPLACE FUNCTION update_job_application_counts()
returns trigger
language plpgsql
as $$
declare
    app_count integer;
    hired_count integer;
begin
    -- Calculate new counts
    select
        count(*),
        count(*) filter (where status = 'accepted')
    into
        app_count,
        hired_count
    from job_applications
    where job_id = coalesce(new.job_id, old.job_id);

    -- Update the job
    update jobs
    set
        applications_count = app_count,
        hired_count = hired_count
    where id = coalesce(new.job_id, old.job_id);

    return new;
end;
$$;

CREATE OR REPLACE FUNCTION create_notification(
    user_id uuid,
    type notification_type,
    title text,
    message text,
    data jsonb default null
)
returns void
language plpgsql
security definer
as $$
begin
    insert into notifications (user_id, type, title, message, data)
    values (user_id, type, title, message, data);
end;
$$;

CREATE OR REPLACE FUNCTION handle_application_status_change()
returns trigger
language plpgsql
security definer
as $$
declare
    job_title text;
    farmer_id uuid;
    laborer_name text;
begin
    -- Get job title and farmer_id
    select title, farmer_id into job_title, farmer_id
    from jobs where id = new.job_id;

    -- Get laborer name
    select name into laborer_name
    from profiles where id = new.laborer_id;

    -- Create appropriate notification based on status change
    case new.status
        when 'accepted' then
            -- Notify worker
            perform create_notification(
                new.laborer_id,
                'application_accepted',
                'Application Accepted',
                format('Your application for "%s" has been accepted', job_title),
                jsonb_build_object('job_id', new.job_id)
            );
        when 'rejected' then
            -- Notify worker
            perform create_notification(
                new.laborer_id,
                'application_rejected',
                'Application Rejected',
                format('Your application for "%s" has been rejected', job_title),
                jsonb_build_object('job_id', new.job_id)
            );
        when 'completed' then
            -- Notify both parties
            perform create_notification(
                farmer_id,
                'job_completed',
                'Job Completed',
                format('Job "%s" has been marked as completed by %s', job_title, laborer_name),
                jsonb_build_object('job_id', new.job_id)
            );
            perform create_notification(
                new.laborer_id,
                'job_completed',
                'Job Completed',
                format('Job "%s" has been marked as completed', job_title),
                jsonb_build_object('job_id', new.job_id)
            );
        else
            -- Do nothing for other status changes
    end case;

    return new;
end;
$$;

CREATE OR REPLACE FUNCTION handle_worker_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Update last_active timestamp
    new.last_active = now();
    return new;
end;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON job_applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

DROP TRIGGER IF EXISTS on_application_change ON job_applications;
CREATE TRIGGER on_application_change
    AFTER INSERT OR UPDATE OR DELETE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_application_counts();

DROP TRIGGER IF EXISTS on_application_status_change ON job_applications;
CREATE TRIGGER on_application_status_change
    AFTER UPDATE OF status ON job_applications
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_application_status_change();

DROP TRIGGER IF EXISTS on_worker_status_change ON profiles;
CREATE TRIGGER on_worker_status_change
    BEFORE UPDATE OF status ON profiles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_worker_status_change();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "System can create user profiles" ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "System can create user profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- Rest of the policies remain the same...
CREATE POLICY "Farmers can view their own jobs"
    ON public.jobs FOR SELECT
    USING (farmer_id = auth.uid());

CREATE POLICY "Farmers can create jobs"
    ON public.jobs FOR INSERT
    WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can update their own jobs"
    ON public.jobs FOR UPDATE
    USING (farmer_id = auth.uid());

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Worker history viewable by involved parties"
    ON public.worker_history FOR SELECT
    USING (
        worker_id = auth.uid()
        or
        farmer_id = auth.uid()
    ); 