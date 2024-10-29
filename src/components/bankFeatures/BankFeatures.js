import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PhoneIcon from '@mui/icons-material/Phone';

function BankFeatures() {
  const features = [
    { icon: <AccountBalanceIcon fontSize="large" />, text: "Интернет-банкинг" },
    { icon: <SupportAgentIcon fontSize="large" />, text: "Забота о клиентах" },
    { icon: <PhoneIphoneIcon fontSize="large" />, text: "Мобильное приложение" },
    { icon: <PhoneIcon fontSize="large" />, text: "Телефонное обслуживание" },
  ];

  return (
    <Box my={4} textAlign="center" sx={{ backgroundColor: '#f7f0e6', py: 5, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontFamily: 'PT Sans, Arial, sans-serif', fontWeight: 'bold', mb: 10 }}>
        Используйте наш банк когда и где угодно
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item key={index} xs={6} sm={3} textAlign="center">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: 1, 
                  color: '#a67c52',
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="body1" sx={{ color: '#a67c52' }}>{feature.text}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BankFeatures;
