import { createReducer, on } from '@ngrx/store';
import { loadSensorDataSuccess } from './sensor.actions';
import { SensorData } from '../sensor-data';

export interface SensorState {
  data: SensorData[];
}

export const initialState: SensorState = {
  data: []
};

export const sensorReducer = createReducer(
  initialState,
  on(loadSensorDataSuccess, (state, { data }) => ({ ...state, data }))
);
