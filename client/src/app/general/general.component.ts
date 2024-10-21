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
  temperatureOptions: any;
  humidityData: any;
  humidityOptions: any;
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
    const humidityData = limitedSensorData.map(item => item.humidity);

    // Atualiza o gráfico de temperatura
    this.temperatureData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperatura',
          data: temperatureData,
          fill: false,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.2)',
          tension: 0.4,
        }
      ]
    };

    // Atualiza o gráfico de umidade
    this.humidityData = {
      labels: labels,
      datasets: [
        {
          label: 'Umidade',
          data: humidityData,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Aplica as opções padrão para ambos os gráficos
    this.temperatureOptions = this.getChartOptions(true);
    this.humidityOptions = this.getChartOptions(false);
  }

  private getChartOptions(isTemperature: boolean): any {
    return {
      animation: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false, // Desativa a legenda
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
          max: isTemperature ? 50 : 100, // Define o intervalo do eixo y: 0-50 para temperatura e 0-100 para umidade
          ticks: {
            stepSize: isTemperature ? 10 : 25, // Define o espaçamento dos ticks para formar quadrados
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

}
