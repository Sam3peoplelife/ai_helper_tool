import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np
import json

# Function to create the model
def create_model(input_dim, output_dim):
    model = Sequential()
    
    # Hidden layers
    model.add(Dense(32, input_dim=input_dim, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(128, activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(128, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(32, activation='relu'))
    
    # Output layer
    model.add(Dense(output_dim, activation='linear'))  # Assuming output_dim is the number of output nodes
    
    # Compile model
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(loss='mse', optimizer=optimizer)
    
    return model

# Function to train the model
def train_model(model, X_train, y_train, epochs=500, batch_size=32):
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size)

# Function to update the model with new data
def update_model(model, X_new, y_new, epochs=10, batch_size=32):
    model.fit(X_new, y_new, epochs=epochs, batch_size=batch_size)

def model_predict(model, input_data):
    return model.predict(input_data)

# Function to save the model
def save_model(model, filepath):
    model.save(filepath)

# Function to load the model
def load_model(filepath):
    return keras.models.load_model(filepath)

# Function to process input data
def process_data(file_path):
    if file_path.endswith('.csv'):
        data = pd.read_csv(file_path)
    elif file_path.endswith('.xlsx'):
        data = pd.read_excel(file_path)
    elif file_path.endswith('.json'):
        with open(file_path, 'r') as f:
            data = pd.DataFrame(json.load(f))
    else:
        raise ValueError("Unsupported file format")
    
    return data

def encode_non_product_data(non_product_data):
    # Convert date to year, month, day
    non_product_data = non_product_data.copy()  # Create a copy of the DataFrame to avoid SettingWithCopyWarning
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
    # Selecting the columns for date, day_of_week, weather and encoding it
    non_product_data = data[['date', 'day_of_week', 'weather']].copy()  # Create a copy to avoid SettingWithCopyWarning
    non_product_data = encode_non_product_data(non_product_data)

    # Selecting the columns for products (all columns except date, day_of_week, and weather)
    product_columns = [col for col in data.columns if col not in ['date', 'day_of_week', 'weather']]
    product_data = data[product_columns]

    return non_product_data, product_data


