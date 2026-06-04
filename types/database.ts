// TypeScript types that mirror the Supabase Postgres schema.
// Keep in sync with supabase/migrations/001_initial.sql.

export type Mode = "fun" | "perspective";
export type Role = "user" | "assistant";

export interface Character {
  id: string;
  user_id: string;
  name: string;
  personality: string;
  background: string;
  speech_style: string;
  knowledge_scope: string;
  mode: Mode;
  learning_goals: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: Role;
  content: string;
  created_at: string;
}

export interface ConversationMemory {
  conversation_id: string;
  summary: string;
  facts: string[];
  updated_at: string;
}

// Supabase-flavoured generic Database type used by the typed client.
export type Database = {
  public: {
    Tables: {
      characters: {
        Row: Character;
        Insert: Omit<Character, "id" | "created_at">;
        Update: Partial<Omit<Character, "id" | "created_at">>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, "id" | "created_at">;
        Update: Partial<Omit<Conversation, "id" | "created_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
      };
      conversation_memory: {
        Row: ConversationMemory;
        Insert: ConversationMemory;
        Update: Partial<ConversationMemory>;
      };
    };
  };
};
