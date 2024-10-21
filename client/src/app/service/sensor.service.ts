import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { 
  }

  getEspressif(): Observable<any> {
    return this.http.get(this.apiURL + 'sensor');
  }

  getEspressifByUserId(sensorId: string): Observable<any> {
    return this.http.get(this.apiURL + 'data/id/sensor/' + sensorId);
  }

}
