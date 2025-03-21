# Calculateur de Prêt

Une application web pour calculer le montant total et les mensualités d'un emprunt à partir du taux, de la durée et du montant emprunté.

## Structure du Projet

```
calculateur-pret/
├── frontend/                # Application React
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Composant principal
│   │   ├── App.css          # Styles CSS
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                 # API Flask
│   ├── app.py               # Application principale
│   ├── requirements.txt     # Dépendances Python
│   └── ...
└── README.md                # Ce fichier
```

## Installation et Démarrage

### Backend (Python/Flask)

1. Créer un environnement virtuel:
   ```
   cd backend
   python -m venv venv
   ```

2. Activer l'environnement virtuel:
   - Sur Windows: `venv\Scripts\activate`
   - Sur macOS/Linux: `source venv/bin/activate`

3. Installer les dépendances:
   ```
   pip install -r requirements.txt
   ```

4. Lancer le serveur:
   ```
   python app.py
   ```
   Le serveur sera accessible à l'adresse `http://localhost:5000`.

### Frontend (React)

1. Installer les dépendances:
   ```
   cd frontend
   npm install
   ```

2. Lancer l'application:
   ```
   npm start
   ```
   L'application sera accessible à l'adresse `http://localhost:3000`.

## Utilisation

1. Entrez le montant du prêt souhaité
2. Spécifiez le taux d'intérêt annuel
3. Indiquez la durée du prêt en mois
4. Cliquez sur "Calculer" pour obtenir les résultats

## Formule utilisée

La formule de calcul des mensualités utilisée est celle de l'amortissement constant:

```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Où:
- M = Mensualité
- P = Principal (montant emprunté)
- r = Taux d'intérêt mensuel (taux annuel / 12 / 100)
- n = Nombre de mensualités (durée en mois)