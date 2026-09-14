import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  BoolSwitch,
  Button,
  Checkbox,
  Dialog,
  EntityHeader,
  MultiSelect,
  ResetButton,
  SegmentedControl,
  Select,
  Slider,
  SlidingTabs,
  StatusPill,
  TextField,
  Tooltip,
} from "../index";

type Appearance = "dark" | "light";
type Palette = {
  base: string;
  accent: string;
  effect: string;
  textMain: string;
  textBright: string;
};

const DEFAULTS: Record<Appearance, Palette> = {
  dark: { base: "#0f1529", accent: "#2ad5b8", effect: "#70eeff", textMain: "#ffffff", textBright: "#7fe8d8" },
  light: { base: "#a6b7c9", accent: "#159f8b", effect: "#16a6c7", textMain: "#343a40", textBright: "#168f9f" },
};

const options = [
  { value: "alpha", label: "Alpha", group: "A" },
  { value: "beta", label: "Beta", group: "B" },
  { value: "gamma", label: "Gamma", group: "C" },
];

const segmentedOptions = [
  { value: "user", label: "用户" },
  { value: "ai", label: "AI 增强" },
] as const;

const tabOptions = [
  { value: "fast", label: "快速" },
  { value: "standard", label: "标准" },
  { value: "quality", label: "高质量" },
] as const;

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="showcase-section">
      <div className="showcase-section-title">
        <span>{title}</span>
        {note ? <small>{note}</small> : null}
      </div>
      <div className="showcase-section-body">{children}</div>
    </section>
  );
}

function DemoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="showcase-item">
      <span className="showcase-label">{label}</span>
      <div className="showcase-demo">{children}</div>
    </div>
  );
}

