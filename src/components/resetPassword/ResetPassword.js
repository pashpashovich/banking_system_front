// ResetPasswordDialog.js
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

function ResetPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password?email=${encodeURIComponent(email)}`);
      setSuccessMessage("Ссылка для сброса пароля была отправлена на ваш email.");
      setEmail("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Пользователь с таким email не найден");
      } else {
        setErrorMessage("Произошла ошибка при отправке данных.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          Восстановление пароля
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
        {successMessage && <Typography color="primary" sx={{ mb: 2 }}>{successMessage}</Typography>}
        <TextField
          label="Введите ваш email"
          type="email"
          variant="outlined"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            disabled={loading} 
            sx={{
              fontWeight: "bold",
              backgroundColor: "#24695C",
              "&:hover": {
                backgroundColor: "#1b4e44",
              },
            }}
          >
            Подтвердить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPasswordDialog;
