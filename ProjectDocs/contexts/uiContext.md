# Lego Tracker - Contexte UI

## Principes Généraux

### Design System

- Utilisation de ShadcnUI comme base
- Palette de couleurs Lego-inspired
- Design responsive et accessible
- Support du mode sombre

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

- `SetCard` : Affichage d'un set Lego
- `StatCard` : Statistiques de collection
- `MissingPieceCard` : Pièce manquante

#### Navigation

- Sidebar responsive
- Navbar avec recherche
- Breadcrumbs pour la navigation

### États UI

```typescript
type UIState = {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  searchOpen: boolean;
  currentView: "grid" | "list";
  filters: Filter[];
};

type Filter = {
  type: "status" | "year" | "theme";
  value: string;
};
```

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Animations

- Transitions fluides
- Feedback visuel immédiat
- Loading states élégants

## Accessibilité

- Support WCAG 2.1
- Navigation au clavier
- Support lecteur d'écran
- Contraste suffisant

## Performance

- Images optimisées
- Lazy loading
- Code splitting
- Prefetching stratégique
