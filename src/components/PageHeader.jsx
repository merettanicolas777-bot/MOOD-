export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-white/10 bg-ink pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-10 lg:pb-14">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white/40" />
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">{eyebrow}</p>
        </div>
        <h1 className="mt-5 text-[clamp(2.4rem,7vw,4.8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/50">{description}</p>
        )}
        {children}
      </div>
    </section>
  )
}
