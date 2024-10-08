import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, JsonPipe, UpperCasePipe } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-details-user',
  standalone: true,
  imports: [
    RouterLink,
    UpperCasePipe,
    JsonPipe,
    CommonModule
  ],
  templateUrl: './details-user.component.html',
  styleUrl: './details-user.component.scss'
})
export class DetailsUserComponent implements OnInit {
  user!:User;
  isDarkTheme :boolean = false;
  constructor(
    private route:ActivatedRoute,
    private userService:UserService,
    private themeService:ThemeService
  ){
    const id = route.snapshot.paramMap.get('id');
    if(id){
      this.userService.getUserById(id).subscribe({
        next:(userData)=>{
          console.log(userData);
          this.user = userData;
        }
      })
    }
  }
  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme=>{
      this.isDarkTheme = theme === 'dark-theme';
    })
  }
}
