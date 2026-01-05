import streamlit as st
import requests
import pandas as pd
import json
from typing import Dict, Any
import os
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Bank Churn Prediction",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .prediction-card {
        padding: 2rem;
        border-radius: 0.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin: 1rem 0;
    }
    .metric-card {
        padding: 1.5rem;
        border-radius: 0.5rem;
        background: #f8f9fa;
        border-left: 4px solid #667eea;
    }
    .success-card {
        padding: 1rem;
        border-radius: 0.5rem;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    .error-card {
        padding: 1rem;
        border-radius: 0.5rem;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    </style>
    """, unsafe_allow_html=True)

# Initialize session state
if "backend_url" not in st.session_state:
    st.session_state.backend_url = os.getenv(
        "BACKEND_URL",
        "https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io"
    )

if "api_key" not in st.session_state:
    st.session_state.api_key = os.getenv("API_KEY", "")

# Header
st.markdown("# 🏦 Bank Churn Prediction System")
st.markdown("### ML-Powered Customer Churn Forecasting")
st.divider()

# Sidebar for settings
with st.sidebar:
    st.markdown("## ⚙️ Settings")
    
    with st.expander("Backend Configuration", expanded=False):
        st.session_state.backend_url = st.text_input(
            "Backend URL",
            value=st.session_state.backend_url,
            help="Enter your backend API URL"
        )
        st.session_state.api_key = st.text_input(
            "API Key (Optional)",
            value=st.session_state.api_key,
            type="password",
            help="Enter your API key if required"
        )
        
        if st.button("Test Connection"):
            try:
                response = requests.get(
                    f"{st.session_state.backend_url}/health",
                    timeout=5,
                    headers={"X-API-Key": st.session_state.api_key} if st.session_state.api_key else {}
                )
                if response.status_code == 200:
                    st.success("✅ Connection successful!")
                else:
                    st.error(f"Connection failed: {response.status_code}")
            except Exception as e:
                st.error(f"❌ Connection error: {str(e)}")

# Main tabs
tab1, tab2, tab3 = st.tabs(["🔮 Single Prediction", "📊 Batch Prediction", "📈 Monitoring"])

# ============== TAB 1: SINGLE PREDICTION ==============
with tab1:
    st.markdown("## Single Customer Prediction")
    st.markdown("Enter customer details below to predict churn probability")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 👤 Customer Information")
        credit_score = st.number_input(
            "Credit Score",
            min_value=300,
            max_value=850,
            value=650,
            step=10
        )
        age = st.number_input(
            "Age",
            min_value=18,
            max_value=100,
            value=35,
            step=1
        )
        tenure = st.number_input(
            "Tenure (Years)",
            min_value=0,
            max_value=50,
            value=5,
            step=1
        )
        balance = st.number_input(
            "Account Balance ($)",
            min_value=0.0,
            value=100000.0,
            step=1000.0
        )
    
    with col2:
        st.markdown("### 📊 Account Details")
        num_products = st.number_input(
            "Number of Products",
            min_value=1,
            max_value=4,
            value=2,
            step=1
        )
        has_cr_card = st.selectbox(
            "Has Credit Card",
            options=[1, 0],
            format_func=lambda x: "Yes" if x == 1 else "No"
        )
        is_active_member = st.selectbox(
            "Is Active Member",
            options=[1, 0],
            format_func=lambda x: "Yes" if x == 1 else "No"
        )
        estimated_salary = st.number_input(
            "Estimated Salary ($)",
            min_value=0.0,
            value=75000.0,
            step=5000.0
        )
    
    st.markdown("### 🌍 Geography")
    col_geo1, col_geo2, col_geo3 = st.columns(3)
    
    with col_geo1:
        geography = st.selectbox(
            "Country",
            options=["France", "Germany", "Spain"]
        )
    
    geography_germany = 1 if geography == "Germany" else 0
    geography_spain = 1 if geography == "Spain" else 0
    
    # Prediction button
    st.divider()
    
    col_button1, col_button2 = st.columns([1, 4])
    with col_button1:
        predict_button = st.button("🔮 Predict Churn", use_container_width=True)
    
    if predict_button:
        try:
            headers = {}
            if st.session_state.api_key:
                headers["X-API-Key"] = st.session_state.api_key
            
            payload = {
                "CreditScore": float(credit_score),
                "Age": float(age),
                "Tenure": float(tenure),
                "Balance": float(balance),
                "NumOfProducts": float(num_products),
                "HasCrCard": float(has_cr_card),
                "IsActiveMember": float(is_active_member),
                "EstimatedSalary": float(estimated_salary),
                "Geography_Germany": float(geography_germany),
                "Geography_Spain": float(geography_spain),
            }
            
            response = requests.post(
                f"{st.session_state.backend_url}/predict",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                
                st.markdown("### 📊 Prediction Result")
                
                churn_prob = result.get("churn_probability", 0)
                churn_prediction = result.get("churn_prediction", 0)
                
                # Create visual representation
                col_result1, col_result2 = st.columns(2)
                
                with col_result1:
                    if churn_prediction == 1:
                        st.markdown(f"""
                        <div class="prediction-card">
                        <h3>⚠️ HIGH RISK</h3>
                        <h2 style="font-size: 2.5rem; margin: 0;">{churn_prob*100:.1f}%</h2>
                        <p>Customer is likely to churn</p>
                        </div>
                        """, unsafe_allow_html=True)
                    else:
                        st.markdown(f"""
                        <div class="prediction-card">
                        <h3>✅ LOW RISK</h3>
                        <h2 style="font-size: 2.5rem; margin: 0;">{churn_prob*100:.1f}%</h2>
                        <p>Customer is likely to stay</p>
                        </div>
                        """, unsafe_allow_html=True)
                
                with col_result2:
                    st.markdown("### 📈 Details")
                    st.metric("Churn Probability", f"{churn_prob*100:.2f}%")
                    st.metric("Prediction", "Churn" if churn_prediction == 1 else "No Churn")
                    
                    if "model_version" in result:
                        st.info(f"Model Version: {result['model_version']}")
            
            else:
                st.error(f"Error: {response.status_code} - {response.text}")
        
        except Exception as e:
            st.error(f"❌ Prediction failed: {str(e)}")

# ============== TAB 2: BATCH PREDICTION ==============
with tab2:
    st.markdown("## Batch Prediction")
    st.markdown("Upload a CSV file to make predictions for multiple customers")
    
    # File uploader
    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type="csv",
        help="File should contain columns: CreditScore, Age, Tenure, Balance, NumOfProducts, HasCrCard, IsActiveMember, EstimatedSalary, Geography_Germany, Geography_Spain"
    )
    
    if uploaded_file is not None:
        st.markdown("### 📋 Preview")
        df = pd.read_csv(uploaded_file)
        st.dataframe(df.head(10), use_container_width=True)
        
        if st.button("🚀 Run Batch Prediction", use_container_width=True):
            try:
                headers = {}
                if st.session_state.api_key:
                    headers["X-API-Key"] = st.session_state.api_key
                
                # Convert CSV to JSON format
                records = df.to_dict(orient='records')
                
                with st.spinner("⏳ Processing predictions..."):
                    all_predictions = []
                    progress_bar = st.progress(0)
                    
                    for idx, record in enumerate(records):
                        try:
                            payload = {
                                "CreditScore": float(record.get("CreditScore", 0)),
                                "Age": float(record.get("Age", 0)),
                                "Tenure": float(record.get("Tenure", 0)),
                                "Balance": float(record.get("Balance", 0)),
                                "NumOfProducts": float(record.get("NumOfProducts", 1)),
                                "HasCrCard": float(record.get("HasCrCard", 0)),
                                "IsActiveMember": float(record.get("IsActiveMember", 0)),
                                "EstimatedSalary": float(record.get("EstimatedSalary", 0)),
                                "Geography_Germany": float(record.get("Geography_Germany", 0)),
                                "Geography_Spain": float(record.get("Geography_Spain", 0)),
                            }
                            
                            response = requests.post(
                                f"{st.session_state.backend_url}/predict",
                                json=payload,
                                headers=headers,
                                timeout=10
                            )
                            
                            if response.status_code == 200:
                                result = response.json()
                                all_predictions.append({
                                    **record,
                                    "Churn_Probability": result.get("churn_probability", 0),
                                    "Prediction": "Churn" if result.get("churn_prediction") == 1 else "No Churn"
                                })
                        except Exception as e:
                            st.warning(f"Row {idx} failed: {str(e)}")
                        
                        progress_bar.progress((idx + 1) / len(records))
                
                # Display results
                st.markdown("### 📊 Prediction Results")
                results_df = pd.DataFrame(all_predictions)
                st.dataframe(results_df, use_container_width=True)
                
                # Statistics
                st.markdown("### 📈 Statistics")
                col_stat1, col_stat2, col_stat3 = st.columns(3)
                
                with col_stat1:
                    st.metric(
                        "Total Records",
                        len(results_df)
                    )
                
                with col_stat2:
                    churn_count = len(results_df[results_df["Prediction"] == "Churn"])
                    st.metric(
                        "Predicted Churn",
                        churn_count,
                        f"{(churn_count/len(results_df)*100):.1f}%"
                    )
                
                with col_stat3:
                    avg_prob = results_df["Churn_Probability"].mean()
                    st.metric(
                        "Avg Churn Probability",
                        f"{avg_prob*100:.2f}%"
                    )
                
                # Download results
                csv = results_df.to_csv(index=False)
                st.download_button(
                    label="📥 Download Results as CSV",
                    data=csv,
                    file_name=f"churn_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv",
                    use_container_width=True
                )
            
            except Exception as e:
                st.error(f"❌ Batch prediction failed: {str(e)}")

# ============== TAB 3: MONITORING ==============
with tab3:
    st.markdown("## Model Monitoring")
    st.markdown("Monitor the health and performance of your ML model")
    
    col_health, col_drift = st.columns(2)
    
    with col_health:
        st.markdown("### 🏥 API Health Status")
        st.markdown("Check if your backend API is running and the model is loaded")
        
        if st.button("🔍 Check Health", key="health_btn", use_container_width=True):
            try:
                headers = {}
                if st.session_state.api_key:
                    headers["X-API-Key"] = st.session_state.api_key
                
                response = requests.get(
                    f"{st.session_state.backend_url}/health",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    health_data = response.json()
                    
                    st.markdown('<div class="success-card">', unsafe_allow_html=True)
                    st.markdown("#### ✅ API is Healthy")
                    
                    col_h1, col_h2 = st.columns(2)
                    with col_h1:
                        st.metric("Status", health_data.get("status", "unknown"))
                        st.metric("Model Loaded", "Yes" if health_data.get("model_loaded") else "No")
                    
                    st.markdown('</div>', unsafe_allow_html=True)
                    
                    if "metrics" in health_data:
                        st.markdown("#### Model Metrics")
                        metrics = health_data["metrics"]
                        col_m1, col_m2 = st.columns(2)
                        
                        with col_m1:
                            st.metric("Accuracy", f"{metrics.get('accuracy', 0):.4f}")
                            st.metric("Precision", f"{metrics.get('precision', 0):.4f}")
                        
                        with col_m2:
                            st.metric("Recall", f"{metrics.get('recall', 0):.4f}")
                            st.metric("ROC-AUC", f"{metrics.get('roc_auc', 0):.4f}")
                else:
                    st.markdown('<div class="error-card">', unsafe_allow_html=True)
                    st.markdown(f"#### ❌ Health Check Failed")
                    st.markdown(f"Status Code: {response.status_code}")
                    st.markdown('</div>', unsafe_allow_html=True)
            
            except Exception as e:
                st.error(f"❌ Error checking health: {str(e)}")
    
    with col_drift:
        st.markdown("### 📊 Data Drift Detection")
        st.markdown("Detect if the data distribution has changed")
        
        threshold = st.slider(
            "Drift Threshold",
            min_value=0.01,
            max_value=0.5,
            value=0.05,
            step=0.01,
            help="Threshold for detecting significant drift"
        )
        
        if st.button("🔍 Check Drift", key="drift_btn", use_container_width=True):
            try:
                headers = {}
                if st.session_state.api_key:
                    headers["X-API-Key"] = st.session_state.api_key
                
                response = requests.post(
                    f"{st.session_state.backend_url}/drift/check?threshold={threshold}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    drift_data = response.json()
                    
                    features_drifted = drift_data.get("features_drifted", 0)
                    features_analyzed = drift_data.get("features_analyzed", 1)
                    drift_percentage = (features_drifted / features_analyzed * 100) if features_analyzed > 0 else 0
                    
                    # Determine risk level
                    if drift_percentage >= 50:
                        risk_level = "HIGH"
                        color = "error"
                        emoji = "🔴"
                    elif drift_percentage >= 20:
                        risk_level = "MEDIUM"
                        color = "warning"
                        emoji = "🟠"
                    else:
                        risk_level = "LOW"
                        color = "success"
                        emoji = "🟢"
                    
                    # Display risk badge
                    if features_drifted > 0:
                        st.markdown(f'<div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; margin: 1rem 0;"><h3 style="margin: 0; color: #856404;">{emoji} {risk_level} Drift Detected ({drift_percentage:.1f}%)</h3></div>', unsafe_allow_html=True)
                    else:
                        st.markdown(f'<div style="background-color: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 1rem; margin: 1rem 0;"><h3 style="margin: 0; color: #155724;">{emoji} No Significant Drift</h3></div>', unsafe_allow_html=True)
                    
                    # Display metrics
                    col_drift1, col_drift2 = st.columns(2)
                    with col_drift1:
                        st.metric("Features Analyzed", features_analyzed)
                    with col_drift2:
                        st.metric("Features with Drift", features_drifted)
                else:
                    st.error(f"Error: {response.status_code} - {response.text}")
            
            except Exception as e:
                st.error(f"❌ Error checking drift: {str(e)}")
    
    # System info
    st.divider()
    st.markdown("### 📋 API Information")
    st.info("Backend API is running at: " + st.session_state.backend_url)

# Footer
st.divider()
st.markdown("""
    <div style="text-align: center; color: #888; font-size: 0.9rem; margin-top: 2rem;">
    Bank Churn Prediction System | Powered by Streamlit | Backend: Azure Container Apps
    </div>
    """, unsafe_allow_html=True)
