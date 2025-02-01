import React, { useState } from 'react';
import { Container, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const App = () => {
    const [coffeeAmount, setCoffeeAmount] = useState('');
    const [waterAmount, setWaterAmount] = useState('');
    const [flavor, setFlavor] = useState('標準');
    const [strength, setStrength] = useState('標準');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`コーヒー豆: ${coffeeAmount}g, お湯: ${waterAmount}ml, 風味: ${flavor}, 濃さ: ${strength}`);
    };

    return (
        <Container maxWidth="sm" style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                コーヒー抽出計算
            </Typography>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <TextField
                    label="コーヒー豆の量 (g)"
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => setCoffeeAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="お湯の量 (ml)"
                    type="number"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    select
                    label="風味"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="標準">標準</MenuItem>
                    <MenuItem value="甘め">甘め</MenuItem>
                    <MenuItem value="明るめ">明るめ</MenuItem>
                </TextField>
                <TextField
                    select
                    label="濃さ"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="標準">標準</MenuItem>
                    <MenuItem value="濃いめ">濃いめ</MenuItem>
                    <MenuItem value="薄め">薄め</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
                    計算
                </Button>
            </form>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">経過時間</TableCell>
                            <TableCell align="center">注湯量</TableCell>
                            <TableCell align="center">総量</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">0秒</TableCell>
                            <TableCell align="center">60ml</TableCell>
                            <TableCell align="center">60ml</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">45秒</TableCell>
                            <TableCell align="center">60ml</TableCell>
                            <TableCell align="center">120ml</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">1分30秒</TableCell>
                            <TableCell align="center">60ml</TableCell>
                            <TableCell align="center">180ml</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">2分15秒</TableCell>
                            <TableCell align="center">60ml</TableCell>
                            <TableCell align="center">240ml</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">3分</TableCell>
                            <TableCell align="center">60ml</TableCell>
                            <TableCell align="center">300ml</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default App;