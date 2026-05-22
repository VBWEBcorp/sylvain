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
  }
  home: {
    eyebrow: string
    heroImage: string
  }
  studio: {
    eyebrow: string
    title: string
    paragraphs: string[]
    signature: string
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
    email: 'sylvain@studio-m.paris',
    phone: '+33 6 12 34 56 78',
    address: {
      street: '14 rue de Turenne',
      postalCode: '75003',
      city: 'Paris',
    },
    instagram: 'https://instagram.com/studiom.paris',
  },
  home: {
    eyebrow: "Architecte d'intérieur · Paris",
    heroImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  },
  studio: {
    eyebrow: 'Le studio',
    title: 'Sylvain, architecte d\'intérieur à Paris.',
    paragraphs: [
      "J'aime faire danser les murs, animer le regard, dessiner des ronds comme l'eau vive d'un ruisseau. Je crois à la douceur, à la beauté des choses, au dialogue sincère.",
      "Chaque nouveau projet est une exploration : rendre vraies, fonctionnelles et durables les aires de vie du quotidien.",
    ],
    signature: 'Sylvain Marceau, fondateur de Studio M',
    portrait: 'https://i.ibb.co/kg1p7h2k/Sylvain.jpg',
  },
  contact: {
    eyebrow: 'Échangeons',
    title: 'Racontez-moi votre projet.',
    intro:
      'Premier rendez-vous offert, chez vous ou au studio, dans le Marais. Je reviens vers vous sous 48 h ouvrées.',
    formTitle: 'Quelques mots suffisent.',
    formIntro: 'Premier contact',
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
