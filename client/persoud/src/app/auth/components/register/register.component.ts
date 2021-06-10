import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: { [key: string]: string };
  registerSub: Subscription | undefined;

  constructor(private authService: AuthService) {
    this.user = {};
  }

  ngOnInit(): void {}

  onSubmit() {
    this.registerSub = this.authService
      .register(this.user.email, this.user.password)
      .subscribe((res) => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    if (this.registerSub) {
      this.registerSub.unsubscribe();
    }
  }
}
