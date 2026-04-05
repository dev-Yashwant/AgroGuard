import os
import numpy as np
from PIL import Image

def generate_mock_dataset(base_dir, classes, num_images=10):
    print(f"Creating mini mock dataset in {base_dir}...")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    for cls in classes:
        class_dir = os.path.join(base_dir, cls)
        if not os.path.exists(class_dir):
            os.makedirs(class_dir)
        
        print(f"Generating {num_images} mock images for {cls}...")
        for i in range(num_images):
            # Create a 224x224 RGB image with random noise pattern
            if "Healthy" in cls:
                # Green-ish noise
                array = np.random.randint(0, 100, (224, 224, 3), dtype=np.uint8)
                array[:, :, 1] = np.random.randint(150, 255, (224, 224)) # Boost Green
            else:
                # Brown/Yellow-ish noise (Sick)
                array = np.random.randint(50, 200, (224, 224, 3), dtype=np.uint8)
                array[:, :, 0] = np.random.randint(150, 255, (224, 224)) # Boost Red
                array[:, :, 1] = np.random.randint(100, 200, (224, 224)) # Boost Green for yellow
            
            img = Image.fromarray(array)
            img.save(os.path.join(class_dir, f"mock_img_{i}.jpg"))

if __name__ == "__main__":
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'plantvillage')
    diseases = ['Tomato_Healthy', 'Tomato_Bacterial_spot']
    generate_mock_dataset(dataset_path, diseases, num_images=15)
    print("\n✅ Mock dataset successfully generated! You can now run train.py.")
