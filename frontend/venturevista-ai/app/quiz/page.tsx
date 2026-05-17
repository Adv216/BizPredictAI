"use client";

import { useState } from "react";

const QUESTIONS = [
  { id:1, cat:"Capital", q:"How much personal savings do you have available to invest?", opts:[{t:"Less than ₹1 lakh",s:1},{t:"₹1–5 lakh",s:3},{t:"₹5–20 lakh",s:7},{t:"₹20 lakh+",s:10}] },
  { id:2, cat:"Experience", q:"How many years of work experience do you have in any industry?", opts:[{t:"Less than 1 year",s:1},{t:"1–3 years",s:4},{t:"3–7 years",s:7},{t:"7+ years",s:10}] },
  { id:3, cat:"Experience", q:"Have you worked in the industry you want to start in?", opts:[{t:"No, completely new to it",s:1},{t:"Some exposure",s:4},{t:"Yes, 2–3 years",s:7},{t:"Yes, 5+ years",s:10}] },
  { id:4, cat:"Network", q:"How strong is your professional/business network?", opts:[{t:"Very limited",s:1},{t:"A few contacts",s:4},{t:"Decent network in my city",s:7},{t:"Strong network across industries",s:10}] },
  { id:5, cat:"Risk", q:"What is your monthly household financial obligation (EMIs, rent, etc.)?", opts:[{t:"More than 80% of income",s:1},{t:"50–80% of income",s:4},{t:"30–50% of income",s:7},{t:"Less than 30% of income",s:10}] },
  { id:6, cat:"Skills", q:"How comfortable are you with digital tools and online marketing?", opts:[{t:"Not comfortable at all",s:1},{t:"Basic level",s:4},{t:"Comfortable",s:7},{t:"Very proficient",s:10}] },
  { id:7, cat:"Mindset", q:"How do you handle business failure or setbacks?", opts:[{t:"Very difficult to recover",s:1},{t:"Takes me time",s:4},{t:"Bounce back reasonably fast",s:7},{t:"See it as a learning opportunity",s:10}] },
  { id:8, cat:"Commitment", q:"How many hours per week can you dedicate to your business?", opts:[{t:"Less than 10 hours",s:1},{t:"10–25 hours",s:4},{t:"25–50 hours",s:7},{t:"50+ hours (full-time)",s:10}] },
  { id:9, cat:"Market", q:"Have you researched your target market and competition?", opts:[{t:"Not yet",s:1},{t:"Basic Google searches",s:4},{t:"Spoken to potential customers",s:7},{t:"Detailed research with data",s:10}] },
  { id:10, cat:"Support", q:"Do you have family/partner support for starting a business?", opts:[{t:"Strong opposition",s:1},{t:"Neutral / uncertain",s:4},{t:"Supportive",s:7},{t:"Fully committed support",s:10}] },
];

const CATEGORIES = ["Capital","Experience","Network","Risk","Skills","Mindset","Commitment","Market","Support"];

type Answer = { qId:number; score:number; };

