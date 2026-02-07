import { TextField, Typography, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
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
        <Box component="form" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'flex-start',
                gap: 1,
                mb: 2,
            }}>
                <TextField
                    label="豆の量"
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => onCoffeeAmountChange(e.target.value)}
                    fullWidth
                    margin="none"
                    required
                    error={!!coffeeError}
                    helperText={coffeeError}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    size="small"
                />
                <TextField
                    label="お湯の量"
                    type="number"
                    value={waterAmount}
                    onChange={(e) => onWaterAmountChange(e.target.value)}
                    fullWidth
                    margin="none"
                    required
                    error={!!waterError}
                    helperText={waterError}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0 }}>
                                <Tooltip title={isLinked ? `比率固定中 (1:${ratio.toFixed(1)})` : '比率固定なし'}>
                                    <IconButton
                                        onClick={onToggleLink}
                                        edge="start"
                                        size="small"
                                        aria-label={isLinked ? `比率固定を解除 (1:${ratio.toFixed(1)})` : '比率を固定'}
                                        sx={{
                                            color: isLinked ? 'primary.main' : 'text.disabled',
                                            transition: 'color 0.2s ease',
                                        }}
                                    >
                                        {isLinked ? <LinkIcon fontSize="small" /> : <LinkOffIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">ml</InputAdornment>,
                    }}
                    size="small"
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    風味
                </Typography>
                <ToggleButtonGroup
                    value={flavor}
                    exclusive
                    onChange={(_, value) => { if (value) onFlavorChange(value as Flavor); }}
                    fullWidth
                    size="small"
                    aria-label="風味の選択"
                >
                    <ToggleButton value="甘め">甘め</ToggleButton>
                    <ToggleButton value="標準">標準</ToggleButton>
                    <ToggleButton value="明るめ">明るめ</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    濃さ
                </Typography>
                <ToggleButtonGroup
                    value={strength}
                    exclusive
                    onChange={(_, value) => { if (value) onStrengthChange(value as Strength); }}
                    fullWidth
                    size="small"
                    aria-label="濃さの選択"
                >
                    <ToggleButton value="薄め">薄め</ToggleButton>
                    <ToggleButton value="標準">標準</ToggleButton>
                    <ToggleButton value="濃いめ">濃いめ</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
};

export default BrewingForm;
