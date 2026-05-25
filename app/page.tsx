import resumeData from "@/data/resume.json";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { JourneyTabs } from "@/components/JourneyTabs";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { name, headline, tagline, summary, contact, links, experience, skills, education, certifications, languages, clients } = resumeData as typeof resumeData & { tagline?: string; clients?: { b2b: string[]; b2c: string[] } };

  return (
    <>
      <Nav name={name} />
      <Hero
        name={name}
        headline={headline}
        tagline={tagline}
        linkedin={links.linkedin ?? undefined}
      />
      <JourneyTabs
        summary={summary}
        experience={experience}
        skills={skills}
        contact={contact}
        links={links}
        education={education}
        certifications={certifications ?? []}
        languages={languages ?? []}
        clients={clients ?? { b2b: [], b2c: [] }}
      />
      <Footer
        name={name}
        linkedin={links.linkedin ?? undefined}
        email={contact.email ?? undefined}
      />
    </>
  );
}
