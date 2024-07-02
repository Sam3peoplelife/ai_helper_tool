import tensorflow as tf
from tensorflow.keras.models import load_model
import pandas as pd
import sys
import os
import tempfile

from json_encoding import separate_data

# Define custom objects
custom_objects = {'mse': tf.keras.losses.MeanSquaredError}

# Function to load model and make predictions
def predict(model_path, json_file_path):
    # Load the model
    model = load_model(model_path, custom_objects=custom_objects)
    
    # Process the input data
    input_data, _ = separate_data(json_file_path)

    # Make predictions
    predictions = model.predict(input_data)
    
    # Save predictions to a temporary file
    temp_dir = tempfile.mkdtemp()
    predictions_file_path = os.path.join(temp_dir, 'predictions.json')
    predictions_df = pd.DataFrame(predictions)
    predictions_df.to_json(predictions_file_path, orient='records')
    
    return predictions_file_path

def main():
    if len(sys.argv) < 3:
        print("Usage: python predict.py <model_file_path> <json_file_path>")
        return
    
    model_file_path = sys.argv[1]
    json_file_path = sys.argv[2]
    
    predictions_file_path = predict(model_file_path, json_file_path)
    print(f"Predictions saved to {predictions_file_path}")

if __name__ == "__main__":
    main()
