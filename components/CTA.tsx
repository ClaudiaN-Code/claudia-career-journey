import contentData from "@/data/content.json";

interface CTAProps {
  linkedin?: string;
  email?: string;
}

export function CTA({ linkedin, email }: CTAProps) {
  const { cta } = contentData;

  return (
    <section
      className="py-24 px-6 text-center"
      style={{ background: "#1a1410" }}
    >
      <div className="max-w-xl mx-auto space-y-6">
        <h2
          className="font-bold text-white leading-tight"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          {cta.heading}
        </h2>

        <p className="text-base leading-relaxed" style={{ color: "rgba(250,249,246,0.55)" }}>
          {cta.body}
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          {linkedin && (
            <a
              href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "#c4622d", color: "#faf9f6" }}
            >
              {cta.linkedinLabel}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(250,249,246,0.25)", color: "#faf9f6" }}
            >
              {cta.emailLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
