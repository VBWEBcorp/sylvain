import { brandAssets } from '@/lib/brand'

export function BannerStrip() {
  return (
    <section
      aria-hidden
      className="relative h-[55vh] min-h-[420px] w-full overflow-hidden"
    >
      <img
        src={brandAssets.banner}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-full items-center justify-center">
        <img
          src={brandAssets.wordmarkWhite}
          alt=""
          className="h-12 w-auto opacity-85 sm:h-20 lg:h-24"
        />
      </div>
    </section>
  )
}
