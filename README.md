# Advance Weather App

A pure frontend, mobile-first weather web app built with HTML, CSS, and vanilla JavaScript. Features a 7-day forecast with hourly breakdowns, confidence/reliability visualization, and modern, accessible UI/UX.

---

## ✨ Key Features (2025 Update)

- **7-Day Forecast**: Swipeable carousel of daily weather cards, each expandable to show hourly details.
- **Forecast Confidence Visualization**:
  - Color-coded confidence bars (green/yellow/red) and icons for forecast reliability
  - Microcopy (e.g., "High confidence", "Unstable prediction")
  - Trust indicator modal explaining why confidence drops after 72 hours
- **Progressive Disclosure**: Hourly details and confidence only shown on tap/expand.
- **Key Data Hierarchy**: Each card shows temperature, precipitation probability, wind speed/direction, UV index, and air quality (if available), prioritized by user importance.
- **Confidence Toggle**: Filter to show only high-confidence days.
- **Mobile-First UX**: Responsive grid/carousel, large touch targets, and glanceable layout.
- **Accessibility**: ARIA labels, color+icon indicators, high contrast, and keyboard navigation.
- **No Backend**: All API calls are made directly from the browser.
- **Voice Assistant**: Listen to weather reports using built-in browser speech synthesis.
- **Dynamic Backgrounds**: Weather-based video backgrounds, with user control to enable/disable.
- **Error Handling**: User-friendly messages for invalid city, network, or geolocation errors.

---

## 🚀 Setup & Usage

1. **Clone or Download** this repo.
2. **Get a free Tomorrow.io API key** [here](https://app.tomorrow.io/). (Fallback to OpenWeatherMap is included, but Tomorrow.io provides better forecast confidence data.)
3. **Set your API key:**
   - Open `script.js`
   - Replace `'YOUR_TOMORROW_IO_API_KEY'` with your key:
     ```js
     const TOMORROW_API_KEY = 'YOUR_TOMORROW_IO_API_KEY';
     ```
4. **Open `index.html`** in your browser. No server required.

---

## 🖥️ UI/UX Patterns
- **Carousel:** Swipe or scroll horizontally to view each day's forecast.
- **Expandable Cards:** Tap/click a day to show hourly breakdown and confidence for each hour.
- **Confidence Bars/Icons:** Instantly see reliability with color and icon.
- **Trust Modal:** Click "Why?" for an explanation of forecast reliability.
- **Toggle:** Show only high-confidence days.
- **Microcopy:** E.g., "Forecasts are most reliable for the next 3 days."

---

## 🛠️ Tech Stack
- HTML5, CSS3 (Flexbox/Grid, mobile-first)
- Vanilla JavaScript (no frameworks)
- Tomorrow.io Weather API (primary)
- OpenWeatherMap API (fallback)

---

## ♿ Accessibility
- All interactive elements are keyboard accessible
- Uses ARIA labels and roles
- Color is always paired with icon/text
- High contrast and large touch targets

---

## 📋 Customization
- You can further style or localize the UI by editing `style.css` and `index.html`.
- To support more metrics (e.g., pollen, sunrise/sunset), extend the forecast card rendering logic in `script.js`.

---

## 📢 Credits
- Weather data: [Tomorrow.io](https://www.tomorrow.io/) and [OpenWeatherMap](https://openweathermap.org/)
- UI/UX & Code: [Your Name Here]

---

## 📝 Changelog
### 2025-05-11
- Added 7-day forecast carousel with hourly breakdowns
- Integrated Tomorrow.io API for confidence metrics
- Confidence bars, icons, microcopy, and trust modal
- Mobile-first responsive grid & accessibility improvements
- Progressive disclosure for hourly and reliability info
- Confidence toggle and micro-interactions

• Error handling for scenarios such as invalid city names, network issues, or unavailable geolocation. Display user-friendly messages to guide users.

# Responsive Design:
• Weather App is responsive and functions well on various devices, including desktops, tablets, and mobile phones.

# API Integration:
• Utilize a weather API (e.g., OpenWeatherMap API) to fetch real-time weather data for the specified location.


# ➤ Technologies Used:

• HTML5 for structuring the content.
• CSS3 for styling and layout.
• JavaScript (ES6+) for dynamic content, user interactions, and API integration.
• Weather API (e.g., OpenWeatherMap API) for fetching weather data.
