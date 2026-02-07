import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { BrewingStep } from '../types';
import { STEP_INTERVAL_SECONDS, formatTime } from '../types';

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

const StatusIcon = ({ status }: { status: StepStatus }) => {
    const theme = useTheme();
    if (status === 'current') return <PlayArrowIcon sx={{ fontSize: 18, color: theme.palette.stepStatus.activeBorder, verticalAlign: 'middle', mr: 0.5 }} />;
    if (status === 'completed') return <CheckCircleOutlineIcon sx={{ fontSize: 18, color: theme.palette.stepStatus.completedBorder, verticalAlign: 'middle', mr: 0.5 }} />;
    return null;
};

const BrewingTable = ({ brewingSteps, currentTime }: BrewingTableProps) => {
    const theme = useTheme();

    if (brewingSteps.length === 0) return null;

    const finishTime = brewingSteps[brewingSteps.length - 1].time + STEP_INTERVAL_SECONDS;
    const isFinished = currentTime >= finishTime;

    const statusStyles: Record<StepStatus, object> = {
        current: {
            backgroundColor: theme.palette.stepStatus.activeBg,
            fontWeight: 'bold',
            borderLeft: '4px solid',
            borderLeftColor: theme.palette.stepStatus.activeBorder,
        },
        completed: {
            backgroundColor: theme.palette.stepStatus.completedBg,
            fontWeight: 'normal',
            borderLeft: '4px solid transparent',
            color: theme.palette.text.secondary,
        },
        pending: {
            backgroundColor: theme.palette.stepStatus.pendingBg,
            fontWeight: 'normal',
            borderLeft: '4px solid transparent',
        },
    };

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
                                    transition: 'background-color 0.3s ease, color 0.3s ease',
                                }}
                            >
                                <TableCell align="center" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <StatusIcon status={status} />
                                        {formatTime(step.time)}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
                                    {step.amount}ml
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
                                    {step.total}ml
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow sx={{
                        backgroundColor: isFinished ? theme.palette.stepStatus.finishBg : 'transparent',
                        borderLeft: isFinished ? '4px solid' : '4px solid transparent',
                        borderLeftColor: isFinished ? theme.palette.stepStatus.finishBorder : 'transparent',
                        transition: 'background-color 0.3s ease',
                    }}>
                        <TableCell align="center" sx={{ fontWeight: isFinished ? 'bold' : 'normal' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isFinished && <PlayArrowIcon sx={{ fontSize: 18, color: theme.palette.stepStatus.finishBorder, verticalAlign: 'middle', mr: 0.5 }} />}
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
