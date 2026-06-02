"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import resumeRaw from "@/data/resume.json";
import recsRaw from "@/data/recommendations.json";
import postsRaw from "@/data/posts.json";
import buildsRaw from "@/data/builds.json";
import contentRaw from "@/data/content.json";

type Tab = "Profile" | "Contact" | "Skills" | "Experience" | "Recommendations" | "Writing" | "Builds & Projects" | "Site Text" | "Resume PDF";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Rec { name: string; title: string; company: string; relationship: string; quote: string }
interface Post { id: number; tag: string; excerpt: string; url: string }
interface ExpEntry {
  company: string; title: string; startDate: string; endDate: string;
  location: string | null; description: string | null; bullets: string[];
  clients?: string | null; iconCategory?: string; emphasis?: string;
  additionalRoles?: { title: string; startDate: string; endDate: string; description?: string | null; clients?: string | null }[];
}

// ── save helper ──────────────────────────────────────────────────────────────
async function saveToGitHub(filePath: string, data: unknown, section: string): Promise<string | null> {
  const res = await fetch("/api/admin/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filePath,
      content: JSON.stringify(data, null, 2),
      commitMessage: `Admin: update ${section}`,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    return err.error || "Unknown error";
  }
  return null;
}

// ── small reusable UI pieces ──────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: "#7a6a5a" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#c4622d] text-[#faf9f6]";
const inputStyle = { background: "#1a1410", border: "1px solid #3a2e22" } as React.CSSProperties;

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} style={{ ...inputStyle, ...props.style }} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none ${props.className ?? ""}`} style={{ ...inputStyle, ...props.style }} />;
}

function SaveBtn({ status, onClick }: { status: SaveStatus; onClick: () => void }) {
  const label = status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Error — retry" : "Save changes";
  const bg = status === "saved" ? "#2a7a2a" : status === "error" ? "#8a2222" : "#c4622d";
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-colors"
      style={{ background: bg }}
    >
      {label}
    </button>
  );
}

function SectionNote() {
  return (
    <p className="text-xs mt-2" style={{ color: "#7a6a5a" }}>
      Changes commit to GitHub. Your site auto-deploys in ~2 minutes.
    </p>
  );
}

// ── PROFILE SECTION ───────────────────────────────────────────────────────────
function ProfileSection({ resume, setResume }: { resume: typeof resumeRaw; setResume: (r: typeof resumeRaw) => void }) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/resume.json", resume, "profile");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[#faf9f6]">Profile</h2>
      <Field label="Full name">
        <Input value={resume.name} onChange={e => setResume({ ...resume, name: e.target.value })} />
      </Field>
      <Field label="Headline (under your name)">
        <Input value={resume.headline} onChange={e => setResume({ ...resume, headline: e.target.value })} />
      </Field>
      <Field label="Tagline (short description in hero)">
        <Textarea rows={3} value={resume.tagline ?? ""} onChange={e => setResume({ ...resume, tagline: e.target.value })} />
      </Field>
      <Field label="About summary (full text — use blank line between paragraphs)">
        <Textarea rows={14} value={resume.summary} onChange={e => setResume({ ...resume, summary: e.target.value })} />
      </Field>
      <div className="flex items-center gap-4">
        <SaveBtn status={status} onClick={save} />
        <SectionNote />
      </div>
    </div>
  );
}

// ── CONTACT SECTION ───────────────────────────────────────────────────────────
function ContactSection({ resume, setResume }: { resume: typeof resumeRaw; setResume: (r: typeof resumeRaw) => void }) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/resume.json", resume, "contact");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[#faf9f6]">Contact</h2>
      <Field label="Email">
        <Input type="email" value={resume.contact.email ?? ""} onChange={e => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })} />
      </Field>
      <Field label="Phone">
        <Input value={resume.contact.phone ?? ""} onChange={e => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })} />
      </Field>
      <Field label="Location">
        <Input value={resume.contact.location ?? ""} onChange={e => setResume({ ...resume, contact: { ...resume.contact, location: e.target.value } })} />
      </Field>
      <Field label="LinkedIn URL">
        <Input value={resume.links.linkedin ?? ""} onChange={e => setResume({ ...resume, links: { ...resume.links, linkedin: e.target.value } })} />
      </Field>
      <div className="flex items-center gap-4">
        <SaveBtn status={status} onClick={save} />
        <SectionNote />
      </div>
    </div>
  );
}

// ── SKILLS SECTION ────────────────────────────────────────────────────────────
function SkillsSection({ resume, setResume }: { resume: typeof resumeRaw; setResume: (r: typeof resumeRaw) => void }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [newSkill, setNewSkill] = useState("");

  function addSkill() {
    const s = newSkill.trim();
    if (!s || resume.skills.includes(s)) return;
    setResume({ ...resume, skills: [...resume.skills, s] });
    setNewSkill("");
  }

  function removeSkill(skill: string) {
    setResume({ ...resume, skills: resume.skills.filter(s => s !== skill) });
  }

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/resume.json", resume, "skills");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[#faf9f6]">Skills &amp; Tools</h2>
      <div className="flex flex-wrap gap-2">
        {resume.skills.map(skill => (
          <span key={skill} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#faf9f6]" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-[#7a6a5a] hover:text-red-400 text-base leading-none">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addSkill()}
          placeholder="Add a skill or tool…"
          className="flex-1"
        />
        <button onClick={addSkill} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#c4622d" }}>
          Add
        </button>
      </div>
      <div className="flex items-center gap-4">
        <SaveBtn status={status} onClick={save} />
        <SectionNote />
      </div>
    </div>
  );
}

// ── EXPERIENCE SECTION ────────────────────────────────────────────────────────
function ExperienceSection({ resume, setResume }: { resume: typeof resumeRaw; setResume: (r: typeof resumeRaw) => void }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const blank: ExpEntry = { company: "", title: "", startDate: "", endDate: "", location: "", description: "", bullets: [] };
  const [draft, setDraft] = useState<ExpEntry>(blank);

  function startEdit(idx: number) {
    const e = resume.experience[idx] as ExpEntry;
    setDraft({ ...e, bullets: e.bullets ?? [] });
    setEditingIdx(idx);
    setShowNew(false);
  }

  function startNew() {
    setDraft(blank);
    setShowNew(true);
    setEditingIdx(null);
  }

  function cancelEdit() { setEditingIdx(null); setShowNew(false); }

  function commitEdit() {
    const exp = [...resume.experience] as ExpEntry[];
    if (showNew) {
      exp.unshift(draft);
    } else if (editingIdx !== null) {
      exp[editingIdx] = { ...exp[editingIdx], ...draft } as ExpEntry;
    }
    setResume({ ...resume, experience: exp as typeof resumeRaw.experience });
    cancelEdit();
  }

  function deleteEntry(idx: number) {
    if (!confirm("Delete this entry?")) return;
    const exp = resume.experience.filter((_, i) => i !== idx);
    setResume({ ...resume, experience: exp });
  }

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/resume.json", resume, "experience");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  const isEditing = editingIdx !== null || showNew;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#faf9f6]">Experience</h2>
        {!isEditing && (
          <button onClick={startNew} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>
            + Add job
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
          <h3 className="text-sm font-semibold text-[#faf9f6]">{showNew ? "New entry" : "Edit entry"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company"><Input value={draft.company} onChange={e => setDraft({ ...draft, company: e.target.value })} /></Field>
            <Field label="Title"><Input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Start date (YYYY-MM)"><Input value={draft.startDate} onChange={e => setDraft({ ...draft, startDate: e.target.value })} placeholder="2024-01" /></Field>
            <Field label="End date (YYYY-MM or Present)"><Input value={draft.endDate} onChange={e => setDraft({ ...draft, endDate: e.target.value })} placeholder="Present" /></Field>
          </div>
          <Field label="Location"><Input value={draft.location ?? ""} onChange={e => setDraft({ ...draft, location: e.target.value })} /></Field>
          <Field label="Description / context paragraph">
            <Textarea rows={4} value={draft.description ?? ""} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Bullet points (one per line)">
            <Textarea rows={5} value={draft.bullets.join("\n")} onChange={e => setDraft({ ...draft, bullets: e.target.value.split("\n") })} />
          </Field>
          <div className="flex gap-2">
            <button onClick={commitEdit} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>
              {showNew ? "Add" : "Update"}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 rounded-lg text-xs font-semibold text-[#a09080]" style={{ background: "#1a1410", border: "1px solid #3a2e22" }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {resume.experience.map((exp, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
              <div>
                <p className="text-sm font-semibold text-[#faf9f6]">{exp.title}</p>
                <p className="text-xs text-[#7a6a5a]">{exp.company} · {exp.startDate} – {exp.endDate}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(i)} className="px-3 py-1 rounded-lg text-xs text-[#c4622d]" style={{ border: "1px solid #c4622d33" }}>Edit</button>
                <button onClick={() => deleteEntry(i)} className="px-3 py-1 rounded-lg text-xs text-red-400" style={{ border: "1px solid #ff444433" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-4">
          <SaveBtn status={status} onClick={save} />
          <SectionNote />
        </div>
      )}
    </div>
  );
}

// ── RECOMMENDATIONS SECTION ───────────────────────────────────────────────────
function RecommendationsSection() {
  const [recs, setRecs] = useState<Rec[]>(recsRaw as Rec[]);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const blank: Rec = { name: "", title: "", company: "", relationship: "", quote: "" };
  const [draft, setDraft] = useState<Rec>(blank);

  function startEdit(idx: number) { setDraft({ ...recs[idx] }); setEditingIdx(idx); setShowNew(false); }
  function startNew() { setDraft(blank); setShowNew(true); setEditingIdx(null); }
  function cancel() { setEditingIdx(null); setShowNew(false); }

  function commit() {
    const next = [...recs];
    if (showNew) next.push(draft);
    else if (editingIdx !== null) next[editingIdx] = draft;
    setRecs(next);
    cancel();
  }

  function remove(idx: number) {
    if (!confirm("Delete this recommendation?")) return;
    setRecs(recs.filter((_, i) => i !== idx));
  }

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/recommendations.json", recs, "recommendations");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  const isEditing = editingIdx !== null || showNew;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#faf9f6]">Recommendations</h2>
        {!isEditing && (
          <button onClick={startNew} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>+ Add</button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><Input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Title / role"><Input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Company"><Input value={draft.company} onChange={e => setDraft({ ...draft, company: e.target.value })} /></Field>
            <Field label="Relationship"><Input value={draft.relationship} onChange={e => setDraft({ ...draft, relationship: e.target.value })} placeholder="e.g. Managed Claudia directly" /></Field>
          </div>
          <Field label="Quote">
            <Textarea rows={4} value={draft.quote} onChange={e => setDraft({ ...draft, quote: e.target.value })} />
          </Field>
          <div className="flex gap-2">
            <button onClick={commit} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>{showNew ? "Add" : "Update"}</button>
            <button onClick={cancel} className="px-4 py-2 rounded-lg text-xs font-semibold text-[#a09080]" style={{ background: "#1a1410", border: "1px solid #3a2e22" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {recs.map((rec, i) => (
            <div key={i} className="flex items-start justify-between px-4 py-3 rounded-xl gap-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#faf9f6]">{rec.name}</p>
                <p className="text-xs text-[#7a6a5a]">{rec.title}{rec.company ? ` · ${rec.company}` : ""}</p>
                <p className="text-xs text-[#a09080] mt-1 line-clamp-2">{rec.quote}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(i)} className="px-3 py-1 rounded-lg text-xs text-[#c4622d]" style={{ border: "1px solid #c4622d33" }}>Edit</button>
                <button onClick={() => remove(i)} className="px-3 py-1 rounded-lg text-xs text-red-400" style={{ border: "1px solid #ff444433" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-4">
          <SaveBtn status={status} onClick={save} />
          <SectionNote />
        </div>
      )}
    </div>
  );
}

// ── WRITING SECTION ───────────────────────────────────────────────────────────
function WritingSection() {
  const [posts, setPosts] = useState<Post[]>(postsRaw as Post[]);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const blank: Post = { id: Date.now(), tag: "", excerpt: "", url: "" };
  const [draft, setDraft] = useState<Post>(blank);

  function startEdit(idx: number) { setDraft({ ...posts[idx] }); setEditingIdx(idx); setShowNew(false); }
  function startNew() { setDraft({ ...blank, id: Date.now() }); setShowNew(true); setEditingIdx(null); }
  function cancel() { setEditingIdx(null); setShowNew(false); }

  function commit() {
    const next = [...posts];
    if (showNew) next.push(draft);
    else if (editingIdx !== null) next[editingIdx] = draft;
    setPosts(next);
    cancel();
  }

  function remove(idx: number) {
    if (!confirm("Delete this post?")) return;
    setPosts(posts.filter((_, i) => i !== idx));
  }

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/posts.json", posts, "writing");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  const isEditing = editingIdx !== null || showNew;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#faf9f6]">Writing / LinkedIn Posts</h2>
        {!isEditing && (
          <button onClick={startNew} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>+ Add post</button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
          <Field label="Tag / topic label"><Input value={draft.tag} onChange={e => setDraft({ ...draft, tag: e.target.value })} placeholder="e.g. On Leadership" /></Field>
          <Field label="Excerpt (2–3 sentences shown on site)">
            <Textarea rows={4} value={draft.excerpt} onChange={e => setDraft({ ...draft, excerpt: e.target.value })} />
          </Field>
          <Field label="LinkedIn post URL"><Input value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} placeholder="https://linkedin.com/posts/..." /></Field>
          <div className="flex gap-2">
            <button onClick={commit} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>{showNew ? "Add" : "Update"}</button>
            <button onClick={cancel} className="px-4 py-2 rounded-lg text-xs font-semibold text-[#a09080]" style={{ background: "#1a1410", border: "1px solid #3a2e22" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post, i) => (
            <div key={post.id} className="flex items-start justify-between px-4 py-3 rounded-xl gap-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#faf9f6]">{post.tag}</p>
                <p className="text-xs text-[#a09080] mt-0.5 line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(i)} className="px-3 py-1 rounded-lg text-xs text-[#c4622d]" style={{ border: "1px solid #c4622d33" }}>Edit</button>
                <button onClick={() => remove(i)} className="px-3 py-1 rounded-lg text-xs text-red-400" style={{ border: "1px solid #ff444433" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-4">
          <SaveBtn status={status} onClick={save} />
          <SectionNote />
        </div>
      )}
    </div>
  );
}

// ── SITE TEXT SECTION ─────────────────────────────────────────────────────────
type ContentData = typeof contentRaw;

function SiteTextSection() {
  const [content, setContent] = useState<ContentData>(contentRaw);
  const [status, setStatus] = useState<SaveStatus>("idle");

  function set(path: string[], value: string) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = next;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
      node[path[path.length - 1]] = value;
      return next;
    });
  }

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/content.json", content, "site text");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  const sections: { label: string; color: string; fields: { key: string[]; label: string; rows?: number }[] }[] = [
    {
      label: "Hero",
      color: "#c4622d",
      fields: [
        { key: ["hero", "eyebrow"], label: "Eyebrow label (above your name)" },
      ],
    },
    {
      label: "About Tab",
      color: "#c4622d",
      fields: [
        { key: ["about", "heading"], label: "Section heading" },
      ],
    },
    {
      label: "Professional History Tab",
      color: "#c4622d",
      fields: [
        { key: ["professionalHistory", "heading"], label: "Section heading" },
      ],
    },
    {
      label: "Skills & Tools Tab",
      color: "#0d8a8a",
      fields: [
        { key: ["skills", "heading"], label: "Section heading" },
        { key: ["skills", "intro"], label: "Intro paragraph", rows: 3 },
      ],
    },
    {
      label: "Clients Tab",
      color: "#c4622d",
      fields: [
        { key: ["clients", "heading"], label: "Section heading" },
        { key: ["clients", "intro"], label: "Intro paragraph", rows: 3 },
      ],
    },
    {
      label: "Recommendations Tab",
      color: "#c4622d",
      fields: [
        { key: ["recommendations", "heading"], label: "Section heading" },
        { key: ["recommendations", "intro"], label: "Intro paragraph", rows: 3 },
      ],
    },
    {
      label: "Writing Tab",
      color: "#c4622d",
      fields: [
        { key: ["writing", "heading"], label: "Section heading" },
        { key: ["writing", "intro"], label: "Intro paragraph", rows: 3 },
      ],
    },
    {
      label: "Footer",
      color: "#7a6a5a",
      fields: [
        { key: ["footer", "credit"], label: "Credit line" },
      ],
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValue(path: string[]): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = content;
    for (const k of path) node = node[k];
    return node as string;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-bold text-[#faf9f6]">Site Text</h2>
      <p className="text-sm" style={{ color: "#7a6a5a" }}>
        Edit the headings and intro text shown across the site. Changes deploy in ~2 minutes.
      </p>

      {sections.map(({ label, color, fields }) => (
        <div key={label} className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>{label}</p>
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
            {fields.map(({ key, label: fieldLabel, rows }) => (
              <Field key={key.join(".")} label={fieldLabel}>
                {rows ? (
                  <Textarea rows={rows} value={getValue(key)} onChange={e => set(key, e.target.value)} />
                ) : (
                  <Input value={getValue(key)} onChange={e => set(key, e.target.value)} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <SaveBtn status={status} onClick={save} />
        <SectionNote />
      </div>
    </div>
  );
}

// ── BUILDS & PROJECTS SECTION ────────────────────────────────────────────────
type ImpactItem = { label: string; detail: string };
type PersonalProject = { id: string; title: string; description: string; imageUrls: string[] };
type WorkProject = typeof buildsRaw.workProjects[number];
type BuildsData = Omit<typeof buildsRaw, "workProjects" | "personalProjects"> & {
  workProjects: WorkProject[];
  personalProjects: PersonalProject[];
};

function BuildsSection() {
  const [builds, setBuilds] = useState<BuildsData>(() => {
    const raw = buildsRaw as BuildsData;
    return {
      ...raw,
      personalProjects: raw.personalProjects.map(p => {
        const legacy = p as PersonalProject & { imageUrl?: string | null };
        return { ...p, imageUrls: p.imageUrls?.length ? p.imageUrls : (legacy.imageUrl ? [legacy.imageUrl] : []) };
      }),
    };
  });
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [editingPersonalIdx, setEditingPersonalIdx] = useState<number | null>(null);
  const [showNewPersonal, setShowNewPersonal] = useState(false);
  const [editingWorkIdx, setEditingWorkIdx] = useState<number | null>(null);
  const blankPersonal: PersonalProject = { id: Date.now().toString(), title: "", description: "", imageUrls: [] };
  const [newImageUrl, setNewImageUrl] = useState("");
  const [personalDraft, setPersonalDraft] = useState<PersonalProject>(blankPersonal);

  async function save() {
    setStatus("saving");
    const err = await saveToGitHub("data/builds.json", builds, "builds & projects");
    setStatus(err ? "error" : "saved");
    if (!err) setTimeout(() => setStatus("idle"), 4000);
  }

  function updateWorkProj(idx: number, updated: WorkProject) {
    const next = [...builds.workProjects] as WorkProject[];
    next[idx] = updated;
    setBuilds({ ...builds, workProjects: next });
  }

  function commitPersonal() {
    const next = [...builds.personalProjects] as PersonalProject[];
    if (showNewPersonal) {
      next.push({ ...personalDraft, id: Date.now().toString() });
    } else if (editingPersonalIdx !== null) {
      next[editingPersonalIdx] = personalDraft;
    }
    setBuilds({ ...builds, personalProjects: next });
    setEditingPersonalIdx(null);
    setShowNewPersonal(false);
  }

  function removePersonal(idx: number) {
    if (!confirm("Remove this project card?")) return;
    setBuilds({ ...builds, personalProjects: builds.personalProjects.filter((_, i) => i !== idx) });
  }

  const proj = builds.workProjects[0] as WorkProject;

  return (
    <div className="space-y-10">
      <h2 className="text-lg font-bold text-[#faf9f6]">Builds &amp; Projects</h2>

      {/* Intro texts */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0d8a8a" }}>Section Intros</p>
        <Field label="Page intro (top of tab)">
          <Textarea rows={3} value={builds.intro} onChange={e => setBuilds({ ...builds, intro: e.target.value })} />
        </Field>
        <Field label="Work section intro">
          <Textarea rows={2} value={builds.workIntro} onChange={e => setBuilds({ ...builds, workIntro: e.target.value })} />
        </Field>
        <Field label="Personal section intro">
          <Textarea rows={2} value={builds.personalIntro} onChange={e => setBuilds({ ...builds, personalIntro: e.target.value })} />
        </Field>
      </div>

      {/* Work project: Research PM Agent */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0d8a8a" }}>Work Project: {proj.title}</p>
          <button
            onClick={() => setEditingWorkIdx(editingWorkIdx === 0 ? null : 0)}
            className="text-xs px-3 py-1 rounded-lg"
            style={{ color: "#c4622d", border: "1px solid #c4622d33" }}
          >
            {editingWorkIdx === 0 ? "Collapse" : "Edit"}
          </button>
        </div>

        {editingWorkIdx === 0 && (
          <div className="space-y-4 rounded-xl p-5" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={proj.title} onChange={e => updateWorkProj(0, { ...proj, title: e.target.value })} /></Field>
              <Field label="Badge (e.g. Internal Tool)"><Input value={proj.badge} onChange={e => updateWorkProj(0, { ...proj, badge: e.target.value })} /></Field>
              <Field label="Subtitle (role · company)" ><Input value={proj.subtitle} onChange={e => updateWorkProj(0, { ...proj, subtitle: e.target.value })} /></Field>
            </div>

            <Field label="Overview paragraph 1">
              <Textarea rows={3} value={proj.overviewP1} onChange={e => updateWorkProj(0, { ...proj, overviewP1: e.target.value })} />
            </Field>
            <Field label="Overview paragraph 2">
              <Textarea rows={3} value={proj.overviewP2} onChange={e => updateWorkProj(0, { ...proj, overviewP2: e.target.value })} />
            </Field>

            <div className="h-px" style={{ background: "#3a2e22" }} />
            <p className="text-xs text-[#7a6a5a] font-medium uppercase tracking-wide">The Need</p>
            <Field label="Paragraph 1">
              <Textarea rows={3} value={proj.needP1} onChange={e => updateWorkProj(0, { ...proj, needP1: e.target.value })} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea rows={3} value={proj.needP2} onChange={e => updateWorkProj(0, { ...proj, needP2: e.target.value })} />
            </Field>

            <div className="h-px" style={{ background: "#3a2e22" }} />
            <p className="text-xs text-[#7a6a5a] font-medium uppercase tracking-wide">What It Does (one bullet per line)</p>
            <Textarea
              rows={10}
              value={proj.whatItDoesBullets.join("\n")}
              onChange={e => updateWorkProj(0, { ...proj, whatItDoesBullets: e.target.value.split("\n") })}
            />

            <div className="h-px" style={{ background: "#3a2e22" }} />
            <p className="text-xs text-[#7a6a5a] font-medium uppercase tracking-wide">Business Impact Items</p>
            {proj.businessImpactItems.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 items-start">
                <Field label={`Item ${i + 1} label`}>
                  <Input
                    value={item.label}
                    onChange={e => {
                      const next = [...proj.businessImpactItems] as ImpactItem[];
                      next[i] = { ...next[i], label: e.target.value };
                      updateWorkProj(0, { ...proj, businessImpactItems: next });
                    }}
                  />
                </Field>
                <Field label="Detail">
                  <Input
                    value={item.detail}
                    onChange={e => {
                      const next = [...proj.businessImpactItems] as ImpactItem[];
                      next[i] = { ...next[i], detail: e.target.value };
                      updateWorkProj(0, { ...proj, businessImpactItems: next });
                    }}
                  />
                </Field>
              </div>
            ))}

            <div className="h-px" style={{ background: "#3a2e22" }} />
            <p className="text-xs text-[#7a6a5a] font-medium uppercase tracking-wide">How It&apos;s Documented</p>
            <Field label="Paragraph 1">
              <Textarea rows={3} value={proj.docsP1} onChange={e => updateWorkProj(0, { ...proj, docsP1: e.target.value })} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea rows={3} value={proj.docsP2} onChange={e => updateWorkProj(0, { ...proj, docsP2: e.target.value })} />
            </Field>
          </div>
        )}
      </div>

      {/* Personal projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#c4622d" }}>Personal Projects</p>
          {!showNewPersonal && editingPersonalIdx === null && (
            <button
              onClick={() => { setPersonalDraft(blankPersonal); setShowNewPersonal(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: "#c4622d" }}
            >
              + Add project
            </button>
          )}
        </div>

        {(showNewPersonal || editingPersonalIdx !== null) && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
            <Field label="Title"><Input value={personalDraft.title} onChange={e => setPersonalDraft({ ...personalDraft, title: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={2} value={personalDraft.description} onChange={e => setPersonalDraft({ ...personalDraft, description: e.target.value })} /></Field>
            <Field label="Screenshots (add one URL at a time — supports multiple)">
              <div className="space-y-2">
                {personalDraft.imageUrls.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={url}
                      onChange={e => {
                        const next = [...personalDraft.imageUrls];
                        next[i] = e.target.value;
                        setPersonalDraft({ ...personalDraft, imageUrls: next });
                      }}
                      className="flex-1 text-xs"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => setPersonalDraft({ ...personalDraft, imageUrls: personalDraft.imageUrls.filter((_, j) => j !== i) })}
                      className="text-red-400 text-lg leading-none px-1 hover:text-red-300"
                    >&times;</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && newImageUrl.trim()) {
                        setPersonalDraft({ ...personalDraft, imageUrls: [...personalDraft.imageUrls, newImageUrl.trim()] });
                        setNewImageUrl("");
                      }
                    }}
                    placeholder="Paste image URL and press Enter or Add"
                    className="flex-1 text-xs"
                  />
                  <button
                    onClick={() => {
                      if (!newImageUrl.trim()) return;
                      setPersonalDraft({ ...personalDraft, imageUrls: [...personalDraft.imageUrls, newImageUrl.trim()] });
                      setNewImageUrl("");
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white shrink-0"
                    style={{ background: "#c4622d" }}
                  >Add</button>
                </div>
              </div>
            </Field>
            <div className="flex gap-2">
              <button onClick={commitPersonal} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#c4622d" }}>{showNewPersonal ? "Add" : "Update"}</button>
              <button onClick={() => { setEditingPersonalIdx(null); setShowNewPersonal(false); }} className="px-4 py-2 rounded-lg text-xs font-semibold text-[#a09080]" style={{ background: "#1a1410", border: "1px solid #3a2e22" }}>Cancel</button>
            </div>
          </div>
        )}

        {!showNewPersonal && editingPersonalIdx === null && (
          <div className="space-y-2">
            {builds.personalProjects.map((proj, i) => (
              <div key={proj.id} className="flex items-start justify-between px-4 py-3 rounded-xl gap-4" style={{ background: "#2a2018", border: "1px solid #3a2e22" }}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#faf9f6]">{proj.title}</p>
                  <p className="text-xs text-[#a09080] mt-0.5">{proj.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setPersonalDraft({ ...proj }); setEditingPersonalIdx(i); }} className="px-3 py-1 rounded-lg text-xs text-[#c4622d]" style={{ border: "1px solid #c4622d33" }}>Edit</button>
                  <button onClick={() => removePersonal(i)} className="px-3 py-1 rounded-lg text-xs text-red-400" style={{ border: "1px solid #ff444433" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SaveBtn status={status} onClick={save} />
        <SectionNote />
      </div>
    </div>
  );
}

// ── RESUME PDF SECTION ────────────────────────────────────────────────────────
function ResumePdfSection({ resume, setResume }: { resume: typeof resumeRaw; setResume: (r: typeof resumeRaw) => void }) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [removeStatus, setRemoveStatus] = useState<SaveStatus>("idle");
  const hasResume = !!(resume as typeof resumeRaw & { resumePdf?: boolean | null }).resumePdf;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("uploading");
    setErrorMsg("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload-resume", { method: "POST", body: form });
    if (res.ok) {
      setUploadStatus("done");
      setResume({ ...resume, resumePdf: true } as unknown as typeof resumeRaw);
      setTimeout(() => setUploadStatus("idle"), 5000);
    } else {
      const err = await res.json();
      setErrorMsg(err.error ?? "Upload failed");
      setUploadStatus("error");
    }
    e.target.value = "";
  }

  async function handleRemove() {
    if (!confirm("This will hide the download button. The PDF file stays in GitHub until you overwrite it. Continue?")) return;
    setRemoveStatus("saving");
    const err = await saveToGitHub("data/resume.json", { ...resume, resumePdf: null }, "Admin: hide resume download");
    if (err) {
      setRemoveStatus("error");
    } else {
      setRemoveStatus("saved");
      setResume({ ...resume, resumePdf: null } as unknown as typeof resumeRaw);
      setTimeout(() => setRemoveStatus("idle"), 4000);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#faf9f6]">Resume PDF</h2>
      <p className="text-sm" style={{ color: "#7a6a5a" }}>
        Upload a PDF resume. Once uploaded, a &ldquo;Download Resume&rdquo; button appears on your Contact tab. The file is stored at{" "}
        <code className="text-[#c4622d] text-xs">/resume.pdf</code> in your public folder.
      </p>

      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: "#2a2018", border: "1px solid #3a2e22" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: hasResume ? "#2a7a2a" : "#7a6a5a" }}
          />
          <span className="text-sm text-[#faf9f6]">
            {hasResume ? "Resume is published — download button is visible" : "No resume published yet"}
          </span>
        </div>

        <div>
          <label
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer transition-colors"
            style={{ background: uploadStatus === "uploading" ? "#7a6a5a" : "#c4622d" }}
          >
            {uploadStatus === "uploading" ? "Uploading…" : uploadStatus === "done" ? "Uploaded ✓" : "Choose PDF to upload"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploadStatus === "uploading"}
            />
          </label>
          {uploadStatus === "error" && (
            <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
          )}
          {uploadStatus === "done" && (
            <p className="text-green-400 text-xs mt-2">
              Uploaded! Your site will redeploy in ~2 minutes with the download button live.
            </p>
          )}
        </div>
      </div>

      {hasResume && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleRemove}
            disabled={removeStatus === "saving"}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ background: removeStatus === "saved" ? "#2a7a2a" : "#3a2018", color: "#a09080", border: "1px solid #3a2e22" }}
          >
            {removeStatus === "saving" ? "Hiding…" : removeStatus === "saved" ? "Hidden ✓" : "Hide download button"}
          </button>
          <SectionNote />
        </div>
      )}
    </div>
  );
}

// ── ROOT PAGE ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [active, setActive] = useState<Tab>("Profile");
  const [resume, setResume] = useState(resumeRaw);
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const TABS: Tab[] = ["Profile", "Contact", "Skills", "Experience", "Recommendations", "Writing", "Builds & Projects", "Site Text", "Resume PDF"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1410", color: "#faf9f6" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2a2018" }}>
        <div>
          <span className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Portal</span>
          <span className="text-xs text-[#7a6a5a] ml-3">claudianasraty.vercel.app</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-xs text-[#7a6a5a] hover:text-[#c4622d] transition-colors">View site →</a>
          <button onClick={logout} className="text-xs text-[#7a6a5a] hover:text-red-400 transition-colors">Log out</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-44 shrink-0 border-r py-6 px-3 space-y-1" style={{ borderColor: "#2a2018" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: active === tab ? "#c4622d22" : "transparent",
                color: active === tab ? "#c4622d" : "#a09080",
                fontWeight: active === tab ? 600 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Main */}
        <main className="flex-1 p-8 max-w-2xl">
          {active === "Profile" && <ProfileSection resume={resume} setResume={setResume} />}
          {active === "Contact" && <ContactSection resume={resume} setResume={setResume} />}
          {active === "Skills" && <SkillsSection resume={resume} setResume={setResume} />}
          {active === "Experience" && <ExperienceSection resume={resume} setResume={setResume} />}
          {active === "Recommendations" && <RecommendationsSection />}
          {active === "Writing" && <WritingSection />}
          {active === "Builds & Projects" && <BuildsSection />}
          {active === "Site Text" && <SiteTextSection />}
          {active === "Resume PDF" && <ResumePdfSection resume={resume} setResume={setResume} />}
        </main>
      </div>
    </div>
  );
}
