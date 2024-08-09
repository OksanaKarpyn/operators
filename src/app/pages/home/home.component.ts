import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OperatorsService } from '../../services/operators.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private operatorService:OperatorsService){}


}
