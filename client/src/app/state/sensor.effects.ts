import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EspressifService } from '../service/espressif.service';
import { loadSensorData, loadSensorDataSuccess, loadSensorDataFailure } from './sensor.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SessionService } from '../service/session.service';

@Injectable()
export class SensorEffects {
  loadSensorData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSensorData),
      mergeMap(() =>
        this.espressifService.getEspressifByUserId(this.userId.user.id).pipe(
          map(data => loadSensorDataSuccess({ data })),
          catchError(error => of(loadSensorDataFailure({ error })))
        )
      )
    )
  );

  userId: any;

  constructor(
    private actions$: Actions,
    private espressifService: EspressifService,
    private sessionService: SessionService
  ) {
    this.userId = JSON.parse(sessionStorage.getItem('session') || '{}');
  }
}
