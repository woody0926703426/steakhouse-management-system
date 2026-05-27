import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html'
})
export class AdminMenuManagementComponent {
  @Input() menuItems: any[] = [];

  @Output() onUpdatePrice = new EventEmitter<string>();
  @Output() onToggleStatus = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEditImage = new EventEmitter<string>();
}