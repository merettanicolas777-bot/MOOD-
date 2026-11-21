export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-line bg-cream pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1400px] px-5 pb-9 sm:px-8 lg:px-10 lg:pb-12">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-ink/30" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">{eyebrow}</p>
        </div>
        <h1 className="mt-4 font-serif text-[clamp(2.4rem,7vw,4.6rem)] font-medium leading-[1] tracking-[-0.01em]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{description}</p>
        )}
        {children}
      </div>
    </section>
  )
}
