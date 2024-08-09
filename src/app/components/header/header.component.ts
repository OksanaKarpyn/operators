import { Component } from '@angular/core';
import { JsonPipe,CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OperatorsService } from '../../services/operators.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [JsonPipe,RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated = false;
  currentOperatorId?: string | null = null;
  
  constructor(private operatorsService:OperatorsService,private router: Router){}
  
  
  ngOnInit():void{
    this.isAuthenticated= this.operatorsService.isAuthenticated();
    this.operatorsService.getCurrentOperator().subscribe(operator => {
      if (operator) {
        this.currentOperatorId = operator.id// Memorizza l'ID dell'operatore loggato
      }
    });

  }
  logout(): void {
    this.operatorsService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

}
