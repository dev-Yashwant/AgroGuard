import os
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from dataset_prep import get_data_generators

def build_model(num_classes):
    """
    Builds the ResNet50 Transfer Learning Architecture
    """
    print("Loading Base ResNet50 Model...")
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False

    print("Attaching Custom Classification Head...")
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    
    print("Compiling Model...")
    model.compile(optimizer=Adam(learning_rate=0.0001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    
    return model

if __name__ == '__main__':
    dataset_dir = 'dataset/plantvillage' # placeholder expected directory
    if not os.path.exists(dataset_dir):
        print(f"Warning: Dataset directory '{dataset_dir}' not found. Please download PlantVillage Dataset.")
        print("Once downloaded, place it in 'ml_pipeline/dataset/plantvillage/' and re-run.")
    else:
        # Load Data (The Flashcards)
        print("🔍 STEP 1: Loading the image dataset (our 'flashcards')...")
        train_gen, val_gen = get_data_generators(dataset_dir)
        num_classes = len(train_gen.class_indices)
        print(f"✅ Found {num_classes} different types of plant diseases/healthy leaves to learn!")
        
        # Build Model (The Brain)
        print("\n🧠 STEP 2: Building the ResNet50 Neural Network (our 'brain')...")
        model = build_model(num_classes)
        
        # Train Model (The Studying)
        print("\n📚 STEP 3: Starting the training process. The AI is now studying the images...")
        print("This may take some time depending on your computer's speed.")
        history = model.fit(
            train_gen,
            epochs=5, # Reduced from 10 to 5 for testing
            validation_data=val_gen
        )
        
        # Save Model (The Final Exam)
        print("\n🎓 STEP 4: Training Complete! Saving the intelligent model...")
        model.save('agroguard_model.h5')
        print("🎉 SUCCESS! Saved as 'agroguard_model.h5'. You can now plug this brain into the backend!")
