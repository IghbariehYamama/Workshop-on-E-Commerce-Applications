import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Cloud,
    CloudLightning,
    CloudRain,
    Rainbow,
    Star,
    Sun,
} from 'lucide-react-native';
import { useUser } from '@/app/UserContext';

type Step = 1 | 2 | 3;

type ColorId = 'white' | 'gray' | 'blue' | 'dark' | 'black';
type WeatherId = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'rainbow';
type MoodId =
    | 'happy'
    | 'excited'
    | 'calm'
    | 'worried'
    | 'scared'
    | 'sad'
    | 'angry'
    | 'confused'
    | 'brave';

type Selection = {
    color: ColorId | null;
    weather: WeatherId | null;
    mood: MoodId | null;
};

const COLORS: { id: ColorId; swatch: string }[] = [
    { id: 'white', swatch: '#FFFFFF' },
    { id: 'gray', swatch: '#E5E7EB' },
    { id: 'blue', swatch: '#93C5FD' },
    { id: 'dark', swatch: '#475569' },
    { id: 'black', swatch: '#0F172A' },
];

const WEATHERS: {
    id: WeatherId;
    label: string;
    emoji: string;
    icon: React.ReactNode;
}[] = [
    { id: 'sunny', label: 'Sunny', emoji: '☀️', icon: <Sun color="#EAB308" size={40} /> },
    { id: 'cloudy', label: 'Cloudy', emoji: '☁️', icon: <Cloud color="#9CA3AF" size={40} /> },
    { id: 'rainy', label: 'Rainy', emoji: '🌧️', icon: <CloudRain color="#60A5FA" size={40} /> },
    { id: 'stormy', label: 'Stormy', emoji: '⛈️', icon: <CloudLightning color="#A855F7" size={40} /> },
    { id: 'rainbow', label: 'Rainbow', emoji: '🌈', icon: <Rainbow color="#EC4899" size={40} /> },
];

const MOODS: { id: MoodId; label: string; emoji: string }[] = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'excited', label: 'Excited', emoji: '🤩' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'worried', label: 'Worried', emoji: '😟' },
    { id: 'scared', label: 'Scared', emoji: '😨' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'angry', label: 'Angry', emoji: '😠' },
    { id: 'confused', label: 'Confused', emoji: '😕' },
    { id: 'brave', label: 'Brave', emoji: '💪' },
];

function SummaryCard({ selection }: { selection: Selection }) {
    const moodEmoji = selection.mood ? MOODS.find((m) => m.id === selection.mood)?.emoji : null;
    const weatherEmoji = selection.weather
        ? WEATHERS.find((w) => w.id === selection.weather)?.emoji
        : null;
    const colorHex = selection.color ? COLORS.find((c) => c.id === selection.color)?.swatch : null;

    const empty = !moodEmoji && !weatherEmoji && !colorHex;

    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryKicker}>Today I feel...</Text>

            <View style={styles.summaryRow}>
                {moodEmoji ? <Text style={styles.summaryEmoji}>{moodEmoji}</Text> : null}
                {weatherEmoji ? <Text style={styles.summaryEmoji}>{weatherEmoji}</Text> : null}
                {colorHex ? <View style={[styles.summaryColorDot, { backgroundColor: colorHex }]} /> : null}
                {empty ? <Text style={styles.summaryEmpty}>?</Text> : null}
            </View>
        </View>
    );
}

