const yourtab=document.querySelector(".your-weather");
const searchtab=document.querySelector(".search-weather");
const grantUI=document.querySelector(".grant-location");
const grantbtn=document.querySelector(".loc");
const loadingUI=document.querySelector(".loading");
const input_field=document.querySelector("[input-field]");
const searchbtn=document.querySelector("[btn-search]");
const weatherUI=document.querySelector(".user-info");
const searchform=document.querySelector("#search-tab");
const vid=document.querySelector(".src");
const video=document.querySelector(".vid");
const volume=document.querySelector(".volo");
const novolume=document.querySelector(".xmark");
const videox=document.querySelector(".vide");
const novideo=document.querySelector(".slash");
novideo.classList.add("remove");
volume.classList.add("remove");
const videobtn=document.querySelector("#videox");
const volumebtn=document.querySelector(".voice1");
const prop={};
// --- API KEYS (replace with your own) ---
const TOMORROW_API_KEY = 'SPMgM0be7lFD3HghGbYdfA1rMxA01aLE'; // Get free key at https://app.tomorrow.io/
const OPENWEATHER_API_KEY = '60303b0f3ae8644b3632967cc2fb9480'; // fallback
// --- END API KEYS ---

let currenttab=yourtab;
currenttab.classList.add("current-tab");
grantbtn.addEventListener('click', getlocation);
yourtab.addEventListener('click', ()=>{switchtab(yourtab);});
searchtab.addEventListener('click', ()=>{switchtab(searchtab);});
const msg=new SpeechSynthesisUtterance();

// Preload voices
let voicesLoaded = false;
function loadVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            voicesLoaded = true;
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                voicesLoaded = true;
                resolve(voices);
            };
            // Fallback in case onvoiceschanged doesn't fire
            setTimeout(() => {
                if (!voicesLoaded) {
                    voices = window.speechSynthesis.getVoices();
                    resolve(voices);
                }
            }, 1000);
        }
    });
}
const err=document.querySelector(".error");

function getlocation(){
    stop();
    if(navigator.geolocation){
        // Just request permission but don't use the actual coordinates
        navigator.geolocation.getCurrentPosition(function(position) {
            // After getting permission, set default location to "Belluru"
            // but we'll display it as "BG Nagar"
            window.isDefaultLocationLoad = true;
            fetchsearchweather("Belluru");
        }, function(error) {
            alert('Location Permission Denied, Unable to detect Weather');
        });
    }
    else{
        alert('Location Permission Denied, Unable to detect Weather');
    }
}

function usercoords(position){
    const coordinates={
        lats:position.coords.latitude,
        long:position.coords.longitude,
    };
    sessionStorage.setItem('user-coords', JSON.stringify(coordinates));
    // We're not calling fetchuserweather here anymore
    // This prevents the actual location weather from being displayed
    // Instead, we'll always use Belluru as the default location
}

async function fetchuserweather(position){
    const lat=position.lats;
    const lon=position.long;
    
    grantUI.classList.remove("active");
    weatherUI.classList.remove("active");
    loadingUI.classList.add("active");
    volume.classList.add("remove");
    novolume.classList.remove("remove");
    window.speechSynthesis.cancel(msg);
    try{
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        const data = await response.json();
        loadingUI.classList.remove("active");
        err.classList.remove("active");
        weatherUI.classList.add("active");
        volumebtn.classList.add("active");
        videobtn.classList.add("active");
        renderinfo(data);
        Object.assign(prop, data);
    }
    catch{
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}


function renderinfo(stats){
    const cityname=document.querySelector("[city-name]");
    const countryicon=document.querySelector("[country-icon]");
    const weatherdes=document.querySelector("[weather-desc]");
    const weathericon=document.querySelector("[weather-icon]");
    const temp=document.querySelector("[temp]");
    const windspeed=document.querySelector("[windspeed]");
    const humidity=document.querySelector("[humidity]");
    const cloud=document.querySelector("[cloud]");

    // Check if this is the default location loaded after granting permission
    // We'll use a flag to track whether this is from the default location or search
    if (window.isDefaultLocationLoad && (stats?.name?.toLowerCase().includes("bellur") || 
        stats?.name?.toLowerCase().includes("bellūr"))) {
        cityname.innerText = "BG Nagar";
    } else {
        cityname.innerText = stats?.name;
    }
    
    countryicon.src=`https://flagcdn.com/144x108/${stats?.sys?.country.toLowerCase()}.png`;
    weatherdes.innerText=stats?.weather[0]?.description;
    weathericon.src=`https://openweathermap.org/img/wn/${stats?.weather[0]?.icon}.png`;
    temp.innerText=`${stats?.main?.temp} °C`;
    windspeed.innerText=`${stats?.wind?.speed}m/s`;
    humidity.innerText=`${stats?.main?.humidity}%`;
    cloud.innerText=`${stats?.clouds?.all}%`;

    const main=stats?.weather[0]?.main;
    bgchange(main);

}
function switchtab(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");
        video.classList.add("remove");
        stop();
    }
    if(!searchform.classList.contains("active")){
        weatherUI.classList.remove("active");
        volumebtn.classList.remove("active");
        videobtn.classList.remove("active");
        grantUI.classList.remove("active");
        err.classList.remove("active");
        searchform.classList.add("active");
    }
    else{
        searchform.classList.remove("active");
        weatherUI.classList.remove("active");
        volumebtn.classList.remove("active");
        videobtn.classList.remove("active");
        err.classList.remove("active");
        getsessionstorage();
        video.classList.remove("remove");
    }
}

