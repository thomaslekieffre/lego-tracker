# Lego Tracker - Contexte UI

## Principes Généraux

### Design System

- Utilisation de ShadcnUI comme base
- Palette de couleurs Lego-inspired
- Design responsive et accessible
- Support du mode sombre
- Composants réutilisables

### Composants Principaux

#### Layout

```typescript
type LayoutProps = {
  header: boolean; // Affichage du header
  sidebar?: boolean; // Sidebar optionnelle
  footer?: boolean; // Footer optionnel
  children: React.ReactNode;
};
```

#### Cards

```typescript
type LegoSetCardProps = {
  id: string;
  name: string;
  setNumber: string;
  piecesCount: number;
  imageUrl?: string | null;
  status: 'mounted' | 'dismounted' | 'incomplete';
  missingPiecesCount: number;
};
```

#### Modals

```typescript
type SearchSetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (set: RebrickableSet) => Promise<void>;
};
```

#### Forms

```typescript
type LegoSetFormData = {
  status: 'mounted' | 'dismounted' | 'incomplete';
  notes?: string;
};
```

#### Navigation

- Sidebar responsive
- Navbar avec recherche
- Breadcrumbs pour la navigation

### États UI

```typescript
type UIState = {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  searchOpen: boolean;
  currentView: 'grid' | 'list';
  filters: Filter[];
  isLoading: boolean;
  toast?: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  };
};

type Filter = {
  type: 'status' | 'year' | 'theme';
  value: string;
};
```

## Responsive Breakpoints

- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)
- Large Desktop: > 1280px (xl)

## Animations

- Transitions fluides avec Framer Motion
- Feedback visuel immédiat
- Loading states élégants
- Animations de cartes et modales

## Accessibilité

- Support WCAG 2.1
- Navigation au clavier
- Support lecteur d'écran
- Contraste suffisant
- Messages d'erreur explicites
- Formulaires accessibles

## Performance

- Images optimisées avec Next/Image
- Lazy loading des composants
- Code splitting automatique
- Prefetching stratégique
- Optimisation des requêtes API
- Mise en cache appropriée

## Gestion des Erreurs

- Messages d'erreur contextuels
- Fallbacks pour les images
- États de chargement
- Gestion des erreurs réseau
- Validation des formulaires

## Composants Partagés

### UI de Base

- Button
- Card
- Dialog
- Form
- Input
- Label
- Textarea
- Toast
- Toaster

### Composants Métier

- LegoSetCard
- LegoSetForm
- SearchSetModal
- MissingPieceCard (à venir)
- StatisticsCard (à venir)

## Patterns d'Interaction

- Recherche avec debounce
- Validation en temps réel
- Feedback immédiat
- Confirmation des actions importantes
- Navigation intuitive
