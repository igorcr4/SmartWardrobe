import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudSnow,
  Bell,
} from "lucide-react";

const API_KEY = "cfac131e22de6417e61600236238f7d8";

interface WeatherResponse {
  main: { temp: number };
  weather: { main: string; description: string }[];
}

export const Header: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => console.error(err)
    );
  }, []);

  const { data, isLoading, isError } = useQuery<WeatherResponse>({
    queryKey: ["weather", coords],
    queryFn: async () => {
      if (!coords) throw new Error("Location coordinates not available");
      const url = `https://api.openweathermap.org/data/2.5/weather`
        + `?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
      return (await axios.get<WeatherResponse>(url)).data;
    },
    enabled: !!coords,
    staleTime: 1000 * 60 * 5,
  });

  let tempDisplay = isLoading
    ? "…°C"
    : isError || !data
    ? "N/A"
    : `${Math.round(data.main.temp)}°C`;

  // Alege iconița după condiție
  const condition = data?.weather[0]?.main;
  let WeatherIcon = Sun;
  switch (condition) {
    case "Rain":
      WeatherIcon = CloudRain;
      break;
    case "Drizzle":
      WeatherIcon = CloudDrizzle;
      break;
    case "Thunderstorm":
      WeatherIcon = CloudLightning;
      break;
    case "Snow":
      WeatherIcon = CloudSnow;
      break;
    case "Clouds":
      WeatherIcon = Cloud;
      break;
    default:
      WeatherIcon = Sun;
  }

  return (
    <header className="p-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <img
          src="/uploads/logo.svg"
          alt="Smart Wardrobe"
          className="h-8 w-8"
        />
        <span className="text-2xl font-semibold text-primary">Smart Wardrobe</span>
      </div>
      <div className="flex items-center gap-4">
        <WeatherIcon size={24} className="text-gray-500" />
        <span className="text-gray-500">{tempDisplay}</span>
        <Bell size={20} />
      </div>
    </header>
  );
};

export default Header;