import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const OWNER = "ClaudiaN-Code";
const REPO = "claudia-career-journey";
const BRANCH = "main";

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

  const { filePath, content, commitMessage } = await request.json();

  try {
    // Fetch current file to get SHA and existing content
    const currentRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github.v3+json" },
        cache: "no-store",
      }
    );
    const currentData = await currentRes.json();
    if (!currentData.sha) throw new Error(`Could not get SHA for ${filePath}: ${JSON.stringify(currentData)}`);

    // For JSON files, merge incoming over existing so fields the admin
    // doesn't manage (e.g. affiliations) are never clobbered
    let finalContent = content;
    if (filePath.endsWith(".json") && currentData.content) {
      try {
        const existing = JSON.parse(Buffer.from(currentData.content, "base64").toString("utf-8"));
        const incoming = JSON.parse(content);
        finalContent = JSON.stringify({ ...existing, ...incoming }, null, 2);
      } catch {
        // Not parseable — fall back to raw content
      }
    }

    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage || `Admin: update ${filePath}`,
          content: Buffer.from(finalContent).toString("base64"),
          sha: currentData.sha,
          branch: BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
