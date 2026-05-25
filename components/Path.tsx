import { Milestone } from "./Milestone";
import { MotionMilestone } from "./MotionMilestone";

interface ExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string | null;
  description?: string | null;
  bullets?: string[];
  iconCategory?: string;
  emphasis?: string;
}

interface SkillsEntry {
  skills: string[];
}

interface PathProps {
  experience: ExperienceEntry[];
  skills: string[];
  name: string;
}

export function Path({ experience, skills, name }: PathProps) {
  return (
    <section id="journey" className="relative py-24 px-4" style={{ background: "#f5e8d0" }}>
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#c4622d] font-medium text-sm tracking-widest uppercase mb-3">
            The Journey
          </p>
          <h2 className="font-heading font-bold text-4xl text-[#1a1410]">
            17 years of building things that work
          </h2>
        </div>

        {/* Vertical path */}
        <div className="relative">
          {/* The line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #f97316 5%, #fbbf24 50%, #f97316 95%, transparent)",
              opacity: 0.3,
            }}
          />

          {/* Milestones */}
          <div className="space-y-6 pl-12">
            {experience.map((exp, i) => (
              <div key={i} className="relative">
                {/* Dot on the line */}
                <div
                  className="absolute -left-12 top-6 w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    background:
                      exp.emphasis === "now"
                        ? "linear-gradient(135deg, #f97316, #fbbf24)"
                        : "rgba(249,115,22,0.3)",
                    borderColor:
                      exp.emphasis === "now" ? "#f97316" : "rgba(249,115,22,0.4)",
                    boxShadow:
                      exp.emphasis === "now"
                        ? "0 0 12px rgba(249,115,22,0.6)"
                        : undefined,
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
                    bullets={exp.bullets}
                    iconCategory={exp.iconCategory}
                    emphasis={exp.emphasis}
                  />
                </MotionMilestone>
              </div>
            ))}

            {/* Skills milestone */}
            <div className="relative">
              <div
                className="absolute -left-9 top-6 w-4 h-4 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0d8a8a, #0db8b8)",
                  boxShadow: "0 0 12px rgba(13,138,138,0.4)",
                }}
              />
              <MotionMilestone index={experience.length}>
                <div className="rounded-2xl border border-[#0d8a8a]/20 bg-[#0d8a8a]/5 p-6">
                  <p className="text-[#0d8a8a] font-bold text-xs tracking-widest uppercase mb-4">
                    Tools &amp; Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          skill === "Claude Code" || skill === "vibe coding"
                            ? "border border-[#0d8a8a]/40 text-[#0d8a8a]"
                            : "bg-white/60 text-[#1a1410]/70 border border-[#e8ddd0]"
                        }`}
                        style={
                          skill === "Claude Code" || skill === "vibe coding"
                            ? { background: "rgba(13,138,138,0.08)" }
                            : undefined
                        }
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </MotionMilestone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
