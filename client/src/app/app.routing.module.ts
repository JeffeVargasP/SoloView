import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HumidityComponent } from './humidity/humidity.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { ProfileComponent } from './profile/profile.component';
import { SensorComponent } from './sensor/sensor.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
    {
        path: 'geral',
        component: GeneralComponent,
        canActivate: [authGuard]
    },
    {
        path: 'umidade',
        component: HumidityComponent,
        canActivate: [authGuard]
    },
    {
        path: 'temperatura',
        component: TemperatureComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'sensor',
        component: SensorComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'cadastrar',
        component: RegisterComponent
    },
    {
        pathMatch: "full",
        redirectTo: "login",
        path: ""
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }