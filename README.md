# Librairie d'Alliance — Cathédrale ABMCI

Site vitrine de la Librairie d'Alliance de la Cathédrale ABMCI (Cité de la Grâce, Abidjan). Toutes les commandes sont redirigées vers WhatsApp.

## Stack technique

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- Données des livres dans `src/data/books.ts`

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Déploiement

### Vercel (recommandé)
1. Connecter le dépôt GitHub à Vercel
2. Le déploiement est automatique à chaque push

### Hostinger
1. `npm run build`
2. Uploader le contenu du dossier `.next/` et `public/` sur le serveur
3. Configurer Node.js 20+ sur le serveur

## Structure du projet

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx            # Accueil
│   ├── catalogue/
│   │   ├── page.tsx        # Catalogue complet
│   │   └── [slug]/         # Détail livre
│   ├── livres-audio/       # Page livres audio
│   └── contact/            # Page contact
├── components/
│   ├── layout/             # Header, Footer, WhatsApp button
│   ├── sections/           # Sections de la homepage
│   ├── books/              # BookCard
│   └── ui/                 # Composants réutilisables
├── data/
│   └── books.ts            # Catalogue des livres (MODIFIER ICI)
└── lib/
    ├── whatsapp.ts         # Helpers WhatsApp
    └── utils.ts            # Utilitaires
```

## Ajouter un nouveau livre

Ouvrir `src/data/books.ts` et ajouter un objet au tableau `books` :

```typescript
{
  slug: "mon-nouveau-livre",
  title: "Mon Nouveau Livre",
  author: "Pasteur Alexandre Amazou",
  category: "livre-papier",
  status: "available",
  price: 5000,
  formats: ["papier"],
  description: "Description du livre...",
  coverImage: "/images/books/mon-nouveau-livre.jpg",
}
```

Placer l'image de couverture dans `public/images/books/`.

## Remplacer les couvertures provisoires

Les fichiers `.svg` dans `public/images/books/` sont des couvertures provisoires. Pour les remplacer :

1. Placer la vraie image (JPG/PNG) dans `public/images/books/`
2. Mettre à jour le chemin `coverImage` dans `src/data/books.ts`

Couvertures provisoires (SVG) :
- `preparer-reussir-nouvelle-annee.svg`
- `realite-monde-esprits.svg`
- `prieres-non-exaucees.svg`
- `race-de-dieu.svg`
- `commencer-bien-finir.svg`
- `meilleure-version.svg`
- `protocole-gloire.svg`

## WhatsApp

Le numéro WhatsApp est configuré dans `src/lib/whatsapp.ts`. Pour le modifier, changer la constante `WHATSAPP_NUMBER`.

## Photo de l'auteur

Remplacer le placeholder dans la section "A propos de l'auteur" en :
1. Placant la photo dans `public/images/author.jpg`
2. Modifiant le composant `src/components/sections/AuthorSection.tsx`
