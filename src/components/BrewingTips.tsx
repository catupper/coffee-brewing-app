import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';

const BrewingTips = () => {
    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>抽出のコツ</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" component="div">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>挽き目: <strong>粗挽き</strong>を推奨</li>
                        <li>湯温: 浅煎り 93℃ / 中煎り 88℃ / 深煎り 83℃</li>
                        <li>豆と湯の比率: <strong>1:15</strong>を推奨（例: 20g → 300ml）</li>
                        <li><strong>お湯が落ち切ってから</strong>次の注湯を開始する</li>
                    </ul>
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default BrewingTips;
