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

function ResetPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    // Здесь будет логика запроса для сброса пароля
    try {
      // Пример запроса на сервер (замените URL на ваш)
      // await axios.post('http://localhost:8080/bank/auth/reset-password', { email });
      onClose(); // Закрыть диалог при успешной отправке
    } catch (error) {
      setErrorMessage("Произошла ошибка при отправке данных.");
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
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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
