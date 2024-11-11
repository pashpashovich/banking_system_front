import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChartContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(3),
  backgroundColor: '#f4f6f8',
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  color: '#24695C',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const DailyTransactionsChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    day: item.day,
    deposits: item.deposits,
    withdrawals: item.withdrawals,
  }));

  return (
    <StyledChartContainer elevation={3}>
      <ChartTitle variant="h6">Ежедневные транзакции</ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="deposits" fill="#82ca9d" name="Зачисления" radius={[5, 5, 0, 0]} />
          <Bar dataKey="withdrawals" fill="#8884d8" name="Списания" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </StyledChartContainer>
  );
};

export default DailyTransactionsChart;
