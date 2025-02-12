-- First drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_worker_history_updated_at ON worker_history;
DROP TRIGGER IF EXISTS on_review_created ON reviews;
DROP TRIGGER IF EXISTS on_application_change ON job_applications;
DROP TRIGGER IF EXISTS on_application_status_change ON job_applications;
DROP TRIGGER IF EXISTS on_worker_status_change ON profiles;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS check_user_exists(text) CASCADE;
DROP FUNCTION IF EXISTS update_profile_rating() CASCADE;
DROP FUNCTION IF EXISTS update_job_application_counts() CASCADE;
DROP FUNCTION IF EXISTS create_notification(uuid, notification_type, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS handle_application_status_change() CASCADE;
DROP FUNCTION IF EXISTS handle_worker_status_change() CASCADE;

-- Drop all policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System can create profiles" ON profiles;

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Farmers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Farmers can update own jobs" ON jobs;

DROP POLICY IF EXISTS "Job applications viewable by job owner and applicant" ON job_applications;
DROP POLICY IF EXISTS "Laborers can create applications" ON job_applications;
DROP POLICY IF EXISTS "Job owner and applicant can update application" ON job_applications;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

DROP POLICY IF EXISTS "Worker history viewable by involved parties" ON worker_history;
DROP POLICY IF EXISTS "System can create worker history" ON worker_history;
DROP POLICY IF EXISTS "System can update worker history" ON worker_history;

-- Disable RLS on all tables
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS worker_history DISABLE ROW LEVEL SECURITY;

-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS worker_history CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS worker_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- Drop extensions if no other database objects need them
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;

-- Revoke permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated, anon, service_role;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated, anon, service_role;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM authenticated, anon, service_role;
REVOKE USAGE ON SCHEMA public FROM authenticated, anon, service_role;

REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM authenticated, service_role;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM authenticated, service_role;
REVOKE ALL ON ALL ROUTINES IN SCHEMA auth FROM authenticated, service_role;
REVOKE USAGE ON SCHEMA auth FROM authenticated, service_role;

-- Drop indexes
DROP INDEX IF EXISTS idx_worker_history_farmer_id;
DROP INDEX IF EXISTS idx_worker_history_worker_id;
DROP INDEX IF EXISTS idx_notifications_is_read;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_reviews_reviewee_id;
DROP INDEX IF EXISTS idx_job_applications_status;
DROP INDEX IF EXISTS idx_job_applications_laborer_id;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_jobs_status;
DROP INDEX IF EXISTS idx_jobs_farmer_id;
DROP INDEX IF EXISTS idx_profiles_status;
DROP INDEX IF EXISTS idx_profiles_user_type; 