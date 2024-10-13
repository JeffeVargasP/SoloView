import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm?: FormGroup | any;
  passwordFieldType: string | any;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  register(): void {

    if (this.registerForm.valid) {
      const name = this.registerForm!.get('nome')!.value;
      const email = this.registerForm!.get('email')!.value;
      const password = this.registerForm!.get('senha')!.value;

      this.userService.register(name, email, password).subscribe((res: any) => {
        if (res.message === 'User created') {
          window.location.href = '/login';
        }
      });

    }
  }

}
