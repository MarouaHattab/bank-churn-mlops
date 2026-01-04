import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  UserCheck, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  Database,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io";

function App() {
  const [formData, setFormData] = useState({
    CreditScore: 650,
    Age: 35,
    Tenure: 5,
    Balance: 50000,
    NumOfProducts: 2,
    HasCrCard: 1,
    IsActiveMember: 1,
    EstimatedSalary: 75000,
    Geography: 'France'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [driftLoading, setDriftLoading] = useState(false);
  const [driftResult, setDriftResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      ...formData,
      CreditScore: parseInt(formData.CreditScore),
      Age: parseInt(formData.Age),
      Tenure: parseInt(formData.Tenure),
      Balance: parseFloat(formData.Balance),
      NumOfProducts: parseInt(formData.NumOfProducts),
      HasCrCard: parseInt(formData.HasCrCard),
      IsActiveMember: parseInt(formData.IsActiveMember),
      EstimatedSalary: parseFloat(formData.EstimatedSalary),
      Geography_Germany: formData.Geography === 'Germany' ? 1 : 0,
      Geography_Spain: formData.Geography === 'Spain' ? 1 : 0
    };

    try {
      const response = await axios.post(`${API_URL}/predict`, payload);
      setResult(response.data);
    } catch (err) {
      setError("Le service est temporairement indisponible. Vérifiez votre connexion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDriftCheck = async () => {
    setDriftLoading(true);
    try {
      const response = await axios.post(`${API_URL}/drift/check?threshold=0.05`);
      setDriftResult(response.data);
    } catch (err) {
      alert("Erreur technique lors de l'analyse.");
    } finally {
      setDriftLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e6edf3] p-6 lg:p-12 font-['Outfit'] antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Simpler & More Professional */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ChurnInsight <span className="text-indigo-400">Pro</span></h1>
          </div>
          <p className="text-slate-400 text-sm max-w-lg">
            Système expert d'analyse de rétention client propulsé par Machine Learning. 
            Précision et monitoring en temps réel.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Side: Input Form (7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Données Client</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Score de Crédit" name="CreditScore" type="number" value={formData.CreditScore} onChange={handleChange} />
                  <InputField label="Âge" name="Age" type="number" value={formData.Age} onChange={handleChange} />
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-slate-400">Géographie</label>
                    <select name="Geography" value={formData.Geography} onChange={handleChange}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors">
                      <option value="France">France</option>
                      <option value="Germany">Allemagne</option>
                      <option value="Spain">Espagne</option>
                    </select>
                  </div>

                  <InputField label="Ancienneté (mois)" name="Tenure" type="number" value={formData.Tenure} onChange={handleChange} />
                  <InputField label="Solde ($)" name="Balance" type="number" value={formData.Balance} onChange={handleChange} />
                  <InputField label="Produits" name="NumOfProducts" type="number" value={formData.NumOfProducts} onChange={handleChange} />

                  <SelectField label="Carte de Crédit" name="HasCrCard" value={formData.HasCrCard} onChange={handleChange} />
                  <SelectField label="Membre Actif" name="IsActiveMember" value={formData.IsActiveMember} onChange={handleChange} />
                </div>

                <InputField label="Salaire Estimé ($)" name="EstimatedSalary" type="number" value={formData.EstimatedSalary} onChange={handleChange} />

                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Analyser le Profil <ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Results (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {!result && !error && !loading && (
                <div className="bg-[#161b22]/50 border-2 border-dashed border-[#30363d] rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 text-center">
                  <Info className="w-8 h-8 mb-4 opacity-30" />
                  <p className="text-sm font-medium">En attente de données...</p>
                </div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl border p-8 shadow-xl ${
                    result.risk_level === 'Low' ? 'bg-[#0f1b15] border-emerald-500/20' :
                    result.risk_level === 'Medium' ? 'bg-[#1b1a0f] border-amber-500/20' :
                    'bg-[#1b0f0f] border-rose-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Diagnostic</span>
                      <h3 className={`text-2xl font-bold ${
                        result.risk_level === 'Low' ? 'text-emerald-400' :
                        result.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {result.risk_level === 'Low' ? 'Risque Faible' : 
                         result.risk_level === 'Medium' ? 'Risque Modéré' : 'Risque Critique'}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Probabilité</span>
                        <span className="font-mono font-bold">{(result.churn_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${result.churn_probability * 100}%` }}
                          className={`h-full rounded-full ${
                            result.risk_level === 'Low' ? 'bg-emerald-500' :
                            result.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex flex-col gap-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Prédiction</span>
                        <span className="font-semibold text-slate-200">{result.prediction === 1 ? 'Chute probable' : 'Fidélité attendue'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Action</span>
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 text-xs font-medium">
                          {result.risk_level === 'Low' ? 'Observation' : 'Priorité Rétention'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Data Drift Section - Better Integration */}
        <section className="border-t border-[#30363d] pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Surveillance des Données</h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md">Détectez tout changement statistique dans le comportement des clients avant que le modèle ne perde en précision.</p>
            </div>
            <button 
              onClick={handleDriftCheck} disabled={driftLoading}
              className="bg-[#161b22] hover:bg-[#1d232c] border border-[#30363d] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3">
              {driftLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
              Lancer l'audit de Drift
            </button>
          </div>

          <AnimatePresence>
            {driftResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex items-center gap-6">
                  <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Qualité de Données</div>
                    <div className="text-xl font-bold">{driftResult.features_drifted === 0 ? 'Excellente' : 'Altérée'}</div>
                  </div>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex items-center gap-6">
                  <div className={`p-4 rounded-xl ${driftResult.features_drifted === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Score de Drift</div>
                    <div className="text-xl font-bold">{driftResult.features_drifted} feature(s) déviée(s)</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="mt-24 pb-12 text-center text-slate-600 text-xs">
          <p>© 2026 ChurnInsight AI Engine — Terminal de Monitoring ML v2.0</p>
        </footer>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-slate-400">{label}</label>
      <input 
        {...props}
        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-slate-400">{label}</label>
      <select name={name} value={value} onChange={onChange}
        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors">
        <option value="1">Oui</option>
        <option value="0">Non</option>
      </select>
    </div>
  );
}

export default App;
