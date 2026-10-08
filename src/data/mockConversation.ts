import {ConversationMessage} from '../types/conversation';

export const mockConversation: ConversationMessage[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    createdAt: '2026-10-08T10:00:00Z',
  },

  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    status: 'sent',
    createdAt: '2026-10-08T10:01:00Z',
  },

  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    createdAt: '2026-10-08T10:01:05Z',

    recommendations: [
      {
        id: 'rec-1',
        type: 'gemstone',
        title: 'Blue Sapphire',
        subtitle: 'Recommended for Saturn',
      },

      {
        id: 'rec-2',
        type: 'tarot',
        title: 'Career Tarot Reading',
      },

      {
        id: 'rec-3',
        type: 'consultation',
        title: 'Talk to an Astrologer',
      },

      {
        id: 'rec-4',
        type: 'article',
        title: 'Understanding Saturn Mahadasha',
      },
    ],
  },

  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    createdAt: '2026-10-08T10:02:00Z',
  },

  {
    id: '5',
    type: 'user',
    text: 'What should I focus on professionally?',
    status: 'sent',
    createdAt: '2026-10-09T10:10:00Z',
  },

  {
    id: '6',
    type: 'ai',
    text: 'Focus on consistency, leadership and long-term planning. Saturn rewards disciplined effort over quick results.',
    createdAt: '2026-10-09T10:10:05Z',

    recommendations: [
      {
        id: 'rec-5',
        type: 'remedy',
        title: 'Saturday Saturn Remedy',
        subtitle: 'A simple weekly practice',
      },

      {
        id: 'rec-6',
        type: 'panchang',
        title: 'Check Today\'s Panchang',
      },
    ],
  },
];