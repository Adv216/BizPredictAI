"use client";

import { useState } from "react";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend
);

const INDUSTRIES = [
  "Technology", "Food & Beverage", "Retail", "Healthcare", "Finance",
  "Education", "Manufacturing", "Logistics", "Agriculture", "Tourism",
  "Real Estate", "Cloud Kitchen", "Digital Marketing", "Fitness Studio",
  "Online Education", "EV Charging Station", "Solar Installation",
  "Co-working Space", "Pet Care Services", "AI Services",
];

export default function EvaluatePage() {
  const [location, setLocation]         = useState("");
  const [investment, setInvestment]     = useState("");
  const [industry, setIndustry]         = useState("");
  const [experience, setExperience]     = useState("");
  const [businessType, setBusinessType] = useState("service");
  const [riskAppetite, setRiskAppetite] = useState("moderate");
  const [onlineOffline, setOnlineOffline] = useState("offline");
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState<any>(null);
  const [tab, setTab]                   = useState<"overview"|"financial"|"city"|"funding">("overview");

  const runPrediction = async () => {
    if (!location || !investment || !industry || !experience) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location, industry,
          investment: Number(investment),
          experience: Number(experience),
          businessType,
          expectedCustomers: 100,
          riskAppetite,
          onlineOffline,
        }),
      });
      const data = await res.json();
      setResult(data);
      setTab("overview");
    } catch (err) {
      alert("Could not connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const successColor = result
    ? result.success >= 74 ? "#22c55e" : result.success >= 54 ? "#f59e0b" : "#ef4444"
    : "#4f46e5";

  const gaugeData = result && {
    labels: ["Success", "Remaining"],
    datasets: [{
      data: [result.success, 100 - result.success],
      backgroundColor: [successColor, "rgba(255,255,255,0.06)"],
      borderWidth: 0,
    }],
  };

  const cityComparison = result && {
    labels: ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad"],
    datasets: [{
      label: "Success %",
      data: [result.success, result.success - 5, result.success + 7, result.success - 10, result.success + 3],
      backgroundColor: ["#4f46e5","#6366f1","#818cf8","#a5b4fc","#c7d2fe"],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const radarData = result?.scorecard && {
    labels: ["Market Potential", "Profit Outlook", "City Readiness", "Founder Fit", "Low Competition", "Financial Safety"],
    datasets: [{
      label: "Scorecard",
      data: [
        result.scorecard.market_potential,
        result.scorecard.profit_outlook,
        result.scorecard.city_readiness,
        result.scorecard.founder_fit,
        100 - result.scorecard.competition_risk,
        100 - result.scorecard.financial_risk,
      ],
      backgroundColor: "rgba(79,70,229,0.15)",
      borderColor: "#4f46e5",
      pointBackgroundColor: "#4f46e5",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      borderWidth: 2,
    }],
  };

  const profitChart = result && {
    labels: ["M3", "M6", "M9", "M12", "M18", "M24"],
    datasets: [{
      label: "Cumulative Profit (₹)",
      data: [
        Math.round(result.monthly_profit * 2.5),
        Math.round(result.monthly_profit * 5.5),
        Math.round(result.monthly_profit * 8.5),
        Math.round(result.monthly_profit * 11),
        Math.round(result.monthly_profit * 16),
        Math.round(result.monthly_profit * 21),
      ],
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79,70,229,0.08)",
      tension: 0.4, fill: true,
      pointBackgroundColor: "#4f46e5",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  };

  const chartOpts: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "'DM Mono', monospace", size: 10 } } },
      tooltip: { backgroundColor: "#1e1e3f", titleColor: "#f1f5f9", bodyColor: "#94a3b8", borderColor: "rgba(79,70,229,0.3)", borderWidth: 1, padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { ticks: { color: "#64748b", font: { family: "'DM Mono', monospace", size: 9 } }, grid: { color: "rgba(255,255,255,0.04)" } },
      y: { ticks: { color: "#64748b", font: { family: "'DM Mono', monospace", size: 9 } }, grid: { color: "rgba(255,255,255,0.04)" } },
    },
  };

  const radarOpts: any = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, grid: { color: "rgba(79,70,229,0.15)" }, angleLines: { color: "rgba(79,70,229,0.15)" }, pointLabels: { color: "#94a3b8", font: { family: "'DM Mono', monospace", size: 9 } } } },
    plugins: { legend: { display: false } },
  };

  const riskClass = (r: string) => r === "High" ? "risk-high" : r === "Medium" ? "risk-medium" : "risk-low";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }

        .layout { display: grid; grid-template-columns: 320px 1fr; gap: 22px; }

        .panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 26px; margin-bottom: 18px; box-shadow: var(--shadow); }
        .panel-title { font-family: 'DM Mono', monospace; font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 20px; }

        .field-group  { margin-bottom: 13px; }
        .field-label  { display: block; font-size: 0.68rem; font-family: 'DM Mono', monospace; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .field-input  { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .field-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        .field-input::placeholder { color: var(--text-placeholder); }
        .field-select { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 10px 13px; font-family: 'DM Mono', monospace; font-size: 0.85rem; outline: none; cursor: pointer; }
        .field-select:focus { border-color: #4f46e5; }

        .seg { display: flex; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
        .seg-btn { flex: 1; padding: 9px 4px; background: transparent; border: none; font-family: 'DM Mono', monospace; font-size: 0.66rem; letter-spacing: 0.5px; color: var(--text-faint); cursor: pointer; transition: all 0.15s; text-align: center; }
        .seg-btn.active { background: #4f46e5; color: #fff; }
        .seg-btn:not(:last-child) { border-right: 1.5px solid var(--border); }

        .run-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; letter-spacing: 0.3px; }
        .run-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(79,70,229,0.4); }
        .run-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .tabs { display: flex; gap: 6px; margin-bottom: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 5px; }
        .tab-btn { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 18px; border-radius: 8px; border: none; background: transparent; color: var(--text-faint); cursor: pointer; transition: all 0.15s; flex: 1; }
        .tab-btn.active { background: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,0.35); }

        .metric-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--border-light); }
        .metric-row:last-child { border-bottom: none; }
        .metric-lbl { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--text-faint); letter-spacing: 1px; text-transform: uppercase; }
        .metric-val { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: #4f46e5; }
        .metric-val-sm { font-family: 'DM Mono', monospace; font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }

        .prog-track { background: var(--border); height: 6px; border-radius: 999px; overflow: hidden; margin-top: 8px; }
        .prog-fill  { height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

        .risk-badge  { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 4px 12px; border-radius: 999px; letter-spacing: 1px; font-weight: 600; }
        .risk-high   { background: var(--danger-bg);  color: var(--danger-text);  border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low    { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        .advice-box  { background: var(--accent-bg); border: 1px solid var(--accent-border); border-left: 3px solid #4f46e5; border-radius: 10px; padding: 14px 16px; margin-top: 14px; }
        .advice-lbl  { font-family: 'DM Mono', monospace; font-size: 0.5rem; letter-spacing: 3px; color: #4f46e5; text-transform: uppercase; margin-bottom: 7px; }
        .advice-text { font-size: 0.82rem; color: var(--text-muted); line-height: 1.7; }

        /* CHARTS */
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }

        /* Doughnut card — fixed centering */
        .doughnut-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 18px; box-shadow: var(--shadow); position: relative; }
        .chart-lbl { font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; }
        .doughnut-wrap { position: relative; height: 200px; display: flex; align-items: center; justify-content: center; }
        .doughnut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; z-index: 10; }
        .doughnut-pct { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 800; line-height: 1; }
        .doughnut-sub { font-family: 'DM Mono', monospace; font-size: 0.5rem; color: var(--text-faint); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

        .chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 18px; box-shadow: var(--shadow); }

        /* Scorecard */
        .sc-row { margin-bottom: 12px; }
        .sc-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .sc-key  { font-family: 'DM Mono', monospace; font-size: 0.63rem; color: var(--text-muted); text-transform: capitalize; letter-spacing: 0.5px; }
        .sc-val  { font-family: 'DM Mono', monospace; font-size: 0.63rem; color: #4f46e5; font-weight: 600; }
        .sc-track { background: var(--border); height: 5px; border-radius: 999px; overflow: hidden; }
        .sc-fill  { height: 100%; border-radius: 999px; transition: width 1s ease; }

        /* Infra */
        .infra-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .infra-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
        .infra-lbl  { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 5px; }
        .infra-val  { font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 700; }

        /* Scheme */
        .scheme-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 14px; transition: border-color 0.2s; }
        .scheme-card:hover { border-color: var(--accent-border); }
        .scheme-badge { font-family: 'DM Mono', monospace; font-size: 0.6rem; background: var(--accent-bg); border: 1px solid var(--accent-border); color: #4f46e5; padding: 3px 8px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; }
        .scheme-name  { font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 600; color: var(--text); margin-bottom: 3px; }
        .scheme-note  { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-faint); line-height: 1.5; }

        /* Quick result stat boxes */
        .stat-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .stat-mini { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
        .stat-mini-lbl { font-family: 'DM Mono', monospace; font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }
        .stat-mini-val { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 800; color: #4f46e5; }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Evaluate Business</h1>
        <span className="page-tag">AI Prediction</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div>
          <div className="panel">
            <p className="panel-title">Business Parameters</p>

            <div className="field-group">
              <label className="field-label">City / Location</label>
              <input className="field-input" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Industry</label>
              <select className="field-select" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Investment (₹)</label>
              <input className="field-input" type="number" placeholder="e.g. 500000" value={investment} onChange={e => setInvestment(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Experience (Years)</label>
              <input className="field-input" type="number" placeholder="e.g. 3" value={experience} onChange={e => setExperience(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Business Type</label>
              <div className="seg">
                {["service","product","franchise"].map(v => (
                  <button key={v} className={`seg-btn ${businessType === v ? "active" : ""}`} onClick={() => setBusinessType(v)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Risk Appetite</label>
              <div className="seg">
                {["conservative","moderate","aggressive"].map(v => (
                  <button key={v} className={`seg-btn ${riskAppetite === v ? "active" : ""}`} onClick={() => setRiskAppetite(v)}>{v.slice(0,4)}</button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Model</label>
              <div className="seg">
                {["offline","online","hybrid"].map(v => (
                  <button key={v} className={`seg-btn ${onlineOffline === v ? "active" : ""}`} onClick={() => setOnlineOffline(v)}>{v}</button>
                ))}
              </div>
            </div>

            <button className="run-btn" onClick={runPrediction} disabled={loading}>
              {loading ? "⏳ Analyzing…" : "Run AI Prediction →"}
            </button>
          </div>

          {result && (
            <div className="panel">
              <p className="panel-title">Quick Results</p>

              {/* Big success number */}
              <div style={{ textAlign: "center", padding: "16px 0 20px", borderBottom: "1px solid var(--border-light)", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.2rem", fontWeight: 800, color: successColor, lineHeight: 1 }}>
                  {result.success}%
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)", marginTop: 6 }}>
                  Success Probability
                </div>
                <div style={{ margin: "12px auto 0", maxWidth: 180 }}>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${result.success}%`, background: successColor }} />
                  </div>
                </div>
              </div>

              <div className="stat-mini-grid">
                {[
                  { lbl: "Annual Profit", val: `₹${result.profit?.toLocaleString()}` },
                  { lbl: "ROI", val: `${result.roi_percent}%` },
                  { lbl: "Break-even", val: `${result.break_even_months} mo` },
                  { lbl: "City Tier", val: `Tier ${result.city_tier}` },
                ].map(({ lbl, val }) => (
                  <div key={lbl} className="stat-mini">
                    <p className="stat-mini-lbl">{lbl}</p>
                    <p className="stat-mini-val">{val}</p>
                  </div>
                ))}
              </div>

              <div className="metric-row">
                <span className="metric-lbl">Risk Level</span>
                <span className={`risk-badge ${riskClass(result.risk)}`}>{result.risk} Risk</span>
              </div>
              <div className="metric-row">
                <span className="metric-lbl">Location</span>
                <span className="metric-val-sm">{result.city_state}</span>
              </div>

              <div className="advice-box">
                <p className="advice-lbl">AI Advice</p>
                <p className="advice-text">{result.advice}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        {result && (
          <div>
            <div className="tabs">
              {(["overview","financial","city","funding"] as const).map(t => (
                <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <>
                <div className="charts-grid">
                  {/* FIXED DOUGHNUT */}
                  <div className="doughnut-card">
                    <p className="chart-lbl">Success Meter</p>
                    <div className="doughnut-wrap">
                      <Doughnut
                        data={gaugeData}
                        options={{
                          cutout: "75%",
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                          },
                        }}
                      />
                      <div className="doughnut-center">
                        <div className="doughnut-pct" style={{ color: successColor }}>{result.success}%</div>
                        <div className="doughnut-sub">success</div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <p className="chart-lbl">City Comparison</p>
                    <div style={{ height: 200 }}><Bar data={cityComparison} options={chartOpts} /></div>
                  </div>
                </div>

                <div className="panel">
                  <p className="panel-title">Startup Feasibility Scorecard</p>
                  {result.scorecard && Object.entries(result.scorecard as Record<string,number>).map(([key, value]) => (
                    <div className="sc-row" key={key}>
                      <div className="sc-meta">
                        <span className="sc-key">{key.replace(/_/g," ")}</span>
                        <span className="sc-val">{value}%</span>
                      </div>
                      <div className="sc-track">
                        <div className="sc-fill" style={{ width: `${value}%`, background: value > 70 ? "#22c55e" : value > 50 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="chart-card">
                  <p className="chart-lbl">Feasibility Radar</p>
                  <div style={{ height: 280 }}>
                    {radarData && <Radar data={radarData} options={radarOpts} />}
                  </div>
                </div>
              </>
            )}

            {/* FINANCIAL */}
            {tab === "financial" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
                  {[
                    { lbl: "Annual Profit", val: `₹${result.profit?.toLocaleString()}` },
                    { lbl: "Monthly Profit", val: `₹${result.monthly_profit?.toLocaleString()}` },
                    { lbl: "ROI", val: `${result.roi_percent}%` },
                    { lbl: "Break-even", val: `${result.break_even_months} mo` },
                    { lbl: "Working Capital / mo", val: `₹${result.working_capital?.toLocaleString()}` },
                    { lbl: "Rent Estimate / mo", val: `₹${result.rent_estimate?.toLocaleString()}` },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} className="chart-card">
                      <p className="chart-lbl">{lbl}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: "#4f46e5", marginTop: 8 }}>{val}</p>
                    </div>
                  ))}
                </div>

                <div className="chart-card" style={{ marginBottom: 18 }}>
                  <p className="chart-lbl">Profit Projection — 24 months</p>
                  <div style={{ height: 240 }}><Line data={profitChart} options={chartOpts} /></div>
                </div>

                <div className="panel">
                  <p className="panel-title">Labor & Wage Estimates</p>
                  {[
                    { lbl: "Unskilled Labor / month", val: `₹${result.avg_wage_unskilled?.toLocaleString()}` },
                    { lbl: "Skilled Labor / month", val: `₹${result.avg_wage_skilled?.toLocaleString()}` },
                    { lbl: "Labor Availability", val: result.labor_availability },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} className="metric-row">
                      <span className="metric-lbl">{lbl}</span>
                      <span className="metric-val-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CITY */}
            {tab === "city" && (
              <>
                <div className="panel" style={{ marginBottom: 16 }}>
                  <p className="panel-title">City Overview</p>
                  {[
                    { lbl: "Tier", val: `Tier ${result.city_tier} — ${result.city_state}` },
                    { lbl: "Population", val: result.population?.toLocaleString() },
                    { lbl: "Literacy Rate", val: `${result.literacy_rate}%` },
                    { lbl: "Languages", val: result.languages?.join(", ") },
                    { lbl: "Startup Density", val: result.startup_density || "Moderate" },
                    { lbl: "VC Presence", val: result.vc_presence || "Low" },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} className="metric-row">
                      <span className="metric-lbl">{lbl}</span>
                      <span className="metric-val-sm">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="panel" style={{ marginBottom: 16 }}>
                  <p className="panel-title">Infrastructure Quality</p>
                  <div className="infra-grid">
                    {[
                      { lbl: "Internet", val: result.internet },
                      { lbl: "Roads", val: result.roads },
                      { lbl: "Power Supply", val: result.power },
                      { lbl: "Market Access", val: result.market_access },
                      { lbl: "Supplier Base", val: result.suppliers },
                      { lbl: "Labor", val: result.labor_availability },
                    ].map(({ lbl, val }) => (
                      <div key={lbl} className="infra-card">
                        <p className="infra-lbl">{lbl}</p>
                        <p className="infra-val" style={{ color: val === "Excellent" || val === "Stable" || val === "High" ? "#22c55e" : val === "Good" || val === "Mostly Stable" || val === "Moderate" ? "#f59e0b" : "#ef4444" }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <p className="panel-title">Cost Benchmarks</p>
                  {[
                    { lbl: "Commercial Rent (est.)", val: `₹${result.rent_estimate?.toLocaleString()} / month` },
                    { lbl: "Unskilled Wage", val: `₹${result.avg_wage_unskilled?.toLocaleString()} / month` },
                    { lbl: "Skilled Wage", val: `₹${result.avg_wage_skilled?.toLocaleString()} / month` },
                    { lbl: "Working Capital Needed", val: `₹${result.working_capital?.toLocaleString()} / month` },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} className="metric-row">
                      <span className="metric-lbl">{lbl}</span>
                      <span className="metric-val-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FUNDING */}
            {tab === "funding" && (
              <div className="panel">
                <p className="panel-title">Eligible Funding Schemes</p>
                {result.eligible_schemes?.length === 0 && (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--text-faint)", textAlign: "center", padding: "32px 0" }}>
                    No specific schemes matched. Consider MSME registration for access to credit guarantee schemes.
                  </p>
                )}
                {result.eligible_schemes?.map((s: any, i: number) => (
                  <div key={i} className="scheme-card">
                    <span className="scheme-badge">₹{(s.max / 100000).toFixed(0)}L</span>
                    <div>
                      <p className="scheme-name">{s.name}</p>
                      <p className="scheme-note">{s.note}</p>
                    </div>
                  </div>
                ))}
                <div className="advice-box" style={{ marginTop: 16 }}>
                  <p className="advice-lbl">Tip</p>
                  <p className="advice-text">
                    Register your business as an MSME on the Udyam portal to unlock subsidies, priority lending, and government scheme eligibility.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
