# Contexte UI LEGO Tracker

## Principes Généraux

### Design System

- Utilisation de ShadCN UI comme base
- Personnalisation via TailwindCSS
- Composants atomiques réutilisables
- Thème clair/sombre

### Responsive Design

- Approche Mobile First
- Breakpoints :
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### Grille

- Mode normal :

  - Mobile : 1 colonne
  - Tablet : 2 colonnes
  - Desktop : 3 colonnes
  - Large : 4 colonnes

- Mode compact :
  - Mobile : 2 colonnes
  - Tablet : 3 colonnes
  - Desktop : 4 colonnes
  - Large : 5 colonnes

## Composants

### Cards

- Aspect ratio 4:3 en mode normal
- Aspect ratio 1:1 en mode compact
- Image de couverture optimisée
- Informations essentielles visibles
- Actions contextuelles

### Modals

- Centrage vertical et horizontal
- Fermeture par overlay
- Animations fluides
- Responsive sur mobile

### Boutons

- États visuels clairs
- Feedback immédiat
- Icons pour clarifier l'action
- Taille adaptative

## Animations

### Principes

- Subtiles et fonctionnelles
- Désactivables pour l'accessibilité
- Performance optimisée
- Cohérence globale

### Types

- Transitions de page
- Hover effects
- Loading states
- Feedback utilisateur

## États

### Loading

- Skeletons animés
- Indicateurs de progression
- Fallbacks élégants
- Transitions fluides

### Erreurs

- Messages clairs
- Actions de correction
- Style distinctif
- Feedback constructif

### Succès

- Confirmations visuelles
- Animations subtiles
- Durée appropriée
- Actions suivantes claires

## Accessibilité

### Standards

- WCAG 2.1 AA
- Contraste suffisant
- Navigation au clavier
- Support lecteur d'écran

### Adaptations

- Taille de texte ajustable
- Animations réduites
- Alt text pour images
- ARIA labels

## Performance

### Optimisations

- Images optimisées
- Code splitting
- Lazy loading
- Prefetching

### Métriques

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.8s

## Thèmes

### Clair

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 222.2 84% 4.9%;
```

### Sombre

```css
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;
--popover: 222.2 84% 4.9%;
--popover-foreground: 210 40% 98%;
--primary: 210 40% 98%;
--primary-foreground: 222.2 47.4% 11.2%;
--secondary: 217.2 32.6% 17.5%;
--secondary-foreground: 210 40% 98%;
--muted: 217.2 32.6% 17.5%;
--muted-foreground: 215 20.2% 65.1%;
--accent: 217.2 32.6% 17.5%;
--accent-foreground: 210 40% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 210 40% 98%;
--border: 217.2 32.6% 17.5%;
--input: 217.2 32.6% 17.5%;
--ring: 212.7 26.8% 83.9%;
```
