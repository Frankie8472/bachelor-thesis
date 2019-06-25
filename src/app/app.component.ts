import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HashVenture';
  preImg = '/assets/hash.png';
  img = '/assets/hash.png';
  imgs = ['/assets/212.png', '/assets/211.png', '/assets/221.png', '/assets/212.png', '/assets/111.png'];
  clicked = 0;

  showImg() {
    this.img = '/assets/211.png';
    this.clicked = this.clicked + 1;
  }

  turnBackImg() {
    this.img = '/assets/hash.png';
  }

  switchImg() {
    if (this.img === '/assets/hash.png') {
      this.img = 'assets/211.png';
    } else {
      this.img = '/assets/hash.png';
    }
  }
}


