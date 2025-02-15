# Lego Tracker

Application web permettant aux collectionneurs de Lego de gérer leur collection, suivre l'état de leurs sets et gérer les pièces manquantes.

## Fonctionnalités

- 🎯 Suivi des sets Lego (montés, démontés, incomplets)
- 📦 Gestion des pièces manquantes
- 🔔 Notifications de disponibilité des pièces
- 📊 Statistiques de collection
- 👥 Fonctionnalités communautaires

## Stack Technique

- **Frontend** : Next.js 15+, TypeScript, ShadcnUI, TailwindCSS
- **Backend** : Supabase (PostgreSQL)
- **Auth** : Clerk
- **API** : Rebrickable
- **State** : Zustand
- **Testing** : Jest, React Testing Library

## Prérequis

- Node.js 18+
- pnpm
- Compte Supabase
- Compte Clerk
- Clé API Rebrickable

## Installation

1. Cloner le repo

```bash
git clone [repo-url]
cd lego-tracker
```

2. Installer les dépendances

```bash
pnpm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
# Remplir les variables dans .env
```

4. Lancer le serveur de développement

```bash
pnpm dev
```

## Structure du Projet

```
lego-tracker/
├── src/
│   ├── app/
│   │   ├── components/    # Composants réutilisables
│   │   ├── features/      # Fonctionnalités principales
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── layouts/       # Layouts de l'application
│   │   ├── lib/          # Utilitaires et configurations
│   │   └── styles/       # Styles globaux
│   └── packages/         # Packages partagés
├── ProjectDocs/
│   ├── Build_Notes/      # Notes de build
│   └── contexts/         # Contextes du projet
└── public/              # Assets statiques
```

## Contribution

1. Créer une branche (`git checkout -b feature/amazing-feature`)
2. Commit les changements (`git commit -m 'feat: add amazing feature'`)
3. Push la branche (`git push origin feature/amazing-feature`)
4. Ouvrir une Pull Request

## Licence

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
