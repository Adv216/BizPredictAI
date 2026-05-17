"use client";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const SECTOR_GROWTH = {
  labels:["AI Services","EV Charging","Solar","HealthTech","EdTech","Cloud Kitchen","D2C Brands","Logistics","FinTech","AgriTech"],
  datasets:[{
    label:"Growth Rate (%)",
    data:[92,88,82,86,80,85,75,80,72,68],
    backgroundColor:["#4f46e5","#7c3aed","#10b981","#0ea5e9","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#84cc16","#f97316"],
    borderRadius:8,borderSkipped:false,
  }]
};

const FUNDING_TREND = {
  labels:["2019","2020","2021","2022","2023","2024","2025"],
  datasets:[
    {label:"Total Funding (₹ Cr)",data:[35000,28000,82000,65000,48000,55000,72000],borderColor:"#4f46e5",backgroundColor:"rgba(79,70,229,0.08)",tension:0.4,fill:true,pointBackgroundColor:"#4f46e5",pointBorderColor:"#fff",pointBorderWidth:2,pointRadius:5},
    {label:"No. of Deals (×100)",data:[400,320,780,620,540,590,680],borderColor:"#10b981",backgroundColor:"rgba(16,185,129,0.05)",tension:0.4,fill:false,pointBackgroundColor:"#10b981",pointBorderColor:"#fff",pointBorderWidth:2,pointRadius:5},
  ]
};

const CITY_ECOSYSTEM = {
  labels:["Bangalore","Delhi NCR","Mumbai","Hyderabad","Pune","Chennai","Kolkata","Ahmedabad"],
  datasets:[{
    label:"Startup Density Score",
    data:[98,87,82,76,70,65,52,48],
    backgroundColor:["#4f46e5","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"],
    borderRadius:6,borderSkipped:false,
  }]
};

const INVESTMENT_SPLIT = {
  labels:["Technology","Healthcare","Education","Food & Bev","Finance","Logistics","Others"],
  datasets:[{
    data:[34,16,12,11,13,8,6],
    backgroundColor:["#4f46e5","#0ea5e9","#f59e0b","#ef4444","#10b981","#8b5cf6","#94a3b8"],
    borderWidth:0,hoverOffset:6,
  }]
};

const STATS = [
  {label:"Indian Startups",value:"1.4 Lakh+",icon:"🚀",sub:"Registered with DPIIT 2025"},
  {label:"Unicorns",value:"115+",icon:"🦄",sub:"Valued at $1B+"},
  {label:"Total VC Funding",value:"$72B",icon:"💰",sub:"Cumulative till 2025"},
  {label:"Jobs Created",value:"12L+",icon:"👥",sub:"By DPIIT startups"},
  {label:"Tier-2 Startups",value:"40%",icon:"🏙️",sub:"Now outside metro cities"},
  {label:"Women Founders",value:"18%",icon:"👩‍💼",sub:"Fastest growing segment"},
];

const TRENDS = [
  {title:"AI-First Startups Surge",desc:"India saw a 4× increase in AI-focused startups in 2024, with 3,200 new registrations. Bangalore and Hyderabad lead with 62% of total AI startups.",tag:"🔥 Hot",color:"#4f46e5"},
  {title:"Tier-2 City Boom",desc:"Startup registrations in cities like Indore, Kochi, and Chandigarh grew 180% YoY. Lower costs + growing internet penetration are key drivers.",tag:"📈 Rising",color:"#10b981"},
  {title:"D2C Brands Scale Fast",desc:"India has 5,000+ D2C brands. The segment raised ₹12,000 Cr in 2024. Food, beauty, and fashion are the top 3 categories.",tag:"⚡ Fast Growth",color:"#f59e0b"},
  {title:"EV Ecosystem Expanding",desc:"Over 1,200 EV-related startups registered in 2024. Charging infrastructure and battery tech are the most funded sub-sectors.",tag:"🌱 Emerging",color:"#22c55e"},
  {title:"Health-Tech Post-COVID",desc:"Digital health startups raised $3.2B in 2024. Teleconsultation, diagnostics and mental health platforms dominate.",tag:"💊 Growing",color:"#0ea5e9"},
  {title:"AgriTech for Bharat",desc:"AgriTech startups now operate in 600+ districts. Government support (PM-Kisan digitisation) is accelerating adoption in Tier-3 areas.",tag:"🌾 Impact",color:"#84cc16"},
];

