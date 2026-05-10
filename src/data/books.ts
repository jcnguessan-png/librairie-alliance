export type BookStatus = "available" | "out-of-stock" | "preorder" | "coming-soon";
export type BookFormat = "papier" | "ebook" | "audio";
export type BookCategory = "livre-papier" | "ebook" | "livre-audio" | "bible" | "kids-ado" | "accessoire";

export type BookTheme =
  | "leadership"
  | "foi"
  | "priere"
  | "famille"
  | "monde-spirituel"
  | "reussite"
  | "heritage"
  | "finances";

export const bookThemes: { id: BookTheme; label: string }[] = [
  { id: "leadership", label: "Leadership" },
  { id: "foi", label: "Foi" },
  { id: "priere", label: "Prière" },
  { id: "famille", label: "Famille" },
  { id: "monde-spirituel", label: "Monde spirituel" },
  { id: "reussite", label: "Réussite" },
  { id: "heritage", label: "Héritage" },
  { id: "finances", label: "Finances" },
];

export interface Book {
  slug: string;
  title: string;
  author: string;
  category: BookCategory;
  status: BookStatus;
  featured?: boolean;
  badge?: string;
  price: number | null;
  formats: BookFormat[];
  themes?: BookTheme[];
  audioExcerpt?: string | null;
  amazonLink?: string | null;
  description: string;
  longDescription?: string;
  coverImage: string;
  pages?: number | null;
  year?: number | null;
  isbn?: string | null;
}