function getsessionstorage(){
    const localcord=sessionStorage.getItem('user-coords');
    if(localcord){
        const coordinate=JSON.parse(localcord);
        fetchuserweather(coordinate);
    }
    else{
        grantUI.classList.add("active");
    }
    
}

searchform.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(input_field.value=="") return ;
    else {
        // Set flag to false when searching manually
        window.isDefaultLocationLoad = false;
        fetchsearchweather(input_field.value);
    }
});

async function fetchsearchweather(loc){
    // If this is called from the search form, it's not the default location
    if (!window.isDefaultLocationLoad) {
        window.isDefaultLocationLoad = false;
    }
    
    loadingUI.classList.add("active");
    weatherUI.classList.remove("active");
    err.classList.remove("active");
    grantUI.classList.remove("active");
    grantUI.classList.remove("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        const data= await response.json();
        loadingUI.classList.remove("active");
        weatherUI.classList.add("active");
        volumebtn.classList.add("active");
        videobtn.classList.add("active");
        renderinfo(data);
        Object.assign(prop, data);
    }
    catch{
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}
getsessionstorage();

// === 7-DAY FORECAST LOGIC (Tomorrow.io, fallback OpenWeather) ===
// --- DOM Elements ---
const forecastCarousel = document.querySelector('.forecast-carousel');
const confidenceToggle = document.getElementById('confidence-toggle');
const forecastMicrocopy = document.getElementById('forecast-microcopy-default');
const confidenceModal = document.getElementById('confidence-info');
const closeConfidenceInfo = document.getElementById('close-confidence-info');

// --- Utility ---
function getConfidenceLevel(conf) {
  if (conf === undefined || conf === null) return 'medium';
  if (conf >= 0.8) return 'high';
  if (conf >= 0.5) return 'medium';
  return 'low';
}
function confidenceText(level) {
  switch(level) {
    case 'high': return 'High confidence';
    case 'medium': return 'Medium confidence';
    case 'low': return 'Low confidence';
    default: return 'Unknown';
  }
}
function confidenceIcon(level) {
  switch(level) {
    case 'high': return '';
    case 'medium': return '';
    case 'low': return '';
    default: return '';
  }
}
function dayNameFromDate(dt) {
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, {weekday:'short'});
}
function formatHour(dt) {
  const d = new Date(dt);
  return d.getHours().toString().padStart(2,'0') + ':00';
}

