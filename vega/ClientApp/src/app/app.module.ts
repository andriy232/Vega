import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, BrowserXhr } from '@angular/http';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import * as Sentry from '@sentry/browser';
import { JwtModule } from "@auth0/angular-jwt";

import { AdminAuthGuardService } from './services/AdminAuthGuardService';
import { AuthGuardService } from './services/AuthGuardService';
import { VehicleService } from "./services/VehicleService";
import { PhotoService } from "./services/PhotoService";
import { AuthService } from "./services/AuthService";

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import { PaginationComponent } from './shared/pagination.component';
import { AppErrorHandler } from './app.error-handler';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AdminComponent } from './admin/admin.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

Sentry.init({
  dsn: "https://0df0c7e86716463891cfe42dffb9130b@sentry.io/1878365"
});

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    VehicleFormComponent,
    VehicleListComponent,
    PaginationComponent,
    ViewVehicleComponent,
    ViewProfileComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ToastyModule.forRoot(),
    MatTabsModule,
    MatNativeDateModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:5001"]
      }
    }),
    RouterModule.forRoot([
      { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/edit/:id', component: VehicleFormComponent },
      { path: 'vehicles/:id', component: ViewVehicleComponent },
      { path: 'vehicles', component: VehicleListComponent },
      { path: 'profile', component: ViewProfileComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AdminAuthGuardService] }
    ])
  ],
  providers: [
    VehicleService,
    PhotoService,
    AuthService,
    AuthGuardService,
    AdminAuthGuardService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
