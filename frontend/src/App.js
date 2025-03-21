import React, { useState } from 'react';
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
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculateur de Prêt</h1>
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label>Montant du prêt (€)</label>
            <input
              type="number"
              name="principal"
              value={formData.principal}
              onChange={handleChange}
              required
              min="1"
              step="any"
            />
          </div>
          <div className="form-group">
            <label>Taux d'intérêt annuel (%)</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Durée (mois)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Calcul en cours...' : 'Calculer'}
          </button>
        </form>

        {error && <div className="error-message">Erreur: {error}</div>}

        {result && (
          <div className="result-container">
            <h2>Résultats du calcul</h2>
            <div className="result-item">
              <span>Montant emprunté:</span>
              <span>{result.principal.toFixed(2)} €</span>
            </div>
            <div className="result-item">
              <span>Mensualité:</span>
              <span>{result.monthly_payment.toFixed(2)} €</span>
            </div>
            <div className="result-item">
              <span>Montant total remboursé:</span>
              <span>{result.total_payment.toFixed(2)} €</span>
            </div>
            <div className="result-item highlight">
              <span>Coût total des intérêts:</span>
              <span>{result.total_interest.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;