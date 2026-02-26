import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type ItemType = 'clothing' | 'medicine' | 'mask' | 'bed';

type Item = {
    id: number;
    icon: string;
    type: ItemType;
};

type Target = {
    id: 't1' | 't2' | 't3' | 't4';
    type: ItemType;
    label: string;
};

export default function ToolMatchScreen() {
    const { user, addPoints } = useUser();

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [matches, setMatches] = useState<Record<string, number>>({});

    const items: Item[] = useMemo(
        () => [
            { id: 1, icon: '👔', type: 'clothing' },
            { id: 2, icon: '💊', type: 'medicine' },
            { id: 3, icon: '😷', type: 'mask' },
            { id: 4, icon: '🛏️', type: 'bed' },
        ],
        []
    );

    const targets: Target[] = useMemo(
        () => [
            { id: 't1', type: 'medicine', label: 'Helps you feel better' },
            { id: 't2', type: 'clothing', label: 'Something you wear' },
            { id: 't3', type: 'mask', label: 'Protects your face' },
            { id: 't4', type: 'bed', label: 'Where you sleep' },
        ],
        []
    );

    const matchedItemIds = useMemo(() => new Set(Object.values(matches)), [matches]);

    const isComplete = Object.keys(matches).length === items.length;

    const handleItemPress = (item: Item) => {
        if (matchedItemIds.has(item.id)) return;
        setSelectedItem(item);
    };

    const handleTargetPress = (target: Target) => {
        if (!selectedItem) return;

        if (selectedItem.type === target.type) {
            setMatches((prev) => ({ ...prev, [target.id]: selectedItem.id }));
            setSelectedItem(null);
        } else {
            setSelectedItem(null);
        }
    };

    const handleClaim = () => {
        addPoints(50);
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
                    <ArrowLeft color="#6B7280" size={22} />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.h1}>Tool Match</Text>
                    <Text style={styles.h1Sub}>Match tools to what they do!</Text>
                </View>

                <View style={styles.pointsPill}>
                    <Star size={14} color="#B45309" fill="#B45309" />
                    <Text style={styles.pointsText}>{user.points}</Text>
                </View>
            </View>

            <Text style={styles.tapHint}>👆</Text>

            {/* Game board */}
            <View style={styles.board}>
                {/* Left column */}
                <View style={styles.col}>
                    {items.map((item) => {
                        const isMatched = matchedItemIds.has(item.id);
                        const isSelected = selectedItem?.id === item.id;

                        if (isMatched) {
                            return <View key={item.id} style={styles.slotHidden} />;
                        }

                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => handleItemPress(item)}
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.slot,
                                    styles.slotItem,
                                    isSelected ? styles.slotSelected : styles.slotIdle,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Text style={styles.slotEmoji}>{item.icon}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Right column */}
                <View style={styles.col}>
                    {targets.map((target) => {
                        const matchedItemId = matches[target.id];
                        const matchedItem = items.find((i) => i.id === matchedItemId);

                        return (
                            <Pressable
                                key={target.id}
                                onPress={() => handleTargetPress(target)}
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.slot,
                                    matchedItem ? styles.targetMatched : styles.targetEmpty,
                                    pressed && styles.pressed,
                                ]}
                            >
                                {matchedItem ? (
                                    <>
                                        <Text style={styles.slotEmoji}>{matchedItem.icon}</Text>
                                        <Text style={styles.targetTextMatched}>{target.label}</Text>
                                    </>
                                ) : (
                                    <Text style={styles.targetText}>{target.label}</Text>
                                )}
                            </Pressable>

                        );
                    })}
                </View>
            </View>

            {/* Success modal */}
            <Modal visible={isComplete} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconCircle}>
                            <CheckCircle size={48} color="#22C55E" />
                        </View>

                        <Text style={styles.modalTitle}>Great Job!</Text>
                        <Text style={styles.modalText}>
                            You&apos;ve matched all the tools and prepared for your visit!
                        </Text>

                        <View style={styles.rewardRow}>
                            <Star size={18} color="#EAB308" fill="#EAB308" />
                            <Text style={styles.rewardText}>+50 Stars</Text>
                        </View>

                        <Pressable
                            onPress={handleClaim}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.claimBtn, pressed && styles.claimBtnPressed]}
                        >
                            <Text style={styles.claimBtnText}>Claim Rewards</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const SLOT_SIZE = 112;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 18,
        paddingHorizontal: 18,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        justifyContent: 'space-between',
    },

    targetText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 12,
    },

    targetTextMatched: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '800',
        color: '#374151',
        textAlign: 'center',
        paddingHorizontal: 12,
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
        paddingHorizontal: 10,
    },
    h1: {
        fontSize: 18,
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
        textAlign: 'center',
    },
    pointsPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    pointsText: {
        fontWeight: '900',
        color: '#92400E',
        fontSize: 13,
    },

    tapHint: {
        textAlign: 'center',
        fontSize: 42,
        marginBottom: 10,
    },

    board: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 18,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 420,
        paddingTop: 10,
    },
    col: {
        flex: 1,
        gap: 18,
    },

    slot: {
        width: '100%',
        height: SLOT_SIZE,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    slotIdle: {
        transform: [{ scale: 1 }],
    },
    slotSelected: {
        borderColor: '#BFDBFE',
        borderWidth: 4,
        transform: [{ scale: 1.03 }],
    },
    slotEmoji: {
        fontSize: 46,
    },

    targetEmpty: {
        backgroundColor: 'rgba(249,250,251,0.8)',
        borderWidth: 3,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    targetMatched: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },

    slotHidden: {
        width: '100%',
        height: SLOT_SIZE,
        borderRadius: 28,
        opacity: 0,
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
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 24,
        alignItems: 'center',
    },
    modalIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
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
        paddingHorizontal: 10,
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
    claimBtn: {
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
    claimBtnPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    claimBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    pressed: {
        opacity: 0.92,
    },
});