import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import { formatTime, STEP_INTERVAL_SECONDS } from '../types';
import type { BrewingStep } from '../types';

const RING_SIZE = 180;
const OUTER_THICKNESS = 6;
const OUTER_RADIUS = (RING_SIZE - OUTER_THICKNESS) / 2;
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;
const SEGMENT_GAP = 4;

interface StepRingProps {
    totalSteps: number;
    currentStepIndex: number;
    isFinished: boolean;
}

const StepRing = ({ totalSteps, currentStepIndex, isFinished }: StepRingProps) => {
    const theme = useTheme();

    if (totalSteps === 0) {
        return (
            <svg width={RING_SIZE} height={RING_SIZE}>
                <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={OUTER_RADIUS}
                    fill="none"
                    stroke={theme.palette.stepStatus.pendingRing}
                    strokeWidth={OUTER_THICKNESS}
                />
            </svg>
        );
    }

    const totalGap = totalSteps * SEGMENT_GAP;
    const segmentLength = (OUTER_CIRCUMFERENCE - totalGap) / totalSteps;
    const center = RING_SIZE / 2;

    return (
        <svg width={RING_SIZE} height={RING_SIZE}>
            <g transform={`rotate(-90 ${center} ${center})`}>
                {Array.from({ length: totalSteps }, (_, i) => {
                    const offset = i * (segmentLength + SEGMENT_GAP);
                    let color: string;
                    if (isFinished || i < currentStepIndex) {
                        color = theme.palette.stepStatus.completedRing;
                    } else if (i === currentStepIndex) {
                        color = theme.palette.stepStatus.activeRing;
                    } else {
                        color = theme.palette.stepStatus.pendingRing;
                    }

                    return (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={OUTER_RADIUS}
                            fill="none"
                            stroke={color}
                            strokeWidth={OUTER_THICKNESS}
                            strokeDasharray={`${segmentLength} ${OUTER_CIRCUMFERENCE - segmentLength}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke 0.3s ease' }}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

interface TimerControlProps {
    time: number;
    isRunning: boolean;
    currentStepIndex: number;
    brewingSteps: BrewingStep[];
    finishTime: number;
    onToggleRunning: () => void;
    onReset: () => void;
}

const TimerControl = ({
    time,
    isRunning,
    currentStepIndex,
    brewingSteps,
    finishTime,
    onToggleRunning,
    onReset,
}: TimerControlProps) => {
    const theme = useTheme();
    const totalSteps = brewingSteps.length;
    const isFinished = finishTime !== Infinity && time >= finishTime;

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
                width: RING_SIZE,
                height: RING_SIZE,
            }}>
                {/* Outer: segmented step indicator */}
                <StepRing
                    totalSteps={totalSteps}
                    currentStepIndex={currentStepIndex}
                    isFinished={isFinished}
                />

                {/* Inner: current step time progress */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={156}
                    thickness={2.5}
                    sx={{
                        color: 'action.hover',
                        position: 'absolute',
                        left: 12,
                        top: 12,
                    }}
                />
                <CircularProgress
                    variant="determinate"
                    value={stepProgress}
                    size={156}
                    thickness={2.5}
                    sx={{
                        color: theme.palette.stepStatus.activeRing,
                        position: 'absolute',
                        left: 12,
                        top: 12,
                        transition: 'stroke-dashoffset 0.5s ease',
                    }}
                />

                {/* Center text */}
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
                    {totalSteps > 0 && currentStepIndex >= 0 && currentStepIndex < totalSteps && (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.stepStatus.activeRing, mt: 0.25 }}>
                            {brewingSteps[currentStepIndex].amount}ml 注湯
                        </Typography>
                    )}
                    {totalSteps > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                            {currentStepIndex >= 0
                                ? `${currentStepIndex + 1} / ${totalSteps}`
                                : `全${totalSteps}ステップ`
                            }
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Controls */}
            <Box sx={{
                display: 'flex',
                gap: 1.5,
                justifyContent: 'center',
                maxWidth: 280,
                mx: 'auto',
            }}>
                <Button
                    variant="contained"
                    color={isRunning ? 'error' : 'primary'}
                    onClick={onToggleRunning}
                    aria-label={isRunning ? 'タイマー停止' : 'タイマー開始'}
                    startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
                    sx={{ minHeight: 44, flex: 1 }}
                >
                    {isRunning ? 'ストップ' : 'スタート'}
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onReset}
                    disabled={isRunning || time === 0}
                    aria-label="タイマーリセット"
                    startIcon={<ReplayIcon />}
                    sx={{ minHeight: 44, flex: 1, color: 'text.secondary' }}
                >
                    リセット
                </Button>
            </Box>
        </Box>
    );
};

export default TimerControl;
