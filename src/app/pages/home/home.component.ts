import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OperatorsService } from '../../services/operators.service';
import { Operator } from '../../models/operator';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  operators: Array<Operator> = [];
  constructor(private operatorService: OperatorsService) {
    operatorService.getAllOpreators().subscribe({
      next: (dataOperarors) => {
        this.operators = dataOperarors;
      },
      error: (err) => {
        console.error(err.message);
      }
    })
  }


}
