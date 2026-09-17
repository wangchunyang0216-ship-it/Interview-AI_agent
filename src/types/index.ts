export type Role = 'user' | 'assistant';

export type MessageStatus = 'pending' | 'streaming' | 'done' | 'error';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  status: MessageStatus;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}
