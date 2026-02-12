let chartInstance = null;

function updateChart(currentTemp) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    const labels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
    const dataPoints = [currentTemp - 4, currentTemp - 2, currentTemp, currentTemp + 1, currentTemp - 1, currentTemp - 3];

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Trend',
                data: dataPoints,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}