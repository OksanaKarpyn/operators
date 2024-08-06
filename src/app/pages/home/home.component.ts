import { Component } from '@angular/core';
import { Operator } from '../../models/operator';
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
  operators: Array<Operator> = [];

  constructor(private operatorsService:OperatorsService) {
    operatorsService.getOperators().subscribe({
      next: (dataOperators)=>{
        console
        this.operators = dataOperators
      },
      error: (err) => {
        console.error(err.massege);
      },
    })
  }

}
