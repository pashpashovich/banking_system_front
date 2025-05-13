import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  Input,
  Divider,
  Button
} from "@mui/material";
import { styled } from "@mui/system";
import ClientMenu from "../../components/verticalMenu/ClientMenu";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import USFlag from "../../images/usa-flag.png";
import EURFlag from "../../images/eu-flag.png";
import GBPFlag from "../../images/gb-flag.png";

const apiUrl = "http://localhost:8080/api";

const ProfileContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 20,
  marginTop: 20,
  width: "100%",
});

const ProfileCard = styled(Card)({
  width: "100%",
  maxWidth: 600,
  padding: 20,
  color: "#333",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
});

const AccountCard = styled(Card)({
  width: "100%",
  backgroundColor: "#FAFAFA",
  borderRadius: 8,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  marginBottom: 16,
});

const ProfileAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  cursor: "pointer",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
});

const HiddenInput = styled(Input)({
  display: "none",
});

const CurrencyText = styled(Typography)({
  fontWeight: "bold",
});

const StyledButton = styled(Button)({
  backgroundColor: "#24695C",
  color: "#FFFFFF",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1e564b",
  },
  width: "100%",
  marginTop: 8,
});

const FooterLink = styled(Typography)({
  color: "#333",
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const ClientProfilePage = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({
    USD: null,
    EUR: null,
    GBP: null,
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/client/${userID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            navigate("/forbidden");
          } else if (error.response.status === 401) {
            navigate("/login");
          }
        } else {
          console.error("An unexpected error occurred:", error);
        }
        setLoading(false);
      });

    axios
      .get(`${apiUrl}/accounts/by-user/${userID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setAccountData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных счетов:", error);
      });

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get("https://api.nbrb.by/exrates/rates?periodicity=0");
        const rates = response.data;
        setExchangeRates({
          USD: rates.find((rate) => rate.Cur_Abbreviation === "USD").Cur_OfficialRate,
          EUR: rates.find((rate) => rate.Cur_Abbreviation === "EUR").Cur_OfficialRate,
          GBP: rates.find((rate) => rate.Cur_Abbreviation === "GBP").Cur_OfficialRate,
        });
      } catch (error) {
        console.error("Ошибка загрузки курсов валют:", error);
      }
    };

    fetchExchangeRates();

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
  }, [userID, navigate]);

  const translateAccountType = (role) => {
    switch (role) {
      case "CREDIT":
        return "КРЕДИТНЫЙ";
      case "SAVINGS":
        return "СБЕРЕГАТЕЛЬНЫЙ";
      case "CHECKING":
        return "ТЕКУЩИЙ" ;
      case "SOCIAL":
        return "СОЦИАЛЬНЫЙ";
      default:
        return "Неизвестно";
    }
  };

  const translateRoleType = (role) => {
    switch (role) {
      case "DIRECTOR":
        return "Директор";
      case "CLIENT":
        return "Клиент";
      case "ADMIN":
        return "Администратор" ;
      default:
        return "Неизвестно";
    }
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

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      axios
        .post(`${apiUrl}/users/${userID}/avatar`, base64String, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        })
        .then(() => {
          setAvatarUrl(`data:image/jpeg;base64,${base64String}`);
        })
        .catch((error) => {
          console.error("Ошибка загрузки аватара:", error);
        });
    };
    reader.readAsDataURL(file);
  };

  const handleViewTransactions = (accountID) => {
    navigate(`/clAccs/${accountID}/${userID}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography variant="h6">Пользователь не найден</Typography>;
  }

  const {
    email,
    firstName,
    secondName,
    patronymicName,
    role,
    address,
    mobilePhone,
  } = userData;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#24695C",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" noWrap>
              FinanceScope
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar alt={firstName} src={avatarUrl || "/static/images/avatar/1.jpg"} />
              <IconButton onClick={handleLogout}>
                <LogoutIcon style={{ color: "white" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container maxWidth="md">
          <ProfileContainer>
            <label htmlFor="avatar-upload">
              <ProfileAvatar
                alt={firstName}
                src={avatarUrl || "/static/images/avatar/1.jpg"}
                component="span"
              />
            </label>
            <HiddenInput
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <Typography variant="h5" sx={{ color: "#24695C", fontWeight: "bold" }}>
              {firstName} {secondName} {patronymicName}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Роль: {translateRoleType(role)}
            </Typography>
            <Typography variant="body2">Email: {email}</Typography>
            <Typography variant="body2">Телефон: {mobilePhone}</Typography>
            <Typography variant="body2">Адрес: {address}</Typography>

            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 4, textAlign:"center" }}>
                  Курсы валют:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <img src={USFlag} alt="USD" style={{ width: 20, marginRight: 5 }} />
                    <Typography variant="body2">USD: {exchangeRates.USD}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <img src={EURFlag} alt="EUR" style={{ width: 20, marginRight: 5 }} />
                    <Typography variant="body2">EUR: {exchangeRates.EUR}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <img src={GBPFlag} alt="GBP" style={{ width: 20, marginRight: 5 }} />
                    <Typography variant="body2">GBP: {exchangeRates.GBP}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 4, textAlign:"center" }}>
                  Ваши счета:
                </Typography>
                <Grid container spacing={2}>
                  {accountData.map((account) => (
                    <Grid item xs={12} md={accountData.length > 1 ? 6 : 12}>
                    <AccountCard>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {translateAccountType(account.accountType)}
                          </Typography>
                          <CurrencyText>
                            {account.currency} {account.accountBalance?.toFixed(2) || "0.00"}
                          </CurrencyText>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            Номер счета: {account.accountNum}
                          </Typography>
                          <StyledButton onClick={() => handleViewTransactions(account.accountNum)}>
                            Транзакционная активность
                          </StyledButton>
                        </CardContent>
                      </AccountCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </ProfileContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default ClientProfilePage;
