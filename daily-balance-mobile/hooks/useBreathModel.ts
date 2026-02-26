import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native/dist/platform_react_native';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

export default function useBreathModel(): tf.LayersModel | null {
    const [model, setModel] = useState<tf.LayersModel | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            await tf.ready();

            try {
                const modelAsset = Asset.fromModule(
                    require('../assets/model/model.json')
                );

                await modelAsset.downloadAsync();

                const loadedModel = await tf.loadLayersModel(modelAsset.uri);

                if (mounted) {
                    setModel(loadedModel);
                    console.log('Model loaded (Expo Go safe)');
                }
            } catch (e) {
                console.warn('Model load failed:', e);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, []);

    return model;
}