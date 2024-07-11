import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Input
import sys
from json_encoding import separate_data, save_model_temp

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
    outputs = Dense(1, activation='linear')(x)
    
    # Define model
    model = Model(inputs=inputs, outputs=outputs)
    
    # Compile model
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(loss='mse', optimizer=optimizer)
    
    return model

# Function to train the model
def train_model(model, X_train, y_train, epochs=5, batch_size=32):
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 main.py <json_file_path>")
        return
    
    json_file = sys.argv[1]
    input_data, output_data = separate_data(json_file)

    model = create_model(input_dim=input_data.shape[1], output_dim=output_data.shape[1])

    train_model(model, input_data, output_data)

    model_file_path = save_model_temp(model)
    print(f"Model saved to {model_file_path}")

if __name__ == "__main__":
    main()
