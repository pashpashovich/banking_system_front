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
import axios from "axios";
import Menu from "../../components/verticalMenu/menu";
import LogoutIcon from "@mui/icons-material/Logout";

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
});

const ProfileCard = styled(Card)({
  width: "100%",
  maxWidth: 600,
  marginTop: 20,
  padding: 20,
  color: "#333",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
});

const ProfileAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  marginBottom: 20,
  cursor: "pointer",
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const HiddenInput = styled(Input)({
  display: "none",
});

const Profile = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/admin/${userID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
        } else if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
      axios
      .get(`${apiUrl}/users/${userID}/avatar`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setAvatar(`data:image/jpeg;base64,${response.data}`);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки аватара:", error);
      });
  }, [userID, navigate]);

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
          setAvatar(`data:image/jpeg;base64,${base64String}`);
        })
        .catch((error) => {
          console.error("Ошибка загрузки аватара:", error);
        });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography variant="h6">Пользователь не найден</Typography>;
  }

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

  const { email, firstName, secondName, patronymicName, role, mobilePhone } =
    userData;

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#F5F5F5", minHeight: "100vh" }}
    >
      <CssBaseline />
      <Menu userID={userID} />
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
              <HeaderAvatar
                alt={firstName}
                src={avatar || "/static/images/avatar/1.jpg"}
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
                src={avatar || "/static/images/avatar/1.jpg"}
                component="span"
              />
            </label>
            <HiddenInput
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <Typography
              variant="h4"
              sx={{ color: "#24695C", fontWeight: "bold" }}
            >{`${firstName} ${secondName} ${patronymicName}`}</Typography>
            <Typography variant="h6" color="textSecondary">
              {role}
            </Typography>
            <ProfileCard>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{email}</Typography>
                  </Grid>
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Телефон
                      </Typography>
                      <Typography variant="body1">{mobilePhone}</Typography>
                    </Grid>
                  </>
                </Grid>
              </CardContent>
            </ProfileCard>
          </ProfileContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
