import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SensorService } from '../service/sensor.service';
import { loadSensorData, loadSensorsByUserId ,loadSensorDataSuccess, loadSensorDataFailure } from './sensor.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SessionService } from '../service/session.service';

@Injectable()
export class SensorEffects {
  loadSensorData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSensorData),
      mergeMap(() =>
        this.espressifService.getDataByUserId(this.userId.user.id).pipe(
          map(data => loadSensorDataSuccess({ data })),
          catchError(error => of(loadSensorDataFailure({ error })))
        )
      )
    )
  );

  userId: any;

  loadSensorsByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSensorsByUserId),
      mergeMap(() =>
        this.espressifService.getSensorByUserId(this.userId.user.id).pipe(
          map(data => loadSensorDataSuccess({ data })),
          catchError(error => of(loadSensorDataFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private espressifService: SensorService,
    private sessionService: SessionService
  ) {
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }
}
