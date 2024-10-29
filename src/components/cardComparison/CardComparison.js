import React from 'react';
import { Typography, Grid, Card, Box, CardContent, CardMedia } from '@mui/material';
import gold from '../../images/red_card.png';

function CardComparison() {
  const cards = [
    { color: 'red', title: 'Золотая', description: 'Помогает сохранять средства' },
    { color: 'blue', title: 'Золотая', description: 'Помогает сохранять средства' },
    { color: 'gold', title: 'Золотая', description: 'Помогает сохранять средства' }
  ];

  return (
    <Box mt={25} mb={5} mx="auto" maxWidth="md">
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontFamily: 'PT Sans, Arial, sans-serif',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Сравните наши кредитные карты
      </Typography>
      <Grid container spacing={2} pt={5} justifyContent="center">
        {cards.map((card, index) => (
          <Grid item key={index} xs={12} sm={4}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={gold}
                alt={`${card.color} card`}
              />
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CardComparison;
