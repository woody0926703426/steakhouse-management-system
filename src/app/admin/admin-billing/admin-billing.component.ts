import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-billing',
  templateUrl: './admin-billing.component.html'
})
export class AdminBillingComponent {
  // 1. รับข้อมูลออเดอร์มาจากตัวแม่
  @Input() orders: any[] = [];
  
  // 2. ส่งคำสั่งพิมพ์กลับไปให้แม่จัดการ (เพราะ Logic jsPDF อยู่ที่แม่)
  @Output() onPrint = new EventEmitter<any>();
  
  searchTable: string = '';

  // 3. ฟังก์ชันกรองข้อมูล (ถ้าไม่ใส่เลขโต๊ะ ให้โชว์ทั้งหมด)
  get filteredOrders() {
    if (!this.orders) return []; // ป้องกันกรณีข้อมูลยังไม่มา
    
    let filtered = this.orders;

    if (this.searchTable) {
      filtered = filtered.filter(o => o.tableId.toString() === this.searchTable.toString());
    }

    // เรียงให้ออเดอร์ใหม่ล่าสุดอยู่บนสุดเสมอ
    return filtered;
  }
}