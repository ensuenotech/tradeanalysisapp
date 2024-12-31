import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { InnerNavbarComponent } from '../inner-navbar/inner-navbar.component';
import { InnerComponent } from './inner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UploadersComponent } from '../uploaders/uploaders.component';
import { TradeAnalysisComponent } from '../trade-analysis/trade-analysis.component';
import { JournalComponent } from '../journal/journal.component';
import { PositionFormModalComponent } from '../position-form-modal/position-form-modal.component';
import { TradeFormModalComponent } from '../trade-form-modal/trade-form-modal.component';
const routes: Routes = [
  { path: "dashboard", component:DashboardComponent , title:"Dashboard" },
  
{ path: "dashboard/:section", component: DashboardComponent },
  // { path: "users", component: UsersComponent, title:"Users" },
  // { path: "admin-orders", component: ExchangeOrdersComponent, title:"Admin Orders" },
  // { path: "orders", component: OrdersComponent, title:"Orders" },
  // { path: "dashboard/:section", component: DashboardComponent },
  // { path: "", component: TradeComponent, title:"Trade" },
  // { path: "all-positions", component: AllPositionsComponent, title:"All Positions" },
  // { path: "all-positions-symbolwise", component: AllPositionsSymbolwiseComponent, title:"All Positions Symbolwise" },
  // { path: "all-positions-userwise", component: AllPositionsUserwiseComponent, title:"All Positions Userwise" },
  { path: "uploaders", component: UploadersComponent, title:"uploaders" },
  { path: "trade-analysis", component: TradeAnalysisComponent, title:"Trade Analysis" },
  { path: "journals", component: JournalComponent, title:"Journals" },
 
  // { path: "positions-normal", component: PositionsNormalComponent, title:"Positions Normal" },
  // { path: "payouts", component: PayoutsComponent, title:"Payouts" }
  ];

  const matModules = [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressBarModule,
  ];
  
@NgModule({
  declarations: [
    InnerComponent,
    DashboardComponent,
    InnerNavbarComponent,
    UploadersComponent,
    PositionFormModalComponent,
    TradeFormModalComponent,
    JournalComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    matModules
  ]
})
export class InnerModule { }
