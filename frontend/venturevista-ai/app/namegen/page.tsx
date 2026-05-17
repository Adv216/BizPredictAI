"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology","Food & Beverage","Retail","Healthcare","Finance",
  "Education","Manufacturing","Logistics","Agriculture","Tourism",
  "Real Estate","Cloud Kitchen","Digital Marketing","Fitness Studio",
  "Online Education","EV Charging Station","Solar Installation",
  "Co-working Space","Pet Care Services","AI Services",
];
const TONES = ["Professional","Playful","Bold","Minimal","Premium","Eco-friendly"];
const COLORS = ["#4f46e5","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444"];

type NameResult = { name:string; tagline:string; meaning:string; domain:string; logoIdea:string; };

export default function NameGenPage() {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [tone, setTone]         = useState("Professional");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<NameResult[]>([]);
  const [saved, setSaved]       = useState<string[]>([]);
  const [error, setError]       = useState("");

  const generate = async () => {
    if (!industry) { alert("Select an industry first."); return; }
    setLoading(true); setError(""); setResults([]);
    try {
      const res = await fetch("/api/namegen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, tone, keywords }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.names || []);
    } catch (e: any) {
      setError(e.message || "Generation failed. Make sure the backend is running.");
    } finally { setLoading(false); }
  };

  const toggleSave = (name:string) => setSaved(p=>p.includes(name)?p.filter(n=>n!==name):[...p,name]);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#7c3aed;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .layout{display:grid;grid-template-columns:280px 1fr;gap:24px;}
        .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px;}
        .panel-title{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:18px;}
        .fl{margin-bottom:13px;} .fl label{display:block;font-size:0.66rem;font-family:'DM Mono',monospace;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .fi{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.85rem;outline:none;transition:border-color 0.2s;}
        .fi:focus{border-color:#7c3aed;} .fi::placeholder{color:var(--text-placeholder);}
        .tone-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
        .tb{padding:7px;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;color:var(--text-faint);font-family:'DM Mono',monospace;font-size:0.62rem;cursor:pointer;transition:all 0.15s;text-align:center;}
        .tb.on{background:rgba(124,58,237,0.1);border-color:rgba(124,58,237,0.4);color:#7c3aed;}
        .gen-btn{width:100%;padding:13px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;margin-top:8px;}
        .gen-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,0.4);}
        .gen-btn:disabled{opacity:0.45;cursor:not-allowed;}
        .nc{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:14px;box-shadow:var(--shadow);transition:all 0.2s;position:relative;overflow:hidden;animation:si 0.4s ease both;}
        .nc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--ca);}
        @keyframes si{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .nc:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
        .nt{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
        .nb{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:#fff;flex-shrink:0;}
        .nm{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--text);line-height:1;}
        .ntag{font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--text-faint);margin-top:5px;font-style:italic;}
        .sv{background:transparent;border:1.5px solid var(--border);border-radius:8px;padding:6px 14px;font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.15s;color:var(--text-faint);}
        .sv.on{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.4);color:#22c55e;}
        .nd{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .db{background:var(--bg);border:1px solid var(--border-light);border-radius:10px;padding:12px 14px;}
        .dl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);margin-bottom:5px;}
        .dv{font-size:0.82rem;color:var(--text-muted);line-height:1.55;}
        .sc{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);color:#22c55e;font-family:'DM Mono',monospace;font-size:0.65rem;padding:4px 12px;border-radius:999px;}
        .es{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:360px;gap:14px;text-align:center;}
        .spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:#7c3aed;border-radius:50%;animation:spin 0.75s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .err{background:var(--danger-bg);border:1px solid var(--danger-border);border-radius:10px;padding:12px 16px;color:var(--danger-text);font-family:'DM Mono',monospace;font-size:0.72rem;margin-bottom:16px;}
      `}</style>

      <div className="ph">
        <h1 className="pt">Business Name Generator</h1>
        <span className="ptag">✨ AI Powered</span>
      </div>

      <div className="layout">
        <div style={{height:"fit-content"}}>
          <div className="panel">
            <p className="panel-title">Brand Parameters</p>
            <div className="fl"><label>Industry</label>
              <select className="fi" style={{cursor:"pointer"}} value={industry} onChange={e=>setIndustry(e.target.value)}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="fl"><label>City (optional)</label>
              <input className="fi" placeholder="e.g. Pune" value={location} onChange={e=>setLocation(e.target.value)}/>
            </div>
            <div className="fl"><label>Keywords (optional)</label>
              <input className="fi" placeholder="e.g. fast, fresh, local" value={keywords} onChange={e=>setKeywords(e.target.value)}/>
            </div>
            <div className="fl"><label>Brand Tone</label>
              <div className="tone-grid">{TONES.map(t=><button key={t} className={`tb ${tone===t?"on":""}`} onClick={()=>setTone(t)}>{t}</button>)}</div>
            </div>
            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading?"Generating…":"✨ Generate 5 Names"}
            </button>
          </div>
          {saved.length>0&&(
            <div className="panel">
              <p className="panel-title">Saved Names ({saved.length})</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{saved.map(n=><span key={n} className="sc">★ {n}</span>)}</div>
            </div>
          )}
        </div>

        <div>
          {error&&<div className="err">{error}</div>}
          {loading&&<div className="es"><div className="spinner"/><p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:"var(--text-faint)",letterSpacing:2}}>CRAFTING YOUR BRAND</p></div>}
          {!loading&&results.length===0&&!error&&(
            <div className="es">
              <div style={{fontSize:"3rem"}}>✨</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"var(--text-faint)"}}>AI Name Generator</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",maxWidth:240,lineHeight:1.6}}>Get 5 unique startup names with taglines, domains & logo concepts</p>
            </div>
          )}
          {!loading&&results.map((r,i)=>(
            <div key={i} className="nc" style={{["--ca" as any]:COLORS[i%COLORS.length],animationDelay:`${i*0.08}s`}}>
              <div className="nt">
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div className="nb" style={{background:COLORS[i%COLORS.length]}}>{r.name?.[0]}</div>
                  <div><p className="nm">{r.name}</p><p className="ntag">"{r.tagline}"</p></div>
                </div>
                <button className={`sv ${saved.includes(r.name)?"on":""}`} onClick={()=>toggleSave(r.name)}>
                  {saved.includes(r.name)?"★ Saved":"☆ Save"}
                </button>
              </div>
              <div className="nd">
                <div className="db"><p className="dl">Why it works</p><p className="dv">{r.meaning}</p></div>
                <div className="db"><p className="dl">Domain</p><p className="dv" style={{color:"#4f46e5",fontFamily:"'DM Mono',monospace",fontSize:"0.78rem"}}>🌐 {r.domain}</p></div>
                <div className="db" style={{gridColumn:"span 2"}}><p className="dl">Logo Concept</p><p className="dv">🎨 {r.logoIdea}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
