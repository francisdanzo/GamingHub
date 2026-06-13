# GamingHub

Portail arcade en ligne — 10 jeux classiques jouables directement dans le navigateur, sans installation.

**Démo live :** [francisdanzo.github.io/GamingHub](https://francisdanzo.github.io/GamingHub)

---

## Jeux disponibles

| Jeu | Contrôles |
|-----|-----------|
| Snake | WASD |
| Tetris | ← → ↓ / Espace |
| Pong | W / S |
| Space Invaders | ← → / Espace |
| Breakout | ← → |
| Démineur | Clic gauche / Clic droit |
| + 4 autres | Indiqués en jeu |

---

## Stack

- HTML5 Canvas — logique et rendu des jeux
- CSS3 — design system retro-futuriste (variables, grid, animations)
- JavaScript vanilla — aucune dépendance externe

---

## Lancer en local

```bash
git clone https://github.com/francisdanzo/GamingHub.git
cd GamingHub
npx http-server . -p 8080
# → http://localhost:8080
```

Ou simplement ouvrir `index.html` dans le navigateur.

---

## Structure

```
GamingHub/
├── index.html      # Accueil
├── jeux.html       # Catalogue des jeux
├── contact.html    # Formulaire de contact
├── style.css       # Design system global
└── script.js       # Logique des jeux
```

---

## Déploiement

Le projet est un site statique — compatible GitHub Pages, Netlify et Vercel.

```bash
# GitHub Pages : pousser sur main, activer Pages depuis les Settings du dépôt
```

---

## Contribuer

1. Fork le dépôt
2. Crée une branche : `feature/nom-du-jeu` ou `fix/description`
3. Ouvre une Pull Request

---

## Auteur

**francisdanzo** — [github.com/francisdanzo](https://github.com/francisdanzo)