// --- Fetch 7-day forecast from Tomorrow.io (fallback OpenWeather) ---
async function fetchForecast(lat, lon) {
  // Try Tomorrow.io first
  try {
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${TOMORROW_API_KEY}&timesteps=1d,1h&units=metric`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Tomorrow.io error');
    const data = await resp.json();
    return parseTomorrowForecast(data);
  } catch (e) {
    // fallback to OpenWeather OneCall
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('OpenWeather error');
    const data = await resp.json();
    return parseOpenWeatherForecast(data);
  }
}

function parseTomorrowForecast(data) {
  // Structure: {timelines: {daily: [...], hourly: [...]}}
  const daily = data.timelines.daily;
  const hourly = data.timelines.hourly;
  return daily.map((d, i) => {
    // Find all hours for this day
    const dayStart = new Date(d.time);
    const hours = hourly.filter(h => {
      const hDate = new Date(h.time);
      return hDate.getUTCDate() === dayStart.getUTCDate();
    });
    return {
      dt: d.time,
      temp: d.values.temperatureAvg,
      precip: d.values.precipitationProbabilityAvg,
      wind: d.values.windSpeedAvg,
      windDir: d.values.windDirectionAvg,
      uv: d.values.uvIndexAvg,
      aqi: d.values.epaIndex || null,
      confidence: d.values.precipitationProbabilityConfidence || d.values.temperatureConfidence || 0.7,
      hours: hours.map(h => ({
        dt: h.time,
        temp: h.values.temperature,
        precip: h.values.precipitationProbability,
        wind: h.values.windSpeed,
        windDir: h.values.windDirection,
        uv: h.values.uvIndex,
        aqi: h.values.epaIndex || null,
        confidence: h.values.precipitationProbabilityConfidence || h.values.temperatureConfidence || 0.7
      }))
    };
  });
}
function parseOpenWeatherForecast(data) {
  // Structure: {daily: [...], hourly: [...]}
  return data.daily.slice(0,7).map((d, i) => {
    // Find all hours for this day
    const dayStart = new Date(d.dt*1000);
    const hours = data.hourly.filter(h => {
      const hDate = new Date(h.dt*1000);
      return hDate.getUTCDate() === dayStart.getUTCDate();
    });
    return {
      dt: d.dt*1000,
      temp: d.temp.day,
      precip: d.pop*100,
      wind: d.wind_speed,
      windDir: d.wind_deg,
      uv: d.uvi,
      aqi: null,
      confidence: i<=2 ? 0.85 : (i<=4 ? 0.65 : 0.4),
      hours: hours.map(h => ({
        dt: h.dt*1000,
        temp: h.temp,
        precip: h.pop*100,
        wind: h.wind_speed,
        windDir: h.wind_deg,
        uv: h.uvi,
        aqi: null,
        confidence: i<=2 ? 0.85 : (i<=4 ? 0.65 : 0.4)
      }))
    };
  });
}

// --- Render forecast cards ---
function renderForecastCards(forecast, highConfidenceOnly=false) {
  forecastCarousel.innerHTML = '';
  forecast.forEach((day, i) => {
    const level = getConfidenceLevel(day.confidence);
    if (highConfidenceOnly && level !== 'high') return;
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="day">${dayNameFromDate(day.dt)}</div>
      <div class="temp">${Math.round(day.temp)}°C</div>
      <div class="confidence-label">
        <span class="confidence-bar" data-confidence="${level}" aria-label="${confidenceText(level)}"></span>
        <span class="confidence-icon">${confidenceIcon(level)}</span>
        <span class="visually-hidden">${confidenceText(level)}</span>
      </div>
      <div class="precip">Precip: ${Math.round(day.precip)}%</div>
      <div class="wind">Wind: ${Math.round(day.wind)} km/h</div>
      <div class="uv">UV: ${day.uv !== undefined ? day.uv : '-'} </div>
      <button class="expand-btn" aria-expanded="false" aria-controls="hourly-${i}">Hourly ▼</button>
      <div class="hourly-breakdown" id="hourly-${i}" aria-hidden="true"></div>
    `;
    // Expand/collapse logic
    const expandBtn = card.querySelector('.expand-btn');
    const hourlyDiv = card.querySelector('.hourly-breakdown');
    expandBtn.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      expandBtn.setAttribute('aria-expanded', expanded);
      hourlyDiv.setAttribute('aria-hidden', !expanded);
      expandBtn.textContent = expanded ? 'Hide ▲' : 'Hourly ▼';
      if (expanded) {
        hourlyDiv.innerHTML = day.hours.map(h => `
          <div>
            <span>${formatHour(h.dt)}</span>:
            <span>${Math.round(h.temp)}°C</span>,
            <span>Precip: ${Math.round(h.precip)}%</span>,
            <span>Wind: ${Math.round(h.wind)} km/h</span>
            <span class="confidence-icon">${confidenceIcon(getConfidenceLevel(h.confidence))}</span>
          </div>
        `).join('');
      } else {
        hourlyDiv.innerHTML = '';
      }
    });
    forecastCarousel.appendChild(card);
  });
}

