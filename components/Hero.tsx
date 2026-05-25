import Image from "next/image";

interface HeroProps {
  name: string;
  headline: string;
  tagline?: string;
  linkedin?: string;
}

export function Hero({ name, headline, tagline, linkedin }: HeroProps) {
  const firstName = name.split(" ")[0];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#faf9f6" }}
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 65% 45%, rgba(196,98,45,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pt-20 pb-20 md:pt-28 md:pb-20">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-20">

          {/* Left — text */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="text-[#c4622d] font-medium text-sm tracking-widest uppercase mb-5">
              Career Journey
            </p>

            <h1
              className="font-heading font-bold leading-none tracking-tight text-[#1a1410] mb-4"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              {name}
            </h1>

            <p
              className="font-heading font-semibold text-[#c4622d] mb-5 leading-snug"
              style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
            >
              {headline}
            </p>

            {tagline && (
              <p className="text-[#6b5a4a] text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                {tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {linkedin && (
                <a
                  href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
                  style={{
                    background: "#1a1410",
                    color: "#faf9f6",
                  }}
                >
                  Connect on LinkedIn
                </a>
              )}
              <a
                href="#journey"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-[#c4622d]/40 text-[#c4622d] hover:border-[#c4622d] hover:bg-[#c4622d]/5 transition-all"
              >
                See my journey ↓
              </a>
            </div>
          </div>

          {/* Right — photo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div
              className="relative w-[55vw] max-w-[260px] md:w-[30vw] md:max-w-[420px]"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Glow ring behind photo */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #c4622d, #e8a87c)",
                  filter: "blur(32px)",
                  opacity: 0.15,
                  transform: "scale(1.05)",
                }}
              />
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden border border-[#e8ddd0]"
                style={{ boxShadow: "0 32px 80px rgba(26,20,16,0.12)" }}
              >
                <Image
                  src="/claudia.jpg"
                  alt={firstName}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-[#c4622d]/40 to-transparent" />
      </div>
    </section>
  );
}
