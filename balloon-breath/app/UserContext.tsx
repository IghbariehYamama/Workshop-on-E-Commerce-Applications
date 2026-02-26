import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VisitType = string | null;

export type User = {
    name: string;
    age: string;
    avatar: string; // emoji
    points: number;
    inventory: string[]; // item ids
    visitType: VisitType;
};

export type ShopItem = {
    id: string;
    price: number;
};

type UserContextValue = {
    user: User;
    hydrated: boolean;
    login: (name: string, age: string, friend: string, visitType: VisitType) => void;
    addPoints: (amount: number) => void;
    buyItem: (item: ShopItem) => boolean;
    reset: () => void;
};

const STORAGE_KEY = 'daily_balance_user_v1';

const DEFAULT_USER: User = {
    name: '',
    age: '',
    avatar: '🦁',
    points: 100,
    inventory: [],
    visitType: null,
};

const UserContext = createContext<UserContextValue | null>(null);

/**
 * Custom hook to easily access user data and actions from any component.
 */
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used inside a <UserProvider>');
    }
    return ctx;
};

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(DEFAULT_USER);
    const [hydrated, setHydrated] = useState(false);

    // Load persisted user once on app start
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (!isMounted) return;

                if (saved) {
                    const parsed = JSON.parse(saved) as Partial<User> | null;
                    setUser({ ...DEFAULT_USER, ...(parsed ?? {}) });
                } else {
                    setUser(DEFAULT_USER);
                }
            } catch {
                // If storage is corrupted/unavailable, fall back safely
                if (isMounted) setUser(DEFAULT_USER);
            } finally {
                if (isMounted) setHydrated(true);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    // Persist user changes (after hydration so we don't overwrite the stored value)
    useEffect(() => {
        if (!hydrated) return;

        (async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } catch {
                // Ignore write failures (low storage, permission, etc.)
            }
        })();
    }, [user, hydrated]);

    const login: UserContextValue['login'] = (name, age, friend, visitType) => {
        setUser((prev) => ({
            ...prev,
            name,
            age,
            avatar: friend,
            visitType,
            points: 150, // welcome bonus
        }));
    };

    const addPoints: UserContextValue['addPoints'] = (amount) => {
        setUser((prev) => ({
            ...prev,
            points: prev.points + amount,
        }));
    };

    const buyItem: UserContextValue['buyItem'] = (item) => {
        // Use functional update so it's safe even if multiple updates happen quickly
        let success = false;

        setUser((prev) => {
            if (prev.points < item.price) {
                success = false;
                return prev;
            }

            success = true;
            return {
                ...prev,
                points: prev.points - item.price,
                inventory: [...prev.inventory, item.id],
            };
        });

        return success;
    };

    const reset: UserContextValue['reset'] = () => {
        setUser(DEFAULT_USER);
    };

    const value = useMemo<UserContextValue>(
        () => ({
            user,
            hydrated,
            login,
            addPoints,
            buyItem,
            reset,
        }),
        [user, hydrated]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}