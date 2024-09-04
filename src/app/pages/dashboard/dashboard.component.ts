import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule, JsonPipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { UsersComponent } from '../users/users.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartsComponent } from '../charts/charts.component';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    JsonPipe,
    RouterLink,
  
    UpperCasePipe,
    UsersComponent,
    ChartsComponent
    
  ],
})
export class DashboardComponent implements OnInit {

  user: User | undefined;
  isDarkTheme = false;

  constructor(
    //private userSevice:UserService,
    private themeService:ThemeService,
    private route:ActivatedRoute
   ) {

    route.data.subscribe(data=>{
      this.user = data['profile'];
      // ['profile'] si refersce al mio resovler dento le rotte
      //  grazie a quello ottiene i dati da user service
    })
   }

  ngOnInit(): void {
    // this.userSevice.profile$.subscribe(userData => {
    //   this.user = userData;
    // });

    //------theme-------
    this.themeService.theme$.subscribe(theme =>{
      this.isDarkTheme = theme === 'dark-theme';
    })
  }
}
