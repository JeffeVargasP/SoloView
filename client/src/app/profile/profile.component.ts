import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  perfilForm: FormGroup | any;
  name: string | any;
  email: string | any;
  city: string | any;
  farm: string | any;

  constructor(private fb: FormBuilder, private userSerivce: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {

    this.sessionService.getSession().subscribe((session: any) => {
      this.name = session.user.name;
      this.email = session.user.email;
      this.city = session.user.city;
      this.farm = session.user.farm;
    });

    this.perfilForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, Validators.required],
      city: [this.city, Validators.required],
      farm: [this.farm, Validators.required],
    });

  }

  onSubmit(): void {
    console.log(this.perfilForm.value);
  }

}
