import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

const stepStyles: Record<StepStatus, { backgroundColor: string; fontWeight: string }> = {
    current: { backgroundColor: COLORS.currentStep, fontWeight: 'bold' },
    completed: { backgroundColor: COLORS.completedStep, fontWeight: 'normal' },
    pending: { backgroundColor: 'transparent', fontWeight: 'normal' },
};

const stepPrefix: Record<StepStatus, string> = {
    current: '▶ ',
    completed: '✓ ',
    pending: '',
};

const BrewingTable = ({ brewingSteps, currentTime }: BrewingTableProps) => {
    if (brewingSteps.length === 0) return null;

    const finishTime = brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS;
    const isFinished = currentTime >= finishTime;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontSize: '1.2rem' }}>経過時間</TableCell>
                        <TableCell align="center" sx={{ fontSize: '1.2rem' }}>注湯量</TableCell>
                        <TableCell align="center" sx={{ fontSize: '1.2rem' }}>総量</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {brewingSteps.map((step, index) => {
                        const nextStepTime = brewingSteps[index + 1]?.time ?? finishTime;
                        const status = getStepStatus(currentTime, step.time, nextStepTime);
                        const style = stepStyles[status];
                        return (
                            <TableRow
                                key={index}
                                sx={{ backgroundColor: style.backgroundColor }}
                            >
                                <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: style.fontWeight }}>
                                    {stepPrefix[status]}{formatTime(step.time)}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: style.fontWeight }}>
                                    {step.amount}ml
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: style.fontWeight }}>
                                    {step.total}ml
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow sx={{
                        backgroundColor: isFinished ? COLORS.finishStep : 'transparent',
                    }}>
                        <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: isFinished ? 'bold' : 'normal' }}>
                            {isFinished ? '▶ ' : ''}{formatTime(finishTime)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: '1.1rem', fontWeight: isFinished ? 'bold' : 'normal' }} colSpan={2}>
                            ドリッパーを外す
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrewingTable;
