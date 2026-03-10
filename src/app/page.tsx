"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Send, Sparkles, Code2, Eye, Download, Upload, Github, 
  Play, X, FileCode, Folder, ChevronRight, Bot, Loader2,
  Copy, Check, Plus, Trash2, Home, Settings, Menu, PanelLeftClose, PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Default project files
const DEFAULT_FILES: FileNode[] = [
  { id: "1", name: "page.tsx", path: "src/app/page.tsx", type: "file", language: "typescript", content: `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to December AI
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Describe what you want to build and I'll generate the code for you.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition">
            <h2 className="text-lg font-semibold mb-2">🚀 Quick Start</h2>
            <p className="text-gray-400 text-sm">Tell me what you want to build</p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition">
            <h2 className="text-lg font-semibold mb-2">📦 Import</h2>
            <p className="text-gray-400 text-sm">Import from GitHub</p>
          </div>
        </div>
      </div>
    </main>
  );
}` },
  { id: "2", name: "layout.tsx", path: "src/app/layout.tsx", type: "file", language: "typescript", content: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}` },
  { id: "3", name: "globals.css", path: "src/app/globals.css", type: "file", language: "css", content: `@tailwind base;
@tailwind components;
@tailwind utilities;` },
  { id: "4", name: "package.json", path: "package.json", type: "file", language: "json", content: `{
  "name": "my-december-app",
  "version": "1.0.0",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}` },
];

// Code block extraction
function extractCodeFromResponse(text: string): { filename: string; code: string }[] {
  const regex = /```(\w+)?(?::([^\n]+))?\n([\s\S]*?)```/g;
  const blocks: { filename: string; code: string }[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      filename: match[2] || `file.${match[1] || "txt"}`,
      code: match[3].trim(),
    });
  }
  return blocks;
}

// Main Component
export default function DecemberIDE() {
  const [view, setView] = useState<"welcome" | "ide">("welcome");
  const [files, setFiles] = useState<FileNode[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewProject = () => {
    setFiles(DEFAULT_FILES);
    setOpenFiles([]);
    setActiveFile(null);
    setMessages([]);
    setView("ide");
  };

  const openFile = (file: FileNode) => {
    if (!openFiles.find((f) => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (id: string) => {
    const newOpenFiles = openFiles.filter((f) => f.id !== id);
    setOpenFiles(newOpenFiles);
    if (activeFile?.id === id) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null);
    }
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, content } : f)));
    setOpenFiles(openFiles.map((f) => (f.id === id ? { ...f, content } : f)));
    if (activeFile?.id === id) {
      setActiveFile({ ...activeFile, content });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          model: "llama-3.3-70b-versatile",
          provider: "groq",
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Apply code blocks to files
      const codeBlocks = extractCodeFromResponse(data.content);
      if (codeBlocks.length > 0) {
        codeBlocks.forEach((block) => {
          const existingFile = files.find((f) => f.name === block.filename);
          if (existingFile) {
            updateFileContent(existingFile.id, block.code);
          } else {
            const newFile: FileNode = {
              id: Date.now().toString() + Math.random(),
              name: block.filename,
              path: block.filename,
              type: "file",
              content: block.code,
              language: block.filename.split(".").pop() || "text",
            };
            setFiles((prev) => [...prev, newFile]);
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activeFile?.content) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Welcome Screen
  if (view === "welcome") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <header className="h-14 border-b border-[#222] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">December AI</span>
            <Badge variant="outline" className="text-xs">v2.0</Badge>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/yayass3r/december-ai-v2" target="_blank" className="text-gray-400 hover:text-white">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                December AI v2
              </h1>
              <p className="text-xl text-gray-400">
                Full-Stack AI-Powered Development Platform
              </p>
              <p className="text-gray-500 max-w-xl mx-auto">
                Describe what you want to build, and I'll generate the complete code. 
                Import from GitHub, edit with AI assistance, and deploy instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleNewProject}
                className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl hover:border-blue-500 transition-all group"
              >
                <Plus className="w-10 h-10 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">New Project</h3>
                <p className="text-sm text-gray-500">Start from scratch</p>
              </button>

              <button
                onClick={handleNewProject}
                className="p-6 bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl hover:border-green-500 transition-all group"
              >
                <Github className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Import</h3>
                <p className="text-sm text-gray-500">From GitHub</p>
              </button>

              <button
                className="p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl hover:border-orange-500 transition-all group"
              >
                <Download className="w-10 h-10 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Export</h3>
                <p className="text-sm text-gray-500">Download project</p>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-sm">
              {[
                { icon: Code2, label: "Monaco Editor" },
                { icon: Eye, label: "Live Preview" },
                { icon: Bot, label: "AI Assistant" },
                { icon: Github, label: "GitHub Sync" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <span className="text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // IDE View
  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 bg-[#111] border-b border-[#222] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setView("welcome")} className="h-8 w-8">
            <Home className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-sm">December AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
            <Play className="w-3 h-3" /> Run
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="w-3 h-3" /> Export
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
            <Upload className="w-3 h-3" /> Deploy
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer */}
        {sidebarOpen && (
          <aside className="w-60 bg-[#111] border-r border-[#222] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#222] flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase">Files</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="py-1">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => openFile(file)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#1a1a1a] transition",
                      activeFile?.id === file.id && "bg-[#1e3a5f]"
                    )}
                  >
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {/* Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="h-9 bg-[#111] border-b border-[#222] flex items-center overflow-x-auto shrink-0">
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-xs border-r border-[#222] cursor-pointer",
                  activeFile?.id === file.id ? "bg-[#0a0a0a] text-white" : "text-gray-400 hover:bg-[#1a1a1a]"
                )}
                onClick={() => setActiveFile(file)}
              >
                <FileCode className="w-3 h-3 text-blue-400" />
                <span>{file.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); closeFile(file.id); }}
                  className="ml-1 hover:bg-[#333] rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Editor / Preview */}
          <div className="flex-1 overflow-auto">
            {activeFile ? (
              <div className="h-full relative">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <pre className="p-4 text-sm font-mono leading-relaxed h-full overflow-auto">
                  <code>{activeFile.content}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileCode className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a file to edit</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* AI Chat Panel */}
        {chatOpen && (
          <aside className="w-96 bg-[#111] border-l border-[#222] flex flex-col shrink-0">
            <div className="h-12 border-b border-[#222] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-sm">AI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} className="h-7 w-7">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-purple-500/40" />
                  <p className="font-medium mb-3">How can I help?</p>
                  <div className="space-y-2 text-xs">
                    {["Create a landing page", "Add a contact form", "Build a blog"].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                        className="block w-full p-2 bg-[#0a0a0a] border border-[#222] rounded hover:border-blue-500 transition text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#222]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("p-4", msg.role === "user" ? "bg-blue-950/30" : "")}>
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === "user" ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">U</div>
                        ) : (
                          <Bot className="w-5 h-5 text-purple-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {msg.role === "user" ? "You" : "December AI"}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex items-center gap-2 p-4 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </ScrollArea>

            <div className="p-3 border-t border-[#222]">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Describe what you want to build..."
                  className="flex-1 bg-[#0a0a0a] border-[#333] text-sm"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isGenerating}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="h-7 bg-[#111] border-t border-[#222] flex items-center justify-between px-3 text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Ready
          </span>
          <span>{activeFile?.language || "TypeScript"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{files.length} files</span>
        </div>
      </footer>

      {/* Floating Chat Toggle */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
