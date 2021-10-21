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

renderWeatherCards = (weatherData) => {
  renderCurrentWeatherCard(weatherData.current);
};

renderWeatherCards(mockData);
