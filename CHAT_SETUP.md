# Chat Agent Setup Guide

## Overview

A chat agent has been added to your portfolio that can answer questions about you. It uses Google gemini flash 2.0 model.

## Setup Instructions

### 1. Get Google Ai Studio

1. Go to https://aistudio.google.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key

### 2. Add API Key to Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - **Name:** `VITE_GEMINI_API_KEY1`
   - **Value:** Your Gemini API key
   - **Environment:** Production, Preview, Development (select all)
4. Save and redeploy your application

### 3. Test Locally (Optional)

If you want to test locally, create a `.env` file in the root directory:

```
VITE_GEMINI_API_KEY1=your-api-key-here
```

**Note:** Never commit `.env` to git!

## Features

- ✅ Floating chat button (bottom-right corner)
- ✅ AI-powered responses about Shreyas
- ✅ Conversation history maintained
- ✅ Typing indicator
- ✅ Responsive design
- ✅ Theme-aware styling
- ✅ Clear chat functionality

## Files Created

- `src/components/ChatWidget.tsx` - React chat widget component
- `src/components/ChatWidget.css` - Chat widget styling
- `vercel.json` - Vercel configuration for API routes

## Cost Estimate

- Gemini Flash 2.0 - Free tier

## Customization

You can customize the system prompt in `constants/systemPrompt.ts` to add more information or change the AI's behavior.

## Troubleshooting

- **Chat not working?** Check that VITE_GEMINI_API_KEY1 is set in Vercel
- **API errors?** Check Vercel function logs in the dashboard
- **Not responding?** Check your google ai studio account