const chartOpts: any = {
  responsive:true,maintainAspectRatio:false,
  plugins:{legend:{labels:{color:"#94a3b8",font:{family:"'DM Mono', monospace",size:10}}},tooltip:{backgroundColor:"#1e1e3f",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(79,70,229,0.3)",borderWidth:1,padding:12,cornerRadius:8}},
  scales:{x:{ticks:{color:"#64748b",font:{family:"'DM Mono', monospace",size:9}},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"#64748b",font:{family:"'DM Mono', monospace",size:9}},grid:{color:"rgba(255,255,255,0.04)"}}},
};

export default function TrendsPage() {
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",padding:"36px 44px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ph{display:flex;align-items:center;gap:14px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .pt{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .ptag{font-family:'DM Mono',monospace;font-size:0.6rem;color:#10b981;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:4px 10px;border-radius:4px;letter-spacing:2px;text-transform:uppercase;}
        .sl{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
        .sl::after{content:'';flex:1;height:1px;background:var(--border);}
        .stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:32px;}
        .sc{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;box-shadow:var(--shadow);text-align:center;}
        .si{font-size:1.4rem;margin-bottom:6px;}
        .sv{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:800;color:#4f46e5;line-height:1;}
        .slbl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);margin:4px 0 3px;}
        .ssub{font-family:'DM Mono',monospace;font-size:0.52rem;color:var(--text-faint);}
        .charts-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
        .chart-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--shadow);}
        .cl{font-family:'DM Mono',monospace;font-size:0.55rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-bottom:14px;}
        .trends-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
        .trend-card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:18px;box-shadow:var(--shadow);transition:all 0.2s;}
        .trend-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);border-color:var(--accent-border);}
        .ttag{font-family:'DM Mono',monospace;font-size:0.52rem;padding:3px 8px;border-radius:999px;margin-bottom:10px;display:inline-block;}
        .ttitle{font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;color:var(--text);margin-bottom:8px;}
        .tdesc{font-size:0.8rem;color:var(--text-muted);line-height:1.6;}
        .source-note{font-family:'DM Mono',monospace;font-size:0.55rem;color:var(--text-faint);text-align:right;padding-top:8px;letter-spacing:1px;}
      `}</style>

      <div className="ph">
        <h1 className="pt">India Startup Trends</h1>
        <span className="ptag">📈 Live Dashboard</span>
      </div>

      {/* Key stats */}
      <p className="sl">Ecosystem Snapshot — 2025</p>
      <div className="stats-grid">
        {STATS.map(({label,value,icon,sub})=>(
          <div key={label} className="sc">
            <div className="si">{icon}</div>
            <div className="sv">{value}</div>
            <div className="slbl">{label}</div>
            <div className="ssub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <p className="sl">Funding & Deals Trend</p>
      <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:16,padding:22,marginBottom:20,boxShadow:"var(--shadow)"}}>
        <p className="cl">Total Startup Funding in India (₹ Crores) & Deal Count (2019–2025)</p>
        <div style={{height:240}}><Line data={FUNDING_TREND} options={chartOpts}/></div>
      </div>

      {/* Charts row 2 */}
      <p className="sl">Sector & City Intelligence</p>
      <div className="charts-2col">
        <div className="chart-card">
          <p className="cl">Top 10 Sectors by Growth Rate (%)</p>
          <div style={{height:260}}><Bar data={SECTOR_GROWTH} options={{...chartOpts,indexAxis:"y" as const}}/></div>
        </div>
        <div className="chart-card">
          <p className="cl">Investment Distribution by Sector (2024)</p>
          <div style={{height:260,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Doughnut data={INVESTMENT_SPLIT} options={{responsive:true,maintainAspectRatio:false,cutout:"65%",plugins:{legend:{position:"right" as const,labels:{color:"#94a3b8",font:{family:"'DM Mono', monospace",size:9},padding:10}},tooltip:{backgroundColor:"#1e1e3f",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(79,70,229,0.3)",borderWidth:1}}}}/>
          </div>
        </div>
      </div>

      {/* City chart */}
      <p className="sl">City Startup Ecosystem Rankings</p>
      <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:16,padding:22,marginBottom:28,boxShadow:"var(--shadow)"}}>
        <p className="cl">Top 8 Indian Cities by Startup Density Score (2025)</p>
        <div style={{height:200}}><Bar data={CITY_ECOSYSTEM} options={chartOpts}/></div>
      </div>

      {/* Trend cards */}
      <p className="sl">Key Trends to Watch</p>
      <div className="trends-grid">
        {TRENDS.map(({title,desc,tag,color})=>(
          <div key={title} className="trend-card">
            <span className="ttag" style={{background:`${color}18`,color,border:`1px solid ${color}33`}}>{tag}</span>
            <p className="ttitle">{title}</p>
            <p className="tdesc">{desc}</p>
          </div>
        ))}
      </div>

      <p className="source-note">Data Sources: DPIIT, NASSCOM, Inc42, Tracxn, Startup India Portal · Updated May 2025</p>
    </div>
  );
}
