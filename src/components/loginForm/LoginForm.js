import React from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

function LoginForm() {
  return (
    <Paper elevation={3} sx={{ padding: 5, maxWidth: 500, mt: 5, mb: 5 }}>
      <Typography variant="h6" component="div" sx={{ fontFamily: 'Mulish, Arial, sans-serif', fontWeight: 'bold', textAlign: 'center', color: '#24695C' }}>
        FinanceScope
      </Typography>
      
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#24695C' }}>
          Логин
        </Typography>
        <TextField label="Введите ваш логин" variant="outlined" fullWidth margin="dense" InputLabelProps={{ style: { color: '#24695C' } }} />

        <Typography variant="subtitle2" sx={{ color: '#24695C', mt: 2 }}>
          Email
        </Typography>
        <TextField label="Введите ваш email" variant="outlined" fullWidth margin="dense" InputLabelProps={{ style: { color: '#24695C' } }} />

        <Typography variant="subtitle2" sx={{ color: '#24695C', mt: 2 }}>
          Пароль
        </Typography>
        <TextField label="Введите ваш пароль" type="password" variant="outlined" fullWidth margin="dense" InputLabelProps={{ style: { color: '#24695C' } }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold', 
              backgroundColor: '#24695C', 
              '&:hover': { 
                backgroundColor: '#1b4e44' 
              } 
            }}
          >
            Войти
          </Button>
        </Box>
        
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#24695C' }}>
          <a href="/" style={{ color: '#24695C', textDecoration: 'none' }}>Забыли пароль?</a>
        </Typography>
      </Box>
    </Paper>
  );
}

export default LoginForm;
