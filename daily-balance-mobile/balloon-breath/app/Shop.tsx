import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check, Home, Star } from 'lucide-react-native';
import { useUser, type ShopItem } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type ShopCatalogItem = ShopItem & {
    name: string;
    price: number;
    emoji: string;
};

const ITEMS: ShopCatalogItem[] = [
    { id: '1', name: 'Lion', price: 450, emoji: '🦁' },
    { id: '2', name: 'Bunny', price: 280, emoji: '🐰' },
    { id: '3', name: 'Fox', price: 510, emoji: '🦊' },
    { id: '4', name: 'Bear', price: 300, emoji: '🐻' },
];

export default function ShopScreen() {
    const { user, buyItem } = useUser();

    const pointsText = useMemo(() => String(user.points), [user.points]);

    const handleBuy = (item: ShopCatalogItem) => {
        if (user.inventory.includes(item.id)) return;

        const success = buyItem(item);

        if (!success) {
            Alert.alert('Not enough points yet!', 'Play more games to earn stars.');
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Decorations */}
            <Text style={[styles.decor, styles.decorTree]}>🌳</Text>
            <Text style={[styles.decor, styles.decorFlower]}>🌻</Text>
            <Text style={[styles.decor, styles.decorButterfly]}>🦋</Text>

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                >
                    <ArrowLeft size={20} color="#4B5563" />
                </Pressable>

                <View style={styles.pointsPill}>
                    <Star size={16} color="#EAB308" fill="#EAB308" />
                    <Text style={styles.pointsText}>{pointsText}</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centerTop}>
                    <Text style={styles.bigEmoji}>🏘️</Text>
                </View>

                <View style={styles.grid}>
                    {ITEMS.map((item, index) => {
                        const isOwned = user.inventory.includes(item.id);
                        const staggerDown = index % 2 !== 0;

                        return (
                            <View
                                key={item.id}
                                style={[
                                    styles.itemCard,
                                    staggerDown ? styles.itemCardStagger : null,
                                    isOwned ? styles.itemCardOwned : null,
                                ]}
                            >
                                <Text style={styles.roofEmoji}>🏠</Text>

                                <View style={styles.emojiCircle}>
                                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                                </View>

                                <Pressable
                                    onPress={() => handleBuy(item)}
                                    disabled={isOwned}
                                    accessibilityRole="button"
                                    style={({ pressed }) => [
                                        styles.buyBtn,
                                        isOwned ? styles.buyBtnOwned : styles.buyBtnBuyable,
                                        pressed && !isOwned ? styles.buyBtnPressed : null,
                                    ]}
                                >
                                    {isOwned ? (
                                        <View style={styles.buyBtnRow}>
                                            <Text style={styles.buyBtnTextOwned}>Owned</Text>
                                            <Check size={12} color="#15803D" />
                                        </View>
                                    ) : (
                                        <View style={styles.buyBtnRow}>
                                            <Star size={12} color="#6B7280" fill="#6B7280" />
                                            <Text style={styles.buyBtnTextBuyable}>{item.price}</Text>
                                        </View>
                                    )}
                                </Pressable>

                                {/* Status indicator */}
                                <View style={styles.statusBadge}>
                                    <View style={[styles.statusCircle, isOwned ? styles.statusCircleOwned : styles.statusCircleIdle]}>
                                        <Text style={[styles.statusText, isOwned ? styles.statusTextOwned : styles.statusTextIdle]}>
                                            {isOwned ? '✓' : '♡'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.itemName}>{item.name}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <Pressable
                    onPress={() => router.push('/MyHouse')}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.bottomBtn, pressed && styles.bottomBtnPressed]}
                >
                    <Home size={20} color="#FDBA74" />
                    <Text style={styles.bottomBtnText}>Visit My House</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    decor: {
        position: 'absolute',
        opacity: 0.2,
        fontSize: 34,
    },
    decorTree: { top: 90, left: 14 },
    decorFlower: { top: 160, right: 14 },
    decorButterfly: { bottom: 160, left: 30 },

    header: {
        paddingTop: 18,
        paddingHorizontal: 18,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },

    pointsPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    pointsText: {
        fontWeight: '900',
        color: '#1F2937',
    },

    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 0,
    },

    centerTop: {
        alignItems: 'center',
        marginBottom: 10,
    },
    bigEmoji: {
        fontSize: 56,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },

    itemCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
    },
    itemCardStagger: {
        marginTop: 22,
    },
    itemCardOwned: {
        opacity: 0.92,
        borderWidth: 2,
        borderColor: '#DCFCE7',
    },

    roofEmoji: {
        position: 'absolute',
        top: -14,
        fontSize: 22,
    },

    emojiCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 1,
    },
    itemEmoji: { fontSize: 44 },

    itemName: {
        marginTop: 10,
        fontWeight: '900',
        color: '#111827',
    },

    buyBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    buyBtnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    buyBtnBuyable: {
        backgroundColor: '#F3F4F6',
    },
    buyBtnOwned: {
        backgroundColor: '#DCFCE7',
    },
    buyBtnPressed: {
        backgroundColor: '#111827',
    },
    buyBtnTextBuyable: {
        fontWeight: '900',
        color: '#374151',
    },
    buyBtnTextOwned: {
        fontWeight: '900',
        color: '#15803D',
    },

    statusBadge: {
        position: 'absolute',
        bottom: -12,
        backgroundColor: '#FFFFFF',
        padding: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    statusCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCircleIdle: {
        borderColor: '#E5E7EB',
        backgroundColor: 'transparent',
    },
    statusCircleOwned: {
        borderColor: '#4ADE80',
        backgroundColor: '#ECFDF5',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    statusTextIdle: {
        color: '#9CA3AF',
    },
    statusTextOwned: {
        color: '#16A34A',
    },

    bottomBar: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 18,
    },
    bottomBtn: {
        backgroundColor: '#1F2937',
        borderRadius: 18,
        paddingVertical: 16,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    bottomBtnPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    bottomBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    pressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
});