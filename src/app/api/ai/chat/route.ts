import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// System prompt for AI web development assistant
const SYSTEM_PROMPT = `You are December AI, an expert full-stack web developer assistant specialized in building web applications. You help users by:

1. Writing clean, modern code (React, Next.js, TypeScript, Tailwind CSS)
2. Following best practices and design patterns
3. Explaining code clearly when asked
4. Suggesting improvements and fixes
5. Creating complete, working components and pages

When writing code:
- Use modern React patterns (hooks, functional components)
- Include proper TypeScript types
- Use Tailwind CSS for styling
- Follow Next.js App Router conventions
- Make code production-ready and efficient

When asked to create or modify files, respond with code blocks that include the filename on the first line:
\`\`\`tsx src/app/page.tsx
// code here
\`\`\`

Always be helpful, concise, and provide working solutions. If the user asks to create a component, provide the complete code that can be directly used.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, projectContext, history } = body;

    console.log('Received chat request:', { message: message?.substring(0, 100), hasContext: !!projectContext });

    // Initialize Z.AI
    const zai = await ZAI.create();

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add project context if available
    if (projectContext) {
      const contextMessage = `Current project:
- Name: ${projectContext.name || 'Untitled'}
- Framework: ${projectContext.framework || 'Next.js'}
- Current file: ${projectContext.currentFile || 'none'}
${projectContext.fileContent ? `\nCurrent file content:\n\`\`\`\n${projectContext.fileContent.substring(0, 2000)}\n\`\`\`` : ''}`;
      
      messages.push({
        role: 'user',
        content: contextMessage,
      });
      messages.push({
        role: 'assistant',
        content: 'I understand the project context. I\'m ready to help you build or modify this project. What would you like me to do?',
      });
    }

    // Add conversation history if available
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) { // Keep last 10 messages
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    console.log('Calling AI with', messages.length, 'messages');

    // Call AI using Z.AI SDK
    const completion = await zai.chat.completions.create({
      messages,
      model: 'glm-4-plus',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI');
    }

    console.log('AI response received:', response.substring(0, 100));

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    
    // Return a helpful error message
    return NextResponse.json(
      { 
        response: `I encountered an error: ${error.message}. Please try again or rephrase your request.`,
        error: true 
      },
      { status: 200 } // Return 200 so the UI can display the error message
    );
  }
}
