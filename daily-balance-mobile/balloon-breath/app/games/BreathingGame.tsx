import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Animated,
    Pressable,
    Modal,
} from 'react-native';
import { Star, ArrowLeft } from 'lucide-react-native';
import { useUser } from '../UserContext';
import useMicrophone from '../../hooks/useMicrophone';
import FigmaBalloon from '../../components/Balloon';
import { router } from 'expo-router';

export default function BreathingBalloonScreen() {
    const { addPoints } = useUser();
    const { level, isBreathing, start, stop } = useMicrophone();

    const [showSuccess, setShowSuccess] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [calmTime, setCalmTime] = useState(0);
    const [feedback, setFeedback] = useState('Ready?');

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const currentScale = useRef(1);

    // 🎯 Breathing tuning
    const CALM_MIN = 12;
    const CALM_MAX = 40;
    const MAX_SCALE = 1.8;

    useEffect(() => {
        if (!isPlaying) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
            currentScale.current = 1;
            return;
        }

        let newScale = currentScale.current;

        // ✅ ONLY inflate when user is ACTUALLY breathing
        if (isBreathing && level > CALM_MIN && level < CALM_MAX) {
            newScale += 0.008;
            setCalmTime((t) => t + 0.1);
            setFeedback('That’s perfect 🌿');
        }
        // ❌ Too strong
        else if (isBreathing && level >= CALM_MAX) {
            newScale -= 0.025;
            setFeedback('Soft wind… 🌬');
        }
        // 😌 No breath → deflate
        else {
            newScale -= 0.02;
            setFeedback('Blow gently');
        }

        newScale = Math.max(1, Math.min(newScale, MAX_SCALE));
        currentScale.current = newScale;

        Animated.spring(scaleAnim, {
            toValue: newScale,
            useNativeDriver: true,
            friction: 8,
            tension: 60,
        }).start();

        // 🌟 Success condition
        if (calmTime >= 10) {
            setIsPlaying(false);
            stop();
            setShowSuccess(true);
        }
    }, [level, isBreathing, isPlaying]);

    const handleStartStop = () => {
        if (isPlaying) {
            stop();
            setIsPlaying(false);
        } else {
            setCalmTime(0);
            start();
            setIsPlaying(true);
            setFeedback('Blow softly');
        }
    };

    const handleComplete = () => {
        addPoints(30);
        setShowSuccess(false);
        router.back();
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.topBar}>
                <Pressable
                    onPress={() => {
                        stop();
                        router.back();
                    }}
                    style={styles.iconBtn}
                >
                    <ArrowLeft color="#6B7280" size={22} />
                </Pressable>

                <View style={styles.topBarCenter}>
                    <Text style={styles.title}>Calm Balloon</Text>
                    <Text style={styles.subtitle}>Slow, soft breathing</Text>
                </View>

                <View style={{ width: 44 }} />
            </View>

            <View style={styles.center}>
                <Animated.View
                    style={[styles.balloon, { transform: [{ scale: scaleAnim }] }]}
                >
                    <FigmaBalloon breathLevel={level} />
                </Animated.View>

                <Text style={styles.instruction}>{feedback}</Text>
            </View>

            <View style={styles.controls}>
                <Pressable onPress={handleStartStop} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        {isPlaying ? 'Stop' : 'Start'}
                    </Text>
                </Pressable>
            </View>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Beautiful Breathing 🌿</Text>
                        <Text style={styles.modalText}>
                            You stayed calm and steady.
                        </Text>

                        <View style={styles.rewardRow}>
                            <Star size={18} color="#EAB308" fill="#EAB308" />
                            <Text style={styles.rewardText}>+30 points</Text>
                        </View>

                        <Pressable onPress={handleComplete} style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>Continue</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#ddffe7' },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 24,
    },
    iconBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarCenter: { flex: 1, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '800' },
    subtitle: { fontSize: 12, color: '#6B7280' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    balloon: { width: 200, height: 240 },
    instruction: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 24,
        color: '#1F2937',
    },
    controls: { padding: 24, alignItems: 'center' },
    primaryButton: {
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 18,
    },
    primaryButtonText: { color: '#FFF', fontWeight: '800' },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalCard: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 22, fontWeight: '900' },
    modalText: { marginBottom: 16, color: '#6B7280' },
    rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rewardText: { fontWeight: '900', color: '#92400E' },
});
