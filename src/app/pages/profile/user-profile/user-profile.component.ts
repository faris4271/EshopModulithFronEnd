import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FullImageUrlPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
