# 🌈 Daily Balance - Pediatric Medical Resilience App

**Daily Balance** is an interactive mobile application designed to help children (ages 6–10) prepare emotionally for medical procedures.  
The app combines gamified learning, real-time breathing support, and post-visit reflection to build resilience and reduce medical anxiety.

---

## ✨ Features

- 🧒 Personalized onboarding
- 🗺 Educational mini-games (Discovery Island)
- 🎈 Real-time Balloon Breathing calming tool
- 📊 Feeling tracker and reward shop
- 🎤 Microphone-based breath detection
- 🧠 Data collection pipeline for ML training

---

## 🧠 Machine Learning

The project includes infrastructure for training and integrating a breath-classification model.

**Target classes**

- Noise
- Breath

**Pipeline**

1. Record labeled audio samples
2. Train model offline (Python)
3. Integrate model for real-time inference
4. Map prediction → balloon animation

---

## 🛠 Tech Stack

### Mobile

- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- React Context API

### Audio

- expo-av
- expo-file-system

### Machine Learning

- TensorFlow / TensorFlow Lite / tfjs
- librosa (offline preprocessing)

---

## ⚙️ Installation

### 1. Prerequisites

- Node.js 20+
- npm
- Expo CLI
- Android Studio (for emulator)
- Expo Go app on your phone

Check Node version:

```bash
node -v
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the development server

```bash
npx expo start -c
```

---

## 📱 Running the App

### 🚀 Expo Go (recommended - This is the fastest way to run the project)

1. Install Expo Go on your mobile device
2. Run:

```bash
npx expo start -c
```

3. Scan the QR code with Expo Go

### 🤖 Android (native build)

Run (Requires Android SDK and an emulator or physical device):

```bash
npx expo run:android
```

### 🍎 iOS (macOS only)

Run:

```bash
npx expo run:ios
```

---

## 🎤 Microphone Permissions

The app requests microphone access on the first launch.

If permission is denied:

- Open device settings
- Enable microphone access for the app