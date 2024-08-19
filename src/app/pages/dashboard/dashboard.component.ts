import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CommonModule, JsonPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    JsonPipe,
    UpperCasePipe
  ],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  constructor(private authservice: AuthService,private userSevice:UserService) {}

  ngOnInit(): void {
    this.userSevice.getCurrentUser().subscribe(userData => {
      this.user = userData;
    });
  }
}
