import { Component, OnInit } from '@angular/core';
import { EspressifService } from '../service/espressif.service';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';

@Component({
  selector: 'app-luminosity',
  templateUrl: './luminosity.component.html',
  styleUrls: ['./luminosity.component.scss']
})
export class LuminosityComponent implements OnInit {

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
        this.data = {
          labels: labels,
          datasets:
          [
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
                maxTicksLimit: 10
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              }
            },
            y: {
              min: 0,
              max: 100,
              ticks: {
                color: '#ffffff',
                maxTicksLimit: 10
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
        this.data = {
          labels: labels,
          datasets: [

          ],
        };
      }
    });
  }



}