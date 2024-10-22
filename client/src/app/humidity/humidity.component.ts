import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SensorService } from '../service/sensor.service';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.scss']
})
export class HumidityComponent implements OnInit, OnDestroy, AfterViewInit {

  data: any;
  userId: any;
  property: any;
  sensorData$: Observable<SensorData[]>;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPosition = 0;

  constructor(private store: Store, private sessionService: SessionService) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
    console.log(this.userId.user.id);
  }

  ngOnInit(): void {
    this.sessionService.getSession().subscribe((session: any) => {
      this.property = session.user.property;
    });

    this.store.dispatch(loadSensorData());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000); // Atualiza a cada 5 segundos

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const humidityData = limitedSensorData.map(item => item.humidity);
        this.data = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: humidityData.length }, (_, i) => i + 1), // Gera um array com os índices
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100
          },
          series: [{
            data: humidityData,
            type: 'line',
            areaStyle: {},
            smooth: true,
            color: '#42A5F5'
          }]
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

  ngAfterViewInit(): void {
    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const humidityData = limitedSensorData.map(item => item.humidity);
        this.data = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: humidityData.length }, (_, i) => i + 1),
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100
          },
          series: [{
            data: humidityData,
            type: 'line',
            areaStyle: {},
            smooth: true,
            color: '#42A5F5'
          }]
        };
      }
    });
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
        const humidityData = limitedSensorData.map(item => item.humidity);
        this.data = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: humidityData.length }, (_, i) => i + 1),
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100
          },
          series: [{
            data: humidityData,
            type: 'line',
            areaStyle: {},
            smooth: true,
            color: '#42A5F5'
          }]
        };
      }
    });
  }

}
