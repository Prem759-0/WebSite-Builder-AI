export type ProjectFile = {
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'css' | 'html' | 'json';
};

export type ChatRole = 'user' | 'assistant';
export type ChatMode = 'generate' | 'edit' | 'explain' | 'improve';

export type ChatMessage = {
  role: ChatRole;
  content: string;
  mode?: ChatMode;
};

export type Project = {
  _id?: string;
  title: string;
  files: ProjectFile[];
  createdAt?: string;
};
