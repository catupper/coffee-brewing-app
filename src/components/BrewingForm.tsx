import { TextField, MenuItem, Typography, IconButton, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Tooltip from '@mui/material/Tooltip';
import type { Flavor, Strength } from '../types';

interface BrewingFormProps {
    coffeeAmount: string;
    waterAmount: string;
    flavor: Flavor;
    strength: Strength;
    isLinked: boolean;
    ratio: number;
    onCoffeeAmountChange: (value: string) => void;
    onWaterAmountChange: (value: string) => void;
    onFlavorChange: (value: Flavor) => void;
    onStrengthChange: (value: Strength) => void;
    onToggleLink: () => void;
}

const validateAmount = (value: string, label: string): string => {
    const num = parseFloat(value);
    if (value === '' || isNaN(num)) return `${label}を入力してください`;
    if (num <= 0) return `${label}は0より大きい値にしてください`;
    return '';
};

const BrewingForm = ({
    coffeeAmount,
    waterAmount,
    flavor,
    strength,
    isLinked,
    ratio,
    onCoffeeAmountChange,
    onWaterAmountChange,
    onFlavorChange,
    onStrengthChange,
    onToggleLink,
}: BrewingFormProps) => {
    const coffeeError = validateAmount(coffeeAmount, '豆の量');
    const waterError = validateAmount(waterAmount, 'お湯の量');

    return (
        <form style={{ marginBottom: '20px' }} onSubmit={(e) => e.preventDefault()}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1,
            }}>
                <TextField
                    label="コーヒー豆の量 (g)"
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => onCoffeeAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!coffeeError}
                    helperText={coffeeError}
                    inputProps={{ min: 1 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <Tooltip title={isLinked ? `比率固定中 (1:${ratio.toFixed(1)})` : '比率固定なし'}>
                        <IconButton
                            onClick={onToggleLink}
                            aria-label={isLinked ? '比率固定を解除' : '比率を固定'}
                            sx={{ minWidth: 48, minHeight: 48 }}
                        >
                            {isLinked ? <LinkIcon /> : <LinkOffIcon />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {isLinked ? `1:${ratio.toFixed(1)}` : '固定なし'}
                    </Typography>
                </Box>
                <TextField
                    label="お湯の量 (ml)"
                    type="number"
                    value={waterAmount}
                    onChange={(e) => onWaterAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!waterError}
                    helperText={waterError}
                    inputProps={{ min: 1 }}
                />
            </Box>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <Typography variant="h6">風味:</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        select
                        value={flavor}
                        onChange={(e) => onFlavorChange(e.target.value as Flavor)}
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
                        onChange={(e) => onStrengthChange(e.target.value as Strength)}
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
    );
};

export default BrewingForm;
