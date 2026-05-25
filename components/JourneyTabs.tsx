"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Milestone } from "./Milestone";
import { MotionMilestone } from "./MotionMilestone";
import recommendationsData from "@/data/recommendations.json";
import postsData from "@/data/posts.json";

const TABS = ["About", "Professional History", "Skills & Tools", "Clients", "Recommendations", "Writing", "Contact"] as const;
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

interface JourneyTabsProps {
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
  contact: { email?: string | null; location?: string | null; phone?: string | null };
  links: { linkedin?: string | null; github?: string | null };
  education: Array<{ institution: string; degree: string; field: string; start?: string | null; end?: string | null }>;
  certifications: string[];
  languages: string[];
  clients: { b2b: string[]; b2c: string[] };
}

export function JourneyTabs({
  summary,
  experience,
  skills,
  contact,
  links,
  education,
  certifications,
  languages,
  clients,
}: JourneyTabsProps) {
  const [active, setActive] = useState<Tab>("About");

  return (
    <section id="journey" className="py-16 px-4" style={{ background: "#f5e8d0" }}>
      <div className="max-w-3xl mx-auto">

        {/* Tab bar — pill bubbles, centered natural flow */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActive(tab)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                background: active === tab ? "#c4622d" : "#1a1410",
                color: "#faf9f6",
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#d4c4b0] mb-10" />

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
                    <div key={i} className="rounded-xl border border-[#e8ddd0] bg-white/60 px-5 py-4">
                      <p className="font-heading font-semibold text-[#1a1410]">{edu.institution}</p>
                      <p className="text-[#6b5a4a] text-sm">{edu.degree} · {edu.field}</p>
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
                AI
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

        {/* Contact */}
        {active === "Contact" && (
          <div className="space-y-8">
            <div>
              <h2
                className="font-bold text-2xl text-[#1a1410] mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Let&apos;s Connect
              </h2>
              <p className="text-[#6b5a4a] text-base leading-relaxed">
                If you are looking for someone who is fully invested, not just in the work but in the people and the company behind it, I would love to connect.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {links.linkedin && (
                <a
                  href={links.linkedin.startsWith("http") ? links.linkedin : `https://${links.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-full border border-[#e8ddd0] bg-white/60 px-4 py-2.5 hover:border-[#c4622d]/40 hover:bg-white transition-all"
                >
                  <span className="text-[#c4622d] font-bold text-xs">in</span>
                  <span className="text-[#1a1410] text-sm font-medium">LinkedIn</span>
                </a>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 rounded-full border border-[#e8ddd0] bg-white/60 px-4 py-2.5 hover:border-[#c4622d]/40 hover:bg-white transition-all"
                >
                  <span className="text-[#c4622d] text-xs">@</span>
                  <span className="text-[#1a1410] text-sm font-medium">{contact.email}</span>
                </a>
              )}

              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2.5 rounded-full border border-[#e8ddd0] bg-white/60 px-4 py-2.5 hover:border-[#c4622d]/40 hover:bg-white transition-all"
                >
                  <span className="text-[#c4622d] text-xs">✆</span>
                  <span className="text-[#1a1410] text-sm font-medium">{contact.phone}</span>
                </a>
              )}

              {contact.location && (
                <div className="flex items-center gap-2.5 rounded-full border border-[#e8ddd0] bg-white/60 px-4 py-2.5">
                  <span className="text-[#c4622d] text-xs">📍</span>
                  <span className="text-[#1a1410] text-sm font-medium">{contact.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
