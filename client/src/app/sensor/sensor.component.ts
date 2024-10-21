import { Component, OnInit } from '@angular/core';
import { SensorService } from '../service/sensor.service';
import { Observable, Subscription, take } from 'rxjs';
import { SensorData } from '../sensor-data';
import { Store } from '@ngrx/store';
import { selectSensorData } from '../state/sensor.selectors';
import { loadSensorData } from '../state/sensor.actions';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit {

  data: any;
  farm: any;
  name: any;
  userId: any;
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
      this.name = session.user.name;
    });

    this.store.dispatch(loadSensorData());
    this.intervalId = setInterval(() => {
      this.store.dispatch(loadSensorData());
    }, 5000); // Atualiza a cada 5 segundos

    this.subscription = this.sensorData$.subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
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
    this.sensorData$.pipe(take(1)).subscribe((sensorData) => {
      if (sensorData) {
        const limitedSensorData = sensorData.slice(this.currentPosition, this.currentPosition + this.maxDataPoints);
        const labels = limitedSensorData.map(item => new Date(item.createdAt).toLocaleTimeString());
        this.data = {
          labels: labels,
          datasets: [

          ],
        };
      }
    });
  }



}