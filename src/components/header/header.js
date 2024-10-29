import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../../images/logo.png';

function Header() {
  return (
<AppBar position="static" sx={{ backgroundColor: '#24695C' }}>
<Toolbar>
        <Box display="flex" alignItems="center">
        <img src={logo} alt="Two people smiling at laptop" style={{ width: '8%' }} />          
        <Typography variant="h6" component="div" sx={{ ml: 1, fontFamily: 'Mulish, Arial, sans-serif', fontWeight: 'bold' }}>
            FinanceScope
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
