const mockData = {
  current: {
    name: "London",
    temperature: 123.45,
    wind: 111.22,
    humidity: 33,
    uvi: 2.5,
    date: "(3/30/2021)",
    iconCode: "04n",
  },
  forecast: [
    {
      date: "(3/30/2021)",
      temperature: 123.45,
      wind: 111.22,
      humidity: 33,
      iconCode: "04n",
    },
    {
      date: "(3/30/2021)",
      temperature: 123.45,
      wind: 111.22,
      humidity: 33,
      iconCode: "04n",
    },
    {
      date: "(3/30/2021)",
      temperature: 123.45,
      wind: 111.22,
      humidity: 33,
      iconCode: "04n",
    },
    {
      date: "(3/30/2021)",
      temperature: 123.45,
      wind: 111.22,
      humidity: 33,
      iconCode: "04n",
    },
    {
      date: "(3/30/2021)",
      temperature: 123.45,
      wind: 111.22,
      humidity: 33,
      iconCode: "04n",
    },
  ],
};

const dashboardContainer = $("#dashboard-container");

//construct current day weather card
renderCurrentWeatherCard = (currentData) => {
  const currentWeatherCard = ` <div class="current-city-container">
  <h2>
    ${currentData.name} ${currentData.date}
  </h2>
  <div class="current-city-body">
      <div class="current-city-content">
        <p>Temp: ${currentData.temperature}&deg;F</p>
        <p>Wind: ${currentData.wind} MPH</p>
        <p>Humidity: ${currentData.humidity}%</p>
        <p>
          UV index: <span class="uv-btn">${currentData.uvi}</span>
        </p>
      </div>
      <div class="current-city-img">
        <img
        src="https://openweathermap.org/img/w/${currentData.iconCode}.png"
      />
      </div>
  </div>
</div>`;

  dashboardContainer.append(currentWeatherCard);
};

renderForecastWeatherCards = (forecastData) => {
  constructForecastCard = (each) => {
    return `<div class="forecast-card">
        <h5 class="forecast-card-title">${each.date}</h5>
        <div class="forecast-card-body">
            <div class="forecast-card-content">
                <p class="card-text">Temp: ${each.temperature}&deg;F</p>
                <p class="card-text">Wind: ${each.wind} MPH</p>
                <p class="card-text">Humidity: ${each.humidity}%</p>
            </div>
            <div class="forecast-card-img">
                <img
                src="https://openweathermap.org/img/w/${each.iconCode}.png"
            />
            </div>
        </div>
    </div>`;
  };

  const forecastCards = forecastData.map(constructForecastCard).join("");

  const forecastCardsContainer = ` <div class="forecast-container">
        <h3 class="forecast-title">5-Day Forecast:</h3>
        <div class="forecast-card-container"> ${forecastCards}
        </div>
    </div>`;

  dashboardContainer.append(forecastCardsContainer);
};

renderWeatherCards = (weatherData) => {
  renderCurrentWeatherCard(weatherData.current);

  renderForecastWeatherCards(weatherData.forecast);
};

renderWeatherCards(mockData);
