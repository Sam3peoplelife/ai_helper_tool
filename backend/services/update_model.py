import tensorflow as tf
from tensorflow.keras.models import load_model
import sys

from json_encoding import separate_data, save_model_temp

# Define custom objects
custom_objects = {'mse': tf.keras.losses.MeanSquaredError}

# Function to load model and make predictions
def update(model_path, json_file_path):
    # Load the model
    model = load_model(model_path, custom_objects=custom_objects)

    # Recreate the optimizer
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    
    # Compile the model
    model.compile(loss='mse', optimizer=optimizer)  # Adjust the loss function if necessary
    
    # Process the input data
    input_data, output_data = separate_data(json_file_path)

    model.fit(input_data, output_data, epochs=20, batch_size=32)

    return model
    

def main():
    if len(sys.argv) < 3:
        print("Usage: python predict.py <model_file_path> <json_file_path>")
        return
    
    model_file_path = sys.argv[1]
    json_file_path = sys.argv[2]

    model_file_path = save_model_temp(update(model_file_path, json_file_path))
    print(f"Updated model saved to {model_file_path}")

if __name__ == "__main__":
    main()