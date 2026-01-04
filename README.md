# Projet API RESTful — Collection de jeux vidéo

API d'exemple implémentant une architecture MVC avec Sequelize (SQLite).

Installation

```bash
npm install
```

Lancer en développement (avec `nodemon` si installé) :

```bash
npm run dev
```

Ou lancer normalement :

```bash
npm start
```

Endpoints principaux

- `GET /api/v1/games` : lister les jeux (query params : `page`, `limit`, `title`, `platform`, `genre`)
- `POST /api/v1/games` : créer un jeu (body JSON — `title` requis)
- `GET /api/v1/games/:id` : obtenir un jeu
- `PATCH /api/v1/games/:id` : modifier un jeu (mise à jour partielle)
- `DELETE /api/v1/games/:id` : supprimer un jeu

Fonctionnalités avancées

- **API Versioning** : Tous les endpoints utilisent le préfixe `/api/v1/`
- **Content Negotiation** : Support JSON (défaut), XML, YAML via header `Accept`
- **HATEOAS** : Liens hypermedia dans toutes les réponses JSON
- **Internationalisation** : Support français/anglais via paramètre `lang`
- **Pagination** : Contrôle via `page` et `limit`
- **Filtrage** : Par titre, plateforme, genre, développeur, rating
- **Tri** : Via paramètre `sort` (ex: `sort=rating:desc`)

Sécurité / clé API

Les routes qui modifient les données (`POST`, `PUT`, `DELETE`) requièrent une clé API dans le header `x-api-key` ou via le paramètre `api_key` en query string.

Par défaut, une clé de développement est fournie: `dev-secret-key`. Pour la changer, exportez la variable d'environnement `API_KEY` avant de lancer le serveur :

```bash
export API_KEY="ma-cle-secrete"
npm start
```

### Tests HTTP

Des fichiers de requêtes HTTP (`.http`) sont fournis pour tester facilement tous les endpoints de l'API :

- `api-tests.http` : Tests complets de tous les endpoints avec exemples de content negotiation, HATEOAS, versioning et i18n

#### Comment utiliser les fichiers .http

1. **Extension recommandée** : Installez l'extension VS Code "REST Client" de Huachao Mao
2. **Ouverture** : Ouvrez le fichier `api-tests.http` dans VS Code
3. **Exécution** : Cliquez sur "Send Request" au-dessus de chaque requête pour l'exécuter
4. **Résultats** : Les réponses s'affichent dans un panneau séparé

#### Fonctionnalités testées

- ✅ **Tous les endpoints CRUD** : GET, POST, PATCH, DELETE
- ✅ **Content Negotiation** : JSON, XML, YAML
- ✅ **HATEOAS** : Liens hypermedia dans les réponses
- ✅ **API Versioning** : Préfixe `/api/v1/`
- ✅ **i18n** : Paramètre `lang` pour changer la langue
- ✅ **Pagination et filtrage** : `page`, `limit`, `title`, `platform`, etc.
- ✅ **Gestion d'erreurs** : Codes HTTP appropriés (200, 201, 204, 400, 401, 404, 500)
- ✅ **Authentification** : Header `x-api-key`
- ✅ **Validation** : Messages d'erreur pour données invalides

#### Tests automatisés

Un script de test automatisé est fourni pour valider le bon fonctionnement de l'API :

```bash
npm test
```

Ce script teste automatiquement :
- Tous les endpoints CRUD
- Les codes HTTP appropriés
- La validation des données
- L'authentification API
- Le content negotiation
- Les erreurs 404 et 401

#### Fichiers de test

- `api-tests.http` : Tests manuels complets avec REST Client
- `api-tests-advanced.http` : Tests spécialisés et scénarios complexes
- `test-api.js` : Script de test automatisé

#### Exécution des tests manuels

1. Ouvrez `api-tests.http` dans VS Code
2. Cliquez sur "Send Request" pour chaque requête
3. Vérifiez les réponses dans le panneau de résultats

#### Exécution des tests automatisés

```bash
# Assurez-vous que le serveur tourne
npm start

# Dans un autre terminal
npm test
```

Structure du projet

- `models/` : définition Sequelize
- `controllers/` : logique métier
- `routes/` : définition des routes
- `middlewares/` : middlewares personnalisés

Notes

- La base de données utilisée est un fichier SQLite `database.sqlite` créé automatiquement.
- Vous pouvez enrichir la validation, ajouter une authentification, tests, et migrations Sequelize selon vos besoins.
