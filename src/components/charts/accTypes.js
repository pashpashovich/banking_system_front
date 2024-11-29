import Chart from 'chart.js/auto';
import { useEffect, useRef } from "react";

const countAccountTypes = (accounts) => {
    const counts = {
        'CHECKING': 0,
        'SAVINGS': 0,
        'CREDIT': 0,
        'SOCIAL': 0
    };

    accounts.forEach(account => {
        counts[account.accountType] += 1;
    });

    return Object.values(counts);
};

const AccountDistributionChart = ({ accounts }) => {
    const chartRef = useRef(null); 

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        if (window.myChart) {
            window.myChart.destroy();
        }

        const accountCounts = countAccountTypes(accounts);

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Расчетные счета', 'Накопительные счета', 'Кредитные счета', 'Социальные счета'],
                datasets: [{
                    label: 'Распределение счетов',
                    data: accountCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false, 
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        return () => {
            if (window.myChart) window.myChart.destroy(); 
        };
    }, [accounts]);

    return (
        <div
            style={{
                width: '100%', 
                height: '400px', 
                maxHeight: '100vh',
                margin: '0 auto',
                padding: '10px',
            }}
        >
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default AccountDistributionChart;
