import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    principal: '',
    rate: '',
    duration: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  // Réinitialiser l'animation après le chargement initial
  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principal: parseFloat(formData.principal),
          rate: parseFloat(formData.rate),
          duration: parseInt(formData.duration)
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de la requête');
      }

      const data = await response.json();
      // Petit délai pour montrer l'animation de chargement
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 600);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const resetForm = () => {
    setFormData({
      principal: '',
      rate: '',
      duration: ''
    });
    setResult(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-title">
          <h1>Calculateur de Prêt</h1>
          <p className="subtitle">Simulez votre emprunt en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className={`loan-form ${showAnimation ? 'animate-form' : ''}`}>
          <div className="form-group">
            <label htmlFor="principal">Montant du prêt</label>
            <div className="input-with-icon">
              <input
                id="principal"
                type="number"
                name="principal"
                value={formData.principal}
                onChange={handleChange}
                required
                min="1"
                step="any"
                placeholder="Ex: 100000"
              />
              <span className="input-icon">€</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="rate">Taux d'intérêt annuel</label>
            <div className="input-with-icon">
              <input
                id="rate"
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                placeholder="Ex: 2.5"
              />
              <span className="input-icon">%</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="duration">Durée du prêt</label>
            <div className="input-with-icon">
              <input
                id="duration"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                placeholder="Ex: 240"
              />
              <span className="input-icon">mois</span>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Calcul en cours...
                </span>
              ) : 'Calculer'}
            </button>
            {result && (
              <button type="button" onClick={resetForm} className="reset-button">
                Réinitialiser
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Erreur: {error}
          </div>
        )}

        {result && (
          <div className="result-container">
            <h2>Résultats de votre simulation</h2>
            <div className="result-summary">
              <div className="result-summary-item">
                <span className="summary-label">Montant emprunté</span>
                <span className="summary-value primary">{formatCurrency(result.principal)}</span>
              </div>
              <div className="result-summary-item">
                <span className="summary-label">Durée</span>
                <span className="summary-value">{result.duration} mois ({(result.duration / 12).toFixed(1)} ans)</span>
              </div>
              <div className="result-summary-item">
                <span className="summary-label">Taux</span>
                <span className="summary-value">{result.rate.toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="result-details">
              <div className="result-item">
                <span>Mensualité</span>
                <span>{formatCurrency(result.monthly_payment)}</span>
              </div>
              <div className="result-item">
                <span>Montant total remboursé</span>
                <span>{formatCurrency(result.total_payment)}</span>
              </div>
              <div className="result-item highlight">
                <span>Coût total des intérêts</span>
                <span>{formatCurrency(result.total_interest)}</span>
              </div>
            </div>
            
            <div className="loan-chart">
              <div className="chart-label">Répartition du coût total</div>
              <div className="chart-container">
                <div 
                  className="chart-bar principal-bar" 
                  style={{width: `${(result.principal / result.total_payment) * 100}%`}}
                >
                  <span className="chart-value">Principal</span>
                </div>
                <div 
                  className="chart-bar interest-bar" 
                  style={{width: `${(result.total_interest / result.total_payment) * 100}%`}}
                >
                  <span className="chart-value">Intérêts</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal-color"></span>
                  <span>Principal: {((result.principal / result.total_payment) * 100).toFixed(1)}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest-color"></span>
                  <span>Intérêts: {((result.total_interest / result.total_payment) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <footer className="app-footer">
          <p>© 2025 Calculateur de Prêt | Tous droits réservés</p>
        </footer>
      </header>
    </div>
  );
}

export default App;