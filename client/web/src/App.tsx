import { useState, useEffect, useRef } from 'react';
import type { Telemetry } from './types/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5047';

// Keeps last N readings for the chart
const MAX_HISTORY = 50;

export default function App() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [connected, setConnected] = useState(false);
  const connectionIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const connectionId = connectionIdRef.current;

    // 1. Subscribe to the SSE stream
    const sse = new EventSource(`${API_BASE}/sse?connectionId=${connectionId}`);

    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);

    // 2. Listen for telemetry group updates
    sse.addEventListener('telemetry', (e) => {
      const data: Telemetry = JSON.parse(e.data);
      setTelemetry(data);
      setHistory(prev => {
        const next = [...prev, { ...data, timestamp: new Date().toISOString() }];
        return next.slice(-MAX_HISTORY);
      });
    });

    // 3. Register with the listen endpoint to start receiving updates
    fetch(`${API_BASE}/api/Telemetry/listen?connectionId=${connectionId}`)
      .then(res => res.json())
      .then((initial: Telemetry) => {
        if (initial) {
          setTelemetry(initial);
          setHistory([{ ...initial, timestamp: new Date().toISOString() }]);
        }
      })
      .catch(console.error);

    return () => {
      sse.close();
      setConnected(false);
    };
  }, []);

  if (!telemetry) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Activity className="w-8 h-8 text-[#00FF00]" />
        </motion.div>
        <span className="ml-4 text-[#666] uppercase tracking-widest text-sm">Awaiting Signal...</span>
      </div>
    );
  }

  const chartData = history.map(r => ({
    time: format(new Date(r.timestamp), 'HH:mm:ss'),
    temperature: r.temperature,
    ethanolSignal: r.ethanolSignal,
  }));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col selection:bg-[#FFB800] selection:text-black">

      {/* Header */}
      <header className="px-8 pt-8 pb-4 flex justify-between items-start">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-[#666] font-bold uppercase mb-2">
            System Online /{' '}
            {connected
              ? <span className="text-[#00FF47]">Data Stream Active</span>
              : <span className="text-orange-500">Reconnecting...</span>}
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
            FERMENT<span className="text-[#FFB800]">WATCH</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#00FF47] animate-pulse' : 'bg-gray-700'}`}></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">MQTT GATEWAY: CONNECTED</span>
          </div>
          <p className="text-[10px] text-[#666] font-mono tracking-tight uppercase">{telemetry.deviceId}</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-8 px-8 py-8">

        {/* Left — big temperature */}
        <div className="col-span-12 xl:col-span-7 flex flex-col justify-between min-h-[400px]">
          <div>
            <p className="text-[12px] font-bold tracking-[0.4em] text-[#666] uppercase mb-4">Vessel Temperature</p>
            <div className="text-[100px] sm:text-[140px] md:text-[180px] font-black leading-[0.85] tracking-[-0.05em] text-white">
              {telemetry.temperature.toFixed(1)}
              <span className="text-[40px] text-[#666] ml-2">°C</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-12">
              <div>
                <p className="text-[11px] text-[#666] uppercase tracking-widest font-bold mb-1">Status</p>
                <p className={`text-2xl font-black tracking-tighter uppercase ${telemetry.fermentationActive ? 'text-[#00FF47]' : 'text-gray-500'}`}>
                  {telemetry.fermentationActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#666] uppercase tracking-widest font-bold mb-1">Ethanol Signal</p>
                <p className="text-2xl font-mono">{telemetry.ethanolSignal.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#666] uppercase tracking-widest font-bold mb-1">Last Update</p>
                <p className="text-2xl font-mono">{format(new Date(telemetry.timestamp), 'HH:mm:ss')}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-12 w-full h-48 bg-[#0F0F0F] border border-[#222] p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-ping"></span>
              <p className="text-[9px] font-mono text-[#666] uppercase tracking-widest font-bold">
                Trend / {history.length} Samples
              </p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #333', fontSize: 11 }}
                  labelStyle={{ color: '#666' }}
                />
                <Line type="monotone" dataKey="temperature" stroke="#FFB800" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ethanolSignal" stroke="#00FF47" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right — live log */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-8">

          {/* Ethanol block */}
          <div className="bg-[#111] p-10 border-l-[12px] border-[#00FF47] flex flex-col justify-center">
            <p className="text-[11px] font-bold tracking-[0.4em] text-[#666] uppercase mb-4">Ethanol Signal</p>
            <div className="flex items-baseline gap-4">
              <span className="text-8xl font-black tracking-tighter leading-none">
                {telemetry.ethanolSignal.toFixed(3)}
              </span>
            </div>
            <p className={`text-[10px] font-mono mt-4 uppercase font-bold tracking-widest ${telemetry.fermentationActive ? 'text-[#00FF47]' : 'text-gray-500'}`}>
              Fermentation: {telemetry.fermentationActive ? 'In Progress' : 'Not Active'}
            </p>
          </div>

          {/* Live stream log */}
          <div className="flex-grow bg-[#0F0F0F] border border-[#222] p-6 flex flex-col overflow-hidden">
            <h3 className="text-[10px] font-bold tracking-widest text-[#444] uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full"></span>
              MQTT Live Stream [rdco0314/fermentation/data]
            </h3>
            <div className="font-mono text-[11px] space-y-4 overflow-y-auto flex-1 pr-2">
              {[...history].reverse().map((r, i) => (
                <div key={i} className={`flex gap-4 items-start ${i > 3 ? 'opacity-30' : i > 1 ? 'opacity-60' : 'opacity-100'}`}>
                  <span className="text-[#666] whitespace-nowrap">{format(new Date(r.timestamp), 'HH:mm:ss')}</span>
                  <span className="text-[#FFB800] font-bold">[PUB]</span>
                  <span className="text-gray-300 leading-tight">
                    TEMP: {r.temperature.toFixed(2)} / ETHANOL: {r.ethanolSignal.toFixed(3)} / ACTIVE: {r.fermentationActive ? 'YES' : 'NO'}
                  </span>
                </div>
              ))}
              {history.length === 0 && (
                <div className="flex gap-4 items-center text-[#444] italic">
                  <span className="text-[#666]">---</span>
                  <span>Waiting for publisher signal...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-[#222] flex flex-wrap justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-[0.2em]">
        <div className="flex gap-12">
          <div className="flex items-center gap-2">
            <span className="text-[#666]">BACKEND:</span>
            <span className="text-white">ASP.NET CORE / .NET 10</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#666]">STORAGE:</span>
            <span className="text-white">NEONDB / POSTGRES</span>
          </div>
        </div>
        <div className="flex gap-8 items-center mt-4 sm:mt-0">
          <span>ESP32 SAMPLING: 5S INTV</span>
          <div className="bg-white text-black px-2 py-0.5 font-bold">V1.0.0</div>
        </div>
      </footer>
    </div>
  );
}