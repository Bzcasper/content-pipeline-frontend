export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobStatusResponse {
  job_id: string;
  job_type: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  error?: string;
}

export interface ListJobsResponse {
  jobs: JobStatusResponse[];
}

export interface CreateJobResponse {
  status: string;
  job_id: string;
  error?: string;
}
