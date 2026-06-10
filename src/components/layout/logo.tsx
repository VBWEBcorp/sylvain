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
      <img src={src} alt="Studio M" className="h-16 w-auto sm:h-[4.5rem]" draggable={false} />
    </Link>
  )
}