export default function FeelingTrackerScreen() {
    const { addPoints } = useUser();

    const [step, setStep] = useState<Step>(1);
    const [selection, setSelection] = useState<Selection>({
        color: null,
        weather: null,
        mood: null,
    });

    const disabled = useMemo(() => {
        if (step === 1) return !selection.color;
        if (step === 2) return !selection.weather;
        return !selection.mood;
    }, [step, selection.color, selection.weather, selection.mood]);

    const handleHeaderBack = () => {
        if (step > 1) setStep((s) => ((s - 1) as Step));
        else router.push('../(tabs)/map');
    };

    const handleNext = () => {
        if (step < 3) {
            setStep((s) => ((s + 1) as Step));
            return;
        }

        addPoints(20);
        router.push('../(tabs)/map');
    };

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleHeaderBack} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                    <ArrowLeft color="#4B5563" size={22} />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.h1}>How Do I Feel?</Text>
                    <Text style={styles.h1Sub}>Express yourself</Text>
                </View>

                <View style={{ width: 44 }} />
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
                {[1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.stepDot,
                            i <= step ? styles.stepDotActive : styles.stepDotIdle,
                        ]}
                    />
                ))}
            </View>

            {/* Body */}
            <View style={styles.body}>
                {step === 1 ? (
                    <View style={styles.center}>
                        <Text style={styles.h2}>Pick a color for today</Text>
                        <Text style={styles.p}>What color feels right for how you feel?</Text>

                        <View style={styles.colorRow}>
                            {COLORS.map((c) => {
                                const selected = selection.color === c.id;
                                return (
                                    <Pressable
                                        key={c.id}
                                        onPress={() => setSelection((p) => ({ ...p, color: c.id }))}
                                        style={({ pressed }) => [
                                            styles.colorBtn,
                                            { backgroundColor: c.swatch },
                                            selected ? styles.colorBtnSelected : styles.colorBtnIdle,
                                            pressed && styles.pressed,
                                        ]}
                                    />
                                );
                            })}
                        </View>

                        <SummaryCard selection={selection} />
                    </View>
                ) : null}

                {step === 2 ? (
                    <View style={styles.center}>
                        <Text style={styles.h2}>What&apos;s your inner weather?</Text>
                        <Text style={styles.p}>Pick the weather that matches how you feel inside</Text>

                        <View style={styles.grid2}>
                            {WEATHERS.map((w) => {
                                const selected = selection.weather === w.id;
                                return (
                                    <Pressable
                                        key={w.id}
                                        onPress={() => setSelection((p) => ({ ...p, weather: w.id }))}
                                        style={({ pressed }) => [
                                            styles.tile,
                                            selected ? styles.tileSelected : styles.tileIdle,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <View style={styles.weatherIconWrap}>{w.icon}</View>
                                        <Text style={styles.tileLabel}>{w.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <SummaryCard selection={selection} />
                    </View>
                ) : null}

                {step === 3 ? (
                    <View style={styles.center}>
                        <Text style={styles.h2}>How are you feeling today?</Text>

                        <View style={styles.grid3}>
                            {MOODS.map((m) => {
                                const selected = selection.mood === m.id;
                                return (
                                    <Pressable
                                        key={m.id}
                                        onPress={() => setSelection((p) => ({ ...p, mood: m.id }))}
                                        style={({ pressed }) => [
                                            styles.moodTile,
                                            selected ? styles.tileSelected : styles.tileIdle,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <Text style={styles.moodEmoji}>{m.emoji}</Text>
                                        <Text style={styles.moodLabel}>{m.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.rewardPill}>
                            <Star size={18} color="#FACC15" fill="#FACC15" />
                            <Text style={styles.rewardText}>+20 Stars for sharing</Text>
                        </View>
                    </View>
                ) : null}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Pressable
                    onPress={handleNext}
                    disabled={disabled}
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        disabled ? styles.primaryBtnDisabled : styles.primaryBtnEnabled,
                        pressed && !disabled ? styles.primaryBtnPressed : null,
                    ]}
                >
                    <Text style={styles.primaryBtnText}>{step === 3 ? 'Save My Mood' : 'Continue'}</Text>
                </Pressable>

                {step > 1 ? (
                    <Pressable onPress={() => setStep((s) => ((s - 1) as Step))} style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
                        <Text style={styles.backLinkText}>Go Back</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 18,
        paddingTop: 18,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    h1: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    h1Sub: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },

    stepper: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 18,
    },
    stepDot: {
        height: 6,
        width: 32,
        borderRadius: 999,
    },
    stepDotActive: { backgroundColor: '#111827' },
    stepDotIdle: { backgroundColor: '#E5E7EB' },

    body: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    h2: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    p: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 18,
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 18,
    },

    colorRow: {
        flexDirection: 'row',
        gap: 14,
        marginTop: 10,
        marginBottom: 26,
    },
    colorBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 4,
    },
    colorBtnIdle: {
        borderColor: '#FFFFFF',
    },
    colorBtnSelected: {
        borderColor: '#111827',
        transform: [{ scale: 1.08 }],
    },

    summaryCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        alignItems: 'center',
        marginTop: 6,
    },
    summaryKicker: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.4,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
        minHeight: 44,
    },
    summaryEmoji: {
        fontSize: 34,
    },
    summaryColorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    summaryEmpty: {
        fontSize: 34,
        color: '#E5E7EB',
        fontWeight: '900',
    },

    grid2: {
        width: '100%',
        maxWidth: 340,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },
    grid3: {
        width: '100%',
        maxWidth: 360,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 6,
        marginBottom: 16,
        paddingHorizontal: 6,
    },
    tile: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    moodTile: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 26,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    tileIdle: {
        borderColor: 'transparent',
    },
    tileSelected: {
        borderColor: '#111827',
    },
    weatherIconWrap: {
        transform: [{ scale: 1.1 }],
    },
    tileLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#374151',
    },

    moodEmoji: {
        fontSize: 34,
        marginBottom: 6,
    },
    moodLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        textAlign: 'center',
    },

    rewardPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: '#111827',
    },
    rewardText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 12,
    },

    footer: {
        paddingBottom: 18,
        paddingTop: 10,
    },
    primaryBtn: {
        borderRadius: 22,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    primaryBtnEnabled: {
        backgroundColor: '#111827',
    },
    primaryBtnDisabled: {
        backgroundColor: '#D1D5DB',
        opacity: 0.6,
    },
    primaryBtnPressed: {
        transform: [{ scale: 0.99 }],
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    backLink: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 10,
    },
    backLinkText: {
        color: '#9CA3AF',
        fontWeight: '900',
        fontSize: 13,
    },

    pressed: {
        opacity: 0.92,
    },
});