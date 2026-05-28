import { useState, useEffect, useRef } from 'react';
import type { Telemetry } from '../types/types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5047';
const MAX_HISTORY = 50;

interface UseTelemetryResult {
  telemetry: Telemetry | null;
  history: Telemetry[];
  connected: boolean;
}

export function useTelemetry(): UseTelemetryResult {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [connected, setConnected] = useState(false);
  const connectionIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const connectionId = connectionIdRef.current;

    const sse = new EventSource(`${API_BASE}/sse?connectionId=${connectionId}`);
    sse.onopen = () => setConnected(true);
    sse.onerror = () => setConnected(false);

    sse.addEventListener('telemetry', (e: MessageEvent) => {
      const data: Telemetry = JSON.parse(e.data);
      setTelemetry(data);
      setHistory(prev => {
        const next = [...prev, { ...data, timestamp: new Date().toISOString() }];
        return next.slice(-MAX_HISTORY);
      });
    });

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

  return { telemetry, history, connected };
}