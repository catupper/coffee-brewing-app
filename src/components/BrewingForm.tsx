import { TextField, Typography, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
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
        <Box component="form" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1,
                mb: 3,
            }}>
                <TextField
                    label="コーヒー豆の量"
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => onCoffeeAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!coffeeError}
                    helperText={coffeeError}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <Tooltip title={isLinked ? `比率固定中 (1:${ratio.toFixed(1)})` : '比率固定なし'}>
                        <IconButton
                            onClick={onToggleLink}
                            aria-label={isLinked ? '比率固定を解除' : '比率を固定'}
                            sx={{
                                minWidth: 48,
                                minHeight: 48,
                                color: isLinked ? 'primary.main' : 'text.secondary',
                                bgcolor: isLinked ? 'action.selected' : 'transparent',
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isLinked ? <LinkIcon /> : <LinkOffIcon />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, whiteSpace: 'nowrap', mt: 0.5 }}>
                        {isLinked ? `1:${ratio.toFixed(1)}` : '固定なし'}
                    </Typography>
                </Box>
                <TextField
                    label="お湯の量"
                    type="number"
                    value={waterAmount}
                    onChange={(e) => onWaterAmountChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!waterError}
                    helperText={waterError}
                    inputProps={{ min: 1 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">ml</InputAdornment>,
                    }}
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
