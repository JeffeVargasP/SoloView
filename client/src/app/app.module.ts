import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HumidityComponent } from './humidity/humidity.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { ProfileComponent } from './profile/profile.component';
import { SensorComponent } from './sensor/sensor.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralComponent } from './general/general.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { sensorReducer } from './state/sensor.reducer';
import { SensorEffects } from './state/sensor.effects';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HumidityComponent,
    TemperatureComponent,
    ProfileComponent,
    SensorComponent,
    LoginComponent,
    RegisterComponent,
    GeneralComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterOutlet,
    HttpClientModule,
    ChartModule,
    ToastModule,
    NgxEchartsDirective,
    StoreModule.forRoot({ sensor: sensorReducer }),
    EffectsModule.forRoot([SensorEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  providers: [provideEcharts()],
  bootstrap: [AppComponent]
})
export class AppModule { }
