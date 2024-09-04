import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
