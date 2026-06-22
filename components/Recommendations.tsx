import recommendationsData from "@/data/recommendations.json";

interface Recommendation {
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
}

export function Recommendations() {
  const recs = Object.values(recommendationsData) as Recommendation[];

  return (
    <section className="py-20 px-4" style={{ background: "#1a1410" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[#c4622d] font-medium text-xs tracking-widest uppercase mb-3">
          What People Say
        </p>
        <h2
          className="text-white text-3xl font-bold mb-14"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          Recommendations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recs.map((rec, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Quote mark */}
              <span
                className="text-5xl leading-none select-none"
                style={{ color: "#c4622d", opacity: 0.5, fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>

              {/* Quote text */}
              <p className="text-white/80 text-sm leading-relaxed flex-1 -mt-4">
                {rec.quote}
              </p>

              {/* Attribution */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-white font-semibold text-sm">{rec.name}</p>
                <p className="text-white/50 text-xs mt-0.5">{rec.title}{rec.company ? ` · ${rec.company}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
