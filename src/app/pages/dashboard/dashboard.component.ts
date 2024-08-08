import { Component, OnInit } from '@angular/core';
import { OperatorsService } from '../../services/operators.service';
import { Operator } from '../../models/operator';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    
    CommonModule,

  ],
})
export class DashboardComponent implements OnInit {
  operator: Operator | null = null;

  constructor(private operatorsService: OperatorsService) {}

  ngOnInit(): void {
    this.operatorsService.getCurrentOperator().subscribe(operator => {
      this.operator = operator;
    });
  }
}
