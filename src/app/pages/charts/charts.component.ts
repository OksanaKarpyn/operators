import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart, { registerables } from 'chart.js/auto';
Chart.register(...registerables);
import { SalesData } from '../../models/salesdata';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [RouterLink,CommonModule,JsonPipe],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent {
  chart: any = [];
  salesdata :SalesData[]=[];
  constructor(){
     
  }


  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

}
