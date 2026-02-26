import numpy as np
import librosa

SAMPLE_RATE = 16000

def add_background_noise(signal, noise_factor=0.02):
    noise = np.random.randn(len(signal))
    return signal + noise_factor * noise

def time_shift(signal, shift_max=0.2):
    shift = int(np.random.uniform(-shift_max, shift_max) * len(signal))
    return np.roll(signal, shift)

def pitch_shift(signal, n_steps=2):
    return librosa.effects.pitch_shift(signal, sr=SAMPLE_RATE, n_steps=n_steps)

def speed_change(signal, rate=1.1):
    return librosa.effects.time_stretch(signal, rate=rate)

def augment_signal(signal):
    augmented = []

    augmented.append(add_background_noise(signal))
    augmented.append(time_shift(signal))
    augmented.append(pitch_shift(signal, n_steps=1))
    augmented.append(speed_change(signal, rate=1.1))

    return augmented
