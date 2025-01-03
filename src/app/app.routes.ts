import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { TradeAnalysisComponent } from './trade-analysis/trade-analysis.component';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';
import { InnerComponent } from './inner/inner.component';
export const routes: Routes = [


{
    path: "",
    redirectTo:'login',
    pathMatch: "full",
  },
  {
    path: "login",
    component:LoginComponent,
  },
  {
    path: "register",
    component:RegisterComponent,
  },
  // {
  //   path:'tradeAnalysis',
  //   component: TradeAnalysisComponent,
    
  // },
  { path: "dashboard", redirectTo: "trade/dashboard", pathMatch: "full" },
// { path: "**", redirectTo: "", pathMatch: "full" },
{
  path: 'trade',
  component:InnerComponent,
  loadChildren: () => import('./inner/inner.module').then(m => m.InnerModule)
},
  
];