import React from 'react';
import { Box, Typography, Paper, LinearProgress, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(3),
  backgroundColor: '#f4f6f8',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: '#24695C',
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  justifyContent: 'space-between',
}));

const ProgressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const HighlightedText = styled(Typography)(({ theme }) => ({
  color: '#1C7947',
  fontWeight: 'bold',
}));

const TransactionStats = ({ data, selectedMonthName, displayDate }) => {
  if (!data) {
    return <Typography>Загрузка данных...</Typography>;
  }

  const calculateCircleValue = (value) => Math.min(100, value);

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" align="center" gutterBottom style={{ color: '#24695C', fontWeight: 'bold' }}>
        Ваш отчет за {selectedMonthName} 2024
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Транзакции за {displayDate} {selectedMonthName} 2024
      </Typography>

      <SectionTitle variant="h6">Общая сумма транзакций</SectionTitle>
      <ProgressBox>
        <StatBox>
          <Typography>Списания</Typography>
          <HighlightedText>{data.totalWithdrawals.toFixed(2)} BYN</HighlightedText>
        </StatBox>
        <LinearProgress
          variant="determinate"
          value={(data.totalWithdrawals / (data.totalWithdrawals + data.totalDeposits)) * 100}
          sx={{ borderRadius: 1, backgroundColor: '#A9D4AC', '& .MuiLinearProgress-bar': { backgroundColor: '#1C7947' } }}
        />
        <StatBox>
          <Typography>Зачисления</Typography>
          <HighlightedText>{data.totalDeposits.toFixed(2)} BYN</HighlightedText>
        </StatBox>
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={(data.totalDeposits / (data.totalWithdrawals + data.totalDeposits)) * 100}
          sx={{ borderRadius: 1, backgroundColor: '#A9D4AC', '& .MuiLinearProgress-bar': { backgroundColor: '#4CAF50' } }}
        />
      </ProgressBox>

      <SectionTitle variant="h6">Статистика операций</SectionTitle>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StatBox>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress
                variant="determinate"
                value={calculateCircleValue(data.maxTransaction)}
                size={60}
                thickness={5}
                sx={{ color: '#1C7947' }}
              />
              <Typography>Макс. операция</Typography>
            </Box>
            <HighlightedText>{data.maxTransaction.toFixed(2)} BYN</HighlightedText>
          </StatBox>
        </Grid>
        <Grid item xs={4}>
          <StatBox>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress
                variant="determinate"
                value={calculateCircleValue(data.minTransaction)}
                size={60}
                thickness={5}
                sx={{ color: '#66BB6A' }}
              />
              <Typography>Мин. операция</Typography>
            </Box>
            <HighlightedText>{data.minTransaction.toFixed(2)} BYN</HighlightedText>
          </StatBox>
        </Grid>
        <Grid item xs={4}>
          <StatBox>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress
                variant="determinate"
                value={calculateCircleValue(data.avgTransaction)}
                size={60}
                thickness={5}
                sx={{ color: '#4CAF50' }}
              />
              <Typography>Средн. операция</Typography>
            </Box>
            <HighlightedText>{data.avgTransaction.toFixed(2)} BYN</HighlightedText>
          </StatBox>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default TransactionStats;
