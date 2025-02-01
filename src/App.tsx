// src/App.tsx
import React, { useState } from 'react';

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
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1>コーヒー抽出計算</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        コーヒー豆の量 (g):
                        <input
                            type="number"
                            value={coffeeAmount}
                            onChange={(e) => setCoffeeAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        お湯の量 (ml):
                        <input
                            type="number"
                            value={waterAmount}
                            onChange={(e) => setWaterAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        風味:
                        <select value={flavor} onChange={(e) => setFlavor(e.target.value)}>
                            <option value="標準">標準</option>
                            <option value="甘め">甘め</option>
                            <option value="明るめ">明るめ</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        濃さ:
                        <select value={strength} onChange={(e) => setStrength(e.target.value)}>
                            <option value="標準">標準</option>
                            <option value="濃いめ">濃いめ</option>
                            <option value="薄め">薄め</option>
                        </select>
                    </label>
                </div>
                <button type="submit">計算</button>
            </form>
            <div style={{ marginTop: '20px' }}>
                <h2>抽出モデル</h2>
                <table border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>経過時間</th>
                        <th>注湯量</th>
                        <th>総量</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0秒</td>
                        <td>60ml</td>
                        <td>60ml</td>
                    </tr>
                    <tr>
                        <td>45秒</td>
                        <td>60ml</td>
                        <td>120ml</td>
                    </tr>
                    <tr>
                        <td>1分30秒</td>
                        <td>60ml</td>
                        <td>180ml</td>
                    </tr>
                    <tr>
                        <td>2分15秒</td>
                        <td>60ml</td>
                        <td>240ml</td>
                    </tr>
                    <tr>
                        <td>3分</td>
                        <td>60ml</td>
                        <td>300ml</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
