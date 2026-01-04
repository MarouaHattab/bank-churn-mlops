import React, { useState } from "react";
import { Zap, Settings } from "lucide-react";
import { PredictionTab } from "./components/PredictionTab";
import { BatchTab } from "./components/BatchTab";
import { MonitoringTab } from "./components/MonitoringTab";
import { SettingsModal } from "./components/SettingsModal";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState<
    "prediction" | "batch" | "monitoring"
  >("prediction");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_BACKEND_URL ||
      "https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io"
  );
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Bank Churn Prediction</h1>
                <p className="text-blue-100 text-sm">
                  ML-Powered Customer Churn Forecasting
                </p>
              </div>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { id: "prediction", label: "🔮 Single Prediction", icon: "🔮" },
            { id: "batch", label: "📊 Batch Prediction", icon: "📊" },
            { id: "monitoring", label: "📈 Monitoring", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-white text-gray-600 hover:shadow-md"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {activeTab === "prediction" && <PredictionTab />}
          {activeTab === "batch" && <BatchTab />}
          {activeTab === "monitoring" && <MonitoringTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Bank Churn Prediction System | Powered by React & MLOps | Backend:
            Azure Container Apps
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        backendUrl={backendUrl}
        apiKey={apiKey}
        onBackendUrlChange={setBackendUrl}
        onApiKeyChange={setApiKey}
      />
    </div>
  );
}

export default App;
