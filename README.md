# VeriDAI (MVP Frontend)

Minimal dark-themed animated frontend for deepfake authenticity scoring.

## Features
- Drag & drop upload (image / short video)
- First anonymous upload allowed, then auth modal
- 15 free analyses per day (+1 per referral credit pill mock)
- Animated analysis drawer with placeholder trust score
- Framer-motion microinteractions, conic gradient score gauge
- Zustand state management

## Getting Started
Install dependencies and run dev server.

```bash
pnpm install # or npm install / yarn
pnpm dev
```

Open http://localhost:5173

## Next Steps / TODO
- Replace fakeAnalyse with real API (MCP server call to deepfake model)
- Persist auth & quota server-side
- Referral code generation & tracking
- History dashboard view
- Accessibility & keyboard interactions
- Unit tests

## License
MIT (placeholder)
