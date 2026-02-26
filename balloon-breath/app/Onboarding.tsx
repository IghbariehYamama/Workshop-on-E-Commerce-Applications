import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useUser } from '@/app/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type VisitType = 'surgery' | 'blood' | 'mri' | 'xray' | 'dental' | 'vaccine' | null;

type FriendId =
    | 'Lion'
    | 'Bear'
    | 'Bunny'
    | 'Fox'
    | 'Panda'
    | 'Koala'
    | 'Cat'
    | 'Dog';

const TOTAL_STEPS = 4;

const VISIT_TYPES: { id: Exclude<VisitType, null>; label: string; icon: string }[] = [
    { id: 'surgery', label: 'Surgery', icon: '🏥' },
    { id: 'blood', label: 'Blood Test', icon: '💉' },
    { id: 'mri', label: 'MRI Scan', icon: '🔬' },
    { id: 'xray', label: 'X-Ray', icon: '📸' },
    { id: 'dental', label: 'Dental', icon: '🦷' },
    { id: 'vaccine', label: 'Vaccination', icon: '💊' },
];

const FRIENDS: { id: FriendId; emoji: string; label: string }[] = [
    { id: 'Lion', emoji: '🦁', label: 'Lion' },
    { id: 'Bear', emoji: '🐻', label: 'Bear' },
    { id: 'Bunny', emoji: '🐰', label: 'Bunny' },
    { id: 'Fox', emoji: '🦊', label: 'Fox' },
    { id: 'Panda', emoji: '🐼', label: 'Panda' },
    { id: 'Koala', emoji: '🐨', label: 'Koala' },
    { id: 'Cat', emoji: '🐱', label: 'Cat' },
    { id: 'Dog', emoji: '🐶', label: 'Dog' },
];

