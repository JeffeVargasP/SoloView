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

  private getLimitedData(data: SensorData[]): SensorData[] {
    return data.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
  }

  private createChartData(labels: string[], values: number[], color: string, label: string, unit: string, max: number) {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { value } = params[0];
          return `${label}: ${value}${unit}`;
        }
      },
      xAxis: {
        type: 'category',
        data: labels, // Usamos os horários aqui em vez de números sequenciais
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: max
      },
      series: [{
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: color
      }]
    };
  }

  private updateChartData(sensorData: SensorData[]): void {
    // ---- Gráfico de Temperatura ----
    const firstTemperatureSensorId = sensorData.find(item => item.temperature !== null)?.sensorId;
    if (firstTemperatureSensorId) {
      const filteredTemperatureData = sensorData
        .filter(item => item.temperature !== null && item.sensorId === firstTemperatureSensorId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const limitedTemperatureData = filteredTemperatureData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
      const temperatureLabels = limitedTemperatureData.map(item =>
        new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const temperatureValues = limitedTemperatureData.map(item => item.temperature);

      // Atualiza o gráfico de temperatura
      this.temperatureData = this.createChartData(temperatureLabels, temperatureValues, '#FF5722', 'Temperatura', '° C', 50);
    }

    // ---- Gráfico de Umidade ----
    const firstHumiditySensorId = sensorData.find(item => item.humidity !== null)?.sensorId;
    if (firstHumiditySensorId) {
      const filteredHumidityData = sensorData
        .filter(item => item.humidity !== null && item.sensorId === firstHumiditySensorId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const limitedHumidityData = filteredHumidityData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
      const humidityLabels = limitedHumidityData.map(item =>
        new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const humidityValues = limitedHumidityData.map(item => item.humidity);

      // Atualiza o gráfico de umidade
      this.humidityData = this.createChartData(humidityLabels, humidityValues, '#42A5F5', 'Umidade', '%', 100);
    }
  }
}  