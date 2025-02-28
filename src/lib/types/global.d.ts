// src/types/global.d.ts
interface Window {
    __ENV?: {
      API_BASE_URL?: string;
      API_KEY?: string;
    };
  }

  export interface JobStatusResponse {
    job_id: string;
    job_type: string;
    status: string;
    created_at: string;
    updated_at: string;
    parameters: any;
    results: any;
    error?: string;
  }

export {};
