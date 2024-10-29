import React from 'react';
import { Typography, Box, Grid, Button, Paper } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings'; // example icon
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

function SavingsProcess() {
  return (
    <Box mt={15} mb={5} mx="auto" maxWidth="md">
      <Typography variant="h5" sx={{
        fontFamily: 'PT Sans, Arial, sans-serif',
        fontWeight: 'bold',
        textAlign: 'left',
      }} gutterBottom>
        Упростите процесс сбережений
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 3, backgroundColor: '#e6f4f1', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SavingsIcon sx={{ fontSize: 40, color: '#24695C', mr: 1 }} />
              <Typography variant="h6">Откройте свой сберегательный счет</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Узнайте выгоды от открытия счета
            </Typography>
            <Button variant="contained" sx={{ mt: 1, backgroundColor: '#24695C', color: '#fff', ':hover': { backgroundColor: '#1d5c50' } }}>
              Узнать больше
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 3, backgroundColor: '#f7f0e6', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocalAtmIcon sx={{ fontSize: 40, color: '#8d6e63', mr: 1 }} />
              <Typography variant="h6">Личные займы от нашего банка</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Пониженный процент 8.99%
            </Typography>
            <Button variant="contained" sx={{ mt: 1, backgroundColor: '#8d6e63', color: '#fff', ':hover': { backgroundColor: '#7b5e56' } }}>
              Узнать больше
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SavingsProcess;
