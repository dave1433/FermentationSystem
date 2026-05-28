interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}

export function StatCard({ label, value, unit, accent = false }: StatCardProps) {
  return (
    <div className={`card ${accent ? 'card--accent' : ''}`}>
      {accent && <div className="card__accent-bar" />}
      <p className="stat-card__label">{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className={`stat-card__value ${accent ? 'stat-card__value--accent' : ''}`}>
          {value}
        </span>
        {unit && <span className="stat-card__unit">{unit}</span>}
      </div>
    </div>
  );
}