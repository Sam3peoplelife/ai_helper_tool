from sklearn.preprocessing import LabelEncoder
import pandas as pd
import json
import os
import tempfile

# Function to save the model to a temporary file
def save_model_temp(model):
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, 'model.h5')
    model.save(temp_file_path)
    return temp_file_path

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
