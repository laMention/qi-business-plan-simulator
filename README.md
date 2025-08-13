# QI Business Plan Simulator

Un plugin WordPress pour simuler et évaluer la santé financière d'un business plan sur 3 périodes avec génération de rapports PDF.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [Métriques d'évaluation](#métriques-dévaluation)
- [Système de scoring](#système-de-scoring)
- [Captures d'écran](#captures-décran)
- [Développement](#développement)
- [Contribution](#contribution)
- [Licence](#licence)

## 📊 Aperçu

Le **QI Business Plan Simulator** est un plugin WordPress qui permet aux entrepreneurs et conseillers financiers de simuler et d'évaluer la viabilité financière d'un projet d'entreprise sur 3 périodes. Le plugin génère automatiquement une matrice d'évaluation avec un système de scoring sur 100 points.

### Auteur
**Dagou Patrick Elysée Botchi**  
[LinkedIn](https://www.linkedin.com/in/dagou-patrick-elys%C3%A9e-botchi-48a94b96/)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- **Simulation financière** sur 3 périodes personnalisables
- **4 régimes fiscaux** pris en charge (TEE, RME, RSI, RNI)
- **Calcul automatique** du service de la dette avec intérêts
- **Matrice d'évaluation** avec 5 métriques financières clés
- **Système de scoring** sur 100 points
- **Génération de rapports PDF** téléchargeables
- **Fonction d'impression** intégrée
- **Interface responsive** adaptée mobile/tablette/desktop

### 📈 Métriques calculées
1. **Marge nette de flux de trésorerie** (% des revenus)
2. **Ratio de couverture du service de la dette**
3. **Ratio de levier des flux** (Dette / Flux d'exploitation)
4. **Ratio dépenses totales / revenus**
5. **Croissance de la dette** (évolution sur la période)

### 💾 Export et impression
- **Impression directe** via le navigateur
- **Export PDF** avec mise en page optimisée
- **Sauvegarde des calculs** pendant la session

## 🚀 Installation

### Prérequis
- WordPress 5.0 ou supérieur
- PHP 7.4 ou supérieur
- Navigateur web moderne avec support JavaScript

### Installation manuelle

1. **Téléchargez** les fichiers du plugin
2. **Uploadez** le dossier dans `/wp-content/plugins/`
3. **Activez** le plugin depuis l'admin WordPress
4. **Utilisez** le shortcode `[qi_simulator]` dans vos pages/articles

### Structure des fichiers
```
qi-simulator-business-plan/
├── qi-simulator-business-plan.php  # Fichier principal
├── script.js                       # Logique JavaScript
├── style.css                       # Styles CSS
└── README.md                       # Documentation
```

## 📝 Utilisation

### Shortcode
Utilisez simplement le shortcode suivant dans n'importe quelle page ou article :

```php
[qi_simulator]
```

### Interface utilisateur

#### 1. Données générales
- **Coût total du projet** : Investissement initial total
- **Apport propre** : Capital propre investi
- **Dette** : Calculée automatiquement (Coût - Apport)
- **Années de remboursement** : Durée du crédit
- **Taux d'intérêt** : Taux annuel sur la dette
- **Régime fiscal** : Choix parmi TEE, RME, RSI, RNI

#### 2. Données par période (P1, P2, P3)
- **Chiffre d'affaires** (revenus)
- **Dépenses générales** (charges d'exploitation)
- **Dépenses d'équipement** (investissements)
- **Dividendes** versés
- **Autres dépenses** (dépréciation, etc.)

#### 3. Type d'évaluation
- **Santé actuelle** : Évaluation basée sur les données saisies
- **Santé future** : Projection des tendances

## ⚙️ Configuration

### Régimes fiscaux supportés

| Régime | Description | Taux d'imposition |
|--------|-------------|-------------------|
| **TEE** | Taxe d'État de l'entreprenant | 5% |
| **RME** | Impôt micro-entreprise | 6% |
| **RSI** | Régime réel simplifié | 25% |
| **RNI** | Régime réel normal | 25% |

### Personnalisation
Le plugin utilise des variables CSS pour faciliter la personnalisation :

```css
:root {
  --bg: #f6f8fb;           /* Arrière-plan */
  --card: #ffffff;         /* Cartes */
  --accent: #2563eb;       /* Couleur principale */
  --muted: #6b7280;        /* Texte secondaire */
  --border: #e6e9ef;       /* Bordures */
}
```

## 📊 Métriques d'évaluation

### 1. Marge nette de flux de trésorerie
**Formule** : `(Flux de trésorerie d'exploitation / Revenus) × 100`

| Performance | Seuil | Points |
|-------------|-------|--------|
| Excellent | ≥ 80% | 20 |
| Très bon | ≥ 70% | 17 |
| Bon | ≥ 50% | 12 |
| Tolérable | ≥ 0% | 8 |
| Faible | < 0% | 4 |

### 2. Ratio de couverture du service de la dette
**Formule** : `Flux d'exploitation / (Principal + Intérêts)`

| Performance | Seuil | Points |
|-------------|-------|--------|
| Sain | ≥ 1.25 | 20 |
| Faible | < 1.25 | 8 |

### 3. Ratio de levier des flux
**Formule** : `Dette totale / Flux d'exploitation`

| Performance | Seuil | Points |
|-------------|-------|--------|
| Très bon | ≤ 2 | 20 |
| Bon | ≤ 5 | 16 |
| Limite | ≤ 10 | 12 |
| Endettement élevé | > 10 | 8 |

### 4. Ratio dépenses totales / revenus
**Formule** : `(Dépenses générales + Capex) / Revenus × 100`

| Performance | Seuil | Points |
|-------------|-------|--------|
| Sain | ≤ 40% | 20 |
| Acceptable | ≤ 60% | 16 |
| Préoccupant | ≤ 80% | 12 |
| Besoin financement | > 80% | 8 |

### 5. Croissance de la dette
**Formule** : `(Dette finale - Dette initiale) / Dette initiale × 100`

| Performance | Seuil | Points |
|-------------|-------|--------|
| Excellente réduction | ≤ -50% | 20 |
| Réduction significative | -50% à -20% | 16 |
| Réduction modérée | -20% à 0% | 12 |
| Stabilité | 0% | 10 |
| Augmentation | > 0% | 4 |

## 🎯 Système de scoring

### Score total QI (sur 100)
Le score final est la somme des points obtenus sur les 5 métriques :
- **Score maximum** : 100 points
- **Score minimum** : 20 points

### Interprétation générale
L'interprétation se base sur la marge nette moyenne :

| Marge nette moyenne | Interprétation |
|---------------------|----------------|
| ≥ 80% | Excellent |
| 70% - 79% | Très bon |
| 50% - 69% | Bon |
| < 50% | Tolérable |

## 🛠️ Développement

### Technologies utilisées
- **PHP** : Backend WordPress
- **JavaScript** (Vanilla) : Calculs et interactions
- **CSS3** : Styles responsives
- **jsPDF** : Génération PDF côté client
- **html2canvas** : Capture d'écran pour PDF

### Architecture du code

#### Fichier principal (PHP)
```php
// Enregistrement des assets
function qi_simulator_enqueue_assets()

// Génération du shortcode
function qi_simulator_shortcode()
```

#### Logique JavaScript
```javascript
// Calculs financiers
function compute()

// Système de scoring
const SCORING = { netMargin: [...], coverage: [...], ... }

// Export PDF
async function downloadPDF()
```

### Hooks WordPress utilisés
- `wp_enqueue_scripts` : Chargement des assets
- `add_shortcode` : Enregistrement du shortcode

### Dépendances externes
- **jsPDF 2.5.1** : https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- **html2canvas 1.4.1** : https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js

## 🔧 API et fonctions principales

### Fonctions JavaScript disponibles
```javascript
// Calcul automatique de la dette
calculateDebt()

// Configuration du taux fiscal
setTaxRate()

// Calcul principal
compute()

// Export et impression
printReport()
downloadPDF()
```

### Variables de configuration
```javascript
// Taux d'imposition par régime
const TAX_RATES = {
  TEE: 0.05,
  RME: 0.06, 
  RSI: 0.25,
  RNI: 0.25
}

// Configuration du scoring
const SCORING = {
  netMargin: [...],
  coverage: [...],
  leverage: [...],
  expensesRatio: [...],
  debtGrowth: [...]
}
```

## 📱 Responsive Design

Le plugin est entièrement responsive avec des breakpoints optimisés :

- **Mobile** : < 480px
- **Tablet** : 768px - 1023px  
- **Desktop** : ≥ 1024px
- **Large Desktop** : ≥ 1400px

### Fonctionnalités responsive
- Grilles flexibles avec CSS Grid
- Tailles de police adaptatives avec `clamp()`
- Tableaux avec défilement horizontal
- Boutons et contrôles optimisés tactile

## 🎨 Personnalisation avancée

### Modification des seuils de scoring
Editez les constantes dans `script.js` :

```javascript
const SCORING = {
  netMargin: [
    {label:'Excellent', min:0.8, pts:20},
    {label:'Très bon', min:0.7, pts:17},
    // Personnalisez ici...
  ]
}
```

### Styles CSS personnalisés
Surchargez les variables CSS dans votre thème :

```css
.qi-simulator {
  --accent: #your-brand-color;
  --card: #your-card-color;
}
```

## 🚨 Limitations connues

- **Pas de sauvegarde** : Les données ne sont pas persistées en base
- **3 périodes maximum** : Structure fixe P1, P2, P3
- **Calcul linéaire** : Remboursement de capital à annuités constantes
- **Monnaie unique** : Pas de gestion multi-devises

## 📋 Roadmap

### Version 2.1 (prévue)
- [ ] Sauvegarde des simulations en base de données
- [ ] Export Excel (.xlsx)
- [ ] Gestion multi-devises
- [ ] Graphiques interactifs
- [ ] Comparaison de scénarios

### Version 3.0 (future)
- [ ] Périodes variables (1 à 10 ans)
- [ ] Calculs d'amortissement avancés
- [ ] Intégration API bancaires
- [ ] Mode collaboratif multi-utilisateurs

## 🤝 Contribution

### Comment contribuer
1. **Forkez** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Pushez** sur la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines de contribution
- Respectez les standards de codage WordPress
- Testez sur différents navigateurs
- Documentez les nouvelles fonctionnalités
- Maintenez la compatibilité responsive

### Rapporter des bugs
Utilisez les [GitHub Issues](../../issues) avec le template :
- **Environnement** (WordPress, PHP, navigateur)
- **Étapes de reproduction**
- **Comportement attendu vs observé**
- **Captures d'écran** si applicable

## 📞 Support

### Canaux de support
- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **LinkedIn** : [Dagou Patrick Elysée Botchi](https://www.linkedin.com/in/dagou-patrick-elys%C3%A9e-botchi-48a94b96/)

### FAQ

**Q: Le plugin fonctionne-t-il avec tous les thèmes ?**
R: Oui, le plugin est conçu pour être indépendant du thème grâce à ses styles encapsulés.

**Q: Peut-on modifier les régimes fiscaux ?**
R: Oui, éditez la constante `TAX_RATES` dans `script.js`.

**Q: Les calculs sont-ils précis pour tous les pays ?**
R: Le plugin utilise des formules financières standards, mais vérifiez la conformité locale.

## 📄 Licence

Ce projet est sopen source. C'est à dire que vous pouvez le cloner et l'adapter à votre guise.

### Crédits
- **Auteur principal** : Dagou Patrick Elysée Botchi
- **Librairies** : jsPDF, html2canvas
- **Framework** : WordPress

---

**⭐ Si ce plugin vous est utile, n'hésitez pas à lui donner une étoile !**

---

*Dernière mise à jour : Version 2.0*