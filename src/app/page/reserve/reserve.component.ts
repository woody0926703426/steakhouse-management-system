import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// @ts-ignore
import { thaiFont } from '../../shared/fonts/THSarabun-normal';
import { Router } from '@angular/router';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;

}

interface Table {
  id: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {
  step: number = 1;
  selectedTable: number | null = null;
  paymentMethod: string = '';
  tables: Table[] = [];
  


  menuItems: MenuItem[] = [
    { id: 1, name: 'สเต็กไก่สไปซี่', price: 89, image: 'https://e.lnwfile.com/_/e/_raw/on/2f/hz.jpg', quantity: 0 },
    { id: 2, name: 'สเต็กหมูพริกไทยดำ', price: 119, image: 'https://food.mthai.com/app/uploads/2013/06/11.jpg', quantity: 0 },
    { id: 3, name: 'ทีโบนสเต็ก', price: 259, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJNWPKNdelu-6LsFoklHCxonqQLwEiyPF4nQ&s', quantity: 0 },
    { id: 4, name: 'ฟิชแอนด์ชิพส์', price: 129, image: 'https://media.istockphoto.com/id/1178035212/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%9D%E0%B8%A3%E0%B8%B1%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%AD%E0%B8%94%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%94%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A4%E0%B8%A9%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%96%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B8%9A%E0%B8%94%E0%B8%8B%E0%B8%AD%E0%B8%AA%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%A2%E0%B9%87%E0%B8%99-%E0%B9%86.jpg?s=612x612&w=0&k=20&c=O2cJTB2vlS21PB7Z09w69MVTPGn_jIbU_gI_jjzi4g4=', quantity: 0 },
    { id: 5, name: 'พอร์คชอป', price: 159, image: 'https://media.istockphoto.com/id/982391002/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B9%83%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%81%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B9%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%94-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%A3%E0%B8%B2%E0%B8%9A.jpg?s=612x612&w=0&k=20&c=fq-sIaNe4pc7y4mKFmnl7nKQGorftqmcKLqpK0-Um9Y=', quantity: 0 },
    { id: 6, name: 'สลัดผักรวม', price: 59, image: 'https://media.istockphoto.com/id/1337799015/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B5%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=e6OSI3ty4bEL4RP430hsB8r3pa3gobg8fTEp3kr8F58=', quantity: 0 },
    { id: 7, name: 'เฟรนช์ฟรายส์', price: 49, image: 'https://s359.kapook.com/pagebuilder/f6558105-e6e7-419b-a04d-edb108647bb1.jpg', quantity: 0 },
    { id: 8, name: 'ซุปข้าวโพด', price: 39, image: 'https://www.pholfoodmafia.com/wp-content/uploads/2021/03/6Sweet-Corn-Soup.jpg', quantity: 0 },
    { id: 9, name: 'สเต็กเนื้อริบอาย', price: 299, image: 'https://real-food.shop/cdn/shop/files/steak-angus-ribeye-ca-400g-684121.jpg?v=1726646665', quantity: 0 },
    { id: 10, name: 'ไส้กรอกเยอรมัน', price: 99, image: 'https://media-cdn.tripadvisor.com/media/photo-s/1c/85/53/cb/2-2-german-sausages-with.jpg', quantity: 0 },
  ];

 constructor(
    private db: AngularFireDatabase,
    private router: Router
  
  ) {}

  ngOnInit() {

  //  ดึงเมนูจาก Firebase แทนตัวแปรในเครื่อง
  this.db.list('menuItems').valueChanges().subscribe((res: any[]) => {
    if (res && res.length > 0) {
      // ดึงมาเฉพาะเมนูที่ Admin เปิดสถานะ 'พร้อมขาย' (isAvailable: true)
      this.menuItems = res.filter(m => m.isAvailable === true).map(m => {
        return {
          ...m,
          quantity: 0 // รีเซ็ตจำนวนสั่งเป็น 0 ทุกครั้งที่ดึงข้อมูลใหม่
        };
      });
    } else {
      // กรณีใน Firebase ยังไม่มีข้อมูลเลย (Node menuItems ว่าง) 
      // ระบบจะยังไม่แสดงอะไร ให้คุณไปกด "เพิ่มรายการอาหาร" ในหน้า Admin ก่อนครับ
    }
  });

    this.db.list<Table>('tables').valueChanges().subscribe((res) => {
      if (res && res.length > 0) {
        this.tables = res;
      } else {
        this.initTables();
      }
    });
  }

  initTables() {
    const initialTables: Table[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      isAvailable: true
    }));
    this.db.object('tables').set(initialTables);
  }

  selectTable(table: Table) {
    if (table.isAvailable) {
      this.selectedTable = table.id;
      this.step = 2;
    } else {
      alert('โต๊ะนี้ไม่ว่างครับ');
    }
  }

  updateQuantity(item: MenuItem, change: number) {
    if (item.quantity + change >= 0) {
      item.quantity += change;
    }
  }

  // คำนวณราคาก่อนภาษี
  get subTotalPrice() {
    return this.menuItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  }

  // คำนวณภาษี 7%
  get vatAmount() {
    return this.subTotalPrice * 0.07;
  }

