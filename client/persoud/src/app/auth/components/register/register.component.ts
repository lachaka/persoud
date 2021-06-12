import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: { [key: string]: string };
  registerSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router
  ) {
    this.user = {};
  }

  ngOnInit(): void { }

  onSubmit() {
    this.registerSub = this.authService
      .register(this.user.email, this.user.password)
      .subscribe((res: any) => {
        if (res.success) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  ngOnDestroy() {
    if (this.registerSub) {
      this.registerSub.unsubscribe();
    }
  }
}
