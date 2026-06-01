interface FooterProps {
  name: string;
  linkedin?: string;
  email?: string;
}

export function Footer({ name, linkedin, email }: FooterProps) {
  return (
    <footer id="contact" className="py-12 px-8" style={{ background: "#1a1410" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <span className="font-heading font-semibold text-white/60">{name}</span>
        <div className="flex items-center gap-6">
          {linkedin && (
            <a
              href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-[#c4622d] transition-colors"
            >
              LinkedIn
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="text-white/70 hover:text-[#c4622d] transition-colors">
              {email}
            </a>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/25">
        Designed and built by {name.split(" ")[0]} using Claude Code, GitHub, and Vercel.
      </div>
    </footer>
  );
}
