import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Minus, Plus, Search, Star } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchFindScreen() {
    const { addPoints } = useUser();

    const [count, setCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const nextLabel = useMemo(() => `Found ${count}! Next Object`, [count]);

    const handleGameComplete = () => {
        addPoints(40);
        router.back();
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                >
                    <ArrowLeft color="#4B5563" size={22} />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.h1}>Search &amp; Find</Text>
                    <Text style={styles.h1Sub}>Look around you!</Text>
                </View>

                <Text style={styles.headerRight}>2/3</Text>
            </View>

            {/* Progress bars */}
            <View style={styles.progressRow}>
                <View style={[styles.progressPill, styles.progressPillOn]} />
                <View style={[styles.progressPill, styles.progressPillOn]} />
                <View style={[styles.progressPill, styles.progressPillOff]} />
            </View>

            {/* Main */}
            <View style={styles.main}>
                <View style={styles.promptCard}>
                    <Text style={styles.promptKicker}>Look around the room and count:</Text>
                    <Text style={styles.promptEmoji}>🪑</Text>
                    <Text style={styles.promptTitle}>How many Chairs?</Text>
                </View>

                {/* Counter */}
                <View style={styles.counterRow}>
                    <Pressable
                        onPress={() => setCount((c) => Math.max(0, c - 1))}
                        accessibilityRole="button"
                        style={({ pressed }) => [styles.counterBtn, pressed && styles.counterBtnPressed]}
                    >
                        <Minus color="#9CA3AF" size={22} />
                    </Pressable>

                    <View style={styles.counterValue}>
                        <Text style={styles.counterValueText}>{count}</Text>
                    </View>

                    <Pressable
                        onPress={() => setCount((c) => c + 1)}
                        accessibilityRole="button"
                        style={({ pressed }) => [styles.counterBtn, pressed && styles.counterBtnPressed]}
                    >
                        <Plus color="#111827" size={22} />
                    </Pressable>
                </View>
            </View>

            {/* Primary action */}
            <View style={styles.footer}>
                <Pressable
                    onPress={() => setShowSuccess(true)}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                >
                    <Text style={styles.primaryBtnText}>{nextLabel}</Text>
                </Pressable>
            </View>

            {/* Success overlay */}
            <Modal
                visible={showSuccess}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSuccess(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconCircle}>
                            <Search size={40} color="#111827" />
                        </View>

                        <Text style={styles.modalTitle}>Great Counting!</Text>
                        <Text style={styles.modalText}>You found so many things in the room!</Text>

                        <View style={styles.resultsRow}>
                            <View style={styles.resultBox}>
                                <Text style={styles.resultEmoji}>🚪</Text>
                                <Text style={styles.resultNumber}>4</Text>
                            </View>

                            <View style={[styles.resultBox, styles.resultBoxCenter]}>
                                <Text style={styles.resultEmoji}>🪑</Text>
                                <Text style={styles.resultNumber}>{count}</Text>
                            </View>

                            <View style={styles.resultBox}>
                                <Text style={styles.resultEmoji}>⏰</Text>
                                <Text style={styles.resultNumber}>1</Text>
                            </View>
                        </View>

                        <View style={styles.rewardRow}>
                            <Star size={18} color="#EAB308" fill="#EAB308" />
                            <Text style={styles.rewardText}>+40 points</Text>
                        </View>

                        <Pressable
                            onPress={handleGameComplete}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
                        >
                            <Text style={styles.doneBtnText}>Back to Island</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 14,
    },

    header: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    h1: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111827',
    },
    h1Sub: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: '900',
        color: '#6B7280',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    headerRight: {
        width: 44,
        textAlign: 'right',
        color: '#9CA3AF',
        fontWeight: '900',
        fontSize: 12,
    },

    progressRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 36,
        marginBottom: 16,
    },
    progressPill: {
        width: 32,
        height: 6,
        borderRadius: 999,
    },
    progressPillOn: { backgroundColor: '#111827' },
    progressPillOff: { backgroundColor: '#D1D5DB' },

    main: {
        flex: 1,
        paddingHorizontal: 18,
        alignItems: 'center',
    },

    promptCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        paddingVertical: 22,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        alignItems: 'center',
        marginBottom: 18,
    },
    promptKicker: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 14,
    },
    promptEmoji: {
        fontSize: 64,
        marginBottom: 12,
    },
    promptTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
    },

    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
        marginTop: 10,
    },
    counterBtn: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    counterBtnPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.95,
    },
    counterValue: {
        width: 96,
        height: 96,
        borderRadius: 28,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#111827',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    },
    counterValueText: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '900',
    },

    footer: {
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    primaryBtn: {
        backgroundColor: '#4B5563',
        borderRadius: 24,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    },
    primaryBtnPressed: {
        backgroundColor: '#111827',
        transform: [{ scale: 0.99 }],
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 24,
        alignItems: 'center',
    },
    modalIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 6,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 16,
        paddingHorizontal: 12,
    },

    resultsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    resultBox: {
        minWidth: 74,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        alignItems: 'center',
    },
    resultBoxCenter: {
        transform: [{ scale: 1.06 }],
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 1,
    },
    resultEmoji: {
        fontSize: 22,
        marginBottom: 6,
    },
    resultNumber: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111827',
    },

    rewardRow: {
        width: '100%',
        backgroundColor: '#FFFBEB',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        paddingVertical: 12,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    rewardText: {
        fontWeight: '900',
        color: '#92400E',
    },

    doneBtn: {
        width: '100%',
        backgroundColor: '#1F2937',
        borderRadius: 24,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    doneBtnPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    doneBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    pressed: {
        opacity: 0.92,
    },
});