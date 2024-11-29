import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../components/verticalMenu/menu";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const apiUrl = "http://localhost:8080/api";

const MyButton = styled(Button)({
  background: "#24695C",
  color: "white",
  fontWeight: "bold",
  ":hover": {
    background: "#1E594D",
  },
});

const DelButton = styled(Button)({
  background: "#E53935",
  color: "white",
  fontWeight: "bold",
  ":hover": {
    background: "#C62828",
  },
});

const AppBarStyled = styled(AppBar)({
  background: "#24695C",
});

const DataGridStyled = styled(DataGrid)({
  backgroundColor: "#fff",
  "& .MuiDataGrid-root": {
    border: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  "& .MuiDataGrid-cell": {
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#f0f0f0",
  },
});

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
  </GridToolbarContainer>
);

function ClientsDataGrid() {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newClientData, setNewClientData] = useState({
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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
  }, [userID]);

  const fetchClients = () => {
    axios
      .get(`${apiUrl}/users/client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => console.error("Ошибка загрузки клиентов:", error));
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    selectedRows.forEach((id) => {
      axios
        .delete(`${apiUrl}/users/client/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then(() => {
          setClients((clients) => clients.filter((client) => client.id !== id));
        })
        .catch((error) => console.error("Ошибка при удалении клиента:", error));
    });
    setSelectedRows([]);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewClientData({
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClientData({ ...newClientData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${apiUrl}/auth/signUp`, newClientData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        fetchClients();
        handleClose();
      })
      .catch((error) => console.error("Ошибка при добавлении клиента:", error));
  };

  const handleDetailsClick = (clientId) => {
    navigate(`/login/client/${clientId}/${userID}`);
  };

  
  const handleEditClick = (id) => {
    navigate(`/client/edit/${id}/${userID}`);
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
    <>
      <CssBaseline />
      <Menu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: 30 } }}>
        <AppBarStyled position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6">Клиенты</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar src={avatarUrl || "/static/images/avatar/1.jpg"} />
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
        </AppBarStyled>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: 'auto' }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <MyButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Добавить клиента
            </MyButton>
            <DelButton
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
            >
              Удалить выбранные
            </DelButton>
          </Box>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridStyled
              rows={clients}
              columns={[
                { field: "id", headerName: "ID", width: 100 },
                { field: "firstName", headerName: "Имя", width: 150 },
                { field: "secondName", headerName: "Фамилия", width: 150 },
                { field: "income", headerName: "Доход", width: 100 },
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
              rowsPerPageOptions={[5, 10, 25]}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbar,
              }}
              onSelectionModelChange={(ids) => setSelectedRows(ids)}
            />
          </Box>
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Добавить нового клиента</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {[
              "login",
              "password",
              "email",
              "firstName",
              "secondName",
              "patronymicName",
              "income",
              "mobilePhone",
              "address",
            ].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={newClientData[field]}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <MyButton onClick={handleSubmit} variant="contained">
            Сохранить
          </MyButton>
          <Button onClick={handleClose} color="secondary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ClientsDataGrid;
