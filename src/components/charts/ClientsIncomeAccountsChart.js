import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/accounts/clients-income-accounts';

const ClientsAccountsChart = () => {
    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        axios.get(apiUrl, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          })
            .then(response => {
                const data = response.data;
                const scatterData = data.map(item => ({
                    x: item.income,
                    y: item.accountCount
                }));
                console.log(scatterData);

                setChartData({
                    datasets: [{
                        label: 'Доход vs Количество счетов',
                        data: scatterData,
                        backgroundColor: 'rgba(75,192,192,1)',
                    }]
                });
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }, []);

    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Доход'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество счетов'
                }
            }
        }
    };

    return (
        <div>
            <Scatter data={chartData} options={options} />
        </div>
    );
};

export default ClientsAccountsChart;
