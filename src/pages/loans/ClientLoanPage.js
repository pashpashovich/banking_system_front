import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  Avatar,
  IconButton,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useParams } from "react-router-dom";
import ClientMenu from "../../components/verticalMenu/ClientMenu";
import axios from "axios";
import { TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const ClientLoanPage = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState(12);
  const [purpose, setPurpose] = useState("");
  const [loans, setLoans] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedLoans = [...loans].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const fetchLoans = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/loans/my?clientId=${userID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLoans(res.data);
    } catch (e) {
      console.error("Ошибка загрузки заявок", e);
    }
  };

  useEffect(() => {
    fetchLoans();
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
  }, [userID]);

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await axios.post(
        `http://localhost:8080/api/loans?clientId=${userID}`,
        { amount, termInMonths: term, purpose },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setSuccessMessage("Заявка успешно отправлена.");
      setAmount(0);
      setTerm(12);
      setPurpose("");
      fetchLoans();
    } catch (e) {
      setErrorMessage("Ошибка при отправке заявки");
    }
  };

  return (
    <>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: 30 } }}>
        <AppBar position="fixed" sx={{ zIndex: 1201, background: "#24695C" }}>
          <Toolbar>
            <Typography variant="h5">Мои заявки на займ</Typography>
            <Box sx={{ flexGrow: 1 }} />
              <Avatar src={avatarUrl || "/static/images/avatar/1.jpg"} />
            <IconButton onClick={() => navigate("/")}>
              <LogoutIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <Container maxWidth="md" sx={{ mt: 4 }}>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{ textTransform: "none" }}
            >
              Оставить новую заявку
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                label="Сумма"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
              />
              <TextField
                label="Срок (мес.)"
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                fullWidth
              />
              <TextField
                label="Цель займа"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: "#24695C" }}
              >
                Отправить заявку
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{ textTransform: "none" }}
            >
              История заявок
            </Typography>

            <TableContainer
              sx={{ border: "1px solid #24695C", borderRadius: 2 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#24695C" }}>
                    {[
                      { id: "id", label: "ID" },
                      { id: "amount", label: "Сумма" },
                      { id: "termInMonths", label: "Срок" },
                      { id: "purpose", label: "Цель" },
                      { id: "requestDate", label: "Дата" },
                      { id: "status", label: "Статус" },
                      { id: "reason", label: "Комментарий" },
                    ].map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={() => handleSort(headCell.id)}
                          sx={{
                            color: "#fff",
                            "&:hover": { color: "#b2dfdb" },
                          }}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedLoans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Нет заявок на займ.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell>{loan.id}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>{loan.termInMonths}</TableCell>
                        <TableCell>{loan.purpose}</TableCell>
                        <TableCell>{loan.requestDate}</TableCell>
                        <TableCell>{loan.status}</TableCell>
                        <TableCell>{loan.reason || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ClientLoanPage;
