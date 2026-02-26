import tensorflow as tf
import tensorflowjs as tfjs

# Load trained Keras model
model = tf.keras.models.load_model("breath_model.h5")

# Convert and save to frontend public folder
tfjs.converters.save_keras_model(
    model,
    "../frontend/public/model"
)

print("✅ Model successfully converted to TensorFlow.js format!")
