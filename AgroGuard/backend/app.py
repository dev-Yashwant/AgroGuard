from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Basic routes for AgroGuard Backend
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'running', 'message': 'AgroGuard API is up!'})

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    
    # Placeholder for Deep Learning inference
    return jsonify({
        'disease': 'Healthy', 
        'confidence': 98.5,
        'treatment': 'Continue regular watering and maintenance.'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
