import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AirplaneTilt, ArrowRight, Boat, Buildings, ChartLineUp, CheckCircle, Clock,
  CloudArrowUp, Code, Cube, Factory, FirstAid, GlobeHemisphereWest, Headset,
  List, MagnifyingGlass, MapPin, Medal, Package, Phone, ShieldCheck, Snowflake,
  Storefront, Thermometer, Train, Truck, Users, Warehouse, WifiHigh, X
} from "@phosphor-icons/react";
import { offices, submitInquiry, trackShipment, TrackingResult } from "./api";

type Item = { title: string; text: string; tags?: string[] };
type Metric = { value: string; label: string };
type Solution = { title: string; text: string; pains: string[]; solutions: string[] };

const links = [["/", "nav.home"], ["/about", "nav.about"], ["/services", "nav.services"], ["/solutions", "nav.solutions"], ["/technology", "nav.technology"], ["/contact", "nav.contact"]] as const;
const serviceIcons = [Truck, Train, AirplaneTilt, Boat];
const featureIcons = [Truck, Warehouse, GlobeHemisphereWest, ChartLineUp];

function objects<T>(t: any, key: string): T {
  return t(key, { returnObjects: true }) as T;
}

function Brand() {
  return <Link className="brand" to="/" aria-label="Vasilia home"><span className="brand-mark"><GlobeHemisphereWest weight="duotone" /></span><span>Vasilia<small>GLOBAL LOGISTICS</small></span></Link>;
}

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  const changeLanguage = () => { const next = i18n.language.startsWith("zh") ? "en" : "zh"; void i18n.changeLanguage(next); localStorage.setItem("vasilia-language", next); };
  return <header className={`site-header ${scrolled ? "scrolled" : ""}`}><div className="header-inner"><Brand />
    <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Primary">{links.map(([to, key]) => <NavLink key={to} end={to === "/"} to={to}>{t(key)}</NavLink>)}<NavLink className="nav-track" to="/technology#tracking">{t("nav.track")}</NavLink></nav>
    <div className="header-actions"><button className="language" onClick={changeLanguage}><GlobeHemisphereWest />{i18n.language.startsWith("zh") ? "EN" : "中文"}</button><Link className="button small" to="/contact">{t("nav.quote")}</Link><button className="menu" onClick={() => setOpen(!open)} aria-label={t("nav.menu")} aria-expanded={open}>{open ? <X /> : <List />}</button></div>
  </div></header>;
}

function Footer() {
  const { t } = useTranslation();
  return <footer className="footer"><div className="shell footer-grid"><div><Brand /><p>{t("footer.desc")}</p></div><div><h3>{t("footer.links")}</h3>{links.slice(1).map(([to, key]) => <Link key={to} to={to}>{t(key)}</Link>)}</div><div><h3>{t("footer.contact")}</h3><span>{t("footer.email")}</span><span>{t("footer.phone")}</span><span>{t("footer.address")}</span></div></div><div className="shell footer-bottom">{t("footer.legal")}</div></footer>;
}

function Meta() {
  const { i18n } = useTranslation(); const { pathname, hash } = useLocation();
  useEffect(() => { document.documentElement.lang = i18n.language.startsWith("zh") ? "zh-CN" : "en"; document.title = `Vasilia Logistics · ${pathname === "/" ? "Home" : pathname.slice(1)}`; if (hash) window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 50); else window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname, hash, i18n.language]);
  return null;
}

function Layout({ children }: { children: ReactNode }) { return <><Meta /><Header /><main>{children}</main><Footer /></>; }

function PageHero({ eyebrow, title, lead, image = "/images/hero-logistics.png" }: { eyebrow: string; title: string; lead: string; image?: string }) {
  return <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,14,34,.97), rgba(2,20,46,.66)), url(${image})` }}><div className="shell"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{lead}</p></div></section>;
}

function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return <div className={`section-heading ${light ? "light" : ""}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function ControlTower() {
  const { t } = useTranslation();
  return <div className="control-tower"><div className="tower-title"><strong>Vasilia Control Tower</strong><span><i />LIVE</span></div><div className="tower-stats"><div><small>{t("technology.status")}</small><b>98.6%</b><em>+1.8%</em></div><div><small>Shipments</small><b>24,872</b><em>+12.4%</em></div></div><div className="tower-visual"><GlobeHemisphereWest weight="thin" /><MapPin className="pin one" weight="fill" /><MapPin className="pin two" weight="fill" /><Truck className="vehicle" weight="duotone" /></div><div className="tower-bottom"><div><small>Active orders</small><b>3,245</b></div><div><small>Route optimization</small><b>Shanghai → Rotterdam</b><span>4.2 days saved</span></div></div></div>;
}