export default function OnboardingScreen() {
    const { login } = useUser();

    const [step, setStep] = useState(1);

    // Matches your web default: starts Dec 2025
    const [calendarDate, setCalendarDate] = useState(() => new Date(2025, 11, 1));

    const [formData, setFormData] = useState<{
        name: string;
        age: string;
        visitType: VisitType;
        date: number; // day of month
        friend: FriendId;
    }>({
        name: '',
        age: '',
        visitType: null,
        date: 17,
        friend: 'Lion',
    });

    const monthName = useMemo(
        () => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(calendarDate),
        [calendarDate]
    );
    const yearNum = useMemo(() => calendarDate.getFullYear(), [calendarDate]);

    const selectedFriendEmoji = useMemo(() => {
        return FRIENDS.find((f) => f.id === formData.friend)?.emoji ?? '🦁';
    }, [formData.friend]);

    const changeMonth = (offset: number) => {
        setCalendarDate((prev) => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() + offset);
            return d;
        });
    };

    const step1Disabled = step === 1 && (!formData.name.trim() || !formData.age);
    const primaryButtonLabel = step === TOTAL_STEPS ? 'Create Avatar' : 'Continue';

    const handlePrimary = () => {
        if (step < TOTAL_STEPS) {
            setStep((s) => Math.min(TOTAL_STEPS, s + 1));
            return;
        }

        login(formData.name.trim(), formData.age, formData.friend, formData.visitType);
        router.push('/DiscoveryMap');
    };

    const handleBack = () => setStep((s) => Math.max(1, s - 1));

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
        {/* Progress */}
            <View style={styles.progressRow}>
                {[1, 2, 3, 4].map((i) => (
                    <View
                        key={i}
                        style={[styles.progressPill, i === step ? styles.progressPillActive : styles.progressPillIdle]}
                    />
                ))}
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {step === 1 ? (
                    <View style={styles.card}>
                        <View style={styles.heroCircle}>
                            <Text style={styles.heroEmoji}>👶</Text>
                        </View>

                        <Text style={styles.h2}>About Your Child</Text>
                        <Text style={styles.p}>Let&apos;s get to know your little hero</Text>

                        <View style={styles.form}>
                            <View>
                                <Text style={styles.label}>Child&apos;s Name</Text>
                                <TextInput
                                    value={formData.name}
                                    onChangeText={(t) => setFormData((p) => ({ ...p, name: t }))}
                                    placeholder="Enter name or nickname"
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    autoCapitalize="words"
                                    returnKeyType="done"
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Age</Text>

                                {/* Simple “select” replacement: small grid of choices (RN-friendly) */}
                                <View style={styles.ageRow}>
                                    {[6, 7, 8, 9, 10].map((a) => {
                                        const selected = String(a) === formData.age;
                                        return (
                                            <Pressable
                                                key={a}
                                                onPress={() => setFormData((p) => ({ ...p, age: String(a) }))}
                                                style={({ pressed }) => [
                                                    styles.ageChip,
                                                    selected ? styles.ageChipActive : styles.ageChipIdle,
                                                    pressed && styles.pressed,
                                                ]}
                                            >
                                                <Text style={[styles.ageChipText, selected ? styles.ageChipTextActive : styles.ageChipTextIdle]}>
                                                    {a}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>
                ) : null}

                {step === 2 ? (
                    <View style={styles.card}>
                        <View style={styles.heroCircle}>
                            <Text style={styles.heroEmoji}>🩺</Text>
                        </View>

                        <Text style={styles.h2}>Type of Visit</Text>
                        <Text style={styles.p}>
                            What procedure is {formData.name.trim() ? formData.name.trim() : 'your child'} preparing for?
                        </Text>

                        <View style={styles.grid2}>
                            {VISIT_TYPES.map((type) => {
                                const selected = formData.visitType === type.id;
                                return (
                                    <Pressable
                                        key={type.id}
                                        onPress={() => setFormData((p) => ({ ...p, visitType: type.id }))}
                                        style={({ pressed }) => [
                                            styles.typeCard,
                                            selected ? styles.typeCardActive : styles.typeCardIdle,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <Text style={styles.typeIcon}>{type.icon}</Text>
                                        <Text style={styles.typeLabel}>{type.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ) : null}

                {step === 3 ? (
                    <View style={styles.card}>
                        <View style={styles.heroCircle}>
                            <Text style={styles.heroEmoji}>🗓️</Text>
                        </View>

                        <Text style={styles.h2}>When is the Visit?</Text>
                        <Text style={styles.p}>Select the date of the procedure</Text>

                        <View style={styles.calendarCard}>
                            <View style={styles.calendarHeader}>
                                <Pressable
                                    onPress={() => changeMonth(-1)}
                                    style={({ pressed }) => [styles.calendarNavBtn, pressed && styles.pressed]}
                                >
                                    <ChevronLeft size={20} color="#111827" />
                                </Pressable>

                                <Text style={styles.calendarTitle}>
                                    {monthName} {yearNum}
                                </Text>

                                <Pressable
                                    onPress={() => changeMonth(1)}
                                    style={({ pressed }) => [styles.calendarNavBtn, pressed && styles.pressed]}
                                >
                                    <ChevronRight size={20} color="#111827" />
                                </Pressable>
                            </View>

                            <View style={styles.weekRow}>
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                    <Text key={d} style={styles.weekDay}>
                                        {d}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.daysGrid}>
                                {Array.from({ length: 30 }, (_, i) => {
                                    const day = i + 1;
                                    const selected = formData.date === day;
                                    return (
                                        <Pressable
                                            key={day}
                                            onPress={() => setFormData((p) => ({ ...p, date: day }))}
                                            style={({ pressed }) => [
                                                styles.dayCell,
                                                selected ? styles.dayCellActive : styles.dayCellIdle,
                                                pressed && styles.pressed,
                                            ]}
                                        >
                                            <Text style={[styles.dayText, selected ? styles.dayTextActive : styles.dayTextIdle]}>
                                                {day}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                ) : null}

                {step === 4 ? (
                    <View style={[styles.card, { alignItems: 'center' }]}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarEmoji}>{selectedFriendEmoji}</Text>
                        </View>

                        <View style={styles.grid3}>
                            {FRIENDS.map((f) => {
                                const selected = formData.friend === f.id;
                                return (
                                    <Pressable
                                        key={f.id}
                                        onPress={() => setFormData((p) => ({ ...p, friend: f.id }))}
                                        style={({ pressed }) => [
                                            styles.friendCell,
                                            selected ? styles.friendCellActive : styles.friendCellIdle,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <Text style={styles.friendEmoji}>{f.emoji}</Text>
                                        <Text style={styles.friendLabel}>{f.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            {/* Footer controls */}
            <View style={styles.footer}>
                <Pressable
                    onPress={handlePrimary}
                    disabled={step1Disabled}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        step1Disabled ? styles.primaryButtonDisabled : styles.primaryButtonEnabled,
                        pressed && !step1Disabled ? styles.primaryButtonPressed : null,
                    ]}
                >
                    <View style={styles.primaryButtonRow}>
                        <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
                        {step < TOTAL_STEPS ? <ChevronRight size={20} color="#FFFFFF" /> : null}
                    </View>
                </Pressable>

                {step > 1 ? (
                    <Pressable onPress={handleBack} style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
                        <Text style={styles.backLinkText}>Go Back</Text>
                    </Pressable>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 22,
        paddingHorizontal: 18,
    },

    progressRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 14,
    },
    progressPill: {
        height: 6,
        width: 32,
        borderRadius: 999,
    },
    progressPillActive: {
        backgroundColor: '#111827',
    },
    progressPillIdle: {
        backgroundColor: '#E5E7EB',
    },

    scroll: { flex: 1 },
    scrollContent: {
        paddingBottom: 18,
        alignItems: 'center',
    },

    card: {
        width: '100%',
        maxWidth: 420,
    },

    heroCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    heroEmoji: { fontSize: 44 },

    h2: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 6,
    },
    p: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 18,
        paddingHorizontal: 10,
        lineHeight: 18,
    },

    form: { gap: 16 },
    label: {
        fontSize: 14,
        fontWeight: '800',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },

    ageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    ageChip: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    ageChipIdle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
    },
    ageChipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    ageChipText: { fontWeight: '900' },
    ageChipTextIdle: { color: '#4B5563' },
    ageChipTextActive: { color: '#FFFFFF' },

    grid2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    typeCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingVertical: 18,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
    },
    typeCardIdle: {
        borderColor: 'transparent',
    },
    typeCardActive: {
        borderColor: '#111827',
    },
    typeIcon: { fontSize: 34 },
    typeLabel: {
        fontSize: 13,
        fontWeight: '900',
        color: '#374151',
        textAlign: 'center',
    },

    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingHorizontal: 6,
    },
    calendarNavBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarTitle: {
        fontWeight: '900',
        color: '#1F2937',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        marginBottom: 10,
    },
    weekDay: {
        width: '13.5%',
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '900',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    dayCell: {
        width: '13.5%',
        aspectRatio: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCellIdle: {
        backgroundColor: 'transparent',
    },
    dayCellActive: {
        backgroundColor: '#111827',
    },
    dayText: { fontSize: 13, fontWeight: '900' },
    dayTextIdle: { color: '#374151' },
    dayTextActive: { color: '#FFFFFF' },

    avatarCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarEmoji: { fontSize: 56 },

    grid3: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    friendCell: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 2,
    },
    friendCellIdle: { borderColor: 'transparent' },
    friendCellActive: { borderColor: '#111827' },
    friendEmoji: { fontSize: 34 },
    friendLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },

    footer: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        paddingBottom: 18,
        paddingTop: 10,
    },
    primaryButton: {
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonEnabled: {
        backgroundColor: '#4B5563',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    primaryButtonDisabled: {
        backgroundColor: '#D1D5DB',
        opacity: 0.6,
    },
    primaryButtonPressed: {
        transform: [{ scale: 0.99 }],
        backgroundColor: '#111827',
    },
    primaryButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },

    backLink: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    backLinkText: {
        color: '#9CA3AF',
        fontWeight: '900',
        fontSize: 13,
    },

    pressed: {
        opacity: 0.9,
    },
});