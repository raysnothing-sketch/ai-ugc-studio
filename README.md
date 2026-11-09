# AI UGC Studio — Personal Edition (v1.0)

Application web privée et plateforme intégrée de production marketing assistée par IA conçue pour un directeur créatif & créateur vidéo indépendant (**Rayan**).

![AI UGC Studio](/banner.jpg)

---

## 🌟 Modules Métier Intégrés

1. **Dashboard Overview** :
   - Indicateurs d'activité en temps réel : clients actifs, projets en cours, campagnes créées et revenus mensuels.
   - Bandeau panoramique **Product-to-Ad** avec direction artistique or métallisé et noir obsidienne.
   - Widgets Projets récents, Tâches prioritaires interactives et Journal d'activités.

2. **Marketing Intelligence** :
   - Entrées multi-sources : *URL produit*, *Description*, *Image*, *Document*.
   - Analyseur dynamique et dossier marketing structuré complet : caractéristiques, angles commerciaux, segmentation d'audience et analyse concurrentielle.

3. **Client & Project Manager** :
   - Fiches clients complètes avec contacts, historique de facturation et notes confidentielles.
   - Gestionnaire de projets Kanban / Liste avec livrables contractuels, budgets et suivi d'avancement synchronisé avec l'API.

4. **AI UGC Studio (Cœur de Production)** :
   - Stepper interactif en 4 étapes : `Script` → `Acteur` → `Personnalisation` → `Aperçu`.
   - 6 formats de vidéo UGC : *Product Review*, *Testimonial*, *Unboxing*, *Démonstration*, *Storytelling*, *Lifestyle*.
   - Éditeur de scripts avec compteur de caractères et variantes IA.
   - Player Remotion 9:16 avec sous-titres incrustés et prévisualisation vidéo.

5. **Cinematic Video Studio** :
   - Stepper 4 étapes : `Concept` → `Préproduction` → `Génération` → `Montage`.
   - Storyboard dynamique avec plans caméra, éclairage et prompts IA cinématiques.

6. **Creative Studio & Brand Kit** :
   - Générateur de visuels publicitaires IA aux formats 1:1 Carré, 9:16 Vertical et 16:9 Bannière.
   - Module Brand Kit complet : palette officielle or & obsidienne, typographies et ton de marque.

7. **Social Media Manager** :
   - Calendrier éditorial et pipeline de publication (TikTok, Instagram, LinkedIn).
   - Générateur de légendes et hashtags optimisés.

8. **Freelance Business Manager (Gestion Commerciale)** :
   - Devis, Factures, Paiements et Prestations conformes aux normes européennes.
   - Graphique de suivi du chiffre d'affaires.

9. **Portfolio & Livraison Client** :
   - Galerie de réalisations haute définition.
   - Liens de partage sécurisés et packs de livraison clients.

10. **Workflow Product-to-Ad (Moteur Orchestré)** :
    - Assistant pas à pas orchestrant le pipeline publicitaire complet : extraction produit, génération de scripts ciblés, synthèse vocale neuronale (ElevenLabs/OpenAI), génération vidéo (HeyGen) et packaging automatique dans le studio.

---

## 🛠️ Stack Technique

- **Frontend & Serveur :** Next.js 15.5.29 (App Router), React 18.3.1, TypeScript 5.6
- **Validation :** Zod 4
- **Sécurité :** Sessions cryptographiques HMAC-SHA256, protection anti-force brute (rate limiting IP), validation Magic Bytes sur uploads
- **Style & Design System :** Tailwind CSS, Thème Noir Obsidienne (`#07080a`) et Or Métallisé (`#d4af37`, `#e5b869`)
- **Base de données :** LibSQL / Turso avec ORM Drizzle et persistance résiliente
- **Stockage Médias :** Cloudflare R2 (API S3 compatible)
- **Moteur Vidéo :** Remotion Player & Compositions React 9:16
- **Fournisseurs IA :** HeyGen v2, ElevenLabs, OpenAI TTS, Runway, MuseTalk avec bouclier anti-débit persistant

---

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Lancer en développement
npm run dev

# Compiler pour la production
npm run build

# Démarrer en production
npm start
```
