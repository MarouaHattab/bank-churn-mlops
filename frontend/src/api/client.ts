import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io";
const API_KEY = import.meta.env.VITE_API_KEY || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  },
});

export interface CustomerFeatures {
  CreditScore: number;
  Age: number;
  Tenure: number;
  Balance: number;
  NumOfProducts: number;
  HasCrCard: number;
  IsActiveMember: number;
  EstimatedSalary: number;
  Geography_Germany: number;
  Geography_Spain: number;
}

export interface PredictionResponse {
  churn_probability: number;
  prediction: number;
  risk_level: string;
}

export const predictChurn = async (
  features: CustomerFeatures
): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>("/predict", features);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export const checkDrift = async (threshold: number = 0.05) => {
  const response = await api.post("/drift/check", null, {
    params: { threshold },
  });
  return response.data;
};

export default api;