// --- See More button logic ---
const seeMoreBtn = document.getElementById('see-more-forecast');
const forecastSection = document.querySelector('.forecast-section');
let lastForecast = [];
if (seeMoreBtn && forecastSection) {
  seeMoreBtn.addEventListener('click', () => {
    const visible = forecastSection.style.display === 'block';
    forecastSection.style.display = visible ? 'none' : 'block';
    seeMoreBtn.textContent = visible ? 'See More' : 'Hide 7-Day Forecast';
    if (!visible && lastForecast.length > 0) {
      // Render cards when showing section
      const pressed = confidenceToggle.getAttribute('aria-pressed') === 'true';
      renderForecastCards(lastForecast, pressed);
    }
  });
}

// --- Toggle and Modal logic ---
if (confidenceToggle && forecastSection) {
  confidenceToggle.addEventListener('click', () => {
    const pressed = confidenceToggle.getAttribute('aria-pressed') === 'true';
    confidenceToggle.setAttribute('aria-pressed', !pressed);
    if (forecastSection.style.display === 'block') {
      renderForecastCards(lastForecast, !pressed);
    }
    if (forecastMicrocopy) {
      forecastMicrocopy.textContent = !pressed ? 'Showing only high-confidence days.' : 'Forecasts are most reliable for the next 3 days.';
    }
  });
}
document.querySelector('.forecast-microcopy').addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    confidenceModal.style.display = 'flex';
    document.body.setAttribute('aria-hidden', 'true');
    closeConfidenceInfo.focus();
    e.preventDefault();
  }
});
closeConfidenceInfo.addEventListener('click', () => {
  confidenceModal.style.display = 'none';
  document.body.removeAttribute('aria-hidden');
  confidenceToggle.focus();
});

// --- Auto fetch forecast on load (example: Delhi) ---
window.addEventListener('DOMContentLoaded', async () => {
  let lat = 28.6139, lon = 77.2090; // Default: Delhi
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      loadForecast(lat, lon);
    }, () => loadForecast(lat, lon));
  } else {
    loadForecast(lat, lon);
  }
});
async function loadForecast(lat, lon) {
  forecastCarousel.innerHTML = '<div style="padding:2rem;">Loading...</div>';
  try {
    const forecast = await fetchForecast(lat, lon);
    lastForecast = forecast;
    renderForecastCards(forecast);
  } catch (e) {
    forecastCarousel.innerHTML = '<div style="color:#e74c3c;padding:2rem;">Could not load forecast data.</div>';
  }
}
// === END 7-DAY FORECAST LOGIC ===

function bgchange(main){
    video.classList.remove("remove");
    if(main=="Clear"){
        vid.src="video/clear.mp4";
        video.load();
    }
    else if(main=="Thunderstorm"){
        vid.src="video/light.mp4";
        video.load();
    }
    else if(main=="Drizzle" || main=="Rain"){
        vid.src="video/rain.mp4";
        video.load();
    }
    else if(main=="Snow"){
        vid.src="video/snow.mp4";
        video.load();
    }
    else if(main=="Mist" ||main=="Smoke" || main=="Haze" || main=="Dust" || main=="Fog" || main=="Sand" || main=="Ash" || main=="Squall" || main=="Tornado"){
        vid.src="video/fog.mp4";
        video.load();
    }
    else if(main=="Clouds"){
        vid.src="video/clouds.mp4";
        video.load();
    }
}

videobtn.addEventListener('click', ()=>{
    switchvideobtn();
});

function switchvideobtn(){
    if(novideo.classList.contains("remove")){
        novideo.classList.remove("remove");
        videox.classList.add("remove");
        video.classList.add("remove");
    }
    else{
        novideo.classList.add("remove");
        videox.classList.remove("remove");
        video.classList.remove("remove");
    }
}


volumebtn.addEventListener('click', () => {
    switchvolumebtn();
});

async function switchvolumebtn() {
    if ('speechSynthesis' in window) {
        const voices = await loadVoices();
        const voicestr = voice_assist();
        
        // Get the selected language from the dropdown
        const langSelect = document.getElementById('language-select');
        const selectedLang = langSelect ? langSelect.value : 'en-US';
        const isTranslated = selectedLang !== 'en-US' && selectedLang !== 'en';
        
        if (volume.classList.contains("remove")) {
            // User wants to turn ON speech
            volume.classList.remove("remove");
            novolume.classList.add("remove");
            
            // Cancel any previous speech
            window.speechSynthesis.cancel();
            
            // Show translation message if needed
            if (isTranslated) {
                alert('Translating weather report to your selected language...');
            }
            
            try {
                // Translate the text if needed
                let translatedText = voicestr;
                if (isTranslated && window.translateText) {
                    translatedText = await window.translateText(voicestr, selectedLang);
                    console.log('Translated text:', translatedText);
                }
                
                // Use browser speech synthesis
                useBrowserSpeech(translatedText, selectedLang, voices);
                
                if (isTranslated) {
                    alert("Translation complete! Your browser supports voice assistant 🎉");
                } else {
                    alert("Your browser supports voice assistant 🎉");
                }
            } catch (err) {
                console.error('Speech error:', err);
                alert('There was an error with the voice assistant. Please try again.');
            }
        } else {
            // User wants to turn OFF speech
            volume.classList.add("remove");
            novolume.classList.remove("remove");
            window.speechSynthesis.cancel();
        }
    } else {
        alert("Sorry, your browser does not support voice assistant.");
    }
}

