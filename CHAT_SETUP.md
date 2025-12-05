# Chat Agent Setup Guide

## Overview
A chat agent has been added to your portfolio that can answer questions about you. It uses OpenAI's GPT-3.5-turbo model and is deployed as a Vercel serverless function.

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

### 2. Add API Key to Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Environment:** Production, Preview, Development (select all)
4. Save and redeploy your application

### 3. Test Locally (Optional)
If you want to test locally, create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your-api-key-here
```

**Note:** Never commit `.env.local` to git!

## Features
- ✅ Floating chat button (bottom-right corner)
- ✅ AI-powered responses about Shreyas
- ✅ Conversation history maintained
- ✅ Typing indicator
- ✅ Responsive design
- ✅ Theme-aware styling
- ✅ Clear chat functionality

## Files Created
- `api/chat.ts` - Vercel serverless function for handling chat requests
- `src/components/ChatWidget.tsx` - React chat widget component
- `src/components/ChatWidget.css` - Chat widget styling
- `vercel.json` - Vercel configuration for API routes

## Cost Estimate
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average conversation: ~500-1000 tokens
- Estimated cost: $0.001-0.002 per conversation
- 1000 conversations/month ≈ $1-2

## Customization
You can customize the system prompt in `api/chat.ts` to add more information or change the AI's behavior.

## Troubleshooting
- **Chat not working?** Check that OPENAI_API_KEY is set in Vercel
- **API errors?** Check Vercel function logs in the dashboard
- **Not responding?** Check your OpenAI account has credits

