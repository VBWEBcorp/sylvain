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
}

// Photos Unsplash en licence libre — remplaçables par les vraies photos de chantiers.
export const projects: Project[] = [
  {
    slug: 'haussmannien-monceau',
    title: 'Appartement haussmannien',
    category: 'Appartement',
    location: 'Paris 8e · Monceau',
    year: '2024',
    surface: '145 m²',
    duration: '6 mois',
    cover:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Restauration complète d'un cinq pièces classique : moulures révélées, cuisine ouverte, matériaux nobles.",
    description: [
      "Un appartement familial figé dans les années 80. J'ai repensé la circulation pour ouvrir la cuisine sur le séjour, tout en restaurant les parquets en point de Hongrie et les cheminées d'origine.",
      "Palette chaude : terracotta, chêne naturel, laiton brossé. Un éclairage scénique met en valeur les hauteurs sous plafond de 3,20 m.",
    ],
    services: ['Conception', 'Suivi de chantier', 'Mobilier sur mesure'],
  },
  {
    slug: 'boutique-marais',
    title: 'Boutique prêt-à-porter',
    category: 'Commerce',
    location: 'Paris 3e · Marais',
    year: '2024',
    surface: '78 m²',
    duration: '3 mois',
    cover:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
    intro:
      'Identité architecturale pour une marque de vêtements éco-responsables. Matières brutes et lumière naturelle.',
    description: [
      "Une boutique-écrin pour une marque en forte croissance. Briques peintes en écru, portants en acier patiné, cabines en rideau de lin épais.",
      "Le mobilier, entièrement dessiné sur mesure, est modulable pour accueillir les changements de collection saisonniers.",
    ],
    services: ['Concept retail', 'Agencement sur mesure', 'Éclairage'],
  },
  {
    slug: 'loft-batignolles',
    title: 'Loft industriel',
    category: 'Appartement',
    location: 'Paris 17e · Batignolles',
    year: '2023',
    surface: '185 m²',
    duration: '8 mois',
    cover:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Transformation d'un atelier d'artiste en loft contemporain. Verrières d'origine préservées.",
    description: [
      "180 m² tout en longueur, avec une verrière exceptionnelle. J'ai créé une mezzanine ouverte pour dégager les volumes et accueillir une suite parentale.",
      "Béton ciré, acier noir, bois brut : le lieu assume son passé industriel tout en gagnant en confort domestique.",
    ],
    services: ['Gros œuvre', 'Mezzanine', 'Cuisine sur mesure'],
  },
  {
    slug: 'restaurant-odeon',
    title: 'Restaurant bistronomique',
    category: 'Commerce',
    location: 'Paris 6e · Odéon',
    year: '2023',
    surface: '120 m²',
    duration: '4 mois',
    cover:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Une salle intime de 40 couverts, avec cuisine ouverte et cave à vins visible depuis la rue.",
    description: [
      "Un lieu de 120 m² à l'atmosphère feutrée. Banquettes en velours vert forêt, tables en chêne massif et luminaires dessinés sur mesure.",
      "La cuisine ouverte devient une scène : on y voit le chef travailler à travers un arc en pierre restauré.",
    ],
    services: ['Concept global', 'Mobilier sur mesure', 'Identité visuelle'],
  },
  {
    slug: 'maison-famille-vincennes',
    title: 'Maison de famille',
    category: 'Maison',
    location: 'Vincennes',
    year: '2023',
    surface: '220 m²',
    duration: '10 mois',
    cover:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fe6ba68?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Rénovation complète d'une maison des années 30. Préservation de l'âme, mise aux standards contemporains.",
    description: [
      "220 m² sur trois niveaux. J'ai repensé l'ensemble pour une famille de cinq : cuisine-salle à manger en double hauteur, quatre chambres, bureau et salle de jeu.",
      "Matériaux authentiques : tomettes restaurées, menuiseries sur mesure, chaux naturelle sur les murs.",
    ],
    services: ['Rénovation complète', 'Extension', 'Jardin'],
  },
  {
    slug: 'concept-store-saint-germain',
    title: 'Concept store lifestyle',
    category: 'Commerce',
    location: 'Paris 6e · Saint-Germain',
    year: '2022',
    surface: '95 m²',
    duration: '3 mois',
    cover:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600966903863-e49d5b62a1c3?auto=format&fit=crop&w=1600&q=80',
    ],
    intro:
      "Un lieu hybride boutique-café. Mobilier modulaire pour un espace qui se réinvente chaque semaine.",
    description: [
      "Le brief : un espace où l'on vient autant pour boire un café que pour découvrir de nouvelles marques. J'ai dessiné un système de présentoirs en chêne et acier brut, entièrement démontables.",
      "Le bar en travertin s'intègre au décor sans le dominer.",
    ],
    services: ['Concept retail', 'Agencement', 'Signalétique'],
  },
  {
    slug: 'duplex-saint-paul',
    title: 'Duplex sous les toits',
    category: 'Appartement',
    location: 'Paris 4e · Saint-Paul',
    year: '2022',
    surface: '95 m²',
    duration: '5 mois',
    cover:
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Réunification de deux chambres de bonne en un duplex lumineux. Tout est conçu sur mesure.",
    description: [
      "95 m² à exploiter au millimètre. Chaque meuble (lit, dressing, bureau, escalier) est dessiné et fabriqué sur mesure pour optimiser chaque recoin.",
      "Blanc cassé, chêne clair et touches noires : une palette sereine qui agrandit visuellement l'espace.",
    ],
    services: ['Réunion de lots', 'Mobilier intégré', 'Escalier dessiné'],
  },
  {
    slug: 'bureaux-bonne-nouvelle',
    title: "Bureaux d'agence",
    category: 'Commerce',
    location: 'Paris 2e · Bonne Nouvelle',
    year: '2022',
    surface: '180 m²',
    duration: '3 mois',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    ],
    intro:
      "Bureaux pour une agence de communication. Ambiance résidentielle, acoustique soignée.",
    description: [
      "180 m² pour 25 personnes. J'ai rejeté le plateau open-space au profit d'une suite d'ambiances : bibliothèque, salon, cuisine partagée, phone-booths.",
      "Tapis épais, rideaux lourds, velours et bois : on ne se sent plus au bureau.",
    ],
    services: ['Space planning', 'Mobilier', 'Acoustique'],
  },
  {
    slug: 'pied-a-terre-luxembourg',
    title: 'Pied-à-terre parisien',
    category: 'Appartement',
    location: 'Paris 6e · Luxembourg',
    year: '2021',
    surface: '62 m²',
    duration: '4 mois',
    cover:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac76f0e23ec?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?auto=format&fit=crop&w=1600&q=80',
    ],
    before:
      'https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1600&q=80',
    after:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    intro:
      "Un 62 m² pensé comme un hôtel particulier miniature. Pour un client qui passe deux semaines par mois à Paris.",
    description: [
      "Le défi : concilier usage hôtelier et âme domestique. Dressing intégré, kitchenette dissimulée, salle de bain en marbre de Carrare.",
      "Chaque détail a été anticipé pour que le client n'ait qu'à poser sa valise.",
    ],
    services: ['Rénovation clé en main', 'Mobilier', 'Décoration'],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
