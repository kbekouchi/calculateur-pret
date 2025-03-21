from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)  # Activation de CORS pour permettre les requêtes depuis le frontend

@app.route('/calculate', methods=['POST'])
def calculate_loan():
    data = request.json
    
    # Récupération des données du formulaire
    principal = data.get('principal', 0)
    rate = data.get('rate', 0)
    duration = data.get('duration', 0)
    
    # Validation des données
    if not all([isinstance(principal, (int, float)), 
                isinstance(rate, (int, float)), 
                isinstance(duration, (int, float))]):
        return jsonify({"error": "Données invalides"}), 400
    
    if principal <= 0 or rate <= 0 or duration <= 0:
        return jsonify({"error": "Les valeurs doivent être positives"}), 400
    
    # Conversion du taux annuel en taux mensuel
    monthly_rate = rate / 100 / 12
    
    # Calcul de la mensualité (formule de l'amortissement constant)
    if monthly_rate == 0:  # Cas particulier : taux = 0
        monthly_payment = principal / duration
    else:
        monthly_payment = principal * monthly_rate * (1 + monthly_rate) ** duration / ((1 + monthly_rate) ** duration - 1)
    
    # Calcul du montant total et des intérêts
    total_payment = monthly_payment * duration
    total_interest = total_payment - principal
    
    return jsonify({
        "principal": principal,
        "monthly_payment": monthly_payment,
        "total_payment": total_payment,
        "total_interest": total_interest,
        "duration": duration,
        "rate": rate
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)