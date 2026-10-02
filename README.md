# 🧱 LEGO Tracker

Application web moderne pour gérer et partager votre collection LEGO (Le projet n'est plus maintenu)

## ✨ Fonctionnalités

- 📱 Interface responsive et intuitive
- 🎨 Thème clair/sombre
- 📦 Gestion complète des sets LEGO
- 🔍 Recherche dans le catalogue Rebrickable
- 🧩 Suivi des pièces manquantes
- 🔗 Partage de collection
- 📊 Statistiques de collection

## 🛠️ Stack Technique

- **Framework :** Next.js 15+
- **Language :** TypeScript
- **Style :** TailwindCSS + ShadCN UI
- **Base de données :** Supabase
- **Auth :** Clerk
- **State :** Zustand
- **Animations :** Framer Motion

## 🚀 Installation

1. Cloner le repo :

```bash
git clone https://github.com/thomaslekieffre/lego-tracker.git
cd lego-tracker
```

2. Installer les dépendances :

```bash
pnpm install
```

3. Configurer les variables d'environnement :

```bash
cp .env.example .env.local
```

4. Remplir `.env.local` avec :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=votre_clé
CLERK_SECRET_KEY=votre_secret

# Rebrickable
REBRICKABLE_API_KEY=votre_clé
```

5. Lancer les migrations Supabase :

```bash
pnpm supabase:migrate
```

6. Démarrer le serveur de développement :

```bash
pnpm dev
```

## 📖 Documentation

- [Contexte du Projet](./ProjectDocs/contexts/projectContext.md)
- [Notes de Build](./ProjectDocs/Build_Notes/)

## 🔒 Sécurité

- Authentification sécurisée via Clerk
- Row Level Security avec Supabase
- Protection CSRF
- Validation des entrées
- Sanitization des données

## 🌍 Internationalisation

- 🇫🇷 Français (par défaut)
- 🇬🇧 English (prévu)

## 📄 Licence

MIT - Voir [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

- GitHub Issues

## ⭐️ Remerciements

- [Rebrickable](https://rebrickable.com/) pour l'API
- [Supabase](https://supabase.com/) pour l'infrastructure
- [Vercel](https://vercel.com/) pour l'hébergement
