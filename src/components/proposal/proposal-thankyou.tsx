"use client";

export function ProposalThankYou() {
  return (
    <section
      className="proposal-page flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0f1d2c", color: "#ffffff" }}
    >
      {/* Logo */}
      <div className="mb-6 text-center">
        <div
          className="text-4xl font-bold tracking-[0.25em]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          D&amp;C
        </div>
        <div
          className="mt-1 text-base tracking-[0.45em] uppercase"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          Builders
        </div>
      </div>

      <div className="mx-auto my-8 h-px w-24 bg-white/30" />

      <h2
        className="mb-4 text-3xl font-light tracking-[0.3em] uppercase"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        Thank You
      </h2>

      <p className="mb-2 text-sm opacity-60">
        We look forward to working with you.
      </p>

      <div className="mx-auto my-8 h-px w-24 bg-white/30" />

      <p className="text-sm opacity-80">www.dcbuilders.com</p>
      <p className="mt-2 text-[10px] opacity-40">CSLB License #1116111</p>
    </section>
  );
}
