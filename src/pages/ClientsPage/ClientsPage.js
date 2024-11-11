import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../components/verticalMenu/menu";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const apiUrl = "http://localhost:8080/api";

const FormContainer = styled(Box)({
  padding: "20px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  marginTop: "5px",
  width: "100%",
});

const MainContent = styled(Box)({
  flexGrow: 1,
  padding: "20px",
  marginLeft: "400px",
});

const DataGridContainer = styled(Paper)({
  padding: "20px",
  backgroundColor: "#fff",
  marginTop: "20px",
  width: "100%",
  overflow: "auto",
});

const ErrorTypography = styled(Typography)({
  color: "#f44336",
  marginBottom: 10,
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const ResponsiveBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: "40px",
  width: "100%",
});

const MyButton = styled(Button)({
  background: "#6a65ff",
  ":hover": {
    background: "#5a55e0",
  },
});

const DelButton = styled(Button)({
  background: "#ff1f1f",
  ":hover": {
    background: "#e60000",
  },
});

function ClientsDataGrid() {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newClientData, setNewClientData] = useState({
    id: "",
    login: "",
    password: "",
    email: "",
    firstName: "",
    secondName: "",
    patronymicName: "",
    income: "",
    mobilePhone: "",
    address: "",
    role: "CLIENT",
  });
  const [errorText, setErrorText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
        }
        return Promise.reject(error);
      }
    );

    fetchClients(); 

    axios
      .get(`${apiUrl}/users/${userID}/avatar`, {
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

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [userID, navigate]);

  const fetchClients = () => {
    axios
      .get(`${apiUrl}/users/client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const clientsWithIds = response.data.map((client, index) => ({
          ...client,
          id: client.id || index + 1,
        }));
        setClients(clientsWithIds);
      })
      .catch((error) => console.error("Ошибка загрузки клиентов:", error));
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      setDeleteError("Нет выбранных строк для удаления");
      return;
    }

    setDeleteError("");

    selectedRows.forEach((id) => {
      fetch(`${apiUrl}/users/client/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setClients((clients) => clients.filter((client) => client.id !== id));
          } else {
            console.error("Ошибка при удалении:", response.status);
          }
        })
        .catch((error) => console.error("Ошибка при удалении клиента:", error));
    });
    setSelectedRows([]);
  };

  const handleDetailsClick = (clientId) => {
    navigate(`/login/client/${clientId}/${userID}`);
  };

  const handleEditClick = (id) => {
    navigate(`/client/edit/${id}/${userID}`);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClientData({ ...newClientData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !newClientData.login ||
      !newClientData.password ||
      !newClientData.email ||
      !newClientData.firstName ||
      !newClientData.secondName ||
      !newClientData.mobilePhone ||
      !newClientData.address
    ) {
      setErrorText("Пожалуйста, заполните все поля");
      return;
    }

    const parsedIncome = parseFloat(newClientData.income);
    if (isNaN(parsedIncome)) {
      setErrorText("Доход должен быть числом");
      return;
    }

    axios
      .post(
        `${apiUrl}/auth/signUp`,
        {
          ...newClientData,
          income: parsedIncome,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        fetchClients(); 
        setNewClientData({
          id: "",
          login: "",
          password: "",
          email: "",
          firstName: "",
          secondName: "",
          patronymicName: "",
          income: "",
          mobilePhone: "",
          address: "",
          role: "CLIENT",
        });
        setErrorText("");
      })
      .catch((error) => console.error("Ошибка при добавлении клиента:", error));
  };

  const handleLogout = () => {
    axios
      .post(
        `${apiUrl}/auth/logout`,
        {
          refreshToken: localStorage.getItem("refreshToken"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      })
      .catch((error) => {
        console.error("Ошибка выхода:", error);
      });
  };

  return (
    <ResponsiveBox>
      <MainContent>
        <CssBaseline />
        <Menu userID={userID} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar
            style={{ background: "#24695C" }}
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" noWrap component="div">
                Клиенты
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
          <Container maxWidth="lg">
            <FormContainer component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Добавить нового клиента
                </Typography>
              </Box>
              {errorText && <ErrorTypography>{errorText}</ErrorTypography>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Логин"
                    name="login"
                    value={newClientData.login}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    value={newClientData.password}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Email"
                    name="email"
                    value={newClientData.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Имя"
                    name="firstName"
                    value={newClientData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Фамилия"
                    name="secondName"
                    value={newClientData.secondName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Отчество"
                    name="patronymicName"
                    value={newClientData.patronymicName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Доход"
                    name="income"
                    value={newClientData.income}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Телефон"
                    name="mobilePhone"
                    value={newClientData.mobilePhone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Адрес"
                    name="address"
                    value={newClientData.address}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <MyButton type="submit" variant="contained" color="primary">
                  Добавить клиента
                </MyButton>
              </Box>
            </FormContainer>
            <DataGridContainer>
              <DataGrid
                rows={clients}
                columns={[
                  { field: "id", headerName: "ID", width: 130 },
                  { field: "firstName", headerName: "Имя", width: 130 },
                  { field: "secondName", headerName: "Фамилия", width: 130 },
                  { field: "patronymicName", headerName: "Отчество", width: 130 },
                  { field: "income", headerName: "Доход", width: 130 },
                  { field: "mobilePhone", headerName: "Телефон", width: 150 },
                  { field: "address", headerName: "Адрес", width: 200 },
                  {
                    field: "details",
                    headerName: "Действия",
                    width: 300,
                    renderCell: (params) => (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(params.row.id)}
                          style={{ marginRight: 10 }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleDetailsClick(params.row.id)}
                        >
                          Подробнее
                        </Button>
                      </>
                    ),
                  },
                ]}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
                autoHeight
                getRowId={(row) => row.id}
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel);
                }}
                sx={{
                  "& .MuiDataGrid-root": {
                    overflowX: "auto",
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <DelButton
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                  sx={{ mt: 2 }}
                >
                  Удалить выбранные
                </DelButton>
              </Box>
              {deleteError && <ErrorTypography>{deleteError}</ErrorTypography>}
            </DataGridContainer>
          </Container>
        </Box>
      </MainContent>
    </ResponsiveBox>
  );
}

export default ClientsDataGrid;
