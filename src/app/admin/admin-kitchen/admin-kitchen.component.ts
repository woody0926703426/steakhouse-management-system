import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-kitchen',
  templateUrl: './admin-kitchen.component.html'
})
export class AdminKitchenComponent {
  @Input() orders: any[] = [];
  
  @Output() onUpdateStatus = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  // กรองเฉพาะออเดอร์ที่ยังไม่ได้เสิร์ฟ หรือออเดอร์ล่าสุด
  get activeOrders() {
    return this.orders; 
  }
}