import Link from "next/link";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  title: string;
  url: string;
  description: string;
  toolsUsed: string[];
  date: string;
}

export default function BuildsPage() {
  const projects = projectsData as Project[];
  const sorted = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main
      className="min-h-screen px-8 md:px-16 py-20"
      style={{ background: "#faf9f6", color: "#1a1410", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-[#c4622d] hover:text-[#a8501f] transition-colors mb-12 inline-block"
        >
          ← back to my journey
        </Link>

        <h1
          className="font-heading font-bold text-4xl text-[#1a1410] mb-3"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          My AI Builds
        </h1>
        <p className="text-[#6b5a4a] text-lg italic mb-16">
          A growing list of what I&apos;ve made and what I&apos;ve used.
        </p>

        {sorted.length === 0 ? (
          <p className="text-[#6b5a4a]/60 italic">More builds coming soon ✨</p>
        ) : (
          <div className="space-y-12">
            {sorted.map((project, i) => (
              <div key={project.id}>
                {i > 0 && (
                  <hr className="border-[#e8ddd0] mb-12" />
                )}
                <h2
                  className="font-heading font-semibold text-2xl text-[#1a1410] mb-2"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  {project.title}
                </h2>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c4622d] hover:text-[#a8501f] text-sm transition-colors block mb-3"
                >
                  {project.url}
                </a>
                <p className="text-[#6b5a4a] leading-relaxed mb-4">
                  {project.description}
                </p>
                <p className="text-[#6b5a4a]/60 text-sm italic">
                  Tools I used: {project.toolsUsed.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
