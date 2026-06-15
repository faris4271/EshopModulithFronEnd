import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [RouterLink],
})
export class NavbarComponent {
  @Input() pageTitle = 'Dashboard'; 

  private authService=inject(AuthService)

   isLogged = this.authService.IsLoggedin;
   currentUser = this.authService.currentUser;
   private router=inject(Router)
  
  
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log('Search:', value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
