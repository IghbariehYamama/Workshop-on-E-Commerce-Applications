import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

type Props = {
    breathLevel?: number; // 0..1
    isInflating?: boolean;
};

// Use a bundled local asset (ensure ./app/assets/balloon.png exists)
const LOCAL_BALLOON = require('../assets/balloon.png');

export default function FigmaBalloon({ breathLevel = 0, isInflating = true }: Props) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const currentScale = useRef<number>(0.8);
    const breathRef = useRef<number>(breathLevel);
    const inflatingInterval = useRef<number | null>(null);

    useEffect(() => {
        // keep an updated numeric value of the animated scale so we can prevent shrinking while inflating
        const listenerId = scale.addListener(({ value }) => {
            currentScale.current = value;
        });

        return () => {
            try {
                scale.removeListener(listenerId);
            } catch (e) {
                // ignore
            }
        };
    }, []);

    // Keep latest breathLevel available to the inflating interval
    useEffect(() => {
        breathRef.current = breathLevel;
    }, [breathLevel]);

    useEffect(() => {
        const MIN_SCALE = 0.8;
        const MAX_SCALE = 1.7;
        const INTERVAL_MS = 100; // how often to update while inflating
        const RATE_PER_SECOND = 0.5; // maximum scale units per second at breathLevel=1
        const RATE_PER_INTERVAL = RATE_PER_SECOND * (INTERVAL_MS / 1000);

        if (isInflating) {
            // start a short interval that increments scale proportional to breath level
            if (inflatingInterval.current) clearInterval(inflatingInterval.current as any);
            inflatingInterval.current = setInterval(() => {
                const bl = Math.max(0, Math.min(1, breathRef.current || 0));
                const increment = bl * RATE_PER_INTERVAL;
                if (increment <= 0) return;
                const next = Math.min(MAX_SCALE, currentScale.current + increment);
                if (next > currentScale.current) {
                    // directly set value to avoid spring-based shrinking
                    // scale.setValue(next);
                    Animated.spring(scale, {
                        toValue: next,
                        useNativeDriver: true,
                        tension: 40,
                        friction: 5,
                    }).start();
                }
            }, INTERVAL_MS) as unknown as number;
        } else {
            // stop any inflating interval
            if (inflatingInterval.current) {
                clearInterval(inflatingInterval.current as any);
                inflatingInterval.current = null;
            }
            // Deflating: shrink at constant rate over 2 seconds to MIN_SCALE
            Animated.timing(scale, {
                toValue: MIN_SCALE,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        }

        return () => {
            if (inflatingInterval.current) {
                clearInterval(inflatingInterval.current as any);
                inflatingInterval.current = null;
            }
        };
    }, [isInflating]);

    return (
        <View style={styles.container}>
            <Animated.Image source={LOCAL_BALLOON} style={[styles.balloon, { transform: [{ scale }] }]} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balloon: {
        width: 360,
        height: 360,
    },
    // mascot removed
});
