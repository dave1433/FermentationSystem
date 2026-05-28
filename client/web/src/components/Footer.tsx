export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__meta">
        <span>Backend: ASP.NET Core / .NET 10</span>
        <span>Storage: NeonDB / Postgres</span>
        <span>ESP32 Sampling: 5s Interval</span>
      </div>
      <span className="footer__version mono">V1.0.0</span>
    </footer>
  );
}