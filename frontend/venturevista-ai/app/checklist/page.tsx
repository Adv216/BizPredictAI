"use client";

import { useState } from "react";

const BUSINESS_TYPES = [
  "Cloud Kitchen / Food Business",
  "Retail Shop / Kirana Store",
  "Tech Startup / Software Company",
  "Healthcare / Clinic / Diagnostic Lab",
  "Manufacturing Unit",
  "E-commerce Business",
  "Educational Institute / Coaching",
  "Fitness Studio / Gym",
  "Restaurant / Cafe",
  "Logistics / Transport Company",
  "Real Estate Agency",
  "Digital Marketing Agency",
  "General Service Business",
];

type ChecklistItem = {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  timeline: string;
  cost: string;
  link: string;
  category: string;
};

const CHECKLISTS: Record<string, ChecklistItem[]> = {
  "Cloud Kitchen / Food Business": [
    { id:"fssai",    name:"FSSAI License",                 description:"Food Safety and Standards Authority of India license — mandatory for all food businesses. Apply for Basic, State or Central based on turnover.",  mandatory:true,  timeline:"7–30 days",  cost:"₹100–₹7,500/year",    link:"https://foscos.fssai.gov.in",        category:"Food & Safety" },
    { id:"gst",      name:"GST Registration",              description:"Goods & Services Tax registration. Mandatory if annual turnover exceeds ₹20 lakh (₹10L for special states).",                                      mandatory:true,  timeline:"3–7 days",   cost:"Free",                link:"https://www.gst.gov.in",             category:"Tax" },
    { id:"msme",     name:"MSME Udyam Registration",       description:"Register as a Micro/Small/Medium enterprise on Udyam portal. Unlocks priority lending, subsidies and government scheme benefits.",                   mandatory:false, timeline:"Same day",   cost:"Free",                link:"https://udyamregistration.gov.in",   category:"Business" },
    { id:"shop",     name:"Shop & Establishment Act",      description:"Register your commercial premises under local municipal authority. Required for all shops, restaurants and commercial kitchens.",                       mandatory:true,  timeline:"1–7 days",   cost:"₹200–₹2,000",        link:"https://labour.gov.in",              category:"Local" },
    { id:"fire",     name:"Fire NOC",                      description:"No Objection Certificate from local fire department. Mandatory for all food businesses with gas connections and cooking equipment.",                  mandatory:true,  timeline:"15–30 days", cost:"₹500–₹2,000",        link:"https://ndma.gov.in",               category:"Safety" },
    { id:"health",   name:"Health Trade License",          description:"Issued by local municipal corporation. Required for all food businesses, restaurants and cloud kitchens.",                                            mandatory:true,  timeline:"7–14 days",  cost:"₹500–₹5,000",        link:"https://mcgm.gov.in",               category:"Local" },
    { id:"eating",   name:"Eating House License",          description:"Required if serving food on premises. Issued by local police commissioner's office in most states.",                                                  mandatory:true,  timeline:"15–30 days", cost:"₹500–₹1,000",        link:"https://municipalservices.gov.in",  category:"Local" },
    { id:"pan",      name:"Business PAN Card",             description:"Permanent Account Number for your business entity. Required for all financial transactions, tax filings and bank account opening.",                   mandatory:true,  timeline:"7–15 days",  cost:"₹93",                link:"https://www.onlineservices.nsdl.com",category:"Tax" },
    { id:"bank",     name:"Current Bank Account",          description:"Open a dedicated business current account. Required for all business transactions, GST payments and separating personal finances.",                   mandatory:true,  timeline:"1–3 days",   cost:"₹0–₹5,000/year",     link:"https://rbi.org.in",                category:"Finance" },
    { id:"trademark",name:"Trademark Registration",        description:"Protect your brand name and logo. Recommended once business is established to prevent brand copying.",                                                mandatory:false, timeline:"18–24 months",cost:"₹4,500–₹9,000",      link:"https://ipindia.gov.in",             category:"Legal" },
  ],
  "Tech Startup / Software Company": [
    { id:"llp",      name:"LLP / Pvt Ltd Registration",    description:"Register as LLP (Limited Liability Partnership) or Private Limited Company on MCA portal. Pvt Ltd preferred for investor funding.",                  mandatory:true,  timeline:"7–15 days",  cost:"₹5,000–₹15,000",     link:"https://www.mca.gov.in",             category:"Business" },
    { id:"gst",      name:"GST Registration",              description:"Mandatory for software/tech companies. Apply for GST if exporting services or turnover exceeds ₹20L. Also needed for invoicing clients.",            mandatory:true,  timeline:"3–7 days",   cost:"Free",                link:"https://www.gst.gov.in",             category:"Tax" },
    { id:"dpiit",    name:"DPIIT Startup Recognition",     description:"Get recognised as a startup by DPIIT (Dept for Promotion of Industry). Unlocks tax exemptions (80-IAC), self-certification and Startup India benefits.",mandatory:false,timeline:"2–10 days",  cost:"Free",                link:"https://www.startupindia.gov.in",    category:"Startup" },
    { id:"pan",      name:"Business PAN Card",             description:"PAN for your company entity. Required for all tax filings, financial transactions and bank account.",                                                 mandatory:true,  timeline:"7–15 days",  cost:"₹93",                link:"https://www.onlineservices.nsdl.com",category:"Tax" },
    { id:"msme",     name:"MSME Udyam Registration",       description:"Register on Udyam portal for MSME benefits — priority sector lending, lower interest rates, government tender preference.",                           mandatory:false, timeline:"Same day",   cost:"Free",                link:"https://udyamregistration.gov.in",   category:"Business" },
    { id:"bank",     name:"Current Bank Account",          description:"Dedicated business current account for client payments, payroll and vendor payments. Keep personal and business finances completely separate.",        mandatory:true,  timeline:"1–3 days",   cost:"₹0–₹5,000/year",     link:"https://rbi.org.in",                category:"Finance" },
    { id:"pt",       name:"Professional Tax Registration", description:"Mandatory in states like Maharashtra, Karnataka, Gujarat. Register and file professional tax for yourself and employees.",                            mandatory:true,  timeline:"3–7 days",   cost:"₹2,500/year",        link:"https://mahagst.gov.in",             category:"Tax" },
    { id:"esi",      name:"ESI & PF Registration",         description:"Mandatory if you have 10+ employees (ESI) or 20+ employees (PF). Register with ESIC and EPFO for employee social security.",                        mandatory:false, timeline:"7–15 days",  cost:"Free",                link:"https://www.esic.in",                category:"HR" },
    { id:"tds",      name:"TDS Deduction Setup",           description:"Set up TDS (Tax Deducted at Source) for payments to vendors and employees. Register for TAN on Income Tax portal.",                                  mandatory:true,  timeline:"7 days",     cost:"₹65",                link:"https://www.tin-nsdl.com",           category:"Tax" },
    { id:"trademark",name:"Trademark Registration",        description:"Protect your product/software name and logo. Essential for tech companies before launching publicly to prevent IP theft.",                            mandatory:false, timeline:"18–24 months",cost:"₹4,500–₹9,000",      link:"https://ipindia.gov.in",             category:"Legal" },
    { id:"itr",      name:"Income Tax Return Filing",      description:"File annual ITR for your company. Mandatory regardless of profit/loss. Deadline is usually September 30 each year.",                                 mandatory:true,  timeline:"Annually",   cost:"₹2,000–₹10,000",     link:"https://www.incometax.gov.in",       category:"Tax" },
  ],
  "Healthcare / Clinic / Diagnostic Lab": [
    { id:"cea",      name:"Clinical Establishment Act Reg.",description:"Register under the Clinical Establishments Act. Mandatory for all clinics, hospitals and diagnostic labs in India.",                                 mandatory:true,  timeline:"15–30 days", cost:"₹500–₹10,000",       link:"https://clinicalestablishments.gov.in",category:"Healthcare" },
    { id:"gst",      name:"GST Registration",              description:"GST for healthcare is mostly exempt but required for diagnostic labs, medical equipment sales and some services.",                                    mandatory:true,  timeline:"3–7 days",   cost:"Free",                link:"https://www.gst.gov.in",             category:"Tax" },
    { id:"pan",      name:"Business PAN Card",             description:"PAN for the clinic/lab entity. Required for all financial transactions and tax filings.",                                                            mandatory:true,  timeline:"7–15 days",  cost:"₹93",                link:"https://www.onlineservices.nsdl.com",category:"Tax" },
    { id:"shop",     name:"Shop & Establishment Act",      description:"Register commercial premises with local municipal authority. Required for all commercial healthcare spaces.",                                          mandatory:true,  timeline:"1–7 days",   cost:"₹200–₹2,000",        link:"https://labour.gov.in",              category:"Local" },
    { id:"mci",      name:"Medical Council Registration",  description:"Doctor must be registered with State Medical Council / NMC. Essential before practicing. Clinic must display this prominently.",                      mandatory:true,  timeline:"Varies",     cost:"₹1,000–₹5,000",      link:"https://www.nmc.org.in",             category:"Healthcare" },
    { id:"pcpndt",   name:"PCPNDT Registration",           description:"Pre-Conception and Pre-Natal Diagnostic Techniques Act registration. Mandatory for ultrasound/radiology services. Heavy penalties for non-compliance.",mandatory:false, timeline:"30–60 days", cost:"₹500–₹2,000",        link:"https://mohfw.gov.in",               category:"Healthcare" },
    { id:"biomedical",name:"BMW Rules Registration",       description:"Biomedical Waste Management Rules compliance. Mandatory for all healthcare establishments generating medical waste.",                                  mandatory:true,  timeline:"15–30 days", cost:"₹1,000–₹5,000",      link:"https://cpcb.nic.in",               category:"Safety" },
    { id:"insurance",name:"Insurance Empanelment",         description:"Empanel with insurance companies (Star Health, HDFC ERGO, etc.) to accept cashless insurance. Significantly increases patient footfall.",              mandatory:false, timeline:"30–90 days", cost:"Free",                link:"https://irdai.gov.in",               category:"Finance" },
    { id:"aerb",     name:"AERB Registration (if X-ray)",  description:"Atomic Energy Regulatory Board approval required if you have X-ray, CT scan or any radiation equipment.",                                            mandatory:false, timeline:"30–60 days", cost:"₹5,000–₹20,000",     link:"https://www.aerb.gov.in",            category:"Safety" },
    { id:"nabh",     name:"NABH Accreditation",            description:"National Accreditation Board for Hospitals. Optional but significantly boosts patient trust and enables insurance empanelment.",                      mandatory:false, timeline:"6–12 months", cost:"₹50,000–₹2,00,000",  link:"https://nabh.co",                   category:"Quality" },
  ],
  "General Service Business": [
    { id:"gst",      name:"GST Registration",              description:"Mandatory if annual turnover exceeds ₹20 lakh (₹10L for special category states). Register on GST portal.",                                         mandatory:true,  timeline:"3–7 days",   cost:"Free",                link:"https://www.gst.gov.in",             category:"Tax" },
    { id:"msme",     name:"MSME Udyam Registration",       description:"Register your business as MSME on Udyam portal. Unlocks priority lending, government subsidies, lower bank interest rates.",                          mandatory:false, timeline:"Same day",   cost:"Free",                link:"https://udyamregistration.gov.in",   category:"Business" },
    { id:"shop",     name:"Shop & Establishment Act",      description:"Register your commercial space with the local municipal authority. Required for all businesses operating from a fixed premises.",                      mandatory:true,  timeline:"1–7 days",   cost:"₹200–₹2,000",        link:"https://labour.gov.in",              category:"Local" },
    { id:"pan",      name:"Business PAN Card",             description:"PAN for your business. Required for GST registration, bank account, and all tax-related activities.",                                                mandatory:true,  timeline:"7–15 days",  cost:"₹93",                link:"https://www.onlineservices.nsdl.com",category:"Tax" },
    { id:"bank",     name:"Current Bank Account",          description:"Open a dedicated business bank account. Required for GST compliance, vendor payments, and professional invoicing.",                                   mandatory:true,  timeline:"1–3 days",   cost:"₹0–₹5,000/year",     link:"https://rbi.org.in",                category:"Finance" },
    { id:"itr",      name:"Income Tax Return",             description:"File annual ITR for your business. Mandatory for all registered entities. Due by July 31 (individuals) or September 30 (companies).",              mandatory:true,  timeline:"Annually",   cost:"₹500–₹5,000",        link:"https://www.incometax.gov.in",       category:"Tax" },
    { id:"pt",       name:"Professional Tax",              description:"Applicable in states like Maharashtra, Karnataka, West Bengal. Must be paid by self-employed individuals and deducted from employees.",               mandatory:false, timeline:"3–7 days",   cost:"₹2,500/year",        link:"https://mahagst.gov.in",             category:"Tax" },
    { id:"trademark",name:"Trademark Registration",        description:"Protect your brand name and logo from being copied. Recommended once business is operational and growing.",                                           mandatory:false, timeline:"18–24 months",cost:"₹4,500–₹9,000",      link:"https://ipindia.gov.in",             category:"Legal" },
  ],
};

