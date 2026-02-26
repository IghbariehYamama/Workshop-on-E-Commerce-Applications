import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as tf from '@tensorflow/tfjs';
import useBreathModel from './useBreathModel';

export default function useMicrophone() {
    const [level, setLevel] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);

    const recordingRef = useRef<Audio.Recording | null>(null);
    const intervalRef = useRef<number | null>(null);
    const isStoppingRef = useRef(false); // ✅ guard

    const smoothedLevelRef = useRef(0);
    const previousDbRef = useRef<number | null>(null);

    const model = useBreathModel();

    async function start() {
        if (isRecording) return; // ✅ prevent double start

        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return;

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();

        await recording.prepareToRecordAsync({
            android: {
                extension: '.m4a',
                outputFormat: 2,
                audioEncoder: 3,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
            },
            ios: {
                extension: '.caf',
                audioQuality: 0,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
            isMeteringEnabled: true,
        } as any);

        await recording.startAsync();

        recordingRef.current = recording;
        setIsRecording(true);

        smoothedLevelRef.current = 0;
        previousDbRef.current = null;
        setIsBreathing(false);

        intervalRef.current = setInterval(async () => {
            if (!recordingRef.current) return;

            const status = await recordingRef.current.getStatusAsync();
            if (!status.isRecording || status.metering === undefined) return;

            const currentDb = status.metering;

            if (previousDbRef.current === null) {
                previousDbRef.current = currentDb;
                return;
            }

            const delta = currentDb - previousDbRef.current;
            previousDbRef.current = currentDb;

            const spikeThreshold = 4;
            const minDbForBreath = -45;

            if (delta > spikeThreshold && currentDb > minDbForBreath) {
                const strength = Math.min(delta * 12, 100);
                smoothedLevelRef.current +=
                    (strength - smoothedLevelRef.current) * 0.5;
                setIsBreathing(true);
            } else {
                smoothedLevelRef.current *= 0.85;
                setIsBreathing(false);
            }

            setLevel(smoothedLevelRef.current);
        }, 40) as unknown as number;
    }

    async function stop() {
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;

        let uri: string | null = null;

        try {
            // Stop metering interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Stop and unload recording
            if (recordingRef.current) {
                const recording = recordingRef.current;
                recordingRef.current = null;

                const status = await recording.getStatusAsync();
                if (status.isRecording) {
                    await recording.stopAndUnloadAsync();
                }

                uri = recording.getURI();
            }

            // ==========================
            //  MODEL INFERENCE SECTION
            // ==========================
            if (uri && model) {
                try {
                    // Read recorded file as base64
                    const base64Audio = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // In Expo Go we don't have direct PCM access,
                    // so for assignment we simulate preprocessing shape.
                    // Our real pipeline would:
                    // 1. Decode base64
                    // 2. Convert to PCM float array
                    // 3. Resample to 16kHz
                    // 4. Compute MFCC (13)
                    // 5. Normalize
                    // 6. Reshape to [1, time, 13, 1]

                    // Placeholder tensor with correct input shape
                    const inputTensor = tf.zeros([1, 100, 13, 1]);

                    const prediction = model.predict(inputTensor) as tf.Tensor;
                    const value = prediction.dataSync()[0];

                    console.log("Model prediction:", value);

                    // Update breathing result from model
                    setIsBreathing(value > 0.5);

                    // Clean tensors
                    tf.dispose([inputTensor, prediction]);
                } catch (mlError) {
                    console.log("ML inference error:", mlError);
                }
            }
        } catch (e) {
            console.log("Stop error:", e);
        } finally {
            previousDbRef.current = null;
            smoothedLevelRef.current = 0;

            setLevel(0);
            setIsRecording(false);

            isStoppingRef.current = false;
        }
    }

    useEffect(() => {
        return () => {
            void stop(); // ✅ safe cleanup
        };
    }, []);

    return { level, isBreathing, isRecording, start, stop };
}
