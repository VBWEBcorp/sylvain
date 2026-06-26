import Link from 'next/link'

import { brandAssets } from '@/lib/brand'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  variant?: 'light' | 'dark'
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  const src = variant === 'dark' ? brandAssets.wordmarkWhite : brandAssets.wordmarkDark
  return (
    <Link
      href="/"
      aria-label="Studio M, retour à l'accueil"
      className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}
    >
      {/* +25% vs taille précédente (h-16 / 4.5rem) — demande client : logo plus visible.
          w-auto conserve les proportions (le wordmark est carré). width/height
          reflètent ce ratio 1:1 pour réserver l'espace et éviter tout décalage
          de mise en page (CLS) pendant le chargement. */}
      <img
        src={src}
        alt="Studio M"
        width={90}
        height={90}
        className="h-20 w-auto sm:h-[5.625rem]"
        draggable={false}
      />
    </Link>
  )
}
