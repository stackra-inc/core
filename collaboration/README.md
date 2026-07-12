# @stackra/react-collaboration

Liveblocks-style collaboration features with a transport abstraction layer for
real-time presence, cursors, typing indicators, shared state, threads,
notifications, and activity feeds.

## Installation

```bash
pnpm add @stackra/react-collaboration
```

## Quick Start

### 1. Register the module

```typescript
// app.module.ts
import { CollaborationModule } from '@stackra/react-collaboration';

@Module({
  imports: [
    CollaborationModule.forRoot({ transport: 'broadcast' }), // or 'reverb', 'auto'
  ],
})
export class AppModule {}
```

### 2. Use hooks in components

```tsx
import { useRoom, useCursors, useSharedState } from '@stackra/react-collaboration';

function CollabPage() {
  const { members, self, status } = useRoom('my-room', { userName: 'Alice' });
  const { cursors, updateCursor } = useCursors('my-room');
  const [count, setCount] = useSharedState<number>('my-room', 0);

  return (
    <div onPointerMove={(e) => updateCursor({ x: e.clientX, y: e.clientY })}>
      <p>
        Status: {status} | Members: {members.length}
      </p>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
    </div>
  );
}
```

## Transport Strategies

| Strategy      | Description                                         |
| ------------- | --------------------------------------------------- |
| `'broadcast'` | BroadcastChannel API (cross-tab, no backend needed) |
| `'reverb'`    | Laravel Reverb via `@stackra/ts-realtime`           |
| `'auto'`      | Tries Reverb first, falls back to BroadcastChannel  |

## Hooks

| Hook                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `useRoom`            | Room connection lifecycle and members    |
| `useCursors`         | Real-time cursor position tracking       |
| `useTypingIndicator` | Typing state broadcasting                |
| `useSharedState`     | Synchronized state (last-write-wins)     |
| `useThreads`         | Discussion threads with replies          |
| `useNotifications`   | Notification management with persistence |
| `useActivityFeed`    | Timeline of room events                  |

## Architecture

```
┌─────────────────────────────────────────────┐
│              React Hooks Layer               │
│  useRoom, useCursors, useSharedState, ...   │
├─────────────────────────────────────────────┤
│           RoomManager Service               │
│  Transport selection & lifecycle            │
├─────────────────────────────────────────────┤
│        CollaborationTransport               │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Broadcast    │  │ Reverb           │    │
│  │ Channel      │  │ (@stackra/       │    │
│  │ (local)      │  │  ts-realtime)    │    │
│  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘
```

## License

Private — internal use only.
