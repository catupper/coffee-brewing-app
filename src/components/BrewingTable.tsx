import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { BrewingStep } from '../types';
import { STEP_INTERVAL_SECONDS, formatTime, COLORS } from '../types';

interface BrewingTableProps {
    brewingSteps: BrewingStep[];
    currentTime: number;
}

const BrewingTable = ({ brewingSteps, currentTime }: BrewingTableProps) => {
    if (brewingSteps.length === 0) return null;
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
                        const nextStepTime = brewingSteps[index + 1]?.time || Infinity;
                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor:
                                        currentTime >= step.time && currentTime < nextStepTime
                                            ? COLORS.currentStep
                                            : currentTime > step.time
                                                ? COLORS.completedStep
                                                : 'transparent',
                                }}
                            >
                                <TableCell align="center" sx={{ fontSize: '1.1rem' }}>
                                    {currentTime >= step.time && currentTime < nextStepTime ? '▶ ' : ''}{formatTime(step.time)}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '1.1rem' }}>{step.amount}ml</TableCell>
                                <TableCell align="center" sx={{ fontSize: '1.1rem' }}>{step.total}ml</TableCell>
                            </TableRow>
                        );
                    })}
                    {brewingSteps.length > 0 && (
                        <TableRow sx={{
                            backgroundColor: currentTime >= brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS ? COLORS.finishStep : 'transparent'
                        }}>
                            <TableCell align="center" sx={{ fontSize: '1.1rem' }}>
                                {currentTime >= brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS ? '▶ ' : ''}
                                {formatTime(brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS)}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.1rem' }} colSpan={2}>
                                ドリッパーを外す
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrewingTable;
