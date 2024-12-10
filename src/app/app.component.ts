import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tradeanalysisapp';
  constructor(private authService:AuthService, private router:Router) {
    this.authService.refreshToken().subscribe(()=>{
    },() => {
      localStorage.removeItem("userToken");
    this.router.navigate([""]);
     })
  }
}
