import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from 'react';

import {
  ConversationMessage,
  FeedbackReason,
  FeedbackType,
} from '../types/conversation';

interface ConversationState {
  messages: ConversationMessage[];
  loading: boolean;
  error: boolean;
  replyTo: ConversationMessage | null;
}

const initialState: ConversationState = {
  messages: [],
  loading: true,
  error: false,
  replyTo: null,
};

type Action =
  | {
      type: 'LOAD_SUCCESS';
      payload: ConversationMessage[];
    }

  | {
      type: 'LOAD_ERROR';
    }

  | {
      type: 'ADD_MESSAGE';
      payload: ConversationMessage;
    }

  | {
      type: 'DELETE_MESSAGE';
      payload: string;
    }

  | {
      type: 'UPDATE_MESSAGE';
      payload: ConversationMessage;
    }

  | {
      type: 'UPDATE_MESSAGE_STATUS';
      payload: {
        messageId: string;
        status: 'sending' | 'sent' | 'failed';
      };
    }

  | {
      type: 'SET_FEEDBACK';
      payload: {
        messageId: string;
        feedback: FeedbackType;
      };
    }

  | {
      type: 'SET_FEEDBACK_REASON';
      payload: {
        messageId: string;
        reason: FeedbackReason;
      };
    }

  | {
      type: 'SET_REPLY';
      payload: ConversationMessage | null;
    };

function conversationReducer(
  state: ConversationState,
  action: Action,
): ConversationState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        messages: action.payload,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload,
        ],
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(
          message =>
            message.id !== action.payload,
        ),
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(
          message =>
            message.id === action.payload.id
              ? action.payload
              : message,
        ),
      };

    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map(
          message =>
            message.id ===
            action.payload.messageId
              ? {
                  ...message,
                  status:
                    action.payload.status,
                }
              : message,
        ),
      };

    case 'SET_FEEDBACK':
      return {
        ...state,
        messages: state.messages.map(
          message =>
            message.id ===
            action.payload.messageId
              ? {
                  ...message,
                  feedback:
                    action.payload.feedback,
                  feedbackReason: undefined,
                }
              : message,
        ),
      };

    case 'SET_FEEDBACK_REASON':
      return {
        ...state,
        messages: state.messages.map(
          message =>
            message.id ===
            action.payload.messageId
              ? {
                  ...message,
                  feedbackReason:
                    action.payload.reason,
                }
              : message,
        ),
      };

    case 'SET_REPLY':
      return {
        ...state,
        replyTo: action.payload,
      };

    default:
      return state;
  }
}

interface ConversationContextValue {
  state: ConversationState;
  dispatch: React.Dispatch<Action>;
}

const ConversationContext =
  createContext<
    ConversationContextValue | undefined
  >(undefined);

export function ConversationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    conversationReducer,
    initialState,
  );

  return (
    <ConversationContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context =
    useContext(ConversationContext);

  if (!context) {
    throw new Error(
      'useConversation must be used inside ConversationProvider',
    );
  }

  return context;
}