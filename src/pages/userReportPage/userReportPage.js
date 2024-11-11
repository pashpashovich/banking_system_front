import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, AppBar, Toolbar, CssBaseline, IconButton, Avatar, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import ClientMenu from '../../components/verticalMenu/ClientMenu';
import DailyTransactionsChart from '../../components/charts/dailyTransactionChart';
import TransactionStats from '../../components/stats/statsUserTransactions';
import axios from "axios";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const apiUrl = 'http://localhost:8000/clients';
const pdfUrl = 'http://localhost:8080/api/transactions/report/';
const userUrl = 'http://localhost:8080/api/users';

const MenuContainer = styled(Box)({
  display: 'flex',
});

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const MyToolbar = styled(Toolbar)({
  color: '#051139',
});

const HeaderAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

const DetailsButton = styled(Button)(({ theme }) => ({
  color: '#24695C',
  backgroundColor: '#E0F2F1',
  '&:hover': {
    backgroundColor: '#B2DFDB',
  },
  borderRadius: '20px',
  textTransform: 'none',
}));

const UserReportPage = () => {
  const { userID } = useParams();
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get(`${userUrl}/${userID}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error loading user data:', error);
      });

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

  useEffect(() => {
    axios.get(`http://localhost:8080/api/accounts/by-user/${userID}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(response => {
        setAccounts(response.data);
      })
      .catch(error => {
        console.error('Error loading account data:', error);
      });
  }, [userID, selectedAccount, navigate]);

  useEffect(() => {
    if (selectedAccount && selectedMonth) {
      fetchTransactionData(selectedAccount, selectedMonth);
      fetchTransactionStats(selectedAccount, selectedMonth);
    }
  }, [selectedAccount, selectedMonth]);

  const fetchTransactionData = async (account, month) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions/${account}/${month}/daily`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setDailyTransactions(response.data);
    } catch (error) {
      console.error('Error refreshing transaction data:', error);
    }
  };

  const fetchTransactionStats = async (account, month) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions/${account}/${month}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error refreshing transaction data:', error);
    }
  };

  const handleLogout = () => {
    axios.post(
      'http://localhost:8080/api/auth/logout',
      {
        refresh_token: localStorage.getItem('refreshToken'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      }
    )
    .then(response => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const downloadPDF = () => {
    if (!selectedAccount) {
      setErrorMessage("Выберите счет для скачивания отчета");
      return;
    }

    setDownloading(true);
    axios.get(`${pdfUrl}${selectedAccount}/${selectedMonth}`, {
            headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "user_report.pdf");
        document.body.appendChild(link);
        link.click();
              link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading PDF:", error))
      .finally(() => setDownloading(false));
  };

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const selectedMonthName = monthNames[selectedMonth - 1];

  const getCurrentDateOrEndOfMonth = (selectedMonth) => {
    const today = new Date();
    const year = today.getFullYear();
    if (selectedMonth === today.getMonth() + 1) {
      return today.getDate();
    }
    return new Date(year, selectedMonth, 0).getDate();
  };

  const displayDate = getCurrentDateOrEndOfMonth(selectedMonth);

  return (
    <MenuContainer>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#24695C' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Отчетность
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HeaderAvatar alt={userData?.first_name} src={avatarUrl || "/static/images/avatar/1.jpg"} />
            <IconButton onClick={handleLogout}>
              <LogoutIcon style={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <ContentContainer>
        <Toolbar />
        <Paper elevation={3} sx={{ padding: 2, width: '100%', mt: 3 }}>
          {!loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Счет</InputLabel>
                <Select
                  value={selectedAccount || ''}
                  onChange={e => setSelectedAccount(e.target.value)}
                >
                  {accounts.map(account => (
                    <MenuItem key={account.accountNum} value={account.accountNum}>
                      {account.accountNum}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Месяц</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  {monthNames.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TransactionStats data={data} selectedMonthName={selectedMonthName} displayDate={displayDate} />
              <DailyTransactionsChart data={dailyTransactions} days={displayDate} />
              <DetailsButton variant="contained" color="primary" onClick={downloadPDF} disabled={downloading} sx={{ mt: 3 }}>
                {downloading ? "Скачивание..." : "Скачать отчет PDF"}
              </DetailsButton>
              {errorMessage && (
                <Typography color="error" sx={{ mt: 1 }}>{errorMessage}</Typography>
              )}
            </>
          )}
        </Paper>
      </ContentContainer>
    </MenuContainer>
  );
};

export default UserReportPage;
