import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { loadSensorData } from '../state/sensor.actions';
import { selectSensorData } from '../state/sensor.selectors';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnDestroy {

  data: any;
  userId: any;
  options: any;
  sensorData$: Observable<SensorData[]>;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPosition = 0;

  constructor(private store: Store) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }

  ngOnInit(): void {
    this.store.dispatch(loadSensorData());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000); // Atualiza a cada 5 segundos

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const labels = limitedSensorData.map(item => new Date(item.createdAt).toLocaleTimeString());
        const temperatureData = limitedSensorData.map(item => item.temperature);
        const humidityData = limitedSensorData.map(item => item.humidity);
        const luminosityData = limitedSensorData.map(item => item.luminosity);
        this.data = {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura',
              data: temperatureData,
              fill: false,
              borderColor: '#FF5722',
              backgroundColor: 'rgba(255, 87, 34, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Umidade',
              data: humidityData,
              fill: false,
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              tension: 0.4
            },
            {
              label: 'Luminosidade',
              data: luminosityData,
              fill: false,
              borderColor: '#FFEB3B',
              backgroundColor: 'rgba(255, 235, 59, 0.2)',
              tension: 0.4,
            }
          ]
        };

        this.options = {
          animation: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              }
            },
            y: {
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              }
            }
          }
        };

      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async nextData(): Promise<void> {
    const totalDataPoints = await this.sensorData$.pipe(take(1)).toPromise().then(sensorData => sensorData?.length || 0);
    const nextPosition = await this.currentPosition + this.maxDataPoints;
    if (nextPosition < totalDataPoints) {
      this.currentPosition = nextPosition;
      this.updateChartData();
    }
  }

  previousData(): void {
    const previousPosition = this.currentPosition - this.maxDataPoints;
    if (previousPosition >= 0) {
      this.currentPosition = previousPosition;
      this.updateChartData();
    }
  }

  previousChart(): void {
    const previousPosition = this.currentPosition - this.maxDataPoints;
    if (previousPosition >= 0) {
      this.currentPosition = previousPosition;
      this.updateChartData();
    }
  }

  async nextChart(): Promise<void> {
    const totalDataPoints = await this.sensorData$.pipe(take(1)).toPromise().then(sensorData => sensorData?.length || 0);
    const nextPosition = await this.currentPosition + this.maxDataPoints;
    if (nextPosition < totalDataPoints) {
      this.currentPosition = nextPosition;
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const labels = limitedSensorData.map(item => new Date(item.createdAt).toLocaleTimeString());
        const temperatureData = limitedSensorData.map(item => item.temperature);
        const humidityData = limitedSensorData.map(item => item.humidity);
        const luminosityData = limitedSensorData.map(item => item.luminosity);
        this.data = {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura',
              data: temperatureData,
              fill: false,
              borderColor: '#FF5722',
              backgroundColor: 'rgba(255, 87, 34, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Umidade',
              data: humidityData,
              fill: false,
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              tension: 0.4
            },
            {
              label: 'Luminosidade',
              data: luminosityData,
              fill: false,
              borderColor: '#FFEB3B',
              backgroundColor: 'rgba(255, 235, 59, 0.2)',
              tension: 0.4,
            }
          ]
        };
      }
    });
  }
}
