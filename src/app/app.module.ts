import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalProjectComponent } from './page/modal-project/modal-project.component';
import { ReserveComponent } from './page/reserve/reserve.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HomeComponent } from './page/home/home.component';
import { AdminComponent } from './page/admin/admin.component';
import { AdminBillingComponent } from './admin/admin-billing/admin-billing.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminKitchenComponent } from './admin/admin-kitchen/admin-kitchen.component';
import { AdminMenuManagementComponent } from './admin/admin-menu/admin-menu.component';

const firebaseConfig = {
  apiKey: "AIzaSyDUpZS8A-gErLgoCvjqAFRoRgxsNaJgBJo",
  authDomain: "my-steak-house.firebaseapp.com",
  projectId: "my-steak-house",
  storageBucket: "my-steak-house.firebasestorage.app",
  messagingSenderId: "1003469871030",
  appId: "1:1003469871030:web:00454ce55439b231129317",
  measurementId: "G-RPE1WEY33M"
};

const app = initializeApp(firebaseConfig);
const analytice = getAnalytics(app);

@NgModule({
  declarations: [
    AppComponent,
    ModalProjectComponent,
    ReserveComponent,
    HomeComponent,
    AdminComponent,
    AdminBillingComponent,
    AdminDashboardComponent,
    AdminKitchenComponent,
    AdminMenuManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
