import { TextField, MenuItem, Typography, IconButton, Grid } from '@mui/material';
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
    return (
        <form style={{ marginBottom: '20px' }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TextField
                    label="コーヒー豆の量 (g)"
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => onCoffeeAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    inputProps={{ min: 1 }}
                />
                <Tooltip title={isLinked ? `比率固定中 (1:${ratio.toFixed(1)})` : '比率固定なし'}>
                    <IconButton onClick={onToggleLink} aria-label={isLinked ? '比率固定を解除' : '比率を固定'}>
                        {isLinked ? <LinkIcon /> : <LinkOffIcon />}
                    </IconButton>
                </Tooltip>
                <TextField
                    label="お湯の量"
                    type="number"
                    value={waterAmount}
                    onChange={(e) => onWaterAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    inputProps={{ min: 1 }}
                />
            </div>
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
