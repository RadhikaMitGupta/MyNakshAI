# MyNaksh AI Conversation Experience

A React Native + TypeScript implementation of an AI astrology conversation experience with dynamic recommendations, message interactions, feedback, optimistic messaging, and reusable component architecture.

## Tech Stack

- React Native 0.87.1
- TypeScript
- React Navigation
- React Context + `useReducer`
- React Native Reanimated
- React Native `FlatList`
- iOS and Android

---

## Project Structure

```text
MyNakshAI/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── DateSeparator.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── RecommendationCarousel.tsx
│   │   ├── RecommendationRenderer.tsx
│   │   ├── ReplyPreview.tsx
│   │   └── SystemMessage.tsx
│   │
│   ├── data/
│   │   └── mockConversation.ts
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   │
│   ├── screens/
│   │   └── ConversationScreen.tsx
│   │
│   ├── services/
│   │   └── conversationApi.ts
│   │
│   ├── state/
│   │   └── ConversationContext.tsx
│   │
│   └── types/
│       └── conversation.ts
│
├── App.tsx
├── package.json
└── tsconfig.json
```

### Responsibility of each layer

- **components/** — Reusable UI components for messages, recommendations, composer and supporting UI.
- **screens/** — Screen-level orchestration and user interactions.
- **navigation/** — Navigation configuration using React Navigation.
- **state/** — Conversation state and reducer actions.
- **services/** — Mock API layer and asynchronous operations.
- **data/** — Mock conversation payload.
- **types/** — Shared TypeScript domain models.

---

## Component Architecture

The conversation screen is intentionally kept as an orchestration layer rather than putting all UI logic into a single component.

```text
App
 │
 └── NavigationContainer
      │
      └── AppNavigator
           │
           └── ConversationScreen
                │
                ├── DateSeparator
                │
                ├── SystemMessage
                │
                ├── MessageBubble
                │     ├── Reply
                │     ├── Copy
                │     ├── Delete
                │     ├── Feedback
                │     └── Retry
                │
                ├── RecommendationCarousel
                │     └── RecommendationRenderer
                │
                ├── ReplyPreview
                │
                └── MessageComposer
```

`ConversationScreen` handles conversation-level orchestration such as loading messages, sending messages, retrying failed messages and dispatching state updates.

Individual UI responsibilities are delegated to reusable components so that new message types or interactions can be added without making the screen monolithic.

---

## State Management

The application uses **React Context + `useReducer`** for conversation state.

The state contains:

```text
messages
loading
error
replyTo
```

The reducer handles explicit actions such as:

- `LOAD_SUCCESS`
- `LOAD_ERROR`
- `ADD_MESSAGE`
- `DELETE_MESSAGE`
- `UPDATE_MESSAGE`
- `UPDATE_MESSAGE_STATUS`
- `SET_FEEDBACK`
- `SET_FEEDBACK_REASON`
- `SET_REPLY`

This approach keeps state transitions predictable and makes the conversation behavior easy to extend.

For this assessment, Context + reducer was chosen over introducing Redux because the state is currently scoped primarily to the conversation experience. If the application grows to include authentication, user profiles, subscriptions, consultations, notifications and other cross-screen state, Redux Toolkit or another centralized store could be introduced.

---

## Recommendation Rendering Strategy

Recommendations are modeled as data rather than hardcoded UI.

Each recommendation contains:

```ts
interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
}
```

Supported recommendation types currently include:

```text
gemstone
tarot
consultation
article
promotion
panchang
remedy
```

The rendering architecture is:

```text
AI Message
    │
    └── recommendations[]
            │
            └── RecommendationCarousel
                    │
                    └── RecommendationRenderer
                            │
                            └── type configuration
```

`RecommendationCarousel` is responsible only for horizontal scrolling and layout.

`RecommendationRenderer` is responsible for rendering the reusable recommendation card and selecting the appropriate presentation based on the recommendation type.

This makes adding a new recommendation type straightforward. A new type can be added to the domain model and configuration without creating a completely separate rendering component.

---

## Performance Considerations

The conversation uses React Native's `FlatList` rather than rendering messages with a regular `.map()`.

This provides virtualization so that only the required portion of a potentially large conversation is rendered.

Additional considerations include:

- Stable message IDs are used as `FlatList` keys.
- Recommendation cards use stable recommendation IDs.
- Recommendations are rendered in a horizontal `FlatList`.
- Message components are split into smaller reusable components.
- Long conversations are handled through list virtualization.
- Horizontal recommendation lists avoid expanding the vertical conversation unnecessarily.
- Auto-scrolling is performed when new messages are added.
- The architecture allows further optimization with `React.memo`, `getItemLayout`, pagination and message windowing if conversation sizes increase significantly.

For a production-scale implementation, I would also consider pagination/infinite history loading, memoized selectors, image optimization for recommendation cards, and profiling with the React Native performance tools.

---

## Trade-offs Due to Time Constraints

The assessment was designed to be completed within a limited time window, so several areas were intentionally simplified.

### Mock API

The application uses a local mock API with artificial delays instead of a real backend.

This was sufficient to demonstrate:

- Loading states
- Optimistic updates
- Sending states
- Failure handling
- Retry behavior

A production implementation would replace this service with a real API client and proper request cancellation, authentication and error handling.

### Recommendation Actions

Recommendation cards currently demonstrate interaction through a local action rather than navigating to complete product/detail flows.

The architecture is designed so that these actions can later navigate to:

- Gemstone details
- Tarot experience
- Consultation booking
- Articles
- Panchang
- Remedies
- Promotions

### UI Design

The implementation focuses on interaction, architecture and reusability rather than reproducing a production design system pixel-perfectly.

### State Management

Context + reducer was intentionally selected to keep the solution lightweight. A larger application with many independent domains would benefit from Redux Toolkit or another centralized state management solution.

### Offline / Persistence

Conversation persistence and offline caching were not implemented because they were outside the core assessment requirements. These could be added using local persistence such as AsyncStorage or a database layer.

### Production Infrastructure

Authentication, analytics, crash reporting, push notifications and real backend integration were intentionally omitted to keep the implementation focused on the requested AI conversation experience.

---

## Key Design Decisions

The main architectural goals were:

1. Keep the conversation screen focused on orchestration.
2. Make message UI reusable.
3. Treat recommendations as data-driven content.
4. Make new recommendation types easy to add.
5. Use list virtualization for scalability.
6. Keep state transitions explicit and predictable.
7. Keep the implementation simple enough to evolve into a production architecture.

---

## Future Improvements

With additional development time, I would add:

- Real AI/API integration
- Streaming AI responses
- Pagination for conversation history
- Persistent conversation storage
- Rich recommendation cards with images
- Deep linking from recommendations
- More advanced Reanimated interactions
- Message read/delivery indicators
- Voice input/output
- Analytics and crash reporting
- Automated unit and integration tests
- Accessibility improvements
- Performance profiling with large conversation datasets

---

## Running the Project

Install dependencies:

```bash
yarn install
```

For iOS:

```bash
cd ios
pod install
cd ..
yarn ios
```

For Android:

```bash
yarn android
```

TypeScript validation:

```bash
npx tsc --noEmit
```
