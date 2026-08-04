/**
 * Soft ambient colour behind dark sections.
 * Purely decorative — it stops moving under Reduce Motion but the
 * gradient itself stays, so the section still looks finished.
 */
export default function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="orb-a absolute -left-[10%] -top-[20%] h-[min(600px,90vw)] w-[min(600px,90vw)] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(167,139,250,0.45),rgba(75,0,130,0.18)_60%,transparent_72%)] blur-3xl" />
      <div className="orb-b absolute -right-[12%] top-[30%] h-[min(500px,80vw)] w-[min(500px,80vw)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(100,149,237,0.4),rgba(27,0,63,0.15)_62%,transparent_74%)] blur-3xl" />
    </div>
  )
}
