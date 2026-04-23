<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="React" width="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" alt="Python" width="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Flask-Dark.svg" alt="Flask" width="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TensorFlow-Dark.svg" alt="TensorFlow" width="40"/>
</div>

<h1 align="center">🌱 AgroGuard</h1>

<p align="center">
  <strong>An Intelligent Plant Disease Detection and Management System</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#machine-learning-engine">ML Engine</a> •
  <a href="#run-locally">Run Locally</a>
</p>

---

## 🌟 Overview

**AgroGuard** is a full-stack, AI-driven agricultural platform designed to help farmers and gardeners identify plant diseases early. Through advanced Deep Learning models and a seamless user interface, AgroGuard provides instant diagnoses and customized treatment suggestions simply by uploading a photo of a plant leaf.

*A final year project demonstrating proficiency in full-stack development, applied machine learning, and computer vision.*

*(Note: Add project screenshots below for visual appeal!)*
<div align="center">
  <img src="./images.jpeg" alt="AgroGuard Preview" height="300" style="border-radius: 10px;" />
</div>

## ✨ Features

- 📸 **Instant Image Analysis**: Upload a picture of a leaf for immediate processing.
- 🤖 **Deep Learning Model**: Uses a custom-trained TensorFlow/Keras model predicting diseases with high confidence.
- 💡 **Actionable Insights**: Get specifically tailored treatment suggestions to save the crops.
- ⚡ **Real-time API**: Lightning-fast inference via a robust Flask RESTful architecture.
- 🎨 **Beautiful UI**: Modern, responsive interface built with React, Vite, and TailwindCSS.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Requests**: Axios

### Backend
- **Framework**: Flask (Python)
- **CORS Management**: Flask-CORS
- **File Handling**: Secure multi-part upload processing

### Machine Learning
- **Core Library**: TensorFlow >=2.15.0
- **Image Processing**: OpenCV, NumPy
- **Data Engineering**: Pandas

## 🚀 Run Locally

Ensure you have [Node.js](https://nodejs.org/) and [Python 3.9+](https://www.python.org/downloads/) installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/agroguard.git
cd agroguard
```

### 2. Train the AI Model

Before running the backend, you must train the Machine Learning model. Our optimized training pipeline uses MobileNetV2 for blazing-fast CPU training (~10 mins for 5 epochs).

1. **Download Dataset**: Go to [Plant Disease Dataset on Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease).
2. **Extract Files**: Extract the dataset into `AgroGuard/ml_pipeline/archive/PlantVillage/` (you should see folders like `Tomato_Bacterial_spot` inside).
3. **Run Training Script**:
```bash
cd AgroGuard/ml_pipeline
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
python train.py
```
*This will automatically train the model and copy `agroguard_model.h5` and `class_indices.json` into your `backend/` folder!*

### 3. Set up the Backend API

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
python app.py
```
*The Backend API will be available at `http://localhost:5001`*

### 4. Set up the Frontend

Open a second terminal and execute:

```bash
cd AgroGuard/frontend
npm install
npm run dev
```
*Your React app will run locally on `http://localhost:5173`. Open this URL in your browser to start diagnosing!*

## 🧠 Machine Learning Engine

The core of AgroGuard relies on an optimized **MobileNetV2** convolutional neural network, fine-tuned to identify 15 different plant foliar conditions with high accuracy. 

Our pipeline (`ml_pipeline/`) handles:
- **Data Augmentation**: Dynamic resizing (128x128), rotation, shifts, and flips to create a robust model.
- **Fast Training**: Initial training with a frozen base, followed by an automatic fine-tuning callback if accuracy falls below a threshold.
- **Auto-Deployment**: Script cleanly exports the H5 model and JSON class indices directly to the backend.

---

<div align="center">
  <i>Developed with ❤️ for a sustainable future.</i>
</div>
