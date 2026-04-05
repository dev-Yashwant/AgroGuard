# AgroGuard Development Guide

Welcome to the AgroGuard codebase. This guide details how to develop and build the project step-by-step.

## Project Structure
- `backend/`: Contains the Flask API and backend logic.
- `frontend/`: Contains the React.js + Vite UI for the farmers.
- `ml_pipeline/`: Contains scripts for dataset pre-processing and model training (ResNet/Inception).
- `docs/`: System documentation (like this one!).

## 1. Setting up the Backend
The backend utilizes Python Flask to serve the Deep Learning predictions and communicate with the MongoDB database.

**Pre-requisites:**
- Python 3.x
- `pip`

**Setup Steps:**
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate
pip install flask numpy flask-cors
python app.py
\`\`\`
*(The server will start at http://localhost:5000)*

## 2. Setting up the Frontend
The frontend uses React and Tailwind CSS for a modern, responsive user experience. It uses Vite as the build tool.

**Pre-requisites:**
- Node.js (v18+)
- `npm`

**Setup Steps:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(The server will start at http://localhost:5173)*

## 3. Machine Learning Pipeline
The ML Pipeline uses TensorFlow and Keras to train a transfer-learning model (ResNet50) on the PlantVillage dataset.

**Pre-requisites:**
- Python 3.x
- A suitable GPU (optional but recommended for faster training)

**Setup & Training Steps:**
1. Download a dataset like PlantVillage and place it at `AgroGuard/ml_pipeline/dataset/plantvillage/`
2. Install the necessary machine learning libraries:
\`\`\`bash
cd ml_pipeline
pip install -r requirements.txt
\`\`\`
3. Run the training script:
\`\`\`bash
python train.py
\`\`\`
This will extract images, execute data augmentation on-the-fly via `dataset_prep.py`, and start training the ResNet50 model. Once finished, it will output a `agroguard_model.h5` file which you will move to the `backend/` for the prediction engine.

## 4. Current Progress
- [x] Initial Scaffolding
- [x] Frontend Setup (React + Tailwind config)
- [x] Base UI Implementation (Drag-and-Drop Image, Simulator UI)
- [x] Backend Setup (Basic Flask App)
- [ ] Connect Backend to Frontend (Axios)
- [ ] MongoDB Setup
- [ ] Transfer Learning CNN Model Development
