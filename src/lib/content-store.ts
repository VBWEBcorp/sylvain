import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

export type SiteContent = {
  site: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      postalCode: string
      city: string
    }
    instagram: string
    hours: string
  }
  home: {
    eyebrow: string
    heroImage: string
  }
  studio: {
    eyebrow: string
    title: string
    quote: string
    paragraphs: string[]
    portrait: string
  }
  contact: {
    eyebrow: string
    title: string
    intro: string
    formTitle: string
    formIntro: string
  }
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'content.json')

const DEFAULTS: SiteContent = {
  site: {
    name: 'Studio M',
    email: 'sylvain@sylvainmarceau.com',
    phone: '+33 6 58 87 57 10',
    address: {
      street: '16 rue Lucien Sampaix',
      postalCode: '75010',
      city: 'Paris',
    },
    instagram: 'https://www.instagram.com/studio_m_________/',
    hours: '',
  },
  home: {
    eyebrow: "Architecte d'intérieur · Paris",
    heroImage: '/hero-accueil.webp',
  },
  studio: {
    eyebrow: "Architecte d'intérieur",
    title: 'Sylvain Marceau',
    quote:
      "J'aime faire danser les murs comme l'eau vive d'un ruisseau, lorsque le volume anime le regard et élève la curiosité.",
    paragraphs: [
      "Avec la volonté d'une expérience protéiforme pour les aires de vie du quotidien, Sylvain crée studio m en 2024 à Paris, au service des particuliers et des professionnels.",
      "Soucieux des détails et des usages, chaque projet ouvre la réflexion du travail de la lumière, de la rencontre des matériaux et des textures, des formes et des circulations.",
      "Les conceptions maîtrisées donnent à l'espace un caractère sur mesure, insufflé par les références artistiques plurielles et Mid-century, la mémoire des lieux, la volonté formelle d'une exécution qualitative et durable. Sylvain donne une vision 360 degrés au projet, de la conception à l'exécution, jusqu'à la réception du chantier.",
    ],
    portrait: '/portrait-sylvain.webp',
  },
  contact: {
    eyebrow: '',
    title: '',
    intro: '',
    formTitle: '',
    formIntro: '',
  },
}

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULTS, null, 2), 'utf8')
  }
}

export async function readContent(): Promise<SiteContent> {
  try {
    await ensureFile()
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<SiteContent>
    // Merge with defaults pour tolérer une structure incomplète
    return {
      site: { ...DEFAULTS.site, ...parsed.site, address: { ...DEFAULTS.site.address, ...parsed.site?.address } },
      home: { ...DEFAULTS.home, ...parsed.home },
      studio: { ...DEFAULTS.studio, ...parsed.studio },
      contact: { ...DEFAULTS.contact, ...parsed.contact },
    }
  } catch {
    return DEFAULTS
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), 'utf8')
}

export async function patchContent<K extends keyof SiteContent>(
  section: K,
  patch: Partial<SiteContent[K]>
): Promise<SiteContent> {
  const current = await readContent()
  const next = {
    ...current,
    [section]: { ...current[section], ...patch },
  } as SiteContent
  await writeContent(next)
  return next
}

export { DEFAULTS as defaultContent }
