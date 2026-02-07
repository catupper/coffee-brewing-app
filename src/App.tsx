import { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Typography } from '@mui/material';
import {
    calculateBrewingSteps,
    playChime,
    getStorage,
    setStorage,
    DEFAULT_COFFEE,
    DEFAULT_WATER,
    COLORS,
} from './types';
import type { BrewingStep, Flavor, Strength } from './types';
import BrewingTips from './components/BrewingTips';
import BrewingForm from './components/BrewingForm';
import BrewingTable from './components/BrewingTable';
import TimerControl from './components/TimerControl';

const App = () => {
    const [coffeeAmount, setCoffeeAmount] = useState(getStorage('coffeeAmount') || DEFAULT_COFFEE);
    const [waterAmount, setWaterAmount] = useState(getStorage('waterAmount') || DEFAULT_WATER);
    const [flavor, setFlavor] = useState<Flavor>((getStorage('flavor') as Flavor) || '標準');
    const [strength, setStrength] = useState<Strength>((getStorage('strength') as Strength) || '標準');
    const [isLinked, setIsLinked] = useState(true);

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const ratio = useMemo(() => {
        const coffee = parseFloat(coffeeAmount);
        const water = parseFloat(waterAmount);
        if (isNaN(coffee) || coffee <= 0 || isNaN(water)) return 15;
        return water / coffee;
    }, [coffeeAmount, waterAmount]);

    const brewingSteps = useMemo<BrewingStep[]>(() => {
        const water = parseFloat(waterAmount);
        if (isNaN(water) || water <= 0) return [];
        return calculateBrewingSteps(water, flavor, strength);
    }, [waterAmount, flavor, strength]);

    const currentStepIndex = useMemo(() => {
        for (let i = brewingSteps.length - 1; i >= 0; i--) {
            if (time >= brewingSteps[i].time) return i;
        }
        return -1;
    }, [time, brewingSteps]);

    const prevStepRef = useRef(-1);

    useEffect(() => {
        if (!isRunning || !soundEnabled) return;
        if (currentStepIndex !== prevStepRef.current && currentStepIndex >= 0) {
            if (currentStepIndex === brewingSteps.length - 1) {
                playChime('finish');
            } else {
                playChime('step');
            }
            prevStepRef.current = currentStepIndex;
        }
    }, [currentStepIndex, isRunning, soundEnabled, brewingSteps.length]);

    useEffect(() => {
        let timer: number | undefined;
        if (isRunning) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
        prevStepRef.current = -1;
    };

    const handleCoffeeAmountChange = (newCoffee: string) => {
        setCoffeeAmount(newCoffee);
        if (isLinked && newCoffee) {
            const coffee = parseFloat(newCoffee);
            setWaterAmount((coffee * ratio).toFixed(2));
        }
    };

    const handleWaterAmountChange = (newWater: string) => {
        setWaterAmount(newWater);
        if (isLinked && newWater) {
            const water = parseFloat(newWater);
            setCoffeeAmount((water / ratio).toFixed(2));
        }
    };

    useEffect(() => {
        setStorage('coffeeAmount', coffeeAmount);
        setStorage('waterAmount', waterAmount);
        setStorage('flavor', flavor);
        setStorage('strength', strength);
    }, [coffeeAmount, waterAmount, flavor, strength]);

    return (
        <Container maxWidth="sm" sx={{ p: '20px', mt: '20px', backgroundColor: COLORS.containerBg, borderRadius: '10px' }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                4:6 コーヒー抽出ガイド
            </Typography>
            <BrewingTips />
            <BrewingForm
                coffeeAmount={coffeeAmount}
                waterAmount={waterAmount}
                flavor={flavor}
                strength={strength}
                isLinked={isLinked}
                ratio={ratio}
                onCoffeeAmountChange={handleCoffeeAmountChange}
                onWaterAmountChange={handleWaterAmountChange}
                onFlavorChange={setFlavor}
                onStrengthChange={setStrength}
                onToggleLink={() => setIsLinked(!isLinked)}
            />
            <BrewingTable brewingSteps={brewingSteps} currentTime={time} />
            <TimerControl
                time={time}
                isRunning={isRunning}
                soundEnabled={soundEnabled}
                onStart={() => setIsRunning(true)}
                onStop={() => setIsRunning(false)}
                onReset={resetTimer}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
        </Container>
    );
};

export default App;
