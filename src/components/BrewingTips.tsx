import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const BrewingTips = () => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TipsAndUpdatesIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                    <Typography sx={{ fontWeight: 600 }}>抽出のコツ</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" component="div">
                    <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
                        <li>挽き目: <strong>粗挽き</strong>を推奨</li>
                        <li>湯温: 浅煎り 93℃ / 中煎り 88℃ / 深煎り 83℃</li>
                        <li>豆と湯の比率: <strong>1:15</strong>を推奨（例: 20g → 300ml）</li>
                        <li><strong>お湯が落ち切ってから</strong>次の注湯を開始する</li>
                    </Box>
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default BrewingTips;
