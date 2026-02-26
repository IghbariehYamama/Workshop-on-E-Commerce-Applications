import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight, Heart, Shield, Smile } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';

const STORAGE_KEY = 'daily_balance_user_v1';

function FeatureCard({
                         title,
                         body,
                         tint,
                         icon,
                     }: {
    title: string;
    body: string;
    tint: { bg: string; border: string; iconBg: string; iconColor: string };
    icon: React.ReactNode;
}) {
    return (
        <View style={[styles.card, { backgroundColor: tint.bg, borderColor: tint.border }]}>
            <View style={[styles.cardIconWrap, { backgroundColor: tint.iconBg }]}>
                {icon}
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardBody}>{body}</Text>
        </View>
    );
}

export default function LandingPageScreen() {
    const { reset } = useUser();

    const handleStartJourney = async () => {
        // Mobile equivalent of "localStorage.removeItem(...)"
        reset();
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore storage errors; reset() already cleared in-memory state
        }
        router.push('/Onboarding');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
                {/* “Navbar” */}
                <View style={styles.navbar}>
                    <Text style={styles.brand}>Daily Balance</Text>

                    <Pressable
                        onPress={handleStartJourney}
                        accessibilityRole="button"
                        style={({ pressed }) => [styles.tryDemoBtn, pressed && styles.pressed]}
                    >
                        <Text style={styles.tryDemoText}>Try Demo</Text>
                    </Pressable>
                </View>

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>
                        Building Resilience in{'\n'}
                        <Text style={styles.heroAccent}>Young Patients</Text>
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        Help your child prepare for medical visits with confidence. A playful journey before, during,
                        and after the procedure.
                    </Text>

                    <Pressable
                        onPress={handleStartJourney}
                        accessibilityRole="button"
                        style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
                    >
                        <View style={styles.primaryBtnRow}>
                            <Text style={styles.primaryBtnText}>Start Your Journey</Text>
                            <ArrowRight size={20} color="#FFFFFF" />
                        </View>
                    </Pressable>
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Daily Balance?</Text>

                    <View style={styles.cardsColumn}>
                        <FeatureCard
                            title="Built for Kids"
                            body="Not adapted from adults. A playful experience designed for ages 6–10."
                            tint={{ bg: '#EFF6FF', border: '#DBEAFE', iconBg: '#DBEAFE', iconColor: '#2563EB' }}
                            icon={<Smile size={22} color="#2563EB" />}
                        />

                        <FeatureCard
                            title="Full Lifecycle"
                            body='Tools for "Before", "During", and "After" care — not just the waiting room.'
                            tint={{ bg: '#FAF5FF', border: '#E9D5FF', iconBg: '#E9D5FF', iconColor: '#7C3AED' }}
                            icon={<Shield size={22} color="#7C3AED" />}
                        />

                        <FeatureCard
                            title="Real Coping Skills"
                            body="Focuses on skill-building and behavioral change rather than just distraction."
                            tint={{ bg: '#F0FDF4', border: '#DCFCE7', iconBg: '#DCFCE7', iconColor: '#16A34A' }}
                            icon={<Heart size={22} color="#16A34A" />}
                        />
                    </View>
                </View>

                {/* Partners / Trust */}
                <View style={styles.partners}>
                    <Text style={styles.partnersKicker}>Trusted by Leading Providers</Text>

                    <View style={styles.partnerRow}>
                        <Text style={styles.partnerName}>UnitedHealthcare</Text>
                        <Text style={styles.partnerName}>Aetna</Text>
                        <Text style={styles.partnerName}>Cigna</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingBottom: 24,
    },

    navbar: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brand: {
        fontSize: 22,
        fontWeight: '900',
        color: '#7C3AED',
    },
    tryDemoBtn: {
        backgroundColor: '#111827',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    tryDemoText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 14,
    },

    hero: {
        marginTop: 8,
        paddingHorizontal: 18,
        paddingVertical: 26,
        backgroundColor: '#FFF9C4',
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        alignItems: 'center',
    },
    heroTitle: {
        textAlign: 'center',
        fontSize: 34,
        fontWeight: '900',
        color: '#111827',
        lineHeight: 40,
        marginBottom: 14,
    },
    heroAccent: {
        color: '#7C3AED',
    },
    heroSubtitle: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        lineHeight: 22,
        maxWidth: 520,
        marginBottom: 18,
    },

    primaryBtn: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    primaryBtnPressed: {
        transform: [{ scale: 0.99 }],
        opacity: 0.95,
    },
    primaryBtnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    section: {
        paddingHorizontal: 18,
        paddingTop: 26,
        paddingBottom: 14,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 16,
    },
    cardsColumn: {
        width: '100%',
        maxWidth: 520,
        gap: 12,
    },
    card: {
        padding: 18,
        borderRadius: 24,
        borderWidth: 1,
    },
    cardIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 6,
    },
    cardBody: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        lineHeight: 20,
    },

    partners: {
        marginTop: 12,
        backgroundColor: '#111827',
        paddingHorizontal: 18,
        paddingVertical: 22,
        alignItems: 'center',
    },
    partnersKicker: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 14,
        textAlign: 'center',
    },
    partnerRow: {
        gap: 10,
        alignItems: 'center',
    },
    partnerName: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 18,
        fontWeight: '900',
    },

    pressed: {
        opacity: 0.92,
        transform: [{ scale: 0.99 }],
    },
});