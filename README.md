# random-numetal-band

Ce projet est une application full-stack dédiée à la découverte de groupes de nu-metal. Elle permet de générer des suggestions aléatoires basées sur des critères précis comme le pays d'origine, l'année de formation ou la disponibilité sur les plateformes de streaming.

![Vue.js](https://img.shields.io/badge/vuejs-%2335495E.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg?style=for-the-badge)
![Genre](https://img.shields.io/badge/Genre-Nu--Metal-red?style=for-the-badge)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)
## Technologies utilisées

* **Frontend** : Vue.js 3 avec Vite.
* **Backend** : Node.js et Express.
* **Base de données** : MySQL / MariaDB.
* **Conteneurisation** : Docker et Docker Compose.

## Prérequis

L'installation de Docker Desktop est requise pour faire fonctionner l'environnement de développement.

## Configuration du projet

> [!TIP]
> La sécurité de la base de données repose sur l'utilisation de variables d'environnement. Ne partagez jamais votre fichier .env publiquement.

1. Créez un fichier nommé `.env` à la racine du répertoire principal.
2. Définissez votre mot de passe de base de données comme suit :
   `DB_PASSWORD=votre_mot_de_passe`

## Installation et exécution

Pour construire les images et lancer les services, utilisez la commande suivante :
```bash
docker compose up --build
```
> [!NOTE]
> Une fois les conteneurs démarrés, le frontend, le backend et la base de données communiquent automatiquement via le réseau interne de Docker.

## Administration de la base de données

### Accès direct via le terminal
Pour inspecter manuellement les données ou vérifier la structure des tables :
```bash
docker exec -it numetalrandom-db-1 mysql -u root -p
```
> [!TIP]
> Après avoir entré votre mot de passe, vous pouvez exécuter des requêtes SQL classiques comme `SELECT * FROM nu_metal_list;` pour voir le contenu de la base.

### Arrêt des services
Pour stopper proprement l'application et libérer les ressources :
```bash
docker compose down
```
## Licence et conditions d'utilisation

Ce projet est mis à disposition sous licence Creative Commons Attribution - Pas d’Utilisation Commerciale 4.0 International (CC BY-NC 4.0).

> [!IMPORTANT]
> En cas de réutilisation ou de modification du code, vous devez obligatoirement citer l'auteur original. Toute exploitation commerciale de ce projet est strictement interdite.