export const books: Book[] = [
  {
    slug: "la-realite-du-monde-des-esprits",
    title: "La Réalité du Monde des Esprits",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    featured: true,
    badge: "Best-Seller — Nouvelle Édition 2026",
    price: 5000,
    formats: ["papier"],
    themes: ["monde-spirituel", "foi"],
    isbn: "978-9-8253-4938-23",
    description:
      "Best-seller depuis 2021, de retour en 2026 dans une édition entièrement révisée et augmentée. Une plongée biblique rigoureuse dans la cosmologie spirituelle.",
    longDescription:
      "Best-seller depuis sa première parution en 2021, ce livre revient en 2026 dans une édition entièrement révisée et augmentée — préface de la Pasteure Laurette AMAZOU, structure enrichie en cinq actes (Éveil, Formation, Armement, Combat, Domination) et quinze chapitres. Une plongée biblique rigoureuse dans la cosmologie spirituelle : comment le monde des esprits — créé par Dieu, divisé en deux royaumes après la chute de Lucifer — gouverne réellement les destinées personnelles, familiales et nationales. Chaque chapitre se conclut par des points à retenir, des questions de réflexion, une prière guidée et des versets à mémoriser, pour transformer la lecture en expérience.",
    coverImage: "/images/books/realite-monde-esprits-2026.png",
    year: 2026,
  },
  {
    slug: "40-jours-de-combat-spirituel",
    title: "40 Jours de Combat Spirituel",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    badge: "Nouveau",
    price: 4000,
    formats: ["papier"],
    themes: ["priere", "monde-spirituel", "foi"],
    isbn: "9798259008977",
    description:
      "Le livret de prière officiel inspiré du best-seller « La Réalité du Monde des Esprits ». 40 jours pour ne plus combattre à l'aveugle.",
    longDescription:
      "Programme de prière de 40 jours inspiré de « La Réalité du Monde des Esprits ». Cinq semaines pensées comme cinq actes — l'Éveil, la Formation, l'Armement, le Combat, la Domination — qui mènent le croyant pas à pas de l'ignorance à la victoire. Chaque jour propose un passage à lire, un verset-clé, une méditation, une prière déclarée à haute voix, une application pratique et un espace journal. Utilisable seul, en couple ou en groupe (cellule de maison, étude biblique). 40 jours pour ne plus combattre à l'aveugle.",
    coverImage: "/images/books/40-jours-combat-spirituel.png",
    year: 2026,
  },
  {
    slug: "comment-preparer-et-reussir-une-nouvelle-annee",
    title: "Comment préparer et réussir une nouvelle année",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    badge: "Best-Seller",
    price: 5000,
    formats: ["papier"],
    themes: ["leadership", "reussite", "foi", "priere"],
    isbn: "9798272678249",
    description:
      "Un guide pratique et spirituel pour aborder chaque nouvelle année avec foi, stratégie et détermination.",
    longDescription:
      "Une nouvelle année n'est pas un simple changement de calendrier — c'est un champ de bataille spirituel où se jouent les enjeux éternels d'une destinée. Fruit de plus de vingt ans de ministère et d'une révélation stratégique reçue par l'auteur, ce manuel dévoile les lois spirituelles qui gouvernent les cycles temporels : les quatre portes prophétiques de l'année (équinoxes et solstices), les quatre armes de commandement (Prière de Commandement, Puissance du Sacrifice, Loi de l'Honneur, Loi des Prémices), les protocoles pratiques de préparation (diagnostic, guerre prophétique, programmation), des cas concrets et un plan d'action personnalisé. Pour ne plus subir l'année — la commander.",
    coverImage: "/images/books/preparer-et-reussir-une-nouvelle-annee.jpg",
    year: 2025,
  },
  {
    slug: "mon-journal-de-victoire",
    title: "Mon Journal de Victoire",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    badge: "Nouveau",
    price: 4000,
    formats: ["papier"],
    themes: ["priere", "reussite", "leadership", "foi"],
    isbn: "9798276847542",
    description:
      "Le compagnon spirituel officiel du livre « Comment préparer et réussir une nouvelle année ». Votre saison de conquête commence ici.",
    longDescription:
      "Plus qu'un agenda ou un carnet de notes : un véritable arsenal de guerre spirituelle. Pensé pour accompagner les révélations du livre « Comment préparer et réussir une nouvelle année », ce journal transforme la théorie en pratique quotidienne. Chaque mois, des espaces dédiés pour définir vos objectifs spirituels et naturels, écrire vos prières et décrets, planifier vos jeûnes et sacrifices, activer la Loi de l'Honneur et la Loi des Prémices, documenter vos victoires. Conçu autour des quatre armes de commandement, il vous fait passer de la passivité à l'autorité — mois après mois.",
    coverImage: "/images/books/mon-journal-de-victoire.png",
    year: 2025,
  },
  {
    slug: "le-transfert-de-liniquite-par-les-liens-du-sang",
    title: "Le Transfert de l'iniquité par les liens du sang",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    badge: "Best-Seller",
    price: 5000,
    formats: ["papier"],
    themes: ["monde-spirituel", "famille", "heritage"],
    description:
      "Un best-seller qui révèle comment les iniquités se transmettent à travers les générations par les liens du sang, et comment s'en libérer.",
    longDescription:
      "Les iniquités transmises de génération en génération par les liens génétiques constituent un véritable fardeau spirituel. Cet enseignement bâtit la solution pour rompre l'héritage maléfique, refuser ses effets et bénéficier d'un diagnostic complet pour libérer son existence et celle de sa descendance — pour qui veut changer son histoire et susciter une nouvelle génération.",
    coverImage: "/images/books/le-transfert-de-l-iniquite.jpg",
    year: 2025,
  },
  {
    slug: "la-faveur-des-peres",
    title: "La Faveur des Pères",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 5000,
    formats: ["papier"],
    themes: ["famille", "heritage", "leadership"],
    description:
      "L'importance de la couverture paternelle et de la bénédiction des pères spirituels dans la destinée de chaque croyant.",
    longDescription:
      "Découvrez le pouvoir générationnel de la bénédiction paternelle dans l'Écriture. Ce livre dévoile comment la faveur transmise par les pères façonne la trajectoire des fils — et pourquoi tout chrétien doit reconquérir ce lien spirituel essentiel pour entrer dans son héritage.",
    coverImage: "/images/books/la-faveur-des-peres.png",
    year: 2024,
  },
  {
    slug: "les-hommes-de-la-race-de-dieu",
    title: "Les Hommes de la Race de Dieu",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["leadership", "foi"],
    description:
      "Découvrez votre véritable identité en tant qu'enfant de Dieu. Un appel puissant à vivre selon la nature divine.",
    longDescription:
      "Une exhortation prophétique destinée à former une génération de croyants qui portent le sceau de la nature divine. À partir des figures bibliques majeures, le Pasteur Alexandre AMAZOU décline les caractéristiques, les épreuves et les responsabilités des hommes appelés à représenter Dieu sur la terre.",
    coverImage: "/images/books/les-hommes-de-la-race-de-dieu.png",
    year: 2023,
  },
  {
    slug: "la-verite-sur-les-prieres-non-exaucees",
    title: "Le secret des prières non exaucées",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["priere", "foi"],
    description:
      "Pourquoi certaines prières semblent-elles rester sans réponse ? Les obstacles à l'exaucement et les clés pour une vie de prière efficace.",
    longDescription:
      "Pourquoi certaines prières restent-elles sans réponse ? Cet ouvrage met en lumière les obstacles spirituels, les principes ignorés et les ajustements de cœur nécessaires pour que la prière devienne le canal puissant que Dieu a institué. Un manuel pratique pour intercesseurs et croyants exigeants.",
    coverImage: "/images/books/la-verite-sur-les-prieres-non-exaucees.png",
    year: 2023,
  },
  {
    slug: "le-protocole-dacces-a-la-gloire-de-dieu",
    title: "Le Protocole d'accès à la Gloire de Dieu",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["foi", "priere"],
    description:
      "Les étapes et les conditions pour accéder à la gloire manifestée de Dieu. Un guide pour ceux qui désirent vivre des expériences surnaturelles authentiques.",
    longDescription:
      "La gloire de Dieu n'est pas accessible n'importe comment : elle obéit à un protocole — sanctification, consécration, alignement, offrande. Ce livre déroule pas à pas les conditions bibliques qui permettent au croyant de pénétrer dans la dimension où la présence de Dieu se manifeste avec puissance.",
    coverImage: "/images/books/le-protocole-d-acces-a-la-gloire-de-dieu.png",
    year: 2022,
  },
  {
    slug: "reussir-sa-vie",
    title: "Réussir sa vie",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["leadership", "reussite"],
    description:
      "Les principes divins pour une vie réussie dans toutes ses dimensions : spirituelle, familiale, professionnelle et financière.",
    longDescription:
      "Réussir sa vie selon Dieu, c'est accomplir le projet pour lequel Il nous a créés — et non simplement collectionner des succès. Manuel de leadership chrétien éprouvé, cet ouvrage trace les étapes incontournables : vocation, vision, valeurs, vertus, victoire — pour quiconque veut laisser une empreinte éternelle.",
    coverImage: "/images/books/reussir-sa-vie.png",
    year: 2021,
  },
  {
    slug: "devenez-riche-pour-dieu",
    title: "Devenir riche pour Dieu",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["finances", "leadership", "foi"],
    description:
      "La prospérité selon Dieu : pourquoi et comment Dieu veut que ses enfants prospèrent pour accomplir Son œuvre sur la terre.",
    longDescription:
      "La richesse n'est pas un péché ; elle est un mandat lorsqu'elle finance le Royaume. Ce livre développe une théologie chrétienne et africaine de l'argent : produire pour Dieu, gérer pour Dieu, multiplier pour Dieu — afin que les ressources nécessaires à la mission ne manquent plus jamais à l'Église.",
    coverImage: "/images/books/devenir-riche-pour-dieu.png",
    year: 2020,
  },
  {
    slug: "commencer-et-bien-finir-sa-vie",
    title: "Commencer et bien finir sa vie",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["leadership", "reussite", "heritage"],
    description:
      "Comment bien commencer et surtout bien terminer la course de la vie chrétienne. Un enseignement sur la persévérance et la fidélité.",
    longDescription:
      "Beaucoup commencent fort et terminent dans la défaite. Cet enseignement révèle les principes spirituels qui permettent non seulement de bien démarrer son appel, mais surtout de tenir jusqu'à la dernière ligne — héritage, persévérance et fidélité à la vocation reçue.",
    coverImage: "/images/books/commencer-bien-finir.svg",
    year: 2019,
  },
  {
    slug: "devenir-la-meilleure-version-de-soi",
    title: "Devenir la meilleure version de Soi",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["leadership", "reussite", "foi"],
    description:
      "Un appel à l'excellence et à la transformation personnelle. Découvrez comment Dieu vous destine à devenir la meilleure version de vous-même.",
    longDescription:
      "Dieu vous a créé avec un potentiel précis ; ce livre vous donne les clés bibliques pour identifier ce potentiel, le développer méthodiquement et l'incarner pleinement. Un parcours de transformation personnelle ancré dans l'Écriture pour quiconque refuse la médiocrité spirituelle.",
    coverImage: "/images/books/meilleure-version.svg",
    year: 2019,
  },
  {
    slug: "lordre-divin",
    title: "L'Ordre Divin",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "out-of-stock",
    price: 4000,
    formats: ["papier"],
    themes: ["leadership", "foi"],
    description:
      "Comprendre l'ordre établi par Dieu dans tous les domaines de la vie. Un enseignement sur les principes d'autorité et de soumission divine.",
    coverImage: "/images/books/ordre-divin.jpg",
  },
  {
    slug: "la-foi-pour-changer-son-monde",
    title: "La FOI pour changer son monde",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "out-of-stock",
    price: 4000,
    formats: ["papier"],
    themes: ["foi", "reussite"],
    description:
      "La foi comme instrument de transformation. Apprenez à exercer une foi active qui déplace les montagnes et change votre environnement.",
    coverImage: "/images/books/foi-changer-monde.jpg",
  },
  {
    slug: "la-reussite-une-idee-de-dieu",
    title: "La réussite, une idée de Dieu",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 4000,
    formats: ["papier"],
    themes: ["reussite", "foi"],
    description:
      "La réussite n'est pas un accident mais un dessein divin. Découvrez comment aligner votre vie avec le plan de Dieu pour la réussite.",
    coverImage: "/images/books/reussite-idee-de-dieu.jpg",
  },
  {
    slug: "les-qualites-dun-bon-ouvrier-de-jesus",
    title: "Les qualités d'un bon ouvrier de Jésus",
    author: "Pasteur Alexandre Amazou",
    category: "livre-papier",
    status: "available",
    price: 3500,
    formats: ["papier"],
    themes: ["leadership", "foi"],
    description:
      "Les caractéristiques essentielles que tout serviteur de Dieu doit cultiver pour être un ouvrier approuvé dans le Royaume.",
    coverImage: "/images/books/qualites-bon-ouvrier.jpg",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export function getBooksByCategory(category: BookCategory): Book[] {
  return books.filter((book) => book.category === category);
}

export function getFeaturedBook(): Book | undefined {
  return books.find((book) => book.featured);
}

export function getComingSoonBooks(): Book[] {
  return books.filter((book) => book.status === "coming-soon");
}

export function getAvailableBooks(): Book[] {
  return books.filter((book) => book.status === "available");
}

export const categories = [
  { value: "all", label: "Tous" },
  { value: "livre-papier", label: "Livres papier" },
  { value: "ebook", label: "Ebooks" },
  { value: "livre-audio", label: "Livres audio" },
  { value: "bible", label: "Bibles" },
  { value: "kids-ado", label: "Kids & Ado" },
  { value: "accessoire", label: "Accessoires" },
] as const;