// Map other business types to closest template
const TEMPLATE_MAP: Record<string, string> = {
  "Retail Shop / Kirana Store":      "Cloud Kitchen / Food Business",
  "Restaurant / Cafe":               "Cloud Kitchen / Food Business",
  "Manufacturing Unit":              "General Service Business",
  "E-commerce Business":             "Tech Startup / Software Company",
  "Educational Institute / Coaching":"General Service Business",
  "Fitness Studio / Gym":            "General Service Business",
  "Logistics / Transport Company":   "General Service Business",
  "Real Estate Agency":              "General Service Business",
  "Digital Marketing Agency":        "Tech Startup / Software Company",
};

const CAT_COLORS: Record<string,string> = {
  "Food & Safety":"#ef4444","Tax":"#4f46e5","Business":"#10b981","Local":"#f59e0b",
  "Safety":"#f97316","Finance":"#22c55e","Legal":"#8b5cf6","Startup":"#0ea5e9",
  "Healthcare":"#ec4899","HR":"#06b6d4","Quality":"#84cc16",
};

export default function ChecklistPage() {
  const [bizType, setBizType]     = useState("");
  const [checked, setChecked]     = useState<Set<string>>(new Set());
  const [filterMandatory, setFilter] = useState<"all"|"mandatory"|"optional">("all");

  const templateKey = TEMPLATE_MAP[bizType] || bizType;
  const items = CHECKLISTS[templateKey] || [];
  const filtered = items.filter(i =>
    filterMandatory === "all" ? true :
    filterMandatory === "mandatory" ? i.mandatory : !i.mandatory
  );

  const toggle = (id: string) => setChecked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const mandatoryDone = items.filter(i => i.mandatory && checked.has(i.id)).length;
  const mandatoryTotal = items.filter(i => i.mandatory).length;
  const allDone = items.filter(i => checked.has(i.id)).length;
  const progress = items.length > 0 ? Math.round((allDone / items.length) * 100) : 0;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#10b981;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .layout{display:grid;grid-template-columns:280px 1fr;gap:24px;}
        .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--shadow);margin-bottom:16px;}
        .ptt{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:18px;}
        .fi{width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 13px;font-family:'DM Mono',monospace;font-size:0.82rem;outline:none;cursor:pointer;}
        .fi:focus{border-color:#10b981;}

        /* Progress */
        .prog-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:18px;box-shadow:var(--shadow);}
        .prog-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .prog-pct{font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;color:#10b981;line-height:1;}
        .prog-track{background:var(--border);height:8px;border-radius:999px;overflow:hidden;margin-bottom:12px;}
        .prog-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#10b981,#22c55e);transition:width 0.6s ease;}
        .prog-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .ps{background:var(--bg);border:1px solid var(--border-light);border-radius:8px;padding:10px 12px;text-align:center;}
        .ps-val{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;color:#4f46e5;line-height:1;}
        .ps-lbl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);margin-top:3px;}

        /* Filter */
        .filter-row{display:flex;gap:6px;margin-bottom:16px;}
        .fb{padding:7px 14px;border-radius:8px;border:1.5px solid var(--border);background:transparent;font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-faint);cursor:pointer;transition:all 0.15s;}
        .fb.on{border-color:#10b981;background:rgba(16,185,129,0.1);color:#10b981;}

        /* Checklist items */
        .item{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:10px;transition:all 0.2s;cursor:pointer;}
        .item:hover{border-color:var(--accent-border);transform:translateX(2px);}
        .item.done{opacity:0.65;background:var(--bg);}
        .item-top{display:flex;align-items:flex-start;gap:14px;}
        .checkbox{width:22px;height:22px;border-radius:6px;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s;margin-top:2px;}
        .checkbox.checked{background:#10b981;border-color:#10b981;}
        .check-mark{color:#fff;font-size:12px;font-weight:700;}
        .item-name{font-family:'DM Sans',sans-serif;font-size:0.92rem;font-weight:700;color:var(--text);margin-bottom:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
        .mandatory-badge{font-family:'DM Mono',monospace;font-size:0.48rem;padding:2px 7px;border-radius:999px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#ef4444;letter-spacing:1px;text-transform:uppercase;}
        .optional-badge{font-family:'DM Mono',monospace;font-size:0.48rem;padding:2px 7px;border-radius:999px;background:rgba(148,163,184,0.12);border:1px solid rgba(148,163,184,0.2);color:var(--text-faint);letter-spacing:1px;text-transform:uppercase;}
        .cat-badge{font-family:'DM Mono',monospace;font-size:0.48rem;padding:2px 7px;border-radius:999px;letter-spacing:1px;text-transform:uppercase;}
        .item-desc{font-size:0.8rem;color:var(--text-faint);line-height:1.6;margin-bottom:10px;}
        .item-meta{display:flex;gap:16px;flex-wrap:wrap;}
        .meta-item{display:flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:0.58rem;color:var(--text-faint);}
        .gov-link{display:inline-flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:0.58rem;color:#4f46e5;text-decoration:none;padding:3px 10px;border-radius:6px;background:var(--accent-bg);border:1px solid var(--accent-border);transition:all 0.15s;margin-left:auto;}
        .gov-link:hover{background:#4f46e5;color:#fff;}

        .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:360px;gap:14px;text-align:center;}
        .reset-btn{width:100%;padding:10px;background:transparent;border:1px solid var(--border);border-radius:10px;color:var(--text-faint);font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;margin-top:4px;}
        .reset-btn:hover{border-color:#ef4444;color:#ef4444;}
      `}</style>

      <div className="ph">
        <h1 className="pt">Legal Registration Checklist</h1>
        <span className="ptag">✅ India Compliant</span>
      </div>

      <div className="layout">
        {/* LEFT */}
        <div style={{height:"fit-content"}}>
          <div className="panel">
            <p className="ptt">Select Business Type</p>
            <select className="fi" value={bizType} onChange={e=>{setBizType(e.target.value);setChecked(new Set());}}>
              <option value="">Choose your business…</option>
              {BUSINESS_TYPES.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {items.length > 0 && (
            <>
              <div className="prog-card">
                <p className="ptt">Completion Progress</p>
                <div className="prog-row">
                  <div>
                    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",marginBottom:4}}>Overall</p>
                    <p className="prog-pct">{progress}%</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",marginBottom:4}}>Done</p>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:800,color:"#4f46e5"}}>{allDone}/{items.length}</p>
                  </div>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{width:`${progress}%`}}/>
                </div>
                <div className="prog-stats">
                  <div className="ps">
                    <p className="ps-val" style={{color:"#ef4444"}}>{mandatoryDone}/{mandatoryTotal}</p>
                    <p className="ps-lbl">Mandatory Done</p>
                  </div>
                  <div className="ps">
                    <p className="ps-val" style={{color:"#10b981"}}>{items.length - mandatoryTotal}</p>
                    <p className="ps-lbl">Optional Items</p>
                  </div>
                </div>
              </div>

              <button className="reset-btn" onClick={()=>setChecked(new Set())}>Reset All ↺</button>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {!bizType && (
            <div className="empty">
              <div style={{fontSize:"3rem"}}>📋</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"var(--text-faint)"}}>Select Your Business Type</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:2,textTransform:"uppercase",color:"var(--text-faint)",maxWidth:260,lineHeight:1.6}}>Get a complete India-specific legal registration checklist with direct government website links</p>
            </div>
          )}

          {bizType && items.length > 0 && (
            <>
              <div className="filter-row">
                {(["all","mandatory","optional"] as const).map(f=>(
                  <button key={f} className={`fb ${filterMandatory===f?"on":""}`} onClick={()=>setFilter(f)}>
                    {f === "all" ? `All (${items.length})` : f === "mandatory" ? `Mandatory (${mandatoryTotal})` : `Optional (${items.length-mandatoryTotal})`}
                  </button>
                ))}
              </div>

              {filtered.map(item=>(
                <div key={item.id} className={`item ${checked.has(item.id)?"done":""}`} onClick={()=>toggle(item.id)}>
                  <div className="item-top">
                    <div className={`checkbox ${checked.has(item.id)?"checked":""}`}>
                      {checked.has(item.id)&&<span className="check-mark">✓</span>}
                    </div>
                    <div style={{flex:1}}>
                      <div className="item-name">
                        {item.name}
                        <span className={item.mandatory?"mandatory-badge":"optional-badge"}>{item.mandatory?"Mandatory":"Optional"}</span>
                        <span className="cat-badge" style={{background:`${CAT_COLORS[item.category]||"#64748b"}18`,color:CAT_COLORS[item.category]||"#64748b",border:`1px solid ${CAT_COLORS[item.category]||"#64748b"}33`}}>{item.category}</span>
                      </div>
                      <p className="item-desc">{item.description}</p>
                      <div className="item-meta">
                        <span className="meta-item">⏱ {item.timeline}</span>
                        <span className="meta-item">💰 {item.cost}</span>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="gov-link" onClick={e=>e.stopPropagation()}>
                          🏛 Official Portal ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
