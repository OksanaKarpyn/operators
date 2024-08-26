import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeTheme: string = 'light-theme';

  constructor() { }
  setTheme(theme:string) {
    this.activeTheme = theme;
    document.body.className = theme;
  }
  getTheme(): string {
    return this.activeTheme;
  }
}
