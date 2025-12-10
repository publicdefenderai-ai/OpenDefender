# Technical Design Document: Hybrid Chatbot Interface

## 1. Overview

### 1.1 Purpose
This document outlines the technical architecture for implementing a hybrid chatbot interface that combines the current modal-based triage flow with a conversational chatbot for detailed legal guidance.

### 1.2 Goals
- Maintain structured question flow while providing a more familiar chat interface
- Preserve session-based privacy (no persistent storage of user data)
- Enable easy re-entry via floating launcher
- Support bilingual (EN/ES) interactions
- Ensure accessibility compliance (WCAG 2.1 AA)

### 1.3 Non-Goals
- Real-time AI streaming (initial version uses pre-defined responses)
- Multi-session persistence (privacy-first design)
- Voice input/output

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Floating    │───►│   Triage     │───►│    Chat Interface    │  │
│  │  Launcher    │    │   Modal      │    │    (Full Experience) │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                                          │                 │
│         │            ┌──────────────────┐          │                 │
│         └───────────►│  Chat State      │◄─────────┘                 │
│                      │  Manager         │                            │
│                      │  (React Context) │                            │
│                      └──────────────────┘                            │
│                               │                                      │
├───────────────────────────────┼──────────────────────────────────────┤
│                          BACKEND                                     │
├───────────────────────────────┼──────────────────────────────────────┤
│                               ▼                                      │
│                      ┌──────────────────┐                           │
│                      │  Guidance        │                           │
│                      │  Engine          │                           │
│                      │  (Existing)      │                           │
│                      └──────────────────┘                           │
│                               │                                      │
│              ┌────────────────┼────────────────┐                    │
│              ▼                ▼                ▼                    │
│      ┌────────────┐   ┌────────────┐   ┌────────────┐              │
│      │ Charge DB  │   │ Statute DB │   │ Claude AI  │              │
│      └────────────┘   └────────────┘   └────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `ChatLauncher` | `client/src/components/chat/chat-launcher.tsx` | Floating button, session indicator |
| `ChatProvider` | `client/src/contexts/chat-context.tsx` | Global chat state, message history |
| `TriageModal` | `client/src/components/chat/triage-modal.tsx` | Initial screening questions |
| `ChatInterface` | `client/src/pages/chat.tsx` | Main chat experience |
| `MessageBubble` | `client/src/components/chat/message-bubble.tsx` | Individual message display |
| `QuickReplyButtons` | `client/src/components/chat/quick-replies.tsx` | Clickable response options |
| `CaseStatusPanel` | `client/src/components/chat/case-status.tsx` | Sidebar showing captured info |
| `ExitWarningDialog` | `client/src/components/chat/exit-warning.tsx` | Unsaved data warning |

---

## 3. State Management

### 3.1 Chat Context

```typescript
// client/src/contexts/chat-context.tsx

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  metadata?: Record<string, unknown>;
}

interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

interface CaseInfo {
  state?: string;
  chargeType?: string;
  chargeCategory?: string;
  courtStage?: string;
  isEmergency?: boolean;
}

interface ChatState {
  messages: Message[];
  caseInfo: CaseInfo;
  currentStep: string;
  isOpen: boolean;
  hasUnsavedGuidance: boolean;
  guidanceData?: GuidanceResponse; // From existing API
}

interface ChatContextValue {
  state: ChatState;
  actions: {
    openChat: () => void;
    closeChat: () => void;
    sendMessage: (content: string) => void;
    selectQuickReply: (reply: QuickReply) => void;
    updateCaseInfo: (info: Partial<CaseInfo>) => void;
    resetChat: () => void;
    exportGuidance: () => void;
  };
}
```

### 3.2 State Machine for Conversation Flow

```typescript
// Conversation states
type ConversationStep =
  | 'welcome'
  | 'emergency_check'
  | 'state_selection'
  | 'charge_type'
  | 'charge_category'
  | 'court_stage'
  | 'generating_guidance'
  | 'guidance_ready'
  | 'follow_up_questions'
  | 'completed';

// State transitions
const transitions: Record<ConversationStep, ConversationStep[]> = {
  welcome: ['emergency_check'],
  emergency_check: ['state_selection', 'emergency_resources'],
  state_selection: ['charge_type'],
  charge_type: ['charge_category'],
  charge_category: ['court_stage'],
  court_stage: ['generating_guidance'],
  generating_guidance: ['guidance_ready'],
  guidance_ready: ['follow_up_questions', 'completed'],
  follow_up_questions: ['follow_up_questions', 'completed'],
  completed: ['welcome'], // Reset
};
```

### 3.3 Message Templates

