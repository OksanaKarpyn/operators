import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    JsonPipe, 
    RouterLink,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: Array<User> = [];
  //paginaton
    page: number = 1;

  filteredUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  searchValueInput: string = '';

  canViewRegisterButton: boolean = false;
  canViewEditButton: boolean = false;
  canViewDeleteButton : boolean = false;
  user?: User |undefined;
  isDarkTheme: boolean = false;


  totalRecords?:number;

  constructor(
    private userService: UserService,
    private themeService:ThemeService
  ) {

  }
  ngOnInit():void{
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
        this.filteredUsers.next(this.users);// inizializza la lista filtrata con tutti utenti 
              },
      error: (err) => {
        console.error(err.massege);
      },
    });
  
    this.userService.profile$.subscribe({
        
      next:(user)=>{
        this.user = user;
        this.updateButtonVisibility(); // Aggiorna la visibilità dei pulsanti
        
      },
      error:(err)=>{
        console.error(err.message);
      }
    });
   //---------------theme-------
     this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark-theme';
     });

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


  updateButtonVisibility():void {
    if(this.user){
      const visibility = this.userService.getButtonVisibility(this.user.role);
      this.canViewRegisterButton = visibility.canViewRegisterButton;
      this.canViewEditButton = visibility.canViewEditButton;
      this.canViewDeleteButton = visibility.canViewDeleteButton;
    }
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
  //   // users find by index
  //   //if index exist
  //   //user.splice(idx,1);
  }
}
