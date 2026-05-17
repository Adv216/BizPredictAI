"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_CORE = [
  { href:"/evaluate",  label:"Evaluate",     sub:"AI feasibility analysis",   icon:"📊" },
  { href:"/suggest",   label:"Suggest",      sub:"Generate business ideas",    icon:"💡" },
  { href:"/compare",   label:"Compare",      sub:"Side-by-side scorecard",     icon:"⚖️" },
  { href:"/market",    label:"Market Intel", sub:"Industry research",           icon:"🔍" },
  { href:"/plan",      label:"Action Plan",  sub:"90-day checklist",            icon:"✅" },
  { href:"/heatmap",   label:"Heatmap",      sub:"City opportunities",          icon:"🗺️" },
];

const NAV_AI = [
  { href:"/swot",      label:"SWOT Analysis",  sub:"AI strategic analysis",    icon:"🧠" },
  { href:"/namegen",   label:"Name Generator", sub:"AI brand naming",           icon:"✨" },
  { href:"/quiz",      label:"Readiness Quiz", sub:"Are you startup ready?",    icon:"🎯" },
  { href:"/trends",    label:"Trends",         sub:"India startup ecosystem",    icon:"📈" },
  { href:"/funding",   label:"Funding Calc",   sub:"EMI & loan planner",         icon:"💰" },
  { href:"/pitch",     label:"Pitch Generator",sub:"Investor pitch deck",        icon:"🎯" },
  { href:"/checklist", label:"Legal Checklist",sub:"Registration guide",         icon:"📋" },
];

const NAV_DATA = [
  { href:"/history",   label:"History",      sub:"Past predictions",            icon:"🕐" },
  { href:"/results",   label:"Results",      sub:"Latest analysis",             icon:"📋" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("biz_theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("biz_theme", next ? "dark" : "light");
  };

  const isHidden = pathname === "/login" || pathname === "/dashboard";
  if (isHidden) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .sidebar{width:230px;min-height:100vh;flex-shrink:0;background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;transition:background 0.3s;}
        .sidebar::-webkit-scrollbar{width:3px;}.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:999px;}
        .sidebar-logo{padding:20px 18px 14px;border-bottom:1px solid var(--border);}
        .logo-link{text-decoration:none;}
        .logo-mark{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
        .logo-mark span{color:#4f46e5;}
        .logo-sub{font-family:'DM Mono',monospace;font-size:0.48rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);margin-top:3px;}
        .nav-section{padding:10px 10px;flex:1;}
        .nav-label{font-family:'DM Mono',monospace;font-size:0.46rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-faint);padding:0 8px;margin:10px 0 5px;}
        .nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:10px;text-decoration:none;margin-bottom:1px;transition:all 0.15s;position:relative;color:var(--text-faint);}
        .nav-item:hover{background:var(--bg);color:var(--text-muted);}
        .nav-item.active{background:var(--accent-bg);color:#4f46e5;}
        .nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:999px;background:#4f46e5;}
        .nav-emoji{font-size:0.95rem;flex-shrink:0;width:20px;text-align:center;}
        .nav-name{font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:600;line-height:1;color:inherit;}
        .nav-sub{font-family:'DM Mono',monospace;font-size:0.5rem;color:var(--text-faint);margin-top:2px;}
        .nav-item.active .nav-sub{color:rgba(79,70,229,0.55);}
        .divider{height:1px;background:var(--border);margin:6px 10px;}
        .sidebar-footer{padding:12px 10px;border-top:1px solid var(--border);}
        .dark-toggle{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:10px;background:var(--bg);border:1px solid var(--border);cursor:pointer;transition:all 0.2s;margin-bottom:10px;}
        .dark-toggle:hover{border-color:var(--accent-border);}
        .toggle-label{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);}
        .toggle-pill{width:32px;height:17px;border-radius:999px;background:var(--border);position:relative;transition:background 0.2s;}
        .toggle-pill.on{background:#4f46e5;}
        .toggle-thumb{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
        .toggle-pill.on .toggle-thumb{transform:translateX(15px);}
        .engine-status{display:flex;align-items:center;gap:6px;padding:5px 10px;}
        .status-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 5px #22c55e;animation:sp 2s infinite;}
        @keyframes sp{0%,100%{opacity:1}50%{opacity:0.4}}
        .status-text{font-family:'DM Mono',monospace;font-size:0.48rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-faint);}
        .main-content{flex:1;min-width:0;background:var(--bg);transition:background 0.3s;}
        .new-badge{font-family:'DM Mono',monospace;font-size:0.44rem;padding:1px 6px;border-radius:999px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;margin-left:auto;letter-spacing:1px;}
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/dashboard" className="logo-link">
            <p className="logo-mark">Biz<span>Predict</span>AI</p>
            <p className="logo-sub">Business Intelligence</p>
          </Link>
        </div>

        <nav className="nav-section">
          <p className="nav-label">Core Tools</p>
          {NAV_CORE.map(({ href, label, sub, icon }) => (
            <Link key={href} href={href} className={`nav-item ${pathname===href?"active":""}`}>
              <span className="nav-emoji">{icon}</span>
              <span style={{flex:1}}>
                <span className="nav-name">{label}</span>
                <br /><span className="nav-sub">{sub}</span>
              </span>
            </Link>
          ))}

          <div className="divider"/>
          <p className="nav-label">AI Features</p>
          {NAV_AI.map(({ href, label, sub, icon }) => (
            <Link key={href} href={href} className={`nav-item ${pathname===href?"active":""}`}>
              <span className="nav-emoji">{icon}</span>
              <span style={{flex:1}}>
                <span className="nav-name">{label}</span>
                <br /><span className="nav-sub">{sub}</span>
              </span>
              {(href==="/swot"||href==="/quiz"||href==="/trends"||href==="/pitch"||href==="/checklist")&&<span className="new-badge">NEW</span>}
            </Link>
          ))}

          <div className="divider"/>
          <p className="nav-label">Records</p>
          {NAV_DATA.map(({ href, label, sub, icon }) => (
            <Link key={href} href={href} className={`nav-item ${pathname===href?"active":""}`}>
              <span className="nav-emoji">{icon}</span>
              <span style={{flex:1}}>
                <span className="nav-name">{label}</span>
                <br /><span className="nav-sub">{sub}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {mounted && (
            <div className="dark-toggle" onClick={toggleDark}>
              <span className="toggle-label">{dark?"Dark":"Light"}</span>
              <div className={`toggle-pill ${dark?"on":""}`}>
                <div className="toggle-thumb"/>
              </div>
            </div>
          )}
          <div className="engine-status">
            <div className="status-dot"/>
            <span className="status-text">AI Engine Active</span>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}