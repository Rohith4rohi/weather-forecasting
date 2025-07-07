// translate.js
// Translation using Google Translate API with a special template for Kannada

// Special function for Kannada translation using a complete template
function createKannadaWeatherReport(weatherData) {
    // Extract all needed data from the original weather string
    const timeOfDay = getTimeOfDay();
    const cityName = weatherData.cityName || 'ಚನ್ನರಾಯಪಟ್ಟಣ'; // Default if not found
    const name = weatherData.name || 'ಸಂಜಯ್'; // Default if not found
    const temp = weatherData.temp || '25.26';
    const weatherDesc = weatherData.weatherDesc || 'ಮುರಿದ ಮೋಡಗಳಿವೆ';
    const windSpeed = weatherData.windSpeed || '5.54';
    const maxTemp = weatherData.maxTemp || temp;
    const minTemp = weatherData.minTemp || temp;
    const humidity = weatherData.humidity || '68';
    const cloudiness = weatherData.cloudiness || '61';
    const sunriseHours = weatherData.sunriseHours || '6';
    const sunriseMinutes = weatherData.sunriseMinutes || '0';
    const sunriseSeconds = weatherData.sunriseSeconds || '20';
    const sunsetHours = weatherData.sunsetHours || '18';
    const sunsetMinutes = weatherData.sunsetMinutes || '41';
    const sunsetSeconds = weatherData.sunsetSeconds || '25';
    
    // Get the appropriate Kannada greeting based on time of day
    let greeting = 'ಶುಭ ಸಂಜೆ';
    if (timeOfDay === 'morning') greeting = 'ಶುಭೋದಯ';
    else if (timeOfDay === 'afternoon') greeting = 'ಶುಭ ಮಧ್ಯಾಹ್ನ';
    
    // Create the full Kannada weather report using the template
    return `${greeting}, ${cityName}! ನಾನು ${name}, ಮತ್ತು ನಿಮ್ಮ ದೈನಂದಿನ ಹವಾಮಾನ ಮಾಹಿತಿಗಾಗಿ ಇದು ಸಮಯ.

ಈಗ, ನಮ್ಮಲ್ಲಿ ${temp} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್ ತಾಪಮಾನದೊಂದಿಗೆ ${weatherDesc}. ಗಾಳಿ ಗಂಟೆಗೆ ${windSpeed} ಕಿಲೋಮೀಟರ್ ವೇಗದಲ್ಲಿ ಬೀಸುತ್ತಿದೆ.

ನಾವು ದಿನವಿಡೀ ಚಲಿಸುವಾಗ, ತಾಪಮಾನವು ಗರಿಷ್ಠ ${maxTemp} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್ ಮತ್ತು ಕನಿಷ್ಠ ${minTemp} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್ ತಲುಪುತ್ತದೆ.

ನಿಮ್ಮ ದಿನದ ಕೆಲವು ಹೆಚ್ಚುವರಿ ವಿವರಗಳು ಇಲ್ಲಿವೆ:

ಆರ್ದ್ರತೆ ${humidity} ಆಗಿದೆ.

ಮೋಡಗಳು ${cloudiness} ಆಗಿದೆ.

ಸೂರ್ಯೋದಯ ${sunriseHours}ಗಂಟೆ ${sunriseMinutes}ನಿಮಿಷ ${sunriseSeconds}ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ ${sunsetHours}ಗಂಟೆ ${sunsetMinutes}ನಿಮಿಷ ${sunsetSeconds}ಸೆಕೆಂಡುಗಳಲ್ಲಿ.

ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ನೋಡುತ್ತಿರಿ ಮತ್ತು ಅದ್ಭುತ ದಿನವನ್ನು ಆನಂದಿಸಿ.`;
}

// Helper function to determine time of day
function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours < 12) return 'morning';
    if (hours < 17) return 'afternoon';
    return 'evening';
}

// Helper function to extract weather data from the original text
function extractWeatherData(text) {
    const data = {};
    
    // Try to extract city name
    const cityMatch = text.match(/You are in ([^,]+),/);
    if (cityMatch && cityMatch[1]) data.cityName = cityMatch[1];
    
    // Try to extract name
    const nameMatch = text.match(/,\s*([^!.]+)!/);
    if (nameMatch && nameMatch[1]) data.name = nameMatch[1];
    
    // Try to extract temperature
    const tempMatch = text.match(/temperature of (\d+\.?\d*)/);
    if (tempMatch && tempMatch[1]) data.temp = tempMatch[1];
    
    // Try to extract weather description
    const descMatch = text.match(/we have a ([^\n.]+)/);
    if (descMatch && descMatch[1]) data.weatherDesc = descMatch[1];
    
    // Try to extract wind speed
    const windMatch = text.match(/coming in at (\d+\.?\d*)/);
    if (windMatch && windMatch[1]) data.windSpeed = windMatch[1];
    
    // Try to extract max temperature
    const maxTempMatch = text.match(/high of (\d+\.?\d*)/);
    if (maxTempMatch && maxTempMatch[1]) data.maxTemp = maxTempMatch[1];
    
    // Try to extract min temperature
    const minTempMatch = text.match(/low of (\d+\.?\d*)/);
    if (minTempMatch && minTempMatch[1]) data.minTemp = minTempMatch[1];
    
    // Try to extract humidity
    const humidityMatch = text.match(/Humidity stands at (\d+)/);
    if (humidityMatch && humidityMatch[1]) data.humidity = humidityMatch[1];
    
    // Try to extract cloudiness
    const cloudMatch = text.match(/clouds? is (\d+)/);
    if (cloudMatch && cloudMatch[1]) data.cloudiness = cloudMatch[1];
    
    // Try to extract sunrise time
    const sunriseMatch = text.match(/Sunrise is at (\d+)hours (\d+)minutes (\d+)seconds/);
    if (sunriseMatch) {
        data.sunriseHours = sunriseMatch[1];
        data.sunriseMinutes = sunriseMatch[2];
        data.sunriseSeconds = sunriseMatch[3];
    }
    
    // Try to extract sunset time
    const sunsetMatch = text.match(/sunset at (\d+)hours (\d+)minutes (\d+)seconds/);
    if (sunsetMatch) {
        data.sunsetHours = sunsetMatch[1];
        data.sunsetMinutes = sunsetMatch[2];
        data.sunsetSeconds = sunsetMatch[3];
    }
    
    return data;
}

// Main translation function
async function translateText(text, targetLang) {
    if (targetLang === 'en-US' || targetLang === 'en') return text; // No translation needed
    
    // For Kannada, use the template translation
    if (targetLang === 'kn-IN' || targetLang === 'kn') {
        const weatherData = extractWeatherData(text);
        console.log("Extracted weather data:", weatherData);
        return createKannadaWeatherReport(weatherData);
    }
    
    // For all other languages, use Google Translate
    // For region-specific codes, use base language (e.g., 'fr-FR' -> 'fr')
    let tl = targetLang;
    if (targetLang.includes('-')) tl = targetLang.split('-')[0];
    
    // Google Translate unofficial endpoint
    console.log(`Using Google Translate for ${tl}`);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        // Join all translated segments and sentences
        let translated = '';
        if (Array.isArray(data[0])) {
            for (const seg of data[0]) {
                if (Array.isArray(seg) && seg[0]) translated += seg[0];
            }
        }
        if (translated.length > 0) return translated;
        
        // fallback to original
        return text + ' (translation unavailable)';
    } catch (e) {
        console.error('Translation failed:', e);
        return text + ' (translation unavailable)';
    }
}

// Export for use in script.js
window.translateText = translateText;
