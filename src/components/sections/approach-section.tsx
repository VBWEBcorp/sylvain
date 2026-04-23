import { brandAssets } from '@/lib/brand'

const steps = [
  {
    n: '01',
    title: 'Écouter',
    body: "Un premier rendez-vous sur place pour comprendre vos usages, vos envies, vos contraintes. Sans apriori esthétique.",
  },
  {
    n: '02',
    title: 'Dessiner',
    body: "Plans, moodboards, choix des matières. Plusieurs allers-retours jusqu'à ce que l'espace ait trouvé sa juste forme.",
  },
  {
    n: '03',
    title: 'Construire',
    body: "Coordination complète du chantier avec mes artisans. Un interlocuteur unique, un planning tenu, un budget maîtrisé.",
  },
  {
    n: '04',
    title: 'Livrer',
    body: "De la visite technique de réception à la pose des dernières lampes. Votre lieu est prêt à vivre.",
  },
]

export function ApproachSection() {
  return (
    <section className="bg-[var(--brand-cream)] py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-4">
              <img
                src={brandAssets.monogramBeige}
                alt=""
                aria-hidden
                className="h-5 w-auto opacity-80 mix-blend-multiply"
              />
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
                Méthode
              </p>
            </div>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight text-foreground">
              Du concept <br />
              <span className="italic">au chantier.</span>
            </h2>
            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-foreground/70">
              Quatre temps, un seul interlocuteur. Une démarche pensée pour
              préserver votre énergie autant que votre budget.
            </p>
          </div>

          <ol className="divide-y divide-border/60 border-t border-border/60">
            {steps.map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-[auto_1fr] gap-8 py-8 sm:grid-cols-[60px_1fr_2fr] sm:gap-10 sm:py-10"
              >
                <span className="font-display text-xl italic text-foreground/50">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                  {s.title}
                </h3>
                <p className="col-span-2 text-[15px] leading-relaxed text-foreground/65 sm:col-span-1">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
