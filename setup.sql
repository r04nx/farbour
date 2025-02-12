-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if they exist
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS worker_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- Set up initial permissions
ALTER ROLE authenticated SET search_path = public;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant necessary permissions to the postgres role for auth schema
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, authenticated, service_role;

-- Create custom types (enums)
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

-- Create profiles table first (before the trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  user_type user_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  avatar_url TEXT,
  is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  location JSONB,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  skills TEXT[],
  availability JSONB,
  wage_range JSONB,
  completed_jobs INTEGER NOT NULL DEFAULT 0,
  total_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  status worker_status NOT NULL DEFAULT 'available',
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notification_preferences JSONB NOT NULL DEFAULT '{"push": true, "email": true}'::jsonb,
  theme_preference TEXT NOT NULL DEFAULT 'light',
  language_preference TEXT NOT NULL DEFAULT 'en',
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    phone_number text;
    user_type_val user_type;
    name_val text;
    meta_data jsonb;
BEGIN
    -- Get the phone number from the new user
    phone_number := NEW.phone;
    
    -- Get the raw user metadata
    meta_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
    
    -- Extract and validate user_type from metadata
    BEGIN
        user_type_val := (meta_data->>'user_type')::user_type;
    EXCEPTION WHEN OTHERS THEN
        -- Default to farmer if not specified or invalid
        user_type_val := 'farmer'::user_type;
        RAISE WARNING 'Invalid user_type in metadata: %. Defaulting to farmer', meta_data->>'user_type';
    END;
    
    -- Get name from metadata
    name_val := COALESCE(meta_data->>'name', 'New User');
    
    -- Log the values for debugging
    RAISE WARNING 'Creating profile - Phone: %, Name: %, Type: %', phone_number, name_val, user_type_val;
    
    -- Create a new profile for the user
    INSERT INTO public.profiles (
        id,
        name,
        phone,
        user_type,
        is_phone_verified,
        created_at,
        updated_at,
        rating,
        total_ratings,
        completed_jobs,
        total_earnings,
        status,
        last_active,
        notification_preferences,
        theme_preference,
        language_preference
    ) VALUES (
        NEW.id,
        name_val,
        phone_number,
        user_type_val,
        true,
        NOW(),
        NOW(),
        0,
        0,
        0,
        0,
        'available',
        NOW(),
        '{"push": true, "email": true}'::jsonb,
        'light',
        'en'
    );
    
    RAISE WARNING 'Profile created successfully for user %', NEW.id;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "System can create profiles"
    ON profiles FOR INSERT
    TO authenticated, service_role
    WITH CHECK (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  wage_per_day NUMERIC(10,2) NOT NULL,
  workers_needed INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  skills_required TEXT[] NOT NULL,
  status job_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applications_count INTEGER NOT NULL DEFAULT 0,
  hired_count INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  equipment_provided TEXT[],
  accommodation_provided BOOLEAN NOT NULL DEFAULT FALSE,
  accommodation_details TEXT,
  transportation_provided BOOLEAN NOT NULL DEFAULT FALSE,
  transportation_details TEXT,
  additional_notes TEXT,
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT positive_wage CHECK (wage_per_day > 0),
  CONSTRAINT positive_workers CHECK (workers_needed > 0)
);

-- Create job applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  laborer_id UUID NOT NULL REFERENCES profiles(id),
  status application_status NOT NULL DEFAULT 'pending',
  cover_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_start_date DATE,
  expected_end_date DATE,
  negotiated_wage NUMERIC(10,2),
  farmer_notes TEXT,
  laborer_notes TEXT,
  rejection_reason TEXT,
  completion_date TIMESTAMPTZ,
  CONSTRAINT unique_job_application UNIQUE (job_id, laborer_id)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  job_id UUID NOT NULL REFERENCES jobs(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  work_quality INTEGER,
  reliability INTEGER,
  communication INTEGER,
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT quality_range CHECK (work_quality IS NULL OR (work_quality >= 1 AND work_quality <= 5)),
  CONSTRAINT reliability_range CHECK (reliability IS NULL OR (reliability >= 1 AND reliability <= 5)),
  CONSTRAINT communication_range CHECK (communication IS NULL OR (communication >= 1 AND communication <= 5)),
  CONSTRAINT unique_job_review UNIQUE (reviewer_id, reviewee_id, job_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create worker history table
CREATE TABLE worker_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES profiles(id),
  farmer_id UUID NOT NULL REFERENCES profiles(id),
  job_id UUID NOT NULL REFERENCES jobs(id),
  start_date DATE NOT NULL,
  end_date DATE,
  wage_per_day NUMERIC(10,2) NOT NULL,
  total_days INTEGER,
  total_earnings NUMERIC(10,2),
  status application_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT positive_wage CHECK (wage_per_day > 0),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_total_days CHECK (total_days IS NULL OR total_days > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_jobs_farmer_id ON jobs(farmer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_laborer_id ON job_applications(laborer_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_worker_history_worker_id ON worker_history(worker_id);
CREATE INDEX idx_worker_history_farmer_id ON worker_history(farmer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_history_updated_at
    BEFORE UPDATE ON worker_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_history ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
ON jobs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Farmers can create jobs"
ON jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update own jobs"
ON jobs FOR UPDATE
TO authenticated
USING (auth.uid() = farmer_id);

-- Job applications policies
CREATE POLICY "Job applications viewable by job owner and applicant"
ON job_applications FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT farmer_id FROM jobs WHERE id = job_id
        UNION
        SELECT laborer_id
    )
);

CREATE POLICY "Laborers can create applications"
ON job_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = laborer_id);

CREATE POLICY "Job owner and applicant can update application"
ON job_applications FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (
        SELECT farmer_id FROM jobs WHERE id = job_id
        UNION
        SELECT laborer_id
    )
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Worker history policies
CREATE POLICY "Worker history viewable by involved parties"
ON worker_history FOR SELECT
TO authenticated
USING (auth.uid() IN (worker_id, farmer_id));

CREATE POLICY "System can create worker history"
ON worker_history FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "System can update worker history"
ON worker_history FOR UPDATE
TO authenticated
USING (true);

-- Function to check if user exists and get profile
CREATE OR REPLACE FUNCTION check_user_exists(phone_number text)
RETURNS TABLE (
    exists_in_auth boolean,
    exists_in_profiles boolean,
    profile_data jsonb
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
                to_jsonb(user_profile)
            ELSE 
                NULL::jsonb
        END as profile_data;
END;
$$;

-- Function to update profile rating
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS trigger AS $$
DECLARE
    avg_rating numeric;
    total_count integer;
BEGIN
    -- Calculate new average rating and total count
    SELECT 
        avg(rating),
        count(*)
    INTO
        avg_rating,
        total_count
    FROM reviews
    WHERE reviewee_id = NEW.reviewee_id;

    -- Update the profile
    UPDATE profiles
    SET
        rating = COALESCE(avg_rating, 0),
        total_ratings = total_count
    WHERE id = NEW.reviewee_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update job application counts
CREATE OR REPLACE FUNCTION update_job_application_counts()
RETURNS trigger AS $$
DECLARE
    app_count integer;
    hired_count integer;
BEGIN
    -- Calculate new counts
    SELECT
        count(*),
        count(*) filter (where status = 'accepted')
    INTO
        app_count,
        hired_count
    FROM job_applications
    WHERE job_id = COALESCE(NEW.job_id, OLD.job_id);

    -- Update the job
    UPDATE jobs
    SET
        applications_count = app_count,
        hired_count = hired_count
    WHERE id = COALESCE(NEW.job_id, OLD.job_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
    user_id uuid,
    type notification_type,
    title text,
    message text,
    data jsonb default null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (user_id, type, title, message, data);
END;
$$;

-- Function to handle application status changes
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS trigger AS $$
DECLARE
    job_title text;
    farmer_id uuid;
    laborer_name text;
BEGIN
    -- Get job title and farmer_id
    SELECT title, farmer_id INTO job_title, farmer_id
    FROM jobs WHERE id = NEW.job_id;

    -- Get laborer name
    SELECT name INTO laborer_name
    FROM profiles WHERE id = NEW.laborer_id;

    -- Create appropriate notification based on status change
    CASE NEW.status
        WHEN 'accepted' THEN
            -- Notify worker
            PERFORM create_notification(
                NEW.laborer_id,
                'application_accepted',
                'Application Accepted',
                format('Your application for "%s" has been accepted', job_title),
                jsonb_build_object('job_id', NEW.job_id)
            );
        WHEN 'rejected' THEN
            -- Notify worker
            PERFORM create_notification(
                NEW.laborer_id,
                'application_rejected',
                'Application Rejected',
                format('Your application for "%s" has been rejected', job_title),
                jsonb_build_object('job_id', NEW.job_id)
            );
        WHEN 'completed' THEN
            -- Notify both parties
            PERFORM create_notification(
                farmer_id,
                'job_completed',
                'Job Completed',
                format('Job "%s" has been marked as completed by %s', job_title, laborer_name),
                jsonb_build_object('job_id', NEW.job_id)
            );
            PERFORM create_notification(
                NEW.laborer_id,
                'job_completed',
                'Job Completed',
                format('Job "%s" has been marked as completed', job_title),
                jsonb_build_object('job_id', NEW.job_id)
            );
        ELSE
            -- Do nothing for other status changes
    END CASE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle worker status changes
CREATE OR REPLACE FUNCTION handle_worker_status_change()
RETURNS trigger AS $$
BEGIN
    -- Update last_active timestamp
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create additional triggers
CREATE TRIGGER on_review_created
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

CREATE TRIGGER on_application_change
    AFTER INSERT OR UPDATE OR DELETE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_application_counts();

CREATE TRIGGER on_application_status_change
    AFTER UPDATE OF status ON job_applications
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_application_status_change();

CREATE TRIGGER on_worker_status_change
    BEFORE UPDATE OF status ON profiles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_worker_status_change(); 