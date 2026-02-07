import { useState, useEffect, useMemo, useRef } from 'react';
import { Container, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button, Grid } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';

// --- 型定義 ---
interface BrewingStep {
    time: number;
    amount: number;
    total: number;
}

type Flavor = '標準' | '甘め' | '明るめ';
type Strength = '標準' | '濃いめ' | '薄め';

// --- 定数 ---
const FIRST_RATIO = 0.4;
const LAST_RATIO = 0.6;
const STEP_INTERVAL_SECONDS = 45;
const DEFAULT_COFFEE = '20';
const DEFAULT_WATER = '300';
const FLAVOR_RATIOS: Record<Flavor, number> = {
    '甘め': 5 / 12,
    '標準': 0.5,
    '明るめ': 7 / 12,
};
const STRENGTH_POURS: Record<Strength, number> = {
    '濃いめ': 3,
    '標準': 2,
    '薄め': 1,
};

// --- ストレージ ---
const getStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

const setStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

// --- ロジック関数 ---
const calculateFlavorAdjustment = (first40Percent: number, flavor: Flavor): { firstPour: number; secondPour: number } => {
    const firstPourRatio = FLAVOR_RATIOS[flavor];
    const firstPour = first40Percent * firstPourRatio;
    const secondPour = first40Percent - firstPour;
    return { firstPour, secondPour };
};

const calculateStrengthAdjustment = (last60Percent: number, strength: Strength): number[] => {
    const pours = STRENGTH_POURS[strength];
    return Array(pours).fill(last60Percent / pours);
};

const calculateBrewingSteps = (totalWater: number, flavor: Flavor, strength: Strength): BrewingStep[] => {
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

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(1, '0')}分${String(remainingSeconds).padStart(2, '0')}秒`;
};

const playBeep = (frequency: number = 440, duration: number = 200) => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        // Audio not supported
    }
};

// --- コンポーネント ---
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
                // 最終ステップ: ダブルビープ
                playBeep(880, 200);
                setTimeout(() => playBeep(880, 200), 300);
            } else {
                playBeep(440, 200);
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
        <Container maxWidth="sm" style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                4:6 コーヒー抽出ガイド
            </Typography>
            <Accordion style={{ marginBottom: '16px' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>抽出のコツ</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" component="div">
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            <li>挽き目: <strong>粗挽き</strong>を推奨</li>
                            <li>湯温: 浅煎り 93℃ / 中煎り 88℃ / 深煎り 83℃</li>
                            <li>豆と湯の比率: <strong>1:15</strong>を推奨（例: 20g → 300ml）</li>
                            <li><strong>お湯が落ち切ってから</strong>次の注湯を開始する</li>
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <form style={{ marginBottom: '20px' }} onSubmit={(e) => e.preventDefault()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TextField
                        label="コーヒー豆の量 (g)"
                        type="number"
                        value={coffeeAmount}
                        onChange={(e) => handleCoffeeAmountChange(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 1 }}
                    />
                    <Tooltip title={isLinked ? `比率固定中 (1:${ratio.toFixed(1)})` : '比率固定なし'}>
                        <IconButton onClick={() => setIsLinked(!isLinked)} aria-label={isLinked ? '比率固定を解除' : '比率を固定'}>
                            {isLinked ? <LinkIcon /> : <LinkOffIcon />}
                        </IconButton>
                    </Tooltip>
                    <TextField
                        label="お湯の量"
                        type="number"
                        value={waterAmount}
                        onChange={(e) => handleWaterAmountChange(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 1 }}
                    />
                </div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h6">風味:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            select
                            value={flavor}
                            onChange={(e) => setFlavor(e.target.value as Flavor)}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="標準">標準</MenuItem>
                            <MenuItem value="甘め">甘め</MenuItem>
                            <MenuItem value="明るめ">明るめ</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h6">濃さ:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            select
                            value={strength}
                            onChange={(e) => setStrength(e.target.value as Strength)}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="標準">標準</MenuItem>
                            <MenuItem value="濃いめ">濃いめ</MenuItem>
                            <MenuItem value="薄め">薄め</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </form>
            {brewingSteps.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontSize: '1.2rem' }}>経過時間</TableCell>
                                <TableCell align="center" style={{ fontSize: '1.2rem' }}>注湯量</TableCell>
                                <TableCell align="center" style={{ fontSize: '1.2rem' }}>総量</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {brewingSteps.map((step, index) => {
                                const nextStepTime = brewingSteps[index + 1]?.time || Infinity;
                                return (
                                    <TableRow
                                        key={index}
                                        style={{
                                            backgroundColor:
                                                time >= step.time && time < nextStepTime
                                                    ? '#f5e642'
                                                    : time > step.time
                                                        ? '#d3d3d3'
                                                        : 'transparent',
                                        }}
                                    >
                                        <TableCell align="center" style={{ fontSize: '1.1rem' }}>
                                            {time >= step.time && time < nextStepTime ? '▶ ' : ''}{formatTime(step.time)}
                                        </TableCell>
                                        <TableCell align="center" style={{ fontSize: '1.1rem' }}>{step.amount}ml</TableCell>
                                        <TableCell align="center" style={{ fontSize: '1.1rem' }}>{step.total}ml</TableCell>
                                    </TableRow>
                                );
                            })}
                            {brewingSteps.length > 0 && (
                                <TableRow style={{
                                    backgroundColor: time >= brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS ? '#a5d6a7' : 'transparent'
                                }}>
                                    <TableCell align="center" style={{ fontSize: '1.1rem' }}>
                                        {time >= brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS ? '▶ ' : ''}
                                        {formatTime(brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS)}
                                    </TableCell>
                                    <TableCell align="center" style={{ fontSize: '1.1rem' }} colSpan={2}>
                                        ドリッパーを外す
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" role="timer" aria-live="polite">タイマー: {formatTime(time)}</Typography>
                <div style={{ marginLeft: '20px', display: 'flex', gap: '10px' }}>
                    <IconButton onClick={() => setSoundEnabled(!soundEnabled)} aria-label={soundEnabled ? '音声をオフにする' : '音声をオンにする'}>
                        {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={() => setIsRunning(true)} aria-label="タイマー開始">
                        スタート
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setIsRunning(false)} aria-label="タイマー停止">
                        ストップ
                    </Button>
                    <Button variant="outlined" onClick={resetTimer} aria-label="タイマーリセット">
                        リセット
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default App;
