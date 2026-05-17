"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology","Food & Beverage","Retail","Healthcare","Finance",
  "Education","Manufacturing","Logistics","Agriculture","Tourism",
  "Real Estate","Cloud Kitchen","Digital Marketing","Fitness Studio",
  "Online Education","EV Charging Station","Solar Installation",
  "Co-working Space","Pet Care Services","AI Services",
];

type SWOT = { strengths:string[]; weaknesses:string[]; opportunities:string[]; threats:string[]; verdict:string; score:number; };

export default function SwotPage() {
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [investment, setInv]    = useState("");
  const [experience, setExp]    = useState("");
  const [loading, setLoading]   = useState(false);
  const [swot, setSwot]         = useState<SWOT|null>(null);
  const [error, setError]       = useState("");

  const generate = async () => {
    if (!industry || !location) { alert("Fill industry and city."); return; }
    setLoading(true); setError(""); setSwot(null);
    try {
      const res = await fetch("/api/swot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business, industry, location,
          investment: Number(investment) || 0,
          experience: Number(experience) || 0,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSwot(data);
    } catch (e: any) {
      setError(e.message || "Generation failed. Make sure the backend is running.");
    } finally { setLoading(false); }
  };

  const quadrants = swot ? [
    { key:"strengths",     label:"Strengths",     icon:"💪", color:"#22c55e", bg:"rgba(34,197,94,0.08)",  border:"rgba(34,197,94,0.22)",  items:swot.strengths },
    { key:"weaknesses",    label:"Weaknesses",    icon:"⚠️", color:"#ef4444", bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.22)",  items:swot.weaknesses },
    { key:"opportunities", label:"Opportunities", icon:"🚀", color:"#4f46e5", bg:"rgba(79,70,229,0.08)",  border:"rgba(79,70,229,0.22)",  items:swot.opportunities },
    { key:"threats",       label:"Threats",       icon:"🛡️", color:"#f59e0b", bg:"rgba(245,158,11,0.08)", border:"rgba(245,158,11,0.22)", items:swot.threats },
  ] : [];

  const scoreColor = swot ? (swot.score >= 70 ? "#22c55e" : swot.score >= 50 ? "#f59e0b" : "#ef4444") : "#4f46e5";

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#4f46e5;background:var(--accent-bg);border:1px solid var(--accent-border);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .layout{display:grid;grid-template-columns:280px 1fr;gap:24px;}
        .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px;}
        .ptt{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:18px;}
        .fl{margin-bottom:12px;}
        .fl label{display:block;font-size:0.66rem;font-family:'DM Mono',monospace;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .fi{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.85rem;outline:none;transition:border-color 0.2s;}
        .fi:focus{border-color:#4f46e5;}
        .fi::placeholder{color:var(--text-placeholder);}
        .btn{width:100%;padding:13px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;margin-top:8px;}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(79,70,229,0.4);}
        .btn:disabled{opacity:0.45;cursor:not-allowed;}
        .swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;}
        .quad{border-radius:16px;padding:22px;animation:fu 0.4s ease both;}
        @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .quad-head{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
        .quad-icon{font-size:1.2rem;}
        .quad-label{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;font-weight:600;}
        .quad-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
        .quad-item:last-child{border-bottom:none;}
        .qi-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:7px;}
        .qi-text{font-size:0.82rem;color:var(--text-muted);line-height:1.6;}
        .score-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:18px;display:flex;align-items:center;gap:24px;}
        .score-circle{width:90px;height:90px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;}
        .score-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;line-height:1;}
        .verdict-lbl{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:7px;}
        .verdict-text{font-size:0.88rem;color:var(--text-muted);line-height:1.7;}
        .spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:#4f46e5;border-radius:50%;animation:spin 0.75s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .es{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:380px;gap:14px;text-align:center;}
        .err{background:var(--danger-bg);border:1px solid var(--danger-border);border-radius:10px;padding:12px 16px;color:var(--danger-text);font-family:'DM Mono',monospace;font-size:0.72rem;margin-bottom:16px;}
      `}</style>

      <div className="ph">
        <h1 className="pt">SWOT Analysis</h1>
        <span className="ptag">🧠 AI Powered</span>
      </div>

      <div className="layout">
        <div style={{height:"fit-content"}}>
          <div className="panel">
            <p className="ptt">Business Details</p>
            <div className="fl"><label>Business Name (optional)</label>
              <input className="fi" placeholder="e.g. FreshBite Kitchen" value={business} onChange={e=>setBusiness(e.target.value)}/>
            </div>
            <div className="fl"><label>Industry *</label>
              <select className="fi" style={{cursor:"pointer"}} value={industry} onChange={e=>setIndustry(e.target.value)}>
                <option value="">Select…</option>
                {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="fl"><label>City *</label>
              <input className="fi" placeholder="e.g. Pune" value={location} onChange={e=>setLocation(e.target.value)}/>
            </div>
            <div className="fl"><label>Investment (₹)</label>
              <input className="fi" type="number" placeholder="e.g. 500000" value={investment} onChange={e=>setInv(e.target.value)}/>
            </div>
            <div className="fl"><label>Experience (years)</label>
              <input className="fi" type="number" placeholder="e.g. 3" value={experience} onChange={e=>setExp(e.target.value)}/>
            </div>
            <button className="btn" onClick={generate} disabled={loading}>
              {loading ? "Analysing…" : "🧠 Generate SWOT"}
            </button>
          </div>
        </div>

        <div>
          {error && <div className="err">{error}</div>}
          {loading && (
            <div className="es">
              <div className="spinner"/>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:"var(--text-faint)",letterSpacing:2}}>BUILDING YOUR SWOT ANALYSIS</p>
            </div>
          )}
          {!loading && !swot && !error && (
            <div className="es">
              <div style={{fontSize:"3rem"}}>🧠</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"var(--text-faint)"}}>SWOT Analysis Generator</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",maxWidth:260,lineHeight:1.6}}>Get a detailed 16-point SWOT analysis specific to your industry, city and investment</p>
            </div>
          )}
          {swot && (
            <>
              <div className="score-card">
                <div className="score-circle" style={{background:`${scoreColor}14`,border:`2px solid ${scoreColor}`}}>
                  <span className="score-num" style={{color:scoreColor}}>{swot.score}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.48rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)"}}>/100</span>
                </div>
                <div>
                  <p className="verdict-lbl">Overall Verdict</p>
                  <p className="verdict-text">{swot.verdict}</p>
                </div>
              </div>
              <div className="swot-grid">
                {quadrants.map((q,qi)=>(
                  <div key={q.key} className="quad" style={{background:q.bg,border:`1px solid ${q.border}`,animationDelay:`${qi*0.1}s`}}>
                    <div className="quad-head">
                      <span className="quad-icon">{q.icon}</span>
                      <span className="quad-label" style={{color:q.color}}>{q.label}</span>
                    </div>
                    {q.items.map((item,i)=>(
                      <div key={i} className="quad-item">
                        <div className="qi-dot" style={{background:q.color}}/>
                        <p className="qi-text">{item}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
