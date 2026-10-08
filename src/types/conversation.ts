export type MessageType =
  | 'user'
  | 'ai'
  | 'human'
  | 'system';

export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'failed';

export type FeedbackType =
  | 'like'
  | 'dislike';

export type FeedbackReason =
  | 'Inaccurate'
  | 'Too Generic'
  | "Didn't Help"
  | 'Too Long';

export type RecommendationType =
  | 'gemstone'
  | 'tarot'
  | 'consultation'
  | 'article'
  | 'promotion'
  | 'panchang'
  | 'remedy';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
}

export interface ConversationMessage {
  id: string;
  type: MessageType;
  text: string;
  recommendations?: Recommendation[];
  status?: MessageStatus;
  feedback?: FeedbackType;
  feedbackReason?: FeedbackReason;
  replyTo?: {
    id: string;
    text: string;
  };
  createdAt: string;
}