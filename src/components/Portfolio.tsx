'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Github, Linkedin, Mail, Download,
  Database, Server, Filter, MousePointerClick
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer
} from "recharts";

/* ---------- helpers ---------- */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- data (edit me) ---------- */
const PROFILE = {
  name: "Nidhi Chandarana",
  title: "Data Engineer / Analyst",
  tagline: "Turning raw data into real-world insight",
  location: "New York, USA",
  email: "nidhichandarana03@gmail.com",
  github: "https://github.com/nidhichandarana",
  linkedin: "https://www.linkedin.com/in/nidhichandarana",
  resumeUrl: "/Nidhi Chandarana.pdf",
};

const KPI_CHIPS = [
  { label: "Posts processed", value: "4.6M" },
  { label: "Pipeline success", value: "99.53%" },
  { label: "GPA", value: "3.6/4.0" },
];

type Project = {
  title: string;
  what: string;
  how: string;
  impact: string;
  tags: string[];
  kpiData: { name: string; value: number }[];
  link: string;
};

const PROJECTS = [
  {
    title: "SocialSync — Real-Time Social Media Pipeline",
    what: "Tracked online discourse on sensitive topics in real time.",
    how: "Python producers → Faktory queue → TimescaleDB; VADER & ModerateHatespeech for analysis.",
    impact: "4.6M posts, 99.53% job success; dashboards for stakeholders.",
    tags: ["Python", "TimescaleDB", "Faktory", "APIs", "VADER"],
    kpiData: [
      { name: "Ingest", value: 100 },
      { name: "Queue", value: 92 },
      { name: "Store", value: 88 },
      { name: "Analyze", value: 90 },
    ],
    link: "#",
  },
  {
    title: "Global Health Impact — WHO Data Modeling",
    what: "Cleaned & modeled WHO datasets for impact scoring.",
    how: "Pandas + Google Sheets API; reproducible pipelines & validations.",
    impact: "Accelerated reporting; consistent DALY-based insights.",
    tags: ["Python", "Pandas", "Google Sheets API"],
    kpiData: [
      { name: "Rows", value: 85 },
      { name: "Quality", value: 95 },
      { name: "Speed", value: 80 },
      { name: "Impact", value: 88 },
    ],
    link: "#",
  },
  {
    title: "ISL Recognition (IEEE-Published)",
    what: "Converted Indian Sign Language to bilingual text/audio.",
    how: "OpenCV + scikit-learn; Random Forest ~99.5% accuracy.",
    impact: "Accessible communication; robust classical ML baseline.",
    tags: ["OpenCV", "scikit-learn", "Random Forest"],
    kpiData: [
      { name: "Accuracy", value: 99 },
      { name: "Latency", value: 82 },
      { name: "Robustness", value: 90 },
      { name: "UX", value: 85 },
    ],
    link: "#",
  },
];

const SKILLS_RADAR = [
  { cat: "Python", A: 95 },
  { cat: "SQL", A: 90 },
  { cat: "Data Pipelines", A: 92 },
  { cat: "Cloud (GCP/Azure)", A: 80 },
  { cat: "Visualization", A: 78 },
  { cat: "ML/Analytics", A: 85 },
];

const SKILL_TAGS = [
  "Python", "SQL", "C++", "Pandas", "NumPy", "TimescaleDB", "Postgres",
  "Airflow/Faktory", "Looker", "scikit-learn", "VADER", "APIs", "GCP", "Azure",
];

const NODES = [
  { key: "extract", label: "Extract", icon: Database, target: "section-extract" },
  { key: "transform", label: "Transform", icon: Filter, target: "section-transform" },
  { key: "load", label: "Load", icon: Server, target: "section-load" },
  { key: "query", label: "Query", icon: MousePointerClick, target: "section-query" },
];

/* ---------- particles ---------- */
const Packet = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="h-1.5 w-1.5 rounded-full"
    style={{
      background: "#2ED3B7",
      boxShadow: "0 0 12px rgba(45,212,191,0.9)",
      position: "absolute",
      left: x, top: y
    }}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
  />
);

