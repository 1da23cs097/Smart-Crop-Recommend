from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from crop_details import CROP_DETAILS, LABEL_MAPPING
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load trained model
MODEL_PATH = os.path.join('models', 'crop_model.pkl')
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Crop Recommendation API',
        'status': 'running',
        'endpoints': {
            '/predict': 'POST - Get crop recommendations',
            '/health': 'GET - Check API health',
            '/crops': 'GET - Get all crops info'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/crops', methods=['GET'])
def get_all_crops():
    return jsonify({
        'success': True,
        'crops': list(CROP_DETAILS.keys()),
        'total': len(CROP_DETAILS)
    })

@app.route('/predict', methods=['POST'])
def predict_crops():
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        # Get input data from request
        data = request.json
        
        # Validate input
        required_fields = ['N', 'P', 'K', 'temp', 'hum', 'ph', 'rain']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Prepare features for prediction
        features = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temp']),
            float(data['hum']),
            float(data['ph']),
            float(data['rain'])
        ]])
        
        # Get prediction probabilities
        probabilities = model.predict_proba(features)[0]
        crops = model.classes_
        
        # Sort by probability and get top 6
        top_indices = np.argsort(probabilities)[-6:][::-1]
        
        recommendations = []
        for idx in top_indices:
            crop_label = crops[idx]
            crop_key = LABEL_MAPPING.get(crop_label, crop_label)
            
            if crop_key in CROP_DETAILS:
                crop_info = CROP_DETAILS[crop_key].copy()
                crop_info['suitability'] = round(float(probabilities[idx] * 100), 2)
                recommendations.append(crop_info)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'input_parameters': {
                'N': data['N'],
                'P': data['P'],
                'K': data['K'],
                'temperature': data['temp'],
                'humidity': data['hum'],
                'ph': data['ph'],
                'rainfall': data['rain']
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)