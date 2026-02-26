import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Lock, ShoppingBag, Star, Wrench } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

function LevelCard({
                       locked,
                       onPress,
                       style,
                       reward,
                       title,
                       icon,
                   }: {
    locked: boolean;
    onPress: () => void;
    style: object;
    reward?: string;
    title: string;
    icon: React.ReactNode;
}) {
    return (
        <Pressable
            onPress={locked ? undefined : onPress}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.levelCard,
                locked ? styles.levelCardLocked : styles.levelCardUnlocked,
                pressed && !locked ? styles.levelCardPressed : null,
                style,
            ]}
        >
            {!locked && reward ? (
                <View style={styles.rewardBadge}>
                    <Text style={styles.rewardBadgeText}>{reward}</Text>
                </View>
            ) : null}

            <View style={styles.levelIconWrap}>{icon}</View>
            <Text style={styles.levelTitle}>{title}</Text>
        </Pressable>
    );
}

export default function DiscoveryMapScreen() {
    const { user } = useUser();

    const stageText = useMemo(() => {
        const visit = user.visitType || 'Visit';
        return `Stage: Before ${visit}`;
    }, [user.visitType]);

    const isLevelLocked = (requiredPoints: number) => user.points < requiredPoints;

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
        {/* Decorative background elements (simple emoji; cheap & cheerful) */}
            <Text style={[styles.decor, styles.cloud1]}>☁️</Text>
            <Text style={[styles.decor, styles.cloud2]}>☁️</Text>
            <Text style={[styles.decor, styles.tree]}>🌳</Text>
            <Text style={[styles.decor, styles.flower]}>🌸</Text>

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.push('/')}
                    accessibilityRole="button"
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>
                        Island of {user.name?.trim() ? user.name : 'Hero'}
                    </Text>
                    <Text style={styles.headerSubtitle}>{stageText}</Text>
                </View>

                <View style={styles.pointsPill}>
                    <Star size={14} color="#B45309" fill="#B45309" />
                    <Text style={styles.pointsText}>{user.points}</Text>
                </View>
            </View>

            {/* Map area */}
            <View style={styles.mapArea}>
                {/* Level 1: Who Am I? (always active) */}
                <LevelCard
                    locked={false}
                    onPress={() => router.push('/games/SearchFind')}
                    style={styles.level1}
                    reward="+40"
                    title="Who Am I?"
                    icon={<Text style={styles.emojiIcon}>👨‍⚕️</Text>}
                />

                {/* Level 2: Tool Match (unlock at 180) */}
                <LevelCard
                    locked={isLevelLocked(180)}
                    onPress={() => router.push('/games/ToolMatch')}
                    style={styles.level2}
                    reward="+50"
                    title="Tool Match"
                    icon={
                        isLevelLocked(180) ? (
                            <Lock size={32} color="#9CA3AF" />
                        ) : (
                            <Wrench size={32} color="#374151" />
                        )
                    }
                />

                {/* Level 3: Breathing (unlock at 230) */}
                <LevelCard
                    locked={isLevelLocked(230)}
                    onPress={() => router.push('/games/BreathingGame')}
                    style={styles.level3}
                    title="Calm Down"
                    icon={
                        isLevelLocked(230) ? (
                            <Lock size={24} color="#9CA3AF" />
                        ) : (
                            <Text style={styles.emojiIcon}>🎈</Text>
                        )
                    }
                />
            </View>

            {/* Fixed shop button */}
            <View style={styles.shopBar}>
                <Pressable
                    onPress={() => router.push('/Shop')}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.shopButton, pressed && styles.shopButtonPressed]}
                >
                    <ShoppingBag size={20} color="#F472B6" />
                    <View style={styles.shopButtonTextRow}>
                        <Text style={styles.shopButtonText}>Visit the Shop</Text>
                        {user.points >= 280 ? <View style={styles.shopPingDot} /> : null}
                    </View>
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
    },
    cloud1: { top: 40, left: 30, fontSize: 54, opacity: 0.2 },
    cloud2: { top: 140, right: 10, fontSize: 40, opacity: 0.2 },
    tree: { bottom: 120, left: 12, fontSize: 40, opacity: 0.4 },
    flower: { top: '52%', right: 30, fontSize: 38, opacity: 0.4 },

    header: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: 'rgba(255,255,255,0.85)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 20,
        color: '#9CA3AF',
        fontWeight: '900',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    headerSubtitle: {
        marginTop: 2,
        fontSize: 12,
        color: '#6B7280',
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
        fontSize: 14,
    },

    mapArea: {
        flex: 1,
        position: 'relative',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 110, // leave room for shop bar
    },

    levelCard: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 32,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },
    levelCardUnlocked: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    levelCardLocked: {
        backgroundColor: 'rgba(243,244,246,0.85)',
        opacity: 0.65,
    },
    levelCardPressed: {
        transform: [{ scale: 0.98 }],
        borderColor: '#BFDBFE',
    },

    rewardBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#111827',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardBadgeText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 10,
    },

    levelIconWrap: {
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiIcon: {
        fontSize: 36,
    },
    levelTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: '#1F2937',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        textAlign: 'center',
    },

    // Positions roughly matching the web layout
    level1: {
        left: '50%',
        bottom: 130,
        marginLeft: -64,
    },
    level2: {
        top: '33%',
        right: 18,
    },
    level3: {
        top: 22,
        left: 26,
        width: 112,
        height: 112,
    },

    shopBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 18,
    },
    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    shopButtonPressed: {
        transform: [{ scale: 0.99 }],
    },
    shopButtonTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },
    shopPingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FACC15',
    },
});