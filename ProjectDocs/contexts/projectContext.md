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

### Backend & Data

- Supabase (PostgreSQL)
- Clerk (Authentification)
- API Rebrickable
- Row Level Security (RLS)

### Intégrations

- API Rebrickable pour les données Lego
- Services de notification pour les alertes
- Potentielles intégrations e-commerce

## Modèle de Données

### Collections

```typescript
type LegoSet = {
  id: string;
  rebrickableId: string;
  name: string;
  setNumber: string;
  pieces: number;
  year: number;
  status: "mounted" | "dismounted" | "incomplete";
  userId: string;
  missingPieces?: MissingPiece[];
};

type MissingPiece = {
  id: string;
  partNumber: string;
  color: string;
  quantity: number;
  setId: string;
  watchlist: boolean;
};

type User = {
  id: string;
  email: string;
  isPremium: boolean;
  collections: LegoSet[];
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
- Limitations API Rebrickable
- Stockage images : optimisation nécessaire
- Performance : pagination des grandes collections
