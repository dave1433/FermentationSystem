# 🧪 FermentWatch: Web Dashboard

This is the frontend component of the **FermentWatch** system. It provides a real-time, cyberpunk-inspired interface for monitoring fermentation telemetry.

## ✨ Features

- **Real-time Synchronization:** Uses Server-Sent Events (SSE) to receive live updates from the .NET backend.
- **Cyberpunk Aesthetic:** High-contrast industrial design with scanline effects and smooth animations.
- **Interactive Charts:** Historical trend analysis for temperature and ethanol levels.
- **Status Monitoring:** Visual indicators for device connectivity and fermentation stage.
- **"Ready to Drink" Alerts:** Special full-screen notification when fermentation is detected as complete.

## 🛠️ Development

This project is built with **React 19**, **Vite**, and **TypeScript**.

### Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint checks.

### Environment

The frontend expects the backend API to be available. Connectivity settings are typically managed in `src/hooks/useTelemetry.ts` or via environment variables.

---

For full project documentation, see the [Root README](../../README.md).

