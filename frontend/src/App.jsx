import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  UserCheck, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  CreditCard, 
  MapPin, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle2
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
      setError("Erreur lors de la prédiction. Vérifiez la connexion à l'API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-['Outfit']">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col items-center mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ChurnInsight AI
            </h1>
          </motion.div>
          <p className="text-slate-400 max-w-2xl">
            Plateforme de surveillance prédictive des départs clients.
            Utilisez notre intelligence artificielle de pointe pour anticiper et prévenir la perte de clientèle.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Profil Client
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Score de Crédit</label>
                  <input 
                    name="CreditScore" type="number" value={formData.CreditScore} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Âge</label>
                  <input 
                    name="Age" type="number" value={formData.Age} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Géographie</label>
                  <select 
                    name="Geography" value={formData.Geography} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="France">France</option>
                    <option value="Germany">Allemagne</option>
                    <option value="Spain">Espagne</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Ancienneté (mois)</label>
                  <input 
                    name="Tenure" type="number" value={formData.Tenure} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Solde Compte</label>
                  <input 
                    name="Balance" type="number" value={formData.Balance} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Produits Active</label>
                  <input 
                    name="NumOfProducts" type="number" value={formData.NumOfProducts} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Carte de Crédit</label>
                  <select 
                    name="HasCrCard" value={formData.HasCrCard} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="1">Oui</option>
                    <option value="0">Non</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Membre Actif</label>
                  <select 
                    name="IsActiveMember" value={formData.IsActiveMember} onChange={handleChange}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="1">Oui</option>
                    <option value="0">Non</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Salaire Estimé ($)</label>
                <input 
                  name="EstimatedSalary" type="number" value={formData.EstimatedSalary} onChange={handleChange}
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5" />
                    Analyser le Risque
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Results */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {!result && !error && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500"
                >
                  <Activity className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-center">Prêt à analyser le comportement client.</p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-start gap-4"
                >
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-8 rounded-3xl border ${
                    result.risk_level === 'Low' ? 'border-emerald-500/30 bg-emerald-500/5' :
                    result.risk_level === 'Medium' ? 'border-amber-500/30 bg-amber-500/5' :
                    'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">
                        Analyse du Risque
                      </h3>
                      <div className="text-3xl font-bold">
                        {result.risk_level === 'Low' ? (
                          <span className="text-emerald-400">Niveau Faible</span>
                        ) : result.risk_level === 'Medium' ? (
                          <span className="text-amber-400">Niveau Modéré</span>
                        ) : (
                          <span className="text-rose-400">Niveau Critique</span>
                        )}
                      </div>
                    </div>
                    {result.risk_level === 'Low' ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    ) : (
                      <ShieldAlert className={`w-10 h-10 ${result.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`} />
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2 text-sm font-medium">
                        <span>Probabilité de Désengagement</span>
                        <span className={
                          result.risk_level === 'Low' ? 'text-emerald-400' :
                          result.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                        }>
                          {(result.churn_probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.churn_probability * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            result.risk_level === 'Low' ? 'bg-emerald-400' :
                            result.risk_level === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Prédiction</div>
                        <div className="text-lg font-bold">
                          {result.prediction === 1 ? 'Partant' : 'Fidèle'}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Action Recommandée</div>
                        <div className="text-lg font-bold">
                          {result.risk_level === 'Low' ? 'Rétention standard' :
                           result.risk_level === 'Medium' ? 'Offre personnalisée' : 'Contact Prioritaire'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<TrendingDown className="w-4 h-4" />} title="Fidélisation" value="+12%" />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} title="Précision" value="94.2%" />
              <StatCard icon={<MapPin className="w-4 h-4" />} title="Zone" value="Europe" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
      <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-slate-500 uppercase font-bold">{title}</div>
        <div className="text-sm font-bold text-slate-200">{value}</div>
      </div>
    </div>
  );
}

export default App;
