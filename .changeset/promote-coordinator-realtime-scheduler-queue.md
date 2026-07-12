---
'@stackra/contracts': minor
'@stackra/coordinator': minor
'@stackra/realtime': minor
'@stackra/scheduler': minor
'@stackra/queue': minor
---

Promote 4 new client-side packages from reference:

- **@stackra/coordinator** (0.1.0) — cross-tab leader election, distributed locks via Web Locks API, and event relay via BroadcastChannel.
- **@stackra/realtime** (0.1.0) — multi-driver WebSocket manager, transport-agnostic, with React hooks for channels and presence.
- **@stackra/scheduler** (0.1.0) — client-side task scheduler with interval + cron support, decorator-based auto-discovery, lifecycle hooks.
- **@stackra/queue** (0.1.0) — client-side job queue with pluggable connectors (memory, localStorage, IndexedDB, BroadcastChannel, QStash), workers, and processor decorators.

Adds their DI tokens, event constants, and event-name unions to `@stackra/contracts`:

- Tokens: `COORDINATOR_CONFIG`, `TAB_COORDINATOR`, `REALTIME_MANAGER`, `REALTIME_CONFIG`, `SCHEDULER_SERVICE`, `SCHEDULER_CONFIG`, `TASK_RUNNER`, `SCHEDULED_METADATA_KEY`, `QUEUE_MANAGER`, `QUEUE_CONFIG`, `PROCESSOR_METADATA_KEY`, `ON_JOB_EVENT_METADATA_KEY`.
- Event maps: `COORDINATOR_EVENTS`, `REALTIME_EVENTS`, `SCHEDULER_EVENTS`, `QUEUE_EVENTS` (plus `CoordinatorEventName`, `RealtimeEventName`, `SchedulerEventName`, `QueueEventName` union types).
