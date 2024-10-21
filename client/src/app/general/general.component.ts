import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { loadSensorData } from '../state/sensor.actions';
import { selectSensorData } from '../state/sensor.selectors';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnDestroy {

  temperatureData: any;
  weather: any;
  humidityData: any;
  userId: any;
  city: any;
  sensorData$: Observable<SensorData[]>;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPosition = 0;

  constructor(private store: Store, private sessionService: SessionService, private router: Router) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }

  ngOnInit(): void {

    this.sessionService.getSession().subscribe((session: any) => {
      this.city = session.user.city;
    });

    // Carrega os dados do sensor
    this.store.dispatch(loadSensorData());

    // Atualiza os dados a cada 5 segundos
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000);

    // Inscreve-se para atualizar os gráficos quando os dados mudarem
    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        this.updateChartData(sensorData);
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

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async nextData(): Promise<void> {
    const totalDataPoints = await this.sensorData$.pipe(take(1)).toPromise().then(sensorData => sensorData?.length || 0);
    const nextPosition = this.currentPosition + this.maxDataPoints;
    if (nextPosition < totalDataPoints) {
      this.currentPosition = nextPosition;
      const sensorData = await this.sensorData$.pipe(take(1)).toPromise();
      if (sensorData) {
        this.updateChartData(sensorData);
      }
    }
  }

  previousData(): void {
    const previousPosition = this.currentPosition - this.maxDataPoints;
    if (previousPosition >= 0) {
      this.currentPosition = previousPosition;
      this.sensorData$.pipe(take(1)).toPromise().then(sensorData => {
        if (sensorData) {
          this.updateChartData(sensorData);
        }
      });
    }
  }

  private updateChartData(sensorData: SensorData[]): void {
    // Limita os dados para os gráficos
    const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
    const labels = limitedSensorData.map(item => new Date(item.createdAt).toLocaleTimeString());
    const temperatureData = limitedSensorData.map(item => item.temperature);
    this.weather = temperatureData[temperatureData.length - 1];
    const humidityData = limitedSensorData.map(item => item.humidity);

    // Atualiza o gráfico de temperatura usando ECharts
    this.temperatureData = {
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 50
      },
      series: [{
        data: temperatureData,
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#FF5722'
      }]
    };

    // Atualiza o gráfico de umidade usando ECharts
    this.humidityData = {
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100
      },
      series: [{
        data: humidityData,
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#42A5F5'
      }]
    };
  }

}
