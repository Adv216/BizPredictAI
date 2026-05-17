"use client";

import { useState, useMemo } from "react";

const SCHEMES = [
  { name:"MUDRA Shishu",    maxLoan:50000,    rate:10.5, tenure:36,  desc:"No collateral, for micro-enterprises" },
  { name:"MUDRA Kishor",   maxLoan:500000,   rate:11.0, tenure:60,  desc:"₹50K–₹5L for expanding businesses" },
  { name:"MUDRA Tarun",    maxLoan:1000000,  rate:11.5, tenure:60,  desc:"Up to ₹10L for established MSMEs" },
  { name:"CGTMSE Loan",    maxLoan:10000000, rate:12.0, tenure:84,  desc:"Collateral-free up to ₹1Cr" },
  { name:"Startup India Seed", maxLoan:5000000, rate:9.0, tenure:60, desc:"For DPIIT-recognised startups" },
  { name:"Stand-Up India", maxLoan:10000000, rate:10.0, tenure:84,  desc:"SC/ST & Women entrepreneurs" },
  { name:"Custom Loan",    maxLoan:50000000, rate:12.0, tenure:60,  desc:"Enter your own terms below" },
];

export default function FundingPage() {
  const [loanAmt, setLoanAmt]     = useState(500000);
  const [rate, setRate]           = useState(11.0);
  const [tenure, setTenure]       = useState(60);
  const [selectedScheme, setScheme] = useState(1);
  const [investment, setInvestment] = useState(1000000);
  const [monthly_profit, setProfit] = useState(50000);

  const applyScheme = (idx: number) => {
    setScheme(idx);
    const s = SCHEMES[idx];
    setRate(s.rate);
    setTenure(s.tenure);
    if (loanAmt > s.maxLoan) setLoanAmt(s.maxLoan);
  };

  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    if (r === 0) return loanAmt / tenure;
    return Math.round(loanAmt * r * Math.pow(1+r, tenure) / (Math.pow(1+r, tenure) - 1));
  }, [loanAmt, rate, tenure]);

  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - loanAmt;
  const monthsCover = monthly_profit > 0 ? Math.round(emi / monthly_profit * 100) : 0;
  const emiRatio = monthly_profit > 0 ? Math.min(100, Math.round(emi / monthly_profit * 100)) : 0;
  const roiMonths = monthly_profit > 0 ? Math.ceil(investment / monthly_profit) : 0;

  const schedule = Array.from({length:Math.min(12, tenure)}, (_,i) => {
    const r = rate/12/100;
    let bal = loanAmt;
    for(let j=0;j<i;j++) { const int=bal*r; bal=bal-(emi-int); }
    const interest = Math.round(bal*r);
    const principal = emi-interest;
    return { month:i+1, emi, principal, interest, balance: Math.max(0,Math.round(bal-principal)) };
  });

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#10b981;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .layout{display:grid;grid-template-columns:320px 1fr;gap:24px;}
        .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px;}
        .pt2{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:18px;}
        .fl{margin-bottom:14px;}
        .fl label{display:block;font-size:0.66rem;font-family:'DM Mono',monospace;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .fi{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.85rem;outline:none;transition:border-color 0.2s;}
        .fi:focus{border-color:#10b981;}
        input[type=range]{width:100%;accent-color:#10b981;margin-top:6px;}
        .range-row{display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--text-faint);margin-top:4px;}

        /* Scheme chips */
        .scheme-list{display:flex;flex-direction:column;gap:6px;}
        .scheme-chip{padding:10px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);cursor:pointer;transition:all 0.15s;}
        .scheme-chip.on{border-color:#10b981;background:rgba(16,185,129,0.08);}
        .sc-name{font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;color:var(--text);}
        .sc-desc{font-family:'DM Mono',monospace;font-size:0.58rem;color:var(--text-faint);margin-top:2px;}
        .sc-max{font-family:'DM Mono',monospace;font-size:0.62rem;color:#10b981;margin-top:3px;}

        /* Result cards */
        .result-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px;}
        .rc{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow);}
        .rl{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);margin-bottom:8px;}
        .rv{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:#10b981;line-height:1;}
        .rs{font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--text-faint);margin-top:4px;}

        /* EMI health bar */
        .health-bar-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:18px;box-shadow:var(--shadow);}
        .bar-track{background:var(--border);height:10px;border-radius:999px;overflow:hidden;margin:10px 0;}
        .bar-fill{height:100%;border-radius:999px;transition:width 1s ease;}

        /* Schedule table */
        .table-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);}
        .th-row{display:grid;grid-template-columns:60px 1fr 1fr 1fr 1fr;background:var(--bg);border-bottom:1px solid var(--border);padding:10px 18px;}
        .th{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);}
        .td-row{display:grid;grid-template-columns:60px 1fr 1fr 1fr 1fr;padding:11px 18px;border-bottom:1px solid var(--border-light);transition:background 0.1s;}
        .td-row:last-child{border-bottom:none;}
        .td-row:hover{background:var(--bg);}
        .td{font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--text-muted);}
        .td.bold{color:#10b981;font-weight:600;}
        .td.red{color:var(--danger-text);}
      `}</style>

      <div className="ph">
        <h1 className="pt">Funding Calculator</h1>
        <span className="ptag">💰 EMI & Loan Planner</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div style={{height:"fit-content"}}>
          <div className="panel">
            <p className="pt2">Loan Parameters</p>
            <div className="fl">
              <label>Loan Amount — ₹{loanAmt.toLocaleString()}</label>
              <input type="range" min={10000} max={SCHEMES[selectedScheme].maxLoan} step={10000} value={loanAmt} onChange={e=>setLoanAmt(Number(e.target.value))}/>
              <div className="range-row"><span>₹10K</span><span>₹{(SCHEMES[selectedScheme].maxLoan/100000).toFixed(0)}L</span></div>
            </div>
            <div className="fl">
              <label>Interest Rate — {rate}% p.a.</label>
              <input type="range" min={6} max={20} step={0.5} value={rate} onChange={e=>setRate(Number(e.target.value))}/>
              <div className="range-row"><span>6%</span><span>20%</span></div>
            </div>
            <div className="fl">
              <label>Tenure — {tenure} months ({(tenure/12).toFixed(1)} yrs)</label>
              <input type="range" min={12} max={120} step={6} value={tenure} onChange={e=>setTenure(Number(e.target.value))}/>
              <div className="range-row"><span>1 yr</span><span>10 yrs</span></div>
            </div>
          </div>

          <div className="panel">
            <p className="pt2">Your Business</p>
            <div className="fl">
              <label>Total Investment (₹)</label>
              <input className="fi" type="number" value={investment} onChange={e=>setInvestment(Number(e.target.value))} placeholder="e.g. 1000000"/>
            </div>
            <div className="fl">
              <label>Expected Monthly Profit (₹)</label>
              <input className="fi" type="number" value={monthly_profit} onChange={e=>setProfit(Number(e.target.value))} placeholder="e.g. 50000"/>
            </div>
          </div>

          <div className="panel">
            <p className="pt2">Government Schemes</p>
            <div className="scheme-list">
              {SCHEMES.map((s,i)=>(
                <div key={i} className={`scheme-chip ${selectedScheme===i?"on":""}`} onClick={()=>applyScheme(i)}>
                  <p className="sc-name">{s.name}</p>
                  <p className="sc-desc">{s.desc}</p>
                  <p className="sc-max">Max ₹{(s.maxLoan/100000).toFixed(0)}L · {s.rate}% p.a.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Key metrics */}
          <div className="result-grid">
            {[
              {lbl:"Monthly EMI",val:`₹${emi.toLocaleString()}`,sub:"Per month repayment"},
              {lbl:"Total Payable",val:`₹${totalPayable.toLocaleString()}`,sub:`Over ${tenure} months`},
              {lbl:"Total Interest",val:`₹${totalInterest.toLocaleString()}`,sub:`${((totalInterest/loanAmt)*100).toFixed(1)}% of principal`},
              {lbl:"Break-even",val:`${roiMonths} mo`,sub:"Investment payback period"},
            ].map(({lbl,val,sub})=>(
              <div key={lbl} className="rc">
                <p className="rl">{lbl}</p>
                <p className="rv">{val}</p>
                <p className="rs">{sub}</p>
              </div>
            ))}
          </div>

          {/* EMI health */}
          <div className="health-bar-wrap">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:3,textTransform:"uppercase",color:"var(--text-faint)"}}>EMI vs Monthly Profit</p>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:800,color:emiRatio<40?"#22c55e":emiRatio<70?"#f59e0b":"#ef4444"}}>{emiRatio}%</p>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{width:`${emiRatio}%`,background:emiRatio<40?"#22c55e":emiRatio<70?"#f59e0b":"#ef4444"}}/>
            </div>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",color:"var(--text-faint)"}}>
              {emiRatio<40?"✅ Healthy — EMI is well within your projected income":emiRatio<70?"⚠️ Moderate — EMI uses a significant portion of profit":"🚨 High — EMI burden exceeds recommended 40% of income"}
            </p>
          </div>

          {/* Amortization schedule */}
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:3,textTransform:"uppercase",color:"var(--text-faint)",marginBottom:12}}>Amortization Schedule — First 12 Months</p>
          <div className="table-wrap">
            <div className="th-row">
              <span className="th">Month</span>
              <span className="th">EMI</span>
              <span className="th">Principal</span>
              <span className="th">Interest</span>
              <span className="th">Balance</span>
            </div>
            {schedule.map(row=>(
              <div key={row.month} className="td-row">
                <span className="td">{row.month}</span>
                <span className="td bold">₹{row.emi.toLocaleString()}</span>
                <span className="td">₹{row.principal.toLocaleString()}</span>
                <span className="td red">₹{row.interest.toLocaleString()}</span>
                <span className="td">₹{row.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
