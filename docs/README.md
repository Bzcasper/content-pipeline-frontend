# N8N Content Pipeline Workflow Setup Guide

This guide will help you set up the complete n8n workflow for your automated content generation system.

## Prerequisites

1. An n8n instance running (either locally or on a server)
2. Modal.com account with deployed endpoints
3. Supabase account (for data storage)

## Step 1: Import the Workflow

1. Open your n8n dashboard
2. Go to Workflows → Import from File
3. Upload the `content-pipeline-workflow.json` file
4. Click "Import" to add the workflow to your n8n instance

## Step 2: Configure API Endpoints

You need to replace placeholder URLs with your actual Modal endpoint URLs:

1. Open the imported workflow
2. For each HTTP Request node, update the URL with your actual Modal endpoint:
   - Web Scraper API
   - YouTube Downloader API
   - Image Generator API
   - Content Processor API
   - Send Notification
   - Queue Social Media Post
   
# N8N Content Pipeline Workflow Setup Guide

This guide will help you set up the complete n8n workflow for your automated content generation system.

## Prerequisites

1. An n8n instance running (either locally or on a server)
2. Modal.com account with deployed endpoints
3. Supabase account (for data storage)

## Step 1: Import the Workflow

1. Open your n8n dashboard
2. Go to Workflows → Import from File
3. Upload the `content-pipeline-workflow.json` file
4. Click "Import" to add the workflow to your n8n instance

## Step 2: Configure API Endpoints

You need to replace placeholder URLs with your actual Modal endpoint URLs:

1. Open the imported workflow
2. For each HTTP Request node, update the URL with your actual Modal endpoint:
   - Web Scraper API
   - YouTube Downloader API
   - Image Generator API
   - Content Processor API
   - Send Notification
   - Queue Social Media Post
   # Setting Up Your Automated Content Pipeline in Detail

I'll break down the exact setup process for your content pipeline, covering both Modal Labs endpoints and n8n workflow integration.

## 1. Setting Up Modal Labs Components

### Step 1: Install Modal CLI
```bash
pip install modal
```

### Step 2: Authenticate with Modal
```bash
modal token new
```
This will open a browser window to authenticate. Copy the token when prompted.

### Step 3: Create the Modal Project Structure
Create these directories and files:
```
modal-content-pipeline/
├── web_scraper.py
├── content_processor.py
├── media_processor.py
├── image_generator.py
├── api_service.py
├── notification_service.py
├── social_media_scheduler.py
├── blog_creator.py
├── content_discovery.py
├── utils/
    ├── __init__.py
    ├── storage.py
    └── common.py
└── requirements.txt
```

### Step 4: Set Up the requirements.txt File
```
modal>=0.51.3
fastapi>=0.103.1
pydantic>=2.4.2
python-multipart>=0.0.6
beautifulsoup4>=4.12.2
requests>=2.31.0
pytube>=15.0.0
openai>=1.3.0
diffusers>=0.23.1
transformers>=4.34.0
pillow>=10.0.1
aiohttp>=3.8.5
tenacity>=8.2.3
```

### Step 5: Deploy Each Modal Component

For each component (.py file), run:
```bash
modal deploy componentname.py
```

For example:
```bash
modal deploy web_scraper.py
```

After deployment, Modal will provide URLs for each endpoint. Copy and save these URLs - you'll need them for the n8n workflow.

## 2. Setting Up n8n Workflow

### Step 1: Install n8n (if not already installed)
```bash
# Using npm
npm install n8n -g

# Or using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Step 2: Start n8n
```bash
n8n start
```
Access the n8n interface at http://localhost:5678

### Step 3: Import the Workflow File

1. In the n8n interface, click on "Workflows" in the left sidebar
2. Click the "Import from File" button
3. Upload the `content-pipeline-workflow.json` file you created earlier

### Step 4: Configure API Endpoints and Authentication

For each HTTP Request node in the workflow:

1. Double-click on the node to open its settings
2. Replace the placeholder URL with your actual Modal endpoint URL (from Step 5 above)
3. Set up authentication:
   - Click on "Authentication" dropdown
   - Select "Header Auth"
   - Enter your Modal API key

For example, for the "Web Scraper API" node:
1. Set URL to `https://your-username--web-scraper.modal.run/scrape`
2. Add header: `Authorization: Bearer your-modal-api-key`

