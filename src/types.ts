// --- 型定義 ---
export interface BrewingStep {
    time: number;
    amount: number;
    total: number;
}

export type Flavor = '標準' | '甘め' | '明るめ';
export type Strength = '標準' | '濃いめ' | '薄め';

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

const BELL_SRC = `${import.meta.env.BASE_URL}bell.mp3`;

let audioContext: AudioContext | null = null;
let bellBuffer: AudioBuffer | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
};

const loadBellBuffer = async (): Promise<void> => {
    if (bellBuffer) return;
    const ctx = getAudioContext();
    const response = await fetch(BELL_SRC);
    const arrayBuffer = await response.arrayBuffer();
    bellBuffer = await ctx.decodeAudioData(arrayBuffer);
};

/** ユーザージェスチャー内で呼び出し、AudioContextをアンロックする */
export const unlockAudio = async (): Promise<void> => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
        await loadBellBuffer();
    } catch (e) {
        console.warn('Audio unlock failed:', e);
    }
};

export const playBell = (): void => {
    try {
        const ctx = getAudioContext();
        if (!bellBuffer || ctx.state !== 'running') return;
        const source = ctx.createBufferSource();
        source.buffer = bellBuffer;
        const gain = ctx.createGain();
        gain.gain.value = 0.5;
        source.connect(gain).connect(ctx.destination);
        source.start();
    } catch (e) {
        console.warn('Bell playback failed:', e);
    }
};

/** 指定回数のベル音をAudioContextタイミングでスケジュール再生する */
export const playBellSequence = (count: number, intervalSec: number): void => {
    try {
        const ctx = getAudioContext();
        if (!bellBuffer || ctx.state !== 'running') return;
        for (let i = 0; i < count; i++) {
            const source = ctx.createBufferSource();
            source.buffer = bellBuffer;
            const gain = ctx.createGain();
            gain.gain.value = 0.5;
            source.connect(gain).connect(ctx.destination);
            source.start(ctx.currentTime + i * intervalSec);
        }
    } catch (e) {
        console.warn('Bell sequence playback failed:', e);
    }
};
