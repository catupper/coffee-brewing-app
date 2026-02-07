import { Typography, IconButton, Button } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import { formatTime, STEP_INTERVAL_SECONDS } from '../types';

interface TimerControlProps {
    time: number;
    isRunning: boolean;
    soundEnabled: boolean;
    currentStepIndex: number;
    totalSteps: number;
    finishTime: number;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onToggleSound: () => void;
}

const TimerControl = ({
    time,
    isRunning,
    soundEnabled,
    currentStepIndex,
    totalSteps,
    finishTime,
    onStart,
    onStop,
    onReset,
    onToggleSound,
}: TimerControlProps) => {
    const progress = totalSteps > 0 && finishTime > 0 && finishTime !== Infinity
        ? Math.min((time / finishTime) * 100, 100)
        : 0;

    const stepProgress = (() => {
        if (currentStepIndex < 0 || totalSteps === 0) return 0;
        const stepStart = currentStepIndex * STEP_INTERVAL_SECONDS;
        const elapsed = time - stepStart;
        return Math.min((elapsed / STEP_INTERVAL_SECONDS) * 100, 100);
    })();

    return (
        <Box sx={{ textAlign: 'center' }}>
            {/* Timer Display */}
            <Box sx={{
                position: 'relative',
                display: 'inline-flex',
                mb: 2,
            }}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={180}
                    thickness={2}
                    sx={{ color: 'action.hover' }}
                />
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={180}
                    thickness={2}
                    sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        left: 0,
                        transition: 'stroke-dashoffset 0.5s ease',
                    }}
                />
                <CircularProgress
                    variant="determinate"
                    value={stepProgress}
                    size={156}
                    thickness={2.5}
                    sx={{
                        color: 'secondary.main',
                        position: 'absolute',
                        left: 12,
                        top: 12,
                        transition: 'stroke-dashoffset 0.5s ease',
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography
                        variant="h3"
                        role="timer"
                        aria-live="polite"
                        aria-label={`経過時間 ${formatTime(time)}${isRunning ? ' 実行中' : ''}`}
                        sx={{
                            fontWeight: 700,
                            fontFamily: "'Inter', monospace",
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '0.05em',
                            color: 'text.primary',
                            whiteSpace: 'nowrap',
                            fontSize: 'clamp(2rem, 10vw, 3rem)',
                        }}
                    >
                        {formatTime(time)}
                    </Typography>
                    {totalSteps > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            {currentStepIndex >= 0
                                ? `ステップ ${currentStepIndex + 1} / ${totalSteps}`
                                : `全${totalSteps}ステップ`
                            }
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Controls — 2x2 grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                maxWidth: 280,
                mx: 'auto',
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onStart}
                    disabled={isRunning}
                    aria-label="タイマー開始"
                    startIcon={<PlayArrowIcon />}
                    sx={{ minHeight: 44 }}
                >
                    スタート
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onStop}
                    disabled={!isRunning}
                    aria-label="タイマー停止"
                    startIcon={<StopIcon />}
                    sx={{ minHeight: 44 }}
                >
                    ストップ
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onReset}
                    disabled={isRunning || time === 0}
                    aria-label="タイマーリセット"
                    startIcon={<ReplayIcon />}
                    sx={{ minHeight: 44, color: 'text.secondary' }}
                >
                    リセット
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onToggleSound}
                    aria-label={soundEnabled ? '音声をオフにする' : '音声をオンにする'}
                    startIcon={soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    sx={{
                        minHeight: 44,
                        color: soundEnabled ? 'primary.main' : 'text.disabled',
                    }}
                >
                    {soundEnabled ? '通知オン' : '通知オフ'}
                </Button>
            </Box>
        </Box>
    );
};

export default TimerControl;
