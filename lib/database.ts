import { supabase } from './supabase';
import {
  Profile,
  Job,
  JobApplication,
  Review,
  Notification,
  WorkerHistory,
  JobStatus,
  ApplicationStatus,
  WorkerStatus,
} from '@/types/database';

// Profile functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}

// Job functions
export async function getJobs(farmerId: string, status?: JobStatus) {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Job[];
}

export async function getJob(jobId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  
  if (error) throw error;
  return data as Job;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'applications_count' | 'hired_count'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single();
  
  if (error) throw error;
  return data as Job;
}

export async function updateJob(jobId: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Job;
}

// Application functions
export async function getApplications(jobId: string) {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      laborer:profiles!job_applications_laborer_id_fkey(
        id,
        name,
        avatar_url,
        rating,
        total_ratings,
        skills
      )
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function updateApplication(applicationId: string, updates: Partial<JobApplication>) {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();
  
  if (error) throw error;
  return data as JobApplication;
}

// Worker functions
export async function getWorkers(farmerId: string, status?: WorkerStatus) {
  let query = supabase
    .from('worker_history')
    .select(`
      *,
      worker:profiles!worker_history_worker_id_fkey(
        id,
        name,
        avatar_url,
        location,
        rating,
        total_ratings,
        skills,
        status,
        last_active
      )
    `)
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('worker.status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getWorkerHistory(workerId: string, farmerId: string) {
  const { data, error } = await supabase
    .from('worker_history')
    .select(`
      *,
      job:jobs(
        id,
        title,
        category
      )
    `)
    .eq('worker_id', workerId)
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Review functions
export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  return data as Review;
}

export async function getReviews(revieweeId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(
        id,
        name,
        avatar_url
      )
    `)
    .eq('reviewee_id', revieweeId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Notification functions
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Notification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Notification;
}

// Stats functions
export async function getFarmerStats(farmerId: string) {
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('status')
    .eq('farmer_id', farmerId);

  if (jobsError) throw jobsError;

  const { data: workers, error: workersError } = await supabase
    .from('worker_history')
    .select('worker_id')
    .eq('farmer_id', farmerId)
    .distinct();

  if (workersError) throw workersError;

  return {
    activeJobs: jobs?.filter(j => j.status === 'active').length || 0,
    totalWorkers: workers?.length || 0,
    completedJobs: jobs?.filter(j => j.status === 'completed').length || 0,
  };
} 