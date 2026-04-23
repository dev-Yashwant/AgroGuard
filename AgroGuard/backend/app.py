import os
import json
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# ─── Configuration ───────────────────────────────────────────────────────────
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'agroguard_model.h5')
CLASS_INDICES_PATH = os.path.join(os.path.dirname(__file__), 'class_indices.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
IMG_SIZE = (128, 128)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ─── Treatment Database ─────────────────────────────────────────────────────
TREATMENTS = {
    # ── Tomato ──
    'Tomato_Bacterial_spot': 'Apply copper-based bactericides. Remove and destroy infected plant parts. Avoid overhead irrigation and ensure proper spacing.',
    'Tomato_Early_blight': 'Apply fungicide (chlorothalonil or mancozeb). Remove lower infected leaves. Mulch to prevent soil splash. Practice crop rotation.',
    'Tomato_Late_blight': 'Apply systemic fungicide immediately. Remove and destroy all infected plants. Improve air circulation. Avoid watering late in the day.',
    'Tomato_Leaf_Mold': 'Improve ventilation in greenhouses. Apply fungicides like mancozeb. Remove infected leaves. Reduce humidity levels.',
    'Tomato_Septoria_leaf_spot': 'Apply chlorothalonil or copper-based fungicide. Remove infected lower leaves. Mulch around plants. Avoid overhead watering.',
    'Tomato_Spider_mites_Two_spotted_spider_mite': 'Spray with insecticidal soap or neem oil. Increase humidity around plants. Introduce predatory mites. Remove heavily infested leaves.',
    'Tomato__Target_Spot': 'Apply fungicides containing chlorothalonil. Practice crop rotation. Remove plant debris. Ensure adequate plant spacing.',
    'Tomato__Tomato_YellowLeaf__Curl_Virus': 'Control whitefly population with insecticide. Remove and destroy infected plants immediately. Use resistant varieties. Install reflective mulch.',
    'Tomato__Tomato_mosaic_virus': 'Remove and destroy infected plants. Disinfect tools with 10% bleach. Wash hands between plants. Plant resistant varieties next season.',
    'Tomato_healthy': 'Your tomato plant looks healthy! Continue regular watering, proper fertilization, and monitoring for early signs of disease.',
    # ── Potato ──
    'Potato___Early_blight': 'Apply fungicide (chlorothalonil). Remove lower infected leaves. Practice 2-3 year crop rotation. Maintain adequate soil fertility.',
    'Potato___Late_blight': 'Apply systemic fungicide (metalaxyl). Destroy all infected plant debris. Improve drainage. Avoid planting near previously infected fields.',
    'Potato___healthy': 'Your potato plant is in great shape! Maintain consistent watering and watch for common pests like Colorado potato beetle.',
    # ── Pepper ──
    'Pepper__bell___Bacterial_spot': 'Apply copper hydroxide sprays. Remove infected plant material. Use certified disease-free seeds. Rotate crops every 2-3 years.',
    'Pepper__bell___healthy': 'Your bell pepper plant is thriving! Keep up with regular fertilization and consistent watering schedules.',
}


# Default treatment for any unknown class
DEFAULT_TREATMENT = 'Monitor the plant closely. Consult a local agricultural extension office for a professional diagnosis with a physical sample.'

# ─── Model Loading ───────────────────────────────────────────────────────────
model = None
class_indices = None

def load_model():
    """Lazy-load the TensorFlow model and class indices."""
    global model, class_indices

    if model is not None:
        return True

    if not os.path.exists(MODEL_PATH):
        print(f"⚠️  Model file not found at {MODEL_PATH}")
        print("   Run the ML pipeline first: cd ml_pipeline && python train.py")
        return False

    try:
        import tensorflow as tf
        print(f"🧠 Loading model from {MODEL_PATH}...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False

    # Load class index mapping
    if os.path.exists(CLASS_INDICES_PATH):
        with open(CLASS_INDICES_PATH, 'r') as f:
            # class_indices is {class_name: index}, we need {index: class_name}
            raw = json.load(f)
            class_indices = {int(v): k for k, v in raw.items()}
        print(f"📋 Loaded {len(class_indices)} class labels")
    else:
        print(f"⚠️  class_indices.json not found at {CLASS_INDICES_PATH}")
        print("   The model will return numeric class indices instead of names.")
        class_indices = None

    return True

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Load and preprocess an image for model inference."""
    import cv2
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

# ─── Routes ──────────────────────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    model_loaded = model is not None
    model_exists = os.path.exists(MODEL_PATH)
    return jsonify({
        'status': 'running',
        'message': 'AgroGuard API is up!',
        'model_loaded': model_loaded,
        'model_file_exists': model_exists,
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Accept a plant leaf image and return disease prediction.
    Expects multipart/form-data with a 'file' field.
    """
    # ── Validate request ──
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': f'File type not allowed. Use: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

    # ── Save uploaded file ──
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # ── Attempt real inference ──
    if not load_model():
        # Model not available — return informative placeholder
        os.remove(filepath)
        return jsonify({
            'disease': 'Model Not Available',
            'confidence': 0,
            'treatment': 'The ML model (agroguard_model.h5) has not been trained yet. '
                         'Please run the training pipeline first: cd ml_pipeline && python train.py',
            'model_available': False,
        })

    try:
        img = preprocess_image(filepath)
        predictions = model.predict(img, verbose=0)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100

        # Map index to class name
        if class_indices and predicted_index in class_indices:
            disease_name = class_indices[predicted_index]
        else:
            disease_name = f'Class_{predicted_index}'

        # Look up treatment
        treatment = TREATMENTS.get(disease_name, DEFAULT_TREATMENT)

        # Format the disease name for display
        display_name = disease_name.replace('_', ' ')

        result = {
            'disease': display_name,
            'confidence': round(confidence, 2),
            'treatment': treatment,
            'model_available': True,
        }

    except Exception as e:
        result = {
            'disease': 'Prediction Error',
            'confidence': 0,
            'treatment': f'An error occurred during analysis: {str(e)}',
            'model_available': True,
        }
    finally:
        # Clean up uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)

    return jsonify(result)

@app.route('/diseases', methods=['GET'])
def list_diseases():
    """Return all known diseases and their treatments (for the Agro-Wiki page)."""
    diseases = []
    for name, treatment in TREATMENTS.items():
        display_name = name.replace('_', ' ')
        # Determine the crop from the disease name
        crop = name.split('_')[0]
        is_healthy = 'Healthy' in name
        diseases.append({
            'id': name,
            'name': display_name,
            'crop': crop,
            'treatment': treatment,
            'is_healthy': is_healthy,
        })
    return jsonify({'diseases': diseases, 'count': len(diseases)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
