import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  operators: Array<User> = [];
  constructor(private operatorService: AuthService) {
  
  }


}
