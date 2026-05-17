"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology", "Food & Beverage", "Retail", "Healthcare", "Finance",
  "Education", "Manufacturing", "Logistics", "Agriculture", "Tourism",
  "Real Estate", "Cloud Kitchen", "Digital Marketing", "Fitness Studio",
  "Online Education", "EV Charging Station", "Solar Installation",
  "Co-working Space", "Pet Care Services", "AI Services",
];

export default function PlanPage() {
  const [industry, setIndustry]     = useState("");
  const [location, setLocation]     = useState("");
  const [investment, setInvestment] = useState("");
  const [plan, setPlan]             = useState<any>(null);
  const [loading, setLoading]       = useState(false);
  const [checked, setChecked]       = useState<Set<string>>(new Set());

  const generate = async () => {
    if (!industry || !location || !investment) { alert("Fill all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, investment: Number(investment) }),
      });
      setPlan(await res.json());
      setChecked(new Set());
    } catch { alert("Could not connect to backend."); }
    finally { setLoading(false); }
  };

  const toggleCheck = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalTasks = plan ? (plan.days_1_30.length + plan.days_31_60.length + plan.days_61_90.length) : 0;
  const doneTasks  = checked.size;
  const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const Phase = ({ label, color, tasks, prefix }: { label: string; color: string; tasks: string[]; prefix: string }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "var(--shadow)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: 3, textTransform: "uppercase", color: "var(--text-faint)" }}>{label}</p>
        <span style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color, background: `${color}18`, border: `1px solid ${color}44`, padding: "2px 10px", borderRadius: 999 }}>
          {tasks.filter((_, i) => checked.has(`${prefix}-${i}`)).length}/{tasks.length} done
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tasks.map((task, i) => {
          const key  = `${prefix}-${i}`;
          const done = checked.has(key);
          return (
            <div key={key} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s", background: done ? `${color}10` : "var(--bg)", border: `1px solid ${done ? color + "33" : "var(--border-light)"}`, opacity: done ? 0.75 : 1 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${done ? color : "var(--border)"}`, background: done ? color : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {done && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
              </div>
              <p style={{ fontSize: "0.82rem", color: done ? "var(--text-faint)" : "var(--text-muted)", lineHeight: 1.55, textDecoration: done ? "line-through" : "none", transition: "all 0.15s" }}>{task}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

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
        .run-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); }
        .run-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .prog-track { background: var(--border); height: 8px; border-radius: 999px; overflow: hidden; }
        .prog-fill  { height: 100%; background: linear-gradient(90deg,#4f46e5,#22c55e); border-radius: 999px; transition: width 0.6s ease; }
        .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; gap: 14px; text-align: center; }
        .empty-icon  { width: 60px; height: 60px; border-radius: 50%; background: var(--accent-bg); border: 1.5px solid var(--accent-border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text-faint); }
        .empty-sub   { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-faint); max-width: 220px; line-height: 1.6; }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">90-Day Action Plan</h1>
        <span className="page-tag">Launch Checklist</span>
      </div>

      <div className="layout">
        <div style={{ height: "fit-content" }}>
          <div className="panel">
            <p className="panel-title">Your Business</p>
            <div className="field-group">
              <label className="field-label">Industry</label>
              <select className="field-select" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">Select…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">City / Location</label>
              <input className="field-input" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Investment (₹)</label>
              <input className="field-input" type="number" placeholder="e.g. 500000" value={investment} onChange={e => setInvestment(e.target.value)} />
            </div>
            <button className="run-btn" onClick={generate} disabled={loading}>
              {loading ? "Building plan…" : "Generate 90-Day Plan →"}
            </button>
          </div>

          {plan && (
            <>
              <div className="panel">
                <p className="panel-title">Overall Progress</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#4f46e5" }}>{progress}%</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "var(--text-faint)" }}>{doneTasks}/{totalTasks} tasks</span>
                </div>
                <div className="prog-track"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
              </div>

              <div className="panel">
                <p className="panel-title">Key Milestones</p>
                {[
                  { lbl: "Day 30 Target", val: plan.key_milestone_30 },
                  { lbl: "Day 60 Target", val: plan.key_milestone_60 },
                  { lbl: "Day 90 Target", val: plan.key_milestone_90 },
                ].map(({ lbl, val }) => (
                  <div key={lbl} style={{ padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 5 }}>{lbl}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{val}</p>
                  </div>
                ))}
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", padding: "3px 10px", borderRadius: 999, background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "#4f46e5" }}>Season: {plan.peak_season}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", padding: "3px 10px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>Competition: {plan.competition_level}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          {loading && (
            <div className="empty-state">
              <div className="spinner" />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: 2 }}>BUILDING YOUR PLAN</p>
            </div>
          )}
          {!loading && !plan && (
            <div className="empty-state">
              <div className="empty-icon">🗓</div>
              <p className="empty-title">Generate your launch plan</p>
              <p className="empty-sub">Get a personalised, clickable 90-day checklist tailored to your industry and city</p>
            </div>
          )}
          {!loading && plan && (
            <>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "var(--shadow)" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--text)" }}>{plan.industry} in {plan.location}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--text-faint)", marginTop: 3 }}>Investment: ₹{Number(plan.investment).toLocaleString()} · Click tasks to mark done</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: progress === 100 ? "#22c55e" : "#4f46e5" }}>{progress}%</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "var(--text-faint)" }}>COMPLETE</p>
                </div>
              </div>
              <Phase label="Phase 1 — Days 1–30: Foundation" color="#4f46e5" tasks={plan.days_1_30} prefix="p1" />
              <Phase label="Phase 2 — Days 31–60: Traction"  color="#f59e0b" tasks={plan.days_31_60} prefix="p2" />
              <Phase label="Phase 3 — Days 61–90: Scale"     color="#22c55e" tasks={plan.days_61_90} prefix="p3" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
