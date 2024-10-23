import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';
import { SensorService } from '../service/sensor.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit, OnDestroy {

  data: any;
  temperatureData: any; // Variável para os dados de temperatura
  userId: any;
  property: any;
  model: any = [];
  sensorData$: Observable<SensorData[]>;
  selectedSensorId: number | undefined;
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
  private currentPositionTemperature = 0; // Posição atual para temperatura
  private cachedSensorData: SensorData[] = []; // Cache de dados
  private currentPosition = 0;

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
    }, 5000); // Atualiza a cada 5 segundos
  
    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        this.updateChartData(sensorData);
      }
    });
  
    // Verifica quais sensores têm valor de temperatura antes de exibir no select
    this.sensorService.getSensorByUserId(this.userId.user.id).subscribe((sensors: any) => {
      if (sensors) {
        this.getSensorModelsWithTemperature(sensors);
      }
    });
  }
  
  private getSensorModelsWithTemperature(sensors: any): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      // Filtra os sensores que possuem valores de temperatura registrados
      const modelsWithTemperature = sensors.filter((sensor: any) =>
        sensorData.some((data: SensorData) => data.sensorId === sensor.id && data.temperature !== null)
      );
  
      // Popula o modelo apenas com os sensores que têm dados de temperatura
      this.model = modelsWithTemperature.map((item: any) => ({ id: item.id, model: item.model }));
      console.log(this.model);
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
  
    ngAfterViewInit(): void { }
  
    async nextData(): Promise<void> {
      const totalDataPoints = await this.sensorData$.pipe(take(1)).toPromise().then(sensorData => sensorData?.length || 0);
      const nextPosition = this.currentPosition + this.maxDataPoints;
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
  
    private updateChartData(sensorData?: SensorData[]): void {
      if (!sensorData) {
        this.sensorData$.pipe(take(1)).subscribe((data) => this.processChartData(data));
      } else {
        this.processChartData(sensorData);
      }
    }
  
    private processChartData(sensorData: SensorData[]): void {
      const filteredData = sensorData
        .filter(item => item.temperature !== null && item.sensorId === this.selectedSensorId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
      const limitedData = filteredData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
      const temperatureValues = limitedData.map(item => item.temperature);
  
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
  }
  