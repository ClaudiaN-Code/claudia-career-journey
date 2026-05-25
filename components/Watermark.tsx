export function Watermark() {
  return (
    <a
      href="https://buildbeautifully.lovable.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-2 right-3 z-50 text-[11px] opacity-70 hover:opacity-100 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md no-underline text-white/70 hover:text-white transition-opacity"
    >
      Learn how to build sites like this with{" "}
      <span className="underline">Build Beautifully</span>
    </a>
  );
}
