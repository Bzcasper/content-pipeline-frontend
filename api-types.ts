/**
 * Type definitions for the Content Pipeline API
 */

// API Key types
export interface ApiKey {
  api_key: string;
  name: string;
  email: string;
  created_at: string;
  expires_at?: string;
  permissions: string[];
  rate_limit: number;
}

export type ApiKeyResponse = {
  status: string;
  api_key: string;
};

// Job types
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  job_type: string;
  parameters: Record<string, any>;
  results?: Record<string, any>;
  error?: string;
}

export type ListJobsResponse = {
  jobs: JobStatusResponse[];
};

export type CreateJobRequest = {
  job_type: string;
  parameters: Record<string, any>;
};

export type CreateJobResponse = {
  status: string;
  job_id: string;
  error?: string;
};

// Web scraping types
export interface ScrapingTarget {
  url: string;
  selectors: {
    title?: string;
    content?: string;
    date?: string;
    [key: string]: string | undefined;
  };
  pagination?: {
    selector: string;
    [key: string]: any;
  };
  max_pages?: number;
  custom_headers?: Record<string, string>;
}

export type ScrapingRequest = {
  targets: ScrapingTarget[];
  callback_url?: string;
};

// Content processing types
export type ProcessingRequest = {
  source_file: string;
  analysis_types?: ('embedding' | 'summarization' | 'sentiment')[];
};

// YouTube types
export type YouTubeRequest = {
  video_url: string;
  transcribe?: boolean;
  extract_audio_only?: boolean;
};

// Transcription types
export type TranscriptionRequest = {
  media_path: string;
  language?: string;
  timestamp_segments?: boolean;
};

// Image generation types
export type TextToImageRequest = {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  batch_size?: number;
  output_format?: string;
  seed?: number;
};

export type ImageToImageRequest = {
  prompt: string;
  image_data: string; // Base64 encoded image
  negative_prompt?: string;
  strength?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  output_format?: string;
  seed?: number;
};

// Analysis result types
export interface EmbeddingResult {
  source_file: string;
  analyses: {
    embeddings: number[][];
    summaries?: string[];
    sentiments?: Array<{
      label: string;
      score: number;
    }>;
  };
  output_file: string;
}

export interface TranscriptionResult {
  audio_path: string;
  timestamp: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
  text: string;
  transcript_path: string;
  error?: string;
}

export interface ImageGenerationResult {
  prompt: string;
  timestamp: string;
  parameters: Record<string, any>;
  image_paths: string[];
  image_data: string[]; // Base64 encoded images
  error?: string;
}

// Utility type to extract job result based on job type
export type JobResult<T extends string> = 
  T extends 'web_scraping' ? ScrapingTarget[] :
  T extends 'content_processing' ? EmbeddingResult :
  T extends 'youtube_download' ? { transcription?: TranscriptionResult } :
  T extends 'text_to_image' ? ImageGenerationResult :
  T extends 'image_to_image' ? ImageGenerationResult :
  Record<string, any>;
