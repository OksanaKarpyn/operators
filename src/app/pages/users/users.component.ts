import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: Array<User> = [];

  constructor(private userService: UserService) {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
      },
      error: (err) => {
        console.error(err.massege);
      },
    });
  }

  deleteUser(id?: string) {
    //service.delete user by id
    console.log('delete', id);
    if (id) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
        },
        error: (err) => {
          console.error('Error deleting user', err);
        },
      });
  }
  //   // users find by index
  //   //if index exist
  //   //user.splice(idx,1);
  }
}
