import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  CssBaseline,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import BankDirectorMenu from "../../components/verticalMenu/directorMenu";
import { styled, textAlign } from "@mui/system";

const apiUrl = "http://localhost:8080/api/admin/users";

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const MyButton = styled(Button)({
  backgroundColor: "#24695C",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#1E564A",
  },
});

const StyledTableHead = styled(TableCell)({
  backgroundColor: "#24695C",
  color: "#FFFFFF",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  textAlign: "center",
});

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "20px",
});

const StyledDialogActions = styled(DialogActions)({
  justifyContent: "center",
});

const styles = {
  activeRow: {
    backgroundColor: "#e8f5e9",
  },
  inactiveRow: {
    backgroundColor: "#fbe9e7",
  },
};

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    checkAccessToken();
    fetchUsers();
    fetchAvatar(userID);
  }, [userID]);

  const checkAccessToken = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Access token is invalid or expired", error);
      navigate("/");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAvatar = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${id}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.data) {
        setAvatarUrl(`data:image/jpeg;base64,${response.data}`);
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  const handleEditUser = async (user) => {
    try {
      const endpoint =
        user.role === "CLIENT"
          ? `http://localhost:8080/api/users/client/${user.id}`
          : `http://localhost:8080/api/users/admin/${user.id}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response && response.data) {
        setSelectedUser({ ...response.data, changeRole: false });
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
  };

  const translateRole = (role) => {
    switch (role) {
      case "CLIENT":
        return "Клиент";
      case "ADMIN":
        return "Администратор";
      default:
        return "Неизвестно";
    }
  };

  const handleSaveChanges = async () => {
    try {
      const { changeRole, role } = selectedUser;
      const endpoint =
        changeRole && role === "CLIENT"
          ? `${apiUrl}/toClient/${selectedUser.id}`
          : changeRole && role === "ADMIN"
          ? `${apiUrl}/toAdmin/${selectedUser.id}`
          : role === "CLIENT"
          ? `${apiUrl}/client/${selectedUser.id}`
          : `${apiUrl}/adm/${selectedUser.id}`;
      await axios.patch(endpoint, selectedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving user changes:", error);
    }
  };

  const handleUpdateStatus = async (userId, action) => {
    try {
      await axios.post(
        `${apiUrl}/${userId}/status`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${apiUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <BankDirectorMenu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: "#24695C",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" noWrap component="div">
              Управление пользователями
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HeaderAvatar
                alt={"User Avatar"}
                src={avatarUrl || "/static/images/avatar/1.jpg"}
              />
              <IconButton onClick={() => navigate("/")}>
                <LogoutIcon style={{ color: "white" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center">
            <Typography variant="h4" gutterBottom>
              Список пользователей
            </Typography>
          </Box>
          <TextField
            label="Поиск по Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Paper sx={{ p: 2, marginTop: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableHead onClick={() => handleSort("id")}>
                      ID
                    </StyledTableHead>
                    <StyledTableHead onClick={() => handleSort("email")}>
                      Email
                    </StyledTableHead>
                    <StyledTableHead onClick={() => handleSort("firstName")}>
                      Имя
                    </StyledTableHead>
                    <StyledTableHead onClick={() => handleSort("secondName")}>
                      Фамилия
                    </StyledTableHead>
                    <StyledTableHead onClick={() => handleSort("role")}>
                      Роль
                    </StyledTableHead>
                    <StyledTableHead onClick={() => handleSort("active")}>
                      Статус
                    </StyledTableHead>
                    <StyledTableHead>Действия</StyledTableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      style={
                        user.active ? styles.activeRow : styles.inactiveRow
                      }
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.secondName}</TableCell>
                      <TableCell>{translateRole(user.role)}</TableCell>
                      <TableCell>
                        {user.active ? "Активен" : "Заблокирован"}
                      </TableCell>
                      <TableCell>
                        <Grid container spacing={1}>
                          <Grid item>
                            <MyButton
                              onClick={() => handleEditUser(user)}
                              variant="contained"
                            >
                              Редактировать
                            </MyButton>
                          </Grid>
                          <Grid item>
                            <Button
                              onClick={() =>
                                handleUpdateStatus(
                                  user.id,
                                  user.active ? "block" : "unblock"
                                )
                              }
                              variant="outlined"
                              color={user.active ? "warning" : "success"}
                            >
                              {user.active ? "Заблокировать" : "Разблокировать"}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              variant="outlined"
                              color="error"
                            >
                              Удалить
                            </Button>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
        {selectedUser && (
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <StyledDialogTitle>
              Редактирование пользователя
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </StyledDialogTitle>
            <DialogContent>
              <TextField
                label="Email"
                value={selectedUser.email}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Имя"
                value={selectedUser.firstName}
                placeholder="Иван"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Фамилия"
                value={selectedUser.secondName}
                placeholder="Иванов"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    lastName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Отчество"
                value={selectedUser.patronymicName}
                placeholder="Иванович"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    patronymicName: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Телефон"
                value={selectedUser.mobilePhone}
                placeholder="+7 (999) 999-99-99"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    mobilePhone: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              {selectedUser.role === "CLIENT" && (
                <>
                  <TextField
                    label="Адрес"
                    value={selectedUser.address}
                    placeholder="г. Москва, ул. Ленина, д. 10"
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Доход"
                    value={selectedUser.income}
                    placeholder="50000"
                    type="number"
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        income: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              <Select
                fullWidth
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    role: e.target.value,
                    changeRole: true,
                  })
                }
                margin="normal"
              >
                <MenuItem value="CLIENT">Клиент</MenuItem>
                <MenuItem value="ADMIN">Администратор</MenuItem>
              </Select>
            </DialogContent>
            <StyledDialogActions>
              <Button onClick={handleSaveChanges} variant="contained">
                Сохранить
              </Button>
            </StyledDialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default UserManagementPage;
