"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import resumeRaw from "@/data/resume.json";
import recsRaw from "@/data/recommendations.json";
import postsRaw from "@/data/posts.json";

type Tab = "Profile" | "Contact" | "Skills" | "Experience" | "Recommendations" | "Writing";

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

  const TABS: Tab[] = ["Profile", "Contact", "Skills", "Experience", "Recommendations", "Writing"];

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
        </main>
      </div>
    </div>
  );
}
