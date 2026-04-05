import os
import cv2
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def get_data_generators(data_dir, img_size=(224, 224), batch_size=32):
    """
    Creates training and validation data generators with data augmentation.
    """
    print(f"Initializing Data Generators for directory: {data_dir}")
    
    # 1. Data Augmentation for training set
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # 80-20 split
    )

    print("Loading Training data...")
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='training'
    )

    print("Loading Validation data...")
    validation_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation'
    )

    return train_generator, validation_generator

if __name__ == '__main__':
    # For testing the prep script independently
    # Example: python dataset_prep.py
    print("Dataset Prep Module Loaded Successfully.")
