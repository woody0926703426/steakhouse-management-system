import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalProjectComponent } from './page/modal-project/modal-project.component';
import { ReserveComponent } from './page/reserve/reserve.component';
import { HomeComponent } from './page/home/home.component';
import { AdminComponent } from './page/admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminMenuManagementComponent } from './admin/admin-menu/admin-menu.component';
import { AdminBillingComponent } from './admin/admin-billing/admin-billing.component';
import { AdminKitchenComponent } from './admin/admin-kitchen/admin-kitchen.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'reserve', component: ReserveComponent},
  {path:'admin/dashboard', component: AdminDashboardComponent},
  {path:'admin/menu', component: AdminMenuManagementComponent},
  {path:'admin/billing', component: AdminBillingComponent},
  {path:'admin/kitchen', component: AdminKitchenComponent},
  {path:'admin', component: AdminComponent},
  {path:'**', redirectTo:''},
  {path:'Modal', component: ModalProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
