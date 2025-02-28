/**
 * API client for interacting with the Modal Content Pipeline API
 * This module provides type-safe methods for all API endpoints.
 */

import {
  ApiKeyResponse,
  CreateJobRequest,
  CreateJobResponse,
  JobStatusResponse,
  ListJobsResponse,
  ScrapingTarget,
  ProcessingRequest,
  YouTubeRequest,
  TextToImageRequest,
  ImageToImageRequest
} from './types';

/**
 * Configuration object for the API client
 */
type ApiClientConfig = {
  baseUrl: string;
  apiKey: string;
};

/**
 * Request options with type parameter for return value
 */
type RequestOptions<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: any;
  config?: Partial<ApiClientConfig>;
  headers?: Record<string, string>;
};

/**
 * API client for the Content Pipeline API
 */
export class ApiClient {
  private config: ApiClientConfig;

  /**
   * Create a new API client
   */
  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  /**
   * Make an API request
   */
  private async request<T>({
    method,
    endpoint,
    body,
    config = {},
    headers = {},
  }: RequestOptions<T>): Promise<T> {
    const url = `${config.baseUrl || this.config.baseUrl}${endpoint}`;
    const apiKey = config.apiKey || this.config.apiKey;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        // Try to parse error message
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: response.statusText };
        }

        throw new Error(
          `API Error (${response.status}): ${
            errorData.detail || 'Unknown error'
          }`
        );
      }

      return await response.json() as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request({
      method: 'GET',
      endpoint: '/health',
    });
  }

  /**
   * Create a new job
   */
  async createJob(request: CreateJobRequest): Promise<CreateJobResponse> {
    return this.request({
      method: 'POST',
      endpoint: '/jobs',
      body: request,
    });
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return this.request({
      method: 'GET',
      endpoint: `/jobs/${jobId}`,
    });
  }

  /**
   * List all jobs
   */
  async listJobs(): Promise<ListJobsResponse> {
    return this.request({
      method: 'GET',
      endpoint: '/jobs',
    });
  }

  /**
   * Create a web scraping job
   */
  async scrapeWebsites(targets: ScrapingTarget[]): Promise<CreateJobResponse> {
    return this.createJob({
      job_type: 'web_scraping',
      parameters: {
        targets,
      },
    });
  }

  /**
   * Create a content processing job
   */
  async processContent(
    request: ProcessingRequest
  ): Promise<CreateJobResponse> {
    return this.createJob({
      job_type: 'content_processing',
      parameters: request,
    });
  }

  /**
   * Create a YouTube download job
   */
  async downloadYouTube(
    request: YouTubeRequest
  ): Promise<CreateJobResponse> {
    return this.createJob({
      job_type: 'youtube_download',
      parameters: request,
    });
  }

  /**
   * Create a text-to-image job
   */
  async generateImageFromText(
    request: TextToImageRequest
  ): Promise<CreateJobResponse> {
    return this.createJob({
      job_type: 'text_to_image',
      parameters: request,
    });
  }

  /**
   * Create an image-to-image job
   */
  async generateImageFromImage(
    request: ImageToImageRequest
  ): Promise<CreateJobResponse> {
    return this.createJob({
      job_type: 'image_to_image',
      parameters: request,
    });
  }

  /**
   * Wait for a job to complete
   */
  async waitForJob(
    jobId: string, 
    options: { 
      interval?: number; 
      maxAttempts?: number;
      onUpdate?: (status: JobStatusResponse) => void;
    } = {}
  ): Promise<JobStatusResponse> {
    const { 
      interval = 2000, 
      maxAttempts = 30,
      onUpdate
    } = options;
    
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const status = await this.getJobStatus(jobId);
      
      if (onUpdate) {
        onUpdate(status);
      }
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }
    
    throw new Error(`Job ${jobId} did not complete within the timeout period`);
  }
}

/**
 * Create a new API client using environment variables
 */
export function createApiClient(): ApiClient {
  // In a Next.js environment, we need to check if we're on the client side
  // before accessing window
  const baseUrl = 
    typeof window !== 'undefined' 
      ? window.__ENV?.API_BASE_URL 
      : process.env.NEXT_PUBLIC_API_BASE_URL;
      
  const apiKey = 
    typeof window !== 'undefined'
      ? window.__ENV?.API_KEY
      : process.env.NEXT_PUBLIC_API_KEY;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not defined');
  }

  if (!apiKey) {
    throw new Error('API_KEY is not defined');
  }

  return new ApiClient({
    baseUrl,
    apiKey,
  });
}

// Default API client instance
export const apiClient = createApiClient();
