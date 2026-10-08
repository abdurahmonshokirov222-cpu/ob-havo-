const API_KEY = "48e8b6a7be6007818af7e106b7ee36d5";
const CITY = "Tashkent"; // Shahar nomini o'zgartirishingiz mumkin

const forecastGrid = document.getElementById('forecastGrid');
const effectsContainer = document.getElementById('weather-effects');
const themeBtn = document.getElementById('themeBtn');

// OpenWeatherMap API orqali 5 kunlik/3 soatlik ma'lumotlarni olish va 3 kunga ajratish
async function fetchWeatherData() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&lang=uz&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Ob-havo ma'lumotlarini olib bo'lmadi");
        }

        const data = await response.json();
        processAndRenderData(data);
    } catch (error) {
        console.error(error);
        forecastGrid.innerHTML = `<p style="color:red;">Xatolik yuz berdi. API kalit yoki internetni tekshiring.</p>`;
    }
}

// Kelgan ma'lumotlarni Bugun, Ertaga va Ertadan keyingi kun uchun saralash
function processAndRenderData(data) {
    const dailyList = [];
    const addedDates = new Set();

    // Har bir kun uchun soat 12:00 dagi ma'lumotni tanlab olamiz
    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0];
        
        if (!addedDates.has(dateStr) && dailyList.length < 3) {
            addedDates.add(dateStr);
            dailyList.push(item);
        }
    });

    const dayLabels = ["Bugun", "Ertaga", "Ertadan keyin"];

    forecastGrid.innerHTML = '';

    dailyList.forEach((item, index) => {
        const dateObj = new Date(item.dt * 1000);
        const dayName = dayLabels[index] || dateObj.toLocaleDateString('uz-UZ', { weekday: 'short' });
        const dateFormatted = `${dateObj.getDate()}-${getUzMonth(dateObj.getMonth())}`;
        
        const mainCondition = item.weather[0].main.toLowerCase();
        let type = 'sun';
        let icon = '☀️';

        if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
            type = 'rain';
            icon = '🌧️';
        } else if (mainCondition.includes('snow')) {
            type = 'snow';
            icon = '❄️';
        } else if (mainCondition.includes('cloud')) {
            type = 'sun'; // Bulutli bo'lsa ham quyosh effekti yoki neytral ushlab turamiz
            icon = '☁️';
        }

        const card = document.createElement('div');
        card.className = `weather-card ${index === 0 ? 'active' : ''}`;
        card.onclick = () => selectDay(card, type);

        card.innerHTML = `
            <div class="day-title">${dayName}</div>
            <div class="date">${dateFormatted}</div>
            <div class="icon">${icon}</div>
            <div class="temp">${Math.round(item.main.temp)}°C</div>
            <div class="desc">${item.weather[0].description}</div>
            <div class="details">
                💧 Namlik: <b>${item.main.humidity}%</b><br>
                💨 Shamol: <b>${Math.round(item.wind.speed * 3.6)} km/s</b>
            </div>
        `;
        forecastGrid.appendChild(card);

        if (index === 0) {
            applyWeatherEffect(type);
        }
    });
}

function getUzMonth(monthIndex) {
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktyabr", "Noyabr", "Dekabr"];
    return months[monthIndex];
}

// Kun tanlanganda vizual effektni o'zgartirish
function selectDay(selectedCard, type) {
    document.querySelectorAll('.weather-card').forEach(c => c.classList.remove('active'));
    selectedCard.classList.add('active');
    applyWeatherEffect(type);
}

// Dynamic Visual Effects (Sun, Rain, Snow)
function applyWeatherEffect(type) {
    effectsContainer.innerHTML = '';

    if (type === 'rain') {
        for (let i = 0; i < 60; i++) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            drop.style.animationDelay = `${Math.random()}s`;
            effectsContainer.appendChild(drop);
        }
    } else if (type === 'snow') {
        for (let i = 0; i < 40; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.innerHTML = '❄';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${2 + Math.random() * 3}s`;
            flake.style.animationDelay = `${Math.random()}s`;
            effectsContainer.appendChild(flake);
        }
    } else if (type === 'sun') {
        const sun = document.createElement('div');
        sun.className = 'sun-ray';
        effectsContainer.appendChild(sun);
    }
}

// Dark Mode Switcher
themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeBtn.textContent = '🌙 Tungi Rejim';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeBtn.textContent = '☀️ Kunduzgi Rejim';
    }
});

// Dasturni real API ma'lumotlari bilan ishga tushirish
fetchWeatherData();