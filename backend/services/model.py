import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Input
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np
import json
import sys

# Function to create the model
def create_model(input_dim, output_dim):
    # Input layer
    inputs = Input(shape=(input_dim,))
    
    # Hidden layers
    x = Dense(32, activation='relu')(inputs)
    x = Dense(64, activation='relu')(x)
    x = Dense(64, activation='relu')(x)
    x = Dense(128, activation='relu')(x)
    x = Dense(128, activation='relu')(x)
    x = Dense(64, activation='relu')(x)
    x = Dense(32, activation='relu')(x)
    
    # Output layer
    outputs = Dense(output_dim, activation='linear')(x)
    
    # Define model
    model = Model(inputs=inputs, outputs=outputs)
    
    # Compile model
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(loss='mse', optimizer=optimizer)
    
    return model

# Function to train the model
def train_model(model, X_train, y_train, epochs=500, batch_size=32):
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size)

# Function to save the model
def save_model(model, filepath):
    model.save(filepath)

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

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <json_file_path>")
        return
    
    json_file = sys.argv[1]
    input_data, output_data = separate_data(json_file)

    model = create_model(input_dim=input_data.shape[1], output_dim=output_data.shape[1])

    train_model(model, input_data, output_data)

if __name__ == "__main__":
    main()
