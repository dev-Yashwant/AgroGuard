import os
import json
import shutil
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

# ─── Paths ────────────────────────────────────────────────────────────────────
DATASET_DIR = os.path.join(os.path.dirname(__file__), 'archive', 'PlantVillage')
MODEL_OUTPUT = 'agroguard_model.h5'
CLASS_INDICES_OUTPUT = 'class_indices.json'
BACKEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend')

# ─── Optimized Settings for CPU ──────────────────────────────────────────────
IMG_SIZE = (128, 128)      # Smaller than 224 = much faster
BATCH_SIZE = 64            # Larger batch = fewer steps per epoch
EPOCHS = 5                 # With fine-tuning, 5 is often enough
LEARNING_RATE = 0.001


def get_data_generators(data_dir):
    """Optimized data generators with smaller images and larger batches."""
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        validation_split=0.2
    )

    print("Loading Training data...")
    train_gen = datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    print("Loading Validation data...")
    val_gen = datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    return train_gen, val_gen


def build_model(num_classes):
    """
    Uses MobileNetV2 — 7x lighter than ResNet50, runs much faster on CPU.
    Still delivers great accuracy for plant disease classification.
    """
    print("Loading MobileNetV2 base model (lightweight & fast)...")
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )

    # Freeze base layers
    for layer in base_model.layers:
        layer.trainable = False

    print("Attaching classification head...")
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.3)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    return model, base_model


def save_class_indices(class_indices, output_path):
    """Save the class-to-index mapping as JSON for the backend."""
    with open(output_path, 'w') as f:
        json.dump(class_indices, f, indent=2)
    print(f"📋 Saved class indices to '{output_path}'")


def copy_to_backend(filename):
    """Copy a file to the backend directory."""
    src = os.path.join(os.path.dirname(__file__), filename)
    dst = os.path.join(BACKEND_DIR, filename)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"📦 Copied '{filename}' → backend/")


if __name__ == '__main__':
    if not os.path.exists(DATASET_DIR):
        print(f"❌ Dataset not found at: {DATASET_DIR}")
        print("   Download from: https://www.kaggle.com/datasets/emmarex/plantdisease")
        exit(1)

    # ── Step 1: Load Data ──
    print("🔍 STEP 1: Loading dataset...")
    train_gen, val_gen = get_data_generators(DATASET_DIR)
    num_classes = len(train_gen.class_indices)
    print(f"✅ Found {num_classes} classes | "
          f"{train_gen.samples} train / {val_gen.samples} val images\n")

    # ── Step 2: Save class indices ──
    print("📋 STEP 2: Saving class index mapping...")
    save_class_indices(train_gen.class_indices, CLASS_INDICES_OUTPUT)

    # ── Step 3: Build Model ──
    print("\n🧠 STEP 3: Building MobileNetV2 model...")
    model, base_model = build_model(num_classes)
    total_params = model.count_params()
    print(f"   Parameters: {total_params:,}")

    steps_per_epoch = train_gen.samples // BATCH_SIZE
    est_time = steps_per_epoch * 0.5 * EPOCHS  # ~0.5s per step with MobileNetV2
    print(f"   Estimated time: ~{est_time/60:.0f} minutes ({EPOCHS} epochs)\n")

    # ── Step 4: Train (frozen base) ──
    print("📚 STEP 4: Training classification head (base frozen)...")
    early_stop = EarlyStopping(monitor='val_accuracy', patience=2, restore_best_weights=True)

    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=[early_stop],
        verbose=1
    )

    # Print results
    val_acc = history.history['val_accuracy'][-1]
    print(f"\n✅ Training complete! Validation accuracy: {val_acc*100:.1f}%")

    # ── Step 5: Fine-tune top layers (optional boost) ──
    if val_acc < 0.90:
        print("\n🔧 STEP 5: Fine-tuning last 30 layers for better accuracy...")
        for layer in base_model.layers[-30:]:
            layer.trainable = True

        model.compile(
            optimizer=Adam(learning_rate=LEARNING_RATE / 10),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        history2 = model.fit(
            train_gen,
            epochs=3,
            validation_data=val_gen,
            callbacks=[early_stop],
            verbose=1
        )
        val_acc = history2.history['val_accuracy'][-1]
        print(f"✅ Fine-tuning complete! Validation accuracy: {val_acc*100:.1f}%")
    else:
        print("⚡ Already above 90% — skipping fine-tuning!")

    # ── Step 6: Save Model ──
    print(f"\n💾 STEP 6: Saving model as '{MODEL_OUTPUT}'...")
    model.save(MODEL_OUTPUT)

    # ── Step 7: Copy to backend ──
    print("\n📦 STEP 7: Copying to backend...")
    copy_to_backend(MODEL_OUTPUT)
    copy_to_backend(CLASS_INDICES_OUTPUT)

    print("\n" + "=" * 50)
    print(f"🎉 ALL DONE! Final accuracy: {val_acc*100:.1f}%")
    print("   Restart the backend and upload a leaf image!")
    print("=" * 50)
