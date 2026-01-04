import React, { useState } from "react";
import { Upload, Download, Loader, AlertCircle } from "lucide-react";
import { predictChurn, CustomerFeatures } from "../api/client";
import Papa from "papaparse";

export const BatchTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults([]);
    }
  };

  const handlePredictBatch = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const predictions = [];

            for (let i = 0; i < results.data.length; i++) {
              const row = results.data[i] as any;

              const features: CustomerFeatures = {
                CreditScore: parseInt(row.CreditScore) || 0,
                Age: parseInt(row.Age) || 0,
                Tenure: parseInt(row.Tenure) || 0,
                Balance: parseFloat(row.Balance) || 0,
                NumOfProducts: parseInt(row.NumOfProducts) || 1,
                HasCrCard: parseInt(row.HasCrCard) || 0,
                IsActiveMember: parseInt(row.IsActiveMember) || 0,
                EstimatedSalary: parseFloat(row.EstimatedSalary) || 0,
                Geography_Germany: parseInt(row.Geography_Germany) || 0,
                Geography_Spain: parseInt(row.Geography_Spain) || 0,
              };

              try {
                const pred = await predictChurn(features);
                predictions.push({
                  ...row,
                  Churn_Probability: pred.churn_probability,
                  Prediction:
                    pred.prediction === 1 ? "Will Churn" : "Will Not Churn",
                  Risk_Level: pred.risk_level,
                });
              } catch (err) {
                predictions.push({
                  ...row,
                  Error: "Prediction failed",
                });
              }
            }

            setResults(predictions);

            // Calculate statistics
            const validPredictions = predictions.filter((p) => !p.Error);
            if (validPredictions.length > 0) {
              const churnCount = validPredictions.filter(
                (p) => p.Prediction === "Will Churn"
              ).length;
              const avgProbability =
                validPredictions.reduce(
                  (sum, p) => sum + p.Churn_Probability,
                  0
                ) / validPredictions.length;
              const highRiskCount = validPredictions.filter(
                (p) => p.Risk_Level === "High"
              ).length;

              setStats({
                total: validPredictions.length,
                churn: churnCount,
                avgProbability,
                highRisk: highRiskCount,
              });
            }
          } catch (err: any) {
            setError(err.message || "Error processing predictions");
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          setError(`CSV parsing error: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (results.length === 0) return;

    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Batch Prediction</h2>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload CSV File
          </h3>
          <p className="text-gray-600 mb-4">
            Select a CSV file with customer data to make predictions for
            multiple customers
          </p>

          <label className="inline-block">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
              Choose File
            </span>
          </label>

          {file && (
            <p className="text-green-600 mt-4 font-medium">
              ✓ File selected: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handlePredictBatch}
          disabled={!file || loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "🔮 Predict for All Customers"
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-sm text-gray-600">Total Customers</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.total}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-sm text-gray-600">At Risk</div>
            <div className="text-3xl font-bold text-red-600">{stats.churn}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-sm text-gray-600">Avg Probability</div>
            <div className="text-3xl font-bold text-purple-600">
              {(stats.avgProbability * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-sm text-gray-600">High Risk</div>
            <div className="text-3xl font-bold text-orange-600">
              {stats.highRisk}
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Prediction Results
            </h3>
            <button
              onClick={downloadResults}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Results
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left font-semibold">
                    Credit Score
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Age</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Churn Probability
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Prediction
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 10).map((result, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{result.CreditScore}</td>
                    <td className="px-4 py-2">{result.Age}</td>
                    <td className="px-4 py-2">
                      {result.Error ? (
                        <span className="text-red-600">Error</span>
                      ) : (
                        `${(result.Churn_Probability * 100).toFixed(2)}%`
                      )}
                    </td>
                    <td className="px-4 py-2">{result.Prediction}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          result.Risk_Level === "High"
                            ? "bg-red-600"
                            : result.Risk_Level === "Medium"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                      >
                        {result.Risk_Level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.length > 10 && (
            <p className="text-gray-600 text-sm mt-4">
              Showing 10 of {results.length} results. Download CSV to see all.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
