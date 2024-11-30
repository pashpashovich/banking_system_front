import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Avatar,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useParams } from "react-router-dom";
import BankDirectorMenu from "../../components/verticalMenu/directorMenu";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import "./TransactionsReport.css";

const apiUrl = "http://localhost:8080/api/transactions/";
const statsUrl = "http://localhost:8080/api/transactions/stats";
const pdfUrl = "http://localhost:8080/api/transactions/generate-pdf";

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  padding: "20px",
  backgroundColor: "#f5f5f5",
});


const MyButton = styled(Button)({
  background: "#6a65ff",
  ":hover": {
    background: "#5a55e0",
  },
});

const Header = styled(AppBar)({
  zIndex: 1300,
  backgroundColor: "#24695C",
});

const MyToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  "@media (max-width: 600px)": {
    flexWrap: "wrap",
  },
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const DateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  "@media (min-width: 600px)": {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marginBottom: "20px",
});

const DatePickerGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const CustomDataGrid = styled(DataGrid)({
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  border: "none",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#24695C",
    color: "white",
    fontSize: "16px",
    textTransform: "uppercase",
  },
  "& .MuiDataGrid-cell": {
    color: "#333",
    fontSize: "14px",
    textAlign: "center",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(36, 105, 92, 0.1)",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#f1f1f1",
    borderTop: "1px solid #ddd",
  },
});

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const TransactionsReport = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [patronymicName, setPatronymicName] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "senderAccountId", headerName: "Счет отправителя", width: 200 },
    { field: "recipientAccountId", headerName: "Счет получателя", width: 200 },
    { field: "amount", headerName: "Сумма", width: 130 },
    { field: "currency", headerName: "Валюта", width: 130 },
    {
      field: "transactionTime",
      headerName: "Дата",
      width: 220,
      valueGetter: (params) => new Date(params.row.transactionTime),
    },
    { field: "transactionType", headerName: "Тип", width: 130 },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/director/${userID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setFirstName(response.data.firstName);
        setSecondName(response.data.secondName);
        setPatronymicName(response.data.patronymicName);
      })
      .catch((error) => handleApiErrors(error));

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

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      })
      .catch((error) => handleApiErrors(error));
  }, [userID, navigate]);

  const handleApiErrors = (error) => {
    if (error.response?.status === 403) {
      navigate("/forbidden");
    } else if (error.response?.status === 401) {
      navigate("/login");
    } else {
      console.error("Ошибка при запросе:", error);
    }
  };

  const fetchStats = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      console.warn("Некорректные значения дат для запроса");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(statsUrl, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (value) {
      const filteredData = transactions.filter(
        (transaction) =>
          String(transaction.senderAccountId).includes(value) ||
          String(transaction.recipientAccountId).includes(value)
      );
      setFilteredTransactions(filteredData);
    } else {
      setFilteredTransactions(transactions);
    }
  };

  const downloadPDF = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      console.warn("Некорректные значения дат для скачивания отчета");
      return;
    }
    setDownloading(true);
    const params = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      firstName,
      secondName,
      patronymicName,
    };
    try {
      const response = await axios.get(pdfUrl, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transaction_report_${startDate.toISOString().split("T")[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8080/api/auth/logout",
        {
          refresh_token: localStorage.getItem("refreshToken"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status !== 200) {
          console.log(localStorage.getItem("refreshToken"));
          return;
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        console.log(localStorage.getItem("refreshToken"));
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <BankDirectorMenu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header position="fixed">
          <MyToolbar>
            <Typography
              style={{ color: "white" }}
              variant="h5"
              noWrap
              component="div"
            >
              Анализ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HeaderAvatar
                alt="User Avatar"
                src={avatarUrl || "/static/images/avatar/1.jpg"}
              />
              <IconButton onClick={() => handleLogout()}>
                <LogoutIcon style={{ color: "white" }} />
              </IconButton>
            </Box>
          </MyToolbar>
        </Header>
        <Toolbar />
        <StyledBox>
          <DateContainer>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={ruLocale}
            >
              <DatePickerGrid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Начальная дата"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </DatePickerGrid>
              <DatePickerGrid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Конечная дата"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </DatePickerGrid>
            </LocalizationProvider>
          </DateContainer>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <MyButton onClick={fetchStats} variant="contained" color="primary">
              Загрузить статистику
            </MyButton>
            <MyButton
              onClick={downloadPDF}
              variant="contained"
              color="secondary"
              disabled={downloading}
              sx={{ ml: 2 }}
            >
              {downloading ? "Загрузка..." : "Скачать отчет в PDF"}
            </MyButton>
          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            stats && (
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  width: "100%",
                  mt: 4,
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#24695C",
                    marginBottom: 2,
                  }}
                >
                  Статистика транзакций
                </Typography>
                <Grid container spacing={3} justifyContent="space-evenly">
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={2}
                      sx={{
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "#F8FAF9",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#4CAF50",
                          marginBottom: 1,
                        }}
                      >
                        Максимальная транзакция
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#24695C", marginBottom: 1 }}
                      >
                        {stats.maxTransaction} BYN
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#E3F2E5",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#4CAF50",
                          },
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={2}
                      sx={{
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "#FFF8E1",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#FFC107",
                          marginBottom: 1,
                        }}
                      >
                        Минимальная транзакция
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#FF9800", marginBottom: 1 }}
                      >
                        {stats.minTransaction} BYN
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (stats.minTransaction / stats.maxTransaction) * 100
                        }
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#FFF3E0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#FFC107",
                          },
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={2}
                      sx={{
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "#E3F2FD",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#2196F3",
                          marginBottom: 1,
                        }}
                      >
                        Средняя транзакция
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#1976D2", marginBottom: 1 }}
                      >
                        {stats.avgTransaction} BYN
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (stats.avgTransaction / stats.maxTransaction) * 100
                        }
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#E1F5FE",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#2196F3",
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )
          )}

          <TextField
            value={searchText}
            onChange={handleSearch}
            placeholder="Поиск по счетам"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Box sx={{ height: 600, width: "100%" }}>
            <CustomDataGrid
              rows={filteredTransactions}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              components={{ Toolbar: CustomToolbar }}
              filterModel={filterModel}
            />
          </Box>
        </StyledBox>
      </Box>
    </Box>
  );
};

export default TransactionsReport;
