import os
import numpy as np
import librosa
import tensorflow as tf
from sklearn.model_selection import train_test_split
from augment import augment_signal

DATASET_PATH = "dataset"
SAMPLE_RATE = 16000
DURATION = 1
SAMPLES_PER_TRACK = SAMPLE_RATE * DURATION

X = []
y = []

labels = ["noise", "breath"]

for label_index, label in enumerate(labels):
    folder = os.path.join(DATASET_PATH, label)

    for file in os.listdir(folder):
        file_path = os.path.join(folder, file)

        signal, sr = librosa.load(file_path, sr=SAMPLE_RATE)

        # Ensure fixed length
        if len(signal) >= SAMPLES_PER_TRACK:
            signal = signal[:SAMPLES_PER_TRACK]
        else:
            padding = SAMPLES_PER_TRACK - len(signal)
            signal = np.pad(signal, (0, padding))

        # ORIGINAL SAMPLE
        mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=13)
        X.append(mfcc.T)
        y.append(label_index)

        # AUGMENTED SAMPLES
        augmented_signals = augment_signal(signal)

        for aug in augmented_signals:

            # Ensure fixed length again
            if len(aug) >= SAMPLES_PER_TRACK:
                aug = aug[:SAMPLES_PER_TRACK]
            else:
                padding = SAMPLES_PER_TRACK - len(aug)
                aug = np.pad(aug, (0, padding))

            mfcc_aug = librosa.feature.mfcc(y=aug, sr=sr, n_mfcc=13)

            X.append(mfcc_aug.T)
            y.append(label_index)

# Convert to numpy
X = np.array(X)
y = np.array(y)

# Normalize BEFORE splitting
X = X / np.max(np.abs(X))

# Add channel dimension for CNN
X = X[..., np.newaxis]

# Split ONCE
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# CNN MODEL
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(
        16,
        (3, 3),
        activation='relu',
        input_shape=X.shape[1:]
    ),
    tf.keras.layers.MaxPooling2D((2, 2)),

    tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),

    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.fit(
    X_train,
    y_train,
    epochs=25,
    validation_data=(X_test, y_test)
)

model.save("saved_model.h5")

print("Model trained successfully!")

loss, accuracy = model.evaluate(X_test, y_test)
print("Test Accuracy:", accuracy)

