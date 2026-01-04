import React from "react";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

interface PredictionCardProps {
  probability: number;
  prediction: number;
  riskLevel: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  probability,
  prediction,
  riskLevel,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-100 border-red-300 text-red-800";
      case "Medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "Low":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getRiskIcon = (risk: string) => {
    if (risk === "Low") return <CheckCircle className="w-5 h-5" />;
    if (risk === "High") return <AlertCircle className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
        <div className="text-sm text-gray-600 mb-2">Churn Probability</div>
        <div className="text-4xl font-bold text-blue-600">
          {(probability * 100).toFixed(2)}%
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-purple-200">
        <div className="text-sm text-gray-600 mb-2">Prediction</div>
        <div className="text-2xl font-bold text-purple-600">
          {prediction === 1 ? "⚠️ Will Churn" : "✅ Will Stay"}
        </div>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg border-2 flex items-center gap-3 ${getRiskColor(
          riskLevel
        )}`}
      >
        {getRiskIcon(riskLevel)}
        <div>
          <div className="text-sm opacity-75">Risk Level</div>
          <div className="text-2xl font-bold">{riskLevel}</div>
        </div>
      </div>
    </div>
  );
};
