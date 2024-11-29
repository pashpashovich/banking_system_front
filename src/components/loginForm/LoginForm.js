import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import ResetDialog from "../resetPassword/ResetPassword";
import RegisterDialog from '../registerDialog/RegisterDialog';

const USER_ROLES = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR'
};

function LoginForm() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/authenticate',
        { login, password },
        { headers: { 'X-CSRFToken': csrfToken } }
      );

      if (response.status === 200) {
        const { token, refresh, id, role } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('userRole', role);

        switch (role) {
          case USER_ROLES.CLIENT:
            navigate(`/profileCl/${id}`);
            break;
          case USER_ROLES.ADMIN:
            navigate(`/profile/${id}`);
            break;
          case USER_ROLES.DIRECTOR:
            navigate(`/profileDir/${id}`)
            break
          default:
            setErrorMessage('Неизвестная роль пользователя');
        }
      } else {
        setErrorMessage('Неверный логин или пароль');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setErrorMessage('Ваш аккаунт деактивирован. Пожалуйста, свяжитесь с поддержкой.');
        } else if (error.response.status === 401) {
          setErrorMessage('Неверный логин или пароль');
        } else {
          setErrorMessage('Произошла ошибка. Попробуйте еще раз позже.');
        }
      } else {
        setErrorMessage('Произошла ошибка сети. Пожалуйста, проверьте ваше соединение.');
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Paper elevation={3} sx={{ padding: 5, maxWidth: 500, mt: 5, mb: 5 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontFamily: 'Mulish, Arial, sans-serif',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#24695C'
        }}
      >
        FinanceScope
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#24695C' }}>
          Логин
        </Typography>
        <TextField
          label="Введите ваш логин"
          variant="outlined"
          fullWidth
          margin="dense"
          value={login}
          InputLabelProps={{ style: { color: '#24695C' } }}
          onChange={(e) => setLogin(e.target.value)}
        />

        <Typography variant="subtitle2" sx={{ color: '#24695C', mt: 2 }}>
          Пароль
        </Typography>
        <TextField
          label="Введите ваш пароль"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="dense"
          InputLabelProps={{ style: { color: '#24695C' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            type="submit"
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

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: 'center', color: '#24695C', cursor: 'pointer' }}
          onClick={() => setOpenResetDialog(true)}
        >
          Забыли пароль?
        </Typography>
        
        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: 'center', color: '#24695C', cursor: 'pointer' }}
          onClick={() => setOpenRegisterDialog(true)}
        >
          Зарегистрироваться
        </Typography>
      </Box>
      <ResetDialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} />
      <RegisterDialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)} />
    </Paper>
  );
}

export default LoginForm;
