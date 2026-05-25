import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const OWNER = "ClaudiaN-Code";
const REPO = "claudia-career-journey";
const BRANCH = "main";

async function getFileSHA(filePath: string, token: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

async function commitFile(filePath: string, base64Content: string, commitMessage: string, token: string) {
  const sha = await getFileSHA(filePath, token);

  const body: Record<string, string> = {
    message: commitMessage,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "GitHub commit failed");
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

    await commitFile("public/resume.pdf", base64Pdf, "Admin: upload resume PDF", githubToken);

    // Mark resumePdf as true in resume.json
    const resumeRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/data/resume.json?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    const resumeMeta = await resumeRes.json();
    const resumeContent = JSON.parse(Buffer.from(resumeMeta.content, "base64").toString("utf-8"));
    resumeContent.resumePdf = true;
    const updatedBase64 = Buffer.from(JSON.stringify(resumeContent, null, 2)).toString("base64");

    await commitFile("data/resume.json", updatedBase64, "Admin: enable resume download", githubToken);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
