const dashboardContainer = $("#dashboard-container");
const cityList = $("#city-list");

const API_KEY = "82c607cdbf31b750f2970e7092997d99";

const getFormattedDate = (unixTimeStamp, format = "ddd DD/MM/YYYY") => {
  return moment.unix(unixTimeStamp).format(format);
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

  if (currentDataResponse.status === 200) {
    const currentData = await currentDataResponse.json();

    setCitiesInLs(cityName);

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
  }
};

const getCitiesFromLs = () => {
  //get cities from LS
  return JSON.parse(localStorage.getItem("recentCities")) ?? [];
};

const setCitiesInLs = (cityName) => {
  //get cities from LS
  const cities = getCitiesFromLs();

  //if city does not exist
  if (!cities.includes(cityName)) {
    //insert cityName in cities
    cities.push(cityName);

    //set cities in LS
    localStorage.setItem("recentCities", JSON.stringify(cities));
  }
};

const getUVIClassName = (uvi) => {
  //get uvi class name
  if (uvi >= 0 && uvi < 3) {
    return "uvi-blue";
  } else if (uvi >= 3 && uvi < 5) {
    return "uvi-yellow";
  } else if (uvi >= 5 && uvi < 8) {
    return "uvi-orange";
  } else {
    return "uvi-red";
  }
};

//Construct Alert Message
const renderAlertCard = () => {
  const currentAlertCard = `<div class="alert-card"><p>Please enter a valid city name</p></div>`;

  $("#alert-container").append(currentAlertCard);
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
          UV index: <span class=${getUVIClassName(current.uvi)}>${
    current.uvi
  }</span>
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
  const constructForecastCard = (each) => {
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
  if (weatherData) {
    renderCurrentWeatherCard(weatherData.current);

    renderForecastWeatherCards(weatherData.forecast);
  } else {
    renderAlertCard();
  }
};

const renderRecentCities = () => {
  //get cities from LS
  const cities = getCitiesFromLs();
  cityList.empty();

  const constructAndAppendCity = (city) => {
    //construct each li item
    const liEl = `<li data-city=${city} class="list-group-item">${city}</li>`;

    //append to the list
    cityList.append(liEl);
  };

  const handleClick = (event) => {
    const target = $(event.target);

    // if click is from li
    if (target.is("li")) {
      //get city data-name
      const cityDataName = target.data("city");

      //render weather inf with cityDataName
      renderWeatherInfo(cityDataName);
    }
  };

  cityList.on("click", handleClick);

  cities.forEach(constructAndAppendCity);
};

const renderWeatherInfo = async (cityName) => {
  //get data from API
  const weatherData = await getWeatherData(cityName);

  //remove the last city forecast
  dashboardContainer.empty();

  renderWeatherCards(weatherData);
};

const handleSearch = async (event) => {
  event.preventDefault();

  $("#alert-container").empty();

  const cityName = $("#city-input").val();

  if (cityName) {
    await renderWeatherInfo(cityName);

    renderRecentCities();
  }
};

const handleReady = () => {
  //render recent cities
  renderRecentCities();

  //get cities from LS
  const cities = getCitiesFromLs();

  //if there recent cities get info for the most recent city
  if (cities.length) {
    const cityName = cities.pop();

    renderWeatherInfo(cityName);
  }
};

const onClear = () => {
  localStorage.clear();

  $(cityList).empty();

  $(dashboardContainer).empty();
};

// add a event listener click to clear all button
$("#clear-btn").on("click", onClear);

$("#search-form").on("submit", handleSearch);

$(document).ready(handleReady);
