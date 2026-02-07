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
        <Box sx={{
            mt: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
        }}>
            <Typography
                variant="h4"
                role="timer"
                aria-live="polite"
                sx={{ fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}
            >
                {formatTime(time)}
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <IconButton
                    onClick={onToggleSound}
                    aria-label={soundEnabled ? '音声をオフにする' : '音声をオンにする'}
                    sx={{ minWidth: 48, minHeight: 48 }}
                >
                    {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onStart}
                    disabled={isRunning}
                    aria-label="タイマー開始"
                    sx={{ minHeight: 48, px: 3 }}
                >
                    スタート
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onStop}
                    disabled={!isRunning}
                    aria-label="タイマー停止"
                    sx={{ minHeight: 48, px: 3 }}
                >
                    ストップ
                </Button>
                <Button
                    variant="outlined"
                    onClick={onReset}
                    disabled={isRunning || time === 0}
                    aria-label="タイマーリセット"
                    sx={{ minHeight: 48, px: 3 }}
                >
                    リセット
                </Button>
            </Box>
        </Box>
    );
};

export default TimerControl;