function QuickQuote() {
  const { t } = useTranslation(); const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };
  return <section className="quick-quote"><div className="shell"><div><p className="eyebrow light">QUICK INQUIRY</p><h2>{t("home.quoteTitle")}</h2><p>{t("home.quoteLead")}</p></div><form onSubmit={submit}><input aria-label="Origin" required placeholder={t("contact.fields.origin")} /><input aria-label="Destination" required placeholder={t("contact.fields.destination")} /><select aria-label="Cargo" required defaultValue=""><option value="" disabled>{t("contact.fields.cargo")}</option><option>General cargo</option><option>Cold chain</option><option>Project cargo</option></select><button className="button">{sent ? <CheckCircle /> : <ArrowRight />}{sent ? t("common.success") : t("nav.quote")}</button></form></div></section>;
}

function HomePage() {
  const { t } = useTranslation(); const metrics = objects<Metric[]>(t, "home.metrics"); const services = objects<Item[]>(t, "home.services"); const industries = objects<string[]>(t, "home.industries"); const industryCopy = objects<string[]>(t, "home.industryCopy"); const [industry, setIndustry] = useState(0);
  return <>
    <section className="home-hero"><div className="hero-photo" /><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow light">{t("home.eyebrow")}</p><h1>{String(t("home.title")).split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p>{t("home.lead")}</p><div className="hero-buttons"><Link className="button" to="/contact">{t("common.consult")}<ArrowRight /></Link><Link className="ghost-button" to="/about">{t("common.learn")}</Link></div></div><ControlTower /></div></section>
    <section className="metric-bar"><div className="shell metric-grid">{metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="MULTIMODAL SERVICES" title={t("home.servicesTitle")} text={t("home.servicesLead")} /><div className="feature-grid">{services.map((item, i) => { const Icon = featureIcons[i]; return <Link className="feature-card" to={i === 3 ? "/technology" : "/services"} key={item.title}><Icon weight="duotone" /><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p><b>{t("common.learn")}<ArrowRight /></b></Link>; })}</div></div></section>
    <section className="industry-showcase"><div className="shell"><SectionHeading eyebrow="INDUSTRY SOLUTIONS" title={t("home.industriesTitle")} light /><div className="industry-tabs" role="tablist">{industries.map((name, i) => <button role="tab" aria-selected={industry === i} className={industry === i ? "active" : ""} onClick={() => setIndustry(i)} key={name}>{name}</button>)}</div><div className="industry-panel"><div><span>0{industry + 1}</span><h3>{industries[industry]}</h3><p>{industryCopy[industry]}</p><Link to="/solutions">{t("common.learn")}<ArrowRight /></Link></div></div></div></section>
    <section className="tech-feature"><div className="tech-image"><img src="/images/warehouse-logistics.png" alt="Smart logistics warehouse" /></div><div><SectionHeading eyebrow="IOT · DATA · AI" title={t("home.techTitle")} text={t("home.techText")} /><ul><li><WifiHigh />Real-time visibility</li><li><ChartLineUp />Predictive insights</li><li><ShieldCheck />Exception alerts</li></ul><Link className="inline-link" to="/technology">{t("common.learn")}<ArrowRight /></Link></div></section>
    <section className="trust-section"><div className="shell"><p className="eyebrow">TRUSTED PARTNERS</p><div className="logo-row">{["AIR CARGO", "OCEAN LINE", "RAIL LINK", "ERP CLOUD", "E-COMMERCE", "INSURANCE"].map((x) => <span key={x}>{t("common.pending")} · {x}</span>)}</div><blockquote>“{t("home.testimonial")}”<cite>{t("home.testimonialBy")}</cite></blockquote></div></section>
    <QuickQuote />
  </>;
}

function AboutPage() {
  const { t } = useTranslation(); const values = objects<Item[]>(t, "about.values"); const timeline = objects<{ year: string; text: string }[]>(t, "about.timeline"); const team = objects<Item[]>(t, "about.team"); const partners = objects<string[]>(t, "about.partners"); const honors = objects<Item[]>(t, "about.honors");
  return <><PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} lead={t("about.lead")} />
    <section className="section story"><div className="shell two-column"><div><SectionHeading eyebrow="OUR STORY" title={t("about.storyTitle")} text={t("about.story")} /><span className="signature">Vasilia · 2020</span></div><img src="/images/ocean-freight.png" alt="Vasilia ocean logistics" /></div></section>
    <section className="section subtle"><div className="shell"><SectionHeading eyebrow="OUR VALUES" title="Efficient · Precise · Secure · Thoughtful" /><div className="value-grid">{values.map((v, i) => <article key={v.title}><span>0{i + 1}</span><h3>{v.title}</h3><p>{v.text}</p></article>)}</div></div></section>
    <section className="section timeline-section"><div className="shell"><SectionHeading eyebrow="MILESTONES" title="2020 → 2024" /><div className="timeline">{timeline.map((x) => <article key={x.year}><strong>{x.year}</strong><i /><p>{x.text}</p></article>)}</div></div></section>
    <section className="section team-section"><div className="shell"><SectionHeading eyebrow="EXPERT TEAM" title={t("about.team.0.title")} light /><div className="team-grid">{team.map((x, i) => { const Icon = [ChartLineUp, Truck, Warehouse, Headset][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p></article>; })}</div></div></section>
    <section className="partner-section"><div className="shell"><SectionHeading eyebrow="PARTNERS" title={t("about.partnersTitle")} /><div className="partner-grid">{partners.map((x) => <span key={x}>{x}</span>)}</div></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="CERTIFICATIONS" title="Recognition & Compliance" /><div className="honor-grid">{honors.map((x, i) => { const Icon = [Medal, ShieldCheck, CheckCircle][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p></article>; })}</div></div></section>
  </>;
}

function ServicesPage() {
  const { t } = useTranslation(); const transport = objects<Item[]>(t, "services.transport"); const cold = objects<Item[]>(t, "services.cold"); const global = objects<Item[]>(t, "services.global"); const types = objects<string[]>(t, "services.wareTypes"); const process = objects<string[]>(t, "services.process");
  return <><PageHero eyebrow={t("services.eyebrow")} title={t("services.title")} lead={t("services.lead")} />
    <section className="section"><div className="shell transport-grid">{transport.map((x, i) => { const Icon = serviceIcons[i]; return <article className="transport-card" key={x.title}><Icon weight="duotone" /><span>0{i + 1}</span><h2>{x.title}</h2><p>{x.text}</p><div>{x.tags?.map((tag) => <b key={tag}>{tag}</b>)}</div></article>; })}</div></section>
    <section className="service-split"><img src="/images/warehouse-logistics.png" alt="Warehouse service" /><div><SectionHeading eyebrow="SMART WMS" title={t("services.wareTitle")} text={t("services.wareText")} light /><div className="pill-list">{types.map((x) => <span key={x}><CheckCircle />{x}</span>)}</div></div></section>
    <section className="section subtle"><div className="shell"><SectionHeading eyebrow="COLD CHAIN" title={t("services.coldTitle")} /><div className="three-grid">{cold.map((x, i) => { const Icon = [Snowflake, Thermometer, ShieldCheck][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p></article>; })}</div></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="GLOBAL FREIGHT" title={t("services.globalTitle")} /><div className="three-grid">{global.map((x, i) => { const Icon = [CloudArrowUp, Boat, Storefront][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p></article>; })}</div></div></section>
    <section className="custom-cta"><div className="shell"><div><h2>{t("services.customTitle")}</h2><p>{t("services.customText")}</p></div><Link className="button white" to="/contact">{t("common.consult")}<ArrowRight /></Link></div></section>
    <section className="section process"><div className="shell"><SectionHeading eyebrow="PROCESS" title="01 — 05" /><div className="process-row">{process.map((x, i) => <article key={x}><span>0{i + 1}</span><strong>{x}</strong><ArrowRight /></article>)}</div></div></section>
  </>;
}

function SolutionsPage() {
  const { t } = useTranslation(); const tabs = objects<string[]>(t, "solutions.tabs"); const details = objects<Solution[]>(t, "solutions.details"); const cases = objects<(Metric & { tag: string; text: string })[]>(t, "solutions.cases"); const [active, setActive] = useState(0); const item = details[active];
  return <><PageHero eyebrow={t("solutions.eyebrow")} title={t("solutions.title")} lead={t("solutions.lead")} />
    <section className="solution-tabs"><div className="shell" role="tablist">{tabs.map((x, i) => <button role="tab" aria-selected={active === i} onClick={() => setActive(i)} className={active === i ? "active" : ""} key={x}>{x}</button>)}</div></section>
    <section className="section solution-detail"><div className="shell"><div><p className="eyebrow">SOLUTION 0{active + 1}</p><h2>{item.title}</h2><p>{item.text}</p></div><div className="pain-solution"><div><h3>PAIN POINTS</h3>{item.pains.map((x) => <span className="pain" key={x}><X />{x}</span>)}</div><ArrowRight /><div><h3>SOLUTIONS</h3>{item.solutions.map((x) => <span className="answer" key={x}><CheckCircle />{x}</span>)}</div></div></div></section>
    <section className="section subtle"><div className="shell"><SectionHeading eyebrow="SUCCESS STORIES" title={t("solutions.casesTitle")} /><div className="case-grid">{cases.map((x) => <article key={x.tag}><span>{x.tag}</span><strong>{x.value}</strong><h3>{x.label}</h3><p>{x.text}</p></article>)}</div></div></section>
    <section className="custom-cta"><div className="shell"><h2>{t("solutions.cta")}</h2><Link className="button white" to="/contact">{t("common.consult")}<ArrowRight /></Link></div></section>
  </>;
}

function TechnologyPage() {
  const { t, i18n } = useTranslation(); const capabilities = objects<Item[]>(t, "technology.capabilities"); const modules = objects<string[]>(t, "technology.modules"); const metrics = objects<Metric[]>(t, "technology.metrics"); const platforms = objects<string[]>(t, "technology.platforms"); const [number, setNumber] = useState("VAS20260618"); const [state, setState] = useState<"idle" | "loading" | "empty" | "found">("idle"); const [result, setResult] = useState<TrackingResult | null>(null);
  const track = async (e: FormEvent) => { e.preventDefault(); setState("loading"); const data = await trackShipment(number, i18n.language.startsWith("zh")); setResult(data); setState(data ? "found" : "empty"); };
  return <><PageHero eyebrow={t("technology.eyebrow")} title={t("technology.title")} lead={t("technology.lead")} />
    <section className="section"><div className="shell tech-capabilities">{capabilities.map((x, i) => { const Icon = [WifiHigh, ChartLineUp, Cube, Warehouse][i]; return <article key={x.title}><Icon weight="duotone" /><span>0{i + 1}</span><h2>{x.title}</h2><p>{x.text}</p></article>; })}</div></section>
    <section className="tracking-section" id="tracking"><div className="shell"><div><SectionHeading eyebrow="LIVE CONTROL TOWER" title={t("technology.trackingTitle")} text={t("technology.trackingLead")} light /><form onSubmit={track}><input value={number} onChange={(e) => setNumber(e.target.value)} placeholder={t("technology.trackingPlaceholder")} aria-label={t("technology.trackingPlaceholder")} /><button className="button"><MagnifyingGlass />{t("technology.trackingButton")}</button></form>{state === "loading" && <p className="status-message">{t("technology.trackingLoading")}</p>}{state === "empty" && <p className="status-message error">{t("technology.trackingEmpty")}</p>}</div><div className="tracking-card">{result ? <><div className="tracking-head"><span>{result.number}</span><b>{result.status}</b></div><div className="tracking-progress"><i style={{ width: `${result.progress}%` }} /></div><div className="tracking-kpis"><div><small>{t("technology.location")}</small><strong>{result.location}</strong></div><div><small>{t("technology.temperature")}</small><strong>{result.temperature}</strong></div><div><small>{t("technology.eta")}</small><strong>{result.eta}</strong></div></div><ol>{result.milestones.map((x, i) => <li className={i < 3 ? "done" : ""} key={x}><CheckCircle />{x}</li>)}</ol></> : <div className="tracking-placeholder"><Package weight="duotone" /><p>{t("technology.trackingLead")}</p></div>}</div></div></section>
    <section className="service-split wms"><img src="/images/warehouse-logistics.png" alt="Warehouse management system" /><div><SectionHeading eyebrow="WMS PLATFORM" title={t("technology.wmsTitle")} text={t("technology.wmsText")} light /><div className="module-grid">{modules.map((x, i) => <span key={x}><b>0{i + 1}</b>{x}</span>)}</div></div></section>
    <section className="metric-bar technology-metrics"><div className="shell metric-grid">{metrics.map((x) => <div key={x.label}><strong>{x.value}</strong><span>{x.label}</span></div>)}</div></section>
    <section className="section api-section"><div className="shell two-column"><div><SectionHeading eyebrow="OPEN API" title={t("technology.apiTitle")} text={t("technology.apiText")} /><Code weight="duotone" /></div><div className="platform-grid">{platforms.map((x) => <span key={x}>{x}</span>)}</div></div></section>
  </>;
}

function InquiryForm() {
  const { t } = useTranslation(); const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle"); const [message, setMessage] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); const required = ["company", "name", "phone", "email", "industry", "message"]; if (required.some((x) => !String(fd.get(x) || "").trim())) { setStatus("error"); setMessage(t("common.required")); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get("email")))) { setStatus("error"); setMessage(t("common.email")); return; } if (!/^[+\d][\d\s-]{6,}$/.test(String(fd.get("phone")))) { setStatus("error"); setMessage(t("common.phone")); return; } setStatus("sending"); await submitInquiry(Object.fromEntries(fd.entries())); setStatus("success"); setMessage(t("common.success")); form.reset(); };
  const fields = objects<Record<string, string>>(t, "contact.fields");
  return <form className="inquiry-form" onSubmit={submit}>{["company", "name", "phone", "email", "origin", "destination", "cargo"].map((name) => <label key={name}>{fields[name]}{["company", "name", "phone", "email"].includes(name) && " *"}<input name={name} /></label>)}<label>{fields.industry} *<select name="industry" defaultValue=""><option value="" disabled>—</option>{objects<string[]>(t, "home.industries").map((x) => <option key={x}>{x}</option>)}</select></label><label className="wide">{fields.message} *<textarea name="message" rows={5} /></label>{status !== "idle" && <p className={`form-message ${status}`}>{message}</p>}<button className="button wide" disabled={status === "sending"}>{status === "sending" ? t("common.sending") : t("nav.quote")}<ArrowRight /></button></form>;
}

function ContactPage() {
  const { t, i18n } = useTranslation(); const channels = objects<Item[]>(t, "contact.channels"); const join = objects<Item[]>(t, "contact.join"); const [city, setCity] = useState(offices[0].city); const office = useMemo(() => offices.find((x) => x.city === city) ?? offices[0], [city]); const isEn = i18n.language.startsWith("en");
  return <><PageHero eyebrow={t("contact.eyebrow")} title={t("contact.title")} lead={t("contact.lead")} />
    <section className="channel-strip"><div className="shell">{channels.map((x, i) => { const Icon = [Phone, Headset, CloudArrowUp, GlobeHemisphereWest][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p></article>; })}</div></section>
    <section className="section contact-form-section"><div className="shell contact-layout"><div><SectionHeading eyebrow="GET A PLAN" title={t("contact.formTitle")} text={t("contact.formLead")} /><div className="contact-note"><Clock /><span>{t("contact.lead")}</span></div></div><InquiryForm /></div></section>
    <section className="network-section"><div className="shell"><div><SectionHeading eyebrow="SERVICE NETWORK" title={t("contact.mapTitle")} text={t("contact.mapLead")} light /><div className="city-buttons">{offices.map((x) => <button key={x.city} className={city === x.city ? "active" : ""} onClick={() => setCity(x.city)}>{isEn ? ({ "上海": "Shanghai", "深圳": "Shenzhen", "成都": "Chengdu", "青岛": "Qingdao" }[x.city] || x.city) : x.city}</button>)}</div><article className="office-card"><MapPin weight="fill" /><h3>{isEn ? ({ "上海": "Shanghai", "深圳": "Shenzhen", "成都": "Chengdu", "青岛": "Qingdao" }[office.city] || office.city) : office.city}</h3><p>{isEn ? "Update: office address" : office.address}</p><p>{isEn ? "Update: office phone" : office.phone}</p></article></div><div className="network-map"><GlobeHemisphereWest weight="thin" />{offices.map((x) => <button aria-label={x.city} key={x.city} className={city === x.city ? "active" : ""} style={{ left: `${x.x}%`, top: `${x.y}%` }} onClick={() => setCity(x.city)}><MapPin weight="fill" /></button>)}</div></div></section>
    <section className="headquarters"><div className="shell"><Buildings weight="duotone" /><div><p className="eyebrow">HEADQUARTERS</p><h2>{t("contact.headquarters")}</h2></div><p>{t("contact.address")}<br />{t("contact.hours")}</p></div></section>
    <section className="section subtle"><div className="shell"><SectionHeading eyebrow="PARTNERSHIP" title={t("contact.joinTitle")} /><div className="three-grid">{join.map((x, i) => { const Icon = [Users, MapPin, Buildings][i]; return <article key={x.title}><Icon weight="duotone" /><h3>{x.title}</h3><p>{x.text}</p><Link to="/contact">{t("common.learn")}<ArrowRight /></Link></article>; })}</div></div></section>
    <section className="complaint"><div className="shell"><ShieldCheck weight="duotone" /><div><h3>{t("contact.complaintTitle")}</h3><p>{t("contact.complaint")}</p></div></div></section>
  </>;
}

export default function App() {
  return <Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/solutions" element={<SolutionsPage />} /><Route path="/technology" element={<TechnologyPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/network" element={<Navigate to="/technology#tracking" replace />} /><Route path="/warehouse" element={<Navigate to="/services" replace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Layout>;
}
