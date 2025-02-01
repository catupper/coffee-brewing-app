import React, { useState, useEffect } from 'react';
import { Container, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

const App = () => {
    const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    const setCookie = (name: string, value: string, days: number) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    };

    const [coffeeAmount, setCoffeeAmount] = useState(getCookie('coffeeAmount') || '20');
    const [waterAmount, setWaterAmount] = useState(getCookie('waterAmount') || '300');
    const [flavor, setFlavor] = useState(getCookie('flavor') || '標準');
    const [strength, setStrength] = useState(getCookie('strength') || '標準');
    const [brewingSteps, setBrewingSteps] = useState([]);
    const [isLinked, setIsLinked] = useState(true);

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
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
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(1, '0')}分${String(remainingSeconds).padStart(2, '0')}秒`;
    };

    const calculateFlavorAdjustment = (first40Percent: number, flavor: string): { firstPour: number; secondPour: number } => {
        let firstPourRatio;
        if (flavor === '甘め') {
            firstPourRatio = 0.3;
        } else if (flavor === '標準') {
            firstPourRatio = 0.5;
        } else {
            firstPourRatio = 0.7;
        }
        const firstPour = first40Percent * firstPourRatio;
        const secondPour = first40Percent - firstPour;
        return { firstPour, secondPour };
    };

    const calculateStrengthAdjustment = (last60Percent: number, strength: string): number[] => {
        let pours;
        if (strength === '濃いめ') {
            pours = 3;
        } else if (strength === '標準') {
            pours = 2;
        } else {
            pours = 1;
        }
        return Array(pours).fill(last60Percent / pours);
    };

    const calculateBrewingSteps = (totalWater: number, flavor: string, strength: string) => {
        const first40Percent = totalWater * 0.4;
        const last60Percent = totalWater * 0.6;

        const { firstPour, secondPour } = calculateFlavorAdjustment(first40Percent, flavor);
        const remainingPours = calculateStrengthAdjustment(last60Percent, strength);

        const steps = [
            { time: 0, amount: Math.round(firstPour), total: Math.round(firstPour) },
            { time: 45, amount: Math.round(secondPour), total: Math.round(first40Percent) },
        ];

        let cumulativeTotal = first40Percent;
        remainingPours.forEach((amount, index) => {
            cumulativeTotal += amount;
            steps.push({
                time: (index + 1) * 45 + 90,
                amount: Math.round(amount),
                total: Math.round(cumulativeTotal),
            });
        });

        return steps;
    };

    const handleCoffeeAmountChange = (newCoffee: string) => {
        setCoffeeAmount((prevCoffee) => {
            if (isLinked) {
                setWaterAmount((prevWater) => {
                    return (parseFloat(prevWater) / parseFloat(prevCoffee) * parseFloat(newCoffee)).toFixed(2);
                });
            }
            return newCoffee;
        });
    };

    const handleWaterAmountChange = (newWater: string) => {
        setWaterAmount((prevWater) => {
            if (isLinked) {
                setCoffeeAmount((prevCoffee) => {
                    return (parseFloat(prevCoffee) / parseFloat(prevWater) * parseFloat(newWater)).toFixed(2);
                });
            }
            return newWater;
        });
    };

    useEffect(() => {
        const water = parseFloat(waterAmount);
        if (!isNaN(water)) {
            const steps = calculateBrewingSteps(water, flavor, strength);
            setBrewingSteps(steps);
        }
    }, [coffeeAmount, waterAmount, flavor, strength]);

    useEffect(() => {
        setCookie('coffeeAmount', coffeeAmount, 7);
        setCookie('waterAmount', waterAmount, 7);
        setCookie('flavor', flavor, 7);
        setCookie('strength', strength, 7);
    }, [coffeeAmount, waterAmount, flavor, strength]);

    return (
        <Container maxWidth="sm" style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                コーヒー抽出計算
            </Typography>
            <form style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TextField
                        label="コーヒー豆の量 (g)"
                        type="number"
                        value={coffeeAmount}
                        onChange={(e) => handleCoffeeAmountChange(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <IconButton onClick={() => setIsLinked(!isLinked)}>
                        {isLinked ? <LinkIcon /> : <LinkOffIcon />}
                    </IconButton>
                    <TextField
                        label="お湯の量"
                        type="number"
                        value={waterAmount}
                        onChange={(e) => handleWaterAmountChange(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                </div>
                <TextField
                    select
                    label="風味"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="標準">標準</MenuItem>
                    <MenuItem value="甘め">甘め</MenuItem>
                    <MenuItem value="明るめ">明るめ</MenuItem>
                </TextField>
                <TextField
                    select
                    label="濃さ"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="標準">標準</MenuItem>
                    <MenuItem value="濃いめ">濃いめ</MenuItem>
                    <MenuItem value="薄め">薄め</MenuItem>
                </TextField>
            </form>
            {brewingSteps.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">経過時間</TableCell>
                                <TableCell align="center">注湯量</TableCell>
                                <TableCell align="center">総量</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {brewingSteps.map((step, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{formatTime(step.time)}</TableCell>
                                    <TableCell align="center">{step.amount}ml</TableCell>
                                    <TableCell align="center">{step.total}ml</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Typography variant="h6">タイマー: {formatTime(time)}</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button variant="contained" color="primary" onClick={() => setIsRunning(true)}>
                        スタート
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => setIsRunning(false)}>
                        ストップ
                    </Button>
                    <Button variant="outlined" onClick={resetTimer}>
                        リセット
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default App;