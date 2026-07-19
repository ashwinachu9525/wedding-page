import { NextRequest, NextResponse } from "next/server";

// WMO Weather code to readable description & icon
const WMO_WEATHER_CODES: Record<number, { label: string; icon: string; advice: string }> = {
  0: { label: "Sunny & Clear Skies", icon: "☀️", advice: "Ideal outdoor weather. Breathable silk or cotton attire recommended. Carry sunglasses for daytime ceremonies." },
  1: { label: "Mainly Clear & Sunny", icon: "🌤️", advice: "Perfect wedding weather. Light traditional fabrics and pleasant outdoor breezes expected." },
  2: { label: "Partly Cloudy & Pleasant", icon: "⛅", advice: "Comfortable and scenic weather for photography. Both indoor and outdoor lawns will be delightful." },
  3: { label: "Overcast Skies", icon: "☁️", advice: "Pleasant temperatures with diffused lighting for photos. A light layering shawl is good for the evening." },
  45: { label: "Misty & Foggy Morning", icon: "🌫️", advice: "Romantic mist during morning Muhurtham. Ensure safe driving visibility and warm wraps early morning." },
  48: { label: "Depositing Rime Fog", icon: "🌫️", advice: "Cool, misty weather. Rich velvet or heavy brocade silk attire will feel cozy and luxurious." },
  51: { label: "Light Drizzle", icon: "🌦️", advice: "Occasional light drizzle. Covered mandap seating and light footwear recommended." },
  53: { label: "Moderate Drizzle", icon: "🌦️", advice: "Intermittent rain showers. Umbrellas will be available at valet parking; covered venue sections open." },
  55: { label: "Dense Drizzle", icon: "🌧️", advice: "Steady drizzle expected. Indoor ballroom and banquet hall setups recommended for guest comfort." },
  61: { label: "Slight Rain Showers", icon: "🌧️", advice: "Light rain expected. Guests are encouraged to carry compact umbrellas and wear elevated footwear." },
  63: { label: "Moderate Rain Showers", icon: "🌧️", advice: "Rainy conditions. All main ceremonies will be comfortably hosted inside our indoor grand halls." },
  65: { label: "Heavy Rain Showers", icon: "⛈️", advice: "Heavy rain forecast. Valet drop-off directly at the portico. Please allow extra travel time." },
  71: { label: "Slight Snowfall", icon: "❄️", advice: "Crisp winter snow. Heavy pashminas, velvet sherwanis, and warm indoor heating provided." },
  80: { label: "Light Rain Showers", icon: "🌦️", advice: "Passing rain showers. Our event team has covered canopy arrangements prepared across all lawns." },
  81: { label: "Moderate Rain Showers", icon: "🌧️", advice: "Showers expected. Please allow an extra 20 minutes for traffic when travelling to the venue." },
  82: { label: "Violent Rain Showers", icon: "⛈️", advice: "Heavy rain showers. Indoor venues are fully prepared with warm refreshments upon arrival." },
  95: { label: "Thunderstorm Expected", icon: "🌩️", advice: "Thunderstorm forecast. All activities moved indoors with full power backup and luxury indoor dining." },
};

