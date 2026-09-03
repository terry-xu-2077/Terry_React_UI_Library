import React, { useState } from "react";
import { Box } from "lucide-react";
import { BoolSwitch, Button, Dialog, EntityHeader, MultiSelect, PropertyRow, Select, Slider, StatusPill, TextField } from "./components";

const options = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" }
];

export function LegacyClassicShowcase() {
  const [text,setText] = useState("示例文本");
  const [bool,setBool] = useState("yes");
  const [select,setSelect] = useState("alpha");
  const [slider,setSlider] = useState(42);
  const [multi,setMulti] = useState(["alpha","gamma"]);
  const [pinned,setPinned] = useState(false);
  const [dialog,setDialog] = useState(false);
  return <div className="style-demo legacy-classic-demo">
    <EntityHeader tone="blue" icon={<Box size={28}/>} title="Entity Header" subtitle="Reusable header component" watermark="LEGACY" pinned={pinned} onPin={()=>setPinned(v=>!v)}/>
    <div className="demo-section"><h2>Controls</h2><div className="demo-grid">
      <TextField value={text} rawValue="示例文本" onChange={setText} tooltip="保留旧版的浅蓝色 Tooltip 与 hover 光晕"/>
      <BoolSwitch value={bool} rawValue="no" onChange={setBool}/>
      <Select value={select} rawValue="beta" options={options} onChange={setSelect}/>
      <Slider value={slider} rawValue={30} min={0} max={100} onChange={setSlider}/>
      <MultiSelect values={multi} rawValues={["beta"]} options={options} onChange={setMulti}/>
    </div></div>
    <div className="demo-section"><h2>Rows</h2><div className="demo-list">
      <PropertyRow label="Primary value" description="通用属性行" changed={text!=="示例文本"}><TextField value={text} onChange={setText}/></PropertyRow>
      <PropertyRow label="Enabled" description="支持任意业务语义"><BoolSwitch value={bool} onChange={setBool}/></PropertyRow>
    </div></div>
    <div className="demo-section"><h2>Actions & Status</h2><div className="demo-actions"><Button onClick={()=>setDialog(true)}>打开弹窗</Button><StatusPill tone="active">Active</StatusPill><StatusPill tone="warning">Warning</StatusPill><StatusPill tone="danger">Danger</StatusPill></div></div>
    <Dialog open={dialog} title="Legacy Classic Dialog" onClose={()=>setDialog(false)}><p>这套风格保留旧 Web 版的弹性进入动画、边框、渐变和阴影。</p></Dialog>
  </div>;
}
