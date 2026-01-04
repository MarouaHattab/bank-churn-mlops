import React, { useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { predictChurn, CustomerFeatures } from "../api/client";
import { PredictionCard } from "./PredictionCard";

export const PredictionTab: React.FC = () => {
  const [features, setFeatures] = useState<CustomerFeatures>({
    CreditScore: 650,
    Age: 35,
    Tenure: 5,
    Balance: 100000,
    NumOfProducts: 2,
    HasCrCard: 1,
    IsActiveMember: 1,
    EstimatedSalary: 75000,
    Geography_Germany: 0,
    Geography_Spain: 0,
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CustomerFeatures, value: any) => {
    setFeatures((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictChurn(features);
      setPrediction(result);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Single Customer Prediction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Customer Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Score
                </label>
                <input
                  type="number"
                  value={features.CreditScore}
                  onChange={(e) =>
                    handleInputChange("CreditScore", e.target.value)
                  }
                  min="0"
                  max="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0-1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={features.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                  min="18"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={features.Tenure}
                  onChange={(e) => handleInputChange("Tenure", e.target.value)}
                  min="0"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Balance ($)
                </label>
                <input
                  type="number"
                  value={features.Balance}
                  onChange={(e) => handleInputChange("Balance", e.target.value)}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Product & Activity */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Product & Activity Info
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Products
                </label>
                <select
                  value={features.NumOfProducts}
                  onChange={(e) =>
                    handleInputChange("NumOfProducts", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Annual Salary ($)
                </label>
                <input
                  type="number"
                  value={features.EstimatedSalary}
                  onChange={(e) =>
                    handleInputChange("EstimatedSalary", e.target.value)
                  }
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Has Credit Card
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={features.HasCrCard === 1}
                      onChange={() => handleInputChange("HasCrCard", 1)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={features.HasCrCard === 0}
                      onChange={() => handleInputChange("HasCrCard", 0)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active Member
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={features.IsActiveMember === 1}
                      onChange={() => handleInputChange("IsActiveMember", 1)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={features.IsActiveMember === 0}
                      onChange={() => handleInputChange("IsActiveMember", 0)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geography */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Geography
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Germany", "Spain", "France"].map((country) => (
              <label
                key={country}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="geography"
                  checked={
                    (country === "Germany" &&
                      features.Geography_Germany === 1) ||
                    (country === "Spain" && features.Geography_Spain === 1) ||
                    (country === "France" &&
                      features.Geography_Germany === 0 &&
                      features.Geography_Spain === 0)
                  }
                  onChange={() => {
                    if (country === "Germany") {
                      setFeatures((prev) => ({
                        ...prev,
                        Geography_Germany: 1,
                        Geography_Spain: 0,
                      }));
                    } else if (country === "Spain") {
                      setFeatures((prev) => ({
                        ...prev,
                        Geography_Germany: 0,
                        Geography_Spain: 1,
                      }));
                    } else {
                      setFeatures((prev) => ({
                        ...prev,
                        Geography_Germany: 0,
                        Geography_Spain: 0,
                      }));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  {country}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Predicting...
            </>
          ) : (
            "🔮 Predict Churn"
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <PredictionCard
          probability={prediction.churn_probability}
          prediction={prediction.prediction}
          riskLevel={prediction.risk_level}
        />
      )}
    </div>
  );
};
