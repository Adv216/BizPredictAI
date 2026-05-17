"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Technology","Food & Beverage","Retail","Healthcare","Finance",
  "Education","Manufacturing","Logistics","Agriculture","Tourism",
  "Real Estate","Cloud Kitchen","Digital Marketing","Fitness Studio",
  "Online Education","EV Charging Station","Solar Installation",
  "Co-working Space","Pet Care Services","AI Services",
];

const STAGES = ["Idea Stage","MVP Ready","Early Revenue","Growth Stage","Scaling"];
const SLIDE_ICONS = ["🔥","💡","📊","💼","💰","👥","📈","🎯"];
const SLIDE_COLORS = ["#ef4444","#4f46e5","#0ea5e9","#10b981","#22c55e","#8b5cf6","#f59e0b","#ec4899"];

type Slide = { title: string; content: string[]; speakerNote: string; };
type Pitch = { slides: Slide[]; tagline: string; elevatorPitch: string; };

export default function PitchPage() {
  const [business, setBusiness]   = useState("");
  const [industry, setIndustry]   = useState("");
  const [location, setLocation]   = useState("");
  const [investment, setInv]      = useState("");
  const [stage, setStage]         = useState("Idea Stage");
  const [problem, setProblem]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [pitch, setPitch]         = useState<Pitch|null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [error, setError]         = useState("");

  const generate = async () => {
    if (!business || !industry || !location) {
      alert("Fill business name, industry and city.");
      return;
    }
    setLoading(true); setError(""); setPitch(null);
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, industry, location, investment: Number(investment)||0, stage, problem }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPitch(data);
      setActiveSlide(0);
    } catch (e: any) {
      setError(e.message || "Failed. Make sure backend is running.");
    } finally { setLoading(false); }
  };

  const copyAll = () => {
    if (!pitch) return;
    const text = pitch.slides.map((s,i) =>
      `SLIDE ${i+1}: ${s.title}\n${s.content.map(c=>`• ${c}`).join("\n")}\n\nSpeaker Note: ${s.speakerNote}`
    ).join("\n\n---\n\n");
    navigator.clipboard.writeText(`${pitch.tagline}\n\nELEVATOR PITCH:\n${pitch.elevatorPitch}\n\n${text}`);
    alert("Full pitch copied to clipboard!");
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#ec4899;background:rgba(236,72,153,0.1);border:1px solid rgba(236,72,153,0.3);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .layout{display:grid;grid-template-columns:290px 1fr;gap:24px;}
        .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px;}
        .ptt{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:18px;}
        .fl{margin-bottom:12px;}
        .fl label{display:block;font-size:0.66rem;font-family:'DM Mono',monospace;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .fi{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.82rem;outline:none;transition:border-color 0.2s;}
        .fi:focus{border-color:#ec4899;}
        .fi::placeholder{color:var(--text-placeholder);}
        .ta{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.82rem;outline:none;resize:vertical;min-height:72px;transition:border-color 0.2s;}
        .ta:focus{border-color:#ec4899;}
        .ta::placeholder{color:var(--text-placeholder);}
        .stage-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
        .sb{padding:7px 4px;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;color:var(--text-faint);font-family:'DM Mono',monospace;font-size:0.58rem;cursor:pointer;transition:all 0.15s;text-align:center;}
        .sb.on{background:rgba(236,72,153,0.1);border-color:rgba(236,72,153,0.4);color:#ec4899;}
        .btn{width:100%;padding:13px;background:linear-gradient(135deg,#ec4899,#8b5cf6);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;margin-top:8px;}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(236,72,153,0.35);}
        .btn:disabled{opacity:0.45;cursor:not-allowed;}

        /* Elevator pitch */
        .elevator{background:linear-gradient(135deg,rgba(236,72,153,0.08),rgba(139,92,246,0.08));border:1px solid rgba(236,72,153,0.25);border-radius:16px;padding:22px;margin-bottom:20px;}
        .el-tag{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:3px;text-transform:uppercase;color:#ec4899;margin-bottom:8px;}
        .el-tagline{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:800;color:var(--text);margin-bottom:10px;}
        .el-text{font-size:0.88rem;color:var(--text-muted);line-height:1.75;}

        /* Slide nav */
        .slide-nav{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;}
        .slide-btn{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg-card);cursor:pointer;transition:all 0.15s;font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--text-faint);}
        .slide-btn.active{border-color:var(--sc);background:var(--sc-bg);color:var(--sc);}
        .slide-num{font-size:0.75rem;}

        /* Slide card */
        .slide-card{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-md);animation:fu 0.3s ease;}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .slide-header{padding:28px 32px 24px;position:relative;}
        .slide-header::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--sh-color);}
        .slide-number{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:10px;}
        .slide-icon{font-size:2.2rem;margin-bottom:10px;}
        .slide-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .slide-body{padding:0 32px 24px;}
        .slide-point{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-light);}
        .slide-point:last-child{border-bottom:none;}
        .sp-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:6px;}
        .sp-text{font-size:0.88rem;color:var(--text-muted);line-height:1.65;}
        .speaker-note{background:var(--bg);border:1px solid var(--border-light);border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;padding:14px 16px;margin:0 32px 28px;}
        .sn-lbl{font-family:'DM Mono',monospace;font-size:0.48rem;letter-spacing:3px;text-transform:uppercase;color:#f59e0b;margin-bottom:5px;}
        .sn-text{font-size:0.8rem;color:var(--text-faint);line-height:1.6;font-style:italic;}

        /* Slide arrows */
        .slide-nav-arrows{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-top:1px solid var(--border-light);}
        .arrow-btn{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 18px;font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);cursor:pointer;transition:all 0.15s;}
        .arrow-btn:hover:not(:disabled){border-color:#4f46e5;color:#4f46e5;}
        .arrow-btn:disabled{opacity:0.3;cursor:not-allowed;}
        .slide-counter{font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--text-faint);}

        .copy-btn{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:10px 20px;font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);cursor:pointer;transition:all 0.2s;width:100%;margin-top:12px;}
        .copy-btn:hover{border-color:#4f46e5;color:#4f46e5;}

        .spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:#ec4899;border-radius:50%;animation:spin 0.75s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .es{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:14px;text-align:center;}
        .err{background:var(--danger-bg);border:1px solid var(--danger-border);border-radius:10px;padding:12px 16px;color:var(--danger-text);font-family:'DM Mono',monospace;font-size:0.72rem;margin-bottom:16px;}
      `}</style>

      <div className="ph">
        <h1 className="pt">Pitch Generator</h1>
        <span className="ptag">🎯 Investor Ready</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div style={{height:"fit-content"}}>
          <div className="panel">
            <p className="ptt">Startup Details</p>
            <div className="fl"><label>Business Name *</label>
              <input className="fi" placeholder="e.g. FreshBite Cloud Kitchen" value={business} onChange={e=>setBusiness(e.target.value)}/>
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
            <div className="fl"><label>Funding Ask (₹)</label>
              <input className="fi" type="number" placeholder="e.g. 2000000" value={investment} onChange={e=>setInv(e.target.value)}/>
            </div>
            <div className="fl"><label>Startup Stage</label>
              <div className="stage-grid">
                {STAGES.map(s=><button key={s} className={`sb ${stage===s?"on":""}`} onClick={()=>setStage(s)}>{s}</button>)}
              </div>
            </div>
            <div className="fl"><label>Core Problem You Solve</label>
              <textarea className="ta" placeholder="e.g. Working professionals in Pune have no access to healthy, affordable home-style meals during lunch hours…" value={problem} onChange={e=>setProblem(e.target.value)}/>
            </div>
            <button className="btn" onClick={generate} disabled={loading}>
              {loading?"Generating pitch…":"🎯 Generate Pitch Deck"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {error&&<div className="err">{error}</div>}

          {loading&&(
            <div className="es">
              <div className="spinner"/>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:"var(--text-faint)",letterSpacing:2}}>BUILDING YOUR PITCH DECK</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:"var(--text-faint)"}}>Crafting 8 investor-ready slides…</p>
            </div>
          )}

          {!loading&&!pitch&&!error&&(
            <div className="es">
              <div style={{fontSize:"3rem"}}>🎯</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,color:"var(--text-faint)"}}>Investor Pitch Generator</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",maxWidth:280,lineHeight:1.6}}>Fill the form and get a complete 8-slide pitch deck with speaker notes — ready to present to investors</p>
            </div>
          )}

          {!loading&&pitch&&(
            <>
              {/* Elevator pitch */}
              <div className="elevator">
                <p className="el-tag">✦ Tagline</p>
                <p className="el-tagline">"{pitch.tagline}"</p>
                <p className="el-tag" style={{marginTop:12}}>30-Second Elevator Pitch</p>
                <p className="el-text">{pitch.elevatorPitch}</p>
              </div>

              {/* Slide navigation */}
              <div className="slide-nav">
                {pitch.slides.map((s,i)=>(
                  <button key={i} className={`slide-btn ${activeSlide===i?"active":""}`}
                    style={{["--sc" as any]:SLIDE_COLORS[i],["--sc-bg" as any]:`${SLIDE_COLORS[i]}18`} as any}
                    onClick={()=>setActiveSlide(i)}>
                    <span>{SLIDE_ICONS[i]}</span>
                    <span className="slide-num">{i+1}</span>
                  </button>
                ))}
              </div>

              {/* Active slide */}
              {pitch.slides[activeSlide]&&(
                <div className="slide-card" style={{["--sh-color" as any]:SLIDE_COLORS[activeSlide]} as any}>
                  <div className="slide-header" style={{["--sh-color" as any]:SLIDE_COLORS[activeSlide]} as any}>
                    <p className="slide-number">Slide {activeSlide+1} of {pitch.slides.length}</p>
                    <div className="slide-icon">{SLIDE_ICONS[activeSlide]}</div>
                    <p className="slide-title">{pitch.slides[activeSlide].title}</p>
                  </div>
                  <div className="slide-body">
                    {pitch.slides[activeSlide].content.map((point,i)=>(
                      <div key={i} className="slide-point">
                        <div className="sp-dot" style={{background:SLIDE_COLORS[activeSlide]}}/>
                        <p className="sp-text">{point}</p>
                      </div>
                    ))}
                  </div>
                  <div className="speaker-note">
                    <p className="sn-lbl">🎤 Speaker Note</p>
                    <p className="sn-text">{pitch.slides[activeSlide].speakerNote}</p>
                  </div>
                  <div className="slide-nav-arrows">
                    <button className="arrow-btn" onClick={()=>setActiveSlide(a=>a-1)} disabled={activeSlide===0}>← Previous</button>
                    <span className="slide-counter">{activeSlide+1} / {pitch.slides.length}</span>
                    <button className="arrow-btn" onClick={()=>setActiveSlide(a=>a+1)} disabled={activeSlide===pitch.slides.length-1}>Next →</button>
                  </div>
                </div>
              )}

              <button className="copy-btn" onClick={copyAll}>📋 Copy Full Pitch to Clipboard</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
