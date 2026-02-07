import { describe, it, expect } from 'vitest';
import {
    calculateFlavorAdjustment,
    calculateStrengthAdjustment,
    calculateBrewingSteps,
    formatTime,
    FIRST_RATIO,
    LAST_RATIO,
    STEP_INTERVAL_SECONDS,
} from '../types';
import type { Flavor, Strength } from '../types';

describe('calculateFlavorAdjustment', () => {
    const first40 = 120; // 300ml * 0.4

    it('標準: 50:50に分割される', () => {
        const result = calculateFlavorAdjustment(first40, '標準');
        expect(result.firstPour).toBe(60);
        expect(result.secondPour).toBe(60);
    });

    it('甘め: 1投目 < 2投目', () => {
        const result = calculateFlavorAdjustment(first40, '甘め');
        expect(result.firstPour).toBeLessThan(result.secondPour);
        expect(result.firstPour).toBeCloseTo(50, 0);
        expect(result.secondPour).toBeCloseTo(70, 0);
    });

    it('明るめ: 1投目 > 2投目', () => {
        const result = calculateFlavorAdjustment(first40, '明るめ');
        expect(result.firstPour).toBeGreaterThan(result.secondPour);
        expect(result.firstPour).toBeCloseTo(70, 0);
        expect(result.secondPour).toBeCloseTo(50, 0);
    });

    it('合計が入力値と一致する', () => {
        const flavors: Flavor[] = ['標準', '甘め', '明るめ'];
        for (const f of flavors) {
            const result = calculateFlavorAdjustment(first40, f);
            expect(result.firstPour + result.secondPour).toBeCloseTo(first40);
        }
    });
});

describe('calculateStrengthAdjustment', () => {
    const last60 = 180; // 300ml * 0.6

    it('薄め: 1回分の配列', () => {
        const result = calculateStrengthAdjustment(last60, '薄め');
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(180);
    });

    it('標準: 2回分の配列', () => {
        const result = calculateStrengthAdjustment(last60, '標準');
        expect(result).toHaveLength(2);
        expect(result[0]).toBe(90);
        expect(result[1]).toBe(90);
    });

    it('濃いめ: 3回分の配列', () => {
        const result = calculateStrengthAdjustment(last60, '濃いめ');
        expect(result).toHaveLength(3);
        expect(result[0]).toBe(60);
    });

    it('合計が入力値と一致する', () => {
        const strengths: Strength[] = ['薄め', '標準', '濃いめ'];
        for (const s of strengths) {
            const result = calculateStrengthAdjustment(last60, s);
            const sum = result.reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(last60);
        }
    });
});

describe('calculateBrewingSteps', () => {
    it('300ml/標準/標準: 4ステップ、合計300ml', () => {
        const steps = calculateBrewingSteps(300, '標準', '標準');
        expect(steps).toHaveLength(4);
        expect(steps[steps.length - 1].total).toBe(300);
    });

    it('300ml/甘め/濃いめ: 5ステップ、合計300ml', () => {
        const steps = calculateBrewingSteps(300, '甘め', '濃いめ');
        expect(steps).toHaveLength(5);
        expect(steps[steps.length - 1].total).toBe(300);
    });

    it('300ml/明るめ/薄め: 3ステップ、合計300ml', () => {
        const steps = calculateBrewingSteps(300, '明るめ', '薄め');
        expect(steps).toHaveLength(3);
        expect(steps[steps.length - 1].total).toBe(300);
    });

    it('全ステップが45秒間隔', () => {
        const steps = calculateBrewingSteps(300, '標準', '標準');
        for (let i = 0; i < steps.length; i++) {
            expect(steps[i].time).toBe(i * STEP_INTERVAL_SECONDS);
        }
    });

    it('各ステップのamountの合計がtotalWaterと一致（丸め誤差修正）', () => {
        const testCases: [number, Flavor, Strength][] = [
            [300, '標準', '標準'],
            [300, '甘め', '濃いめ'],
            [300, '明るめ', '薄め'],
            [250, '甘め', '標準'],
        ];
        for (const [water, flavor, strength] of testCases) {
            const steps = calculateBrewingSteps(water, flavor, strength);
            const amountSum = steps.reduce((sum, s) => sum + s.amount, 0);
            expect(amountSum).toBe(water);
        }
    });

    it('最終ステップのtotalがtotalWaterと一致する', () => {
        const testCases: [number, Flavor, Strength][] = [
            [300, '標準', '標準'],
            [300, '甘め', '濃いめ'],
            [173, '標準', '濃いめ'],
            [250, '甘め', '標準'],
        ];
        for (const [water, flavor, strength] of testCases) {
            const steps = calculateBrewingSteps(water, flavor, strength);
            expect(steps[steps.length - 1].total).toBe(water);
        }
    });

    it('最初の2ステップの合計が40%に相当', () => {
        const steps = calculateBrewingSteps(300, '標準', '標準');
        expect(steps[1].total).toBe(Math.round(300 * FIRST_RATIO));
    });
});

describe('formatTime', () => {
    it('0秒', () => {
        expect(formatTime(0)).toBe('0分00秒');
    });

    it('45秒', () => {
        expect(formatTime(45)).toBe('0分45秒');
    });

    it('90秒', () => {
        expect(formatTime(90)).toBe('1分30秒');
    });

    it('300秒', () => {
        expect(formatTime(300)).toBe('5分00秒');
    });
});
