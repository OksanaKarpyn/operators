import { Component} from '@angular/core';
import { Operator } from '../../models/operator';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink ,Router} from '@angular/router';
import { OperatorsService } from '../../services/operators.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  operator: Operator | null = null; 

  constructor(private route: ActivatedRoute,private router: Router , private operatorsService: OperatorsService) {}

  // ngOnInit(): void {
  //   const operatorId = this.route.snapshot.paramMap.get('id');
  //   if (operatorId) {
  //     this.operatorsService.getOperatorById(operatorId).subscribe(operator => {
  //       this.operator = operator;
  //     });
  //   }
  // }

  logout(): void {
    this.operatorsService.logout();
    this.router.navigate(['/login']);
  }

}
