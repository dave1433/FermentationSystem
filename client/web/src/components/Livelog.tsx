import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import type { Telemetry } from '../types/types';

interface LiveLogProps {
  history: Telemetry[];
}

export function LiveLog({ history }: LiveLogProps) {
  return (
    <div className="surface col-span-12">
      <p className="chart-panel__label">◆ MQTT Live Stream — rdco0314/fermentation/data</p>
      <div className="log-container">
        <AnimatePresence initial={false}>
          {[...history].reverse().map((r, i) => (
            <motion.div
              key={r.timestamp}
              className="log-entry"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i > 4 ? Math.max(0.15, 1 - i * 0.12) : 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="log-entry__time">
                {format(new Date(r.timestamp), 'HH:mm:ss')}
              </span>
              <span className="log-entry__tag">[PUB]</span>
              <span className="log-entry__body">
                TEMP: <span className="log-entry__value">{r.temperature.toFixed(2)}</span>
                {' '}/ ETHANOL: <span className="log-entry__value">{r.ethanolSignal.toFixed(3)}</span>
                {' '}/ ACTIVE:{' '}
                <span className={r.fermentationActive ? 'log-entry__active--yes' : 'log-entry__active--no'}>
                  {r.fermentationActive ? 'YES' : 'NO'}
                </span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}