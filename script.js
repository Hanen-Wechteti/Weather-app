const cityInput = document.querySelector('.cityInput');
const searchButton = document.querySelector(".searchBtn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".currentWeather");
const autoCompleteContainer= document.getElementById('autoCompleteList');    

const apikey = "643eaf1fe1561330e45e3dabbb9a725c";



const secretKey = "U_VTt0E8suHyBvRtsa1uF7xPoapeNSb0LVLEc_EcqZc";


const createWeatherCard = (cityName, weatherItem, index) => {

    if(index ===0){  //HTML pour le main weather Card
        return `<div class="details">

        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>wind: ${weatherItem.wind.speed} M/S</h4>
        <h4> Humidity:${(weatherItem.main.humidity)}%</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon" >
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;

    }else { //HTML pour les 5 jours (forecast card)
    return `
        <li class="card">
            <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
            <img src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4> ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>wind: ${weatherItem.wind.speed} M/S</h4>
            <h4> Humidity:${(weatherItem.main.humidity)}%</h4>
        </li>`;
    }
};

async function getCityExamples(cityName) {
    const username = 'Hanen27'
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=Paris&username=${username}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Réponse de l\'API Nominatim:', data);
        return data.map(item => item.display_name);
    } catch (error) {
        console.error('Erreur lors de la récupération des exemples de villes depuis Nominatim:', error);
        throw new Error('Erreur lors de la récupération des exemples de villes depuis Nominatim');
    }
}
// fonction pour afficher les exemples de villes dans l'autocomplete

function showCityAutocomplete(cityList) {

    const autoCompleteContainer= document.getElementById('autoCompleteList');
    autoCompleteContainer.innerHTML ='';

    cityList.slice(0, 10).forEach(city => {
        const suggestion = document.createElement('div');
        suggestion.textContent = city;

        suggestion.addEventListener('click', () =>{
            cityInput.value= city;
            autoCompleteContainer.innerHTML ='';

//pour sauvegarder le choix de l'utilisateur
            saveUserChoice(city);
        });

     autoCompleteContainer.appendChild(suggestion);
    })
}


const getWeatherDetails = (cityName, lat, lon) => {
    const weather_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
    
    //obtenir les coordonnées de la ville saisies à partir de l'API
   
    fetch(weather_url).then(res => res.json()).then(data => {
        // filtrer le forecast a fin d avoir un par jours
        const uniqueForecastDays = [];
        const fiveDaysForeCast = data.list.filter(forecast => {
              const forecastDate = new Date(forecast.dt_txt).getDate();
              if(!uniqueForecastDays.includes(forecastDate)){
               return uniqueForecastDays.push(forecastDate)
              }
            });

            console.log(data)

            //nettoyer les dernieres données
            cityInput.value ="";
            weatherCardsDiv.innerHTML = "";
            weatherCardsDiv.style.display ="flex";
            currentWeatherDiv.innerHTML = "";
            currentWeatherDiv.style.display ="flex";

            

            console.log(fiveDaysForeCast);

            // creation de weather Cards et leurs additions au DOM
            fiveDaysForeCast.forEach((weatherItem, index) => {
                if(index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index ));
                } else {
             weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
                
                }  
            });
        }).catch(() => {
        alert("an error occured whilt fetching the coordinates!");
    });
}


// Fonction pour obtenir des exemples de villes 
const cityName = cityInput.value.trim();

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    
    if (!cityName) return; // return si cityname est vide
    
    const geocoding_url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apikey}`;
    
    console.log(cityName);

    try {
        const response = await fetch(geocoding_url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.length) {
            throw new Error(`No coordinates found for ${cityName}`);
        }

        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    } catch (error) {
        alert(`An error occurred: ${error.message}`);
    }
};


async function getCityExamples(cityName) {
    const username = 'Hanen27'
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${cityName}&username=${username}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data.map(item => item.display_name);
    } catch (error) {
        throw new Error('Erreur lors de la récupération des exemples de villes depuis Nominatim');
    }
}


cityInput.addEventListener('input', async () => {
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        try {
            const cityExamples = await getCityExamples(cityName);
            showCityAutocomplete(cityExamples);
        } catch (error) {
            console.error('Erreur lors de la récupération des exemples de villes:', error);
        }
    } else {
        autoCompleteContainer.innerHTML = ''; 
    }
});

const accessKey = "qdx0Ht61IY7f5j1QK0HXfKystxkr-L9oKXadSFewKAc";
const urlImage = `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${accessKey}`;

let imageElement = document.getElementById("unsplashImage");
let imageLink = document.getElementById("imageLink");

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener('keyup', e => e.key === "Enter" && getCityCoordinates());

let image = async (cityName) =>{
    let response = await fetch (`https://api.unsplash.com/search/photos?client_id=AmF10nKuZ5tbJB9EDt4PYS0HMIFZKnsfuBeu_67fT6Y&page=1&query=${cityName}`);
    let data =await response.json();
console.log(response.json());
}
//
function saveUserChoice(city) {
    localStorage.setItem('userCity', city);
}

// Fonction pour récupérer le choix de l'utilisateur depuis le stockage local
function getUserChoice() {
    return localStorage.getItem('userCity');
}


document.addEventListener('DOMContentLoaded', () => {
    const previousUserChoice = getUserChoice();

    if (previousUserChoice) {
        
        cityInput.value = previousUserChoice;


        getCityCoordinates();
    }
});
