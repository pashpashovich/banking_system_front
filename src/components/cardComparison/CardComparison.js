import React from 'react';
import { Typography, Grid, Card, Box, CardContent, CardMedia } from '@mui/material';
import red from '../../images/red_card.png';
import blue from '../../images/blue_card.png';
import gold from '../../images/gold_card.png';



function CardComparison() {
  const cards = [
    { color: 'blue', title: 'Синяя', description: 'Помогает сохранять средства', picture: blue },
    { color: 'red', title: 'Красная', description: 'Помогает сохранять средства', picture: red },
    { color: 'gold', title: 'Золотая', description: 'Помогает сохранять средства', picture: gold }
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
                image={card.picture}
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
