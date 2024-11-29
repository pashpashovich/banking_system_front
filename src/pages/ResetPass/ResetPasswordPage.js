import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength("Пароль слишком короткий.");
    } else if (!/[A-Z]/.test(value)) {
      setPasswordStrength("Пароль должен содержать заглавные буквы.");
    } else if (!/[0-9]/.test(value)) {
      setPasswordStrength("Пароль должен содержать цифры.");
    } else if (!/[@$!%*?&#]/.test(value)) {
      setPasswordStrength("Пароль должен содержать специальные символы.");
    } else {
      setPasswordStrength("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    if (passwordStrength) {
      setError("Пароль недостаточно сложный.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/confirm-reset", 
        {
          token,
          newPassword: password,
        }
      );

      if (response.status === 200) {
        setSuccess(
          "Пароль успешно изменён. Перенаправляем на страницу входа..."
        );
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Срок действия токена истёк или он недействителен.");
      } else {
        setError("Произошла ошибка. Попробуйте снова.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <Paper elevation={3} className="reset-password-paper">
        <Typography
          variant="h5"
          component="h1"
          className="reset-password-title"
        >
          Сброс пароля
        </Typography>
        {error && (
          <Alert severity="error" className="reset-password-alert">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="reset-password-alert">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Новый пароль"
            type={showPassword ? "text" : "password"}
            fullWidth
            className="reset-password-field"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordStrength && (
            <Typography color="error" variant="body2">
              {passwordStrength}
            </Typography>
          )}
          <TextField
            label="Подтвердите пароль"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            className="reset-password-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
          <Button
              type="submit"
              variant="contained"
              className="reset-password-button"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Сбросить пароль"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default ResetPasswordPage;
