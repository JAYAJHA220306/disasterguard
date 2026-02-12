// DisasterGuard - Final Integrated Version
const API_KEY = 'cb0d6ef07d1aba143a1a3f6ba2c75571'; 

async function getWeatherData() {
    const location = document.getElementById('cityInput').value;
    
    if (!location) {
        alert("Please enter a Village, Town, or City name.");
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod === "404") {
            alert("Location Not Found: Rural areas should try their nearest District or Taluka name.");
            return;
        }

        if (data.cod !== 200) {
            throw new Error("API Key activation pending");
        }
        
        showDashboard(data, false);

    } catch (err) {
        console.warn("API Issue: Switching to Demo Mode for presentation.");
        // FAIL-SAFE: Mock data ensures your UI is never empty during the hackathon
        const mockData = {
            main: { temp: 42, humidity: 20 },
            weather: [{ main: "Clear" }],
            name: location + " (Demo Mode)"
        };
        showDashboard(mockData, true);
    }
}

// Logic for Geolocation (GPS)
async function getLocation() {
    const gpsBtn = document.getElementById('gpsBtn');
    if (!navigator.geolocation) {
        alert("Geolocation not supported by this browser.");
        return;
    }

    gpsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod === 200) {
                document.getElementById('cityInput').value = data.name;
                showDashboard(data, false);
            }
        } catch (err) {
            alert("Unable to retrieve location data.");
        } finally {
            gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        }
    }, () => {
        gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        alert("Location access denied.");
    });
}

function showDashboard(data, isDemo) {
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.remove('hidden');
    // Ensure smooth fade in
    setTimeout(() => {
        dashboard.style.opacity = "1";
    }, 10);

    processRiskData(data, isDemo);
}

function processRiskData(data, isDemo = false) {
    const temp = Math.round(data.main.temp);
    const weather = data.weather[0].main;
    const locationName = data.name;
    
    const riskCard = document.getElementById('riskLevel');
    const riskStatus = document.getElementById('riskStatusText');
    const riskAdvice = document.getElementById('riskAdvice');

    document.getElementById('tempText').innerText = `${temp}°C`;
    document.getElementById('weatherDesc').innerText = weather;

    let level = "Low";
    let link = ""; 

    // Risk Analysis Logic
    if (temp > 40) {
        level = "High";
        riskCard.className = "risk-card high-risk";
        link = "Heatwave";
    } else if (["Rain", "Thunderstorm", "Drizzle", "Clouds"].includes(weather)) {
        // Included 'Clouds' for demo purposes so it's easier to show the Medium risk
        level = "Medium";
        riskCard.className = "risk-card med-risk";
        link = "Floods";
    } else {
        level = "Low";
        riskCard.className = "risk-card low-risk";
    }

    riskStatus.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Risk Level: ${level}`;
    
    let adviceHTML = isDemo ? `<small style="color:var(--accent)">[DEMO MODE ACTIVE]</small><br>` : "";
    adviceHTML += `<strong>Status:</strong> ${weather} conditions detected in ${locationName}. `;
    
    if (link !== "") {
        adviceHTML += `<br><br><a href="guidebook.html" class="btn" style="padding: 10px 20px; font-size: 0.85rem; display: inline-block;">Read ${link} Guide</a>`;
    } else {
        adviceHTML += "No immediate disaster threat detected. Stay alert for updates.";
    }
    
    riskAdvice.innerHTML = adviceHTML;

    // Safety check: Only call updateChart if it exists in charts.js
    if (typeof updateChart === "function") {
        updateChart(temp);
    }
}