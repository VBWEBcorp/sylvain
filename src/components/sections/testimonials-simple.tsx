const testimonials = [
  {
    quote:
      "Sylvain a transformé notre appartement familial sans en trahir l'âme. Chaque détail a été pensé, chaque artisan bien choisi. Un chantier sans stress, c'est rare.",
    name: 'Camille & Thomas',
    context: 'Appartement · Paris 8e',
  },
  {
    quote:
      "Une écoute précieuse, une exigence constante. Studio M a donné à notre boutique une identité forte qui se lit dès la vitrine.",
    name: 'Léa M.',
    context: 'Boutique prêt-à-porter · Marais',
  },
  {
    quote:
      "Nous cherchions une vision, pas un catalogue. Sylvain a compris dès le premier rendez-vous. Le résultat dépasse ce que nous imaginions.",
    name: 'Antoine D.',
    context: 'Loft industriel · Batignolles',
  },
]

export function TestimonialsSimple() {
  return (
    <section className="bg-[oklch(0.93_0.03_82)] py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-foreground/50">
          Ils ont confié leur lieu à Studio M
        </p>
        <div className="mt-16 grid gap-16 md:grid-cols-3 md:gap-10">
          {testimonials.map((t) => (
            <figure key={t.name} className="relative">
              <span
                aria-hidden
                className="absolute -top-6 -left-2 font-display text-7xl leading-none text-foreground/15"
              >
                &ldquo;
              </span>
              <blockquote className="relative font-display text-xl font-light italic leading-[1.4] text-foreground/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 border-t border-border/70 pt-5">
                <p className="text-sm text-foreground">{t.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                  {t.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
