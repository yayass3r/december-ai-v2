// API Configuration - Using environment variables
export const API_CONFIG = {
  // AI Providers
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  ZAI_API_KEY: process.env.ZAI_API_KEY || '',
  
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // GitHub
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  
  // Deployment
  VERCEL_TOKEN: process.env.VERCEL_TOKEN || '',
  RENDER_TOKEN: process.env.RENDER_TOKEN || '',
  
  // App
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// AI Models Configuration
export const AI_MODELS = {
  groq: {
    name: 'Groq',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Best for complex tasks' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fast responses' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Large context' },
    ],
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  },
  openrouter: {
    name: 'OpenRouter',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Best overall' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'OpenAI flagship' },
      { id: 'google/gemini-pro', name: 'Gemini Pro', description: 'Google AI' },
    ],
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  },
};

// File templates for new projects
export const PROJECT_TEMPLATES = {
  nextjs: {
    name: 'Next.js App',
    description: 'Full-stack React framework',
    files: {
      'package.json': JSON.stringify({
        name: 'my-app',
        version: '1.0.0',
        scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
        dependencies: { next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' },
      }, null, 2),
      'src/app/page.tsx': `export default function Home() {\n  return <h1>Hello World</h1>\n}`,
    },
  },
};
