import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('light-theme');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('app-theme') || 'light-theme';
    this.themeSubject.next(savedTheme);
    this.applyTheme(savedTheme)
  }
 


 setTheme(theme: string): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('app-theme', theme);
  }

  getTheme(): string {
    return this.themeSubject.value;
  }

  private applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(theme);
  }
}
