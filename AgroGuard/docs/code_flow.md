# AgroGuard System Code Flow

This document outlines the end-to-end data flow of the AgroGuard Application—from the moment a user uploads a plant image on the frontend, to its processing by the backend Machine Learning API.

## 1. The Frontend (React + Vite)
The user interface is built as a Single Page Application (SPA) using React.

### Step 1: User Interaction (`App.jsx`)
- The farmer accesses the web dashboard.
- A drag-and-drop feature (wrapped inside a `<input type="file" />`) intercepts the selected plant image.
- React updates the state variable `file` with the image metadata, and immediately enables the "Run Diagnostics" button.

### Step 2: Hitting the API
- When the user clicks **Run Diagnostics**, the frontend packages the image inside a `FormData` object (since we are sending binary data over HTTP).
- We use the `axios` library to fire a POST request.
- **Environment Variables**: To keep the code professional and deployment-ready, we fetch the Backend URL securely via `import.meta.env.VITE_API_URL` (which points to `http://localhost:5001` locally, but can be a remote server URL in production).

## 2. The Backend (Python Flask + Deep Learning)
The backend acts as the brain behind the diagnostics.

### Step 3: API Request Routing (`app.py`)
- Flask is constantly listening on port `5001`.
- It catches the `POST /predict` request.
- The route validates if an image actually exists in the request. If missing, it immediately throws a `400 Bad Request` error.

### Step 4: Machine Learning Inference (To Be Connected)
- In the future, the backend will load our trained ResNet50 model (`agroguard_model.h5`).
- The image will be processed (resized to `224x224`, normalized to pixel values `0-1`) by OpenCV or Keras preprocessing utilities.
- It will then pass through the Convolutional Neural Network (CNN) to calculate probabilities for all trained crop diseases.

### Step 5: JSON Response
- Once the prediction is made, Flask serializes the data into JSON.
- It sends back keys like:
  - `disease`: Name of the malady.
  - `confidence`: Percentage probability of accuracy.
  - `treatment`: Immediate AI-driven steps the farmer should take.

## 3. Rendering The Results
### Step 6: UI Update
- Back on the frontend, `axios` awaits the JSON response.
- React immediately consumes the JSON data updating the `prediction` state variable.
- The UI gracefully switches out the placeholder graphic with the vivid green Diagnosis Box containing the confidence score and treatment recommendation!
