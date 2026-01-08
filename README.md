# 🏦 Bank Churn Prediction - Workshop MLOps avec Azure

> **Workshop complet de déploiement d'un modèle de Machine Learning en production sur Microsoft Azure**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![Azure](https://img.shields.io/badge/Azure-Container%20Apps-0078D4.svg)](https://azure.microsoft.com/)
[![MLflow](https://img.shields.io/badge/MLflow-2.8.1-orange.svg)](https://mlflow.org/)

## 📋 Table des Matières

1. [Introduction](#1-introduction)
2. [Préparation de l'Environnement](#2-préparation-de-lenvironnement)
3. [Module 1 : Entraînement du Modèle](#3-module-1--entraînement-du-modèle)
4. [Module 2 : Création de l'API avec FastAPI](#4-module-2--création-de-lapi-avec-fastapi)
5. [Module 3 : Conteneurisation avec Docker](#5-module-3--conteneurisation-avec-docker)
6. [Module 4 : Déploiement sur Azure](#6-module-4--déploiement-sur-azure)
7. [Module 5 : CI/CD avec GitHub Actions](#7-module-5--cicd-avec-github-actions)
8. [Module 6 : Monitoring et Maintenance](#8-module-6--monitoring-et-maintenance)
9. [Module 7 : Optimisations et Bonnes Pratiques](#9-module-7--optimisations-et-bonnes-pratiques)
10. [Module 8 : Déploiement du Frontend Streamlit](#10-module-8--déploiement-du-frontend-streamlit-sur-streamlit-cloud)
11. [Nettoyage des Ressources](#11-nettoyage-des-ressources-azure)
12. [Récapitulatif du Workshop](#12-récapitulatif-du-workshop)
13. [FAQ](#13-faq---foire-aux-questions)
14. [Conclusion](#14-conclusion)

---

## 1. Introduction

### 1.1 Bienvenue !

Ce workshop vous guidera à travers le déploiement complet d'un modèle de Machine Learning en production sur Microsoft Azure. Vous allez construire une API de prédiction de défaillance client (churn) et la déployer sur le cloud avec toutes les bonnes pratiques MLOps.

### 1.2 Objectifs d'Apprentissage

À la fin de ce workshop, vous serez capable de :

- ✅ Entraîner et sauvegarder un modèle ML avec MLflow
- ✅ Créer une API REST avec FastAPI
- ✅ Conteneuriser une application avec Docker
- ✅ Déployer sur Azure Container Apps
- ✅ Mettre en place un pipeline CI/CD avec GitHub Actions
- ✅ Monitorer votre application en production
- ✅ Détecter le data drift

### 1.3 Le Projet : Bank Churn Prediction

**Contexte** : Une banque souhaite prédire quels clients risquent de partir pour proposer des actions de rétention.

**Dataset** : 10 features (âge, score crédit, solde, etc.) + 1 target (Exited : 0/1)

**Modèle** : Random Forest Classifier

**Livrable** : API REST déployée sur Azure, accessible publiquement

### 1.4 Architecture Finale

```
Flux de déploiement complet :
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Streamlit)                     │
│              Streamlit Cloud (Interface Web)                │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP Requests
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                        │
│  Code GitHub → GitHub Actions → Docker Build →              │
│  Azure Container Registry → Azure Container Apps            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Modèle ML (Random Forest)                      │
│              MLflow Tracking + Monitoring                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Préparation de l'Environnement

### 2.1 Logiciels Requis

**Obligatoire :**

- **Python 3.9+** : [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **Visual Studio Code** : [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **Git** : [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Docker Desktop** : [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Azure CLI** : [https://docs.microsoft.com/cli/azure/install-azure-cli](https://docs.microsoft.com/cli/azure/install-azure-cli)

**Comptes à créer :**

- **Compte GitHub** : [https://github.com/signup](https://github.com/signup)
- **Azure for Students (100$)** : [https://azure.microsoft.com/students](https://azure.microsoft.com/students)

### 2.2 Vérification de l'Installation

Ouvrez un terminal et testez :

```bash
# Python
python --version
# Doit afficher Python 3.9.x ou supérieur

# Git
git --version

# Docker
docker --version
docker ps

# Azure CLI
az --version
```

### 2.3 Configuration Initiale

#### 2.3.1 Configuration Git

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

#### 2.3.2 Connexion à Azure

```bash
# Se connecter à Azure
az login

# Vérifier l'abonnement
az account show

# Si vous avez plusieurs abonnements, sélectionner celui de Students
az account set --subscription "Azure for Students"
```

---

## 3. Module 1 : Entraînement du Modèle

### 3.1 Objectif

Entraîner un modèle Random Forest pour prédire le churn et le sauvegarder avec MLflow.

### 3.2 Préparation du Projet

```bash
# Créer le dossier du projet
mkdir bank-churn-mlops
cd bank-churn-mlops

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows :
venv\Scripts\activate
# Mac/Linux :
source venv/bin/activate

# Créer la structure
mkdir -p data model app tests
touch requirements.txt
```

### 3.3 Installation des Dépendances

```bash
pip install -r requirements.txt
```

### 3.4 Téléchargement du Dataset

Le dataset est généré automatiquement via `generate_data.py`. Exécutez :

```bash
python generate_data.py
```

Cela crée `data/bank_churn.csv` avec 10 000 échantillons synthétiques.

### 3.5 Script d'Entraînement

Le script `train_model.py` effectue :

- Chargement et préparation des données
- Split train/test (80/20)
- Entraînement d'un Random Forest
- Évaluation avec métriques (accuracy, precision, recall, F1, ROC AUC)
- Sauvegarde du modèle avec MLflow
- Génération de visualisations (matrice de confusion, feature importance)

**Exécution :**

```bash
python train_model.py
```

### 3.6 Visualisation avec MLflow UI

```bash
mlflow ui --port 5000
# Ouvrir http://localhost:5000 dans votre navigateur
```

### 3.7 Checkpoint Module 1

**Validation avant de continuer :**

- ✅ Le modèle est entraîné avec une accuracy > 0.75
- ✅ Le fichier `model/churn_model.pkl` existe
- ✅ MLflow UI affiche votre expérience
- ✅ Vous comprenez les métriques obtenues

---

## 4. Module 2 : Création de l'API avec FastAPI

### 4.1 Objectif

Créer une API REST qui expose le modèle via des endpoints HTTP.

### 4.2 Structure du Code API

```
bank-churn-mlops/
|-- app/
|   |-- __init__.py
|   |-- main.py          # Application FastAPI principale
|   |-- models.py        # Schémas Pydantic
|   |-- drift_detect.py # Détection de drift
|   |-- utils.py
|-- model/
|   +-- churn_model.pkl
|-- tests/
|   +-- test_api.py
|-- requirements.txt
+-- README.md
```

### 4.3 Endpoints Disponibles

#### Endpoints Généraux

- `GET /` - Page d'accueil de l'API
- `GET /health` - Health check de l'API et du modèle
- `GET /docs` - Documentation Swagger interactive
- `GET /redoc` - Documentation ReDoc

#### Endpoints de Prédiction

- `POST /predict` - Prédiction pour un seul client
- `POST /predict/batch` - Prédiction pour plusieurs clients

#### Endpoints de Monitoring

- `POST /drift/check` - Vérification du data drift
- `POST /drift/alert` - Alerte manuelle de drift

### 4.4 Test Local de l'API

```bash
# Démarrer l'API
uvicorn app.main:app --reload --port 8000
```

**Dans un autre terminal, tester :**

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Prediction simple
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "CreditScore": 650,
    "Age": 35,
    "Tenure": 5,
    "Balance": 50000,
    "NumOfProducts": 2,
    "HasCrCard": 1,
    "IsActiveMember": 1,
    "EstimatedSalary": 75000,
    "Geography_Germany": 0,
    "Geography_Spain": 1
  }'
```

### 4.5 Documentation Interactive

Ouvrez votre navigateur et allez sur :

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

### 4.6 Checkpoint Module 2

**Validation avant de continuer :**

- ✅ L'API démarre sans erreur
- ✅ Le health check fonctionne
- ✅ Les prédictions fonctionnent
- ✅ La documentation Swagger est accessible

---

## 5. Module 3 : Conteneurisation avec Docker

### 5.1 Objectif

Empaqueter l'API dans un conteneur Docker pour la rendre portable et faciliter le déploiement sur Azure.

### 5.2 Dockerfile

Le `Dockerfile` à la racine du projet :

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
COPY model/ ./model/
COPY data/ ./data/
COPY drift_data_gen.py .
RUN python drift_data_gen.py
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5.3 Build de l'Image Docker

```bash
# Build de l'image
docker build -t bank-churn-api:v1 .

# Vérifier que l'image est créée
docker images bank-churn-api:v1
```

### 5.4 Test du Conteneur en Local

```bash
# Lancer le conteneur
docker run -d -p 8000:8000 --name churn-api bank-churn-api:v1

# Vérifier que le conteneur tourne
docker ps

# Voir les logs
docker logs churn-api

# Tester l'API
curl http://localhost:8000/health

# Arrêter et supprimer le conteneur
docker stop churn-api
docker rm churn-api
```

### 5.5 Commandes Docker Utiles

```bash
# Voir tous les conteneurs (même arrêtés)
docker ps -a

# Entrer dans un conteneur en cours d'exécution
docker exec -it churn-api /bin/bash

# Voir l'utilisation des ressources
docker stats churn-api

# Nettoyer les images inutilisées
docker image prune
```

### 5.6 Questions de Compréhension

- **Pourquoi utiliser un .dockerignore ?** Pour exclure les fichiers inutiles et réduire la taille de l'image.
- **Quelle est la différence entre CMD et RUN ?** `RUN` exécute des commandes pendant le build, `CMD` définit la commande par défaut au démarrage.
- **Pourquoi exposer le port 8000 ?** C'est le port sur lequel FastAPI écoute par défaut.

### 5.7 Checkpoint Module 3

**Validation avant de continuer :**

- ✅ L'image Docker est buildée avec succès
- ✅ Le conteneur démarre sans erreur
- ✅ L'API répond correctement depuis le conteneur
- ✅ La taille de l'image est raisonnable (< 1GB)

---

## 6. Module 4 : Déploiement sur Azure

### 6.1 Objectif

Déployer l'API sur Azure Container Apps et la rendre accessible publiquement.

### 6.2 Prérequis

- Docker Desktop en cours d'exécution
- Azure CLI installé et connecté (`az login`)
- Image locale `bank-churn-api:v1` déjà construite
- Extension containerapp installée :

```bash
az extension add --name containerapp
```

### 6.3 Déploiement Automatique

Un script de déploiement complet est disponible (`script.sh`). Il effectue :

1. **Création du Resource Group**
2. **Création d'Azure Container Registry (ACR)**
3. **Build et Push de l'image Docker vers ACR**
4. **Création de Log Analytics Workspace**
5. **Création de Container Apps Environment**
6. **Déploiement de la Container App**

**Exécution :**

```bash
chmod +x script.sh
./script.sh
```

### 6.4 Déploiement Manuel via Azure Portal

Voir la section détaillée dans le document original pour les instructions pas à pas via l'interface graphique.

### 6.5 Test de l'API en Production

```bash
RESOURCE_GROUP="rg-mlops-bank-churn"
CONTAINER_APP_NAME="bank-churn"

APP_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv | tr -d '\r\n' | xargs)

# Test de prédiction
curl -X POST "https://${APP_URL}/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "CreditScore": 650,
    "Age": 35,
    "Tenure": 5,
    "Balance": 50000,
    "NumOfProducts": 2,
    "HasCrCard": 1,
    "IsActiveMember": 1,
    "EstimatedSalary": 75000,
    "Geography_Germany": 0,
    "Geography_Spain": 1
  }'
```

### 6.6 Résolution des Problèmes

| Problème                        | Solution                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Erreur DNS / cloudName: null    | Exécuter `az logout && az login`                                                                                      |
| Caractère \r dans les variables | Toujours utiliser `tr -d '\r'` après `az acr show`                                                                    |
| Docker non accessible           | Démarrer Docker Desktop et ouvrir un nouveau terminal                                                                 |
| L'application est "Failed"      | Vérifier les logs : `az containerapp logs show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --tail 50` |

### 6.7 Commandes de Diagnostic Utiles

```bash
# Voir les logs en temps réel
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 100 \
  --follow

# Vérifier l'état détaillé
az containerapp revision list \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --output table
```

### 6.8 Checkpoint Module 4

**Validation avant de continuer :**

- ✅ L'application est accessible via HTTPS
- ✅ Le health check fonctionne
- ✅ Les prédictions fonctionnent
- ✅ Vous avez noté l'URL publique de votre API

---

## 7. Module 5 : CI/CD avec GitHub Actions

### 7.1 Objectif

Automatiser le déploiement : chaque commit sur la branche `main` déclenche un build et un redéploiement via un pipeline GitHub Actions.

### 7.2 Initialisation du Repository Git

```bash
# Initialiser git avec 'main' comme branche par défaut
git init -b main

# Créer un .gitignore robuste
# (voir .gitignore dans le projet)

# Premier commit
git add .
git commit -m "Initial commit: Bank Churn API"
```

### 7.3 Créer un Repository GitHub

1. Allez sur [https://github.com/new](https://github.com/new)
2. Nom : `bank-churn-mlops`
3. Visibility : Public ou Private
4. Ne pas initialiser avec README
5. Cliquez sur "Create repository"

```bash
# Lier votre repo local à GitHub
git remote add origin https://github.com/votre-username/bank-churn-mlops.git
git branch -M main
git push -u origin main
```

### 7.4 Configuration des Secrets GitHub

Pour l'authentification avec Azure, créez un Service Principal :

```bash
RESOURCE_GROUP="rg-mlops-bank-churn"
SUBSCRIPTION_ID=$(az account show --query id -o tsv | tr -d '\r')

# Créer le Service Principal
SP_JSON=$(az ad sp create-for-rbac \
  --name "github-actions-$(date +%s)" \
  --role contributor \
  --scopes "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}" \
  --output json)

# Extraire et formater les 4 champs requis
echo $SP_JSON | jq -c '{clientId: .appId, clientSecret: .password, subscriptionId: "'"$SUBSCRIPTION_ID"'", tenantId: .tenant}'
```

**Ajouter les secrets dans GitHub :**

Allez dans votre repository : **Settings > Secrets and variables > Actions**

Ajoutez ces trois secrets :

| Nom du Secret       | Valeur                                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| `AZURE_CREDENTIALS` | L'objet JSON complet (4 champs) généré ci-dessus                                |
| `ACR_USERNAME`      | `az acr credential show --name <VOTRE_ACR> --query username -o tsv`             |
| `ACR_PASSWORD`      | `az acr credential show --name <VOTRE_ACR> --query "passwords[0].value" -o tsv` |

### 7.5 Création du Workflow GitHub Actions

Créez le fichier `.github/workflows/ci-cd.yml` :

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  AZURE_RESOURCE_GROUP: rg-mlops-bank-churn
  ACR_NAME: mlopsnevermind # ⚠️ REMPLACEZ PAR LE VÔTRE
  CONTAINER_APP_NAME: bank-churn
  IMAGE_NAME: bank-churn-api

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.9"
      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run tests with coverage
        run: |
          pytest tests/ -v --cov=app --cov-report=term

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Login to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.ACR_NAME }}.azurecr.io
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      - name: Build and push Docker image
        run: |
          docker build -t ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:${{ github.sha }} .
          docker tag ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:${{ github.sha }} ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:latest
          docker push ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:latest
      - name: Deploy to Azure Container Apps
        uses: azure/CLI@v1
        with:
          inlineScript: |
            az containerapp update \
              --name ${{ env.CONTAINER_APP_NAME }} \
              --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
              --image ${{ env.ACR_NAME }}.azurecr.io/${{ env.IMAGE_NAME }}:${{ github.sha }}
      - name: Verify deployment
        run: |
          APP_URL=$(az containerapp show \
            --name ${{ env.CONTAINER_APP_NAME }} \
            --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
            --query properties.configuration.ingress.fqdn -o tsv)
          echo "🌐 Votre API est déployée à : https://$APP_URL"
          sleep 20
          curl -f https://$APP_URL/health || exit 1
```

### 7.6 Déclencher le Pipeline

```bash
git add .github/workflows/ci-cd.yml
git commit -m "feat: add automated CI/CD pipeline with GitHub Actions"
git push origin main
```

Le pipeline se déclenche **AUTOMATIQUEMENT** ! Observez l'exécution dans l'onglet **Actions** de votre dépôt GitHub.

### 7.7 Dépannage des Erreurs Courantes

| Symptôme                                        | Cause                                  | Solution                                                              |
| ----------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Login failed... Not all parameters are provided | Secret `AZURE_CREDENTIALS` mal formaté | Recréer avec l'objet JSON à 4 champs exactement                       |
| Error: ACR login failed... 401                  | Secrets ACR incorrects                 | Régénérer avec `az acr credential renew`                              |
| Repository not found                            | Noms dans `env:` incorrects            | Vérifier les noms exacts avec `az acr list` et `az containerapp list` |

### 7.8 Checkpoint Module 5

**Validation avant de continuer :**

- ✅ Le dépôt GitHub existe et est lié
- ✅ Les trois secrets GitHub sont créés
- ✅ Le fichier `.github/workflows/ci-cd.yml` est présent
- ✅ Le pipeline CI/CD s'exécute sans erreur
- ✅ L'application se redéploie automatiquement après un `git push`

---

## 8. Module 6 : Monitoring et Maintenance

### 8.1 Objectif

Mettre en place le monitoring de l'application en production, suivre l'état de l'API, les performances et détecter le data drift à l'aide d'Azure Application Insights.

### 8.2 Configuration Application Insights

```bash
# Création d'Application Insights
az monitor app-insights component create \
  --app bank-churn-insights \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --application-type web

# Récupération de la connection string
APPINSIGHTS_CONN=$(az monitor app-insights component show \
  --app bank-churn-insights \
  --resource-group $RESOURCE_GROUP \
  --query connectionString -o tsv)

# Injection de la variable d'environnement
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "APPLICATIONINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONN"
```

### 8.3 Intégration du Monitoring dans le Code

L'API est déjà instrumentée avec `opencensus-ext-azure` pour envoyer les logs vers Application Insights. Les événements suivants sont trackés :

- **Prédictions** : Probabilité, niveau de risque
- **Détection de drift** : Pourcentage de features avec drift, niveau de risque
- **Erreurs** : Stack traces et messages d'erreur

### 8.4 Détection de Data Drift

Le script `drift_data_gen.py` génère des données de production avec drift artificiel pour tester le système :

```bash
# Générer des données de production avec drift moyen
python drift_data_gen.py
```

L'endpoint `/drift/check` compare les données de référence (`data/bank_churn.csv`) avec les données de production (`data/production_data.csv`) en utilisant le test de Kolmogorov-Smirnov.

### 8.5 Visualisation dans Azure Portal

1. Allez dans votre **Application Insights** dans Azure Portal
2. Menu **Logs** pour voir les événements en temps réel
3. Menu **Metrics** pour les métriques de performance
4. Menu **Application Map** pour visualiser les dépendances

### 8.6 Checkpoint Module 6

**Validation avant de continuer :**

- ✅ Application Insights est actif
- ✅ Les logs sont visibles dans Azure Portal
- ✅ `/predict` fonctionne en production
- ✅ `/drift/check` retourne un résultat
- ✅ Le drift est historisé dans Application Insights

---

## 9. Module 7 : Optimisations et Bonnes Pratiques

### 9.1 Objectif

Améliorer les performances, la sécurité et la maintenabilité de l'application.

### 9.2 Cache pour les Prédictions

L'API utilise un cache LRU pour éviter de recalculer les prédictions identiques :

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def predict_cached(features_hash: str, features_json: str):
    # ... logique de prédiction
```

### 9.3 Checklist de Production

**Avant de mettre en production :**

- [ ] Tests unitaires avec coverage > 80%
- [ ] Tests d'intégration
- [ ] Load testing effectué
- [ ] Monitoring configuré
- [ ] Alertes définies
- [ ] Logs centralisés
- [ ] Documentation API complète
- [ ] HTTPS activé
- [ ] Health checks fonctionnels
- [ ] Auto-scaling testé
- [ ] Variables d'environnement sécurisées
- [ ] Budget Azure surveillé

### 9.4 Checkpoint Module 7

**Validation finale :**

- ✅ Cache de prédictions implémenté
- ✅ Documentation complète
- ✅ Tous les tests passent
- ✅ Checklist de production vérifiée

---

## 10. Module 8 : Déploiement du Frontend Streamlit sur Streamlit Cloud

### 10.1 Objectif

Déployer l'interface utilisateur Streamlit sur Streamlit Cloud pour rendre l'application accessible publiquement via une interface web conviviale.

### 10.2 Prérequis

- ✅ Compte GitHub avec votre code poussé
- ✅ Backend API déployé sur Azure Container Apps (Module 4)
- ✅ Fichier `streamlit_app.py` à la racine du projet
- ✅ `requirements.txt` ou `requirements-streamlit.txt` avec les dépendances

### 10.3 Préparation du Projet

#### 10.3.1 Vérification des Fichiers

Assurez-vous que votre repository contient :

- `streamlit_app.py` - Application Streamlit principale
- `requirements.txt` ou `requirements-streamlit.txt` - Dépendances Python
- `.streamlit/config.toml` (optionnel) - Configuration Streamlit

#### 10.3.2 Création de `requirements-streamlit.txt` (Recommandé)

Pour optimiser le déploiement, créez un fichier minimal avec uniquement les dépendances nécessaires :

```txt
streamlit==1.31.1
requests==2.31.0
pandas==2.1.3
pyarrow==14.0.1
python-dotenv==1.0.0
```

#### 10.3.3 Configuration Streamlit (Optionnel)

Créez `.streamlit/config.toml` pour personnaliser l'apparence :

```toml
[theme]
primaryColor = "#667eea"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#f8f9fa"
textColor = "#262730"
font = "sans serif"

[server]
headless = true
port = 8501
enableCORS = false
enableXsrfProtection = true

[browser]
gatherUsageStats = false
```

### 10.4 Déploiement sur Streamlit Cloud

#### 10.4.1 Accès à Streamlit Cloud

1. Allez sur [https://share.streamlit.io](https://share.streamlit.io)
2. Cliquez sur **"Sign up"** ou **"Sign in"** avec votre compte GitHub
3. Autorisez Streamlit à accéder à vos repositories GitHub

#### 10.4.2 Création d'une Nouvelle App

1. Cliquez sur le bouton **"New app"**
2. Remplissez le formulaire de déploiement :
   - **Repository** : `votre-username/bank-churn-mlops`
   - **Branch** : `main` (ou votre branche par défaut)
   - **Main file path** : `streamlit_app.py`

#### 10.4.3 Configuration Avancée

Cliquez sur **"Advanced settings"** pour configurer :

- **Python version** : 3.11 (ou votre version)
- **Requirements file** :
  - `requirements.txt` (tous les packages)
  - `requirements-streamlit.txt` (recommandé - packages minimaux)

#### 10.4.4 Configuration des Secrets (Variables d'Environnement)

Si votre application nécessite des variables d'environnement (comme l'URL de l'API backend) :

1. Dans les paramètres de l'app, cliquez sur **"Advanced settings"**
2. Faites défiler jusqu'à la section **"Secrets"**
3. Ajoutez vos secrets au format TOML :

```toml
# Format pour Streamlit Cloud Secrets
BACKEND_URL = "https://bank-churn.xxxxx.azurecontainerapps.io"
API_KEY = "votre-cle-secrete"  # Si nécessaire
```

**Note** : Votre application Streamlit lit déjà ces variables depuis l'environnement :

- `BACKEND_URL` - URL de votre API Azure (défaut : URL Azure)
- `API_KEY` - Clé API optionnelle

#### 10.4.5 Lancement du Déploiement

1. Cliquez sur le bouton **"Deploy!"**
2. Attendez la fin du déploiement (généralement 2-5 minutes)
3. Streamlit Cloud va :
   - Cloner votre repository
   - Installer les dépendances depuis requirements.txt
   - Exécuter votre `streamlit_app.py`

### 10.5 Accès à l'Application Déployée

Une fois déployée, vous obtiendrez une URL comme :

```
https://[votre-app-name].streamlit.app
```

Partagez cette URL pour accéder à votre application !

### 10.6 Gestion du Déploiement

#### 10.6.1 Mise à Jour Automatique

Votre application se redéploie automatiquement lorsque vous poussez des changements sur GitHub :

```bash
# Faire des modifications à streamlit_app.py
git add streamlit_app.py
git commit -m "Update prediction UI"
git push origin main
```

Streamlit Cloud détectera les changements et redéploiera automatiquement !

#### 10.6.2 Visualisation des Logs

1. Allez sur [https://share.streamlit.io](https://share.streamlit.io)
2. Cliquez sur votre application
3. Cliquez sur **"Manage app"** → **"Logs"** pour voir les logs en temps réel

#### 10.6.3 Redémarrage de l'Application

Si votre application plante ou devient non responsive :

1. Allez sur la page de gestion de l'app
2. Cliquez sur **"⋮"** (trois points)
3. Sélectionnez **"Reboot app"**

#### 10.6.4 Suppression de l'Application

1. Allez sur la page de gestion de l'app
2. Cliquez sur **"⋮"** (trois points)
3. Sélectionnez **"Delete app"**

### 10.7 Personnalisation

#### 10.7.1 Ajout d'un Favicon

Ajoutez un favicon en créant `.streamlit/config.toml` :

```toml
[browser]
favicon = "path/to/your/favicon.png"
```

#### 10.7.2 Domaine Personnalisé (Optionnel)

Streamlit Cloud offre des domaines personnalisés pour certains plans. Consultez leur page de tarification pour plus de détails.

### 10.8 Dépannage

#### 10.8.1 Problèmes Courants

| Problème                   | Solution                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module Not Found Error** | Vérifiez que tous les packages requis sont dans `requirements.txt`. Consultez les logs pour identifier le module manquant.                  |
| **Memory Limit Exceeded**  | Réduisez les dépendances, utilisez `requirements-streamlit.txt` avec des packages minimaux, ou envisagez un plan payant.                    |
| **Connection Timeout**     | Vérifiez que votre API backend est accessible, vérifiez la `BACKEND_URL` dans vos secrets, testez l'endpoint API manuellement.              |
| **App Keeps Restarting**   | Consultez les logs pour les erreurs, assurez-vous que votre code n'a pas de boucles infinies ou de crashes, vérifiez l'utilisation mémoire. |

#### 10.8.2 Ressources d'Aide

- **Forum Communautaire Streamlit** : [discuss.streamlit.io](https://discuss.streamlit.io)
- **Documentation** : [docs.streamlit.io](https://docs.streamlit.io)
- **GitHub Issues** : Signaler les bugs sur [streamlit/streamlit](https://github.com/streamlit/streamlit)

### 10.9 Limites des Ressources (Cloud Communautaire)

**Limitations du plan gratuit :**

- **CPU** : 1 cœur CPU
- **Mémoire** : 1 GB RAM
- **Stockage** : Limité à la taille de l'app
- **Apps** : Jusqu'à 3 apps par compte

**Pour des limites plus élevées, considérez :**

- **Streamlit Cloud Teams** (payant)
- **Auto-hébergement** sur AWS/Azure/GCP
- **Déploiement Docker** sur votre propre infrastructure

### 10.10 Architecture Complète

Avec ce module, votre architecture MLOps complète devient :

```
┌─────────────────┐
│  Streamlit UI   │ ← Interface utilisateur (Streamlit Cloud)
│  (Frontend)      │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│  FastAPI API    │ ← API REST (Azure Container Apps)
│  (Backend)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ML Model       │ ← Modèle Random Forest
│  (churn_model)  │
└─────────────────┘
```

### 10.11 Checkpoint Module 8

**Validation avant de continuer :**

- ✅ L'application Streamlit est déployée sur Streamlit Cloud
- ✅ L'URL publique est accessible
- ✅ La connexion à l'API backend fonctionne
- ✅ Les prédictions fonctionnent depuis l'interface web
- ✅ Les logs sont visibles dans Streamlit Cloud

### 10.12 Commandes de Référence Rapide

```bash
# Vérifier le statut du repository
git status

# Ajouter tous les changements
git add .

# Commiter avec un message
git commit -m "Votre message ici"

# Pousser vers GitHub (déclenche le redéploiement automatique)
git push origin main

# Voir l'URL du remote
git remote -v
```

---

## 11. Nettoyage des Ressources Azure

### 10.1 ⚠️ IMPORTANT - Suppression pour Éviter les Coûts

**ATTENTION - À FAIRE À LA FIN DU WORKSHOP**

Pour éviter de consommer votre budget de 100$, supprimez toutes les ressources :

```bash
# Suppression du groupe de ressources (supprime tout)
az group delete --name rg-mlops-bank-churn --yes --no-wait

# Vérification
az group list --output table
```

Cette commande supprime :

- Azure Container Registry
- Azure Container Apps
- Application Insights
- Tous les logs et données

**Temps de suppression** : 5-10 minutes

### 10.2 Script de Nettoyage Automatique

Un script `cleanup.sh` est disponible pour faciliter le nettoyage :

```bash
chmod +x cleanup.sh
./cleanup.sh
```

---

## 12. Récapitulatif du Workshop

### 12.1 Ce que Vous Avez Accompli

Félicitations ! Vous avez déployé un système MLOps complet :

```
Architecture Finale Complète :
┌─────────────────────────────────────────────────────────────┐
│  Streamlit UI (Streamlit Cloud)                            │
│  Interface utilisateur web                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ML Training → FastAPI → Docker →                          │
│  Azure Container Registry → Azure Container Apps           │
│                                    ↑                        │
│                            GitHub Actions CI/CD            │
│                                    ↑                        │
│                        Application Insights Monitoring      │
└─────────────────────────────────────────────────────────────┘
```

### 12.2 Compétences Acquises

**Machine Learning**

- Entraînement d'un modèle Random Forest
- Évaluation avec métriques appropriées
- Tracking avec MLflow

**Développement d'API**

- Création d'API REST avec FastAPI
- Validation des données avec Pydantic
- Documentation automatique

**Développement Frontend**

- Interface utilisateur avec Streamlit
- Déploiement sur Streamlit Cloud
- Intégration frontend-backend

**Conteneurisation**

- Dockerfiles optimisés
- Bonnes pratiques de sécurité
- Gestion des images

**Cloud Azure**

- Azure Container Registry
- Azure Container Apps
- Application Insights

**DevOps/MLOps**

- Pipelines CI/CD avec GitHub Actions
- Tests automatisés
- Déploiement continu

**Monitoring et Maintenance**

- Logs centralisés
- Métriques de performance
- Détection de data drift

### 12.3 Points Clés à Retenir

**Leçons Importantes :**

- **MLOps = DevOps + ML** : Automatisation du cycle de vie complet
- **Conteneurisation** : Portabilité et reproductibilité
- **Tests** : Essentiels pour la fiabilité
- **Monitoring** : Indispensable en production
- **Documentation** : Facilite la collaboration
- **Sécurité** : À considérer dès le début
- **Coûts** : Toujours surveiller l'utilisation cloud

---

## 13. FAQ - Foire Aux Questions

### 13.1 Questions Techniques

**Q1 : Mon API est lente, comment l'optimiser ?**

**R :** Plusieurs options :

- Activer le cache des prédictions
- Utiliser des prédictions batch
- Optimiser le modèle (quantization, pruning)
- Augmenter les ressources CPU/RAM

**Q2 : Comment gérer plusieurs versions de modèles ?**

**R :** Utilisez MLflow Model Registry et créez des endpoints différents (v1, v2).

**Q3 : Comment implémenter un rollback ?**

**R :** Conservez les anciennes images Docker avec tags et utilisez :

```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/bank-churn-api:v1  # Version précédente
```

**Q4 : Mon budget Azure est presque épuisé, que faire ?**

**R :**

- Mettre `min-replicas` à 0
- Utiliser des SKU Basic
- Supprimer les ressources inutilisées
- Activer les budgets alerts

### 13.2 Questions de Compréhension

**Q5 : Quelle est la différence entre Docker et Kubernetes ?**

**R :** Docker conteneurise les applications, Kubernetes les orchestre (scaling, load balancing, self-healing).

**Q6 : Pourquoi utiliser FastAPI plutôt que Flask ?**

**R :** FastAPI est plus rapide, avec validation automatique, documentation auto-générée, et support async natif.

**Q7 : Qu'est-ce que le data drift ?**

**R :** Changement dans la distribution des données d'entrée par rapport aux données d'entraînement, pouvant dégrader les performances du modèle.

---

## 14. Conclusion

### 14.1 Félicitations !

Vous avez terminé ce workshop intensif de MLOps avec Azure. Vous avez construit un système complet de déploiement de modèle de Machine Learning en production, avec toutes les bonnes pratiques de l'industrie.

### 14.2 Prochaines Étapes

- Explorer d'autres modèles (XGBoost, Neural Networks)
- Implémenter A/B testing
- Ajouter l'authentification API
- Mettre en place des alertes automatiques
- Optimiser les coûts Azure
- Améliorer l'interface Streamlit avec plus de visualisations
- Ajouter des fonctionnalités de batch prediction dans l'UI

### 14.3 Ressources Supplémentaires

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation MLflow](https://mlflow.org/docs/latest/index.html)
- [Documentation Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)
- [Documentation GitHub Actions](https://docs.github.com/actions)
- [Documentation Streamlit](https://docs.streamlit.io/)
- [Streamlit Cloud](https://share.streamlit.io/)

---

## 📝 Licence

Ce projet est fourni à des fins éducatives dans le cadre d'un workshop MLOps.
