import { Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.css']
})
export class ModalProjectComponent {

  modalMessage: string = '';
  resultMessage: string = '';
  resultType: 'success' | 'warning' | '' = '';
  modal: any;

    openWelcome() {
    this.modalMessage = 'ยินดีต้อนรับเข้าสู่ระบบนักศึกษา';
  }

  // กดปุ่ม คุณแน่ใจหรือไม่
  openConfirm() {
    this.modalMessage = 'คุณต้องการดำเนินการต่อหรือไม่?';
  }

  openModal(message: string) {
    this.modalMessage = message;
    const el = document.getElementById('myModal');
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    
  }

  confirm() {
      if (this.modalMessage.includes('ยินดีต้อนรับ')) {
      this.resultMessage = 'เข้าสู่ระบบเรียบร้อยแล้ว';
      this.resultType = 'success';
    } else {
      this.resultMessage = 'คุณได้ยืนยันการดำเนินการแล้ว';
      this.resultType = 'warning';
    }
    this.modal.hide();
    
    
  }

  
}
