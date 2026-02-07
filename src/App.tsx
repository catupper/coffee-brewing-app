import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Container, Typography, Alert, Card, CardContent, IconButton, Fade, Grow, Collapse, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useColorScheme } from '@mui/material/styles';
import {
    calculateBrewingSteps,
    playBeep,
    getStorage,
    setStorage,
    DEFAULT_COFFEE,
    DEFAULT_WATER,
    STEP_INTERVAL_SECONDS,
} from './types';
import type { BrewingStep, Flavor, Strength } from './types';
import BrewingTips from './components/BrewingTips';
import BrewingForm from './components/BrewingForm';
import BrewingTable from './components/BrewingTable';
import TimerControl from './components/TimerControl';

const App = () => {
    const { mode, setMode } = useColorScheme();
    const [coffeeAmount, setCoffeeAmount] = useState(getStorage('coffeeAmount') || DEFAULT_COFFEE);
    const [waterAmount, setWaterAmount] = useState(getStorage('waterAmount') || DEFAULT_WATER);
    const [flavor, setFlavor] = useState<Flavor>((getStorage('flavor') as Flavor) || '標準');
    const [strength, setStrength] = useState<Strength>((getStorage('strength') as Strength) || '標準');
    const [isLinked, setIsLinked] = useState(true);

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [formExpanded, setFormExpanded] = useState(true);

    const timerActive = isRunning || time > 0;

    useEffect(() => {
        if (isRunning) setFormExpanded(false);
    }, [isRunning]);

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

    const finishTime = useMemo(() => {
        if (brewingSteps.length === 0) return Infinity;
        return brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS;
    }, [brewingSteps]);

    const isBrewingComplete = isRunning && time >= finishTime;

    const prevStepRef = useRef(-1);
    const hasNotifiedCompleteRef = useRef(false);

    useEffect(() => {
        if (!isRunning || !soundEnabled) return;
        if (currentStepIndex !== prevStepRef.current && currentStepIndex >= 0) {
            if (currentStepIndex === brewingSteps.length - 1) {
                playBeep(880, 200);
                setTimeout(() => playBeep(880, 200), 300);
            } else {
                playBeep(440, 200);
            }
            prevStepRef.current = currentStepIndex;
        }
    }, [currentStepIndex, isRunning, soundEnabled, brewingSteps.length]);

    useEffect(() => {
        if (isBrewingComplete && !hasNotifiedCompleteRef.current) {
            hasNotifiedCompleteRef.current = true;
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 200]);
            }
            if (soundEnabled) {
                playBeep(880, 300);
                setTimeout(() => playBeep(880, 300), 400);
                setTimeout(() => playBeep(1760, 500), 800);
            }
        }
    }, [isBrewingComplete, soundEnabled]);

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

    const resetTimer = useCallback(() => {
        setTime(0);
        setIsRunning(false);
        prevStepRef.current = -1;
        hasNotifiedCompleteRef.current = false;
    }, []);

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

    const toggleColorMode = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            py: { xs: 2, sm: 4 },
            transition: 'background-color 0.3s ease',
        }}>
            <Container maxWidth="sm">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 1,
                    }}>
                        <IconButton
                            onClick={toggleColorMode}
                            aria-label={mode === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                            sx={{
                                color: 'text.secondary',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'rotate(30deg)' },
                            }}
                        >
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 0.5 }}>
                        <LocalCafeIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 1,
                            }}
                        >
                            <Box component="span" sx={{
                                fontSize: '2.2rem',
                                fontWeight: 800,
                                color: 'primary.main',
                            }}>
                                4:6
                            </Box>
                            コーヒー抽出ガイド
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        粕谷哲メソッド
                    </Typography>
                </Box>

                {/* Tips */}
                <Box sx={{ mb: 2.5 }}>
                    <BrewingTips />
                </Box>

                {/* Form */}
                <Card sx={{ mb: 2.5, bgcolor: 'background.paper', overflow: 'hidden' }}>
                    {/* Summary bar — always visible, clickable to toggle */}
                    <Box
                        onClick={() => setFormExpanded((v) => !v)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: { xs: 2, sm: 3 },
                            py: 1.5,
                            cursor: 'pointer',
                            userSelect: 'none',
                            '&:hover': { bgcolor: 'action.hover' },
                            transition: 'background-color 0.15s ease',
                        }}
                        role="button"
                        aria-expanded={formExpanded}
                        aria-label="抽出設定の展開/折りたたみ"
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ flexShrink: 0 }}>
                                設定
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                <Chip label={`${coffeeAmount}g / ${waterAmount}ml`} size="small" variant="outlined" />
                                <Chip label={flavor} size="small" variant={flavor !== '標準' ? 'filled' : 'outlined'} color={flavor !== '標準' ? 'primary' : 'default'} />
                                <Chip label={strength} size="small" variant={strength !== '標準' ? 'filled' : 'outlined'} color={strength !== '標準' ? 'primary' : 'default'} />
                            </Box>
                        </Box>
                        <IconButton
                            size="small"
                            tabIndex={-1}
                            sx={{ color: 'text.secondary', ml: 1, flexShrink: 0 }}
                        >
                            {formExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>
                    </Box>

                    {/* Collapsible form body */}
                    <Collapse in={formExpanded} timeout={250}>
                        <CardContent sx={{
                            px: { xs: 2, sm: 3 },
                            pt: 0,
                            pb: { xs: 2, sm: 3 },
                            '&:last-child': { pb: { xs: 2, sm: 3 } },
                        }}>
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
                        </CardContent>
                    </Collapse>
                </Card>

                {/* Completion Alert */}
                <Grow in={isBrewingComplete} unmountOnExit>
                    <Alert
                        severity="success"
                        sx={{
                            mb: 2.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        抽出完了！ドリッパーを外してください
                    </Alert>
                </Grow>

                {/* Timer */}
                <Card sx={{ mb: 2.5, bgcolor: 'background.paper' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                        <TimerControl
                            time={time}
                            isRunning={isRunning}
                            soundEnabled={soundEnabled}
                            currentStepIndex={currentStepIndex}
                            totalSteps={brewingSteps.length}
                            finishTime={finishTime}
                            onStart={() => setIsRunning(true)}
                            onStop={() => setIsRunning(false)}
                            onReset={resetTimer}
                            onToggleSound={() => setSoundEnabled(!soundEnabled)}
                        />
                    </CardContent>
                </Card>

                {/* Brewing Steps Table */}
                <Fade in={brewingSteps.length > 0}>
                    <Card sx={{ mb: 3, bgcolor: 'background.paper', overflow: 'hidden' }}>
                        <BrewingTable brewingSteps={brewingSteps} currentTime={time} />
                    </Card>
                </Fade>

                {/* Footer */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2, pb: 2 }}>
                    4:6 Method by Tetsu Kasuya
                </Typography>
            </Container>
        </Box>
    );
};

export default App;
