import { createAction, props } from '@ngrx/store';
import { SensorData } from '../sensor-data';

export const loadSensorData = createAction('[Sensor] Load Sensor Data');
export const loadSensorDataSuccess = createAction(
  '[Sensor] Load Sensor Data Success',
  props<{ data: SensorData[] }>()
);
export const loadSensorDataFailure = createAction(
  '[Sensor] Load Sensor Data Failure',
  props<{ error: any }>()
);
