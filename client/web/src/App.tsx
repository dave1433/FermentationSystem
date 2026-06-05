import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useTelemetry } from './hooks/useTelemetry';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { TrendChart } from './components/TrendChart';
import { LiveLog } from './components/Livelog';
import { Footer } from './components/Footer';
import './styles/theme.css';

export default function App() {
  const { telemetry, history, connected } = useTelemetry();

  if (!telemetry) {
    return (
      <div className="await-screen">
        <div className="await-screen__spinner" />
        <p className="await-screen__text">Awaiting Signal...</p>
      </div>
    );
  }
  if (telemetry?.fermentationComplete) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080704',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Bebas Neue', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 120, marginBottom: 24 }}>🍷</div>
      <h1 style={{
        fontSize: 'clamp(48px, 10vw, 96px)',
        color: '#C87941',
        letterSpacing: '0.08em',
        margin: 0,
      }}>
        READY TO DRINK
      </h1>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        color: '#6b5c47',
        fontSize: 14,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginTop: 16,
      }}>
        Fermentation complete · {telemetry.deviceId}
      </p>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        color: '#4a3d2e',
        fontSize: 12,
        marginTop: 8,
      }}>
        Final temperature: {telemetry.temperature.toFixed(1)}°C
      </p>
    </div>
  );
}

  const chartData = history.map(r => ({
    time: format(new Date(r.timestamp), 'HH:mm:ss'),
    temp: parseFloat(r.temperature.toFixed(2)),
    ethanol: parseFloat(r.ethanolSignal.toFixed(4)),
  }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="scanline-overlay" />

      <StatusBar
        connected={connected}
        deviceId={telemetry.deviceId}
        fermentationActive={telemetry.fermentationActive}
      />

      <Header />

      <main className="main-grid">
        {/* Temperature hero */}
        <div className="temp-hero col-span-12">
          <AnimatePresence mode="wait">
            <motion.span
              key={telemetry.temperature.toFixed(1)}
              className="display temp-hero__value"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {telemetry.temperature.toFixed(1)}
            </motion.span>
          </AnimatePresence>
          <div style={{ paddingBottom: '1rem' }}>
            <span className="display temp-hero__unit">°C</span>
            <p className="temp-hero__label">Vessel Temperature</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-cards-grid col-span-12">
          <StatCard label="Ethanol Signal" value={telemetry.ethanolSignal.toFixed(3)} accent />
          <StatCard label="Status" value={telemetry.fermentationActive ? 'Active' : 'Inactive'} />
          <StatCard label="Last Update" value={format(new Date(telemetry.timestamp), 'HH:mm:ss')} />
          <StatCard label="Samples" value={String(history.length)} unit="pts" />
        </div>

        {/* Charts */}
        <TrendChart data={chartData} />

        {/* Live log */}
        <LiveLog history={history} />
      </main>

      <Footer />
    </div>
  );
}