export default function QuizPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState(0);
  const [done, setDone]       = useState(false);
  const [name, setName]       = useState("");
  const [started, setStarted] = useState(false);

  const answer = (q: typeof QUESTIONS[0], score: number) => {
    const updated = [...answers.filter(a=>a.qId!==q.id), {qId:q.id, score}];
    setAnswers(updated);
    if (current < QUESTIONS.length-1) {
      setTimeout(()=>setCurrent(c=>c+1), 350);
    } else {
      setTimeout(()=>setDone(true), 350);
    }
  };

  const reset = () => { setAnswers([]); setCurrent(0); setDone(false); setStarted(false); setName(""); };

  const totalScore = answers.reduce((s,a)=>s+a.score, 0);
  const maxScore   = QUESTIONS.length * 10;
  const pct        = Math.round((totalScore/maxScore)*100);

  const catScores = CATEGORIES.map(cat => {
    const qs = QUESTIONS.filter(q=>q.cat===cat);
    const ans = qs.map(q=>answers.find(a=>a.qId===q.id)?.score||0);
    const total = ans.reduce((s,v)=>s+v,0);
    const max   = qs.length * 10;
    return { cat, pct: max>0?Math.round((total/max)*100):0 };
  }).filter(c=>c.pct>0);

  const getLevel = (p:number) => p>=80?{label:"Highly Ready",color:"#22c55e",desc:"You have excellent foundations. Start planning now — your risk profile, capital, and commitment are well-aligned for entrepreneurship."}:p>=60?{label:"Moderately Ready",color:"#4f46e5",desc:"Good base, some gaps. Address your weaker areas (capital, market research, or skills) before launching. 3–6 months of preparation recommended."}:p>=40?{label:"Developing",color:"#f59e0b",desc:"Several key gaps identified. Consider a side-hustle approach first, or seek a co-founder with complementary strengths to your weaknesses."}:{label:"Early Stage",color:"#ef4444",desc:"Significant preparation needed. Focus on building capital, experience, and network before committing full-time. Consider franchise or part-time models."};

  const level = getLevel(pct);
  const progress = (current/QUESTIONS.length)*100;

  if (!started) return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"3.5rem",marginBottom:20}}>🎯</div>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:4,textTransform:"uppercase",color:"#4f46e5",marginBottom:12}}>Readiness Assessment</p>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.2rem",fontWeight:800,color:"var(--text)",letterSpacing:-1,marginBottom:14}}>Are You Ready to Start a Business?</h1>
        <p style={{fontSize:"0.9rem",color:"var(--text-muted)",lineHeight:1.7,marginBottom:32}}>Answer 10 questions across capital, experience, mindset and market knowledge. Get your personalised entrepreneurship readiness score in under 3 minutes.</p>
        <input style={{width:"100%",background:"var(--bg-card)",border:"1.5px solid var(--border)",borderRadius:12,color:"var(--text)",padding:"12px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",marginBottom:14,textAlign:"center"}} placeholder="Your name (optional)" value={name} onChange={e=>setName(e.target.value)}/>
        <button style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",border:"none",borderRadius:12,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"1rem",cursor:"pointer",transition:"all 0.2s"}} onClick={()=>setStarted(true)}>
          Start the Quiz →
        </button>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.58rem",color:"var(--text-faint)",marginTop:16,letterSpacing:1}}>10 QUESTIONS · ~3 MINUTES · INSTANT RESULTS</p>
      </div>
    </div>
  );

  if (done) return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"40px 44px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}.fadeUp{animation:fu 0.5s ease both;}@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        {/* Header result */}
        <div className="fadeUp" style={{textAlign:"center",marginBottom:36}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:4,textTransform:"uppercase",color:level.color,marginBottom:10}}>Your Result</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.8rem",fontWeight:800,color:"var(--text)",letterSpacing:-1,marginBottom:6}}>{name?`${name}, you are`:"You are"}</h1>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"2.2rem",fontWeight:800,color:level.color,marginBottom:20}}>{level.label}</h2>

          {/* Big circle */}
          <div style={{width:140,height:140,borderRadius:"50%",background:`${level.color}14`,border:`4px solid ${level.color}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"2.8rem",fontWeight:800,color:level.color,lineHeight:1}}>{pct}%</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.48rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)"}}>Readiness</span>
          </div>

          <p style={{fontSize:"0.9rem",color:"var(--text-muted)",lineHeight:1.75,maxWidth:560,margin:"0 auto 32px"}}>{level.desc}</p>
        </div>

        {/* Category breakdown */}
        <div className="fadeUp" style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:20,boxShadow:"var(--shadow)"}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:3,textTransform:"uppercase",color:"var(--text-faint)",marginBottom:20}}>Category Breakdown</p>
          {catScores.map(({cat,pct:cp},i)=>(
            <div key={cat} style={{marginBottom:14,animationDelay:`${i*0.07}s`}} className="fadeUp">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",color:"var(--text-muted)"}}>{cat}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",color:cp>=70?"#22c55e":cp>=50?"#4f46e5":"#f59e0b",fontWeight:600}}>{cp}%</span>
              </div>
              <div style={{background:"var(--border)",height:6,borderRadius:999,overflow:"hidden"}}>
                <div style={{width:`${cp}%`,height:"100%",background:cp>=70?"#22c55e":cp>=50?"#4f46e5":"#f59e0b",borderRadius:999,transition:"width 1s ease"}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="fadeUp" style={{background:"var(--accent-bg)",border:"1px solid var(--accent-border)",borderLeft:"3px solid #4f46e5",borderRadius:12,padding:20,marginBottom:24}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",letterSpacing:3,textTransform:"uppercase",color:"#4f46e5",marginBottom:10}}>Recommended Next Steps</p>
          {pct>=80&&["Head to Evaluate to run a full business feasibility analysis","Use the Market Intel page to research your target industry","Generate your 90-Day Action Plan to launch"].map((r,i)=><p key={i} style={{fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.7}}>✅ {r}</p>)}
          {pct>=60&&pct<80&&["Spend 1–2 months building your savings buffer to 6 months of expenses","Use Market Intel to deeply research your chosen sector","Find a mentor or community through local startup events"].map((r,i)=><p key={i} style={{fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.7}}>→ {r}</p>)}
          {pct<60&&["Work on building capital through part-time income for 6 months","Gain industry exposure by working in your target sector first","Consider starting a micro-business (franchise/reseller) to build experience"].map((r,i)=><p key={i} style={{fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.7}}>📌 {r}</p>)}
        </div>

        <button onClick={reset} style={{padding:"12px 28px",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:10,color:"var(--text-muted)",fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
          Retake Quiz
        </button>
      </div>
    </div>
  );

  const q = QUESTIONS[current];
  const ans = answers.find(a=>a.qId===q.id);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}.opt{width:100%;padding:14px 18px;background:var(--bg-card);border:1.5px solid var(--border);border-radius:12px;color:var(--text-muted);font-family:'DM Sans',sans-serif;font-size:0.88rem;cursor:pointer;transition:all 0.15s;text-align:left;margin-bottom:8px;}.opt:hover{border-color:#4f46e5;background:var(--accent-bg);color:var(--text);transform:translateX(4px);}.opt.sel{border-color:#22c55e;background:rgba(34,197,94,0.1);color:var(--text);}`}</style>
      <div style={{maxWidth:560,width:"100%"}}>
        {/* Progress */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",color:"var(--text-faint)",letterSpacing:2,textTransform:"uppercase"}}>{q.cat}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",color:"var(--text-faint)"}}>{current+1} / {QUESTIONS.length}</span>
          </div>
          <div style={{background:"var(--border)",height:4,borderRadius:999,overflow:"hidden"}}>
            <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#4f46e5,#22c55e)",borderRadius:999,transition:"width 0.4s ease"}}/>
          </div>
        </div>

        {/* Question */}
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:800,color:"var(--text)",letterSpacing:-0.5,marginBottom:24,lineHeight:1.3}}>{q.q}</h2>

        {/* Options */}
        {q.opts.map(opt=>(
          <button key={opt.t} className={`opt ${ans?.score===opt.s?"sel":""}`} onClick={()=>answer(q,opt.s)}>
            {opt.t}
          </button>
        ))}

        <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
          <button onClick={()=>setCurrent(c=>Math.max(0,c-1))} style={{background:"transparent",border:"1px solid var(--border)",borderRadius:8,padding:"8px 16px",color:"var(--text-faint)",fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",cursor:"pointer"}} disabled={current===0}>← Back</button>
          {answers.length===QUESTIONS.length&&<button onClick={()=>setDone(true)} style={{background:"#4f46e5",border:"none",borderRadius:8,padding:"8px 20px",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",cursor:"pointer"}}>See Results →</button>}
        </div>
      </div>
    </div>
  );
}
