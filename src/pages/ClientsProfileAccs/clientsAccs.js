import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Button, ListItemSecondaryAction, Divider, Paper, Box, AppBar, Toolbar, CssBaseline, Drawer, Avatar, IconButton, Hidden } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import ClientMenu from "../../components/verticalMenu/ClientMenu";
import axios from 'axios';

const drawerWidth = 240;

const MenuContainer = styled(Box)({
  display: 'flex',
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: '30px 20px 20px 20px',
  boxSizing: 'border-box',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  maxWidth: 800,
  color: 'black',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const ClientAccsPage = () => {
  const { userID } = useParams();
  const [clientInfo, setClientInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
  }, [userID, navigate]);

  const handleDetailsClick = (accountId) => {
    navigate(`/ClAccs/${accountId}/${userID}`);
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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      }
    )
    .then(response => {
      if (response.status !== 200) {
        console.log(localStorage.getItem('refreshToken'));
        return;
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    })
    .catch(error => {
      console.error(error);
      console.log(localStorage.getItem('refreshToken'));
    });
  };

  return (
    <MenuContainer>
      <CssBaseline />
      <ClientMenu userID={userID} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#24695C' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Счета
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {clientInfo && (
              <Avatar
                alt={clientInfo.first_name}
                src={clientInfo.user.avatar || "/static/images/avatar/1.jpg"}
                sx={{ width: 40, height: 40 }}
              />
            )}
            <IconButton onClick={handleLogout}>
              <LogoutIcon style={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <ContentContainer>
          <StyledPaper elevation={3}>
            <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
              Счета клиента
            </Typography>
            <List>
              {accounts.map(account => (
                <Box key={account.accountNum}>
                  <ListItem>
                    <ListItemText
                      primary={account.accountType || 'Неизвестный тип'}
                      secondary={`Баланс: ${account.accountBalance} ${account.currency}`}
                    />
                    <ListItemSecondaryAction>
                      <Button onClick={() => handleDetailsClick(account.accountNum)}>Подробнее</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </StyledPaper>
        </ContentContainer>
      </Box>
    </MenuContainer>
  );
};

export default ClientAccsPage;