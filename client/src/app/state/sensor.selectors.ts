import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SensorState } from './sensor.reducer';

export const selectSensorState = createFeatureSelector<SensorState>('sensor');

export const selectSensorData = createSelector(
  selectSensorState,
  (state: SensorState) => state.data
);
