import {mockConversation} from '../data/mockConversation';
import {ConversationMessage} from '../types/conversation';

const delay = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const conversationApi = {
  async getConversation(): Promise<
    ConversationMessage[]
  > {
    await delay(800);

    return mockConversation;
  },

  async sendMessage(
    text: string,
  ): Promise<ConversationMessage> {
    await delay(1200);

    return {
      id: `ai-${Date.now()}`,

      type: 'ai',

      text: `That's an interesting question about "${text}". Let me analyze your chart and provide some guidance.`,

      createdAt: new Date().toISOString(),

      recommendations: [
        {
          id: `tarot-${Date.now()}`,
          type: 'tarot',
          title: 'Explore Your Tarot',
          subtitle: 'Get deeper insights',
        },

        {
          id: `consult-${Date.now()}`,
          type: 'consultation',
          title: 'Talk to an Astrologer',
          subtitle: 'Connect with an expert',
        },
      ],
    };
  },
};