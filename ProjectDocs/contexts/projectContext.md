# Lego Tracker - Contexte du Projet

## Vision du Projet

Application web permettant aux collectionneurs de Lego de gérer leur collection, suivre l'état de leurs sets et gérer les pièces manquantes.

## Objectifs Principaux

1. Simplifier le suivi des collections Lego
2. Faciliter la gestion des pièces manquantes
3. Créer une communauté d'entraide
4. Proposer une expérience utilisateur fluide et intuitive

## Architecture Technique

### Frontend

- Next.js 15+ avec App Router
- TypeScript strict
- ShadcnUI + TailwindCSS
- PWA avec fonctionnalités offline
- Server Actions pour les mutations
- Server Components par défaut

### Backend & Data

- Supabase (PostgreSQL)
- Clerk (Authentification)
- API Rebrickable
- Row Level Security (RLS)
- Webhooks Clerk pour la synchronisation

### Intégrations

- API Rebrickable pour les données Lego
- Services de notification pour les alertes
- Potentielles intégrations e-commerce

## Modèle de Données

### Collections

```typescript
type LegoSet = {
  id: string;
  user_id: string;
  rebrickable_id: string;
  name: string;
  set_number: string;
  pieces_count: number;
  year: number;
  status: 'mounted' | 'dismounted' | 'incomplete';
  notes: string | null;
  last_modified: string;
  created_at: string;
  image_url: string | null;
  missing_pieces_count: number;
};

type MissingPiece = {
  id: string;
  set_id: string;
  part_number: string;
  color: string;
  quantity: number;
  status: 'searching' | 'found' | 'ordered';
  purchase_url: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  price: number | null;
};

type User = {
  id: string;
  clerk_id: string;
  email: string;
  subscription_tier: 'free' | 'premium';
  created_at: string;
  updated_at: string;
  display_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown>;
};
```

## Fonctionnalités Premium

- Ajout illimité de sets
- Alertes avancées pour les pièces
- Statistiques détaillées
- Notifications push
- Export de données

## Contraintes & Limites

- Version gratuite : max 5 sets
- Limitations API Rebrickable (1000 requêtes/jour)
- Stockage images : optimisation nécessaire
- Performance : pagination des grandes collections

## Sécurité & Authentification

- Authentification via Clerk
- Synchronisation utilisateurs avec Supabase via webhooks
- RLS pour la protection des données
- Validation des données avec Zod
- Client admin Supabase pour les opérations serveur

## Roadmap Technique

1. ✅ Configuration initiale

   - Next.js, TypeScript, TailwindCSS
   - Supabase, Clerk
   - Structure du projet

2. ✅ Authentification & Données

   - Intégration Clerk
   - Schémas Supabase
   - Synchronisation utilisateurs

3. 🚧 Gestion des Sets

   - Ajout de sets
   - Liste des sets
   - Détails des sets
   - Modification du statut

4. ⏳ Gestion des Pièces

   - Ajout de pièces manquantes
   - Suivi des commandes
   - Alertes de prix

5. ⏳ Fonctionnalités Premium
   - Système d'abonnement
   - Fonctionnalités avancées
   - Analytics
