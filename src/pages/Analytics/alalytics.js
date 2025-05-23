import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Avatar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../components/verticalMenu/menu";
import AccountDistributionChart from "../../components/charts/accTypes";
import TransactionsByDateChart from "../../components/charts/transactionsByDateChart";
import ClientsAccountsChart from "../../components/charts/clientsAccountsChart";
import BoxPlotChart from "../../components/charts/boxPlotCharts";
import ClientsIncomeAccountsChart from "../../components/charts/ClientsIncomeAccountsChart";
import MaxTransactionsChart from "../../components/charts/MaxTransactionsChart";
import TransactionTypePieChart from "../../components/charts/TransactionTypePieChart";
import BelarusLoanMap from "../../components/charts/BelarusLoanMap";

import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const apiUrl = "http://localhost:8080/api";

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  padding: "20px",
  backgroundColor: "#f5f5f5",
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const Analytics = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const { userID } = useParams();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
    if (!dataLoaded) {
      axios
        .get(`${apiUrl}/accounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          setAccounts(response.data);
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error);
          setDataLoaded(true);
        });
    }

    axios
      .get(`http://localhost:8080/api/users/${userID}/avatar`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) =>
        setAvatarUrl(`data:image/jpeg;base64,${response.data}`)
      )
      .catch((error) => console.error("Ошибка загрузки аватара:", error));
  }, [dataLoaded]);

  useEffect(() => {
    if (chartType === "transactionsByDate" && startDate && endDate) {
      fetchTransactionsByDate();
    }
  }, [chartType, startDate, endDate]);

  const fetchTransactionsByDate = () => {
    axios
      .get(`${apiUrl}/transactions/by-date`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: { startDate: startDate, endDate: endDate },
      })
      .then((response) => setTransactionsByDate(response.data))
      .catch((error) =>
        console.error("Ошибка при загрузке транзакций:", error)
      );
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const renderChart = () => {
    switch (chartType) {
      case "accountDistribution":
        return <AccountDistributionChart accounts={accounts} />;
      case "transactionsByDate":
        return (
          <TransactionsByDateChart
            transactions={transactionsByDate}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            fetchTransactionsByDate={fetchTransactionsByDate}
          />
        );
      case "clientsAccounts":
        return <ClientsAccountsChart />;
      case "boxPlotChart":
        return (
          <BoxPlotChart
            startDate={startDate}
            endDate={endDate}
            transactionType={transactionType}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setTransactionType={setTransactionType}
          />
        );
      case "clientsIncomeAccounts":
        return <ClientsIncomeAccountsChart />;
      case "maxTransactions":
        return <MaxTransactionsChart />;
      case "transactionTypePieChart":
        return <TransactionTypePieChart />;
         case "map":
        return <BelarusLoanMap />;
      default:
        return (
          <Typography variant="h8">Пожалуйста, выберите тип графика</Typography>
        );
    }
  };

  const handleLogout = () => {
    axios
      .post(
        `${apiUrl}/auth/logout`,
        { refresh_token: localStorage.getItem("refreshToken") },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      })
      .catch((error) => console.error("Ошибка выхода:", error));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Menu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          style={{ background: "#030E32" }}
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" noWrap component="div">
              Графики
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HeaderAvatar
                alt="avatar"
                src={avatarUrl || "/static/images/avatar/1.jpg"}
              />
              <IconButton onClick={handleLogout}>
                <LogoutIcon style={{ color: "white" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <StyledBox>
          <Container maxWidth="md">
            <Box sx={{ marginBottom: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Тип графика</InputLabel>
                <Select
                  value={chartType}
                  onChange={handleChartTypeChange}
                  label="Тип графика"
                >
                  <MenuItem value="accountDistribution">
                    Распределение счетов
                  </MenuItem>
                  <MenuItem value="transactionsByDate">
                    Транзакции по дате
                  </MenuItem>
                  <MenuItem value="clientsAccounts">
                    Доходы клиентов и балансы их счетов
                  </MenuItem>
                  <MenuItem value="boxPlotChart">
                    Коробчатый график транзакций
                  </MenuItem>
                  <MenuItem value="clientsIncomeAccounts">
                    Доходы клиентов и количество счетов
                  </MenuItem>
                  <MenuItem value="maxTransactions">
                    Максимальные транзакции по дням
                  </MenuItem>
                  <MenuItem value="transactionTypePieChart">
                    Количество транзакций по типам
                  </MenuItem>
                  <MenuItem value="map">
                    Карта займов по регионам
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: 4 }}>{renderChart()}</Box>
          </Container>
        </StyledBox>
      </Box>
    </Box>
  );
};

export default Analytics;