  // ราคาสุทธิ
  get grandTotal() {
    return this.subTotalPrice + this.vatAmount;
  }

  selectPayment(method: string) {
    this.paymentMethod = method;
  
    if (method === 'cash') {
      // กรณีเงินสด: ขึ้น Alert และยังไม่ไป Step 5 จนกว่าจะยืนยัน
      alert('รับทราบครับ! พนักงานกำลังเดินทางไปรับเงินสดที่โต๊ะ ' + this.selectedTable + ' กรุณารอสักครู่ครับ');
    
      // ตรงนี้แนะนำว่าควรเรียกฟังก์ชัน confirmPayment() 
      // หรือให้ Admin เป็นคนกดอนุมัติ แต่ถ้าจะไป Step 5 เลยให้ใช้:
      // this.checkOut(); 
    } else if (method === 'qr') {
      // กรณี QR Code: ให้แสดงรูปภาพ QR Code ในหน้าจอ (ยังไม่ไป Step 5 ทันที)
      alert('ระบบกำลังเจนเนอเรท QR Code สำหรับยอดเงิน ' + this.grandTotal + ' บาท');
    }
  }

// ฟังก์ชันที่จะเรียกเมื่อชำระเงินเรียบร้อยจริงๆ
confirmPayment() {
  this.checkOut(); // ไปหน้า Step 5 เพื่อดาวน์โหลดใบเสร็จ
}



  confirmOrder() {
    if (this.subTotalPrice > 0) {
      // 1. สร้างก้อนข้อมูลออเดอร์
      const newOrder = {
        tableId: this.selectedTable,
        items: this.menuItems.filter(i => i.quantity > 0),
        status: 'pending', // สถานะ: กำลังรอทำ, กำลังทำ, เสร็จแล้ว
        timestamp: new Date().getTime()
      };

      // 2. ส่งไปที่ Firebase Node 'orders'
      this.db.list('orders').push(newOrder);

      // 3. ล็อกโต๊ะ และไปหน้าทานอาหาร
      this.db.object(`tables/${this.selectedTable! - 1}`).update({ isAvailable: false });
      this.step = 4;
    }
  }

  checkOut() {
    // 1. ล็อกยอดเงินและรายการอาหารครั้งสุดท้าย (Snapshot ไว้สำหรับใบเสร็จ)
    // 2. ปลดล็อกโต๊ะใน Firebase ทันที เพื่อให้ร้านรับลูกค้าใหม่ได้
    this.db.object(`tables/${this.selectedTable! - 1}`).update({ isAvailable: true });
  
    // 3. เปลี่ยนไป Step 5 (หน้าดาวน์โหลดใบเสร็จ)
    this.step = 5;
  }

  finishProcess() {
    // ปุ่มสำหรับปิดหน้าสุดท้ายเพื่อกลับไปหน้า Home
    this.resetProcess();
    this.router.navigate(['/']); 
  } 

  resetProcess() {
    this.step = 1;
    this.selectedTable = null;
    this.menuItems.forEach(i => i.quantity = 0);
  }

  downloadReceipt() {
    const doc = new jsPDF();
  
    // 1. เพิ่ม Font เข้าไปใน jsPDF
    // 'THSarabunNew.ttf' คือชื่อไฟล์อ้างอิง, 'ThaiFont' คือชื่อที่เราจะเรียกใช้
    doc.addFileToVFS('THSarabun.ttf', thaiFont);
    doc.addFont('THSarabun.ttf', 'THSarabun', 'normal');
  
    // 2. ตั้งค่าให้ใช้ Font นี้
    doc.setFont('THSarabun');

    // 3. เขียนหัวข้อ (ตอนนี้เขียนภาษาไทยได้แล้ว!)
    doc.setFontSize(22);
    doc.text('ใบเสร็จรับเงิน', 105, 20, { align: 'center' });
  
    doc.setFontSize(12);
    doc.text(`โต๊ะ: ${this.selectedTable}`, 20, 30);
    doc.text(`วันที่: ${new Date().toLocaleString()}`, 20, 37);

    // 2. สร้างตารางรายการอาหาร
    const head = [['รายการ', 'ราคา', 'จำนวน', 'รวม']];
    const data = this.menuItems
      .filter(item => item.quantity > 0)
      .map(item => [
        item.name, 
        `${item.price} B`, 
        item.quantity, 
        `${item.price * item.quantity} B`
      ]);

    autoTable(doc, {
      head: head,
      body: data,
      startY: 45,
      styles:{
        font: 'THSarabun',
        fontStyle: 'normal',
        fontSize: 12
      },
      headStyles: { fillColor: [220, 53, 69] } // สีแดงตามธีมร้าน
    });

    // 3. สรุปยอดเงิน (คำนวณด้านล่างตาราง)
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`ยอดรวม: ${this.subTotalPrice.toFixed(2)} B`, 140, finalY);
    doc.text(`ภาษี (7%): ${this.vatAmount.toFixed(2)} B`, 140, finalY + 7);
    doc.setFontSize(14);
    doc.text(`ยอดรวมสุทธิ: ${this.grandTotal.toFixed(2)} B`, 140, finalY + 15);

    // 4. บันทึกไฟล์
    doc.save(`Receipt_Table_${this.selectedTable}.pdf`);
  }



}