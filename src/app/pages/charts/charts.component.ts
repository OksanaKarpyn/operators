import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart, { registerables } from 'chart.js/auto';
Chart.register(...registerables);
import { SalesData } from '../../models/salesdata';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [RouterLink,CommonModule,JsonPipe],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  chart: any = [];
  salesdata :SalesData[]=[];
  labeldata: number[]=[];
  realdata: number[]=[];
  colordata:string[]=[];
  constructor(private chartService:ChartService){}

  ngOnInit(){
   this.chartData(); 
  }
  chartData(){
    this.chartService.getSalesData().subscribe(itemData=>{
      this.salesdata = itemData;
      if(this.salesdata != null){
        this.salesdata.map(elem =>{
          this.labeldata.push(elem.year);
          this.realdata.push(elem.amount);
          this.colordata.push(elem.colorcode);
        })
        this.renderChart(this.labeldata,this.realdata,this.colordata);
      }
    })
  }

  //function for rendering chart

  renderChart(labeldata:any,realdata:any,colordata:any){
    const myChart = new Chart('barchart',{
      type: 'bar',
        data:{
          labels:labeldata,
          datasets:[
            {
              data:realdata,
              backgroundColor:colordata

            }
          ]

      },
      options:{
        scales:{
          y:{
            beginAtZero:true,
          }
        }
      }
    })

  }

  // ngOnInit() {
  //   this.chart = new Chart('canvas', {
  //     type: 'bar',
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [
  //         {
  //           label: '# of Votes',
  //           data: [12, 19, 3, 5, 2, 3],
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

}