export function ShowcaseApp() {
  const [appearance, setAppearance] = useState<Appearance>("dark");
  const [palettes, setPalettes] = useState<Record<Appearance, Palette>>(() => ({ dark: { ...DEFAULTS.dark }, light: { ...DEFAULTS.light } }));
  const palette = palettes[appearance];

  const [text, setText] = useState("示例文本");
  const [enabled, setEnabled] = useState("yes");
  const [disabledSwitch, setDisabledSwitch] = useState("no");
  const [selectValue, setSelectValue] = useState("alpha");
  const [sliderValue, setSliderValue] = useState(42);
  const [multiValues, setMultiValues] = useState(["alpha", "gamma"]);
  const [multiMode, setMultiMode] = useState<"menu" | "confirm">("menu");
  const [segment, setSegment] = useState<"user" | "ai">("user");
  const [tab, setTab] = useState<"fast" | "standard" | "quality">("fast");
  const [checked, setChecked] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tcMode = appearance;
    root.style.setProperty("--tc-base", palette.base);
    root.style.setProperty("--tc-accent", palette.accent);
    root.style.setProperty("--tc-effect", palette.effect);
    root.style.setProperty("--tc-text-main", palette.textMain);
    root.style.setProperty("--tc-text-bright", palette.textBright);
  }, [appearance, palette]);

  const updateColor = (key: keyof Palette, value: string) => {
    setPalettes(current => ({
      ...current,
      [appearance]: { ...current[appearance], [key]: value },
    }));
  };

  const resetPalette = () => {
    setPalettes(current => ({ ...current, [appearance]: { ...DEFAULTS[appearance] } }));
  };

  return (
    <div className="showcase-shell tc-theme" data-mode={appearance}>
      <header className="showcase-topbar">
        <div className="showcase-brand">Terry React UI Library</div>
        <nav className="showcase-tabs" aria-label="Showcase sections">
          <button className="showcase-tab is-active" type="button">Base Style</button>
          <button className="showcase-tab" type="button" disabled>New Style +</button>
        </nav>
        <div className="showcase-appearance" aria-label="Appearance">
          <button className={appearance === "dark" ? "is-active" : ""} type="button" onClick={() => setAppearance("dark")}>Dark</button>
          <button className={appearance === "light" ? "is-active" : ""} type="button" onClick={() => setAppearance("light")}>Light</button>
        </div>
      </header>

      <main className="showcase-main">
        <div className="showcase-intro">
          <div>
            <h1>Base Style</h1>
            <p>展示页直接消费 UI Library 的真实 React 组件与共享样式。</p>
          </div>
          <StatusPill tone="active">Live Showcase</StatusPill>
        </div>

        <Section title="Theme" note="Dark / Light 独立记忆五个主题通道">
          <div className="showcase-theme-grid">
            <label>底色 Base<input type="color" value={palette.base} onChange={event => updateColor("base", event.target.value)} /></label>
            <label>控件亮色 Accent<input type="color" value={palette.accent} onChange={event => updateColor("accent", event.target.value)} /></label>
            <label>特效色 Effect<input type="color" value={palette.effect} onChange={event => updateColor("effect", event.target.value)} /></label>
            <label>普通文本 Text<input type="color" value={palette.textMain} onChange={event => updateColor("textMain", event.target.value)} /></label>
            <label>文本亮色 Text Bright<input type="color" value={palette.textBright} onChange={event => updateColor("textBright", event.target.value)} /></label>
            <Button onClick={resetPalette}>恢复当前模式默认</Button>
          </div>
        </Section>

        <Section title="EntityHeader" note="真实组件">
          <EntityHeader
            icon={<span>◇</span>}
            title="Entity Header"
            subtitle="Reusable header component"
            watermark="ENTITY"
            pinned={pinned}
            onPin={() => setPinned(value => !value)}
          />
        </Section>

        <Section title="Controls" note="全部直接来自 src/components">
          <div className="showcase-grid">
            <DemoItem label="TextField"><TextField value={text} rawValue="示例文本" onChange={setText} placeholder="占位文字" /></DemoItem>
            <DemoItem label="BoolSwitch ON"><BoolSwitch value={enabled} onChange={setEnabled} /></DemoItem>
            <DemoItem label="BoolSwitch OFF"><BoolSwitch value={disabledSwitch} onChange={setDisabledSwitch} /></DemoItem>
            <DemoItem label="Select"><Select value={selectValue} options={options} onChange={setSelectValue} searchable ariaLabel="Select showcase" /></DemoItem>
            <DemoItem label="Slider"><Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} /></DemoItem>
            <DemoItem label="MultiSelect">
              <div className="showcase-stacked-demo">
                <SegmentedControl
                  compact
                  value={multiMode}
                  options={[{ value: "menu", label: "菜单模式" }, { value: "confirm", label: "确认模式" }]}
                  onChange={setMultiMode}
                />
                <MultiSelect values={multiValues} options={options} onChange={setMultiValues} mode={multiMode} />
              </div>
            </DemoItem>
            <DemoItem label="SegmentedControl"><SegmentedControl value={segment} options={segmentedOptions} onChange={setSegment} /></DemoItem>
            <DemoItem label="SlidingTabs"><SlidingTabs value={tab} options={tabOptions} onChange={setTab} /></DemoItem>
            <DemoItem label="Checkbox"><div className="showcase-inline"><Checkbox checked={checked} onChange={setChecked} ariaLabel="Checkbox showcase" /><span>{checked ? "已启用" : "未启用"}</span></div></DemoItem>
            <DemoItem label="ResetButton"><div className="showcase-reset-stage"><span>已修改</span><ResetButton visible onClick={() => setText("示例文本")} /></div></DemoItem>
            <DemoItem label="Tooltip"><Tooltip text="灰色只用于真正的 placeholder / muted 文本。"><Button>悬停查看</Button></Tooltip></DemoItem>
          </div>
        </Section>

        <Section title="PropertyRow" note="布局容器 + 真实共享控件">
          <div className="showcase-property-list">
            <div className="tc-property-row">
              <div className="tc-property-label"><div><strong>Primary value</strong><span>普通说明文字</span></div></div>
              <div className="tc-property-value"><TextField value={text} onChange={setText} /></div>
            </div>
            <div className="tc-property-row">
              <div className="tc-property-label"><div><strong>Enabled</strong><span>普通文本层级</span></div></div>
              <div className="tc-property-value"><BoolSwitch value={enabled} onChange={setEnabled} /></div>
            </div>
          </div>
        </Section>

        <Section title="Actions / Status / Dialog">
          <div className="showcase-actions">
            <Button onClick={() => setDialogOpen(true)}>打开弹窗</Button>
            <Button disabled>Disabled</Button>
            <StatusPill>Normal</StatusPill>
            <StatusPill tone="active">Active</StatusPill>
            <StatusPill tone="warning">Warning</StatusPill>
            <StatusPill tone="danger">Danger</StatusPill>
          </div>
        </Section>

        <Section title="ActiveParticleField" note="Showcase-only visual demo">
          <div className="showcase-particles" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
          </div>
        </Section>
      </main>

      <Dialog open={dialogOpen} title="Base Style Dialog" onClose={() => setDialogOpen(false)} closeOnBackdrop>
        <p className="showcase-dialog-copy">这个弹窗也是直接使用 UI Library 的 Dialog 组件。移动端会自动收窄并适配安全边距。</p>
      </Dialog>
    </div>
  );
}
