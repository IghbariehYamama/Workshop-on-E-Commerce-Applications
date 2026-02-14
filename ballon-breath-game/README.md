# 🎈 Balloon Breath Game

An interactive mobile application built with **React Native (Expo)** for a university project.

The app allows children to **blow into the microphone**, causing a balloon on the screen to inflate according to their breath strength.  

The project also includes a **data collection system** for training a machine learning model to classify breath vs noise and potentially detect breath intensity.

---

## 📱 Features

- 🎤 Microphone-based breath detection  
- 🎈 Real-time balloon inflation based on audio input  
- 📊 Data collection mode with labeled recordings  
- 🧠 Designed for future ML-based breath classification  
- ⚡ Built with Expo SDK 54 and TypeScript  

---

## 🛠 Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- expo-av (audio recording)
- expo-file-system (file handling)
- Expo Router (navigation)

---

## 📁 Project Structure


- `app/index.tsx` → Entry screen  
- `DataCollectionScreen.tsx` → Records labeled audio samples  
- `BalloonGameScreen.tsx` → Main game screen  
- `useMicrophone.ts` → Handles audio input  
- `useClassifier.ts` → (Planned) ML inference logic  

---

## ⚙️ Installation

### 1️⃣ Install Node

Ensure you are using: Node 20+
Check version: 

```bash
node -v
```

---

### 2️⃣ Install Dependencies

From the project root: 

```bash
npm install
```

---

### 3️⃣ Start the Development Server

```bash
npx expo start
```

---

## 📱 Running the App

### Android

```bash
npm run android
```

or press `a` inside Expo terminal.

### iOS (macOS only)

```bash
npm run ios
```

### Web

```bash
npm run web
```

---

## 🎤 Microphone Permissions

The app requests microphone access on first launch.

If denied:
- Open device settings
- Enable microphone permissions for the app

---

## 📊 Data Collection Mode

The data collection screen allows recording labeled audio samples.

Available labels:

- `noise`
- `breath_gentle`
- `breath_medium`
- `breath_strong`

Files are saved locally with the format: label_timestamp.m4a

These files can be exported and used for training a machine learning model.

---

## 🧠 Machine Learning Plan

### Goal

Train a model to classify microphone input into:

- Noise
- Gentle breath
- Medium breath
- Strong breath

### Possible Approaches

1. **Binary Classification**
   - Breath vs Noise

2. **Multi-Class Classification**
   - Noise + 3 breath intensity levels

3. **Regression**
   - Predict continuous breath strength value

Training can be performed externally using Python tools such as:
- librosa
- scikit-learn
- TensorFlow / PyTorch

The trained model can later be converted (e.g., TensorFlow Lite) and integrated into the mobile app.

---

## 🎈 Balloon Game Logic

Basic flow:

1. Capture microphone audio input
2. Extract amplitude or features
3. Map intensity → balloon size
4. Animate balloon growth

With ML integration:

1. Extract audio features
2. Run model inference
3. Inflate balloon based on predicted class or intensity
