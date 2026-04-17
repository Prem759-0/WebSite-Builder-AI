export type ProjectFile = {
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'css' | 'html' | 'json';
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type Project = {
  _id?: string;
  title: string;
  files: ProjectFile[];
  createdAt?: string;
};
