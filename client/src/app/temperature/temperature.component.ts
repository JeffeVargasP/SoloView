import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';
import { SensorService } from '../service/sensor.service';

interface SensorModel {
  id: number;
  model: string;
}

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit, OnDestroy {

  data: any;
  userId: any;
  property: any;
  model: SensorModel[] = [];
  sensorData$: Observable<SensorData[]>;
  selectedModel: string | undefined;
  selectedSensorId: number | undefined;
  private subscription: Subscription | undefined;
  private intervalId: any;
  
  // Definindo as propriedades necessárias para a navegação de dados
  private maxDataPoints = 10; // Define quantos pontos de dados devem ser exibidos
  private currentPosition = 0; // Posição atual na série de dados

  constructor(private store: Store, private sessionService: SessionService, private sensorService: SensorService) {
    this.sensorData$ = this.store.select(selectSensorData);
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }

  ngOnInit(): void {
    this.sessionService.getSession().subscribe((session: any) => {
      this.property = session.user.property;
    });

    this.store.dispatch(loadSensorData());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000);

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        this.updateChartData(sensorData); // Atualiza o gráfico com os dados do sensor
      }
    });

    this.sensorService.getSensorByUserId(this.userId.user.id).subscribe((sensors: any) => {
      if (sensors) {
        this.getSensorModelsWithTemperature(sensors);
      }
    });
  }

  private getSensorModelsWithTemperature(sensors: any): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      const modelsWithTemperature = sensors.filter((sensor: any) =>
        sensorData.some((data: SensorData) => data.sensorId === sensor.id && data.temperature !== null)
      );

      this.model = modelsWithTemperature.map((item: any) => ({ id: item.id, model: item.model }));

      // Define o modelo selecionado inicialmente
      if (this.model.length > 0) {
        this.selectedModel = this.model[0].model;
        this.selectedSensorId = this.model[0].id;
        this.updateChartData(sensorData); // Atualiza o gráfico com o modelo inicial
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

  onModelChange(): void {
  
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      if (sensorData) {
        this.updateChartData(sensorData); // Passa os dados do sensor
      }
    });
  }

  private updateChartData(sensorData: SensorData[]): void {
    this.processChartData(sensorData);
  }

  private processChartData(sensorData: SensorData[]): void {
    if (!this.selectedSensorId) return; // Não faz nada se nenhum sensor estiver selecionado

    const filteredData = sensorData
      .filter(item => item.temperature !== null && item.sensorId === this.selectedSensorId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const temperatureValues = filteredData.map(item => item.temperature);

    // Atualiza o gráfico
    this.data = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: temperatureValues.length }, (_, i) => i + 1),
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { data } = params[0];
          return `Temperatura: ${data}%`;
        }
      },
      series: [{
        data: temperatureValues,
        type: 'line',
        areaStyle: {},
        smooth: true,
        color: '#FF5722'
      }]
    };
  }

  previousData(): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      const previousPosition = this.currentPosition - this.maxDataPoints;
      if (previousPosition >= 0) {
        this.currentPosition = previousPosition;
        this.updateChartData(sensorData); // Passa os dados do sensor
      }
    });
  }

  nextData(): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      const totalDataPoints = sensorData.length;
      const nextPosition = this.currentPosition + this.maxDataPoints;
      if (nextPosition < totalDataPoints) {
        this.currentPosition = nextPosition;
        this.updateChartData(sensorData); // Passa os dados do sensor
      }
    });
  }
}
