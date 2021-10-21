const dashboardContainer = $("#dashboard-container");

const API_KEY = "82c607cdbf31b750f2970e7092997d99";

//get Data from API
const getWeatherData = async (cityName) => {
  const currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  const currentDataResponse = await fetch(currentDataUrl);
  const currentData = await currentDataResponse.json();

  const lat = currentData.coord.lat;
  const lon = currentData.coord.lon;
  const name = currentData.name;

  const forecastDataUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

  const forecastDataResponse = await fetch(forecastDataUrl);
  const forecastData = await forecastDataResponse.json();

  return {
    current: {
      name: name,
      temperature: forecastData.current.temp,
      wind: forecastData.current.wind,
      humidity: forecastData.current.humidity,
      uvi: forecastData.current.uvi,
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
};

//construct current day weather card
const renderCurrentWeatherCard = (currentData) => {
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

//construct forecast cards
const renderForecastWeatherCards = (forecastData) => {
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

const renderWeatherCards = (weatherData) => {
  renderCurrentWeatherCard(weatherData.current);

  renderForecastWeatherCards(weatherData.forecast);
};

const onLoad = async () => {
  //get data from API
  const weatherData = await getWeatherData("birmingham");

  renderWeatherCards(weatherData);
};

$(document).ready(onLoad);
