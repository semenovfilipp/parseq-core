import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Alert,
    Grid,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import axios from 'axios';

// Настраиваем axios для работы с CORS
const apiUrl = process.env.REACT_APP_API_URL;

// Примеры запросов
const examples = [
    {
        title: "Поиск однонуклеотидного полиморфизма (SNP)",
        data: {
            rac: "NC_000001.11",
            lap: 69134,
            rap: 69134,
            refKey: "A"
        }
    },
    {
        title: "Поиск делеции",
        data: {
            rac: "NC_000001.11",
            lap: 3751728,
            rap: 3751728,
            refKey: "GT"
        }
    },
    {
        title: "Поиск инсерции",
        data: {
            rac: "NC_000001.11",
            lap: 3751728,
            rap: 3751728,
            refKey: "G"
        }
    },
    {
        title: "Поиск варианта в гене TARDBP",
        data: {
            rac: "NC_000001.11",
            lap: 11082442,
            rap: 11082442,
            refKey: "G"
        }
    },
    {
        title: "Поиск варианта в гене CCDC27",
        data: {
            rac: "NC_000001.11",
            lap: 3669264,
            rap: 3669264,
            refKey: "G"
        }
    }
];

function App() {
    const [formData, setFormData] = useState({
        rac: '',
        lap: '',
        rap: '',
        refKey: ''
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleExampleClick = (example) => {
        setFormData({
            rac: example.data.rac,
            lap: example.data.lap.toString(),
            rap: example.data.rap.toString(),
            refKey: example.data.refKey
        });
        setResult(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const params = {
                rac: formData.rac,
                lap: parseInt(formData.lap),
                rap: parseInt(formData.rap),
                refKey: formData.refKey
            };

            const response = await axios.get(`${apiUrl}/api/variants`, {
                params,
                headers: {
                    'Accept': 'application/json'
                }
            });
            setResult(response.data);
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Произошла ошибка при запросе');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Поиск генетических вариантов
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="RAC"
                                    name="rac"
                                    value={formData.rac}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="LAP"
                                    name="lap"
                                    type="number"
                                    value={formData.lap}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="RAP"
                                    name="rap"
                                    type="number"
                                    value={formData.rap}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="REFKEY"
                                    name="refKey"
                                    value={formData.refKey}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ mt: 2 }}
                                >
                                    Найти вариант
                                </Button>
                            </form>
                        </Paper>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {result && (
                            <Paper sx={{ p: 3, mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Результаты поиска:
                                </Typography>
                                <Typography><strong>RAC:</strong> {result.rac}</Typography>
                                <Typography><strong>LAP:</strong> {result.lap}</Typography>
                                <Typography><strong>RAP:</strong> {result.rap}</Typography>
                                <Typography><strong>REFKEY:</strong> {result.refKey}</Typography>
                                <Typography><strong>VCF ID:</strong> {result.vcfId || 'Н/Д'}</Typography>
                                <Typography><strong>CLNSIG:</strong> {result.clnSig || 'Н/Д'}</Typography>
                                <Typography><strong>CLNREVSTAT:</strong> {result.clnRevStat || 'Н/Д'}</Typography>
                                <Typography><strong>CLNVC:</strong> {result.clnVc || 'Н/Д'}</Typography>
                            </Paper>
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Примеры запросов:
                            </Typography>
                            <Grid container spacing={2}>
                                {examples.map((example, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {example.title}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    onClick={() => handleExampleClick(example)}
                                                >
                                                    Использовать пример
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default App;