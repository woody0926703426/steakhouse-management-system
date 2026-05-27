import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router){}

  goToAdmin() {
    const password = prompt("กรุณาใส่รหัสผ่าน Admin ");
    if (password === '1234'){
      this.router.navigate(['/admin']);
    }else{
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  }
}


