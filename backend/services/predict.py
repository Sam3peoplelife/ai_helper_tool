import keras
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
import pandas as pd
import numpy as np
import json
import sys
import os
import tempfile

# Function to load the model
def load_model(filepath):
    import tensorflow.keras.losses as losses
    return keras.models.load_model(filepath, custom_objects={'mse': losses.mse})

# Function to process input data
def process_data(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    data = pd.DataFrame(data)
    return data

def encode_non_product_data(non_product_data):
    # Convert date to year, month, day
    non_product_data = non_product_data.copy()
    non_product_data['date'] = pd.to_datetime(non_product_data['date'])
    non_product_data['year'] = non_product_data['date'].dt.year
    non_product_data['month'] = non_product_data['date'].dt.month
    non_product_data['day'] = non_product_data['date'].dt.day
    non_product_data.drop('date', axis=1, inplace=True)
    
    # Encode day_of_week
    day_of_week_encoder = LabelEncoder()
    non_product_data['day_of_week'] = day_of_week_encoder.fit_transform(non_product_data['day_of_week'])
    
    # Encode weather
    weather_encoder = LabelEncoder()
    non_product_data['weather'] = weather_encoder.fit_transform(non_product_data['weather'])
    
    return non_product_data

def separate_data(filepath):
    data = process_data(filepath)
    non_product_data = data[['date', 'day_of_week', 'weather']].copy()
    non_product_data = encode_non_product_data(non_product_data)

    product_columns = [col for col in data.columns if col not in ['date', 'day_of_week', 'weather']]
    product_data = data[product_columns]
    sales_df = pd.json_normalize(product_data['sales'])
    product_data = product_data.drop(columns=['sales']).join(sales_df)

    return non_product_data, product_data

def main(model_file_path, json_file_path):
    model = load_model(model_file_path)
    input_data, _ = separate_data(json_file_path)

    predictions = model.predict(input_data)
    predictions = predictions.tolist()

    result = {'predictions': predictions}
    result_file = os.path.join('predictions', 'predictions.json')  # Save in a 'predictions' folder

    with open(result_file, 'w') as f:
        json.dump(result, f)

    print(f"Predictions saved to {result_file}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python predict.py <model_file_path> <json_file_path>")
        sys.exit(1)
    
    model_file_path = sys.argv[1]
    json_file_path = sys.argv[2]

    main(model_file_path, json_file_path)
