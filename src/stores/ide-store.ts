import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  framework: string;
  files: FileNode[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const getLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    css: 'css', html: 'html', json: 'json', md: 'markdown', py: 'python',
  };
  return map[ext] || 'plaintext';
};

interface IDEStore {
  project: Project | null;
  files: FileNode[];
  activeFile: FileNode | null;
  openFiles: FileNode[];
  sidebarOpen: boolean;
  previewOpen: boolean;
  chatOpen: boolean;
  messages: ChatMessage[];
  isGenerating: boolean;
  selectedModel: string;
  
  createProject: (name: string, framework: string) => void;
  addFile: (path: string, content?: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (file: FileNode | null) => void;
  openFile: (file: FileNode) => void;
  closeFile: (id: string) => void;
  toggleSidebar: () => void;
  togglePreview: () => void;
  toggleChat: () => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setGenerating: (v: boolean) => void;
  setModel: (model: string) => void;
}

export const useIDEStore = create<IDEStore>()(
  persist(
    (set, get) => ({
      project: null,
      files: [],
      activeFile: null,
      openFiles: [],
      sidebarOpen: true,
      previewOpen: true,
      chatOpen: true,
      messages: [],
      isGenerating: false,
      selectedModel: 'llama-3.3-70b-versatile',
      
      createProject: (name, framework) => {
        const project: Project = { id: generateId(), name, framework, files: [] };
        set({ project, files: [], activeFile: null, openFiles: [] });
      },
      
      addFile: (path, content = '') => {
        const name = path.split('/').pop() || path;
        const file: FileNode = { id: generateId(), name, path, type: 'file', content, language: getLanguage(name) };
        set(s => ({ files: [...s.files, file] }));
      },
      
      updateFile: (id, content) => {
        set(s => ({
          files: s.files.map(f => f.id === id ? { ...f, content } : f),
          openFiles: s.openFiles.map(f => f.id === id ? { ...f, content } : f),
          activeFile: s.activeFile?.id === id ? { ...s.activeFile, content } : s.activeFile,
        }));
      },
      
      deleteFile: (id) => {
        set(s => ({
          files: s.files.filter(f => f.id !== id),
          openFiles: s.openFiles.filter(f => f.id !== id),
          activeFile: s.activeFile?.id === id ? null : s.activeFile,
        }));
      },
      
      setActiveFile: (file) => set({ activeFile: file }),
      
      openFile: (file) => {
        set(s => {
          const isOpen = s.openFiles.some(f => f.id === file.id);
          return { openFiles: isOpen ? s.openFiles : [...s.openFiles, file], activeFile: file };
        });
      },
      
      closeFile: (id) => {
        set(s => {
          const openFiles = s.openFiles.filter(f => f.id !== id);
          return { openFiles, activeFile: s.activeFile?.id === id ? openFiles[openFiles.length - 1] || null : s.activeFile };
        });
      },
      
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      togglePreview: () => set(s => ({ previewOpen: !s.previewOpen })),
      toggleChat: () => set(s => ({ chatOpen: !s.chatOpen })),
      
      addMessage: (msg) => {
        set(s => ({ messages: [...s.messages, { ...msg, id: generateId(), timestamp: new Date() }] }));
      },
      
      setGenerating: (v) => set({ isGenerating: v }),
      setModel: (model) => set({ selectedModel: model }),
    }),
    { name: 'december-ide' }
  )
);
