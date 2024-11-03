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
} from "@mui/material";
import { styled } from "@mui/system";
import ClientMenu from "../../components/verticalMenu/ClientMenu";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const apiUrl = "http://localhost:8080/api";

const ProfileContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
  marginTop: 20,
  width: "100%",
  color: "white",
});

const ProfileCard = styled(Card)({
  width: "100%",
  maxWidth: 600,
  marginTop: 20,
  padding: 20,
  color: "black",
});

const AccountCard = styled(Card)({
  width: "100%",
  maxWidth: 600,
  marginTop: 20,
  padding: 20,
  color: "black",
  backgroundColor: "#F4F4F4",
  borderRadius: 2,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
});

const ProfileAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  marginBottom: 20,
  cursor: "pointer",
});

const HiddenInput = styled(Input)({
  display: "none",
});

const ClientProfilePage = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [marketData, setMarketData] = useState({
    DOW: 0,
    "S&P 500": 0,
    NASDAQ: 0,
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/${userID}`, {
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
        console.error("Ошибка загрузки данных пользователя:", error);
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

    axios
      .get("https://api.example.com/market-data")
      .then((response) => {
        setMarketData({
          DOW: response.data.dow,
          "S&P 500": response.data.sp500,
          NASDAQ: response.data.nasdaq,
        });
      })
      .catch((error) => {
        console.error("Ошибка загрузки рыночных данных:", error);
      });
  }, [userID, navigate]);

  useEffect(() => {
    if (userID) {
      axios
        .get(`${apiUrl}/users/${userID}/avatar`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
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
  }, [userID, apiUrl]);

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
    income,
  } = userData;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: "#24695C",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Профиль
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={firstName}
                src={avatarUrl || "/static/images/avatar/1.jpg"}
              />
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
            <Typography variant="h4">{` ${secondName} ${firstName} ${patronymicName}`}</Typography>
            <Typography variant="h6" color="textSecondary">
              {role}
            </Typography>
            <ProfileCard>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Email:</strong> {email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Адрес:</strong> {address}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Телефон:</strong> {mobilePhone}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>Доход:</strong> {income}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </ProfileCard>
          </ProfileContainer>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <AccountCard>
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    Карты
                  </Typography>
                  {/* Здесь будет информация о картах, когда она появится */}
                </CardContent>
              </AccountCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AccountCard>
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    Счета
                  </Typography>
                  {accountData.map((account) => (
                    <Box key={account.id}>
                      <Typography variant="h6" gutterBottom>
                        {account.accountNum}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Баланс: {account.accountBalance} BYN
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </AccountCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AccountCard>
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    Биржи
                  </Typography>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      DOW: {marketData.DOW}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      S&P 500: {marketData["S&P 500"]}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      NASDAQ: {marketData.NASDAQ}
                    </Typography>
                  </Box>
                </CardContent>
              </AccountCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ClientProfilePage;