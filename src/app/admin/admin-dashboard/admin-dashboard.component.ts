import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {
  @Input() tables: any[] = [];
  @Input() dailySales: number = 0;
  @Input() totalVat: number = 0;
  @Input() netSales: number = 0;

  @Output() onRelease = new EventEmitter<number>();

  @Output() onNavigate = new EventEmitter<string>();

  // ฟังก์ชันนับโต๊ะว่าง (เพื่อให้ตัวเลขบน Card สีเขียวขึ้น)
  getAvailableTables(): number {
    return this.tables.filter(t => t.isAvailable).length;
  }
}