"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology", "Food & Beverage", "Retail", "Healthcare", "Finance",
  "Education", "Manufacturing", "Logistics", "Agriculture", "Tourism",
  "Real Estate", "Cloud Kitchen", "Digital Marketing", "Fitness Studio",
  "Online Education", "EV Charging Station", "Solar Installation",
  "Co-working Space", "Pet Care Services", "AI Services",
];

export default function MarketPage() {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(false);

  const fetch_intel = async () => {
    if (!industry || !location) { alert("Fill both fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/market-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location }),
      });
      setData(await res.json());
    } catch { alert("Could not connect to backend."); }
    finally { setLoading(false); }
  };

  const trendColor = (t: string) =>
    t?.includes("rapidly") ? "#22c55e" : t?.includes("rising") ? "#60a5fa" : t?.includes("recovering") ? "#f59e0b" : "#94a3b8";

  const compColor = (c: string) =>
    c === "Very High" || c === "High" ? "#ef4444" : c === "Moderate" ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }
        .layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; }
        .panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); margin-bottom: 16px; }
        .panel-title { font-family: 'DM Mono', monospace; font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 18px; }
        .field-group  { margin-bottom: 13px; }
        .field-label  { display: block; font-size: 0.66rem; font-family: 'DM Mono', monospace; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .field-input  { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .field-input:focus { border-color: #4f46e5; }
        .field-input::placeholder { color: var(--text-placeholder); }
        .field-select { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; cursor: pointer; }
        .run-btn { width: 100%; padding: 13px; background: #4f46e5; border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .run-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(79,70,229,0.28); }
        .run-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
        .stat-box  { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 18px 16px; box-shadow: var(--shadow); }
        .stat-lbl  { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 8px; }
        .stat-val  { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; color: #4f46e5; line-height: 1; }
        .stat-sub  { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--text-faint); margin-top: 4px; }
        .section-title { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 14px; }
        .list-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border-light); }
        .list-item:last-child { border-bottom: none; }
        .list-dot  { width: 6px; height: 6px; border-radius: 50%; background: #4f46e5; flex-shrink: 0; margin-top: 6px; }
        .list-text { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
        .risk-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border-light); }
        .risk-item:last-child { border-bottom: none; }
        .risk-dot  { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; flex-shrink: 0; margin-top: 6px; }
        .diff-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border-light); }
        .diff-item:last-child { border-bottom: none; }
        .diff-dot  { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0; margin-top: 6px; }
        .reg-chip { display: inline-flex; align-items: center; background: var(--accent-bg); border: 1px solid var(--accent-border); color: #4f46e5; font-family: 'DM Mono', monospace; font-size: 0.6rem; padding: 4px 10px; border-radius: 6px; margin: 4px 4px 4px 0; }
        .badge { font-family: 'DM Mono', monospace; font-size: 0.62rem; padding: 3px 10px; border-radius: 999px; }
        .badge-blue { background: var(--accent-bg); border: 1px solid var(--accent-border); color: #4f46e5; }
        .comp-bar-track { background: var(--border); height: 6px; border-radius: 999px; overflow: hidden; margin-top: 8px; }
        .comp-bar-fill  { height: 100%; border-radius: 999px; transition: width 1s ease; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; gap: 14px; text-align: center; }
        .empty-icon  { width: 60px; height: 60px; border-radius: 50%; background: var(--accent-bg); border: 1.5px solid var(--accent-border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text-faint); }
        .empty-sub   { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); max-width: 220px; line-height: 1.6; }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Market Intelligence</h1>
        <span className="page-tag">Research Report</span>
      </div>

      <div className="layout">
        <div style={{ height: "fit-content" }}>
          <div className="panel">
            <p className="panel-title">Research Parameters</p>
            <div className="field-group">
              <label className="field-label">Industry / Sector</label>
              <select className="field-select" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Target City</label>
              <input className="field-input" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <button className="run-btn" onClick={fetch_intel} disabled={loading}>
              {loading ? "Analysing market…" : "Generate Report →"}
            </button>
          </div>

          {data && (
            <div className="panel">
              <p className="panel-title">Quick Stats</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { lbl: "Industry Growth", val: `${data.growth_rate_pct}%` },
                  { lbl: "Market Size", val: `₹${data.market_size_cr?.toLocaleString()}Cr` },
                  { lbl: "Your Market", val: `₹${data.addressable_market_cr}Cr` },
                  { lbl: "Peak Season", val: data.peak_season },
                  { lbl: "City Startup Scene", val: data.startup_density },
                  { lbl: "VC Presence", val: data.vc_presence },
                ].map(({ lbl, val }) => (
                  <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px" }}>{lbl}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {loading && (
            <div className="empty-state">
              <div className="spinner" />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: 2 }}>GENERATING MARKET REPORT</p>
            </div>
          )}

          {!loading && !data && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p className="empty-title">Select a market to research</p>
              <p className="empty-sub">Choose your industry and city to get competitor analysis, growth data & regulatory checklist</p>
            </div>
          )}

          {!loading && data && (
            <>
              <div className="panel" style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>{data.industry} — {data.location}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--text-faint)", marginTop: 4 }}>Tier {data.city_tier} City Market Report</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="badge badge-blue">Growth: {data.growth_rate_pct}%</span>
                  <span className="badge" style={{ background: "transparent", border: "1px solid var(--border)", color: trendColor(data.industry_trend) }}>↑ {data.industry_trend}</span>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-box">
                  <p className="stat-lbl">Total Market Size</p>
                  <p className="stat-val">₹{data.market_size_cr?.toLocaleString()}Cr</p>
                  <p className="stat-sub">National market size</p>
                </div>
                <div className="stat-box">
                  <p className="stat-lbl">Your Addressable Market</p>
                  <p className="stat-val">₹{data.addressable_market_cr}Cr</p>
                  <p className="stat-sub">Based on city & investment</p>
                </div>
                <div className="stat-box">
                  <p className="stat-lbl">Competition Level</p>
                  <p className="stat-val" style={{ fontSize: "1.1rem", color: compColor(data.competition_level) }}>{data.competition_level}</p>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill" style={{ width: `${data.competition_score}%`, background: compColor(data.competition_level) }} />
                  </div>
                </div>
              </div>

              <div className="two-col">
                <div className="panel">
                  <p className="section-title">Target Audience</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 12 }}>{data.target_audience}</p>
                  <p className="section-title" style={{ marginTop: 10 }}>Customer LTV</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 800, color: "#4f46e5" }}>{data.avg_customer_ltv}</p>
                </div>
                <div className="panel">
                  <p className="section-title">Best Acquisition Channels</p>
                  {data.acquisition_channels?.map((ch: string, i: number) => (
                    <div key={i} className="list-item"><div className="list-dot" /><span className="list-text">{ch}</span></div>
                  ))}
                </div>
              </div>

              <div className="two-col">
                <div className="panel">
                  <p className="section-title">Key Business Risks</p>
                  {data.key_risks?.map((r: string, i: number) => (
                    <div key={i} className="risk-item"><div className="risk-dot" /><span className="list-text">{r}</span></div>
                  ))}
                </div>
                <div className="panel">
                  <p className="section-title">How to Differentiate</p>
                  {data.differentiators?.map((d: string, i: number) => (
                    <div key={i} className="diff-item"><div className="diff-dot" /><span className="list-text">{d}</span></div>
                  ))}
                </div>
              </div>

              <div className="two-col">
                <div className="panel">
                  <p className="section-title">Key Competitors</p>
                  {data.top_competitors?.map((c: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#4f46e5", background: "var(--accent-bg)", border: "1px solid var(--accent-border)", padding: "2px 8px", borderRadius: 5 }}>#{i + 1}</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{c}</span>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <p className="section-title">Regulatory Checklist</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {data.regulatory?.map((r: string, i: number) => (
                      <span key={i} className="reg-chip">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
