# Guide de Contribution

Merci de votre intérêt pour contribuer à Lego Tracker ! Voici quelques directives pour vous aider à démarrer.

## Process de Développement

1. Fork le repository
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Conventions de Code

- TypeScript strict
- Approche fonctionnelle (pas de classes)
- Fichiers limités à 150 lignes
- Nommage explicite des variables
- Tests pour les nouvelles fonctionnalités

## Structure des Commits

Format : `type(scope): description`

Types :

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

## Tests

- Écrire des tests pour les nouvelles fonctionnalités
- Maintenir une couverture de code élevée
- Exécuter `pnpm test` avant de soumettre une PR

## Style de Code

- Utiliser Prettier pour le formatage
- Suivre les règles ESLint
- Documenter les fonctions complexes

## Review Process

1. Vérification automatique CI
2. Review par un mainteneur
3. Modifications si nécessaire
4. Merge dans dev

## Questions ?

N'hésitez pas à ouvrir une issue pour toute question !
