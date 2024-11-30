import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Button, ListItemSecondaryAction, Divider, Paper, Box, AppBar, Toolbar, CssBaseline, Avatar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
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
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: 800,
  color: theme.palette.text.primary,
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f4f6f8',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DetailsButton = styled(Button)(({ theme }) => ({
  color: '#24695C',
  backgroundColor: '#E0F2F1',
  '&:hover': {
    backgroundColor: '#B2DFDB',
  },
  borderRadius: '20px',
  textTransform: 'none',
}));

const AppBarStyled = styled(AppBar)({
  background: '#24695C',
});

const TitleTypography = styled(Typography)({
  color: 'white',
  fontWeight: 'bold',
});

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
      <AppBarStyled position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" noWrap component="div">
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
      </AppBarStyled>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <ContentContainer>
          <StyledPaper elevation={3}>
            <Typography variant="h5" gutterBottom style={{ textAlign: 'center', color: '#24695C', fontWeight: 'bold' }}>
              Счета клиента
            </Typography>
            <List>
              {accounts.map(account => (
                <Box key={account.accountNum}>
                  <StyledListItem>
                    <ListItemText
                      primary={<Typography variant="h6" style={{ color: '#333' }}>{account.accountType || 'Неизвестный тип'}</Typography>}
                      secondary={
                        <Typography variant="body2" style={{ color: '#666' }}>
                          Баланс: {account.accountBalance} {account.currency}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <DetailsButton variant="contained" onClick={() => handleDetailsClick(account.accountNum)}>
                        Подробнее
                      </DetailsButton>
                    </ListItemSecondaryAction>
                  </StyledListItem>
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
