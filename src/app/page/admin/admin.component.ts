import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { thaiFont } from '../../shared/fonts/THSarabun-normal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentTab: string = 'dashboard';


  adminMenuItems: any[] = [];
  tables: any[] = [];
  orders: any[] = [];
  dailySales: number = 0;
  totalVat: number = 0;
  netSales: number = 0;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    // 1. ดึงข้อมูลโต๊ะ (เพื่อให้เลข 20 โต๊ะกลับมา)
    this.db.list('tables').valueChanges().subscribe((res: any[]) => {
      this.tables = res || [];
    });

    // 2. ดึงข้อมูลออเดอร์ (เพื่อให้ Kitchen Monitor ทำงาน)
    // ใช้ snapshotChanges เพื่อให้ได้ Key ของ Firebase มาใช้สั่ง Update สถานะ
    this.db.list('orders').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => ({ key: a.key, ...(a.payload.val() as any) }))
      )
    ).subscribe(res => {
      // เอาเฉพาะออเดอร์ที่ยังไม่จ่ายเงิน หรือโชว์ย้อนหลัง 10 รายการล่าสุด
      this.orders = res.reverse(); 
    });
    // เพิ่มการคำนวณยอดขายจากออเดอร์
    this.db.list('orders').valueChanges().subscribe((allOrders: any[]) => {
    this.calculateSales(allOrders);
  });

  this.db.list('menuItems').snapshotChanges().pipe(
    map(actions => 
      actions.map(a => ({ key: a.key, ...(a.payload.val() as any) }))
    )
  ).subscribe(res => {
    this.adminMenuItems = res;
    // หากใน Firebase ยังไม่มีเมนู ให้สร้างเมนูตั้งต้น (Run ครั้งแรกครั้งเดียว)
    if (this.adminMenuItems.length === 0) {
      this.initDefaultMenus();
    }
  });
  }

  // ฟังก์ชันอัปเดตสถานะอาหาร (กดปุ่มเขียวแล้วเปลี่ยนสถานะ)
  updateOrderStatus(orderKey: string) {
    this.db.object(`orders/${orderKey}`).update({ status: 'completed' });
  }

  // ลบออเดอร์ (ปุ่มถังขยะ)
  deleteOrder(orderKey: string) {
    if(confirm('ลบรายการนี้ใช่หรือไม่?')) {
      this.db.list('orders').remove(orderKey);
    }
  }

  forceRelease(tableId: number) {
    if (confirm(`คืนโต๊ะที่ ${tableId}?`)) {
      this.db.object(`tables/${tableId - 1}`).update({ isAvailable: true });
    }
  }

  resetAll() {
    if (confirm('รีเซ็ตทุกโต๊ะ?')) {
      const resetData = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, isAvailable: true }));
      this.db.object('tables').set(resetData);
    }
  }

  calculateSales(allOrders: any[]) {
    // กรองเอาเฉพาะออเดอร์ที่เสิร์ฟ/จ่ายเงินแล้ว (completed)
    const validOrders = allOrders || [];
  
    //  คำนวณยอดรวมอาหารทั้งหมด (Sub-total)
    this.dailySales = validOrders.reduce((total, order) => {
      const orderSum = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      return total + orderSum;
    }, 0);

    //  คำนวณ VAT 7%
    this.totalVat = this.dailySales * 0.07;

    // 3. ยอดขายสุทธิ (Grand Total)
    this.netSales = this.dailySales + this.totalVat;
  }


  // ฟังก์ชันสร้างเมนูตั้งต้นใน Firebase
  initDefaultMenus() {
    const defaultMenus = [
      { name: 'สเต็กไก่สไปซี่', price: 89, isAvailable: true, image: 'https://e.lnwfile.com/_/e/_raw/on/2f/hz.jpg' },
      { name: 'สเต็กหมูพริกไทยดำ', price: 119, isAvailable: true, image: 'https://food.mthai.com/app/uploads/2013/06/11.jpg' },
      { name: 'ทีโบนสเต็ก', price: 259, isAvailable: true, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJNWPKNdelu-6LsFoklHCxonqQLwEiyPF4nQ&s' },
      { name: 'ฟิซแอนด์ชิพส์', price: 129, isAvailable: true, image: 'https://media.istockphoto.com/id/1178035212/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%9D%E0%B8%A3%E0%B8%B1%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%AD%E0%B8%94%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%94%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A4%E0%B8%A9%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%96%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B8%9A%E0%B8%94%E0%B8%8B%E0%B8%AD%E0%B8%AA%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%A2%E0%B9%87%E0%B8%99-%E0%B9%86.jpg?s=612x612&w=0&k=20&c=O2cJTB2vlS21PB7Z09w69MVTPGn_jIbU_gI_jjzi4g4=' },
    
    
    
    ];
    defaultMenus.forEach(item => this.db.list('menuItems').push(item));
  }

  // ฟังก์ชันเปลี่ยนราคา
  updatePrice(key: string) {
    const newPrice = prompt('กรุณาใส่ราคาใหม่:');
    if (newPrice && !isNaN(Number(newPrice))) {
      this.db.object(`menuItems/${key}`).update({ price: Number(newPrice) });
    }
  }

  // ฟังก์ชันเปิด-ปิดเมนู (กรณีของหมด)
  toggleMenuStatus(key: string, currentStatus: boolean) {
    this.db.object(`menuItems/${key}`).update({ isAvailable: !currentStatus });
  }

  // เพิ่มฟังก์ชันสำหรับปุ่ม "เพิ่มเมนูใหม่"
  addNewMenu() {
    const name = prompt("ชื่อเมนูใหม่:");
    const price = prompt("ราคา:");
    const image = prompt("ลิงก์รูปภาพ (URL):");

    if (name && price && image) {
      this.db.list('menuItems').push({
        name: name,
        price: Number(price),
        image: image,
        isAvailable: true
      }).then(() => {
        alert('เพิ่มเมนูสำเร็จ!');
      });
    }
  }

    // เพิ่มฟังก์ชันแก้ไขรูปภาพ
  editImage(key: string) {
    const newImageUrl = prompt("วางลิงก์รูปภาพใหม่ที่นี่ (URL):");
    if (newImageUrl) {
      this.db.object(`menuItems/${key}`).update({ image: newImageUrl });
    }
  }

  printOrderReceipt(order: any) {
    const doc = new jsPDF();

    // 1. ลงทะเบียน Font ภาษาไทย
    doc.addFileToVFS('THSarabun.ttf', thaiFont);
    doc.addFont('THSarabun.ttf', 'THSarabun', 'normal');
    doc.setFont('THSarabun');

    // 2. หัวเอกสาร
    doc.setFontSize(20);
    doc.text('ใบเสร็จรับเงิน', 105, 20, { align: 'center' });
  
    doc.setFontSize(14);
    doc.text(`โต๊ะที่: ${order.tableId}`, 20, 30);
    doc.text(`เลขที่ออเดอร์: ${order.key}`, 20, 37);
    doc.text(`วันที่: ${new Date().toLocaleString('th-TH')}`, 20, 44);

    // 3. ดึงรายการอาหารจากออเดอร์นั้นๆ
    const head = [['รายการ', 'ราคา', 'จำนวน', 'รวม']];
    const data = order.items.map((item: any) => [
      item.name,
      `${item.price} ฿`,
      item.quantity,
      `${(item.price * item.quantity).toFixed(2)} ฿`
    ]);

    // 4. สร้างตาราง
    autoTable(doc, {
      head: [['รายการ', 'ราคา', 'จำนวน', 'รวม']],
      body: data,
      startY: 50,
      styles: { font: 'THSarabun', fontSize: 14 },
      headStyles: { 
        font: 'THSarabun',
        fontStyle: 'normal',
        fillColor: [52, 58, 64],
        halign: 'center'
       }, // สีเทาเข้มแบบ Admin

    });

    // 5. คำนวณยอดสรุป (ใช้ Logic เดียวกับหน้าลูกค้า)
    const subTotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const vat = subTotal * 0.07;
    const grandTotal = subTotal + vat;

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`ยอดรวม: ${subTotal.toFixed(2)} ฿`, 140, finalY);
    doc.text(`ภาษี VAT 7%: ${vat.toFixed(2)} ฿`, 140, finalY + 7);
    doc.setFontSize(16);
    doc.text(`ยอดสุทธิ: ${grandTotal.toFixed(2)} ฿`, 140, finalY + 16);

    // 6. สั่งพิมพ์หรือดาวน์โหลด
    // .save() จะเป็นการดาวน์โหลดไฟล์
    // .output('dataurlnewwindow') จะเป็นการเปิดหน้าต่าง Print ของ Browser ขึ้นมาทันที
    doc.output('dataurlnewwindow'); 
  }

}