export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  cover: string
  date: string // ISO
  author: string
  readingTime: string
  content: string[] // paragraphes
  tags?: string[]
}

export const defaultBlogPosts: BlogPost[] = [
  {
    slug: 'palette-haussmannien',
    title: 'Réveiller un haussmannien sans le trahir',
    excerpt:
      "Comment moderniser un appartement classique sans effacer son âme : moulures, parquets, hauteurs sous plafond — quelques principes simples.",
    cover:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    date: '2026-04-12',
    author: 'Sylvain Marceau',
    readingTime: '5 min',
    content: [
      "Quand un client me confie un appartement haussmannien, la première discussion ne porte jamais sur la déco. Elle porte sur ce qui doit rester. Les moulures, les parquets en point de Hongrie, les cheminées en marbre : ces éléments racontent une époque, et leur conservation conditionne tout le reste du projet.",
      "Le piège classique : tout repeindre en blanc pour « moderniser ». Le résultat est lisse, sans relief, sans mémoire. Je préfère une palette chaude — terracotta, ocre, vert mousse — qui dialogue avec les bois anciens et révèle les volumes plutôt que de les niveler.",
      "Côté matières, le laiton brossé, le travertin et le chêne huilé suffisent à composer un vocabulaire contemporain qui n'écrase pas l'héritage du lieu. La règle : un seul geste fort par pièce, le reste est en accompagnement.",
    ],
    tags: ['Appartement', 'Haussmannien', 'Conseil'],
  },
  {
    slug: 'budget-renovation',
    title: 'Établir un budget réaliste avant de se lancer',
    excerpt:
      "Le poste « travaux » est rarement celui qu'on croit. Voici les grandes lignes à anticiper avant le premier coup de marteau.",
    cover:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    date: '2026-03-02',
    author: 'Sylvain Marceau',
    readingTime: '7 min',
    content: [
      "La question revient à chaque premier rendez-vous : « combien ça coûte au m² ? » Difficile de répondre sans connaître le projet. Mais on peut poser quelques repères.",
      "Pour une rénovation complète d'appartement parisien standing, comptez entre 2 500 et 4 500 € HT/m² selon le niveau de finition et la complexité (gros œuvre, plomberie, électricité refaits). Le mobilier sur mesure s'ajoute par-dessus.",
      "Mes honoraires de conception + suivi de chantier représentent généralement 12 à 15 % du coût total des travaux. C'est l'investissement qui sécurise le budget global : un projet bien dessiné est un projet sans surprise.",
    ],
    tags: ['Conseil', 'Budget'],
  },
  {
    slug: 'commerce-identite',
    title: "Donner une identité à un commerce en quelques gestes",
    excerpt:
      "Une boutique réussie raconte la marque avant même que le client n'ait parlé au vendeur. Trois leviers à activer.",
    cover:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
    date: '2026-01-22',
    author: 'Sylvain Marceau',
    readingTime: '4 min',
    content: [
      "Une boutique, c'est une scène. Le client entre, observe, décide en quelques secondes s'il a affaire à un lieu de qualité. L'architecture intérieure porte cette première impression.",
      "Premier levier : la lumière. Pas générale, pas plafonnante. Localisée, basse, chaude. Elle crée des îlots d'attention sur les produits.",
      "Deuxième levier : la matière. Une seule, dominante, traitée avec qualité. Un bois brut, un travertin, un acier patiné. Le reste accompagne.",
      "Troisième levier : la circulation. Un parcours pensé, qui invite à entrer, à découvrir, à s'arrêter. Pas un tunnel — une promenade.",
    ],
    tags: ['Commerce', 'Concept'],
  },
]

export function getPost(slug: string) {
  return defaultBlogPosts.find((p) => p.slug === slug)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
