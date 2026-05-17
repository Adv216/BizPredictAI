"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState<"date"|"success"|"profit">("date");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then(res => (res.ok ? res.json() : { history: [] }))
      .then(data => setHistory(Array.isArray(data.history) ? data.history : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history
    .filter(h => filter === "all" || h.risk === filter)
    .filter(h => !search || h.industry?.toLowerCase().includes(search.toLowerCase()) || h.location?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "success" ? b.success - a.success : sortBy === "profit" ? b.profit - a.profit : 0);

  const riskClass = (r: string) => r === "High" ? "risk-high" : r === "Medium" ? "risk-medium" : "risk-low";
  const riskColor = (r: string) => r === "Low" ? "#22c55e" : r === "Medium" ? "#f59e0b" : "#ef4444";

  const avgSuccess = history.length ? Math.round(history.reduce((s, h) => s + h.success, 0) / history.length) : 0;
  const avgProfit  = history.length ? Math.round(history.reduce((s, h) => s + (h.profit || 0), 0) / history.length) : 0;
  const lowRisk    = history.filter(h => h.risk === "Low").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", padding: "36px 44px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .page-tag    { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4f46e5; background: var(--accent-bg); border: 1px solid var(--accent-border); padding: 4px 10px; border-radius: 4px; letter-spacing: 2px; text-transform: uppercase; }
        .count-badge { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); padding: 4px 12px; border-radius: 999px; margin-left: auto; }

        /* Summary cards */
        .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .sum-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; box-shadow: var(--shadow); }
        .sum-lbl { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 6px; }
        .sum-val { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: #4f46e5; }
        .sum-sub { font-family: 'DM Mono', monospace; font-size: 0.58rem; color: var(--text-faint); margin-top: 3px; }

        /* Controls */
        .controls { display: flex; gap: 10px; margin-bottom: 18px; align-items: center; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 200px; background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text); padding: 9px 14px; font-family: 'DM Mono', monospace; font-size: 0.8rem; outline: none; transition: border-color 0.2s; }
        .search-box:focus { border-color: #4f46e5; }
        .search-box::placeholder { color: var(--text-placeholder); }
        .f-btn { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 1px; text-transform: uppercase; padding: 8px 14px; border-radius: 8px; border: 1.5px solid var(--border); background: transparent; color: var(--text-faint); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .f-btn.active { border-color: #4f46e5; background: var(--accent-bg); color: #4f46e5; }
        .sort-select { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 10px; color: var(--text-muted); padding: 8px 12px; font-family: 'DM Mono', monospace; font-size: 0.7rem; outline: none; cursor: pointer; }

        /* Table */
        .table-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); }
        .table-head { display: grid; grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 1fr 80px; gap: 0; background: var(--bg); border-bottom: 1px solid var(--border); padding: 10px 20px; }
        .th { font-family: 'DM Mono', monospace; font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); }

        .row { display: grid; grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 1fr 80px; gap: 0; padding: 14px 20px; border-bottom: 1px solid var(--border-light); align-items: center; cursor: pointer; transition: background 0.15s; }
        .row:last-child { border-bottom: none; }
        .row:hover { background: var(--bg); }

        .industry-name { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: var(--text); }
        .industry-sub  { font-family: 'DM Mono', monospace; font-size: 0.58rem; color: var(--text-faint); margin-top: 2px; }
        .td { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-muted); }
        .td-bold { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 800; color: #4f46e5; }

        .risk-badge { font-family: 'DM Mono', monospace; font-size: 0.58rem; padding: 3px 9px; border-radius: 999px; }
        .risk-high   { background: var(--danger-bg);  color: var(--danger-text);  border: 1px solid var(--danger-border); }
        .risk-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
        .risk-low    { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }

        .expand-icon { color: var(--text-faint); transition: transform 0.2s; font-size: 0.8rem; text-align: right; }
        .expand-icon.open { transform: rotate(180deg); }

        /* Expanded row */
        .expanded-row { padding: 16px 20px; background: var(--bg); border-bottom: 1px solid var(--border-light); animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .exp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }
        .exp-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }
        .exp-lbl { font-family: 'DM Mono', monospace; font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }
        .exp-val { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }
        .advice-box { background: var(--accent-bg); border: 1px solid var(--accent-border); border-left: 3px solid #4f46e5; border-radius: 8px; padding: 12px 14px; }
        .advice-lbl { font-family: 'DM Mono', monospace; font-size: 0.48rem; letter-spacing: 3px; color: #4f46e5; text-transform: uppercase; margin-bottom: 5px; }
        .advice-text { font-size: 0.8rem; color: var(--text-muted); line-height: 1.6; }

        .empty { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 14px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text-faint); margin-bottom: 6px; }
        .empty-sub { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--text-faint); letter-spacing: 2px; text-transform: uppercase; }

        .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; margin: 60px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Prediction History</h1>
        <span className="page-tag">Records</span>
        <span className="count-badge">{history.length} entries</span>
      </div>

      {/* Summary */}
      {history.length > 0 && (
        <div className="summary-row">
          <div className="sum-card">
            <p className="sum-lbl">Total Predictions</p>
            <p className="sum-val">{history.length}</p>
            <p className="sum-sub">All time</p>
          </div>
          <div className="sum-card">
            <p className="sum-lbl">Avg Success Rate</p>
            <p className="sum-val">{avgSuccess}%</p>
            <p className="sum-sub">Across all evaluations</p>
          </div>
          <div className="sum-card">
            <p className="sum-lbl">Avg Annual Profit</p>
            <p className="sum-val">₹{avgProfit.toLocaleString()}</p>
            <p className="sum-sub">Projected</p>
          </div>
          <div className="sum-card">
            <p className="sum-lbl">Low Risk Ideas</p>
            <p className="sum-val" style={{ color: "#22c55e" }}>{lowRisk}</p>
            <p className="sum-sub">Ready to launch</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <input className="search-box" placeholder="Search by industry or city…" value={search} onChange={e => setSearch(e.target.value)} />
        {["all","Low","Medium","High"].map(f => (
          <button key={f} className={`f-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : `${f} Risk`}
          </button>
        ))}
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
          <option value="date">Sort: Date</option>
          <option value="success">Sort: Success %</option>
          <option value="profit">Sort: Profit</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">No predictions found</p>
            <p className="empty-sub">{history.length === 0 ? "Run your first evaluation to see history" : "Try adjusting the search or filters"}</p>
          </div>
        ) : (
          <>
            <div className="table-head">
              <span className="th">Business</span>
              <span className="th">Location</span>
              <span className="th">Success</span>
              <span className="th">Profit</span>
              <span className="th">ROI</span>
              <span className="th">Risk</span>
              <span className="th" style={{ textAlign: "right" }}>Details</span>
            </div>
            {filtered.map((h: any, i: number) => (
              <div key={i}>
                <div className="row" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div>
                    <p className="industry-name">{h.industry}</p>
                    <p className="industry-sub">{h.business_type} · {h.risk_appetite}</p>
                  </div>
                  <span className="td">{h.location}</span>
                  <span className="td-bold">{h.success}%</span>
                  <span className="td">₹{h.profit?.toLocaleString()}</span>
                  <span className="td">{h.roi_percent}%</span>
                  <span className={`risk-badge ${riskClass(h.risk)}`}>{h.risk}</span>
                  <span className={`expand-icon ${expanded === i ? "open" : ""}`}>▾</span>
                </div>
                {expanded === i && (
                  <div className="expanded-row">
                    <div className="exp-grid">
                      {[
                        { lbl: "Investment", val: `₹${h.investment?.toLocaleString()}` },
                        { lbl: "Break-even", val: `${h.break_even_months} months` },
                        { lbl: "Working Capital", val: `₹${h.working_capital?.toLocaleString()}/mo` },
                        { lbl: "Experience", val: `${h.experience} years` },
                        { lbl: "City Tier", val: `Tier ${h.city_tier}` },
                        { lbl: "Labor", val: h.labor_availability },
                        { lbl: "Rent Estimate", val: `₹${h.rent_estimate?.toLocaleString()}/mo` },
                        { lbl: "Model", val: h.online_offline },
                      ].map(({ lbl, val }) => (
                        <div key={lbl} className="exp-box">
                          <p className="exp-lbl">{lbl}</p>
                          <p className="exp-val">{val}</p>
                        </div>
                      ))}
                    </div>
                    {h.advice && (
                      <div className="advice-box">
                        <p className="advice-lbl">AI Advice</p>
                        <p className="advice-text">{h.advice}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
