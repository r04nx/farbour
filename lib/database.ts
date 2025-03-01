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

interface WorkerHistoryWithProfile {
  id: string;
  status: string;
  total_earnings: number;
  worker: {
    id: string;
    name: string;
  };
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test error:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
}

// Stats functions
export async function getFarmerStats(farmerId: string) {
  try {
    console.log('Fetching stats for farmer:', farmerId);
    
    // First verify the farmer exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_type')
      .eq('id', farmerId)
      .single();

    if (profileError) {
      console.error('Error fetching farmer profile:', profileError);
      throw new Error(`Farmer profile not found: ${profileError.message}`);
    }

    if (!profile) {
      throw new Error('Farmer profile not found');
    }

    if (profile.user_type !== 'farmer') {
      throw new Error('User is not a farmer');
    }

    // Now fetch the stats
    const { data: stats, error: statsError } = await supabase
      .rpc('get_farmer_stats', { farmer_id: farmerId });

    if (statsError) {
      console.error('Supabase RPC error:', statsError);
      throw new Error(`Error fetching stats: ${statsError.message}`);
    }
    
    if (!stats) {
      console.error('No stats returned from database');
      throw new Error('No stats data returned');
    }

    console.log('Raw stats from database:', stats);

    // Convert all values to numbers and provide defaults
    const processedStats = {
      activeJobs: Number(stats.active_jobs) || 0,
      completedJobs: Number(stats.completed_jobs) || 0,
      totalJobs: Number(stats.total_jobs) || 0,
      totalApplications: Number(stats.total_applications) || 0,
      totalHired: Number(stats.total_hired) || 0,
      totalWorkers: Number(stats.total_workers) || 0,
      totalEarnings: Number(stats.total_earnings) || 0,
      averageRating: Number(stats.average_rating) || 0,
      totalReviews: Number(stats.total_reviews) || 0,
      jobCompletionRate: Number(stats.job_completion_rate) || 0,
      applicationSuccessRate: Number(stats.application_success_rate) || 0,
    };

    console.log('Processed stats:', processedStats);
    return processedStats;
  } catch (error) {
    console.error('Error in getFarmerStats:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error in getFarmerStats');
  }
}