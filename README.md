# AI UGC Studio — Personal Edition (v1.0)

Application web privée de production marketing assistée par IA conçue pour une directrice créative / consultante marketing digital indépendante (**Sarah Müller**).

![AI UGC Studio Screenshot](file:///C:/Users/raysn/.gemini/antigravity/brain/7d3b33d0-b9ff-4bda-801f-3b5e983c83e9/.user_uploaded/media_1794150312240_4867accd.jpg)

---

## 🌟 Modules Implémentés

1. **Dashboard (Overview)** :
   - Indicateurs d'activité en temps réel : 12 clients actifs (+12%), 8 projets en cours (+8%), 24 campagnes créées (+20%), €12.4k revenus ce mois (+18%).
   - Bannière mise en avant **Product-to-Ad** avec visuel luxe & halo doré.
   - Widgets Projets récents (Summer Collection 75%), Tâches prioritaires (avec statut interactif), et Activités récentes.

2. **Marketing Intelligence** :
   - Onglets d'entrée : `URL de produit`, `Description`, `Image`, `Document`.
   - Analyseur dynamique (ex: Nike Pegasus 41 avec mousse ReactX et amorti Air Zoom).
   - Dossier marketing structuré complet : caractéristiques, arguments commerciaux, segmentation d'audience (25-45 ans), stratégie de formats courts UGC et analyse concurrentielle.

3. **Client & Project Manager** :
   - Fiches clients complètes (Nike DACH, Maison Éclat Paris, Lumina Tech, etc.) avec contacts, historique facturé et notes internes.
   - Gestionnaire de projets Kanban / Liste avec livrables contractuels, budgets et suivi d'avancement.

4. **AI UGC Studio (Cœur de Production)** :
   - Stepper interactif en 4 étapes : `Script` → `Acteur` → `Personnalisation` → `Aperçu`.
   - 6 formats de vidéo UGC : *Product Review*, *Testimonial*, *Unboxing*, *Démonstration*, *Storytelling*, *Lifestyle*.
   - Éditeur de scripts avec compteur de caractères et variantes IA.
   - Sélecteur d'acteurs virtuels (Emma Fitness, Sophie Beauté, Lukas Tech, Chloé Mode).
   - Mockup smartphone 9:16 vertical avec sous-titres incrustés ("Allez plus loin..."), contrôles vidéo et simulateur de rendu avec maîtrise du coût (1.45 €).

5. **Cinematic Video Studio** :
   - Stepper 4 étapes : `Concept` → `Préproduction` → `Génération` → `Montage`.
   - Storyboard dynamique à 4 plans : *1. Introduction (Plan large 3s)*, *2. Produit (Gros plan 5s)*, *3. Bénéfices (Plan moyen 5s)*, *4. CTA (Plan final 3s)*.
   - Fiches de découpage avec mouvements caméra, éclairage et prompts IA.

6. **Creative Studio & Brand Kit** :
   - Générateur de visuels publicitaires IA aux formats 1:1 Carré, 9:16 Vertical et 16:9 Bannière.
   - Module Brand Kit complet : palette de couleurs officielles, typographies, ton de marque et slogans autorisés.

7. **Social Media Manager** :
   - Calendrier éditorial et pipeline de publication (TikTok, Instagram, LinkedIn).
   - Générateur de légendes et hashtags optimisés avec adaptation du ton.

8. **Freelance Business Manager (Gestion Commerciale)** :
   - Onglets *Devis*, *Factures*, *Paiements*, *Prestations*.
   - Graphique courbe dorée du chiffre d'affaires mensuel (€12,450 / +18%).
   - Liste des documents commerciaux récents et échéancier.
   - Mentions de conformité GoBD et fiscalité européenne (UStG / TVA).

9. **Portfolio & Livraison Client** :
   - Galerie publique de réalisations (flacons cosmétiques haut de gamme, sneakers Nike, lifestyle urbain).
   - Liens de partage sécurisés avec personnalisation et statut actif.
   - Packs de livraison avec protection par mot de passe et suivi des téléchargements.

10. **Workflow Product-to-Ad (Section 13 du Cahier des Charges)** :
    - Assistant pas à pas orchestrant les 14 étapes du workflow : de la saisie de l'URL jusqu'à l'export de la vidéo MP4 avec contrôle budgétaire préalable.

---

## 🛠️ Stack Technique

- **Frontend & Serveur :** Next.js 14 (App Router), React 18, TypeScript
- **Style & Design System :** Tailwind CSS, Thème Sombre Luxe (Noir Obsidian `#0c0d0f`, Accents Or `#d4af37`, Typographie Ivoire)
- **Icônes :** Lucide React
- **Base de données :** Abstraction Turso (LibSQL SQLite) & persistance réactive
- **Stockage Médias :** Abstraction Cloudflare R2
- **Montage :** Pipeline vidéo FFmpeg (MP4 H.264 / 9:16)
- **Fournisseurs IA :** Couche d'abstraction compatible HeyGen, ElevenLabs, Runway, Luma, OpenAI

---

## 🚀 Démarrage

```bash
# Se placer dans le répertoire du projet
cd "C:\Users\raysn\.gemini\antigravity\scratch\ai-ugc-studio"

# Lancer le serveur de développement
npm run dev

# Ouvrir dans votre navigateur
http://localhost:3000
```
