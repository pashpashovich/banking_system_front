import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  AppBar,
  Toolbar,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled, useTheme } from "@mui/material/styles";
import ClientMenu from "../../components/verticalMenu/ClientMenu";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const drawerWidth = 240;

const FormContainer = styled(Paper)({
  padding: 24,
  maxWidth: 800,
  margin: "20px auto",
  color: "black",
  borderRadius: 12,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    padding: 16,
    marginTop: 10,
  },
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const MenuContainer = styled(Box)({
  display: "flex",
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 800,
  margin: "0 auto",
  padding: "20px",
  boxSizing: "border-box",
});

const CustomButton = styled(Button)({
  background: "#24695C",
  color: "#FFFFFF",
  ":hover": {
    background: "#1E5B4E",
  },
  borderRadius: "20px",
  textTransform: "none",
});

const SearchContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 16,
});

const AppBarStyled = styled(AppBar)({
  background: "#24695C",
});

const TitleTypography = styled(Typography)({
  color: "white",
  fontWeight: "bold",
});

const handleRequestError = (error, navigate) => {
  if (error.response) {
    if (error.response.status === 401) {
      navigate("/login");
    } else if (error.response.status === 403) {
      navigate("/forbidden");
    }
  } else {
    console.error(error);
  }
};

const AccountTransactionsPage = () => {
  const { userID, accountID } = useParams();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [convertedBalance, setConvertedBalance] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("BYN");
  const [transactionCurrency, setTransactionCurrency] = useState("BYN");
  const [newTransactionData, setNewTransactionData] = useState({
    senderAccountId: "",
    recipientAccountId: "",
    amount: "",
    transactionType: "withdrawal",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    transactionType: "",
    currency: "",
  });
  const [balanceError, setBalanceError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiUrl = "http://localhost:8080/api/accounts";

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${accountID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setAccountInfo(response.data);
        fetchConvertedBalance(
          response.data.accountBalance.toString(),
          response.data.currency,
          selectedCurrency
        );
      } catch (error) {
        handleRequestError(error, navigate);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/${accountID}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        handleRequestError(error, navigate);
      }
    };

    const fetchClientInfo = async () => {
      if (userID) {
        axios
          .get(`http://localhost:8080/api/users/${userID}/avatar`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((response) => {
            if (response.data) {
              setAvatarUrl(`data:image/jpeg;base64,${response.data}`);
            }
          })
          .catch((error) => {
            console.error("Ошибка загрузки аватара:", error);
          });
      }
    };

    fetchAccountInfo();
    fetchTransactions();
    fetchClientInfo();
  }, [accountID, selectedCurrency, userID, navigate]);

  const fetchConvertedBalance = async (balance, fromCurrency, toCurrency) => {
    axios
      .get(
        `http://localhost:8080/api/accounts/convert/${balance}/${fromCurrency}/${toCurrency}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        setConvertedBalance(response.data[toCurrency]);
      });
  };

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    if (accountInfo) {
      fetchConvertedBalance(
        accountInfo.accountBalance.toString(),
        accountInfo.currency,
        newCurrency
      );
    }
  };

  const handleTransactionCurrencyChange = (event) => {
    setTransactionCurrency(event.target.value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransactionData({ ...newTransactionData, [name]: value });
  };

  const handleAddTransaction = async () => {
    const { amount, transactionType, recipientAccountId } = newTransactionData;
    const transactionData = {
      senderAccountId: accountID,
      recipientAccountId: "",
      amount: amount,
      transactionType: newTransactionData.transactionType.toUpperCase(),
      currency: transactionCurrency,
      transactionTime: (() => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 3);
        return currentDate.toISOString();
    })(),
      };
    if (transactionType === "TRANSFER") {
      transactionData.recipientAccountId = recipientAccountId;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/transactions/",
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      setTransactions([...transactions, response.data]);
      setNewTransactionData({
        senderAccountId: "",
        recipientAccountId: "",
        amount: "",
        transactionType: "withdrawal",
        currency: "BYN",
        transactionTime: ""
      });
      console.log(response.data.transactionTime)
       await generateReceipt(response.data.id);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setBalanceError("Недостаточно средств для выполнения операции.");
      } else {
        handleRequestError(error, navigate);
      }
    }
  };

  const generateReceipt = async (transactionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/receipt/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          responseType: 'blob',  
        }
      );
    
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
            link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleRequestError(error, navigate);
    }
  };

  const renderAdditionalAccountInfo = () => {
    if (!accountInfo) return null;

    switch (accountInfo.account_type) {
      case "Текущий счет":
        return (
          <Typography variant="body1" gutterBottom>
            Лимит овердрафта: {accountInfo.overdraft_limit} BYN
          </Typography>
        );
      case "Сберегательный счет":
        return (
          <Typography variant="body1" gutterBottom>
            Процентная ставка: {accountInfo.interest_rate}%
          </Typography>
        );
      case "Кредитный счет":
        return (
          <Typography variant="body1" gutterBottom>
            Кредитный лимит: {accountInfo.credit_limit} BYN
          </Typography>
        );
      case "Социальный счет":
        return (
          <Typography variant="body1" gutterBottom>
            Социальные выплаты:{" "}
            {accountInfo.social_payments ? "Включены" : "Отключены"}
          </Typography>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    axios.post(
      'http://localhost:8080/api/auth/logout',
      {
        refresh_token: localStorage.getItem('refreshToken'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      }
    )
    .then(response => {
      if (response.status !== 200) {
        console.log(localStorage.getItem('refreshToken'));
        return;
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    })
    .catch(error => {
      console.error(error);
      console.log(localStorage.getItem('refreshToken'));
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.transactionType.includes(filters.transactionType) &&
      transaction.currency.includes(filters.currency) &&
      (transaction.transactionType.includes(searchQuery) ||
        transaction.amount.toString().includes(searchQuery))
    );
  });

  return (
    <MenuContainer>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <AppBarStyled position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <TitleTypography variant="h6" noWrap component="div">
            Транзакции
          </TitleTypography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HeaderAvatar
              alt="Avatar"
              src={avatarUrl || "/static/images/avatar/1.jpg"}
            />
            <IconButton onClick={handleLogout}>
              <LogoutIcon style={{ color: "white" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <ContentContainer>
          <FormContainer elevation={3}>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <IconButton onClick={handleBack} sx={{ color: "#24695C" }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, color: "#24695C", fontWeight: "bold" }}>
                Назад
              </Typography>
            </Box>
            {accountInfo && (
              <Box marginBottom={3}>
                <Typography variant="h5" gutterBottom align="center" style={{ color: "#24695C", fontWeight: "bold" }}>
                  Информация о счете {accountID}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Номер счета: {accountInfo.accountNum}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Тип счета: {accountInfo.accountType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Баланс: {convertedBalance ? convertedBalance.toFixed(2) : accountInfo.accountBalance} {selectedCurrency}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Дата открытия: {accountInfo.openDate}
                </Typography>
                {renderAdditionalAccountInfo()}
                <Divider sx={{ marginY: 3 }} />
                <Box marginTop={3}>
                  <Typography variant="h5" gutterBottom align="center" style={{ color: "#24695C", fontWeight: "bold" }}>
                    Добавить транзакцию
                  </Typography>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel>Тип транзакции</InputLabel>
                    <Select
                      name="transactionType"
                      value={newTransactionData.transactionType}
                      onChange={handleInputChange}
                      label="Тип транзакции"
                    >
                      <MenuItem value="WITHDRAWAL">Снятие</MenuItem>
                      <MenuItem value="TRANSFER">Перевод</MenuItem>
                    </Select>
                  </FormControl>
                  {newTransactionData.transactionType === "TRANSFER" && (
                    <TextField
                      label="Номер счета получателя"
                      name="recipientAccountId"
                      value={newTransactionData.recipientAccountId}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                  <TextField
                    label="Сумма"
                    name="amount"
                    value={newTransactionData.amount}
                    onChange={handleInputChange}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                  {balanceError && (
                    <Typography color="error" variant="body2">
                      {balanceError}
                    </Typography>
                  )}
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <InputLabel>Валюта</InputLabel>
                    <Select
                      value={transactionCurrency}
                      onChange={handleTransactionCurrencyChange}
                      label="Валюта"
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="RUB">RUB</MenuItem>
                      <MenuItem value="CNY">CNY</MenuItem>
                      <MenuItem value="BYN">BYN</MenuItem>
                    </Select>
                  </FormControl>
                  <CustomButton
                    onClick={handleAddTransaction}
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Добавить транзакцию
                  </CustomButton>
                </Box>
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel>Валюта</InputLabel>
                  <Select
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    label="Валюта"
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="RUB">RUB</MenuItem>
                    <MenuItem value="CNY">CNY</MenuItem>
                    <MenuItem value="BYN">BYN</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </FormContainer>
          <FormContainer elevation={3} sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom align="center" style={{ color: "#24695C", fontWeight: "bold" }}>
              Транзакции счета {accountID}
            </Typography>
            <SearchContainer>
              <TextField
                label="Поиск"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                sx={{ mr: 1 }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel>Тип транзакции</InputLabel>
                <Select
                  name="transactionType"
                  value={filters.transactionType}
                  onChange={handleFilterChange}
                  label="Тип транзакции"
                >
                  <MenuItem value="">Все</MenuItem>
                  <MenuItem value="WITHDRAWAL">Снятие</MenuItem>
                  <MenuItem value="TRANSFER">Перевод</MenuItem>
                  <MenuItem value="DEPOSIT">Депозит</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Валюта</InputLabel>
                <Select
                  name="currency"
                  value={filters.currency}
                  onChange={handleFilterChange}
                  label="Валюта"
                >
                  <MenuItem value="">Все</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="RUB">RUB</MenuItem>
                  <MenuItem value="CNY">CNY</MenuItem>
                  <MenuItem value="BYN">BYN</MenuItem>
                </Select>
              </FormControl>
            </SearchContainer>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Время</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Валюта</TableCell>
                    <TableCell>Чек</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.transactionTime).toLocaleString("ru-BY", { timeZone: "Europe/Minsk" })}
                      </TableCell>
                      <TableCell>{transaction.transactionType}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>
                        <CustomButton variant="contained" onClick={() => generateReceipt(transaction.id)}>
                          Скачать чек
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </FormContainer>
        </ContentContainer>
      </Box>
    </MenuContainer>
  );
};

export default AccountTransactionsPage;
