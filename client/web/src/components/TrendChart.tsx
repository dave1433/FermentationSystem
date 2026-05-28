import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  temp: number;
  ethanol: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '8px 12px' }}>
      <p className="label" style={{ marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="mono" style={{ fontSize: 11, color: p.color, margin: '2px 0' }}>
          {p.name}: {p.value.toFixed(3)}
        </p>
      ))}
    </div>
  );
}

interface TrendChartProps {
  data: ChartDataPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="charts-grid col-span-12">
      {/* Temperature */}
      <div className="surface">
        <p className="chart-panel__label">◆ Temperature Trend</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C87941" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C87941" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#1a1510" />
            <XAxis dataKey="time" hide />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#4a3d2e', fontSize: 10, fontFamily: 'Space Mono' }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              name="°C"
              stroke="#C87941"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Ethanol */}
      <div className="surface">
        <p className="chart-panel__label">◆ Ethanol Signal Trend</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ethGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7a4520" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7a4520" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#1a1510" />
            <XAxis dataKey="time" hide />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#4a3d2e', fontSize: 10, fontFamily: 'Space Mono' }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ethanol"
              name="Signal"
              stroke="#7a4520"
              strokeWidth={2}
              fill="url(#ethGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}