"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavProps {
  name: string;
}

export function Nav({ name }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(250,249,246,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(232,221,208,0.8)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-4 flex items-center justify-between">
        <span />
        {/* My AI Builds — hidden for now */}
      </div>
    </nav>
  );
}
