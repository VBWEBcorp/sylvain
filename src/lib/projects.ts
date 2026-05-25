export type PhotoCredit = {
  name: string
  url?: string
}

export type Project = {
  slug: string
  title: string
  category: 'Appartement' | 'Commerce' | 'Maison'
  location: string
  year: string
  surface: string
  duration: string
  cover: string
  gallery: string[]
  before?: string
  after?: string
  intro: string
  description: string[]
  services: string[]
  credits?: PhotoCredit[]
  comingSoon?: boolean
  shootingDate?: string
}

const IG = (handle: string) => `https://www.instagram.com/${handle}/`

// Projets réels Studio M. Galeries vides au départ : les photos sont
// uploadées via l'admin (/admin/projets/[slug]). Le titre est le code projet,
// la surface sert de descripteur (« 50 m² », « Dolce vita », « SDB »…).
export const projects: Project[] = [
  {
    slug: '1cb',
    title: '1CB',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '50 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [{ name: 'Studio Nohoia – David Stelmaszyk', url: IG('studio.nohoia') }],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: 'rm',
    title: 'RM',
    category: 'Appartement',
    location: '',
    year: '',
    surface: 'Dolce vita',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [
      { name: 'Studio Nohoia – David Stelmaszyk', url: IG('studio.nohoia') },
      { name: 'Anthony Denis (collaboration)', url: IG('anthonydenisflorist') },
    ],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '118r',
    title: '118R',
    category: 'Appartement',
    location: '',
    year: '',
    surface: 'SDB',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [{ name: 'Studio Nohoia – David Stelmaszyk', url: IG('studio.nohoia') }],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '5cw',
    title: '5CW',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '36 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [
      { name: 'Valério Geraci', url: IG('valeriogeraci') },
      { name: 'Sloft Magazine', url: IG('sloftmagazine') },
    ],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '1nc',
    title: '1NC',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '50 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [{ name: 'Camille Payat', url: IG('camillepayat') }],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '5sd',
    title: '5SD',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '90 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [{ name: 'Juan Jerez studio', url: IG('juanjerezstudio') }],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '116s',
    title: '116S',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '120 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [{ name: 'Juan Jerez studio', url: IG('juanjerezstudio') }],
    comingSoon: false,
    shootingDate: '',
  },
  {
    slug: '4jm',
    title: '4JM',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '60 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [
      { name: 'Fabienne Delafraye', url: IG('fabiennedelafraye') },
      { name: 'Sloft Magazine', url: IG('sloftmagazine') },
    ],
    comingSoon: true,
    shootingDate: 'Photos à venir',
  },
  {
    slug: '16ls',
    title: '16LS',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '35 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [],
    comingSoon: true,
    shootingDate: 'Shooting en juillet',
  },
  {
    slug: '21b',
    title: '21B',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '50 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [],
    comingSoon: true,
    shootingDate: 'Shooting en juillet',
  },
  {
    slug: '184sm',
    title: '184SM',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '37 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [],
    comingSoon: true,
    shootingDate: 'Shooting en juin',
  },
  {
    slug: '47r',
    title: '47R',
    category: 'Appartement',
    location: '',
    year: '',
    surface: '70 m²',
    duration: '',
    cover: '',
    gallery: [],
    intro: '',
    description: [],
    services: [],
    credits: [],
    comingSoon: true,
    shootingDate: 'Shooting le 4 juin',
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
