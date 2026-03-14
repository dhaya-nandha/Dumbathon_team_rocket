function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-6 py-14 text-neon-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 top-10 h-40 w-40 rotate-12 rounded-[42%] bg-bunker/90" />
        <div className="absolute left-8 top-40 h-16 w-16 -rotate-12 rounded-[40%] bg-bunker/80" />
        <div className="absolute left-20 top-64 h-11 w-11 rounded-[35%] bg-bunker/70" />
        <div className="absolute right-10 top-20 h-48 w-48 -rotate-6 rounded-[44%] bg-bunker/90" />
        <div className="absolute right-52 top-44 h-14 w-14 rotate-12 rounded-[36%] bg-bunker/75" />
        <div className="absolute right-20 bottom-16 h-36 w-36 -rotate-3 rounded-[43%] bg-bunker/90" />
        <div className="absolute left-24 bottom-20 h-12 w-12 rounded-[35%] bg-bunker/70" />
      </div>

      <section className="relative w-full max-w-5xl rounded-3xl border border-neon-700/50 bg-bunker/80 p-8 text-center shadow-neon backdrop-blur-sm md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.55em] text-neon-300 md:text-sm">
          Zombie Apocalypse Interface
        </p>

        <div className="mx-auto mt-8 flex w-fit flex-col items-center gap-2 rounded-2xl border border-neon-700/60 bg-night/70 px-8 py-6 shadow-neon">
          <span className="text-3xl leading-none text-neon-500 md:text-4xl">☣</span>
          <span className="text-sm font-semibold uppercase tracking-[0.45em] text-neon-300">Zombie-fied</span>
          <h1 className="-skew-x-6 text-5xl font-black uppercase tracking-[0.2em] text-neon-500 md:text-7xl">
            VIT-AP
          </h1>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-sm uppercase tracking-[0.22em] text-neon-100/85 md:text-base">
          Biohazard market uplink active. Gear up, trade fast, and outlast the horde.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <button className="rounded-2xl border-2 border-neon-500 bg-night px-7 py-8 text-xl font-black uppercase tracking-[0.08em] text-neon-300 shadow-neon transition hover:bg-neon-500/15 hover:text-neon-100 md:text-2xl">
            AB-1: Rare Auctions
          </button>
          <button className="rounded-2xl border-2 border-neon-500 bg-night px-7 py-8 text-xl font-black uppercase tracking-[0.08em] text-neon-300 shadow-neon transition hover:bg-neon-500/15 hover:text-neon-100 md:text-2xl">
            AB-2: Sell Scavenged Gear
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
