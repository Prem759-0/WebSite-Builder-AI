import { create } from 'zustand';
import { ChatMessage, Project, ProjectFile } from '@/types/project';

type BuilderState = {
  projects: Project[];
  activeProject?: Project;
  activePath?: string;
  chat: ChatMessage[];
  streamingText: string;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | undefined) => void;
  setActivePath: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  addChat: (message: ChatMessage) => void;
  setStreamingText: (text: string) => void;
};

export const useBuilderStore = create<BuilderState>((set) => ({
  projects: [],
  chat: [],
  streamingText: '',
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) =>
    set({
      activeProject,
      activePath: activeProject?.files[0]?.path
    }),
  setActivePath: (activePath) => set({ activePath }),
  updateFile: (path, content) =>
    set((state) => {
      if (!state.activeProject) return state;
      const files = state.activeProject.files.map((file) => (file.path === path ? { ...file, content } : file));
      return {
        activeProject: { ...state.activeProject, files },
        projects: state.projects.map((project) => (project._id === state.activeProject?._id ? { ...project, files } : project))
      };
    }),
  addChat: (message) => set((state) => ({ chat: [...state.chat, message] })),
  setStreamingText: (streamingText) => set({ streamingText })
}));

export const findActiveFile = (activeProject: Project | undefined, activePath: string | undefined): ProjectFile | undefined =>
  activeProject?.files.find((file) => file.path === activePath);
