import React from 'react';
import { Typography, Grid, Box } from '@mui/material';

function Footer() {
  const sections = [
    { title: "Помощь", items: ["Часто задаваемые вопросы", "Документы и формы", "Финансовые подсказки"] },
    { title: "Процентные ставки", items: ["Все сберегательные ставки", "Кредит на покупку машины", "Персональные займы"] },
    { title: "Инструменты", items: ["Калькулятор сбережений", "Планировщик бюджета"] },
    { title: "Про нас", items: ["Про нас", "Контакты", "Карьера"] }
  ];

  return (
    <Box mt={6} py={6} px={3} bgcolor="#212121" color="white">
      <Grid container spacing={4} justifyContent="center">
        {sections.map((section, index) => (
          <Grid item xs={12} sm={3} key={index}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: 'Mulish, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#a67c52'
              }}
            >
              {section.title}
            </Typography>
            {section.items.map((item, i) => (
              <Typography
                variant="body2"
                key={i}
                sx={{
                  fontFamily: 'Mulish, Arial, sans-serif',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  '&:hover': {
                    color: '#a67c52',
                    cursor: 'pointer'
                  }
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Footer;
