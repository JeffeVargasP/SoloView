import { Component, OnInit } from '@angular/core';
import { SensorService } from '../service/sensor.service';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  data: any;
  userId: any;
  farm: any;
  options: any;
  sensorData$: Observable<SensorData[]>;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPosition = 0;

  constructor(private store: Store, private sessionService: SessionService) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }

  ngOnInit(): void {

    this.sessionService.getSession().subscribe((session: any) => {
      this.farm = session.user.farm;
    });

    this.store.dispatch(loadSensorData());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000); // Atualiza a cada 5 segundos

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const labels = limitedSensorData.map(item => new Date(item.createdAt).toLocaleTimeString());
        const temperatureData = limitedSensorData.map(item => item.temperature);
        this.data = {
          labels: labels,
          datasets: [
            {
              data: temperatureData,
              fill: true,
              borderColor: '#FF5722',
              backgroundColor: 'rgba(255, 87, 34, 0.2)',
              tension: 0.4,
            },
          ]
        };

        this.options = {
          animation: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#ffffff'
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              min: 0,
              max: 5, // Define o intervalo do eixo x de 0 a 5
              ticks: {
                stepSize: 1, // Define o espaçamento dos ticks em 1 unidade para formar os quadrados
                color: '#ffffff',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Cor da grade
                drawBorder: false
              }
            },
            y: {
              min: 0,
              max: 50, // Define o intervalo do eixo y: 0-50 para temperatura e 0-100 para umidade
              ticks: {
                stepSize: 10, // Define o espaçamento dos ticks para formar quadrados
                color: '#ffffff',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Cor da grade
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
        this.data = {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura',
              data: temperatureData,
              fill: true,
              borderColor: '#FF5722',
              backgroundColor: 'rgba(255, 87, 34, 0.2)',
              tension: 0.4,
            },
          ],
        };
      }
    });
  }



}