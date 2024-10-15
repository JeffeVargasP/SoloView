import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm?: FormGroup | any;
  passwordFieldType: string | any  = 'password';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['visitante@visitante', [Validators.required, Validators.email]],
      password: ['123456', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login(): void {

    if (this.loginForm.valid) {
      const email = this.loginForm!.get('email')!.value;
      const password = this.loginForm!.get('password')!.value;

      this.userService.login(email, password).subscribe((res: any) => {
        if (res.token) {
          this.sessionService.setSession(res);
          window.location.href = '/geral';
        }
      });
    }
  }

}
