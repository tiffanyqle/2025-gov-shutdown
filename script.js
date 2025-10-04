let agencies = [];
let furloughedChart, percentChart;

async function loadData() {
    //load JSON
    const response = await fetch("shutdown_data.json");
    const data = await response.json();
    agencies = data.furloughed_employees;

    //render charts for all agencies
    updateCharts(agencies);

    //update overview boxes
    updateOverview();
    updateImpactBoxes();
}

//update the bar charts for given agencies
function updateCharts(filtered) {
    const labels = filtered.map(a => a.agency);
    const furloughedData = filtered.map(a => a.furloughed);
    const percentData = filtered.map(a => a.percent_affected);

    //destroy previous charts if they exist
    if (furloughedChart) furloughedChart.destroy();
    if (percentChart) percentChart.destroy();

    //Furloughed Employees Chart 
    const ctx1 = document.getElementById("furloughedChart").getContext("2d");
    furloughedChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Furloughed Employees",
                data: furloughedData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                minBarLength: 1.5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                title: {
                    display: true,
                    text: "Furloughed Federal Employees by Agency",
                    font: { size: 25, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Number of Employees",
                        font: { size: 10}
                    }
                }
            }
        }
    });

    //Percent Affected Chart 
    const ctx2 = document.getElementById("percentChart").getContext("2d");
    percentChart = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Percent Affected",
                data: percentData,
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                title: {
                    display: true,
                    text: "Percent of Employees Furloughed by Agency",
                    font: { size: 25, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: "Percent (%)",
                        font: { size: 10}
                    }
                }
            }
        }
    });
}

//update the overview boxes
function updateOverview() {
    //total furloughed employees
    const totalFurloughed = agencies.reduce((sum, a) => sum + a.furloughed, 0);
    document.querySelector("#total-furloughed p").textContent = totalFurloughed.toLocaleString();

    //agencies impacted (furloughed > 0)
    const agenciesImpacted = agencies.filter(a => a.furloughed > 0).length;
    document.querySelector("#agencies-impacted p").textContent = agenciesImpacted;

    //shutdown duration (days since Oct 1, 2025)
    const shutdownStart = new Date("2025-10-01");
    const today = new Date();
    const diffTime = today - shutdownStart; //milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; //+1 to include start day
    document.querySelector("#shutdown-duration p").textContent = diffDays + " days";
}

function updateImpactBoxes() {
    //total furloughed for recent shutdown
    const totalFurloughed = agencies.reduce((sum, a) => sum + a.furloughed, 0);
    document.getElementById("impact-furloughed").textContent = totalFurloughed.toLocaleString();

    //duration of current shutdown
    const shutdownStart = new Date("2025-10-01");
    const today = new Date();
    const diffTime = today - shutdownStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById("impact-duration").textContent = diffDays + " days";
}

//FAQ toggle function
document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const answer = button.nextElementSibling;
        answer.style.display = (answer.style.display === "block") ? "none" : "block";
    });
});
//initialize the dashboard
loadData();
