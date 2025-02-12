-- Enable the necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('farmer', 'laborer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    phone text unique not null,
    user_type user_type not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    avatar_url text,
    is_phone_verified boolean default false,
    location jsonb,
    rating decimal(3,2) default 0.0,
    total_ratings integer default 0,
    bio text,
    skills text[],
    availability jsonb,
    wage_range jsonb,
    completed_jobs integer default 0,
    total_earnings decimal(10,2) default 0.0
);

-- Insert test user
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- Create test user in auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        phone_confirmed_at,
        phone,
        created_at,
        updated_at,
        raw_user_meta_data
    )
    VALUES (
        uuid_generate_v4(),
        'rohan@test.com',
        crypt('test-password', gen_salt('bf')),
        now(),
        now(),
        '1234',
        now(),
        now(),
        jsonb_build_object(
            'name', 'rohan',
            'user_type', 'farmer'
        )
    )
    ON CONFLICT (email) DO UPDATE
    SET phone = EXCLUDED.phone,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data
    RETURNING id INTO test_user_id;

    -- Create or update profile for test user
    INSERT INTO public.profiles (
        id,
        name,
        phone,
        user_type,
        is_phone_verified
    )
    VALUES (
        test_user_id,
        'rohan',
        '1234',
        'farmer',
        true
    )
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        user_type = EXCLUDED.user_type,
        is_phone_verified = EXCLUDED.is_phone_verified;
END
$$;

-- Create jobs table
create table public.jobs (
    id uuid default uuid_generate_v4() primary key,
    farmer_id uuid references public.profiles(id) on delete cascade,
    title text not null,
    description text not null,
    location jsonb not null,
    wage_per_day decimal(10,2) not null,
    workers_needed integer not null,
    start_date date not null,
    end_date date not null,
    skills_required text[],
    status job_status default 'draft',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create job applications table
create table public.job_applications (
    id uuid default uuid_generate_v4() primary key,
    job_id uuid references public.jobs(id) on delete cascade,
    laborer_id uuid references public.profiles(id) on delete cascade,
    status application_status default 'pending',
    cover_note text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique(job_id, laborer_id)
);

-- Create reviews table
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    reviewer_id uuid references public.profiles(id) on delete cascade,
    reviewee_id uuid references public.profiles(id) on delete cascade,
    job_id uuid references public.jobs(id) on delete cascade,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique(reviewer_id, reviewee_id, job_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.reviews enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (true);

create policy "Users can insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Create policies for jobs
create policy "Jobs are viewable by everyone"
    on jobs for select
    using (true);

create policy "Farmers can create jobs"
    on jobs for insert
    with check (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and user_type = 'farmer'
        )
    );

create policy "Farmers can update their own jobs"
    on jobs for update
    using (farmer_id = auth.uid());

-- Create policies for job applications
create policy "Job applications are viewable by job owner and applicant"
    on job_applications for select
    using (
        exists (
            select 1 from jobs
            where jobs.id = job_applications.job_id
            and jobs.farmer_id = auth.uid()
        )
        or
        laborer_id = auth.uid()
    );

create policy "Laborers can apply to jobs"
    on job_applications for insert
    with check (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and user_type = 'laborer'
        )
        and
        laborer_id = auth.uid()
    );

create policy "Job owners and applicants can update applications"
    on job_applications for update
    using (
        exists (
            select 1 from jobs
            where jobs.id = job_applications.job_id
            and jobs.farmer_id = auth.uid()
        )
        or
        laborer_id = auth.uid()
    );

-- Create policies for reviews
create policy "Reviews are viewable by everyone"
    on reviews for select
    using (true);

create policy "Users can create reviews for completed jobs"
    on reviews for insert
    with check (
        exists (
            select 1 from job_applications
            where job_applications.job_id = reviews.job_id
            and (
                (job_applications.laborer_id = auth.uid() and reviews.reviewer_id = auth.uid())
                or
                exists (
                    select 1 from jobs
                    where jobs.id = job_applications.job_id
                    and jobs.farmer_id = auth.uid()
                    and reviews.reviewer_id = auth.uid()
                )
            )
            and job_applications.status = 'completed'
        )
    );

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, name, phone, user_type)
    values (
        new.id,
        new.raw_user_meta_data->>'name',
        new.phone,
        (new.raw_user_meta_data->>'user_type')::user_type
    );
    return new;
end;
$$;

-- Create trigger for new user signup
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create triggers for updating the updated_at column
create trigger update_profiles_updated_at
    before update on profiles
    for each row execute procedure update_updated_at_column();

create trigger update_jobs_updated_at
    before update on jobs
    for each row execute procedure update_updated_at_column();

create trigger update_applications_updated_at
    before update on job_applications
    for each row execute procedure update_updated_at_column();

create trigger update_reviews_updated_at
    before update on reviews
    for each row execute procedure update_updated_at_column();

-- Create function to update profile ratings
create or replace function update_profile_rating()
returns trigger
language plpgsql
security definer
as $$
begin
    update profiles
    set rating = (
        select avg(rating)::decimal(3,2)
        from reviews
        where reviewee_id = new.reviewee_id
    ),
    total_ratings = (
        select count(*)
        from reviews
        where reviewee_id = new.reviewee_id
    )
    where id = new.reviewee_id;
    return new;
end;
$$;

-- Create trigger for updating profile ratings
create trigger on_review_created
    after insert or update on reviews
    for each row execute procedure update_profile_rating(); 