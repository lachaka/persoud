import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  private authSub: Subscription | undefined;
  searchFile: string;

  @Output() messageEvent = new EventEmitter<string>();

  constructor(private authService: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onSubmit() {
    this.messageEvent.emit(this.searchFile);
  }

  logout() {
    this.authSub = this.authService.logout().subscribe((res: any) => {
      if (res.success) {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
