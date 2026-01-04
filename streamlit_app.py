import streamlit as st
import requests
import os
import pandas as pd
import time

# Configuration de la page
st.set_page_config(
    page_title="ChurnInsight AI Pro",
    page_icon="🏦",
    layout="wide"
)

# Style CSS personnalisé pour l'esthétique
st.markdown("""
<style>
    .main {
        background-color: #0e1117;
    }
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        height: 3em;
        background-color: #6366f1;
        color: white;
        font-weight: bold;
    }
    .stMetric {
        background-color: #161b22;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #30363d;
    }
    h1 {
        color: white;
    }
    .prediction-card {
        padding: 2rem;
        border-radius: 1rem;
        border: 1px solid #30363d;
        background-color: #161b22;
        margin-bottom: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Variables d'environnement
API_URL = os.getenv("API_URL", "https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io")
API_KEY = os.getenv("API_KEY", "mlops_secret_key_2026")

def check_health():
    try:
        response = requests.get(f"{API_URL}/health")
        return response.status_code == 200
    except:
        return False

# Header
st.title("🏦 ChurnInsight AI Pro")
st.markdown("Système d'analyse de rétention client propulsé par Machine Learning.")

# Sidebar pour le monitoring
with st.sidebar:
    st.header("⚡ Statut Système")
    if check_health():
        st.success("API Azure : Connectée")
    else:
        st.error("API Azure : Déconnectée")
    
    st.divider()
    st.header("📊 Data Drift")
    if st.button("Lancer l'audit de Drift"):
        with st.spinner("Analyse en cours..."):
            try:
                headers = {"X-API-Key": API_KEY}
                res = requests.post(f"{API_URL}/drift/check?threshold=0.05", headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    st.metric("Features Analysées", data["features_analyzed"])
                    st.metric("Features Driftées", data["features_drifted"])
                    if data["features_drifted"] == 0:
                        st.success("Modèle Stable ✅")
                    else:
                        st.warning("Réentraînement Recommandé ⚠️")
                else:
                    st.error("Erreur API")
            except Exception as e:
                st.error(f"Erreur : {e}")

# Corps principal - Formulaire
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("👤 Profil Client")
    with st.form("churn_form"):
        c1, c2 = st.columns(2)
        with c1:
            credit_score = st.number_input("Score de Crédit", 300, 850, 650)
            age = st.number_input("Âge", 18, 100, 35)
            geography = st.selectbox("Géographie", ["France", "Germany", "Spain"])
            tenure = st.number_input("Ancienneté (années)", 0, 10, 5)
        
        with c2:
            balance = st.number_input("Solde du compte ($)", 0.0, 1000000.0, 50000.0)
            products = st.number_input("Nombre de produits", 1, 4, 2)
            has_card = st.selectbox("Carte de Crédit ?", ["Oui", "Non"])
            is_active = st.selectbox("Membre Actif ?", ["Oui", "Non"])
        
        salary = st.number_input("Salaire Estimé ($)", 0.0, 1000000.0, 75000.0)
        
        submitted = st.form_submit_button("Analyser le Risque")

if submitted:
    with col2:
        st.subheader("🎯 Résultat")
        
        # Préparation du payload
        payload = {
            "CreditScore": credit_score,
            "Age": age,
            "Tenure": tenure,
            "Balance": balance,
            "NumOfProducts": products,
            "HasCrCard": 1 if has_card == "Oui" else 0,
            "IsActiveMember": 1 if is_active == "Oui" else 0,
            "EstimatedSalary": salary,
            "Geography_Germany": 1 if geography == "Germany" else 0,
            "Geography_Spain": 1 if geography == "Spain" else 0
        }
        
        try:
            headers = {"X-API-Key": API_KEY}
            response = requests.post(f"{API_URL}/predict", json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                prob = result["churn_probability"]
                risk = result["risk_level"]
                
                # Jauge visuelle
                st.write(f"### Risque : {risk}")
                st.progress(prob)
                
                if risk == "Low":
                    st.balloons()
                    st.success(f"Probabilité de départ : {prob*100:.1f}%")
                elif risk == "Medium":
                    st.warning(f"Probabilité de départ : {prob*100:.1f}%")
                else:
                    st.error(f"Probabilité de départ : {prob*100:.1f}%")
                
                st.info(f"Prédiction : {'Le client va partir' if result['prediction'] == 1 else 'Le client va rester'}")
            else:
                st.error(f"Erreur API ({response.status_code})")
        except Exception as e:
            st.error(f"Impossible de contacter l'API : {e}")
else:
    with col2:
        st.info("Veuillez remplir le formulaire et cliquer sur 'Analyser le Risque' pour voir le diagnostic.")