// Helper function for browser speech synthesis
function useBrowserSpeech(text, language, voices) {
    // Create a new utterance for each speech to avoid issues
    const utterance = new SpeechSynthesisUtterance(text.toString());
    
    // Set language
    utterance.lang = language;
    console.log('Browser speech language:', utterance.lang);
    
    // Voice selection logic
    let match = null;
    
    // For Kannada, try multiple fallbacks
    if (language === 'kn-IN' || language === 'kn') {
        // Try Kannada first
        match = voices.find(v => v.lang === 'kn-IN' || v.lang === 'kn');
        // Then try Hindi as fallback (similar script)
        if (!match) match = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi');
        // Then try any Indian voice
        if (!match) match = voices.find(v => v.lang.endsWith('-IN'));
    } else {
        // For other languages, try exact match first
        match = voices.find(v => v.lang === language);
        // Then try language without region
        if (!match && language.includes('-')) {
            const baseLang = language.split('-')[0];
            match = voices.find(v => v.lang.startsWith(baseLang));
        }
    }
    
    if (match) {
        console.log('Selected voice:', match.name, match.lang);
        utterance.voice = match;
    } else if (voices.length > 0) {
        console.log('Fallback to first voice:', voices[0].name);
        utterance.voice = voices[0];
    }
    
    // Speak with the new utterance
    window.speechSynthesis.speak(utterance);
}

function voice_assist(){
    const denotionstr=gettimestr();
    const temp=`${prop?.main?.temp}`;
    // Use BG Nagar in voice assistant only for the default location
    const city = window.isDefaultLocationLoad && 
                (prop?.name?.toLowerCase().includes("bellur") || 
                 prop?.name?.toLowerCase().includes("bellūr")) ? 
                "BG Nagar" : prop?.name;
    const name="weather reporter";
    const desc=prop?.weather[0]?.description;
    const windspeed=`${prop?.wind?.speed}`;
    const maxtemp=`${prop?.main?.temp_max}`;
    const mintemp=`${prop?.main?.temp_min}`;
    const humidity=`${prop?.main?.humidity}`;
    const cloud=`${prop?.clouds?.all}`;
    const d1=prop?.sys?.sunrise;
    const dat1=new Date(d1*1000);
    const hrsr=String(dat1.getHours());
    const minr=String(dat1.getMinutes());
    const secr=String(dat1.getSeconds());
    

    const d2=prop?.sys?.sunset;
    const dat2=new Date(d2*1000);
    const hrss=String(dat2.getHours());
    const mins=String(dat2.getMinutes());
    const secs=String(dat2.getSeconds());
    
    const voicestr=`${denotionstr}, ${city}! I'm ${name}, and it's time for your daily weather update.

    Right now, we have a ${desc} with a temperature of ${temp} degrees Celsius. The wind is coming in at ${windspeed} kilometers per hour.
    As we move through the day, temperatures will reach a high of ${maxtemp} degrees Celsius with a low of ${mintemp} degrees Celsius.

    Here are some additional details for your day:

    Humidity stands at ${humidity}.
    The clouds is ${cloud}.
    Sunrise is at ${hrsr}hours ${minr}minutes ${secr}seconds and sunset at ${hrss}hours ${mins}minutes ${secs}seconds.

    Stay tuned for further updates and have a fantastic day.
    `;
    
    return voicestr;
        

}

function gettimestr(){
    const d=new Date();
    const currhrs=d.getHours();
    if(currhrs<12){
        return "Good Morning"
    }
    else if(currhrs<17){
        return "Good Afternoon";
    }
    else{
        return "Good Evening";
    }
}

function stop(){
    volume.classList.add("remove");
    novolume.classList.remove("remove");
    window.speechSynthesis.cancel(msg);
}





