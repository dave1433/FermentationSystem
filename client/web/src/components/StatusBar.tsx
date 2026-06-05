import { subscribeToPush } from '../hooks/usePushNotifications';

interface StatusBarProps {
  connected: boolean;
  deviceId: string;
  fermentationActive: boolean;
}

export function StatusBar({ connected, deviceId, fermentationActive }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar__group">
        <div className="status-bar__item">
          <span className={`glow-dot ${connected ? 'glow-dot--active' : ''}`} />
          <span className={`status-bar__text ${connected ? 'status-bar__text--active' : ''}`}>
            {connected ? 'Stream Active' : 'Reconnecting'}
          </span>
        </div>
        <span className="status-bar__separator">|</span>
        <span className="status-bar__text">{deviceId}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="status-bar__item">
          <span className={`glow-dot ${fermentationActive ? 'glow-dot--active' : ''}`} />
          <span className={`status-bar__text ${fermentationActive ? 'status-bar__text--active' : ''}`}>
            Fermentation {fermentationActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <button
          onClick={() => subscribeToPush().catch(console.error)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-copper)',
            background: 'transparent',
            border: '1px solid var(--color-border-muted)',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          🔔 Enable Notifications
        </button>
      </div>
    </div>
  );
}