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

## GitHub Pages

Pushes to `main` build the app and publish `dist` with GitHub Pages. The site is served from [https://ilya-begalko.github.io/afterhours_react_app/](https://ilya-begalko.github.io/afterhours_react_app/). In the repository, set Settings → Pages → Source to GitHub Actions before the first deploy.

Activities are stored in `localStorage` under `afterhours-activities`. The first visit starts with sample entries for this week and the previous one, so the dashboard is already filled. Clearing site data and reloading restores that sample set.