```typescript
// client/src/lib/chat-messages.ts

export const messages = {
  en: {
    welcome: {
      content: "Hi! I'm here to help you understand your legal situation. Everything you share stays private and is deleted when you leave.",
      quickReplies: [
        { id: 'start', label: "Let's get started", value: 'start' },
        { id: 'learn', label: 'Just browsing', value: 'browse' }
      ]
    },
    emergency_check: {
      content: "First, is this an emergency situation?",
      quickReplies: [
        { id: 'emergency', label: "Yes, I'm being arrested now", value: 'emergency', icon: '🚨' },
        { id: 'no_emergency', label: "No, I have existing charges", value: 'existing' },
        { id: 'learning', label: "I just want to learn", value: 'learning' }
      ]
    },
    // ... additional messages
  },
  es: {
    // Spanish translations
  }
};
```

---

## 4. Component Specifications

### 4.1 ChatLauncher

```typescript
// Props
interface ChatLauncherProps {
  className?: string;
}

// Behavior
- Fixed position: bottom-right (bottom: 24px, right: 24px)
- Shows "Resume" badge if hasUnsavedGuidance
- Hidden when chat interface is open
- Respects reduced motion preferences
- Mobile: icon only, 48px
- Desktop: icon + label, 56px
```

### 4.2 ChatInterface

```typescript
// Route: /chat (also accessible via floating launcher overlay)

// Layout
- Desktop: Two-column (chat 65%, status panel 35%)
- Mobile: Single column with collapsible status panel

// Features
- Auto-scroll to new messages (with pause on manual scroll)
- Typing indicator (1.5s delay before response)
- Keyboard navigation for quick replies
- Export button always visible
- "Find a lawyer" emergency exit always visible
```

### 4.3 MessageBubble

```typescript
interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

// Styling
- Bot: left-aligned, muted background, max-width 80%
- User: right-aligned, primary background, max-width 70%
- Smooth fade-in animation (150ms)
- Support for markdown content (lists, bold, links)
```

### 4.4 QuickReplyButtons

```typescript
interface QuickReplyButtonsProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
}

// Layout
- Flexbox wrap
- 2 columns on mobile, up to 4 on desktop
- Full-width option for important CTAs
- Disabled state when processing
```

### 4.5 ExitWarningDialog

```typescript
interface ExitWarningDialogProps {
  isOpen: boolean;
  onExport: () => void;
  onProceed: () => void;
  onCancel: () => void;
}

// Trigger conditions
- Browser back button
- Navigation to different route
- Closing chat panel
- Clicking external link

// NOT triggered when
- hasUnsavedGuidance is false
- User has already exported
```

---

## 5. API Integration

### 5.1 Existing Endpoints (No Changes)

The chatbot will use existing backend endpoints:

```
POST /api/legal-guidance
  - Request: { state, chargeType, chargeCategory, courtStage }
  - Response: GuidanceResponse (existing type)

GET /api/charges
  - Returns available charge categories

GET /api/statutes/:state
  - Returns state-specific statute info
```

### 5.2 New Endpoint (Optional Enhancement)

```
POST /api/chat/feedback
  - Request: { messageId, helpful: boolean }
  - Purpose: Track which responses are helpful
  - Storage: Aggregate only, no PII
```

---

## 6. Privacy & Security

### 6.1 Data Handling

| Data Type | Storage | Lifetime |
|-----------|---------|----------|
| Messages | Memory only (React state) | Until page close/refresh |
| Case info | Memory only | Until page close/refresh |
| Guidance response | Memory only | Until page close/refresh |
| Feedback | Anonymous aggregate in DB | Permanent |

### 6.2 PII Protection

- All user inputs pass through existing PII redaction before AI processing
- No session identifiers stored
- No cookies beyond essential session management
- Export generates local PDF, no server-side storage

### 6.3 Exit Warning Implementation

```typescript
// Hook for navigation blocking
function useExitWarning(hasUnsavedData: boolean) {
  useEffect(() => {
    if (!hasUnsavedData) return;

    // Browser close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedData]);

  // In-app navigation handled by router integration
}
```

---

## 7. Accessibility

### 7.1 ARIA Implementation

```tsx
// Chat container
<div 
  role="log" 
  aria-label="Legal guidance conversation"
  aria-live="polite"
>
  {messages.map(msg => (
    <div 
      key={msg.id}
      role="article"
      aria-label={msg.role === 'bot' ? 'Assistant message' : 'Your message'}
    >
      {msg.content}
    </div>
  ))}
</div>

// Quick replies
<div role="group" aria-label="Response options">
  {replies.map((reply, i) => (
    <button
      key={reply.id}
      aria-label={reply.label}
      tabIndex={0}
    >
      {reply.label}
    </button>
  ))}
</div>
```

### 7.2 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between interactive elements |
| Enter/Space | Activate button |
| Escape | Close modal/panel |
| Arrow Up/Down | Navigate message history (screen readers) |

