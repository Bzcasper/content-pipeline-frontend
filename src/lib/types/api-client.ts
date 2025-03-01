interface GenerateImageParams {
  prompt: string;
  num_images?: number;
  size?: string;
}

import { JobStatusResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  const response = await fetch(API_BASE_URL + endpoint, config);

  if (!response.ok) {
    const message = `An error occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json() as T;
}

export const apiClient = {
  async listJobs(): Promise<{ jobs: JobStatusResponse[] }> {
    return request<{ jobs: JobStatusResponse[] }>('/jobs');
  },
  async scrapeWebsites(targets: string[]): Promise<{ job_id: string }> {
    return request<{ job_id: string }>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_type: 'web_scraping',
        parameters: { targets },
      }),
    });
  },
  async downloadYouTube(params: { video_url: string; transcribe: boolean; extract_audio_only: boolean }): Promise<{ job_id: string }> {
    return request<{ job_id: string }>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_type: 'youtube_download',
        parameters: params,
      }),
    });
  },
  async generateImageFromText(params: GenerateImageParams): Promise<{ job_id: string }> {
    return request<{ job_id: string }>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_type: 'text_to_image',
        parameters: params,
      }),
    });
  },
};
