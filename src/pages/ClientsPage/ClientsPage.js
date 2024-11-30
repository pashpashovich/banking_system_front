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
  Alert,
  MenuItem,
  Paper,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";
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
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#24695C",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  "& .MuiDataGrid-cell": {
    color: "#333",
    borderBottom: "1px solid #ddd",
  },
});

const DialogTitleStyled = styled(DialogTitle)({
  textAlign: "center",
  textTransform: "capitalize",
  fontWeight: "bold",
});

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

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter placeholder="Поиск..." />
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
  const [selectedClientForEdit, setSelectedClientForEdit] = useState(null);
  const [selectedClientForAccount, setSelectedClientForAccount] = useState(null);
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [openEditClientDialog, setOpenEditClientDialog] = useState(false);
  const [openAddAccountDialog, setOpenAddAccountDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClients();
  }, [userID]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Ошибка загрузки клиентов:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      setError("Выберите хотя бы одного клиента для удаления.");
      return;
    }

    try {
      await Promise.all(
        selectedRows.map((id) =>
          axios.delete(`${apiUrl}/users/client/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
        )
      );
      setClients((prevClients) =>
        prevClients.filter((client) => !selectedRows.includes(client.id))
      );
      setSelectedRows([]);
      setSuccess("Выбранные клиенты успешно удалены.");
      setError("");
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
      setError("Произошла ошибка при удалении клиентов.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${apiUrl}/createClient`, newClientData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuccess("Клиент успешно добавлен.");
      fetchClients(); 
      handleCloseAddClient(); 
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
      setError("Произошла ошибка при добавлении клиента.");
    }
  };
  

  const handleOpenAddClient = () => setOpenAddClientDialog(true);
  const handleCloseAddClient = () => {
    setOpenAddClientDialog(false);
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
    setError("");
  };

  const handleOpenEditClient = (client) => {
    setSelectedClientForEdit(client);
    setOpenEditClientDialog(true);
  };

  const handleCloseEditClient = () => {
    setOpenEditClientDialog(false);
    setSelectedClientForEdit(null);
    setError("");
  };

  const handleOpenAddAccount = (client) => {
    setSelectedClientForAccount(client);
    setOpenAddAccountDialog(true);
  };

  const handleCloseAddAccount = () => {
    setOpenAddAccountDialog(false);
    setNewAccountData({
      account_num: "",
      account_balance: "",
      currency: "",
      accountType: "",
      overdraftLimit: "",
      interestRate: "",
      creditLimit: "",
      socialPayments: "",
    });
    setError("");
  };

  const handleClientInputChange = (event) => {
    const { name, value } = event.target;
    setNewClientData({ ...newClientData, [name]: value });
  };

  const handleAccountInputChange = (event) => {
    const { name, value } = event.target;
    setNewAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const renderAdditionalField = () => {
    switch (newAccountData.accountType) {
      case "CHECKING":
        return (
          <TextField
            label="Лимит овердрафта"
            name="overdraftLimit"
            value={newAccountData.overdraftLimit}
            onChange={handleAccountInputChange}
            fullWidth
            margin="normal"
          />
        );
      case "SAVINGS":
        return (
          <TextField
            label="Процентная ставка"
            name="interestRate"
            value={newAccountData.interestRate}
            onChange={handleAccountInputChange}
            fullWidth
            margin="normal"
          />
        );
      case "CREDIT":
        return (
          <TextField
            label="Кредитный лимит"
            name="creditLimit"
            value={newAccountData.creditLimit}
            onChange={handleAccountInputChange}
            fullWidth
            margin="normal"
          />
        );
      case "SOCIAL":
        return (
          <TextField
            label="Тип социальной выплаты"
            name="socialPayments"
            value={newAccountData.socialPayments}
            onChange={handleAccountInputChange}
            fullWidth
            margin="normal"
          />
        );
      default:
        return null;
    }
  };

  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();
    if (
      !newAccountData.account_num ||
      !newAccountData.account_balance ||
      !newAccountData.currency ||
      !newAccountData.accountType
    ) {
      setError("Все поля должны быть заполнены.");
      return;
    }

    const requestData = {
      accountType: newAccountData.accountType,
      [`${newAccountData.accountType.toLowerCase()}AccountDto`]: {
        accountNum: newAccountData.account_num,
        clientId: selectedClientForAccount.id,
        accountBalance: parseFloat(newAccountData.account_balance),
        currency: newAccountData.currency,
        openDate: new Date().toISOString().slice(0, 10),
        ...(newAccountData.accountType === "CHECKING" && {
          overdraftLimit: parseFloat(newAccountData.overdraftLimit),
        }),
        ...(newAccountData.accountType === "SAVINGS" && {
          interestRate: parseFloat(newAccountData.interestRate),
        }),
        ...(newAccountData.accountType === "CREDIT" && {
          creditLimit: parseFloat(newAccountData.creditLimit),
        }),
        ...(newAccountData.accountType === "SOCIAL" && {
          socialPayments: newAccountData.socialPayments,
        }),
      },
    };

    try {
      await axios.post(`${apiUrl}/accounts/create`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuccess("Счет успешно добавлен.");
      handleCloseAddAccount();
    } catch (error) {
      console.error("Ошибка при добавлении счета:", error);
      setError("Произошла ошибка при добавлении счета.");
    }
  };

  return (
    <>
      <CssBaseline />
      <Menu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: 30 } }}>
        <AppBarStyled position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h5">Клиенты</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar src="/static/images/avatar/1.jpg" />
            <IconButton onClick={() => navigate("/")}>
              <LogoutIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
        </AppBarStyled>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <MyButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddClient}
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
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGridStyled
              rows={clients}
              columns={[
                { field: "id", headerName: "ID", width: 100 },
                { field: "firstName", headerName: "Имя", width: 150 },
                { field: "secondName", headerName: "Фамилия", width: 150 },
                { field: "income", headerName: "Доход", width: 100 },
                { field: "address", headerName: "Адрес", width: 200 },
                {
                  field: "actions",
                  headerName: "Действия",
                  width: 300,
                  renderCell: (params) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenEditClient(params.row)}
                        sx={{ marginRight: 1, backgroundColor: "#FFA726" }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenAddAccount(params.row)}
                        sx={{ backgroundColor: "#29B6F6" }}
                      >
                        Добавить счет
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
              onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            />
          </Box>
        </Container>
      </Box>

      {/* Модальное окно добавления клиента */}
      <Dialog
        open={openAddClientDialog}
        onClose={handleCloseAddClient}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitleStyled>Добавить нового клиента</DialogTitleStyled>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {[
              { name: "login", label: "Логин" },
              { name: "password", label: "Пароль" },
              { name: "email", label: "Email" },
              { name: "firstName", label: "Имя" },
              { name: "secondName", label: "Фамилия" },
              { name: "patronymicName", label: "Отчество" },
              { name: "income", label: "Доход" },
              { name: "mobilePhone", label: "Телефон" },
              { name: "address", label: "Адрес" },
            ].map(({ name, label }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={newClientData[name]}
                onChange={handleClientInputChange}
                fullWidth
                margin="normal"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <MyButton onClick={handleSubmit} variant="contained">
            Сохранить
          </MyButton>
        </DialogActions>
      </Dialog>

      {/* Модальное окно редактирования клиента */}
      {selectedClientForEdit && (
        <Dialog
          open={openEditClientDialog}
          onClose={handleCloseEditClient}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitleStyled>Редактировать клиента</DialogTitleStyled>
          <DialogContent>
            {[
              { name: "email", label: "Email" },
              { name: "firstName", label: "Имя" },
              { name: "secondName", label: "Фамилия" },
              { name: "income", label: "Доход" },
              { name: "mobilePhone", label: "Телефон" },
              { name: "address", label: "Адрес" },
            ].map(({ name, label }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={selectedClientForEdit[name] || ""}
                onChange={(e) =>
                  setSelectedClientForEdit((prev) => ({
                    ...prev,
                    [name]: e.target.value,
                  }))
                }
                fullWidth
                margin="normal"
              />
            ))}
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
            }}
          >
            <MyButton
              onClick={() => {
                axios
                  .put(
                    `${apiUrl}/users/client/${selectedClientForEdit.id}`,
                    selectedClientForEdit,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  )
                  .then(() => {
                    setSuccess("Клиент успешно обновлен.");
                    fetchClients();
                    handleCloseEditClient();
                  })
                  .catch((error) => {
                    console.error("Ошибка при обновлении клиента:", error);
                    setError("Произошла ошибка при обновлении клиента.");
                  });
              }}
              variant="contained"
            >
              Сохранить изменения
            </MyButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Модальное окно добавления счета */}
      {selectedClientForAccount && (
        <Dialog
          open={openAddAccountDialog}
          onClose={handleCloseAddAccount}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitleStyled>Добавить счет</DialogTitleStyled>
          <DialogContent>
            <TextField
              label="Номер счета"
              name="account_num"
              value={newAccountData.account_num}
              onChange={handleAccountInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Баланс"
              name="account_balance"
              value={newAccountData.account_balance}
              onChange={handleAccountInputChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Валюта</InputLabel>
              <Select
                name="currency"
                value={newAccountData.currency}
                onChange={handleAccountInputChange}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип счета</InputLabel>
              <Select
                name="accountType"
                value={newAccountData.accountType}
                onChange={handleAccountInputChange}
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {renderAdditionalField()}
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
            }}
          >
            <MyButton onClick={handleAddAccountSubmit} variant="contained">
              Сохранить счет
            </MyButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ClientsDataGrid;
