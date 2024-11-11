import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const apiUrl = "http://localhost:8080/api/accounts";

const currencies = [
  { value: "BYN", label: "Белорусский рубль" },
  { value: "USD", label: "Доллар США" },
];

const accountTypes = [
  { value: "CHECKING", label: "Текущий" },
  { value: "SAVINGS", label: "Депозит" },
  { value: "CREDIT", label: "Кредит" },
  { value: "SOCIAL", label: "Социальный" },
];

const CreateAccountPage = () => {
  const { clientId, userID } = useParams();
  const navigate = useNavigate();
  const [newAccountData, setNewAccountData] = useState({
    account_num: "",
    account_balance: "",
    currency: "",
    accountType: "",
    overdraftLimit: "",
    interestRate: "",
    creditLimit: "",
    socialPayments: "",
  });
  const [errorText, setErrorText] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    if (!newAccountData.account_num || !newAccountData.account_balance || !newAccountData.currency || !newAccountData.accountType) {
      setErrorText("Все поля должны быть заполнены");
      return;
    }

    const requestData = {
      accountType: newAccountData.accountType,
      [`${newAccountData.accountType.toLowerCase()}AccountDto`]: {
        accountNum: newAccountData.account_num,
        clientId: clientId,
        accountBalance: parseFloat(newAccountData.account_balance),
        currency: newAccountData.currency,
        openDate: new Date().toISOString().slice(0, 10),
        ...(newAccountData.accountType === "CHECKING" && { overdraftLimit: parseFloat(newAccountData.overdraftLimit) }),
        ...(newAccountData.accountType === "SAVINGS" && { interestRate: parseFloat(newAccountData.interestRate) }),
        ...(newAccountData.accountType === "CREDIT" && { creditLimit: parseFloat(newAccountData.creditLimit) }),
        ...(newAccountData.accountType === "SOCIAL" && { socialPayments: newAccountData.socialPayments }),
      },
    };

    axios
      .post(`${apiUrl}/create`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        navigate(`/data/${userID}`);
      })
      .catch((error) => setErrorText("Ошибка при создании счета"));
  };

  const renderAdditionalField = () => {
    switch (newAccountData.accountType) {
      case "CHECKING":
        return <TextField label="Лимит овердрафта" name="overdraftLimit" value={newAccountData.overdraftLimit} onChange={handleInputChange} fullWidth margin="normal" />;
      case "SAVINGS":
        return <TextField label="Процентная ставка" name="interestRate" value={newAccountData.interestRate} onChange={handleInputChange} fullWidth margin="normal" />;
      case "CREDIT":
        return <TextField label="Кредитный лимит" name="creditLimit" value={newAccountData.creditLimit} onChange={handleInputChange} fullWidth margin="normal" />;
      case "SOCIAL":
        return <TextField label="Тип социальной выплаты" name="socialPayments" value={newAccountData.socialPayments} onChange={handleInputChange} fullWidth margin="normal" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Создать новый счет</Typography>
        {errorText && <Typography color="error" sx={{ mb: 2 }}>{errorText}</Typography>}
        <TextField label="Номер счета" name="account_num" value={newAccountData.account_num} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="Баланс" name="account_balance" value={newAccountData.account_balance} onChange={handleInputChange} fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Валюта</InputLabel>
          <Select name="currency" value={newAccountData.currency} onChange={handleInputChange}>
            {currencies.map((currency) => <MenuItem key={currency.value} value={currency.value}>{currency.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Тип счета</InputLabel>
          <Select name="accountType" value={newAccountData.accountType} onChange={handleInputChange}>
            {accountTypes.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
          </Select>
        </FormControl>
        {renderAdditionalField()}
        <Box mt={3} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>Создать счет</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAccountPage;
