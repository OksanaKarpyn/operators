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
  salesdata :SalesData[]=[];
  labeldata: number[]=[];
  realdata: number[]=[];
  colordata:string[]=[];
  constructor(
    private chartService:ChartService,
  ){}

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
        this.renderBarChart(this.labeldata,this.realdata,this.colordata);
        this.renderPieChart(this.labeldata,this.realdata,this.colordata);
        this.renderDoughnutChart(this.labeldata,this.realdata,this.colordata);
        this.renderLineChart(this.labeldata,this.realdata,this.colordata);
        this.renderRadarChart(this.labeldata,this.realdata,this.colordata);
      }
    })
  }

//------------barchart----------
  renderBarChart (labeldata:any,realdata:any,colordata:any){
    this.renderChart(labeldata,realdata,colordata,'barchartId', 'bar')
   }
//------------piechart------------
   renderPieChart (labeldata:any,realdata:any,colordata:any){
    this.renderChart(labeldata,realdata,colordata,'piechartId', 'pie')
   }

//--------doughnutchart-----------

renderDoughnutChart(labeldata:any,realdata:any,colordata:any ){
  this.renderChart(labeldata,realdata,colordata,'doughnutchartId', 'doughnut');
}

//------------linechart-------------------
 renderLineChart( labeldata:any,realdata:any,colordata:any ){
  this.renderChart(labeldata,realdata,colordata,'linechartId', 'line')
 }


 //------------radarchart---------------------
 renderRadarChart ( labeldata:any,realdata:any,colordata:any) {
  this.renderChart(labeldata,realdata,colordata,'radarChartId','radar')
 }



  //function for rendering chart

  renderChart(labeldata:any,realdata:any,colordata:any,chartid:string,charttype:any){
    const myChart = new Chart(chartid,{
      type: charttype,
        data:{
          labels:labeldata,
          datasets:[
            {
              label:'salesData',
              data:realdata,
              backgroundColor:colordata,

            }
          ]

      },
      options:{
        responsive:true,
        animation: {
          duration: 2000, // Duration of animations in milliseconds
          easing: 'easeInOutQuad', // Easing function for the animations
          
        },
        
        scales:{
          y:{
            beginAtZero:true,
            ticks: {
              stepSize: 1000 // Step size for the y-axis ticks
            }
          }
        }
      }
    })

  }
}
