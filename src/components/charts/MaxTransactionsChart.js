import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, TextField, Container } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const MyButton = styled(Button)({
  background: '#6a65ff',
  ':hover': {
    background: '#5a55e0',
  },
});

const apiUrl = 'http://localhost:8080/api/transactions/max-stats';

const MaxTransactionsChart = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Максимальный перевод',
        data: [],
        backgroundColor: '#8BC34A',
      },
      {
        label: 'Максимальное снятие',
        data: [],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Максимальное начисление',
        data: [],
        backgroundColor: '#388E3C',
      },
    ],
  });

  const fetchMaxTransactions = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    axios
      .get(`${apiUrl}?start_date=${start.toISOString().split('T')[0]}&end_date=${end.toISOString().split('T')[0]}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(response => {
        const data = response.data;
        setChartData({
          labels: data.dates,
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.maxTransfers,
            },
            {
              ...chartData.datasets[1],
              data: data.maxWithdrawals,
            },
            {
              ...chartData.datasets[2],
              data: data.maxDeposits,
            },
          ],
        });
      })
      .catch(error => console.error('Ошибка при загрузке данных:', error));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Начальная дата"
            value={startDate}
            onChange={date => setStartDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Конечная дата"
            value={endDate}
            onChange={date => setEndDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <MyButton variant="contained" onClick={fetchMaxTransactions}>
          Применить
        </MyButton>
      </Box>
      <Bar data={chartData} />
    </Container>
  );
};

export default MaxTransactionsChart;
