import { brandAssets } from '@/lib/brand'

export function ManifestoSection() {
  return (
    <section className="bg-[var(--brand-cream)] py-28 sm:py-36">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <img
            src={brandAssets.monogramBeige}
            alt=""
            aria-hidden
            className="h-5 w-auto opacity-80 mix-blend-multiply"
          />
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Studio M · Manifeste
          </p>
        </div>
        <p className="mt-10 font-display text-[clamp(1.75rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-foreground/90">
          Je pense qu'un intérieur réussi se lit d'abord{' '}
          <span className="italic">à l'usage</span>. Avant les matières,
          avant la lumière, il y a une manière de vivre, de recevoir, de
          travailler. Mon rôle : la révéler, puis lui dessiner{' '}
          <span className="italic">un décor juste</span>.
        </p>
      </div>
    </section>
  )
}
