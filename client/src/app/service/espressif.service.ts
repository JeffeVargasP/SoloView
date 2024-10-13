import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EspressifService {

  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { 
  }

  getEspressif(): Observable<any> {
    return this.http.get(this.apiURL + 'esp/data');
  }

  getEspressifByUserId(userId: string): Observable<any> {
    return this.http.get(this.apiURL + 'esp/sensor/id/user/' + userId);
  }

}
