# 🧱 Lego Tracker

Une application web moderne pour gérer votre collection de LEGO, suivre les pièces manquantes et partager votre collection.

## 🚀 Fonctionnalités

- **Gestion de Collection**

  - Ajout de sets LEGO via l'API Rebrickable
  - Suivi du statut (monté, démonté, incomplet)
  - Notes personnalisées par set
  - Visualisation détaillée des sets

- **Gestion des Pièces Manquantes**

  - Ajout de pièces manquantes avec couleur
  - Suivi du statut (en recherche, commandée, trouvée)
  - Prix et liens d'achat
  - Compteur automatique

- **Partage de Collection**
  - Liens de partage publics ou privés
  - Expiration configurable
  - Compteur de vues
  - Vue optimisée pour le partage

## 🛠️ Technologies

- **Frontend**

  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI
  - Framer Motion

- **Backend**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Clerk (Authentification)
  - API Rebrickable

## 📦 Installation

1. Cloner le repository

```bash
git clone https://github.com/votre-username/lego-tracker.git
cd lego-tracker
```

2. Installer les dépendances

```bash
pnpm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

4. Remplir les variables d'environnement :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=votre_clé_publique_clerk
CLERK_SECRET_KEY=votre_clé_secrète_clerk
CLERK_WEBHOOK_SECRET=votre_secret_webhook

# Rebrickable
REBRICKABLE_API_KEY=votre_clé_api_rebrickable
```

5. Lancer le serveur de développement

```bash
pnpm dev
```

## 🗄️ Structure du Projet

```
lego-tracker/
├── src/
│   ├── app/                    # Routes Next.js
│   ├── components/             # Composants React
│   ├── hooks/                  # Hooks personnalisés
│   ├── lib/                    # Utilitaires et configurations
│   ├── schemas/               # Schémas de validation
│   └── types/                 # Types TypeScript
├── supabase/
│   └── migrations/            # Migrations SQL
├── public/                    # Assets statiques
└── ProjectDocs/              # Documentation technique
```

## 🔐 Base de Données

La structure de la base de données est gérée via des migrations Supabase :

- `users` : Informations utilisateur synchronisées avec Clerk
- `lego_sets` : Collection de sets LEGO
- `missing_pieces` : Pièces manquantes par set
- `shared_collections` : Configuration des partages

## 🚥 Politiques de Sécurité

Les politiques RLS assurent que :

- Chaque utilisateur ne peut voir et modifier que ses propres données
- Les collections partagées sont accessibles via leur token
- Les webhooks Clerk peuvent mettre à jour les utilisateurs

## 🔄 Workflow de Développement

1. Créer une nouvelle branche pour chaque feature

```bash
git checkout -b feature/nom-de-la-feature
```

2. Commiter avec des messages conventionnels

```bash
git commit -m "feat: description de la feature"
git commit -m "fix: correction du bug"
```

3. Pousser et créer une Pull Request

```bash
git push origin feature/nom-de-la-feature
```

## 📝 Conventions de Code

- **TypeScript strict** pour tout le code
- **ESLint** et **Prettier** pour le formatage
- **Composants fonctionnels** React
- **Hooks personnalisés** pour la logique réutilisable
- **Tests unitaires** pour les fonctions critiques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commiter les changements (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Rebrickable](https://rebrickable.com/) pour leur API
- [Clerk](https://clerk.dev/) pour l'authentification
- [Supabase](https://supabase.io/) pour la base de données
- [Vercel](https://vercel.com/) pour l'hébergement
