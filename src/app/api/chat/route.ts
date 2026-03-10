import { NextRequest, NextResponse } from 'next/server';

const AI_PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    getKey: () => process.env.GROQ_API_KEY || '',
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    getKey: () => process.env.OPENROUTER_API_KEY || '',
  },
  zai: {
    url: 'https://api.z.ai/v1/chat/completions',
    getKey: () => process.env.ZAI_API_KEY || '',
  },
};

const SYSTEM_PROMPT = `You are December AI, an expert full-stack developer assistant.

## Response Format:
When generating code, wrap it in code blocks with filename:
\`\`\`typescript:src/app/page.tsx
// code here
\`\`\`

## Guidelines:
- Use TypeScript and Tailwind CSS
- Write clean, modern code
- Add helpful comments
- Include error handling

Be helpful and produce high-quality code.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'llama-3.3-70b-versatile', provider = 'groq' } = await request.json();
    const ai = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS] || AI_PROVIDERS.groq;
    const apiKey = ai.getKey();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(ai.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(provider === 'openrouter' && { 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' }),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API Error:', error);
      return NextResponse.json({ error: 'AI request failed' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ content: data.choices?.[0]?.message?.content || '' });
  } catch (e: any) {
    console.error('Chat API Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