### 7.3 Screen Reader Announcements

```typescript
// Announce new messages
useEffect(() => {
  if (latestMessage?.role === 'bot') {
    announceToScreenReader(`New message: ${latestMessage.content}`);
  }
}, [latestMessage]);

function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}
```

---

## 8. Internationalization

### 8.1 Message Translation Structure

```typescript
// Integration with existing i18n setup
const { t, i18n } = useTranslation();

// Chat messages use dedicated namespace
const messages = {
  welcome: t('chat.welcome'),
  emergency_check: t('chat.emergencyCheck'),
  // ...
};

// Quick replies also translated
const quickReplies = [
  { label: t('chat.replies.getStarted'), value: 'start' },
];
```

### 8.2 Language Toggle

- Inline toggle in chat header
- Switching language re-renders messages in new language
- User selections/inputs preserved during language switch

---

## 9. Performance

### 9.1 Code Splitting

```typescript
// Lazy load chat components
const ChatInterface = lazy(() => import('./pages/chat'));
const ChatLauncher = lazy(() => import('./components/chat/chat-launcher'));

// Preload on hover
const preloadChat = () => {
  import('./pages/chat');
};
```

### 9.2 Animation Performance

- Use `transform` and `opacity` only for animations
- Typing indicator uses CSS animations (GPU accelerated)
- Message animations respect `prefers-reduced-motion`

### 9.3 Memory Management

- Messages capped at 100 (oldest pruned)
- Large guidance responses stored as reference, not copied
- Clean up on unmount

---

## 10. Testing Strategy

### 10.1 Unit Tests

| Component | Test Cases |
|-----------|------------|
| ChatProvider | State transitions, message handling |
| MessageBubble | Rendering, accessibility |
| QuickReplyButtons | Click handling, keyboard nav |
| ExitWarningDialog | Trigger conditions, callbacks |

### 10.2 Integration Tests

- Full conversation flow (triage → guidance)
- Language switching mid-conversation
- Export functionality
- Mobile responsive behavior

### 10.3 E2E Tests (Playwright)

```typescript
test('complete guidance flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="chat-launcher"]');
  await page.click('[data-testid="quick-reply-start"]');
  await page.click('[data-testid="quick-reply-existing"]');
  await page.selectOption('[data-testid="state-select"]', 'CA');
  // ... continue flow
  await expect(page.locator('[data-testid="guidance-result"]')).toBeVisible();
});
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create ChatContext and state management
- [ ] Build ChatLauncher component
- [ ] Implement basic MessageBubble and QuickReplyButtons
- [ ] Set up routing for /chat

### Phase 2: Core Flow (Week 2)
- [ ] Implement conversation state machine
- [ ] Connect to existing guidance API
- [ ] Build CaseStatusPanel
- [ ] Add typing indicator and animations

### Phase 3: Polish (Week 3)
- [ ] ExitWarningDialog implementation
- [ ] Accessibility audit and fixes
- [ ] Mobile optimization
- [ ] i18n integration

### Phase 4: Testing & Launch (Week 4)
- [ ] Unit test coverage
- [ ] E2E test suite
- [ ] Performance optimization
- [ ] Gradual rollout (A/B test optional)

---

## 12. Rollback Plan

If issues arise post-launch:

1. **Feature flag**: Disable floating launcher, revert to modal-only
2. **Data**: No migration needed (no persistent storage)
3. **Routes**: /chat can 404 and redirect to /case-guidance

---

## 13. Success Metrics

| Metric | Current (Modal) | Target (Chatbot) |
|--------|-----------------|------------------|
| Completion rate | TBD | +10% |
| Time to guidance | TBD | -20% |
| Export rate | TBD | +15% |
| Return visits | TBD | +25% |

---

## 14. Open Questions

1. Should free-text input be enabled from the start, or only after structured flow?
2. Should we show "typing" indicator for locally-computed responses, or only AI responses?
3. Mobile: full-screen overlay or slide-up panel?
4. Should exported PDF include conversation history or just final guidance?

---

## Appendix A: File Structure

```
client/src/
├── components/
│   └── chat/
│       ├── chat-launcher.tsx
│       ├── message-bubble.tsx
│       ├── quick-replies.tsx
│       ├── case-status.tsx
│       ├── typing-indicator.tsx
│       └── exit-warning.tsx
├── contexts/
│   └── chat-context.tsx
├── pages/
│   └── chat.tsx
├── lib/
│   └── chat-messages.ts
└── hooks/
    └── use-exit-warning.ts
```

---

## Appendix B: Dependencies

No new dependencies required. Uses existing:
- React Context (state management)
- Framer Motion (animations)
- wouter (routing)
- react-i18next (translations)
- shadcn/ui (components)
