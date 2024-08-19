import { Component } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { JsonPipe, UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-details-user',
  standalone: true,
  imports: [
    RouterLink,
    UpperCasePipe,
    JsonPipe],
  templateUrl: './details-user.component.html',
  styleUrl: './details-user.component.scss'
})
export class DetailsUserComponent {
  user!:User;
  constructor(
    private route:ActivatedRoute,
    private userService:UserService
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
}
