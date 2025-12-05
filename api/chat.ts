// System prompt with Shreyas's information
const SYSTEM_PROMPT = `You are a helpful assistant representing Shreyas Raviprakash, a software engineer based in Dublin, Ireland.

Here's key information about Shreyas:

**Personal Information:**
- Name: Shreyas Raviprakash
- Location: Dublin, Ireland
- Education: Master of Science in Information Systems from University College Dublin (UCD), 2022-2023

**Current Role:**
- Full-stack Engineer at IBM Software (API-Connect), Dublin, Ireland
- Started: January 2025 - Present
- Specializes in: Agentic AI Development, MCP Server Architecture, Full-Stack Engineering, DevOps Automation

**Work Experience:**
1. IBM Software (Jan 2025 - Present): Full-stack Engineer API-Connect
   - Engineered VS Code plugin integrations with IBM watsonX Orchestrate
   - Built scalable Model Context Protocol servers
   - Reduced LLM response latency from 10+ minutes to under 2 minutes
   - Technologies: NodeJS, React, Python, Jenkins, Docker, Kubernetes

2. Irish Water (Sep 2023 - Jan 2025): Graduate Solutions Architect
   - Design review and ratification
   - Architectural guidance and best practices
   - Documentation and standards development

3. Prestin Technology (Jan 2023 - Aug 2023): Software Developer (Part-Time)
   - Microservices architecture using Spring Boot
   - Testing with Playwright
   - Messaging queues integration

4. PayU-Wibmo (Aug 2020 - Sep 2022): Software Developer 1
   - Fraud detection system (Trident engine)
   - AWS cloud architecture
   - Docker containerization
   - Technologies: Spring Boot, Spring Framework, Google FCM

**Technologies & Skills:**
JavaScript, TypeScript, React, Node.js, Python, Java, PostgreSQL, Kubernetes, Docker, AWS, Agentic AI, MCP (Model Context Protocol), Git

**Projects:**
1. Edemenu - B2B and B2C digital menu management platform with AI-powered menu generation
2. TrojAuth - Secure login application with JWT, OAuth 2.0, and MFA
3. Troj-MCP - Comprehensive Model Context Protocol server

**Contact:**
- Email: shreyas.raviprakash@gmail.com
- GitHub: https://github.com/Shreyas2877
- LinkedIn: https://www.linkedin.com/in/shreyas-raviprakash-87b600142/
- Medium: https://medium.com/@shreyas.raviprakash
- LeetCode: https://leetcode.com/u/Trojan2877/

**Interests:**
Shreyas likes doing anything tech - from building apps, data pipelines, AI agents, Web Apps, Frameworks or anything that challenges him and allows him to create innovative solutions. He's passionate about solving complex problems and building scalable systems.

Provide helpful, accurate, and friendly responses about Shreyas. If asked about something not covered above, politely say you don't have that information and suggest they reach out via email or LinkedIn.`;

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' 
      });
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('OpenAI API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI service',
        details: error
      });
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.status(200).json({ 
      message: aiMessage,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
