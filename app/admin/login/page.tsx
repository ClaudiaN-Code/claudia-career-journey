"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1410" }}>
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: "#231c14", border: "1px solid #3a2e22" }}
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#faf9f6] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Portal
          </h1>
          <p className="text-[#7a6a5a] text-sm">claudianasraty.vercel.app</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[#a09080] text-xs font-medium block mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-[#faf9f6] text-sm outline-none focus:ring-1 focus:ring-[#c4622d]"
              style={{ background: "#1a1410", border: "1px solid #3a2e22" }}
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity disabled:opacity-50"
            style={{ background: "#c4622d" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
