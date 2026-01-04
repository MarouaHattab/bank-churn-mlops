import React, { useState } from "react";
import { Loader, AlertCircle, CheckCircle, Activity } from "lucide-react";
import { checkHealth, checkDrift } from "../api/client";

export const MonitoringTab: React.FC = () => {
  const [healthLoading, setHealthLoading] = useState(false);
  const [driftLoading, setDriftLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [driftData, setDriftData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0.05);

  const handleCheckHealth = async () => {
    setHealthLoading(true);
    setError(null);

    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Error checking health"
      );
    } finally {
      setHealthLoading(false);
    }
  };

  const handleCheckDrift = async () => {
    setDriftLoading(true);
    setError(null);

    try {
      const data = await checkDrift(threshold);
      setDriftData(data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Error checking drift"
      );
    } finally {
      setDriftLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Model Monitoring</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Check */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            API Health Status
          </h3>

          <p className="text-gray-600 mb-6">
            Check if your backend API is running and the model is loaded
          </p>

          <button
            onClick={handleCheckHealth}
            disabled={healthLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {healthLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              "🏥 Check API Health"
            )}
          </button>

          {healthData && (
            <div className="mt-6 space-y-3">
              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  API is Healthy
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Status</div>
                  <div className="text-lg font-bold text-green-600">
                    {healthData.status}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Model Loaded</div>
                  <div className="text-lg font-bold text-green-600">
                    {healthData.model_loaded ? "✓ Yes" : "✗ No"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drift Detection */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Data Drift Detection
          </h3>

          <p className="text-gray-600 mb-4">
            Check for data drift between production and reference data
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drift Threshold
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">
              {threshold.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleCheckDrift}
            disabled={driftLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {driftLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "🔍 Check for Data Drift"
            )}
          </button>

          {driftData && (
            <div className="mt-6 space-y-3">
              {(() => {
                const driftPct =
                  (driftData.features_drifted / driftData.features_analyzed) *
                  100;
                const level =
                  driftPct > 50 ? "HIGH" : driftPct > 20 ? "MEDIUM" : "LOW";
                const bgColor =
                  level === "HIGH"
                    ? "bg-red-100 border-red-500 text-red-700"
                    : level === "MEDIUM"
                    ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                    : "bg-green-100 border-green-500 text-green-700";

                return (
                  <>
                    <div className={`border-l-4 p-4 rounded ${bgColor}`}>
                      <div className="font-semibold flex items-center gap-2">
                        {level === "HIGH" ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {level} Drift Detected ({driftPct.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">
                          Features Analyzed
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {driftData.features_analyzed}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs text-gray-600">
                          Features with Drift
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {driftData.features_drifted}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
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
    </div>
  );
};
