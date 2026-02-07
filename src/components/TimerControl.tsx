import { Typography, IconButton, Button } from '@mui/material';
import Box from '@mui/material/Box';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { formatTime } from '../types';

interface TimerControlProps {
    time: number;
    isRunning: boolean;
    soundEnabled: boolean;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onToggleSound: () => void;
}

const TimerControl = ({ time, isRunning, soundEnabled, onStart, onStop, onReset, onToggleSound }: TimerControlProps) => {
    return (
        <Box sx={{ mt: '20px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" role="timer" aria-live="polite">タイマー: {formatTime(time)}</Typography>
            <Box sx={{ ml: '20px', display: 'flex', gap: '10px' }}>
                <IconButton onClick={onToggleSound} aria-label={soundEnabled ? '音声をオフにする' : '音声をオンにする'}>
                    {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
                <Button variant="contained" color="primary" onClick={onStart} aria-label="タイマー開始">
                    スタート
                </Button>
                <Button variant="contained" color="secondary" onClick={onStop} aria-label="タイマー停止">
                    ストップ
                </Button>
                <Button variant="outlined" onClick={onReset} aria-label="タイマーリセット">
                    リセット
                </Button>
            </Box>
        </Box>
    );
};

export default TimerControl;