/* ---------- main ---------- */
export default function Portfolio() {
  const [active, setActive] = useState("extract");
  const [packets, setPackets] = useState<{ x: number; y: number; id: string }[]>([]);

  const spawnPackets = (fromIdx: number, toIdx: number) => {
    const startX = 80 + fromIdx * 220;
    const endX = 80 + toIdx * 220;
    const y = 30;
    const steps = Math.max(6, Math.abs(toIdx - fromIdx) * 8);
    const arr = Array.from({ length: steps }, (_, i) => ({
      x: startX + ((endX - startX) * i) / (steps - 1),
      y: y + Math.sin(i / 2) * 6,
      id: `${Date.now()}-${i}`,
    }));
    setPackets(arr);
    setTimeout(() => setPackets([]), 900);
  };

  const onNavClick = (nodeKey: string) => {
    const fromIdx = NODES.findIndex(n => n.key === active);
    const toIdx = NODES.findIndex(n => n.key === nodeKey);
    spawnPackets(fromIdx, toIdx);
    setActive(nodeKey);
    const target = NODES[toIdx]?.target;
    if (target) scrollToId(target);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const node = NODES.find(n => n.target === id);
          if (node) setActive(node.key);
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });

    NODES.forEach(n => {
      const el = document.getElementById(n.target);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-[#E6EEF5]">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#0B0F14]/70">
        <PipelineNav active={active} onClick={onNavClick} />
      </header>

      {/* EXTRACT / INTRO */}
      <section id="section-extract" className="mx-auto max-w-6xl px-6 pt-16 pb-14">
        <SectionHeader caption="Extract" title="Intro" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{PROFILE.tagline}</h1>
            <p className="text-[#9FB2C7] leading-relaxed">
              I&apos;m {PROFILE.name} — a {PROFILE.title} focused on building reliable, scalable
              data systems and turning messy datasets into crisp insights.
            </p>
            <div className="flex flex-wrap gap-3">
              {KPI_CHIPS.map((c) => (
                <div key={c.label} className="rounded-full border border-teal-300/30 bg-teal-400/10 px-3 py-1.5 text-sm flex items-center gap-2">
                  <span className="font-semibold text-teal-200">{c.value}</span>
                  <span className="text-[#9FB2C7]">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={PROFILE.resumeUrl} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-teal-400/10 hover:bg-teal-400/20 transition border border-teal-300/30">
                <Download className="h-4 w-4" /> Resume
              </a>
              <a href={PROFILE.linkedin} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#10161D] hover:bg-[#131A22] transition border border-white/10">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a href={PROFILE.github} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#10161D] hover:bg-[#131A22] transition border border-white/10">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[#10161D] hover:bg-[#131A22] transition border border-white/10">
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-teal-400/20 to-purple-500/20 blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-[#10161D] p-6">
              <div className="text-sm text-[#9FB2C7]">Data Summary</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <SummaryRow k="Name" v={PROFILE.name} />
                <SummaryRow k="Role" v={PROFILE.title} />
                <SummaryRow k="Location" v={PROFILE.location} />
                <SummaryRow k="Focus" v="ETL, Analytics, Cloud" />
              </div>
              <div className="mt-6 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: "Q1", v: 10 }, { name: "Q2", v: 40 }, { name: "Q3", v: 65 }, { name: "Q4", v: 80 }]}>
                    <XAxis dataKey="name" hide /><YAxis hide /><ReTooltip />
                    <Bar dataKey="v" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORM / PROJECTS */}
      <section id="section-transform" className="mx-auto max-w-6xl px-6 py-14 border-t border-white/5">
        <SectionHeader caption="Transform" title="Internships & Projects" />
        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((p) => <ProjectCard key={p.title} p={p} />)}
        </div>
      </section>

      {/* LOAD / SKILLS */}
      <section id="section-load" className="mx-auto max-w-6xl px-6 py-14 border-t border-white/5">
        <SectionHeader caption="Load" title="Skills" />
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl border border-white/10 bg-[#10161D] p-6 h-[360px]">
            <div className="text-sm text-[#9FB2C7] mb-3">Proficiency Radar</div>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart data={SKILLS_RADAR} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid />
                <PolarAngleAxis dataKey="cat" tick={{ fill: "#9FB2C7", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9FB2C7", fontSize: 10 }} />
                <Radar name="Nidhi" dataKey="A" stroke="#2ED3B7" fill="#2ED3B7" fillOpacity={0.3} />
                <ReTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#10161D] p-6">
            <div className="text-sm text-[#9FB2C7] mb-3">Toolbox</div>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map((t) => (
                <span key={t} className="text-sm rounded-full border border-white/10 bg-[#0B0F14] px-3 py-1 hover:bg-white/5">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUERY / CONTACT */}
      <section id="section-query" className="mx-auto max-w-6xl px-6 py-14 border-t border-white/5">
        <SectionHeader caption="Query" title="Contact" />
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <SQLConsole />
          <ContactForm />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-[#9FB2C7] border-t border-white/5">
        © {new Date().getFullYear()} {PROFILE.name}. Built with React, Tailwind, Framer Motion & Recharts.
      </footer>

      {/* particle layer */}
      <div className="pointer-events-none fixed top-2 left-0 right-0 z-40">
        <div className="relative mx-auto max-w-6xl h-8">
          <AnimatePresence>
            {packets.map(p => <Packet key={p.id} x={p.x} y={p.y} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */
function PipelineNav({ active, onClick }: { active: string; onClick: (k: string) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-4">
      <div className="rounded-3xl border border-white/10 bg-[#10161D]/90 px-4 py-3">
        <div className="relative flex items-center gap-4">
          {NODES.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.key;
            return (
              <button
                key={n.key}
                onClick={() => onClick(n.key)}
                className="group relative flex items-center gap-3"
                aria-label={`Go to ${n.label}`}
              >
                <motion.span
                  className={`grid place-items-center h-9 w-9 rounded-full border ${isActive ? "border-teal-300/60 bg-teal-400/10" : "border-white/10 bg-[#0B0F14]"}`}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-teal-300" : "text-[#9FB2C7]"}`} />
                </motion.span>
                <span className={`text-sm ${isActive ? "text-teal-200" : "text-[#9FB2C7]"}`}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ caption, title }: { caption: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.2em] text-teal-300/90">{caption}</div>
      <h2 className="text-2xl md:text-3xl font-semibold mt-1">{title}</h2>
    </div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B0F14] px-3 py-2">
      <span className="text-[#9FB2C7]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-[#10161D] p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
        <a href={p.link} className="text-sm text-teal-300 hover:underline inline-flex items-center gap-1">
          Case Study <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="text-sm text-[#9FB2C7]"><strong className="text-[#E6EEF5]">What:</strong> {p.what}</p>
      <p className="text-sm text-[#9FB2C7]"><strong className="text-[#E6EEF5]">How:</strong> {p.how}</p>
      <p className="text-sm text-[#9FB2C7]"><strong className="text-[#E6EEF5]">Impact:</strong> {p.impact}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {p.tags.map((t: string) => (
          <span key={t} className="text-xs rounded-full border border-white/10 bg-[#0B0F14] px-2.5 py-1">{t}</span>
        ))}
      </div>

      <div className="h-40 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={p.kpiData}>
            <XAxis dataKey="name" stroke="#9FB2C7" fontSize={12} />
            <YAxis stroke="#9FB2C7" fontSize={12} />
            <ReTooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function SQLConsole() {
  const rows = [
    { channel: "LinkedIn", link: PROFILE.linkedin },
    { channel: "GitHub", link: PROFILE.github },
    { channel: "Email", link: PROFILE.email },
    { channel: "Resume", link: PROFILE.resumeUrl },
  ];
  return (
    <div className="rounded-3xl border border-white/10 bg-[#10161D] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-[#9FB2C7]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2">psql — contacts</span>
      </div>
      <div className="p-4 font-mono text-sm">
        <div className="text-[#9FB2C7]">SELECT * FROM contacts WHERE name = 'Nidhi Chandarana';</div>
        <div className="mt-3 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#9FB2C7] border-b border-white/10">
                <th className="py-2 pr-4">channel</th>
                <th className="py-2">link</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.channel} className="border-b border-white/5">
                  <td className="py-2 pr-4 text-teal-200">{r.channel}</td>
                  <td className="py-2">
                    {r.channel === "Email" ? (
                      <a className="hover:underline" href={`mailto:${r.link}`}>{r.link}</a>
                    ) : (
                      <a className="hover:underline" href={r.link} target="_blank" rel="noreferrer">{r.link}</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 
  Contact form here is the simple UI version.
  If you already wired the /api/contact Resend route earlier,
  you can swap back to the “fetch('/api/contact')” version we added.
*/
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      body: formData.get("body"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#10161D] p-6">
      <div className="text-sm text-[#9FB2C7] mb-3">INSERT — message</div>
      {!submitted ? (
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-[#9FB2C7]">name</span>
            <input name="name" required className="rounded-xl bg-[#0B0F14] border border-white/10 px-3 py-2 outline-none focus:border-teal-300/60" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-[#9FB2C7]">email</span>
            <input type="email" name="email" required className="rounded-xl bg-[#0B0F14] border border-white/10 px-3 py-2 outline-none focus:border-teal-300/60" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-[#9FB2C7]">subject</span>
            <input name="subject" className="rounded-xl bg-[#0B0F14] border border-white/10 px-3 py-2 outline-none focus:border-teal-300/60" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-[#9FB2C7]">body</span>
            <textarea name="body" rows={4} className="rounded-xl bg-[#0B0F14] border border-white/10 px-3 py-2 outline-none focus:border-teal-300/60" />
          </label>
          <button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 bg-teal-400/10 hover:bg-teal-400/20 transition border border-teal-300/30">
            {loading ? "SENDING…" : "INSERT INTO messages VALUES (…)"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="font-mono text-sm text-teal-200">
          INSERT 1 ✓ — thanks for reaching out!
        </div>
      )}
    </div>
  );
}

