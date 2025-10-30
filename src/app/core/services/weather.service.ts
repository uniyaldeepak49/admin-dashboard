import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private readonly API_KEY = 'your-api-key-here'; // Replace with actual API key
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  weatherData = signal<WeatherData>({
    temp: 22,
    condition: 'Sunny',
    location: 'New York',
    humidity: 65,
    windSpeed: 12,
  });

  async getCurrentWeather(city: string = 'New York'): Promise<void> {
    try {
      const response = await this.http
        .get<any>(`${this.BASE_URL}?q=${city}&appid=${this.API_KEY}&units=metric`)
        .toPromise();

      this.weatherData.set({
        temp: Math.round(response.main.temp),
        condition: response.weather[0].main,
        location: response.name,
        humidity: response.main.humidity,
        windSpeed: Math.round(response.wind.speed * 3.6), // Convert m/s to km/h
      });
    } catch (error) {
      console.warn('Weather API failed, using mock data');
      // Keep existing mock data on API failure
    }
  }

  getUserLocationWeather(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await this.http
              .get<any>(
                `${this.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`,
              )
              .toPromise();

            this.weatherData.set({
              temp: Math.round(response.main.temp),
              condition: response.weather[0].main,
              location: response.name,
              humidity: response.main.humidity,
              windSpeed: Math.round(response.wind.speed * 3.6),
            });
          } catch (error) {
            console.warn('Location weather API failed');
            this.getCurrentWeather(); // Fallback to default city
          }
        },
        () => {
          this.getCurrentWeather(); // Fallback if geolocation denied
        },
      );
    } else {
      this.getCurrentWeather(); // Fallback if geolocation not supported
    }
  }
}
