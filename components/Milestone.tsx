import {
  Settings,
  Megaphone,
  Code,
  Palette,
  TrendingUp,
  GraduationCap,
  Compass,
  LineChart,
  Stethoscope,
  Rocket,
  PenTool,
  Search,
  Sparkles,
  Heart,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Operations: Settings,
  Marketing: Megaphone,
  Engineering: Code,
  Design: Palette,
  Sales: TrendingUp,
  Teaching: GraduationCap,
  Product: Compass,
  Finance: LineChart,
  Healthcare: Stethoscope,
  Founder: Rocket,
  Writing: PenTool,
  Research: Search,
  Family: Heart,
};

interface AdditionalRole {
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  clients?: string | null;
}

interface MilestoneProps {
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
  side?: "left" | "right";
  additionalRoles?: AdditionalRole[];
}

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function Milestone({
  company,
  title,
  startDate,
  endDate,
  location,
  description,
  clients,
  bullets = [],
  iconCategory = "Operations",
  emphasis,
  side = "right",
  additionalRoles = [],
}: MilestoneProps) {
  const Icon = iconMap[iconCategory] ?? Sparkles;
  const isNow = emphasis === "now";
  const isEarly = emphasis === "early";
  const isFamily = company.toLowerCase().includes("family") || company.toLowerCase().includes("pause");

  if (isFamily) {
    return (
      <div className="flex items-center gap-3 py-4 px-6 rounded-full border border-[#e8ddd0] bg-white/60 text-[#6b5a4a] text-sm italic w-fit mx-auto transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ddd0]/80">
        <Heart size={14} className="text-pink-400" />
        <span>Family leave · {formatDate(startDate)} – {formatDate(endDate)}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg ${
        isNow
          ? "border-[#c4622d]/30 bg-white shadow-lg"
          : "border-[#e8ddd0] bg-white hover:border-[#c4622d]/30"
      }`}
      style={
        isNow
          ? { boxShadow: "0 4px 24px rgba(196,98,45,0.10)" }
          : undefined
      }
    >
      {/* Tags */}
      {isNow && (
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#c4622d]/10 text-[#c4622d] text-xs font-bold tracking-wider uppercase border border-[#c4622d]/20">
          where I am now
        </span>
      )}
      {isEarly && (
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#f5ece0] text-[#6b5a4a] text-xs font-medium tracking-wider uppercase border border-[#e8ddd0]">
          my early career
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            isNow ? "bg-[#c4622d]/10" : "bg-[#f5ece0]"
          }`}
        >
          <Icon
            size={18}
            className={isNow ? "text-[#c4622d]" : "text-[#6b5a4a]"}
          />
        </div>

        <div className="flex-1 min-w-0">
          {additionalRoles.length > 0 ? (
            /* Multi-role layout: company header, all titles stacked, then descriptions */
            (() => {
              const allStartDates = [startDate, ...additionalRoles.map(r => r.startDate)];
              const allEndDates = [endDate, ...additionalRoles.map(r => r.endDate)];
              const overallStart = [...allStartDates].sort()[0];
              const overallEnd = allEndDates.includes("Present")
                ? "Present"
                : [...allEndDates].sort().reverse()[0];

              return (
                <>
                  <p className={`font-semibold text-sm mb-0.5 text-[#c4622d]`}>
                    {company}
                  </p>
                  <p className="text-[#6b5a4a]/60 text-xs mb-3">
                    {formatDate(overallStart)} – {formatDate(overallEnd)}
                    {location && ` · ${location}`}
                  </p>

                  {/* All titles stacked together */}
                  <div className="mb-4 space-y-3">
                    <div>
                      <h3 className={`font-heading font-bold text-lg leading-tight text-[#1a1410]`}>
                        {title}
                      </h3>
                      <p className="text-[#6b5a4a]/60 text-xs mt-0.5">
                        {formatDate(startDate)} – {formatDate(endDate)}
                      </p>
                      {clients && (
                        <p className="text-[#6b5a4a]/70 text-xs mt-1 italic">{clients}</p>
                      )}
                    </div>
                    {additionalRoles.map((role, i) => (
                      <div key={i}>
                        <h3 className={`font-heading font-bold text-lg leading-tight text-[#1a1410]`}>
                          {role.title}
                        </h3>
                        <p className="text-[#6b5a4a]/60 text-xs mt-0.5">
                          {formatDate(role.startDate)} – {formatDate(role.endDate)}
                        </p>
                        {role.clients && (
                          <p className="text-[#6b5a4a]/70 text-xs mt-1 italic">{role.clients}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Descriptions and bullets after all titles */}
                  {description && (
                    <p className="text-[#6b5a4a] text-sm leading-relaxed mb-2">{description}</p>
                  )}
                  {additionalRoles.map((role, i) =>
                    role.description ? (
                      <p key={i} className="text-[#6b5a4a] text-sm leading-relaxed mb-2">{role.description}</p>
                    ) : null
                  )}
                  {bullets.length > 0 && (
                    <ul className="space-y-1.5 mt-1">
                      {bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[#6b5a4a] leading-snug">
                          <span className="text-[#c4622d]/60 mt-0.5 flex-shrink-0">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              );
            })()
          ) : (
            /* Single-role layout */
            <>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                <h3 className={`font-heading font-bold text-lg leading-tight text-[#1a1410]`}>
                  {title}
                </h3>
              </div>
              <p className={`font-semibold text-sm mb-1 text-[#c4622d]`}>
                {company}
              </p>
              <p className="text-[#6b5a4a]/60 text-xs mb-1">
                {formatDate(startDate)} – {formatDate(endDate)}
                {location && ` · ${location}`}
              </p>
              {clients && (
                <p className="text-[#6b5a4a]/70 text-xs italic mb-3">{clients}</p>
              )}
              {description && (
                <p className="text-[#6b5a4a] text-sm leading-relaxed mb-1">{description}</p>
              )}
              {bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#6b5a4a] leading-snug">
                      <span className="text-[#c4622d]/60 mt-0.5 flex-shrink-0">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
