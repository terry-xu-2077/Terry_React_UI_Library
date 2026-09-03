import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { LegacyClassicShowcase } from "./styles/legacy-classic";
import "./app.css";

const styles = [
  { id: "legacy-classic", label: "Legacy Classic", render: () => <LegacyClassicShowcase/> }
] as const;

function App() {
  const [active,setActive] = useState<(typeof styles)[number]["id"]>("legacy-classic");
  const current = styles.find(item=>item.id===active) ?? styles[0];
  return <div className="library-shell">
    <header className="library-topbar">
      <div className="library-brand">Terry React UI Library</div>
      <nav className="style-tabs" aria-label="UI styles">
        {styles.map(item=><button key={item.id} type="button" className={`style-tab ${active===item.id?"is-active":""}`} onClick={()=>setActive(item.id)}>{item.label}</button>)}
      </nav>
    </header>
    <main className="library-content">{current.render()}</main>
  </div>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
