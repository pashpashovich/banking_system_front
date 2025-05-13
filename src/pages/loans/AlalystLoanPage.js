import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Alert,
  CssBaseline,
  Toolbar,
  AppBar,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../components/verticalMenu/menu";
import axios from "axios";

const AppBarStyled = styled(AppBar)({
  background: "#24695C",
});

const AnalystLoanPage = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const StyledTableCell = styled(TableCell)({
    backgroundColor: "#24695C",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    textAlign: "center",
  });

  const StyledTableRow = styled(TableRow)({
    "&:nth-of-type(odd)": {
      backgroundColor: "#f1f8f6",
    },
    "&:hover": {
      backgroundColor: "#e0f2f1",
    },
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedRequests = useMemo(() => {
    const sorted = [...requests];
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [requests, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/loan-management", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setRequests(res.data);
    } catch (e) {
      console.error("Ошибка при загрузке заявок", e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, status) => {
    setMessage("");
    try {
      await axios.put(
        `http://localhost:8080/api/loan-management/${id}/status?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(
        `Заявка №${id} ${status === "APPROVED" ? "одобрена" : "отклонена"}`
      );
      fetchRequests();
    } catch (e) {
      setMessage("Ошибка при принятии решения");
    }
  };

  return (
    <>
      <CssBaseline />
      <Menu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: 30 } }}>
        <AppBarStyled position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h5">Заявки на займы</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar />
            <IconButton onClick={() => navigate("/")}>
              <LogoutIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
        </AppBarStyled>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {message && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "center", textTransform: "none" }}
            >
              Список заявок
            </Typography>

            {requests.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Заявки отсутствуют
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell onClick={() => handleSort("id")}>
                        ID
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("client")}>
                        Клиент
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("amount")}>
                        Сумма
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleSort("termInMonths")}
                      >
                        Срок (мес.)
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("purpose")}>
                        Цель
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleSort("requestDate")}
                      >
                        Дата
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("status")}>
                        Статус
                      </StyledTableCell>
                      <StyledTableCell>Комментарий</StyledTableCell>
                      <StyledTableCell>Действия</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRequests.map((req) => (
                      <StyledTableRow key={req.id}>
                        <TableCell align="center">{req.id}</TableCell>
                        <TableCell align="center">
                          {req.client?.secondName} {req.clientId}
                        </TableCell>
                        <TableCell align="center">{req.amount}</TableCell>
                        <TableCell align="center">{req.termInMonths}</TableCell>
                        <TableCell align="center">{req.purpose}</TableCell>
                        <TableCell align="center">{req.requestDate}</TableCell>
                        <TableCell align="center">
                          {req.status === "PENDING"
                            ? "На рассмотрении"
                            : req.status === "APPROVED"
                            ? "Одобрена"
                            : "Отклонена"}
                        </TableCell>
                        <TableCell align="center">
                          {req.reason || "-"}
                        </TableCell>
                        <TableCell align="center">
                          <Grid container spacing={1} justifyContent="center">
                            <Grid item>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  handleDecision(req.id, "APPROVED")
                                }
                              >
                                Одобрить
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  handleDecision(req.id, "REJECTED")
                                }
                              >
                                Отклонить
                              </Button>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AnalystLoanPage;
