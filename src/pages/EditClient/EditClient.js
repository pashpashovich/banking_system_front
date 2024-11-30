import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Menu from "../../components/verticalMenu/menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/system";
import axios from "axios";

const apiUrl = "http://localhost:8080/api/users";

const StyledBox = styled(Box)({
  display: "flex",
  minHeight: "100vh",
});

const FormContainer = styled(Paper)({
  padding: 20,
  marginTop: 20,
  width: "100%",
});

const ProfileAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  marginLeft: 10,
});

const BackButton = styled(IconButton)({
  color: "white",
  backgroundColor: "#6a65ff",
  "&:hover": {
    backgroundColor: "#5a55e0",
  },
  marginRight: 10,
});

const MyButton = styled(Button)({
  background: "#6a65ff",
  ":hover": {
    background: "#5a55e0",
  },
});

const handleEmailCheck = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/email-check`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    return false;
  }
};

const EditClient = () => {
  const { clientId, userID } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({
    id:"",
    email: "",
    firstName: "",
    secondName: "",
    patronymicName: "",
    income: "",
    mobilePhone: "",
    address: "",
    role: "CLIENT",
  });
  const [userData, setUserData] = useState({
    email: "",
  });
  const [initialEmail, setInitialEmail] = useState(""); 
  const [errorText, setErrorText] = useState("");
  const [analystData, setAnalystData] = useState("");

  useEffect(() => {
    axios
      .get(`${apiUrl}/client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
        } else if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });

    axios
      .get(`${apiUrl}/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setClientData(response.data);
        setInitialEmail(response.data.email); 
      }) 
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
        } else if (error.response && error.response.status === 401) {
          navigate("/");
        }
      });

    axios
      .get(`${apiUrl}/${clientId}/avatar`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => setAnalystData({ ...analystData, avatar: response.data }))
      .catch((error) => console.error("Ошибка загрузки аватара:", error));
  }, [clientId, userID, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setUserData({ ...userData, [name]: value });
    } else {
      setClientData({ ...clientData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {id, email, firstName, secondName, income, mobilePhone, address } = clientData;

    const phoneRegex = /^\+\d{12,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPhoneNumberUnique = !clients.some((client) => {      
        return client.mobilePhone === mobilePhone && client.id !== parseInt(id, 10);
      });

    if (!email || !firstName || !secondName || !mobilePhone || !address) {
      setErrorText("Пожалуйста, заполните все поля");
      return;
    }

    if (!phoneRegex.test(mobilePhone)) {
      setErrorText(
        'Некорректный формат номера телефона. Номер должен начинаться с "+" и содержать от 12 до 15 цифр'
      );
      return;
    }

    if (!isPhoneNumberUnique) {
      setErrorText("Такой номер телефона уже существует");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorText("Некорректный формат email");
      return;
    }

    if (email !== initialEmail) {
      const isEmailUnique = await handleEmailCheck(email);

      if (!isEmailUnique) {
        setErrorText("Такой email уже существует");
        return;
      }
    }

    const parsedIncome = parseFloat(income);
    if (isNaN(parsedIncome)) {
      setErrorText("Доход должен быть числом");
      return;
    }

    axios
      .put(
        `${apiUrl}/client/${clientId}`,
        { ...clientData, income: parsedIncome },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log("Данные клиента успешно обновлены");
        navigate(`/data/${userID}`);
      })
      .catch((error) =>
        console.error("Ошибка при обновлении данных клиента:", error)
      );
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
    <StyledBox>
      <CssBaseline />
      <Menu userID={userID} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: "#030E32",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Клиенты
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {userData && (
                <ProfileAvatar
                  alt={userData.firstName}
                  src={analystData.avatar || "/static/images/avatar/1.jpg"}
                />
              )}
              <IconButton onClick={handleLogout}>
                <LogoutIcon style={{ color: "white" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container component="main" maxWidth="sm">
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <BackButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </BackButton>
            <Typography variant="h5">Назад</Typography>
          </Box>
          <FormContainer elevation={3}>
            <Typography variant="h4" gutterBottom>
              Редактировать данные клиента
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                value={clientData.email}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Имя"
                name="firstName"
                value={clientData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Фамилия"
                name="secondName"
                value={clientData.secondName}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Доход"
                name="income"
                value={clientData.income}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Телефон"
                name="mobilePhone"
                value={clientData.mobilePhone}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Адрес"
                name="address"
                value={clientData.address}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <MyButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 20 }}
                >
                  Сохранить изменения
                </MyButton>
              </Box>
              {errorText && (
                <Typography color="error" style={{ marginTop: 10 }}>
                  {errorText}
                </Typography>
              )}
            </form>
          </FormContainer>
        </Container>
      </Box>
    </StyledBox>
  );
};

export default EditClient;
