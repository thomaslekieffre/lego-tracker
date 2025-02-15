# Schémas de Validation

Ce dossier contient les schémas de validation Zod pour notre base de données Supabase.

## Types Principaux

### Énumérations

#### `LegoSetStatusSchema`

- `mounted` : Set monté et complet
- `dismounted` : Set démonté mais complet
- `incomplete` : Set incomplet (pièces manquantes)

#### `SubscriptionTierSchema`

- `free` : Compte gratuit (limité à 5 sets)
- `premium` : Compte premium (sets illimités)

#### `PieceStatusSchema`

- `searching` : En recherche de la pièce
- `found` : Pièce trouvée mais pas encore commandée
- `ordered` : Pièce commandée

### Schémas de Base

#### `UserSchema`

Représente un utilisateur dans le système.

```typescript
{
  id: string (UUID)
  email: string (email valide, min 3 caractères)
  subscription_tier: SubscriptionTier
  created_at: string (ISO datetime)
  updated_at: string (ISO datetime)
  display_name: string | null (2-50 caractères)
  avatar_url: string | null (URL valide)
  preferences: Record<string, unknown>
}
```

#### `LegoSetSchema`

Représente un set LEGO dans la collection d'un utilisateur.

```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  rebrickable_id: string (non vide)
  name: string (1-255 caractères)
  set_number: string (non vide)
  pieces_count: number (entier >= 0)
  year: number (1930-année courante+1)
  status: LegoSetStatus
  notes: string | null (max 1000 caractères)
  last_modified: string (ISO datetime)
  created_at: string (ISO datetime)
  image_url: string | null (URL valide)
  missing_pieces_count: number (entier >= 0)
}
```

#### `MissingPieceSchema`

Représente une pièce manquante d'un set.

```typescript
{
  id: string (UUID)
  set_id: string (UUID)
  part_number: string (non vide)
  color: string (non vide)
  quantity: number (entier > 0)
  status: PieceStatus
  purchase_url: string | null (URL valide)
  created_at: string (ISO datetime)
  updated_at: string (ISO datetime)
  notes: string | null (max 500 caractères)
  price: number | null (>= 0)
}
```

### Schémas d'Insertion

Les schémas d'insertion (`UserInsertSchema`, `LegoSetInsertSchema`, `MissingPieceInsertSchema`) omettent les champs auto-générés :

- Timestamps (`created_at`, `updated_at`, `last_modified`)
- Compteurs calculés (`missing_pieces_count`)

### Schémas de Mise à Jour

Les schémas de mise à jour (`UserUpdateSchema`, `LegoSetUpdateSchema`, `MissingPieceUpdateSchema`) :

- Rendent tous les champs optionnels sauf `id`
- Conservent les mêmes validations que les schémas de base
- Permettent les mises à jour partielles

### Statistiques

#### `UserStatisticsSchema`

Vue en lecture seule des statistiques utilisateur.

```typescript
{
  user_id: string(UUID);
  total_sets: number(entier >= 0);
  mounted_sets: number(entier >= 0);
  dismounted_sets: number(entier >= 0);
  incomplete_sets: number(entier >= 0);
  total_missing_pieces: number(entier >= 0);
}
```

## Utilisation

```typescript
import { LegoSetSchema, LegoSetInsertSchema, LegoSetUpdateSchema } from './database';

// Validation d'un set complet
const validSet = LegoSetSchema.parse(data);

// Validation pour insertion
const newSet = LegoSetInsertSchema.parse(data);

// Validation pour mise à jour
const update = LegoSetUpdateSchema.parse(data);
```
