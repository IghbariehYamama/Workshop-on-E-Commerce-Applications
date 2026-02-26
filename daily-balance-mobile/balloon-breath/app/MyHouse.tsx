import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Award, Heart, Star } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type CatalogItem = {
    id: string; // NOTE: string to match UserContext inventory: string[]
    name: string;
    emoji: string;
    color: string;
    trait: string;
};

const CATALOG: CatalogItem[] = [
    { id: '1', name: 'Lion', emoji: '🦁', color: '#FFEDD5', trait: 'Brave' },
    { id: '2', name: 'Bunny', emoji: '🐰', color: '#DBEAFE', trait: 'Calm' },
    { id: '3', name: 'Fox', emoji: '🦊', color: '#FEE2E2', trait: 'Smart' },
    { id: '4', name: 'Bear', emoji: '🐻', color: '#FEF3C7', trait: 'Strong' },
];

export default function MyHouseScreen() {
    const { user } = useUser();

    const myAnimals = useMemo(() => {
        return CATALOG.filter((item) => user.inventory.includes(item.id));
    }, [user.inventory]);

    const heroName = user.name?.trim() ? user.name.trim() : 'Hero';

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Decorations */}
            <Text style={[styles.decor, styles.houseDecor]}>🏠</Text>
            <Text style={[styles.decor, styles.sunDecor]}>☀️</Text>

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                >
                    <ArrowLeft size={20} color="#4B5563" />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{heroName}&apos;s House</Text>
                    <Text style={styles.subtitle}>Courage Collection</Text>
                </View>

                <View style={styles.pointsPill}>
                    <Star size={16} color="#EAB308" fill="#EAB308" />
                    <Text style={styles.pointsText}>{user.points}</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
            >
                {myAnimals.length > 0 ? (
                    <View style={styles.grid}>
                        {myAnimals.map((animal) => (
                            <View
                                key={animal.id}
                                style={[styles.animalCard, { backgroundColor: animal.color }]}
                            >
                                <View style={styles.traitBadge}>
                                    <Text style={styles.traitText}>{animal.trait}</Text>
                                </View>

                                <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                                <Text style={styles.animalName}>{animal.name}</Text>

                                <View style={styles.heartWrap}>
                                    <Heart size={16} color="#F87171" fill="#F87171" />
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.empty}>
                        <View style={styles.emptyIconCircle}>
                            <Text style={styles.emptyIcon}>🏠</Text>
                        </View>

                        <Text style={styles.emptyTitle}>A Quiet Little House</Text>
                        <Text style={styles.emptyText}>
                            Your new friends are waiting in the shop. Play games on the island to earn stars and bring them home!
                        </Text>

                        <Pressable
                            onPress={() => router.push('/Shop')}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.shopCta, pressed && styles.shopCtaPressed]}
                        >
                            <View style={styles.shopCtaRow}>
                                <Award size={20} color="#FACC15" />
                                <Text style={styles.shopCtaText}>Go to the Shop</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Pressable
                    onPress={() => router.replace('/DiscoveryMap')}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.footerBtn, pressed && styles.footerBtnPressed]}
                >
                    <Text pointerEvents="none" style={styles.footerBtnText}>Back to Discovery Island</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFF9C4',
    },

    decor: {
        position: 'absolute',
    },
    houseDecor: {
        top: 30,
        right: -10,
        fontSize: 96,
        opacity: 0.1,
        transform: [{ rotate: '12deg' }],
    },
    sunDecor: {
        bottom: 120,
        left: -6,
        fontSize: 64,
        opacity: 0.1,
        transform: [{ rotate: '-12deg' }],
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    backBtn: {
        width: 46,
        height: 46,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    subtitle: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '900',
        color: '#6B7280',
        letterSpacing: 2.2,
        textTransform: 'uppercase',
    },
    pointsPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#FDE68A',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F2937',
    },

    scroll: { flex: 1, zIndex: 10 },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 120,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    animalCard: {
        width: '48%',
        borderRadius: 40,
        paddingVertical: 18,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
        overflow: 'hidden',
    },
    traitBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    traitText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#4B5563',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    animalEmoji: {
        fontSize: 56,
        marginBottom: 10,
    },
    animalName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F2937',
    },
    heartWrap: {
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.65)',
        padding: 10,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },

    empty: {
        flex: 1,
        minHeight: 420,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyIconCircle: {
        width: 132,
        height: 132,
        borderRadius: 66,
        backgroundColor: 'rgba(255,255,255,0.55)',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    emptyIcon: {
        fontSize: 56,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 18,
    },
    shopCta: {
        width: '100%',
        backgroundColor: '#111827',
        paddingVertical: 18,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopCtaPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    shopCtaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shopCtaText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },

    footer: {
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none',
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 18,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.55)',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
    },
    footerBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerBtnPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    footerBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },

    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.95,
    },
});