// Weather Chatbot Widget
// Lightweight, embeddable. Uses OpenWeatherMap API (free tier, requires API key)
// See integration instructions at the end of this file.
(function () {
  // --- CONFIG ---
  const OPENWEATHER_API_KEY = '60303b0f3ae8644b3632967cc2fb9480'; // <-- Replace with your free API key!
  const DEFAULT_CITY = 'Hassan';
  const ICON_URL = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f329.svg'; // Cloud emoji
  // --- END CONFIG ---

  // Inject CSS if not present
  if (!document.getElementById('weather-chatbot-css')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'weather-chatbot.css';
    l.id = 'weather-chatbot-css';
    document.head.appendChild(l);
  }

  // Add floating icon
  if (!document.getElementById('weather-chatbot-icon')) {
    const icon = document.createElement('div');
    icon.id = 'weather-chatbot-icon';
    icon.innerHTML = `<img src="${ICON_URL}" alt="Chatbot" draggable="false">`;
    document.body.appendChild(icon);
  }

  // Chatbot window (hidden by default)
  if (!document.getElementById('weather-chatbot-window')) {
    const win = document.createElement('div');
    win.id = 'weather-chatbot-window';
    win.style.display = 'none';
    win.innerHTML = `
      <div id="weather-chatbot-header">
        <span>Weather Chatbot</span>
        <button id="weather-chatbot-location" title="Change location" style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;margin-right:10px;">📍</button>
        <button id="weather-chatbot-close" title="Minimize">&minus;</button>
      </div>
      <div id="weather-chatbot-messages"></div>
      <form id="weather-chatbot-input-row" autocomplete="off">
        <input id="weather-chatbot-input" type="text" placeholder="Ask about the weather..." autocomplete="off" required />
        <button id="weather-chatbot-send" type="submit" title="Send">&#10148;</button>
      </form>
    `;
    document.body.appendChild(win);
  }

  // Elements
  const icon = document.getElementById('weather-chatbot-icon');
  const win = document.getElementById('weather-chatbot-window');
  const closeBtn = document.getElementById('weather-chatbot-close');
  const locationBtn = document.getElementById('weather-chatbot-location');
  const msgBox = document.getElementById('weather-chatbot-messages');
  const inputRow = document.getElementById('weather-chatbot-input-row');
  const input = document.getElementById('weather-chatbot-input');

  // Location state
  let userLocation = null; // {city, lat, lon}
  function saveLocation(loc) {
    localStorage.setItem('weather-chatbot-location', JSON.stringify(loc));
  }
  function loadLocation() {
    try {
      return JSON.parse(localStorage.getItem('weather-chatbot-location'));
    } catch(e) { return null; }
  }

  // Prompt user for location (city or coordinates)
  async function promptForLocation() {
    return new Promise((resolve) => {
      let promptMsg = 'Please enter your city or coordinates (lat,lon):';
      let ask = () => {
        const loc = prompt(promptMsg);
        if (!loc) return resolve(null);
        const coordMatch = loc.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (coordMatch) {
          resolve({lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2])});
        } else {
          resolve({city: loc.trim()});
        }
      };
      ask();
    });
  }

  // Change location handler
  locationBtn.addEventListener('click', async function() {
    botReply('Let\'s set your location!');
    const loc = await promptForLocation();
    if (!loc) return botReply('Location not set.');
    userLocation = loc;
    saveLocation(loc);
    botReply('Location updated! You can now ask weather questions.');
  });

  // Toggle open/close
  function openChat() {
    win.style.display = 'flex';
    setTimeout(() => {
      win.style.opacity = '1';
      input.focus();
    }, 50);
    icon.style.display = 'none';
  }
  function closeChat() {
    win.style.opacity = '0';
    setTimeout(() => {
      win.style.display = 'none';
      icon.style.display = 'flex';
    }, 200);
  }
  icon.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  // Keep icon fixed on scroll (redundant, but ensures mobile browser support)
  window.addEventListener('scroll', () => {
    icon.style.bottom = '24px';
    icon.style.right = '24px';
  });

  // Chat logic
  function addMsg(text, sender) {
    const m = document.createElement('div');
    m.className = 'weather-chatbot-msg ' + sender;
    m.innerText = text;
    msgBox.appendChild(m);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
  function botReply(text) {
    // Allow HTML in bot replies (for links)
    const m = document.createElement('div');
    m.className = 'weather-chatbot-msg bot';
    m.innerHTML = text;
    msgBox.appendChild(m);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
  function userMsg(text) { addMsg(text, 'user'); }

  // --- Weather API helpers ---
  async function fetchWeather(city, when, type) {
    // type: 'current' | 'forecast', when: Date object or null
    if (!OPENWEATHER_API_KEY) {
      botReply('Please set your OpenWeatherMap API key in weather-chatbot.js.');
      return null;
    }
    let url = '';
    if (type === 'current') {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      botReply('Sorry, I couldn\'t fetch weather for ' + city + '.');
      return null;
    }
  }
  async function fetchWeatherByCoords(lat, lon, when, type) {
    if (!OPENWEATHER_API_KEY) {
      botReply('Please set your OpenWeatherMap API key in weather-chatbot.js.');
      return null;
    }
    let url = '';
    if (type === 'current') {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      botReply('Sorry, I couldn\'t fetch weather for your location.');
      return null;
    }
  }

  // --- Pattern matching for user queries ---
  function parseQuery(q) {
    // Returns { intent, time, city }
    q = q.trim().toLowerCase();
    let intent = '', city = '', time = null;
    // Try to extract city ("in Paris", "at Mumbai")
    const cityMatch = q.match(/(?:in|at)\s+([a-zA-Z][a-zA-Z\s]+)/);
    if (cityMatch) {
      city = (cityMatch[1] || '').trim();
      // Ignore if city is empty or just a preposition
      if (!city || city === 'at' || city === 'in') city = '';
    }
    // Time phrases
    const now = new Date();
    if (/now|current|right now|today/.test(q)) {
      time = now;
    } else if (/tomorrow/.test(q)) {
      time = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    // Hour (e.g., "at 5 pm", "5am")
    const hourMatch = q.match(/(at )?(\d{1,2})( ?)(am|pm)?/);
    if (hourMatch) {
      let h = parseInt(hourMatch[2]);
      if (hourMatch[4]) {
        if (hourMatch[4] === 'pm' && h < 12) h += 12;
        if (hourMatch[4] === 'am' && h === 12) h = 0;
      }
      if (!time) time = new Date(now.getTime());
      time.setHours(h, 0, 0, 0);
    }
    // Intent
    if (/rain|raining|rainfall/.test(q)) {
      intent = 'rain';
    } else if (/temperature|hot|cold|warm|cool/.test(q)) {
      intent = 'temperature';
    } else if (/wind/.test(q)) {
      intent = 'wind';
    } else if (/humidity/.test(q)) {
      intent = 'humidity';
    } else if (/cloud|cloudy/.test(q)) {
      intent = 'cloud';
    } else if (/forecast|weather/.test(q)) {
      intent = 'weather';
    }
    return { intent, time, city };
  }

  // --- Main chat handler ---
  async function handleUserQuery(q) {
    userMsg(q);
    const parsed = parseQuery(q);
    let city = parsed.city;
    let time = parsed.time;
    let intent = parsed.intent;
    let usedGeo = false;
    let lat, lon;

    // Check for coordinates in user input
    const coordMatch = q.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lon = parseFloat(coordMatch[2]);
      userLocation = {lat, lon};
      saveLocation(userLocation);
      city = null;
      usedGeo = true;
    } else if (parsed.city) {
      userLocation = {city: parsed.city};
      saveLocation(userLocation);
      city = parsed.city;
    } else {
      // Use stored location if available
      const stored = loadLocation();
      if (stored) {
        userLocation = stored;
        if (stored.city) city = stored.city;
        if (stored.lat && stored.lon) { lat = stored.lat; lon = stored.lon; usedGeo = true; }
      }
    }

    // If nothing yet, try geolocation
    if (!city && !usedGeo) {
      botReply('Looking up your location...');
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {timeout: 6000});
        });
        lat = pos.coords.latitude; lon = pos.coords.longitude;
        userLocation = {lat, lon};
        saveLocation(userLocation);
        usedGeo = true;
      } catch (e) {
        // Prompt for manual entry
        botReply('Could not get your location. Please enter your city or coordinates (lat,lon):');
        const loc = await promptForLocation();
        if (!loc) {
          city = DEFAULT_CITY;
          botReply('Using default city: ' + DEFAULT_CITY);
        } else if (loc.lat && loc.lon) {
          lat = loc.lat; lon = loc.lon; usedGeo = true;
          userLocation = {lat, lon};
          saveLocation(userLocation);
        } else if (loc.city) {
          city = loc.city;
          userLocation = {city};
          saveLocation(userLocation);
        }
      }
    }
    // Fallback to default city if still nothing
    if ((!city && !usedGeo) || city === 'at' || city === 'in') {
      city = DEFAULT_CITY;
      userLocation = {city};
      saveLocation(userLocation);
    }

    // Fetch weather (current and forecast)
    let currentData = null, forecastData = null;
    if (usedGeo) {
      currentData = await fetchWeatherByCoords(lat, lon, null, 'current');
      forecastData = await fetchWeatherByCoords(lat, lon, null, 'forecast');
    } else {
      currentData = await fetchWeather(city, null, 'current');
      forecastData = await fetchWeather(city, null, 'forecast');
    }
    if (!currentData) return;

    // Respond based on intent
    if (intent === 'rain') {
      let reply = '';
      if (currentData.weather && currentData.weather[0].main.toLowerCase().includes('rain')) {
        reply = 'Yes, it looks like rain.';
      } else if (currentData.rain || (forecastData && forecastData.list && forecastData.list.some(f => f.weather[0].main.toLowerCase().includes('rain')))) {
        reply = 'Yes, rain is expected.';
      } else {
        reply = 'No rain expected.';
      }
      botReply(reply);
    } else if (intent === 'temperature') {
      let t;
      // If user asked about a future time, use forecast
      if (time && forecastData && forecastData.list) {
        // Find the forecast closest to the requested time
        let minDiff = Infinity, closest = null;
        for (const slot of forecastData.list) {
          const slotTime = new Date(slot.dt * 1000);
          const diff = Math.abs(slotTime - time);
          if (diff < minDiff) {
            minDiff = diff;
            closest = slot;
          }
        }
        if (closest) t = closest.main.temp;
      }
      // Otherwise, use current
      if (t === undefined && currentData.main) t = currentData.main.temp;
      if (t !== undefined) {
        botReply('The temperature is ' + Math.round(t) + '°C.');
      } else {
        botReply('Sorry, I could not get the temperature.');
      }
    } else if (intent === 'wind') {
      let w = currentData.wind ? currentData.wind.speed : (forecastData && forecastData.list && forecastData.list[0].wind.speed);
      if (w !== undefined) {
        botReply('Wind speed is ' + w + ' m/s.');
      } else {
        botReply('Sorry, I could not get wind info.');
      }
    } else if (intent === 'humidity') {
      let h = currentData.main ? currentData.main.humidity : (forecastData && forecastData.list && forecastData.list[0].main.humidity);
      if (h !== undefined) {
        botReply('Humidity is ' + h + '%.');
      } else {
        botReply('Sorry, I could not get humidity info.');
      }
    } else if (intent === 'cloud') {
      let c = currentData.clouds ? currentData.clouds.all : (forecastData && forecastData.list && forecastData.list[0].clouds.all);
      if (c !== undefined) {
        botReply('Cloud cover is ' + c + '%.');
      } else {
        botReply('Sorry, I could not get cloud info.');
      }
    } else if (intent === 'weather' || !intent) {
      let desc, t;
      // If user asked about a future time, use forecast
      if (time && forecastData && forecastData.list) {
        let minDiff = Infinity, closest = null;
        for (const slot of forecastData.list) {
          const slotTime = new Date(slot.dt * 1000);
          const diff = Math.abs(slotTime - time);
          if (diff < minDiff) {
            minDiff = diff;
            closest = slot;
          }
        }
        if (closest) {
          desc = closest.weather[0].description;
          t = closest.main.temp;
        }
      }
      // Otherwise, use current
      if (desc === undefined && currentData.weather) desc = currentData.weather[0].description;
      if (t === undefined && currentData.main) t = currentData.main.temp;
      let forecastMsg = '';
      if (!time && forecastData && forecastData.list && forecastData.list.length > 0) {
        // Show next 3 forecast slots (usually 3-hour intervals) only for general queries
        forecastMsg = '\nNext few hours:';
        for (let i = 0; i < Math.min(3, forecastData.list.length); i++) {
          const slot = forecastData.list[i];
          const dt = new Date(slot.dt * 1000);
          forecastMsg += `\n${dt.getHours()}:00 — ${slot.weather[0].description}, ${Math.round(slot.main.temp)}°C`;
        }
      }
      if (desc && t !== undefined) {
        botReply(`It's ${desc} and ${Math.round(t)}°C.${forecastMsg}`);
      } else {
        botReply('Sorry, I could not get the weather.');
      }
    } else {
      // Fallback: show a Google search link for any unhandled question
      const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(q + ' weather');
      botReply("I couldn't find the answer directly. <a href='" + searchUrl + "' target='_blank' rel='noopener'>Click here to search Google for your question.</a>");
    }
  }

  // Form submit
  inputRow.addEventListener('submit', function (e) {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    handleUserQuery(q);
  });

  // On load, try to load last location
  userLocation = loadLocation();

  // Welcome message
  setTimeout(() => {
    botReply('Hi! Ask me about the weather (e.g., "Will it rain at 5 PM?", "What\'s the temperature tomorrow morning?", "Weather in Mumbai?", or click 📍 to set your location)');
  }, 500);

})();
// --- Integration Instructions ---
// 1. Place weather-chatbot.js and weather-chatbot.css in your project root.
// 2. Add <link rel="stylesheet" href="weather-chatbot.css"> in <head> (or let the script auto-inject it).
// 3. Add <script src="weather-chatbot.js"></script> before </body> in your index.html.
// 4. Get a free API key from https://openweathermap.org/api and paste it in the script (OPENWEATHER_API_KEY).
// 5. Done! The chatbot icon will appear in the bottom-right corner. Click to chat.
