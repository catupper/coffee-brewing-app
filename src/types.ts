// --- 型定義 ---
export interface BrewingStep {
    time: number;
    amount: number;
    total: number;
}

export type Flavor = '標準' | '甘め' | '明るめ';
export type Strength = '標準' | '濃いめ' | '薄め';

// --- 色定数 ---
export const COLORS = {
    currentStep: 'rgba(164, 119, 100, 0.12)',
    completedStep: 'rgba(164, 119, 100, 0.05)',
    finishStep: 'rgba(85, 139, 47, 0.15)',
    containerBg: 'transparent',
} as const;

// --- 定数 ---
export const FIRST_RATIO = 0.4;
export const LAST_RATIO = 0.6;
export const STEP_INTERVAL_SECONDS = 45;
export const DEFAULT_COFFEE = '20';
export const DEFAULT_WATER = '300';
export const FLAVOR_RATIOS: Record<Flavor, number> = {
    '甘め': 5 / 12,
    '標準': 0.5,
    '明るめ': 7 / 12,
};
export const STRENGTH_POURS: Record<Strength, number> = {
    '濃いめ': 3,
    '標準': 2,
    '薄め': 1,
};

// --- ストレージ ---
export const getStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

// --- ロジック関数 ---
export const calculateFlavorAdjustment = (first40Percent: number, flavor: Flavor): { firstPour: number; secondPour: number } => {
    const firstPourRatio = FLAVOR_RATIOS[flavor];
    const firstPour = first40Percent * firstPourRatio;
    const secondPour = first40Percent - firstPour;
    return { firstPour, secondPour };
};

export const calculateStrengthAdjustment = (last60Percent: number, strength: Strength): number[] => {
    const pours = STRENGTH_POURS[strength];
    return Array(pours).fill(last60Percent / pours);
};

export const calculateBrewingSteps = (totalWater: number, flavor: Flavor, strength: Strength): BrewingStep[] => {
    const first40Percent = totalWater * FIRST_RATIO;
    const last60Percent = totalWater * LAST_RATIO;

    const { firstPour, secondPour } = calculateFlavorAdjustment(first40Percent, flavor);
    const remainingPours = calculateStrengthAdjustment(last60Percent, strength);

    const steps: BrewingStep[] = [
        { time: 0, amount: Math.round(firstPour), total: Math.round(firstPour) },
        { time: STEP_INTERVAL_SECONDS, amount: Math.round(secondPour), total: Math.round(first40Percent) },
    ];

    let cumulativeTotal = first40Percent;
    remainingPours.forEach((amount, index) => {
        cumulativeTotal += amount;
        steps.push({
            time: (index + 2) * STEP_INTERVAL_SECONDS,
            amount: Math.round(amount),
            total: Math.round(cumulativeTotal),
        });
    });

    const lastStep = steps[steps.length - 1];
    const roundingError = totalWater - lastStep.total;
    if (roundingError !== 0) {
        lastStep.amount += roundingError;
        lastStep.total = totalWater;
    }

    return steps;
};

export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    try {
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContext;
    } catch (e) {
        console.warn('Web Audio API is not supported:', e);
        return null;
    }
};

export const playBeep = (frequency: number = 440, duration: number = 200) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
        console.warn('Beep playback failed:', e);
    }
};
