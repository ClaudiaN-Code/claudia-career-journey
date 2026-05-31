"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Milestone } from "./Milestone";
import { MotionMilestone } from "./MotionMilestone";
import recommendationsData from "@/data/recommendations.json";
import postsData from "@/data/posts.json";
import resumeData from "@/data/resume.json";
import buildsData from "@/data/builds.json";

const TABS = ["About", "Professional History", "Skills & Tools", "Clients", "Recommendations", "Writing", "Builds & Projects"] as const;
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

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section id="journey" className="pt-10 pb-16 px-4" style={{ background: "#f5e8d0" }}>
      <div className="max-w-3xl mx-auto">

        {/* Mobile: black pill bubbles */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:hidden">
          {TABS.map((tab) => (
            <motion.button
              key={`mob-${tab}`}
              onClick={() => setActive(tab)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: active === tab ? "#c4622d" : "#1a1410",
                color: "#faf9f6",
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>
        <div className="mb-8 md:hidden" style={{ height: "2px", background: "linear-gradient(to right, transparent, rgba(196,98,45,0.5) 50%, transparent)", borderRadius: "9999px" }} />

        {/* Desktop: underline tabs with hover animation */}
        <div className="pt-2 hidden md:block">
          <div
            className="flex justify-between border-b mb-10"
            style={{ borderColor: "#d4c4b0" }}
          >
            {TABS.map((tab) => (
              <motion.button
                key={`desk-${tab}`}
                onClick={() => setActive(tab)}
                whileHover={{ y: -5, scale: 1.13, color: "#c4622d" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                className="relative pb-3 text-sm font-medium whitespace-nowrap cursor-pointer"
                style={{ color: active === tab ? "#c4622d" : "#6b5a4a" }}
              >
                {tab}
                {active === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 z-10"
                    style={{ height: "2px", background: "#c4622d", borderRadius: "9999px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* About */}
        {active === "About" && (
          <div className="space-y-10">
            <div className="space-y-5">
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-1"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                The Full Picture
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
                    <div key={i} className="flex items-center gap-4 rounded-xl border border-[#e8ddd0] bg-white/60 px-5 py-4 transition-all duration-150 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:border-[#c4622d]/40 hover:bg-white cursor-default">
                      {aff.logoUrl && (
                        <img
                          src={aff.logoUrl}
                          alt={aff.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-heading font-semibold text-[#1a1410]">{aff.name}</p>
                        <p className="text-[#6b5a4a] text-sm">{aff.role} · Since {aff.since}</p>
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
              My Professional Journey
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
                My Toolkit
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                These are the skills I rely on and the tools I have worked with across my career, reflecting how I actually operate: practically, collaboratively, and with an eye toward what genuinely moves work forward. The AI section reflects my curiosity and my ongoing effort to understand what these tools can actually do in a real work context.
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
                The Work in Practice
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                These are some of the companies I have supported directly, from project delivery and client services to the operational details that keep engagements running smoothly.
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
              In Their Own Words
            </h2>
            <p className="text-[#6b5a4a] text-base leading-relaxed mb-8">
              Some of the people I have worked most closely with have also become some of my longest professional relationships. A few of them have brought me into their next companies because of the trust we built working together. Here is what some of them have said.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {recommendationsData.map((rec, i) => (
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
                In My Own Words
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                Things I have been thinking about and writing about on LinkedIn. I write about operations, alignment, and the practical side of how work actually gets done.
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
          const b = buildsData;
          return (
          <div className="space-y-12">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Things I&apos;ve Built
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">{b.intro}</p>
            </div>

            {/* Work */}
            <div className="space-y-5">
              <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase">Work</p>
              <p className="text-[#6b5a4a] text-sm leading-relaxed -mt-2">{b.workIntro}</p>

              {b.workProjects.map(proj => {
                const sections = [
                  {
                    id: `${proj.id}-need`,
                    label: "The Need",
                    content: (
                      <div className="space-y-3 text-sm text-[#6b5a4a] leading-relaxed">
                        <p>{proj.needP1}</p>
                        <p>{proj.needP2}</p>
                      </div>
                    ),
                  },
                  {
                    id: `${proj.id}-does`,
                    label: "What It Does",
                    content: (
                      <ul className="space-y-2 text-sm text-[#6b5a4a]">
                        {proj.whatItDoesBullets.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0d8a8a] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    id: `${proj.id}-impact`,
                    label: "Business Impact",
                    content: (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {proj.businessImpactItems.map((item, i) => (
                          <div key={i} className="rounded-xl border border-[#0d8a8a]/15 bg-white/70 px-4 py-3">
                            <p className="font-semibold text-[#1a1410] text-xs mb-1">{item.label}</p>
                            <p className="text-[#6b5a4a] text-xs leading-relaxed">{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: `${proj.id}-docs`,
                    label: "How It's Documented",
                    content: (
                      <div className="space-y-3 text-sm text-[#6b5a4a] leading-relaxed">
                        <p>{proj.docsP1}</p>
                        <p>{proj.docsP2}</p>
                      </div>
                    ),
                  },
                ];
                return (
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
                      <p className="text-[#6b5a4a] text-sm leading-relaxed">{proj.overviewP1}</p>
                      <p className="text-[#6b5a4a] text-sm leading-relaxed mt-2">{proj.overviewP2}</p>
                    </div>
                    <div className="h-px mx-6" style={{ background: "rgba(13,138,138,0.12)" }} />
                    <div className="divide-y divide-[#0d8a8a]/10">
                      {sections.map(({ id, label, content }) => (
                        <div key={id}>
                          <button
                            onClick={() => toggleSection(id)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#0d8a8a]/5"
                          >
                            <span className="text-sm font-semibold text-[#1a1410]">{label}</span>
                            <span
                              className="text-[#0d8a8a] text-lg font-light leading-none transition-transform duration-200"
                              style={{ transform: openSections.has(id) ? "rotate(45deg)" : "rotate(0deg)" }}
                            >
                              +
                            </span>
                          </button>
                          {openSections.has(id) && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-6 pb-5"
                            >
                              {content}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Personal */}
            <div className="space-y-5">
              <p className="text-[#c4622d] font-bold text-xs tracking-widest uppercase">Personal</p>
              <p className="text-[#6b5a4a] text-sm leading-relaxed -mt-2">{b.personalIntro}</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {b.personalProjects.map((item) => {
                  const imgs = (item as typeof item & { imageUrls?: string[] }).imageUrls ?? [];
                  const idx = carouselIdx[item.id] ?? 0;
                  const prev = () => setCarouselIdx(c => ({ ...c, [item.id]: (idx - 1 + imgs.length) % imgs.length }));
                  const next = () => setCarouselIdx(c => ({ ...c, [item.id]: (idx + 1) % imgs.length }));
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#e8ddd0] bg-white/60 overflow-hidden flex flex-col"
                    >
                      {imgs.length > 0 ? (
                        <div className="relative w-full h-44 overflow-hidden" style={{ background: "#f5e8d0" }}>
                          <img
                            src={imgs[idx]}
                            alt={`${item.title} screenshot ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {imgs.length > 1 && (
                            <>
                              <button
                                onClick={prev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-100 opacity-70"
                                style={{ background: "rgba(26,20,16,0.55)", color: "#faf9f6" }}
                              >
                                ‹
                              </button>
                              <button
                                onClick={next}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-100 opacity-70"
                                style={{ background: "rgba(26,20,16,0.55)", color: "#faf9f6" }}
                              >
                                ›
                              </button>
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                                {imgs.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setCarouselIdx(c => ({ ...c, [item.id]: i }))}
                                    className="w-1.5 h-1.5 rounded-full transition-all"
                                    style={{ background: i === idx ? "#faf9f6" : "rgba(250,249,246,0.45)" }}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-full h-44 flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #f5e8d0 0%, #ede0cc 100%)" }}
                        >
                          <span className="text-[#c4622d]/30 text-xs font-medium tracking-widest uppercase">Screenshot coming soon</span>
                        </div>
                      )}
                      <div className="px-5 py-4 flex flex-col gap-2">
                        <p className="font-semibold text-[#1a1410] text-sm">{item.title}</p>
                        <div className="space-y-2">
                          {item.description.split("\n\n").map((para, i) => (
                            <p key={i} className="text-[#6b5a4a] text-xs leading-relaxed">{para}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })()}


      </div>
    </section>
  );
}
