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
  model: any = [];
  selectedSensorId: number | undefined;
  private cachedSensorData: SensorData[] = [];
  private subscription: Subscription | undefined;
  private intervalId: any;
  private maxDataPoints = 10;
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

    this.sensorService.getSensorByUserId(this.userId.user.id).subscribe((sensors: any) => {
      if (sensors) {
        this.getSensorModelsWithHumidity(sensors);
      }
    });
  }

  private getSensorModelsWithHumidity(sensors: any): void {
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      const modelsWithHumidity = sensors.filter((sensor: any) =>
        sensorData.some((data: SensorData) => data.sensorId === sensor.id && data.humidity !== null)
      );
  
      this.model = modelsWithHumidity.map((item: any) => ({ id: item.id, model: item.model }));
  
      // Define o valor padrão do selectedSensorId como o id do primeiro sensor, se existir
      if (this.model.length > 0) {
        this.selectedSensorId = this.model[0].id;
        this.updateChartData(sensorData); // Atualiza o gráfico com os dados do primeiro sensor
      }
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

  onModelChange(): void {
    console.log('Selected sensor:', this.selectedSensorId);
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      if (sensorData) {
        this.updateChartData(sensorData);
      }
    });
  }

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
      .filter(item => item.humidity !== null && item.sensorId === this.selectedSensorId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const limitedData = filteredData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
    const humidityValues = limitedData.map(item => item.humidity);

    this.data = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: humidityValues.length }, (_, i) => i + 1),
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
          return `Umidade: ${data}%`;
        }
      },
      series: [{
        data: humidityValues,
        type: 'line',
        areaStyle: {},
        smooth: true,
        color: '#42A5F5'
      }]
    };
  }
}