### Step 5: Configure Supabase Connection

For the "Store Results" node:
1. Double-click to open settings
2. Enter your Supabase project URL and API key
3. Verify the table name matches your Supabase database table

### Step 6: Test Individual Nodes

1. For each node, use the "Execute Node" option to test it works correctly
2. Troubleshoot any issues with connections or parameters

### Step 7: Activate the Webhooks

1. Click on the "Webhook Trigger" node
2. Note the webhook URL provided
3. This URL will be your entry point for triggering the workflow externally

## 3. Creating a Database in Supabase

### Step 1: Create a Supabase Account and Project
Go to [Supabase](https://supabase.com/) and create a new project.

### Step 2: Create Tables for Your Content Pipeline

Open SQL Editor and create the following tables:

```sql
-- Table for storing job results
CREATE TABLE job_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT UNIQUE NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for content items
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  metadata JSONB,
  source_job_id TEXT REFERENCES job_results(job_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for social media posts
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id),
  platform TEXT NOT NULL,
  post_content TEXT NOT NULL,
  media_urls TEXT[],
  schedule_time TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 3: Get Your Supabase API Keys
1. Go to Project Settings > API
2. Copy the URL and API Key
3. Use these in your n8n "Store Results" node

## 4. Testing the Complete Pipeline

### Method 1: Manual Testing via Webhook

1. Use a tool like Postman or cURL to send a POST request to your webhook URL
2. Include the appropriate JSON payload for the content type you want to process

Example cURL command for web scraping:
```bash
curl -X POST \
  https://your-n8n-webhook-url \
  -H 'Content-Type: application/json' \
  -d '{
    "task_type": "web_scraping",
    "targets": [
      {
        "url": "https://example.com",
        "selectors": {
          "title": "h1",
          "content": "article",
          "author": ".author"
        }
      }
    ]
  }'
```

### Method 2: Testing via n8n Interface

1. In n8n, open your workflow
2. Click "Execute Workflow" button
3. Select the "Webhook Trigger" node
4. Create test data in JSON format
5. Click "Execute Node" to test

## 5. Integrating with Your Next.js Frontend

1. Make your n8n webhook URL available to your Next.js app by adding it to your environment variables:

```
# .env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

2. Create an API endpoint in your Next.js app to trigger the n8n workflow:

```javascript
// src/app/api/trigger-workflow/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
```

3. Call this endpoint from your frontend components when users submit forms.

## 6. Monitoring and Maintenance

### Setting Up Error Notifications

1. In n8n, add an "Error Trigger" node connected to the workflow
2. Connect it to an email or Slack notification node to alert you of failures

### Regular Backups

1. Use n8n's export functionality to regularly back up your workflow
2. Schedule database backups in Supabase

### Performance Monitoring

1. Set up a monitoring dashboard in n8n to track workflow execution times
2. Create a simple dashboard in your Next.js app that shows pipeline statistics from Supabase

## 7. Scaling Considerations

### Increasing Concurrency in Modal

For heavy workloads, adjust your Modal app configurations:

```python
# In your Modal apps
@stub.function(
    timeout=3600,
    concurrency_limit=10,  # Increase this for more parallel executions
    keep_warm=1  # Keep instances warm for faster startup
)
```

### Setting Up Retries in n8n

For each HTTP Request node:
1. Click on "Options"
2. Enable "Retry on Fail"
3. Set Max Retries to 3-5
4. Set Retry Wait Time to a reasonable interval (e.g., 10000ms)

This detailed setup guide should get your automated content pipeline running smoothly. You can start with a small-scale test, then gradually scale up as you become more comfortable with the system.