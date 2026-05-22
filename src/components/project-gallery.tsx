'use client'

import { useState } from 'react'

import { Lightbox } from '@/components/lightbox'

type Props = {
  images: string[]
  caption?: string
}

export function ProjectGallery({ images, caption }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  return (
    <>
      <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Agrandir la photo ${i + 1}`}
            className={`group relative block overflow-hidden bg-muted ${
              i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
            }`}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onChange={setIndex}
        caption={caption}
      />
    </>
  )
}
