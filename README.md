# AfterHours

Frontend-only time journal. Track activities, review the current week, and keep everything in the browser.

## Stack

React, TypeScript, Vite, React Router, Zustand, Recharts, React Hook Form, Zod, Tailwind CSS, Lucide, Vitest.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

Activities are stored in `localStorage` under `afterhours-activities`. The first visit starts with sample entries for this week and the previous one, so the dashboard is already filled. Clearing site data and reloading restores that sample set.
