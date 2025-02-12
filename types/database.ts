export type UserType = 'farmer' | 'laborer';
export type JobStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export type WorkerStatus = 'available' | 'working' | 'unavailable';
export type NotificationType = 
  | 'application_received'
  | 'application_accepted'
  | 'application_rejected'
  | 'job_completed'
  | 'worker_hired'
  | 'payment_received'
  | 'review_received';

export interface Profile {
  id: string;
  name: string;
  phone: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  is_phone_verified: boolean;
  location: {
    district: string;
    state: string;
  } | null;
  rating: number;
  total_ratings: number;
  bio: string | null;
  skills: string[] | null;
  availability: {
    start_date: string;
    end_date: string;
    preferred_duration: number;
  } | null;
  wage_range: {
    min: number;
    max: number;
    preferred: number;
  } | null;
  completed_jobs: number;
  total_earnings: number;
  status: WorkerStatus;
  last_active: string;
  notification_preferences: {
    push: boolean;
    email: boolean;
  };
  theme_preference: 'light' | 'dark';
  language_preference: string;
}

export interface Job {
  id: string;
  farmer_id: string;
  title: string;
  description: string;
  location: {
    district: string;
    state: string;
  };
  wage_per_day: number;
  workers_needed: number;
  start_date: string;
  end_date: string;
  skills_required: string[];
  status: JobStatus;
  created_at: string;
  updated_at: string;
  applications_count: number;
  hired_count: number;
  category: string | null;
  equipment_provided: string[] | null;
  accommodation_provided: boolean;
  accommodation_details: string | null;
  transportation_provided: boolean;
  transportation_details: string | null;
  additional_notes: string | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  laborer_id: string;
  status: ApplicationStatus;
  cover_note: string | null;
  created_at: string;
  updated_at: string;
  expected_start_date: string | null;
  expected_end_date: string | null;
  negotiated_wage: number | null;
  farmer_notes: string | null;
  laborer_notes: string | null;
  rejection_reason: string | null;
  completion_date: string | null;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  job_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  work_quality: number | null;
  reliability: number | null;
  communication: number | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: any | null;
  is_read: boolean;
  created_at: string;
}

export interface WorkerHistory {
  id: string;
  worker_id: string;
  farmer_id: string;
  job_id: string;
  start_date: string;
  end_date: string | null;
  wage_per_day: number;
  total_days: number | null;
  total_earnings: number | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
} 