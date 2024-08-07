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

  constructor(private operatorsService:OperatorsService,private router: Router){}
  
  ngOnInit():void{
    this.isAuthenticated= this.operatorsService.isAuthenticated();

  }
  logout(): void {
    this.operatorsService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

}
