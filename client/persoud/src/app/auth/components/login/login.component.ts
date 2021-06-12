import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginSub: Subscription | undefined;
  user: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.loginSub = this.authService
      .login(this.user.email, this.user.password)
      .subscribe((res: any) => {
        if (res.success) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  signUp() {
    this.router.navigateByUrl('/register');
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
