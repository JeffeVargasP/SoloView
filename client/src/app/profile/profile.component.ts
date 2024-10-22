import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { SessionService } from '../service/session.service';
import { Session } from '../dto/session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  perfilForm: FormGroup | any;
  name: string | any;
  email: string | any;
  city: string | any;
  property: string | any;
  token: string | any;

  constructor(private fb: FormBuilder, private userSerivce: UserService, private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {

    this.sessionService.getSession().subscribe((session: any) => {
      this.token = session.token;
      this.name = session.user.name;
      this.email = session.user.email;
      this.city = session.user.city;
      this.property = session.user.property;
    });

    this.perfilForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, Validators.required],
      city: [this.city, Validators.required],
      property: [this.property, Validators.required],
    });

  }

  submit(): void {
    this.userSerivce.update(
      this.perfilForm.value.name,
      this.perfilForm.value.email,
      this.perfilForm.value.city,
      this.perfilForm.value.property
    ).subscribe((res: any) => {
      const session = {
        token: this.token,
        user: {
          updatedAt: new Date().toISOString(),
          name: this.perfilForm.value.name,
          email: this.perfilForm.value.email,
          city: this.perfilForm.value.city,
          property: this.perfilForm.value.property
        }
      }
      if (res) {
        this.sessionService.setSession(res);
        if (session) {
          this.sessionService.setSession(session);
          this.name = session.user.name;
          this.email = session.user.email;
          this.city = session.user.city;
          this.property = session.user.property;
          this.router.navigate(['/profile']);
        };
      }
    });
  }
}
