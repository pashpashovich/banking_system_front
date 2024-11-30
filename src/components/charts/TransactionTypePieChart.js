import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Button, TextField, Container } from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";

const MyButton = styled(Button)({
  background: "#24695C",
  color: "#fff",
  fontWeight: "bold",
  ":hover": {
    background: "#1a4c44",
  },
});

const apiUrl = "http://localhost:8080/api/transactions/count-by-type";

const TransactionTypePieChart = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Количество транзакций по типам",
        data: [],
        backgroundColor: ["#8BC34A", "#4CAF50", "#388E3C", "#1B5E20"],
        hoverBackgroundColor: ["#7CB342", "#43A047", "#2E7D32", "#145A14"],
      },
    ],
  });

  const customTheme = createTheme({
    components: {
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#24695C",
          },
        },
      },
    },
  });

  const fetchTransactionCounts = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    axios
      .get(
        `${apiUrl}?start_date=${start.toISOString().split("T")[0]}&end_date=${
          end.toISOString().split("T")[0]
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setChartData({
          labels: Object.keys(data),
          datasets: [
            {
              ...chartData.datasets[0],
              data: Object.values(data),
            },
          ],
        });
      })
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 4,
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Начальная дата"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              label="Конечная дата"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%", 
            }}
          >
            <MyButton
              variant="contained"
              onClick={fetchTransactionCounts}
              sx={{
                height: "56px",
              }}
            >
              Применить
            </MyButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "400px",
            maxHeight: "50vh",
          }}
        >
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    font: {
                      size: 14,
                    },
                    color: "#333",
                  },
                },
              },
            }}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TransactionTypePieChart;
