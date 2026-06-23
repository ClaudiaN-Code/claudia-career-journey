"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Milestone } from "./Milestone";
import { MotionMilestone } from "./MotionMilestone";
import recommendationsData from "@/data/recommendations.json";
import postsData from "@/data/posts.json";
import resumeData from "@/data/resume.json";
import buildsData from "@/data/builds.json";
import contentData from "@/data/content.json";

const TABS = ["About", "Professional History", "Builds & Projects", "Skills & Tools", "Clients", "Recommendations", "Writing"] as const;
type Tab = (typeof TABS)[number];

interface AdditionalRole {
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

interface ExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string | null;
  description?: string | null;
  clients?: string | null;
  bullets?: string[];
  iconCategory?: string;
  emphasis?: string;
  additionalRoles?: AdditionalRole[];
}

interface Affiliation {
  name: string;
  role: string;
  since: string;
  logoUrl?: string;
}

interface JourneyTabsProps {
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
  education: Array<{ institution: string; degree: string; field: string; start?: string | null; end?: string | null; location?: string | null }>;
  certifications: string[];
  languages: string[];
  clients: { b2b: string[]; b2c: string[] };
  affiliations: Affiliation[];
}

export function JourneyTabs({
  summary,
  experience,
  skills,
  education,
  certifications,
  languages,
  clients,
  affiliations,
}: JourneyTabsProps) {
  const [active, setActive] = useState<Tab>("About");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const [carouselIdx, setCarouselIdx] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => setActive(e.detail as Tab);
    window.addEventListener("setJourneyTab", handler as EventListener);
    return () => window.removeEventListener("setJourneyTab", handler as EventListener);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => prev && prev.imgs.length > 1 ? { ...prev, idx: (prev.idx + 1) % prev.imgs.length } : prev);
      if (e.key === "ArrowLeft") setLightbox(prev => prev && prev.imgs.length > 1 ? { ...prev, idx: (prev.idx - 1 + prev.imgs.length) % prev.imgs.length } : prev);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <>
    {lightbox && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        onClick={() => setLightbox(null)}
      >
        {/* Image */}
        <motion.img
          key={lightbox.idx}
          src={lightbox.imgs[lightbox.idx]}
          alt={`Screenshot ${lightbox.idx + 1}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="max-w-[88vw] max-h-[84vh] object-contain rounded-xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        />

        {/* Close */}
        <button
          onClick={() => setLightbox(null)}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white text-xl font-light hover:bg-white/20 transition-colors"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          ×
        </button>

        {/* Prev arrow */}
        {lightbox.imgs.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); setLightbox(prev => prev ? { ...prev, idx: (prev.idx - 1 + prev.imgs.length) % prev.imgs.length } : prev); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white text-2xl hover:bg-white/20 transition-colors"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {lightbox.imgs.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); setLightbox(prev => prev ? { ...prev, idx: (prev.idx + 1) % prev.imgs.length } : prev); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white text-2xl hover:bg-white/20 transition-colors"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            ›
          </button>
        )}

        {/* Dot indicators */}
        {lightbox.imgs.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {lightbox.imgs.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightbox(prev => prev ? { ...prev, idx: i } : prev); }}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === lightbox.idx ? "#fff" : "rgba(255,255,255,0.35)" }}
              />
            ))}
          </div>
        )}
      </div>
    )}
    <section id="journey" className="pt-10 pb-16 px-4" style={{ background: "#f5e8d0" }}>
      <div className="max-w-3xl mx-auto">

               {/* Folder-style tab navigation */}
        <div className="relative mb-10 -mx-4 px-4">
          <div className="overflow-x-auto pb-1">
            <div
              className="flex w-max min-w-full items-end gap-1 border-b-2"
              style={{ borderColor: "#c4b49a" }}
            >
              {TABS.map((tab) => {
                const isActive = active === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActive(tab)}
                    className="relative -mb-[2px] shrink-0 whitespace-nowrap rounded-t-md border-2 px-3 py-2 text-xs font-semibold transition-colors duration-150 sm:px-4 sm:text-sm"
                    style={{
                      borderColor: "#c4b49a",
                      borderBottomColor: isActive ? "#f5e8d0" : "#c4b49a",
                      background: isActive ? "#f5e8d0" : "#ddc9a3",
                      color: isActive ? "#c4622d" : "#6b5a4a",
                      boxShadow: isActive ? "0 -2px 8px rgba(0,0,0,0.07)" : "none",
                      zIndex: isActive ? 2 : 1,
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* About */}
        {active === "About" && (
          <div className="space-y-10">
            <div className="space-y-5">
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {contentData.about.heading}
              </h2>
              {summary.split("\n\n").map((para, i) => (
                <p key={i} className="text-[#1a1410] text-base leading-relaxed">{para}</p>
              ))}
            </div>

            {education.length > 0 && (
              <div>
                <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-4">
                  Education
                </p>
                <div className="space-y-2">
                  {education.map((edu, i) => (
                    <div key={i} className="rounded-xl border border-[#e8ddd0] bg-white/60 px-5 py-4 transition-all duration-150 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default">
                      <p className="font-heading font-semibold text-[#1a1410]">{edu.institution}</p>
                      <p className="text-[#6b5a4a] text-sm">{edu.degree} · {edu.field}</p>
                      {edu.location && <p className="text-[#6b5a4a]/60 text-xs mt-0.5">{edu.location}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {affiliations.length > 0 && (
              <div>
                <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-4">
                  Affiliations
                </p>
                <div className="space-y-2">
                  {affiliations.map((aff, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-full border border-[#e8ddd0] bg-white/60 px-4 py-2 transition-all duration-150 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default">
                      {aff.logoUrl && (
                        <img
                          src={aff.logoUrl}
                          alt={aff.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-heading font-semibold text-[#1a1410] text-sm">{aff.name}</p>
                        <p className="text-[#6b5a4a] text-xs">{aff.role} · Since {aff.since}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(certifications.length > 0 || languages.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-8">
                {certifications.length > 0 && (
                  <div>
                    <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-3">
                      Certifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, i) => {
                        const [certTitle, meta] = cert.split(" — ");
                        return (
                          <div
                            key={i}
                            className="px-4 py-2.5 rounded-xl border border-[#e8ddd0] bg-white/60 text-sm transition-all duration-150 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                          >
                            <span className="font-bold text-[#1a1410]">{certTitle}</span>
                            {meta && (
                              <span className="text-[#6b5a4a]/70 text-xs ml-2">· {meta}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {languages.length > 0 && (
                  <div>
                    <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-3">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm bg-white/60 border border-[#e8ddd0] text-[#1a1410] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Professional History */}
        {active === "Professional History" && (
          <div className="space-y-8">
            <h2
              className="font-bold text-2xl text-[#1a1410]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {contentData.professionalHistory.heading}
            </h2>
            <div className="relative">
              <div
                className="absolute left-4 top-0 bottom-0 w-px"
                style={{
                  background: "linear-gradient(to bottom, transparent, #c4622d 5%, #c4622d 95%, transparent)",
                  opacity: 0.2,
                }}
              />
            <div className="space-y-6 pl-12">
              {experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{
                      background: exp.emphasis === "now" ? "linear-gradient(135deg, #c4622d, #e8a87c)" : "rgba(196,98,45,0.25)",
                      borderColor: exp.emphasis === "now" ? "#c4622d" : "rgba(196,98,45,0.35)",
                      boxShadow: exp.emphasis === "now" ? "0 0 10px rgba(196,98,45,0.4)" : undefined,
                      left: "-2.25rem",
                      top: exp.company.toLowerCase().includes("family") ? "0.75rem" : "1.5rem",
                    }}
                  />
                  <MotionMilestone index={i}>
                    <Milestone
                      company={exp.company}
                      title={exp.title}
                      startDate={exp.startDate}
                      endDate={exp.endDate}
                      location={exp.location}
                      description={exp.description}
                      clients={exp.clients}
                      bullets={exp.bullets}
                      iconCategory={exp.iconCategory}
                      emphasis={exp.emphasis}
                      additionalRoles={exp.additionalRoles}
                    />
                  </MotionMilestone>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Skills & Tools */}
        {active === "Skills & Tools" && (() => {
          const aiTools = new Set(["Claude", "Claude Code", "Claude Cowork", "Chat GPT", "Chat GPT Codex", "Microsoft Copilot", "Lovable"]);
          const softwareTools = new Set(["Microsoft Office", "Google Workspace", "QuickBooks Online", "Workday", "NetSuite", "Asana", "Slack"]);
          return (
          <div className="space-y-8">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {contentData.skills.heading}
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                {contentData.skills.intro}
              </p>
            </div>

            <div>
              <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase mb-5">
                Core Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => !aiTools.has(s) && !softwareTools.has(s))
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 border border-[#e8ddd0] text-[#1a1410] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase mb-5">
                Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => softwareTools.has(s))
                  .map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium border border-[#d4c4b0] text-[#6b5a4a] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                      style={{ background: "rgba(212,196,176,0.18)" }}
                    >
                      {tool}
                    </span>
                  ))}
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase">
                AI Stack
              </p>
              {[
                { label: "AI Assistants", tools: ["Claude", "Chat GPT", "Microsoft Copilot"] },
                { label: "Coding & Dev", tools: ["Claude Code", "Chat GPT Codex"] },
                { label: "Builders", tools: ["Claude Cowork", "Lovable"] },
              ].map(({ label, tools }) => (
                <div key={label}>
                  <p className="text-[#6b5a4a]/60 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-sm font-medium border border-[#0d8a8a]/40 text-[#0d8a8a] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#0d8a8a]/70 cursor-default"
                        style={{ background: "rgba(13,138,138,0.07)" }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

        {/* Clients */}
        {active === "Clients" && (
          <div className="space-y-8">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {contentData.clients.heading}
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                {contentData.clients.intro}
              </p>
            </div>
            {clients.b2b.length > 0 && (
              <div>
                <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-3">B2B</p>
                <div className="flex flex-wrap gap-2">
                  {clients.b2b.map((client, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 border border-[#e8ddd0] text-[#1a1410] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {clients.b2c.length > 0 && (
              <div>
                <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-3">B2C</p>
                <div className="flex flex-wrap gap-2">
                  {clients.b2c.map((client, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 border border-[#e8ddd0] text-[#1a1410] transition-all duration-150 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {active === "Recommendations" && (
          <div>
            <h2
              className="font-bold text-2xl text-[#1a1410] mb-3"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              {contentData.recommendations.heading}
            </h2>
            <p className="text-[#6b5a4a] text-base leading-relaxed mb-8">
              {contentData.recommendations.intro}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(Object.values(recommendationsData) as {name:string;title:string;company:string;relationship:string;quote:string}[]).map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl p-6 flex flex-col gap-3 h-full cursor-default border border-[#c4622d]/20 bg-white border-l-4 border-l-[#c4622d]/40"
                    style={{ background: "linear-gradient(135deg, #fff8f4 0%, #ffffff 60%)" }}
                  >
                    <span
                      className="text-5xl leading-none select-none -mb-2"
                      style={{ color: "#c4622d", opacity: 0.75, fontFamily: "Georgia, serif" }}
                    >
                      &ldquo;
                    </span>
                    <p className="text-[#6b5a4a] text-sm leading-relaxed flex-1">
                      {rec.quote}
                    </p>
                    <div className="pt-3 border-t border-[#c4622d]/15">
                      <p className="text-[#1a1410] font-semibold text-sm">{rec.name}</p>
                      <p className="text-[#6b5a4a]/60 text-xs mt-0.5">
                        {rec.title}{rec.company ? ` · ${rec.company}` : ""}
                      </p>
                      <a
                        href="https://www.linkedin.com/in/claudianasraty/details/recommendations/?detailScreenTabIndex=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[10px] text-[#c4622d]/60 hover:text-[#c4622d] transition-colors"
                      >
                        View full recommendation on LinkedIn ↗
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Writing */}
        {active === "Writing" && (
          <div className="space-y-8">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {contentData.writing.heading}
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                {contentData.writing.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {postsData.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-[#e8ddd0] bg-white flex flex-col p-6 gap-4 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/30"
                >
                  <span className="self-start px-3 py-1 rounded-full text-xs font-medium border border-[#c4622d]/25 text-[#c4622d]"
                    style={{ background: "rgba(196,98,45,0.07)" }}
                  >
                    {post.tag}
                  </span>

                  <p className="text-[#1a1410] text-sm leading-relaxed flex-1">
                    &ldquo;{post.excerpt}&rdquo;
                  </p>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start flex items-center gap-1.5 text-xs font-medium text-[#c4622d] hover:text-[#a8501f] transition-colors"
                  >
                    Read on LinkedIn
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Builds & Projects */}
        {active === "Builds & Projects" && (() => {
          const b = buildsData as typeof buildsData & {
            workProjects: Array<{
              id: string; title: string; subtitle: string; badge: string;
              overview: string[];
              sections: Array<{
                id: string; label: string;
                paragraphs?: string[];
                bullets?: string[];
                items?: { label: string; detail: string }[];
              }>;
            }>;
          };

          const renderSectionContent = (sec: typeof b.workProjects[0]["sections"][0]) => {
            if (sec.bullets) return (
              <ul className="space-y-2 text-sm text-[#6b5a4a]">
                {sec.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0d8a8a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            );
            if (sec.items) return (
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-[#0d8a8a]/15 bg-white/70 px-4 py-3">
                    <p className="font-semibold text-[#1a1410] text-xs mb-1">{item.label}</p>
                    <p className="text-[#6b5a4a] text-xs leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            );
            return (
              <div className="space-y-3 text-sm text-[#6b5a4a] leading-relaxed">
                {(sec.paragraphs ?? []).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            );
          };

          return (
          <div className="space-y-10">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Things I&apos;ve Built
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">{b.intro}</p>
            </div>

            <div className="space-y-5">
              <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase">Work</p>
              <p className="text-[#6b5a4a] text-sm leading-relaxed -mt-2">{b.workIntro}</p>

              {b.workProjects.map(proj => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-[#0d8a8a]/20 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f0fafa 0%, #ffffff 60%)" }}
                >
                  <div className="px-6 pt-6 pb-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3
                          className="font-bold text-lg text-[#1a1410]"
                          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                        >
                          {proj.title}
                        </h3>
                        <p className="text-[#0d8a8a] text-xs font-medium mt-0.5">{proj.subtitle}</p>
                      </div>
                      <span
                        className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border border-[#0d8a8a]/25 text-[#0d8a8a]"
                        style={{ background: "rgba(13,138,138,0.07)" }}
                      >
                        {proj.badge}
                      </span>
                    </div>
                    {proj.overview.map((p, i) => (
                      <p key={i} className={`text-[#6b5a4a] text-sm leading-relaxed${i > 0 ? " mt-2" : ""}`}>{p}</p>
                    ))}
                  </div>
                  <div className="h-px mx-6" style={{ background: "rgba(13,138,138,0.12)" }} />
                  <div className="divide-y divide-[#0d8a8a]/10">
                    {proj.sections.map(sec => {
                      const secId = `${proj.id}-${sec.id}`;
                      return (
                        <div key={secId}>
                          <button
                            onClick={() => toggleSection(secId)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#0d8a8a]/5"
                          >
                            <span className="text-sm font-semibold text-[#1a1410]">{sec.label}</span>
                            <span
                              className="text-[#0d8a8a] text-lg font-light leading-none transition-transform duration-200"
                              style={{ transform: openSections.has(secId) ? "rotate(45deg)" : "rotate(0deg)" }}
                            >
                              +
                            </span>
                          </button>
                          {openSections.has(secId) && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-6 pb-5"
                            >
                              {renderSectionContent(sec)}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}


      </div>
    </section>
    </>
  );
}
