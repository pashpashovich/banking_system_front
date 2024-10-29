import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function RegisterDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    login: "",
    email: "",
    password: "",
    firstName: "",
    secondName: "",
    patronymicName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { login, email, password, firstName, secondName, patronymicName } =
      formData;

    if (
      !login ||
      !email ||
      !password ||
      !firstName ||
      !secondName ||
      !patronymicName
    ) {
      setErrorMessage("Все поля должны быть заполнены.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Введите корректный адрес электронной почты.");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Пароль должен содержать не менее 8 символов, одну заглавную букву и одну цифру."
      );
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/bank/auth/signUp",
        formData
      );
      if (response.status === 200) {
        onClose();
      } else {
        setErrorMessage("Ошибка регистрации. Попробуйте снова.");
      }
    } catch (error) {
      setErrorMessage(
        "Ошибка при отправке данных. Проверьте введенные данные."
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontFamily: "Mulish, Arial, sans-serif",
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#24695C",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{ fontFamily: "Mulish, Arial, sans-serif", fontWeight: "bold" }}
        >
          Регистрация
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#24695C" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="Логин"
          name="login"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.login}
          onChange={handleChange}
        />
        <TextField
          label="Электронная почта"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Имя"
          name="firstName"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField
          label="Фамилия"
          name="secondName"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.secondName}
          onChange={handleChange}
        />
        <TextField
          label="Отчество"
          name="patronymicName"
          variant="outlined"
          fullWidth
          margin="dense"
          value={formData.patronymicName}
          onChange={handleChange}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{
              fontWeight: "bold",
              backgroundColor: "#24695C",
              "&:hover": {
                backgroundColor: "#1b4e44",
              },
            }}
          >
            Зарегистрироваться
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterDialog;
