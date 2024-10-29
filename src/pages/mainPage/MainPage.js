import React from 'react';
import { Container, Box } from '@mui/material';
import Header from '../../components/header/header';
import LoginForm from '../../components/loginForm/LoginForm';
import CardComparison from '../../components/cardComparison/CardComparison';
import SavingsProcess from '../../components/savingsProcess/SavingsProcess';
import BankFeatures from '../../components/bankFeatures/BankFeatures';
import Footer from '../../components/footer/footer';
import myImage from '../../images/main_pic.png';

const MainPageUser = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      <Box position="relative"  display="flex" justifyContent="center" alignItems="center">
        <img src={myImage} alt="Two people smiling at laptop" style={{ width: '100%',  height: '50%' }} />
        <Box position="absolute" top="75%" left="80%" sx={{ transform: 'translate(-50%, -50%)' }}>
          <LoginForm />
        </Box>
      </Box>
      <CardComparison />
      <SavingsProcess />
      <BankFeatures />
      <Footer />
    </Container>
  );
};

export default MainPageUser;
