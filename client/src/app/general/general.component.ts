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
    this.subscription = this.sensorData$.subscribe((sensorData: SensorData[]) => {
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
    const totalDataPoints = await this.sensorData$.pipe(take(1)).toPromise().then((sensorData: any) => sensorData?.length || 0);
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
      this.sensorData$.pipe(take(1)).toPromise().then((sensorData: any) => {
        if (sensorData) {
          this.updateChartData(sensorData);
        }
      });
    }
  }

  private updateChartData(sensorData: SensorData[]): void {
    // Identifica o primeiro sensorId com dados de temperatura
    const firstTemperatureSensorId = sensorData.find(item => item.temperature !== null)?.sensorId;
    const temperatureDataPoints = sensorData.filter(
      item => item.sensorId === firstTemperatureSensorId && item.temperature !== null
    );

    // Identifica o primeiro sensorId com dados de umidade
    const firstHumiditySensorId = sensorData.find(item => item.humidity !== null)?.sensorId;
    const humidityDataPoints = sensorData.filter(
      item => item.sensorId === firstHumiditySensorId && item.humidity !== null
    );

    // Limita os dados para os gráficos
    const limitedTemperatureData = temperatureDataPoints.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
    const limitedHumidityData = humidityDataPoints.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);

    const temperatureLabels = limitedTemperatureData.map(item => new Date(item.createdAt).toLocaleTimeString());
    const temperatureValues = limitedTemperatureData.map(item => item.temperature);
    this.weather = temperatureValues[temperatureValues.length - 1];

    const humidityLabels = limitedHumidityData.map(item => new Date(item.createdAt).toLocaleTimeString());
    const humidityValues = limitedHumidityData.map(item => item.humidity);

    // Atualiza o gráfico de temperatura usando ECharts
    this.temperatureData = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { value } = params[0];
          return `Temperatura: ${value}°C`;
        }
      },
      xAxis: {
        type: 'category',
        data: temperatureLabels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 50
      },
      series: [{
        data: temperatureValues,
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#FF5722'
      }]
    };
  
    // Atualiza o gráfico de umidade usando ECharts
    this.humidityData = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { value } = params[0];
          return `Umidade: ${value}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: humidityLabels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100
      },
      series: [{
        data: humidityValues,
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#42A5F5'
      }]
    };
  }
}
