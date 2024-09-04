import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { RolePipe } from '../../pipes/role.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    JsonPipe, 
    RouterLink,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RolePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  users: User[] = [];
  //---pagination-----
    page = 1;
    totalRecords?:number;

  filteredUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  searchValueInput = '';
  user?: User |undefined;

//---role---

canEdit = false;
userRole = false; 
canRegister = false;
canView = false
currentUserRole?: User | undefined;

  constructor(
    private userService: UserService,
  ) {
   
  }

  ngOnInit():void{
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
        this.filteredUsers.next(this.users);
              },
      error: (err) => {
        console.error(err.massege);
      },
    });
  
    this.userService.profile$.subscribe({ 
      next:(user)=>{
        this.user = user;
        if(user){
          this.canRegister =  this.userService.hasRole1(['admin'])
          this.canEdit = this.userService.hasRole1(['admin','operator'])
        }
      },
      error:(err)=>{
        console.error(err.message);
      }
    }); 


    //-------role------
    this.userService.profile$.subscribe({
      next:(role)=>{
        this.currentUserRole = role;
      }, error: (err) => {
        console.error('Error user role:', err);
      }
    })

  //   this.userService.hasRole(['admin']).subscribe({
  //     next:(admin)=>{
  //       this.isAdmin = admin;
  //       this.userRole = admin;
  //     },
  //     error:(err)=>{
  //       console.error(err);
  //       this.canEdit= false;
  //       this.userRole = false
  //     }
  //   });
   
  // this.userService.hasRole(['admin','operator']).subscribe({
  //   next:(canEdit)=>{
  //     this.canEdit= canEdit;
  //   },
  //   error:(err)=>{
  //     console.error(err);
  //     this.canEdit= false;
  //   }
  // });

  // this.canEdit = this.userService.hasRole1(['admin','operator'])
  // this.isAdmin = this.userService.hasRole1(['admin'])
  }
  
  //bottone search users
  onSearchChange(): void {
    this.filteredUsers.next(this.applyFilter(this.searchValueInput));
  }
   // Applicare il filtro agli utenti
   applyFilter(term: string): User[] {
    if (!term.trim()) {
      return this.users;
    }
    return this.users.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase())
    );
  }

   // mi serve per acedere  al userService.canDeleteUser xke userServicee private  
   canDeleteUser(id: string): boolean {
    if(!id){
      return false
    }
    return this.userService.canDeleteUser(id, this.user);
  }

  deleteUser(id?: string) {
    //service.delete user by id
    console.log('delete', id);
    if (id && this.canDeleteUser(id)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
          this.filteredUsers.next(this.applyFilter(this.searchValueInput));
        },
        error: (err) => {
          console.error('Error deleting user', err);
        },
      });
    }else{
      console.warn('Non puoi cancellare te stesso non hai permesso');
    }
  }
}
