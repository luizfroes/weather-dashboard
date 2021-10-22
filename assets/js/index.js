const dashboardContainer = $("#dashboard-container");

const API_KEY = "82c607cdbf31b750f2970e7092997d99";

const getFormattedDate = (unixTimeStamp) => {
  return moment.unix(unixTimeStamp).format("ddd DD/MM/YYY");
};

const getCurrentData = (name, forecastData) => {
  return {
    name: name,
    temperature: forecastData.current.temp,
    feels_like: forecastData.current.feels_like,
    wind: forecastData.current.wind_speed,
    humidity: forecastData.current.humidity,
    uvi: forecastData.current.uvi,
    date: getFormattedDate(forecastData.current.dt),
    iconCode: forecastData.current.weather[0].icon,
  };
};

const getForecastData = (forecastData) => {
  const callBack = (each) => {
    return {
      date: getFormattedDate(each.dt),
      max_temperature: each.temp.max,
      min_temperature: each.temp.min,
      wind: each.wind_speed,
      humidity: each.humidity,
      iconCode: each.weather[0].icon,
    };
  };

  return forecastData.daily.slice(1, 8).map(callBack);
};

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

  const current = getCurrentData(name, forecastData);

  const forecast = getForecastData(forecastData);

  return {
    current: current,
    forecast: forecast,
  };
};

//construct current day weather card
const renderCurrentWeatherCard = (current) => {
  const currentWeatherCard = ` <div class="current-city-container">
  <h2>
    ${current.name} ${current.date}
  </h2>
  <div class="current-city-body">
      <div class="current-city-content">
        <p>Temp: ${current.temperature}&deg;F</p>
        <p>Feels Like: ${current.feels_like}&deg;F</p>
        <p>Wind: ${current.wind} MPH</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>
          UV index: <span class="uv-btn">${current.uvi}</span>
        </p>
      </div>
      <div class="current-city-img">
        <img
        src="https://openweathermap.org/img/w/${current.iconCode}.png"
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
                <p class="card-text">Max Temp: ${each.max_temperature}&deg;F</p>
                <p class="card-text">Min Temp: ${each.min_temperature}&deg;F</p>
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
        <h3 class="forecast-title">7-Day Forecast:</h3>
        <div class="forecast-card-container"> ${forecastCards}
        </div>
    </div>`;

  dashboardContainer.append(forecastCardsContainer);
};

const renderWeatherCards = (weatherData) => {
  renderCurrentWeatherCard(weatherData.current);

  renderForecastWeatherCards(weatherData.forecast);
};

const handleSearch = async (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();

  if (cityName) {
    //get data from API
    const weatherData = await getWeatherData(cityName);

    //remove the last city forecast
    dashboardContainer.empty();

    renderWeatherCards(weatherData);
  }
};

$("#search-form").on("submit", handleSearch);
