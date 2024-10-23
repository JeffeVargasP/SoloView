import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorsByUserId } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit, OnDestroy {

  data: any;
  property: any;
  name: string | undefined;
  model: any;
  userId: any;
  sensorData$: Observable<SensorData[]>;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPosition = 0;
  private cachedSensorData: SensorData[] = []; // Cache para os dados dos sensores

  constructor(private store: Store, private sessionService: SessionService) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }

  ngOnInit(): void {
    this.sessionService.getSession().subscribe((session: any) => {
      this.property = session.user.property;
      this.name = session.user.name;
    });

    this.store.dispatch(loadSensorsByUserId());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorsByUserId());
    }, 5000); // Atualiza a cada 5 segundos

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        this.cachedSensorData = sensorData; // Armazena os dados recebidos
        let sensor = sensorData.map((item: any) => item.model);
        this.model = sensor;
        this.updateChartData(); // Atualiza os dados do gráfico
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

  private updateChartData(): void {
    const sensorData = this.cachedSensorData;

    // Filtra os dados do sensor para obter apenas os que têm temperatura ou umidade
    const temperatureData = sensorData.filter(item => item.temperature !== null);
    const humidityData = sensorData.filter(item => item.humidity !== null);

    // Adiciona dados de temperatura ao gráfico
    if (temperatureData.length > 0) {
      const limitedTemperatureData = temperatureData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
      const labels = limitedTemperatureData.map(item => new Date(item.createdAt).toLocaleTimeString());
      const temperatureValues = limitedTemperatureData.map(item => item.temperature);

      this.data = {
        labels: labels,
        datasets: [{
          label: 'Temperatura',
          data: temperatureValues,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.2)',
          fill: true,
          tension: 0.1
        }]
      };
    }

    // Adiciona dados de umidade ao gráfico, se existirem
    if (humidityData.length > 0) {
      const limitedHumidityData = humidityData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
      const humidityValues = limitedHumidityData.map(item => item.humidity);

      // Aqui você pode criar um segundo gráfico ou adicionar ao mesmo gráfico, dependendo do seu design
      if (this.data.datasets) {
        this.data.datasets.push({
          label: 'Umidade',
          data: humidityValues,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: true,
          tension: 0.1
        });
      }
    }
  }
}