// Common city name aliases (especially renamed Indian cities)
const CITY_ALIASES: Record<string, string> = {
  "bangalore": "Bengaluru",
  "bombay": "Mumbai",
  "madras": "Chennai",
  "calcutta": "Kolkata",
  "gurgaon": "Gurugram",
  "poona": "Pune",
  "banares": "Varanasi",
  "banaras": "Varanasi",
  "kashi": "Varanasi",
  "baroda": "Vadodara",
  "cochin": "Kochi",
  "trivandrum": "Thiruvananthapuram",
  "pondicherry": "Puducherry",
  "gauhati": "Guwahati",
  "simla": "Shimla",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueInput = searchParams.get("venue") || "Bengaluru, India";
    const dateInput = searchParams.get("date") || new Date().toISOString();

    // Clean up city/venue string for geocoding by replacing delimiters
    const cleanStr = venueInput.replace(/[•|/&-]/g, ",").replace(/\s+/g, " ");
    const parts = cleanStr.split(",").map(p => p.trim()).filter(p => 
      p.length > 2 && 
      !p.toLowerCase().includes("hotel") && 
      !p.toLowerCase().includes("palace") && 
      !p.toLowerCase().includes("resort") && 
      !p.toLowerCase().includes("garden") && 
      !p.toLowerCase().includes("hall") && 
      !p.toLowerCase().includes("banquet") && 
      !p.toLowerCase().includes("partner") &&
      !p.toLowerCase().includes("heritage")
    );

    // List of candidate query strings to try in order of likelihood
    const candidates: string[] = [];
    if (parts.length > 0) {
      candidates.push(parts[0]);
      if (parts.length > 1) candidates.push(parts[1]);
      if (parts.length > 2) candidates.push(parts[parts.length - 2]);
    }
    const rawFirst = venueInput.split(",")[0].trim();
    if (rawFirst && !candidates.includes(rawFirst)) candidates.push(rawFirst);

    // List of popular destination cities to scan for immediately if embedded inside complex palace/resort names
    const POPULAR_DESTINATIONS = [
      "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Goa", "Mumbai", "New Delhi", "Delhi",
      "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Shimla", "Mussoorie",
      "Rishikesh", "Varanasi", "Agra", "Kochi", "Cochin", "Mysuru", "Mysore", "Mahabaleshwar",
      "Lonavala", "Ooty", "Munnar", "Alibaug", "Jim Corbett", "Amritsar", "Chandigarh", "Lucknow", "Pune"
    ];

    const foundDest = POPULAR_DESTINATIONS.find(d => venueInput.toLowerCase().includes(d.toLowerCase()));
    if (foundDest && !candidates.includes(foundDest)) {
      candidates.unshift(foundDest); // Put the known city at the very top
    }

    if (candidates.length === 0) candidates.push("Bengaluru");

    let lat = 12.9716; // Default Bengaluru
    let lon = 77.5946;
    let locationName = "Bengaluru, Karnataka, India";
    let geoFound = false;

    // Try geocoding candidates until we get a valid city match from Open-Meteo
    for (const cand of candidates) {
      if (geoFound) break;
      const lowerCity = cand.toLowerCase().trim();
      const searchCity = CITY_ALIASES[lowerCity] || cand;

      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=15&language=en`, {
          next: { revalidate: 3600 },
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            const sortedResults = [...geoData.results].sort((a, b) => (b.population || 0) - (a.population || 0));
            const lowerVenue = venueInput.toLowerCase();
            let bestMatch = sortedResults.find(r => r.country && lowerVenue.includes(r.country.toLowerCase()));
            if (!bestMatch) {
              bestMatch = sortedResults.find(r => r.country === "India") || sortedResults[0];
            }
            lat = bestMatch.latitude;
            lon = bestMatch.longitude;
            locationName = `${bestMatch.name}${bestMatch.admin1 ? `, ${bestMatch.admin1}` : ""}${bestMatch.country ? `, ${bestMatch.country}` : ""}`;
            geoFound = true;
          }
        }
      } catch (err) {
        console.warn("[weather geocoding] candidate fetch error:", cand, err);
      }
    }

    const targetDateStr = dateInput.substring(0, 10);
    const targetDateObj = new Date(targetDateStr);
    const today = new Date();
    const diffDays = Math.ceil((targetDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));

    // 2. Fetch Live 16-Day Forecast from Open-Meteo if within range (-5 to +16 days)
    if (diffDays >= -5 && diffDays <= 16) {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`,
        { next: { revalidate: 1800 } }
      );
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        if (weatherData.daily && weatherData.daily.time) {
          const idx = weatherData.daily.time.indexOf(targetDateStr);
          if (idx !== -1) {
            const code = weatherData.daily.weathercode[idx] || 0;
            const wmo = WMO_WEATHER_CODES[code] || WMO_WEATHER_CODES[1];
            return NextResponse.json({
              success: true,
              isLiveForecast: true,
              location: locationName,
              date: targetDateStr,
              maxTemp: Math.round(weatherData.daily.temperature_2m_max[idx]),
              minTemp: Math.round(weatherData.daily.temperature_2m_min[idx]),
              rainChance: weatherData.daily.precipitation_probability_max[idx] || 0,
              weatherCode: code,
              label: wmo.label,
              icon: wmo.icon,
              advice: wmo.advice,
            });
          }
        }
      }
    }

    // 3. For future dates outside 16 days, query Open-Meteo Historical Climate Archive for the same calendar day exactly 1 year prior
    const prevYear = (targetDateObj.getFullYear() - 1).toString();
    const histDateStr = `${prevYear}-${targetDateStr.substring(5)}`;
    try {
      const histRes = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${histDateStr}&end_date=${histDateStr}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`,
        { next: { revalidate: 86400 } }
      );
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData.daily && histData.daily.temperature_2m_max?.[0] !== undefined) {
          const code = histData.daily.weathercode?.[0] || 1;
          const wmo = WMO_WEATHER_CODES[code] || WMO_WEATHER_CODES[1];
          const rainMm = histData.daily.precipitation_sum?.[0] || 0;
          const rainChance = rainMm > 5 ? 65 : rainMm > 1 ? 30 : 10;
          return NextResponse.json({
            success: true,
            isLiveForecast: false,
            isClimateExpectation: true,
            location: locationName,
            date: targetDateStr,
            maxTemp: Math.round(histData.daily.temperature_2m_max[0]),
            minTemp: Math.round(histData.daily.temperature_2m_min[0]),
            rainChance,
            weatherCode: code,
            label: `${wmo.label} (Seasonal Expectation)`,
            icon: wmo.icon,
            advice: wmo.advice,
          });
        }
      }
    } catch (e) {
      console.warn("[weather archive fetch error]", e);
    }

    // 4. Default fallbacks based on month/season for India
    const month = targetDateObj.getMonth(); // 0=Jan, 10=Nov
    const isWinter = month === 10 || month === 11 || month === 0 || month === 1;
    const isMonsoon = month >= 5 && month <= 8;
    
    const maxTemp = isWinter ? 27 : isMonsoon ? 28 : 33;
    const minTemp = isWinter ? 16 : isMonsoon ? 21 : 23;
    const rainChance = isMonsoon ? 60 : isWinter ? 12 : 20;
    const code = isMonsoon ? 61 : isWinter ? 1 : 2;
    const wmo = WMO_WEATHER_CODES[code];

    return NextResponse.json({
      success: true,
      isLiveForecast: false,
      isClimateExpectation: true,
      location: locationName,
      date: targetDateStr,
      maxTemp,
      minTemp,
      rainChance,
      weatherCode: code,
      label: `${wmo.label} (Seasonal Climate Outlook)`,
      icon: wmo.icon,
      advice: wmo.advice,
    });
  } catch (err: any) {
    console.error("[GET /api/weather/forecast]", err);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
