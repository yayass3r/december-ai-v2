"use client";

import { useState } from "react";
import { 
  Play, 
  Send, 
  Settings, 
  FolderOpen, 
  FileCode, 
  Terminal as TerminalIcon,
  Sparkles,
  Github,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Plus,
  Save,
  RefreshCw
} from "lucide-react";

// Mock project data
const mockFiles = [
  { name: "src/app/page.tsx", type: "tsx" as const },
  { name: "src/app/layout.tsx", type: "tsx" as const },
  { name: "src/app/globals.css", type: "css" as const },
  { name: "package.json", type: "json" as const },
  { name: "next.config.ts", type: "ts" as const },
];

const mockCode = `// December AI v2 - AI-Powered Development Platform
import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('Hello, World!');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">{message}</h1>
      <p className="text-gray-400 mt-4">
        Build amazing apps with AI assistance
      </p>
    </div>
  );
}`;

const mockTerminalOutput = `$ npm run dev
> december-ai-v2@2.0.0 dev
> next dev --turbopack

   ▲ Next.js 15.2.3
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1.2s`;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState("page.tsx");

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-white">December AI</span>
            <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded">v2</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
              File
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
              Edit
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
              View
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
              Run
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://december-ai-v2.onrender.com" 
            target="_blank" 
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Live Demo</span>
          </a>
          <a 
            href="https://github.com/yayass3r/december-ai-v2" 
            target="_blank"
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[#111] border-r border-[#222] transition-all duration-300 overflow-hidden shrink-0`}>
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-[#222] flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Explorer</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-[#222] rounded">
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-2">
                <div className="flex items-center gap-1 px-2 py-1 text-gray-400 text-sm cursor-pointer hover:bg-[#222] rounded">
                  <ChevronDown className="w-4 h-4" />
                  <FolderOpen className="w-4 h-4 text-yellow-500" />
                  <span>src</span>
                </div>
                <div className="ml-4">
                  {mockFiles.filter(f => f.name.startsWith('src/')).map((file) => (
                    <button 
                      key={file.name}
                      onClick={() => setActiveTab(file.name.split('/').pop() || '')}
                      className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded transition ${
                        activeTab === file.name.split('/').pop() 
                          ? 'bg-[#1e3a5f] text-white' 
                          : 'text-gray-400 hover:bg-[#222]'
                      }`}
                    >
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <span>{file.name.split('/').pop()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                {mockFiles.filter(f => !f.name.startsWith('src/')).map((file) => (
                  <button 
                    key={file.name}
                    onClick={() => setActiveTab(file.name)}
                    className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded transition ${
                      activeTab === file.name 
                        ? 'bg-[#1e3a5f] text-white' 
                        : 'text-gray-400 hover:bg-[#222]'
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Editor + Terminal */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <div className="h-10 bg-[#111] border-b border-[#222] flex items-center shrink-0 overflow-x-auto">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#222] transition"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center">
              {['page.tsx', 'layout.tsx'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-[#222] transition ${
                    activeTab === tab 
                      ? 'bg-[#0a0a0a] text-white' 
                      : 'text-gray-400 hover:bg-[#111]'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-blue-400" />
                  {tab}
                  <X className="w-3 h-3 opacity-0 hover:opacity-100" />
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1 px-2">
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
                <Save className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded transition">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-[#0a0a0a] overflow-auto">
            <pre className="p-4 text-sm font-mono leading-relaxed">
              <code>{mockCode}</code>
            </pre>
          </div>

          {/* Terminal */}
          {terminalOpen && (
            <div className="h-48 bg-[#0d0d0d] border-t border-[#222] flex flex-col shrink-0">
              <div className="h-8 bg-[#111] border-b border-[#222] flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Terminal</span>
                </div>
                <button 
                  onClick={() => setTerminalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-3 font-mono text-sm text-gray-300 overflow-auto">
                <pre>{mockTerminalOutput}</pre>
              </div>
            </div>
          )}
        </main>

        {/* AI Chat Sidebar */}
        {chatOpen && (
          <aside className="w-80 bg-[#111] border-l border-[#222] flex flex-col shrink-0">
            <div className="h-10 border-b border-[#222] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-[#1a1a1a] p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  👋 Welcome to December AI v2! I can help you:
                </p>
                <ul className="mt-2 text-xs text-gray-400 space-y-1">
                  <li>• Write and refactor code</li>
                  <li>• Debug issues</li>
                  <li>• Explain concepts</li>
                  <li>• Generate components</li>
                </ul>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-600/30">
                <p className="text-sm text-blue-300">
                  Try asking: "Create a landing page with a hero section"
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-[#222]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI..."
                  className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Toolbar */}
      <footer className="h-6 bg-[#111] border-t border-[#222] flex items-center justify-between px-3 text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>main</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Connected
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>Ln 1, Col 1</span>
        </div>
      </footer>

      {/* Floating Chat Toggle */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
