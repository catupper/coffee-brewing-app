import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import type { BrewingStep } from '../types';
import { STEP_INTERVAL_SECONDS, formatTime, COLORS } from '../types';

interface BrewingTableProps {
    brewingSteps: BrewingStep[];
    currentTime: number;
}

type StepStatus = 'current' | 'completed' | 'pending';

const getStepStatus = (currentTime: number, stepTime: number, nextStepTime: number): StepStatus => {
    if (currentTime >= stepTime && currentTime < nextStepTime) return 'current';
    if (currentTime >= nextStepTime) return 'completed';
    return 'pending';
};

const statusStyles: Record<StepStatus, object> = {
    current: {
        backgroundColor: COLORS.currentStep,
        fontWeight: 'bold',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
    },
    completed: {
        backgroundColor: COLORS.completedStep,
        fontWeight: 'normal',
        borderLeft: '4px solid transparent',
        opacity: 0.7,
    },
    pending: {
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        borderLeft: '4px solid transparent',
    },
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
    if (status === 'current') return <PlayArrowIcon sx={{ fontSize: 18, color: 'primary.main', verticalAlign: 'middle', mr: 0.5 }} />;
    if (status === 'completed') return <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'success.main', verticalAlign: 'middle', mr: 0.5 }} />;
    return null;
};

const BrewingTable = ({ brewingSteps, currentTime }: BrewingTableProps) => {
    if (brewingSteps.length === 0) return null;

    const finishTime = brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS;
    const isFinished = currentTime >= finishTime;

    return (
        <TableContainer>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">経過時間</TableCell>
                        <TableCell align="center">注湯量</TableCell>
                        <TableCell align="center">総量</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {brewingSteps.map((step, index) => {
                        const nextStepTime = brewingSteps[index + 1]?.time ?? finishTime;
                        const status = getStepStatus(currentTime, step.time, nextStepTime);
                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    ...statusStyles[status],
                                    transition: 'background-color 0.3s ease, opacity 0.3s ease',
                                }}
                            >
                                <TableCell align="center" sx={{ fontWeight: 'inherit' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <StatusIcon status={status} />
                                        {formatTime(step.time)}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'inherit' }}>
                                    {step.amount}ml
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'inherit' }}>
                                    {step.total}ml
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow sx={{
                        backgroundColor: isFinished ? COLORS.finishStep : 'transparent',
                        borderLeft: isFinished ? '4px solid' : '4px solid transparent',
                        borderLeftColor: isFinished ? 'success.main' : 'transparent',
                        transition: 'background-color 0.3s ease',
                    }}>
                        <TableCell align="center" sx={{ fontWeight: isFinished ? 'bold' : 'normal' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isFinished && <PlayArrowIcon sx={{ fontSize: 18, color: 'success.main', verticalAlign: 'middle', mr: 0.5 }} />}
                                {formatTime(finishTime)}
                            </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: isFinished ? 'bold' : 'normal' }} colSpan={2}>
                            ドリッパーを外す
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrewingTable;
